import pandas as pd


def calculate_churn_risk(data) -> str:
    """Calculates customer churn risk tiers based on rule-based logic boundaries.

    Skips calculation if the customer has already churned.
    """
    # Force incoming serialized records safely into a normalized dictionary lookup format
    if hasattr(data, 'to_dict'):
        d = data.to_dict()
    elif isinstance(data, dict):
        d = data
    else:
        d = getattr(data, '__dict__', {})

    # 🚀 CORRECTION CORNER: Check if they have already left the company
    # Standardize to uppercase comparison to prevent string case issues
    has_churned = str(d.get("Churn", "")).strip().upper()
    if has_churned == "YES":
        return "Churned"

    # Extract formatting values for active customers with clear fallback strings
    contract = str(d.get("Contract", "")).strip()
    payment = str(d.get("PaymentMethod", "")).strip()
    internet = str(d.get("InternetService", "")).strip()
    tech_support = str(d.get("TechSupport", "")).strip()
    security = str(d.get("OnlineSecurity", "")).strip()
    billing = str(d.get("PaperlessBilling", "")).strip()
    partner = str(d.get("Partner", "")).strip()
    dependents = str(d.get("Dependents", "")).strip()

    try:
        tenure = int(d.get("tenure", 0))
        monthly_charges = float(d.get("MonthlyCharges", 0.0))
        senior_citizen = str(d.get("SeniorCitizen", "0")).strip()
    except (ValueError, TypeError):
        tenure, monthly_charges, senior_citizen = 0, 0.0, "0"

    # --- ACTIVE CUSTOMER RULE LOGIC PIPELINE EVALUATION ---

    # Rule Blanket 4: Enterprise Anchors (Low Risk)
    if contract == "Two year" or tenure > 48:
        return "Low Risk"

    # Rule Blanket 3: High Risk Profiles
    high_risk_new_user = (contract == "Month-to-month" and tenure <= 6 and payment == "Electronic check")
    high_risk_fiber = (contract == "Month-to-month" and internet == "Fiber optic" and monthly_charges > 80.0)
    high_risk_unsupported = (
                internet != "No" and tech_support == "No" and security == "No" and contract == "Month-to-month")

    if high_risk_new_user or high_risk_fiber or high_risk_unsupported:
        return "High Risk"

    # Rule Blanket 2: Medium Risk Profiles
    medium_risk_senior = (
                senior_citizen == "1" and partner == "No" and dependents == "No" and contract == "Month-to-month")
    medium_risk_annual = (contract == "One year" and tenure <= 12 and billing == "Yes")

    if medium_risk_senior or medium_risk_annual:
        return "Medium Risk"

    # Baseline fallback
    return "Low Risk"
