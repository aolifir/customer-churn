# # import os
# # import pandas as pd
# # from churn_calculator.churncalc import calculate_churn_risk
# #
# # _dataframe = None
# #
# #
# # def load_csv_to_ram():
# #     global _dataframe
# #     if _dataframe is not None:
# #         return
# #
# #     # Find the root project directory safely
# #     base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# #     csv_path = os.path.join(base_dir, "data", "Customer-Churn.csv")
# #
# #     print(f" Django memory_store: Attempting to load from {csv_path}...")
# #
# #     try:
# #         # Load the CSV, handling encoding variations cleanly
# #         df = pd.read_csv(csv_path, encoding='utf-8-sig')
# #
# #         # Clean any trailing spaces from the headers automatically
# #         df.columns = df.columns.str.strip()
# #
# #         # PRINT HEADERS TO CONSOLE TO SEE EXACTLY WHAT WE ARE WORKING WITH
# #         print(f" DEBUG: Successfully read file. Columns found: {list(df.columns)}")
# #
# #         # Standardize the target field safely if it exists
# #         if 'TotalCharges' in df.columns:
# #             df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)
# #         else:
# #             print(" WARNING: 'TotalCharges' column name not found exactly as expected!")
# #
# #         _dataframe = df
# #         print(f" Django memory_store: Successfully cached {len(_dataframe)} rows in system RAM.")
# #
# #     except Exception as e:
# #         print(f" CRITICAL EXCEPTION in memory_store: {e}")
# #         raise e
# #
# #
# # def get_data() -> pd.DataFrame:
# #     if _dataframe is None:
# #         raise RuntimeError("Data store has not been initialized.")
# #     return _dataframe
#
#
# import os
# import pandas as pd
#
# _dataframe = None
#
#
# def load_csv_to_ram():
#     global _dataframe
#     if _dataframe is not None:
#         return
#
#     base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#     csv_path = os.path.join(base_dir, "data", "Customer-Churn.csv")
#
#     try:
#         df = pd.read_csv(csv_path, encoding='utf-8-sig')
#         df.columns = df.columns.str.strip()
#         df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)
#
#         _dataframe = df
#         print(f"✅ Django memory_store: Successfully cached {len(_dataframe)} raw rows.")
#     except Exception as e:
#         raise RuntimeError(f"Failed to load memory store: {e}")
#
#
# def get_data() -> pd.DataFrame:
#     if _dataframe is None:
#         raise RuntimeError("Data store has not been initialized.")
#     return _dataframe

# import os
# import pandas as pd
#
# _dataframe = None
#
#
# def load_csv_to_ram():
#     global _dataframe
#     if _dataframe is not None:
#         return
#
#     base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#     csv_path = os.path.join(base_dir, "data", "Customer-Churn.csv")
#
#     try:
#         df = pd.read_csv(csv_path, encoding='utf-8-sig')
#         df.columns = df.columns.str.strip()
#         df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)
#
#         # 🚀 INITIALIZATION STEP: Guarantee the tracking column exists in RAM on startup
#         if 'OutreachStatus' not in df.columns:
#             df['OutreachStatus'] = 'NOT_CONTACTED'
#         else:
#             # Fallback for empty rows if loading a pre-saved state file variant
#             df['OutreachStatus'] = df['OutreachStatus'].fillna('NOT_CONTACTED')
#
#         _dataframe = df
#         print(f"✅ Django memory_store: Successfully cached {len(_dataframe)} raw rows.")
#     except Exception as e:
#         raise RuntimeError(f"Failed to load memory store: {e}")
#
#
# def get_data() -> pd.DataFrame:
#     if _dataframe is None:
#         raise RuntimeError("Data store has not been initialized.")
#     return _dataframe
#
#
# # 🚀 NEW UTILITY HOOK: Mutates the active dataframe row inline for our state patch view
# def update_customer_outreach_status(customer_id: str, new_status: str) -> bool:
#     """Locates a single customer row inside RAM and commits the new state machine token."""
#     global _dataframe
#     if _dataframe is None:
#         return False
#
#     # Verify the identifier target value actually exists in our memory slice
#     if customer_id not in _dataframe['customerID'].values:
#         return False
#
#     # Apply standard locator index logic to change the single status string cell
#     _dataframe.loc[_dataframe['customerID'] == customer_id, 'OutreachStatus'] = new_status
#     return True

import os
import asyncio
import pandas as pd
from asgiref.sync import async_to_sync

_dataframe = None
# Global operational thread lock to prevent parallel memory race conditions
_lock = asyncio.Lock()


def _blocking_csv_io(csv_path: str) -> pd.DataFrame:
    """Synchronous CPU/IO bound operation isolated for thread-pool execution."""
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    df.columns = df.columns.str.strip()
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)

    if 'OutreachStatus' not in df.columns:
        df['OutreachStatus'] = 'NOT_CONTACTED'
    else:
        df['OutreachStatus'] = df['OutreachStatus'].fillna('NOT_CONTACTED')

    return df


async def load_csv_to_ram_async():
    """Asynchronously loads the target CSV using an optimized background thread worker pool."""
    global _dataframe
    async with _lock:
        if _dataframe is not None:
            return

        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        csv_path = os.path.join(base_dir, "data", "Customer-Churn.csv")

        try:
            loop = asyncio.get_running_loop()
            # Offload heavy I/O to an independent background thread worker
            df = await loop.run_in_executor(None, _blocking_csv_io, csv_path)
            _dataframe = df
            print(f"✅ Django memory_store: Successfully cached {len(_dataframe)} rows via parallel I/O.")
        except Exception as e:
            raise RuntimeError(f"Failed to load memory store asynchronously: {e}")


def get_data() -> pd.DataFrame:
    """Synchronous data retrieval check wrapper required by serializer maps."""
    if _dataframe is None:
        raise RuntimeError("Data store has not been initialized.")
    return _dataframe


async def _update_status_worker(customer_id: str, new_status: str) -> bool:
    """Internal coroutine worker that executes row mutations safely behind an operational lock."""
    global _dataframe
    if _dataframe is None:
        return False

    async with _lock:
        if customer_id not in _dataframe['customerID'].values:
            return False
        _dataframe.loc[_dataframe['customerID'] == customer_id, 'OutreachStatus'] = new_status
        return True


def update_customer_outreach_status(customer_id: str, new_status: str) -> bool:
    """Thread-safe synchronous bridge that executes the async state mutation worker cleanly."""
    # Uses Django's built-in asgiref bridge to manage the parallel event loop execution safely
    return async_to_sync(_update_status_worker)(customer_id, new_status)
