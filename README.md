# customer-churn



Quick Start Guide (Clean Clone Setup)

Follow these precise sequential terminal commands to initialize and run both the backend data layer and frontend visual dashboard simultaneously.

# 1. Backend Engine Initialization (Django)
Open a terminal window at the project root directory:
```bash
# Navigate to the backend directory
cd customers_api

# Initialize a local virtual environment
python -m venv .venv

# Activating virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install all 3rd party apps as follows:
pip install django djangorestframework django-cors-headers pandas xlrd

# Run tests:
python manage.py test customer_churn

# Start the django server
python manage.py runserver
```
*The backend is now active on port `8000`.*
---
# 2. Frontend Engine Initialization(React)

Open a new terminal window:
```bash
#Navigate to the frontend directory:
cd react-client

#Install ui layout and other dependencies
npm install

#Boot up local Vite dev server
npm run dev
```
*Click the local network link printed in the Frontend terminal. The site should now be active.*
---
## Design Considerations
### 1. Framework choice
**Backend:** Django REST Framework. Chosen due to my experience with it, and clean organization with URL routing. It was the best choice for the assessment.
**Frontend:** ReactJS. Also chosen for by best experience, and is famously paired with Django REST API. It also lets users filter customer list instantly without reloading.

### 2. Data Modeling and Risk-Scoring
The data set is loaded at the start from `Customer-Churn.csv`, and is parsed and managed as in-memory Pandas dataframe instance during runtime.
This is necessary to make Customer Outreach Records work.

Risk Scoring has been decided to be split into High, Medium, and Low risk ratings by using boolean logic from customer data. 
Please note: These ratings were **only** applied to customers who are NOT listed as 'Churn'
* **High Risk:** Short-Tenure users (`tenure <= 6`) who are on month-to-month contracts and who use MOPs like (`Electronic Check`), and higher-value accounts who pay more due to Fiber Optic (`MonthlyCharges > 80`).
* **Medium Risk:** Vulnerable demographics: Senior Citizens on flexible billing, or annual accounts nearing contract renewal.
* **Low Risk:** Normally classifies everyone into this, if they are on multi-year contracts or have long tenures (`tenure > 48`).

### 3. Pagination and Filtering
* **Pagination:** The UI shows customer data in batches of 50 per page. 
* **Server-Side Pipeline:** Django returns only 50 records per call to conserve processing load.

### 4. Error-Handling & Logging
* **Backend Logging:** Inside `settings.py`, the system creates records in terminal which detail the action performed.
  ```text
  [2026-10-06 14:54:22] LEVEL=INFO MODULE=views MESSAGE="STATE_TRANSITION SUCCESS customer_id=7590-VHVEG from=NOT_CONTACTED to=IN_PROGRESS"
  ```
* **Frontend Error Resilience:** React components are inside `try/catch` wrappers. If an error occurs, the workspace blocks application crashes by displaying an error page.

### 5. Testing Strategy Matrix
* **What is Covered:**
  * **Scoring Logic:** Complete multi-conditional data tests validate every mathematical rule boundary condition, data typing fallback, and overriding flag.
  * **Outreach State Transitions:** Custom integration mocks utilize `APIRequestFactory` and `@patch` to test that valid state movements evaluate smoothly (returning `200 OK`) while unauthorized jumps fail immediately (returning `400 Bad Request`).
* **What is Not Covered:** Browser DOM structural snapshot rendering checks.
* **Why:** When you're on a tight deadline, making sure the backend logic and state transitions actually work is much more important than checking if a few UI margins are slightly misaligned.

---

## 6. Roadmap

### Tradeoffs
1. **In-Memory Storage:** Cell updates are pushed straight into the runtime Pandas DataFrame memory matrix rather than a persistent SQL database layer. While incredibly fast for execution, restarting the Django terminal clears current outreach progress back to the default state.
2. **Simplified Authentication:** Per assignment, the app bypasses individual agent profile login workflows, assuming a single unified operator account access.

### "With More Time"
If given a multi-week production sprint:
* **Persistent Database Integration:** Swap out the in-memory dataframe cache for a permanent PostgreSQL/MySQL relational database infrastructure, using Django Migrations to manage schema fields securely.
* **Audit Trail Registry Table:** Build a historical ledger logging sub-table to capture exactly what was done, by who, when, and how.
* **Pagination**: I'd like to make variable pagination next time: Let users select page size, not a fixed amount.
* **Authentication:** I'd also like to create a login/credentials system, and use JWT to contact the API