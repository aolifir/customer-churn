import logging
import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from customer_churn.data_access.memory_store import get_data, update_customer_outreach_status
from customer_churn.serializers.customer import CustomerSerializer
from churn_calculator.churncalc import MODEL_INFO_METADATA, calculate_churn_risk

logger = logging.getLogger('customer_churn')

STATE_NOT_CONTACTED = "NOT_CONTACTED"
STATE_IN_PROGRESS = "IN_PROGRESS"
STATE_RESOLVED = "RESOLVED"

VALID_TRANSITIONS = {
    STATE_NOT_CONTACTED: [STATE_IN_PROGRESS],
    STATE_IN_PROGRESS: [STATE_NOT_CONTACTED, STATE_RESOLVED],
    STATE_RESOLVED: [STATE_IN_PROGRESS]
}


@api_view(['GET'])
def customer_list_view(request):
    """API endpoint handling strict server-side pagination, scoring injection, and portfolio filtering."""
    try:
        df = get_data().copy()  # Core cache protection copy

        search_query = request.query_params.get('search', '').strip().lower()
        risk_filter = request.query_params.get('risk', 'All')
        status_filter = request.query_params.get('status', 'All')
        contract_filter = request.query_params.get('contract', 'All')

        try:
            page = max(1, int(request.query_params.get('page', 1)))
        except ValueError:
            page = 1

        ITEMS_PER_PAGE = 50

        df['Churn_Risk_Tier'] = df.apply(calculate_churn_risk, axis=1)

        if search_query:
            df = df[df['customerID'].str.lower().str.contains(search_query, na=False)]

        if risk_filter != 'All':
            df = df[df['Churn_Risk_Tier'] == risk_filter]

        if status_filter != 'All':
            df = df[df['OutreachStatus'].fillna('Not Contacted') == status_filter]

        if contract_filter != 'All':
            df = df[df['Contract'].str.lower().str.strip() == contract_filter.lower().strip()]

        triage_scores = {'High Risk': 1, 'Medium Risk': 2, 'Low Risk': 3, 'Churned': 4}
        df['sort_key'] = df['Churn_Risk_Tier'].map(triage_scores).fillna(5)
        df = df.sort_values('sort_key').drop(columns=['sort_key'])

        total_records = len(df)
        total_pages = max(1, (total_records + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE)

        start_idx = (page - 1) * ITEMS_PER_PAGE
        end_idx = start_idx + ITEMS_PER_PAGE

        paginated_df = df.iloc[start_idx:end_idx]
        records = paginated_df.to_dict(orient='records')

        serializer = CustomerSerializer(records, many=True)

        logger.info(
            f"Successfully processed directory listing request. Sent page {page}/{total_pages}, row count: {len(records)}")

        return Response({
            "customers": serializer.data,
            "metadata": {
                "total_records": total_records,
                "total_pages": total_pages,
                "current_page": page,
                "items_per_page": ITEMS_PER_PAGE,
                "has_previous": page > 1,
                "has_next": page < total_pages
            }
        }, status=status.HTTP_200_OK)

    except Exception as list_err:
        logger.error(f"Directory listing extraction failed: {str(list_err)}")
        return Response(
            {"error": f"Failed to retrieve customer records from memory cache: {str(list_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def customer_detail_api_view(request, customer_id):
    """API endpoint that searches and serializes a single customer profile."""
    try:
        df = get_data()
        customer_row = df[df['customerID'] == customer_id]

        if customer_row.empty:
            logger.warning(f"Profile lookup rejected. Customer ID '{customer_id}' not found in database array cache.")
            return Response(
                {"error": f"Customer ID '{customer_id}' does not exist in active system cache arrays."},
                status=status.HTTP_404_NOT_FOUND
            )

        record = customer_row.iloc[0].to_dict()
        serializer = CustomerSerializer(record)
        logger.info(f"Successfully fetched details profile for Customer ID: {customer_id}")
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as calculation_err:
        logger.error(f"Profile compilation failure for Customer ID '{customer_id}': {str(calculation_err)}")
        return Response(
            {"error": f"Calculation triage pipeline encountered an unexpected fault: {str(calculation_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
def customer_outreach_patch_view(request, customer_id):
    """Processes state machine workflow modifications safely."""
    try:
        df = get_data()
    except Exception as data_err:
        logger.critical(f"Data layer mapping unreachable during outreach step update: {str(data_err)}")
        return Response(
            {"error": f"Database storage layer is offline or uninitialized: {str(data_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    customer_rows = df[df['customerID'] == customer_id]
    if customer_rows.empty:
        logger.warning(f"State shift aborted. Target Customer ID '{customer_id}' does not exist.")
        return Response(
            {"error": f"Customer ID '{customer_id}' does not exist in the active tracking system."},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        record = customer_rows.iloc[0].to_dict()
        raw_current = record.get('OutreachStatus', STATE_NOT_CONTACTED)

        if pd.isna(raw_current) or not str(raw_current).strip():
            current_status = STATE_NOT_CONTACTED
        else:
            current_status = str(raw_current).strip().upper()

        if not request.data or not isinstance(request.data, dict):
            logger.warning(f"Outreach modification rejected for '{customer_id}'. Structural body missing JSON payload structure.")
            return Response(
                {"error": "Structural request payload body is missing or is not a valid JSON dictionary."},
                status=status.HTTP_400_BAD_REQUEST
            )

        target_status = request.data.get('status')
        if not target_status:
            logger.warning(f"Outreach change request failed for '{customer_id}'. Payload missing mandatory 'status' parameter.")
            return Response(
                {"error": "Malformed input structure. Your request body payload must include a 'status' attribute."},
                status=status.HTTP_400_BAD_REQUEST
            )
        target_status = str(target_status).strip().upper()

    except Exception as parse_err:
        logger.error(f"Failed parsing body payload options for '{customer_id}': {str(parse_err)}")
        return Response(
            {"error": f"Failed to interpret the formatting of your input request parameters: {str(parse_err)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if current_status == target_status:
        return Response(
            {"message": "Status is already matching target framework state."},
            status=status.HTTP_200_OK
        )

    all_valid_tokens = [STATE_NOT_CONTACTED, STATE_IN_PROGRESS, STATE_RESOLVED]
    if target_status not in all_valid_tokens:
        logger.warning(f"Invalid state code validation check failure for '{customer_id}'. Submitted code token value was: '{target_status}'.")
        return Response(
            {"error": f"Requested status token '{target_status}' is invalid. Options are: {all_valid_tokens}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    allowed_next_states = VALID_TRANSITIONS.get(current_status, [])
    if target_status not in allowed_next_states:
        logger.warning(f"State machine check failure for '{customer_id}'. Illegal jump requested from '{current_status}' to '{target_status}'.")
        return Response(
            {
                "error": f"Illegal state workflow jump requested. Cannot move directly from '{current_status}' to '{target_status}'."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        success = update_customer_outreach_status(customer_id, target_status)
        if not success:
            raise RuntimeError("Pandas data frame modification failed to register cell update parameters.")
    except Exception as write_err:
        logger.error(f"Failed to record state transition data write-lock for '{customer_id}': {str(write_err)}")
        return Response(
            {"error": f"Datastore write failure. Unable to safely commit data updates back to system RAM: {str(write_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    logger.info(f"STATE_TRANSITION SUCCESS customer_id={customer_id} from={current_status} to={target_status}")

    return Response(
        {
            "success": True,
            "customerID": customer_id,
            "previous_status": current_status,
            "new_status": target_status
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def model_info_api_view(request):
    """API endpoint exposing the active rule weights and logic parameters for the heuristic engine."""
    logger.info("Exposing active heuristic model rule metadata configurations.")
    return Response(MODEL_INFO_METADATA, status=status.HTTP_200_OK)
