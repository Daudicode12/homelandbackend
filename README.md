# Job Marketplace Backend API

## Project Description
A complete, production-ready backend API for a Job Marketplace, serving freelancers and employers. It features secure JWT authentication, strict Role-Based Access Control (RBAC), and a simulated Escrow Payment workflow. The system handles job postings, proposals, contracts, escrow funding, delivery, disputes, and automatic payouts completely decoupled from any ORM using native SQL parameterization to guarantee performance and security.

## Tech Stack
* **Node.js** & **Express.js** (Core API logic)
* **MySQL** (Relational Database)
* **mysql2/promise** (Raw SQL queries and atomic transactions)
* **JWT (jsonwebtoken)** (Stateless Authentication)
* **bcrypt** (Secure Password Hashing)
* **express-validator** (Request sanitization and validation)
* **Jest & Supertest** (Automated Integration Testing)
* **Postman** (API Collection)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd job-marketplace-api
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
# Application Port
PORT=8080

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=job_marketplace

# JWT Secrets for Token Signing
JWT_SECRET=supersecretjwtkey123
REFRESH_TOKEN_SECRET=supersecretrefreshkey123
```

---

## Running the Project

**Development Mode** (auto-restarts on changes):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

---

## Running Tests

Run the integration tests (powered by Jest and Supertest):
```bash
npm test
```
**Coverage:** The tests verify critical flows such as secure user registration, blocking access on wrong passwords, and strictly forbidding Freelancers from bypassing RBAC to create Jobs.

---

## Authentication Flow

1. **Register** ➔ 2. **Login** ➔ 3. **Receive Access & Refresh Tokens** ➔ 4. **Attach Access Token to `Authorization: Bearer <token>`** ➔ 5. **Access Protected Routes**

---

## Project Structure

```text
src/
├── config/        # Database and Environment configurations
├── controllers/   # Thin route handlers managing HTTP Requests/Responses
├── middleware/    # Authentication, Validation, and RBAC Guards
├── routes/        # Express router declarations mapping to controllers
├── services/      # Core business logic and raw parameterized SQL execution
├── utils/         # Helper functions (Token generation, Mock Receipts)
├── validators/    # express-validator schemas enforcing strict data rules
tests/             # Automated Jest + Supertest integration tests
database.sql       # Raw SQL schema definition to bootstrap tables
```

---

## Database Overview

- **`users`**: Stores authenticated entities (`freelancer` or `employer`).
- **`jobs`**: Stores job postings created exclusively by employers.
- **`proposals`**: Stores bids submitted by freelancers for specific jobs.
- **`contracts`**: Created instantly when an employer accepts a proposal.
- **`escrow`**: Ledger tracking employer deposits for active contracts.
- **`payments`**: Final transactional ledger tracking the 92% (Freelancer) / 8% (Platform) splits.
- **`disputes`**: Conflict resolution records for paused contracts.

---

## API Documentation

### **Authentication**

#### Register User
- **Purpose**: Create a new user account.
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0712345678",
    "password": "Password123",
    "role": "freelancer"
  }
  ```
- **Validation Rules**: Password requires minimum 8 characters, an uppercase letter, a lowercase letter, and a number. Role must be `freelancer` or `employer`.
- **Success (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "freelancer" }
  }
  ```

#### Login
- **Purpose**: Authenticate user and receive tokens.
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "accessToken": "eyJhb...",
      "refreshToken": "eyJhb..."
    }
  }
  ```

#### Refresh Token
- **Purpose**: Exchange a valid refresh token for a new access token.
- **Method**: `POST`
- **URL**: `/api/auth/refresh`
- **Auth**: None
- **Request Body**:
  ```json
  { "refreshToken": "eyJhb..." }
  ```
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "accessToken": "eyJhb..." }
  }
  ```

#### Current User
- **Purpose**: Fetch authenticated user profile.
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Auth**: Required
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "freelancer" }
  }
  ```

---

### **Jobs**

#### Get Jobs
- **Purpose**: Fetch all jobs with advanced filtering.
- **Method**: `GET`
- **URL**: `/api/jobs`
- **Auth**: None
- **Query Params**: `search`, `category`, `location`, `budget_min`, `budget_max`, `sort` (`newest`, `budget_high`, `budget_low`), `page`, `limit`
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "jobs": [...],
      "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
    }
  }
  ```

#### Get Job By ID
- **Purpose**: Retrieve specific job details including total proposal counts.
- **Method**: `GET`
- **URL**: `/api/jobs/:id`
- **Auth**: None
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "id": 1, "title": "...", "proposalCount": 3 }
  }
  ```

