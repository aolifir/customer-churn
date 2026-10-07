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

from django.urls import path
from customer_churn.views import customer_list_view, customer_detail_api_view, customer_outreach_patch_view, model_info_api_view

urlpatterns = [
    path('api/customers/', customer_list_view, name='customer-list'),
    path('api/customers/model-info/', model_info_api_view, name='model-info'),
    path('api/customers/<str:customer_id>/', customer_detail_api_view, name='customer-detail'),
    # Matches the exact route structure target called by your react-client api endpoints
    path('api/customers/<str:customer_id>/outreach/', customer_outreach_patch_view, name='customer-outreach-patch'),
]
