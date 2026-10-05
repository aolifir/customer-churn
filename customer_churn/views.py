# # import pandas as pd
# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from rest_framework import status
# # from customer_churn.data_access.memory_store import get_data, update_customer_outreach_status
# # from customer_churn.serializers.customer import CustomerSerializer
# #
# # #  CORRECTION 1: Moved constants to the root level so all endpoints can read them cleanly
# # STATE_NOT_CONTACTED = "NOT_CONTACTED"
# # STATE_IN_PROGRESS = "IN_PROGRESS"
# # STATE_RESOLVED = "RESOLVED"
# #
# # VALID_TRANSITIONS = {
# #     STATE_NOT_CONTACTED: [STATE_IN_PROGRESS],
# #     STATE_IN_PROGRESS: [STATE_NOT_CONTACTED, STATE_RESOLVED],
# #     STATE_RESOLVED: [STATE_IN_PROGRESS]
# # }
# #
# #
# # @api_view(['GET'])
# # def customer_list_view(request):
# #     """API endpoint that loads and serializes the raw cache data."""
# #     try:
# #         df = get_data()
# #         records = df.to_dict(orient='records')
# #         serializer = CustomerSerializer(records, many=True)
# #         return Response(serializer.data, status=status.HTTP_200_OK)
# #     except Exception as e:
# #         return Response({"error": f"Internal database error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# #
# #
# # @api_view(['GET'])
# # def customer_detail_api_view(request, customer_id):
# #     """API endpoint that searches, calculates risk, and returns a single customer profile."""
# #     try:
# #         df = get_data()
# #         customer_row = df[df['customerID'] == customer_id]
# #
# #         if customer_row.empty:
# #             return Response(
# #                 {"error": f"Customer ID '{customer_id}' does not exist in active system cache arrays."},
# #                 status=status.HTTP_404_NOT_FOUND
# #             )
# #
# #         record = customer_row.iloc[0].to_dict()
# #         serializer = CustomerSerializer(record)
# #         return Response(serializer.data, status=status.HTTP_200_OK)
# #     except Exception as e:
# #         return Response({"error": f"Calculation pipeline fault: {str(e)}"},
# #                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# #
# #
# # @api_view(['PATCH'])
# # def customer_outreach_patch_view(request, customer_id):
# #     """Enforces a strict backend state machine matrix to manage outreach progress logs safely."""
# #     try:
# #         df = get_data()
# #         customer_rows = df[df['customerID'] == customer_id]
# #
# #         if customer_rows.empty:
# #             return Response(
# #                 {"error": f"Customer ID '{customer_id}' does not exist in active system cache arrays."},
# #                 status=status.HTTP_404_NOT_FOUND
# #             )
# #
# #         #  CORRECTION 2: Safely read row metrics and handle Pandas data structure parameters securely
# #         record = customer_rows.iloc[0].to_dict()
# #         raw_current = record.get('OutreachStatus', STATE_NOT_CONTACTED)
# #         current_status = str(raw_current).strip().upper() if pd.notna(raw_current) and str(raw_current).strip() else STATE_NOT_CONTACTED
# #
# #         # Extract targeted destination value from the request body
# #         target_status = request.data.get('status', '').strip().upper()
# #
# #         if current_status == target_status:
# #             return Response({"message": "Status is already matching target framework state."},
# #                             status=status.HTTP_200_OK)
# #
# #         all_valid_tokens = [STATE_NOT_CONTACTED, STATE_IN_PROGRESS, STATE_RESOLVED]
# #         if target_status not in all_valid_tokens:
# #             return Response(
# #                 {"error": f"Requested status token '{target_status}' is invalid. Options are: {all_valid_tokens}"},
# #                 status=status.HTTP_400_BAD_REQUEST
# #             )
# #
# #         allowed_next_states = VALID_TRANSITIONS.get(current_status, [])
# #
# #         if target_status not in allowed_next_states:
# #             return Response(
# #                 {
# #                     "error": f"Illegal state machine transition requested. "
# #                              f"Cannot jump directly from '{current_status}' to '{target_status}'. "
# #                              f"Allowed steps from here: {allowed_next_states}"
# #                 },
# #                 status=status.HTTP_400_BAD_REQUEST
# #             )
# #
# #         success = update_customer_outreach_status(customer_id, target_status)
# #         if not success:
# #             return Response({"error": "Failed to update record index map inside in-memory dataframe cache."},
# #                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# #
# #         return Response(
# #             {
# #                 "success": True,
# #                 "customerID": customer_id,
# #                 "previous_status": current_status,
# #                 "new_status": target_status
# #             },
# #             status=status.HTTP_200_OK
# #         )
# #
# #     except Exception as e:
# #         return Response({"error": f"State machine validation failure: {str(e)}"},
# #                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
# import pandas as pd
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from customer_churn.data_access.memory_store import get_data, update_customer_outreach_status
# from customer_churn.serializers.customer import CustomerSerializer
#
# # State Machine Constants Configuration definitions
# STATE_NOT_CONTACTED = "NOT_CONTACTED"
# STATE_IN_PROGRESS = "IN_PROGRESS"
# STATE_RESOLVED = "RESOLVED"
#
# VALID_TRANSITIONS = {
#     STATE_NOT_CONTACTED: [STATE_IN_PROGRESS],
#     STATE_IN_PROGRESS: [STATE_NOT_CONTACTED, STATE_RESOLVED],
#     STATE_RESOLVED: [STATE_IN_PROGRESS]
# }
#
#
# @api_view(['GET'])
# def customer_list_view(request):
#     """API endpoint that loads and serializes the raw cache data.
#
#     Catches memory loading failures and returns clean JSON errors with 500 status.
#     """
#     try:
#         # Catch uninitialized database cache allocations cleanly
#         df = get_data()
#
#         # Convert the active dataframe rows safely into an array record layout
#         records = df.to_dict(orient='records')
#
#         # Pass records securely over to the serializing engine
#         serializer = CustomerSerializer(records, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
#     except Exception as list_err:
#         return Response(
#             {"error": f"Failed to retrieve customer directory records from system memory cache: {str(list_err)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
#
#
# @api_view(['GET'])
# def customer_detail_api_view(request, customer_id):
#     """API endpoint that searches, calculates risk, and returns a single customer profile.
#
#     Guarantees clean 404 for missing portfolios and 500 blocks for pipeline data faults.
#     """
#     try:
#         df = get_data()
#     except Exception as data_io_err:
#         return Response(
#             {"error": f"Internal database storage access failure: {str(data_io_err)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
#
#     try:
#         # Locate the specific account row record based on the ID string matching constraint
#         customer_row = df[df['customerID'] == customer_id]
#
#         if customer_row.empty:
#             return Response(
#                 {"error": f"Customer ID '{customer_id}' does not exist in active system cache arrays."},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#
#         # Extract the row record entry out into a direct mapping dictionary
#         record = customer_row.iloc[0].to_dict()
#
#         # Pass the record dictionary out to the serializer to compute dynamic risk values
#         serializer = CustomerSerializer(record)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
#     except Exception as calculation_err:
#         return Response(
#             {"error": f"Calculation triage pipeline encountered an unexpected fault: {str(calculation_err)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
#
#
# @api_view(['PATCH'])
# def customer_outreach_patch_view(request, customer_id):
#     """Enforces a strict backend state machine matrix to manage outreach progress logs safely.
#
#     Catches all structural failures and formats them into clean HTTP JSON errors.
#     """
#     try:
#         df = get_data()
#     except Exception as data_err:
#         return Response(
#             {"error": f"Database storage layer is offline or uninitialized: {str(data_err)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
#
#     customer_rows = df[df['customerID'] == customer_id]
#     if customer_rows.empty:
#         return Response(
#             {"error": f"Customer ID '{customer_id}' does not exist in the active tracking system."},
#             status=status.HTTP_404_NOT_FOUND
#         )
#
#     try:
#         record = customer_rows.iloc[0].to_dict()
#         raw_current = record.get('OutreachStatus', STATE_NOT_CONTACTED)
#
#         if pd.isna(raw_current) or not str(raw_current).strip():
#             current_status = STATE_NOT_CONTACTED
#         else:
#             current_status = str(raw_current).strip().upper()
#
#         if not request.data or not isinstance(request.data, dict):
#             return Response(
#                 {"error": "Structural request payload body is missing or is not a valid JSON dictionary."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#
#         target_status = request.data.get('status')
#         if not target_status:
#             return Response(
#                 {"error": "Malformed input structure. Your request body payload must include a 'status' attribute."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         target_status = str(target_status).strip().upper()
#
#     except Exception as parse_err:
#         return Response(
#             {"error": f"Failed to interpret the formatting of your input request parameters: {str(parse_err)}"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
#
#     if current_status == target_status:
#         return Response(
#             {"message": "Status is already matching target framework state."},
#             status=status.HTTP_200_OK
#         )
#
#     all_valid_tokens = [STATE_NOT_CONTACTED, STATE_IN_PROGRESS, STATE_RESOLVED]
#     if target_status not in all_valid_tokens:
#         return Response(
#             {"error": f"Requested status token '{target_status}' is invalid. Options are: {all_valid_tokens}"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
#
#     allowed_next_states = VALID_TRANSITIONS.get(current_status, [])
#     if target_status not in allowed_next_states:
#         return Response(
#             {
#                 "error": f"Illegal state workflow jump requested. "
#                          f"Cannot move directly from '{current_status}' to '{target_status}'. "
#                          f"Allowed steps from here: {allowed_next_states}"
#             },
#             status=status.HTTP_400_BAD_REQUEST
#         )
#
#     try:
#         success = update_customer_outreach_status(customer_id, target_status)
#         if not success:
#             raise RuntimeError("Pandas data frame modification failed to register cell update parameters.")
#     except Exception as write_err:
#         return Response(
#             {
#                 "error": f"Datastore write failure. Unable to safely commit data updates back to system RAM: {str(write_err)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
#
#     return Response(
#         {
#             "success": True,
#             "customerID": customer_id,
#             "previous_status": current_status,
#             "new_status": target_status
#         },
#         status=status.HTTP_200_OK
#     )

