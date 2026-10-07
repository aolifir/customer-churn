import os
import asyncio
from django.apps import AppConfig


class CustomerChurnConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'customer_churn'

    def ready(self):
        if os.environ.get('RUN_MAIN') == 'true':
            from customer_churn.data_access.memory_store import load_csv_to_ram_async

            asyncio.run(load_csv_to_ram_async())
