"""
URL configuration for customers_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path
# from django.http import JsonResponse
# from customer_churn.data_access.memory_store import get_data


# def test_customer_view(request, customer_id: str):
#     df = get_data()
#     match = df[df['customerID'] == customer_id.strip()]
#
#     if match.empty:
#         return JsonResponse({"error": "Customer not found"}, status=404)
#
#     # Standardize the row layout data types to plain Python types
#     # This prevents the Pandas 'int64/float64' serialization 500 error crash
#     raw_record = match.iloc[0].to_dict()
#
#     clean_record = {}
#     for key, value in raw_record.items():
#         # If the value is a Pandas/NumPy number, cast it to a native Python float or int
#         if hasattr(value, 'item'):
#             clean_record[key] = value.item()
#         else:
#             clean_record[key] = value
#
#     return JsonResponse(clean_record)
#
# def customer_list_view(request)



# from django.contrib import admin
# from django.urls import path
# from customer_churn.views import customer_detail_api_view
# from customer_churn.views import customer_list_view
#
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     # Proper, clean mapping pointing directly to your DRF app controller
#     path('api/customers/<str:customer_id>/', customer_detail_api_view, name='customer-detail-api'),
#     path('api/customers/', customer_list_view, name = 'customer-list-api'),
# ]


from django.urls import path
from customer_churn.views import customer_list_view, customer_detail_api_view, customer_outreach_patch_view

urlpatterns = [
    path('api/customers/', customer_list_view, name='customer-list'),
    path('api/customers/<str:customer_id>/', customer_detail_api_view, name='customer-detail'),

    # Matches the exact route structure target called by your react-client api endpoints
    path('api/customers/<str:customer_id>/outreach/', customer_outreach_patch_view, name='customer-outreach-patch'),
]