import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from customer_churn.data_access.memory_store import get_data, update_customer_outreach_status
from customer_churn.serializers.customer import CustomerSerializer

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
    """API endpoint that loads and serializes the raw cache data."""
    try:
        df = get_data()
        records = df.to_dict(orient='records')
        serializer = CustomerSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as list_err:
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
            return Response(
                {"error": f"Customer ID '{customer_id}' does not exist in active system cache arrays."},
                status=status.HTTP_404_NOT_FOUND
            )

        record = customer_row.iloc[0].to_dict()
        serializer = CustomerSerializer(record)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as calculation_err:
        return Response(
            {"error": f"Calculation triage pipeline encountered an unexpected fault: {str(calculation_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
def customer_outreach_patch_view(request, customer_id):
    """Processes state machine workflow modifications safely using non-blocking background tasks."""
    try:
        df = get_data()
    except Exception as data_err:
        return Response(
            {"error": f"Database storage layer is offline or uninitialized: {str(data_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    customer_rows = df[df['customerID'] == customer_id]
    if customer_rows.empty:
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
            return Response(
                {"error": "Structural request payload body is missing or is not a valid JSON dictionary."},
                status=status.HTTP_400_BAD_REQUEST
            )

        target_status = request.data.get('status')
        if not target_status:
            return Response(
                {"error": "Malformed input structure. Your request body payload must include a 'status' attribute."},
                status=status.HTTP_400_BAD_REQUEST
            )
        target_status = str(target_status).strip().upper()

    except Exception as parse_err:
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
        return Response(
            {"error": f"Requested status token '{target_status}' is invalid. Options are: {all_valid_tokens}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    allowed_next_states = VALID_TRANSITIONS.get(current_status, [])
    if target_status not in allowed_next_states:
        return Response(
            {
                "error": f"Illegal state workflow jump requested. "
                         f"Cannot move directly from '{current_status}' to '{target_status}'. "
                         f"Allowed steps from here: {allowed_next_states}"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Calls the thread-safe bridge utility to run the parallel execution
        success = update_customer_outreach_status(customer_id, target_status)
        if not success:
            raise RuntimeError("Pandas data frame modification failed to register cell update parameters.")
    except Exception as write_err:
        return Response(
            {
                "error": f"Datastore write failure. Unable to safely commit data updates back to system RAM: {str(write_err)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(
        {
            "success": True,
            "customerID": customer_id,
            "previous_status": current_status,
            "new_status": target_status
        },
        status=status.HTTP_200_OK
    )
