import pandas as pd
from unittest.mock import patch
from django.test import SimpleTestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

# Import the core logic pipelines we are validating
from churn_calculator.churncalc import calculate_churn_risk
from customer_churn.views import customer_outreach_patch_view


class ChurnScoringLogicTests(SimpleTestCase):
    """Unit tests covering the rule-based risk scoring logic within churncalc.py."""

    def test_customer_has_already_churned(self):
        """Rule 1: If the Churn column is explicitly 'Yes', return 'Churned' immediately."""
        customer_data = {"Churn": "Yes", "Contract": "Two year", "tenure": 50}
        result = calculate_churn_risk(customer_data)
        self.assertEqual(result, "Churned")

    def test_enterprise_anchor_low_risk(self):
        """Rule 2: Long tenure or a two-year contract flags a user as Low Risk."""
        # Long tenure (over 48 months)
        customer_1 = {"Churn": "No", "Contract": "Month-to-month", "tenure": 55}
        # Two-year contract requirement
        customer_2 = {"Churn": "No", "Contract": "Two year", "tenure": 2}

        self.assertEqual(calculate_churn_risk(customer_1), "Low Risk")
        self.assertEqual(calculate_churn_risk(customer_2), "Low Risk")

    def test_high_risk_new_user_on_electronic_check(self):
        """Rule 3A: Month-to-month contract, short tenure (<=6), and Electronic check."""
        customer_data = {
            "Churn": "No",
            "Contract": "Month-to-month",
            "tenure": 3,
            "PaymentMethod": "Electronic check"
        }
        result = calculate_churn_risk(customer_data)
        self.assertEqual(result, "High Risk")

    def test_high_risk_expensive_fiber_optic(self):
        """Rule 3B: Month-to-month, Fiber optic internet, and MonthlyCharges > $80."""
        customer_data = {
            "Churn": "No",
            "Contract": "Month-to-month",
            "InternetService": "Fiber optic",
            "MonthlyCharges": 85.50
        }
        result = calculate_churn_risk(customer_data)
        self.assertEqual(result, "High Risk")

    def test_high_risk_unsupported_internet_user(self):
        """Rule 3C: Month-to-month internet user with no tech support or online security."""
        customer_data = {
            "Churn": "No",
            "Contract": "Month-to-month",
            "InternetService": "DSL",
            "TechSupport": "No",
            "OnlineSecurity": "No"
        }
        result = calculate_churn_risk(customer_data)
        self.assertEqual(result, "High Risk")

    def test_medium_risk_isolated_senior_citizen(self):
        """Rule 4A: Senior citizen, no partner, no dependents, on a Month-to-month plan."""
        customer_data = {
            "Churn": "No",
            "Contract": "Month-to-month",
            "SeniorCitizen": "1",
            "Partner": "No",
            "Dependents": "No"
        }
        result = calculate_churn_risk(customer_data)
        self.assertEqual(result, "Medium Risk")


class OutreachStateMachineTests(SimpleTestCase):
    """Unit tests validating state transitions and HTTP responses in the patch view."""

    def setUp(self):
        self.factory = APIRequestFactory()
        # Establish a mock dataframe to mirror our RAM runtime structure safely
        self.mock_df = pd.DataFrame([
            {
                "customerID": "1234-VALID",
                "Contract": "Month-to-month",
                "OutreachStatus": "NOT_CONTACTED",
                "Churn": "No"
            },
            {
                "customerID": "5678-RESOLVED",
                "Contract": "Month-to-month",
                "OutreachStatus": "RESOLVED",
                "Churn": "No"
            }
        ])

    @patch('customer_churn.views.get_data')
    @patch('customer_churn.views.update_customer_outreach_status')
    def test_valid_progression_transition(self, mock_update, mock_get_data):
        """Verifies that NOT_CONTACTED can cleanly step into IN_PROGRESS (Returns 200)."""
        mock_get_data.return_value = self.mock_df
        mock_update.return_value = True

        request = self.factory.patch('/api/customers/1234-VALID/outreach/', {'status': 'IN_PROGRESS'}, format='json')
        response = customer_outreach_patch_view(request, customer_id="1234-VALID")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['new_status'], 'IN_PROGRESS')

    @patch('customer_churn.views.get_data')
    def test_invalid_shortcut_transition_is_blocked(self, mock_get_data):
        """Verifies that jumping from NOT_CONTACTED straight to RESOLVED is blocked (Returns 400)."""
        mock_get_data.return_value = self.mock_df

        request = self.factory.patch('/api/customers/1234-VALID/outreach/', {'status': 'RESOLVED'}, format='json')
        response = customer_outreach_patch_view(request, customer_id="1234-VALID")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Illegal state workflow jump requested', response.data['error'])

    @patch('customer_churn.views.get_data')
    def test_missing_customer_returns_not_found(self, mock_get_data):
        """Verifies that updating a completely non-existent customer ID returns a clean 404."""
        mock_get_data.return_value = self.mock_df

        request = self.factory.patch('/api/customers/FAKE-ID/outreach/', {'status': 'IN_PROGRESS'}, format='json')
        response = customer_outreach_patch_view(request, customer_id="FAKE-ID")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    @patch('customer_churn.views.get_data')
    def test_malformed_input_status_returns_bad_request(self, mock_get_data):
        """Verifies that sending an unregistered status value returns a clean 400."""
        mock_get_data.return_value = self.mock_df

        request = self.factory.patch('/api/customers/1234-VALID/outreach/', {'status': 'INVALID_TOKEN_ABC'},
                                     format='json')
        response = customer_outreach_patch_view(request, customer_id="1234-VALID")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
