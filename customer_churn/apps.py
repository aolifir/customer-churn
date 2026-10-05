import os
import asyncio
from django.apps import AppConfig


class CustomerChurnConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'customer_churn'

    def ready(self):
        # The RUN_MAIN check prevents Django's auto-reloader from executing the load process twice
        if os.environ.get('RUN_MAIN') == 'true':
            # Import our updated asynchronous parallel thread loader utility function
            from customer_churn.data_access.memory_store import load_csv_to_ram_async

            # Initialize and execute the parallel event loop task context to load the file
            asyncio.run(load_csv_to_ram_async())
