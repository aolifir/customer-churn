import os
import asyncio
import pandas as pd
from asgiref.sync import async_to_sync

_dataframe = None

_lock = asyncio.Lock()


def _blocking_csv_io(csv_path: str) -> pd.DataFrame:

    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    df.columns = df.columns.str.strip()
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)

    if 'OutreachStatus' not in df.columns:
        df['OutreachStatus'] = 'NOT_CONTACTED'
    else:
        df['OutreachStatus'] = df['OutreachStatus'].fillna('NOT_CONTACTED')

    return df


async def load_csv_to_ram_async():

    global _dataframe
    async with _lock:
        if _dataframe is not None:
            return

        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        csv_path = os.path.join(base_dir, "data", "Customer-Churn.csv")

        try:
            loop = asyncio.get_running_loop()
            df = await loop.run_in_executor(None, _blocking_csv_io, csv_path)
            _dataframe = df
            print(f"Django memory_store: Successfully cached {len(_dataframe)} rows via parallel I/O.")
        except Exception as e:
            raise RuntimeError(f"Failed to load memory store asynchronously: {e}")


def get_data() -> pd.DataFrame:
    """Synchronous data retrieval check wrapper"""
    if _dataframe is None:
        raise RuntimeError("Data store has not been initialized.")
    return _dataframe


async def _update_status_worker(customer_id: str, new_status: str) -> bool:
    """Internal coroutine worker"""
    global _dataframe
    if _dataframe is None:
        return False

    async with _lock:
        if customer_id not in _dataframe['customerID'].values:
            return False
        _dataframe.loc[_dataframe['customerID'] == customer_id, 'OutreachStatus'] = new_status
        return True


def update_customer_outreach_status(customer_id: str, new_status: str) -> bool:
    """Thread-safe synchronous bridge"""
    return async_to_sync(_update_status_worker)(customer_id, new_status)
