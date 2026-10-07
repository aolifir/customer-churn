from rest_framework import serializers
from customer_churn.data_access.memory_store import get_data
from churn_calculator.churncalc import calculate_churn_risk


class CustomerSerializer(serializers.Serializer):
    """Dynamic serializer"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            df = get_data()
            all_columns = list(df.columns)
        except Exception:
            all_columns = []

        for column_name in all_columns:
            if column_name in ['MonthlyCharges', 'TotalCharges']:
                self.fields[column_name] = serializers.FloatField(required=False)
            elif column_name in ['tenure', 'SeniorCitizen']:
                self.fields[column_name] = serializers.IntegerField(required=False)
            else:
                self.fields[column_name] = serializers.CharField(required=False, allow_blank=True)

        self.fields['Churn_Risk_Tier'] = serializers.SerializerMethodField()

    def get_Churn_Risk_Tier(self, obj) -> str:
        return calculate_churn_risk(obj)