#### Create Job
- **Purpose**: Publish a new job.
- **Method**: `POST`
- **URL**: `/api/jobs`
- **Auth**: Required
- **Role**: `employer`
- **Request Body**:
  ```json
  {
    "title": "Build a React App",
    "description": "Looking for an expert React developer. Minimum 30 characters.",
    "category": "Web Development",
    "location": "Remote",
    "budget": 50000,
    "deadline": "2026-12-31T23:59:59.000Z"
  }
  ```
- **Success (201 Created)**: Returns the complete job object.

---

### **Proposals**

#### Submit Proposal
- **Purpose**: Bid on a specific job.
- **Method**: `POST`
- **URL**: `/api/jobs/:id/proposals`
- **Auth**: Required
- **Role**: `freelancer`
- **Request Body**:
  ```json
  {
    "cover_letter": "I have extensive experience. Here is why I am the best fit... (min 50 chars)",
    "proposed_budget": 45000,
    "timeline_days": 14
  }
  ```
- **Success (201 Created)**: Returns the newly created proposal.

#### Accept Proposal
- **Purpose**: Accept a bid. Rejects all other bids and automatically creates a Contract.
- **Method**: `PUT`
- **URL**: `/api/jobs/:id/proposals/:proposalId/accept`
- **Auth**: Required
- **Role**: `employer`
- **Success (200 OK)**:
  ```json
  { "success": true, "message": "Proposal accepted and contract created.", "data": {} }
  ```

---

### **Contracts**

#### Fund Contract
- **Purpose**: Employer deposits funds into the platform Escrow.
- **Method**: `POST`
- **URL**: `/api/contracts/:id/fund`
- **Auth**: Required
- **Role**: `employer`
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Escrow funded successfully.",
    "data": { "receiptNumber": "QJM7RT61SV", "status": "funded" }
  }
  ```

#### Deliver Contract
- **Purpose**: Freelancer flags the project as delivered.
- **Method**: `POST`
- **URL**: `/api/contracts/:id/deliver`
- **Auth**: Required
- **Role**: `freelancer`
- **Success (200 OK)**:
  ```json
  { "success": true, "message": "Work marked as delivered.", "data": { "status": "delivered" } }
  ```

#### Approve Contract
- **Purpose**: Employer approves the delivery, releasing the Escrow.
- **Method**: `POST`
- **URL**: `/api/contracts/:id/approve`
- **Auth**: Required
- **Role**: `employer`
- **Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Escrow released successfully.",
    "data": { "freelancerAmount": 41400, "platformFee": 3600 }
  }
  ```

#### Open Dispute
- **Purpose**: Halt the contract workflow.
- **Method**: `POST`
- **URL**: `/api/contracts/:id/dispute`
- **Auth**: Required
- **Role**: `employer` or `freelancer`
- **Request Body**:
  ```json
  { "reason": "The deliverables completely missed the mark." }
  ```
- **Success (200 OK)**:
  ```json
  { "success": true, "message": "Dispute opened successfully.", "data": {} }
  ```

---

### **Utilities**

#### Auto Release Escrow `autoReleaseEscrow()`
- **Type**: Internal Node.js standalone utility (Not exposed via HTTP).
- **Location**: `src/utils/autoReleaseEscrow.js`
- **Purpose**: Finds any contract in the `delivered` state older than 3 days. It executes the exact identical approval SQL transaction logic to payout the Freelancer automatically.

---

## Error Response Documentation

**400 Validation Error**
```json
{
  "success": false,
  "errors": { "title": "Title is required." }
}
```

**401 Unauthorized** (Invalid/Missing Token)
```json
{
  "success": false,
  "message": "Unauthorized."
}
```

**403 Forbidden** (Role mismatch or ownership violation)
```json
{
  "success": false,
  "message": "Access denied."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Contract not found."
}
```

**409 Conflict** (Duplicate proposals or out-of-order state transitions)
```json
{
  "success": false,
  "message": "Contract is already funded."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error."
}
```

---

## Testing Documentation

### 1. Using Postman
1. Open Postman.
2. Click **Import** and select the `postman_collection.json` file found in the root directory.
3. Once imported, the collection variables (`baseUrl`, `accessToken`, `refreshToken`, `jobId`, `proposalId`, `contractId`) are automatically initialized.
4. **Important**: When you run the `Login` request, Postman automatically captures your tokens and sets them to the Collection Variables, meaning subsequent protected requests will natively pass authentication!

### 2. Automated Jest Testing
To run the automated suite:
1. Ensure your `.env` is configured correctly.
2. Run `npm test`.
3. The framework uses `cross-env` alongside Node.js experimental VM modules to execute `supertest` natively in an ESM environment, connecting momentarily to your database and shutting down connections dynamically via the `afterAll()` lifecycle hooks.
