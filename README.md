# Green Valley Public School - School Management System
**Location:** Urban Estate Phase II, Jalandhar, Punjab - 144022, India  
**Affiliation:** Central Board of Secondary Education (CBSE), New Delhi &bull; Affiliation No: 1630892  
**Phone:** +91 98765 43210 &bull; **Email:** info@greenvalleyschool.example  

---

## 1. Project Overview & Philosophy
The **Green Valley Public School Management System** is built on the philosophy of:
> **Simple Code + Clean UI + Real Functionality + Easy AWS Integration.**

It is designed as a developer and student project with **no complex frameworks** (pure **HTML5**, **CSS3**, **Vanilla JavaScript**), delivering high reliability, complete role-based workflows (Admin, Teacher, Student, Parent), and a fully decoupled **AWS Serverless Architecture**.

---

## 2. Technology Requirements
- **Frontend:** HTML5, Vanilla CSS3 (Custom Design System), Vanilla JavaScript (ES6+ Modules)
- **Local Dev Layer:** In-browser persistent database engine with pre-seeded realistic Jalandhar student, teacher, fee, and exam data.
- **Backend (AWS Production):**
  - **Amazon Cognito:** User authentication, JWT tokens, Role Groups (`Admin`, `Teacher`, `Student`, `Parent`).
  - **Amazon DynamoDB:** Pay-per-request NoSQL tables.
  - **AWS Lambda:** Node.js 20.x serverless handlers with least-privilege IAM policies.
  - **Amazon API Gateway:** REST API with CORS and Cognito Authorizers.
  - **Amazon S3:** Private student documents/photos and static web asset hosting.
  - **Amazon CloudFront:** Global HTTPS content delivery network.
  - **Amazon CloudWatch:** Lambda logs, execution metrics, and error monitoring.

---

## 3. Project Directory Structure
```text
school-management-system/
│
├── index.html              # School portal landing page & quick links
├── login.html              # Multi-role login with 9 demo accounts & Cognito
├── 403.html                # Access Denied / Forbidden security interception page
├── dashboard.html          # Role-adaptive metrics, charts, announcements
│
├── students.html           # Student CRUD, admissions, filters, Jalandhar addresses
├── teachers.html           # Faculty management, qualifications, class in-charges
├── classes.html            # Nursery to Class 12, sections (A, B, C), room capacity
├── subjects.html           # Configurable CBSE curriculum (Punjabi, Maths, Science, etc.)
├── attendance.html         # Daily roll-call, status (P/A/L/Leave), percentage stats
├── exams.html              # Exam scheduler (Unit Test, Term, Pre-Board)
├── marks.html              # Marks entry, live CBSE 9-point grade computation
├── results.html            # Printable student report cards with school crest
├── assignments.html        # Homework tracking, deadlines & status
├── announcements.html      # School notices filtered by audience
├── fees.html               # Fee ledger (Tuition, Annual, Transport), INR receipts
├── timetable.html          # Interactive weekly timetable matrix
├── library.html            # Library catalog, book issue/return & overdue fines
├── users.html              # System user directory & RBAC role assignments
├── audit-logs.html         # Real-time security and administrative audit trail
├── profile.html            # User profile view, contact details & permissions
├── reports.html            # Multi-module reports & CSV export
├── settings.html           # School profile, CBSE grading & AWS cloud switcher
│
├── css/
│   ├── style.css           # Global tokens, typography, forms, tables, modals, badges
│   ├── dashboard.css       # Sidebar, topbar, metric cards, notice list, print rules
│   └── responsive.css      # Mobile drawer, hamburger menu, tablet adaptation
│
├── js/
│   ├── config.js           # Environment switcher & non-secret AWS endpoints
│   ├── utils.js            # Formatters (INR ₹, Indian dates, CBSE grades, CSV)
│   ├── permissions.js      # Declarative RBAC permission matrix & page route guards
│   ├── api.js              # Unified data client with RBAC authorization & data filtering
│   ├── auth.js             # 9-role session manager, ward switcher & Cognito integration
│   ├── app.js              # Layout orchestrator, sidebar navigation & URL interception
│   ├── students.js         # Student CRUD & permission-aware actions
│   ├── teachers.js         # Faculty CRUD & permission-aware actions
│   ├── classes.js          # Class and section controller
│   ├── subjects.js         # Subject catalog logic
│   ├── attendance.js       # Daily attendance engine & role restrictions
│   ├── exams.js            # Exam scheduler logic
│   ├── marks.js            # Marks entry & grade calculator
│   ├── results.js          # Report card generator
│   ├── assignments.js      # Assignment tracking
│   ├── announcements.js    # Circulars and notice board
│   ├── fees.js             # Fee management & printable receipt
│   ├── timetable.js        # Weekly routine matrix
│   ├── library.js          # Library books & issue tracker
│   ├── users.js            # User accounts & role management controller
│   ├── audit-logs.js       # Security audit trail viewer & CSV export
│   ├── profile.js          # User profile view controller
│   └── reports.js          # CSV downloader & report printer
│
├── assets/
│   ├── images/logo.svg     # School crest with rising sun & open book
│   └── icons/              # Clean inline SVG system icons
│
├── aws-backend/
│   ├── template.yaml       # AWS SAM template with 9 Cognito Groups & DynamoDB tables
│   ├── openapi.yaml        # API Gateway OpenAPI 3.0 specification with RBAC scopes
│   └── lambdas/
│       ├── student-api/index.js
│       ├── teacher-api/index.js
│       ├── attendance-api/index.js
│       ├── marks-api/index.js
│       ├── fee-api/index.js
│       ├── announcement-api/index.js
│       ├── user-api/index.js
│       ├── audit-api/index.js
│       └── library-api/index.js
│
├── README.md               # Complete documentation & AWS guide
└── .gitignore              # Ignored files
```

---

## 4. Local Development (Offline Mode)
The application is **100% functional out of the box** without requiring an AWS account.

### Running Locally:
1. Open terminal in this folder and start any simple HTTP server:
   ```bash
   python -m http.server 8085
   ```
   Or:
   ```bash
   npx serve .
   ```
2. Navigate in your browser to: `http://localhost:8085`
3. Click **Access School Management System** or visit `login.html`.

### Pre-Seeded Demo Accounts (All 9 Roles):
| Role | Email | Password | Name | Access Scope |
|---|---|---|---|---|
| **Super Admin** | `superadmin@greenvalleyschool.example` | `Super@123` | Col. Balbir Singh Dhillon | Complete system authority, all data, cloud security master |
| **Admin** | `admin@greenvalleyschool.example` | `Admin@123` | Dr. Jaswant Singh Ahluwalia | Daily operations, staff & students, cannot modify Super Admin |
| **Principal** | `principal@greenvalleyschool.example` | `Principal@123` | Mrs. Manpreet Kaur Gill | Academic oversight, teacher evaluation, approvals, reports |
| **Teacher** | `harpreet.singh@greenvalleyschool.example` | `Teacher@123` | Harpreet Singh Sandhu | Scoped to assigned Class 10-A and Mathematics subject |
| **Student** | `arshdeep.singh@greenvalleyschool.example` | `Student@123` | Arshdeep Singh | Own attendance, marks, report card, homework, fees |
| **Parent** | `gurmeet.singh@greenvalleyschool.example` | `Parent@123` | Gurmeet Singh | Multi-child switcher: Arshdeep (10-A) & Simranjit (8-B) |
| **Accountant** | `accountant@greenvalleyschool.example` | `Accounts@123` | Davinder Kaur | Fee collection, invoices, pending dues, receipts, financial reports |
| **Librarian** | `librarian@greenvalleyschool.example` | `Library@123` | Paramjit Singh | Book inventory, issue/return tracker, overdue fines |
| **Receptionist** | `receptionist@greenvalleyschool.example` | `FrontDesk@123` | Simranjeet Kaur | Front desk, visitor logs, new student admissions, announcements |

*(You can also simply click the "Quick Demo Accounts" pill buttons on `login.html` to auto-fill credentials instantly!)*

---

## 4.1 Role-Based Access Control (RBAC) Architecture

The system enforces permissions at **three distinct layers**, guaranteeing that no user can bypass restrictions simply by editing HTML/JS, manually altering DOM elements, or typing URLs directly:

```text
┌─────────────────────────────────────────────────────────────────┐
│                      1. Frontend UI Layer                       │
│  - Dynamic navigation menu rendered per role                    │
│  - Action buttons (Add, Edit, Delete) hidden/disabled per perm  │
│  - Immediate route interception redirects unauthorized URLs to  │
│    403.html (Access Denied / Forbidden)                         │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   2. Backend / API Gateway Layer                │
│  - Cognito JWT tokens carrying user group & custom:role claims  │
│  - Lambda handlers verify caller role against required perms    │
│  - Unauthorized API requests return 403 Forbidden HTTP status   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               3. Database & Data Filtering Layer                │
│  - Least-privilege data scoping at query/read time:             │
│    • Teacher: only sees students & marks for assigned class     │
│    • Student: only sees own records, fees, and report cards     │
│    • Parent: only sees linked children (with active switcher)   │
│    • Accountant: only sees fee ledgers & payment records        │
│    • Super Admin: full access; Admin cannot edit Super Admin    │
│  - All sensitive events logged to immutable Audit Trail         │
└─────────────────────────────────────────────────────────────────┘
```

### RBAC Permission Matrix Summary
| Resource / Module | Super Admin | Admin | Principal | Teacher | Student | Parent | Accountant | Librarian | Receptionist |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | Full Metrics | Full Metrics | Academic | Class-Scoped | Own Metrics | Child Metrics | Financial | Library | Front Desk |
| **Students** | CRUD | CRUD | View / Edit | Assigned Class | Own Only | Child Only | - | - | Create / View |
| **Faculty** | CRUD | CRUD | View / Edit | Directory | - | - | - | - | Directory |
| **Marks & Results** | View | View | View / Approve | Enter Marks | Own Results | Child Results | - | - | - |
| **Attendance** | Full | Full | Full | Mark Class | Own Stats | Child Stats | - | - | - |
| **Fees & Accounts** | Full | Full | View | - | Own Receipts | Child Receipts | Collect / Invoices | - | - |
| **Library** | Full | Full | View | Borrow / View | Borrow / View | - | - | Full Catalog | - |
| **User Directory** | Manage All | Manage Staff* | View Staff | - | - | - | - | - | - |
| **Audit Logs** | Full Logs | View Logs | - | - | - | - | - | - | - |

*\*Note: Admin is explicitly prevented from altering or deleting Super Admin accounts.*

---

## 5. Recommended AWS Architecture

```text
INTERNET
   │
   ▼
┌─────────────────────────┐
│ Amazon CloudFront (CDN) │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     Amazon S3 Bucket    │
│  (Static Web Assets)    │
│    HTML / CSS / JS      │
└─────────────────────────┘
            │
         API Calls
            │
            ▼
┌─────────────────────────┐       ┌────────────────────────┐
│   Amazon API Gateway    │ <---> │     Amazon Cognito     │
│   (REST API + CORS)     │       │ (Authentication & JWT) │
└───────────┬─────────────┘       └────────────────────────┘
            │
            ▼
┌─────────────────────────┐       ┌────────────────────────┐
│     AWS Lambda Core     │ <---> │   Amazon CloudWatch    │
│ (student, teacher, etc) │       │ (Logs, Metrics, Alarm) │
└───────────┬─────────────┘       └────────────────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
┌──────────────┐ ┌──────────────┐
│Amazon DynamoDB│ │  Amazon S3   │
│ (NoSQL Data) │ │(Private Docs)│
└──────────────┘ └──────────────┘
```

---

## 6. AWS DEPLOYMENT ORDER
Deploy services in this exact order to ensure dependencies are resolved cleanly:
```text
1. AWS Account Setup
       ↓
2. IAM Roles & Policies
       ↓
3. Amazon Cognito User Pool & Groups
       ↓
4. Amazon DynamoDB Tables
       ↓
5. Amazon S3 Storage Buckets
       ↓
6. AWS Lambda Functions
       ↓
7. Amazon API Gateway & Routes
       ↓
8. Amazon CloudFront Distribution
       ↓
9. Amazon CloudWatch Monitoring
       ↓
10. Connect Frontend & End-to-End Test
```

---

## 7. AWS DEPLOYMENT GUIDE (Step-by-Step)

### Step 1 — Create S3 Buckets
1. **Frontend Hosting Bucket:**
   - Create S3 bucket: `gvps-frontend-jalandhar` in region `ap-south-1` (Mumbai).
   - Keep "Block all public access" **enabled** (CloudFront will serve the content securely via Origin Access Control).
   - Upload all frontend files (`index.html`, `login.html`, `css/`, `js/`, `assets/`, etc.).
2. **Private Documents Bucket:**
   - Create S3 bucket: `gvps-school-documents-jalandhar`.
   - Enable Server-Side Encryption (AES-256).
   - Block all public access. Sensitive student photos and mark sheets must never be public.

### Step 2 — Create CloudFront Distribution
1. In CloudFront Console, click **Create Distribution**.
2. **Origin Domain:** Select your frontend S3 bucket `gvps-frontend-jalandhar.s3.ap-south-1.amazonaws.com`.
3. **Origin Access:** Select **Origin Access Control (OAC)** and create a new OAC profile.
4. **Viewer Protocol Policy:** Choose **Redirect HTTP to HTTPS**.
5. **Default Root Object:** Set to `index.html`.
6. Copy the S3 bucket policy provided by CloudFront and attach it to your frontend S3 bucket.

### Step 3 — Create Amazon Cognito User Pool
1. Go to **Cognito** &rarr; **Create User Pool**.
2. **Sign-in Options:** Email.
3. **Password Policy:** Minimum 8 characters, uppercase, lowercase, numbers.
4. **App Client:** Create a public client named `gvps-web-client` (Do NOT generate a client secret for browser JS).
5. **User Groups:** Create 4 groups:
   - `Admin`
   - `Teacher`
   - `Student`
   - `Parent`
6. Create initial users and assign them to their respective groups.

### Step 4 — Create Amazon DynamoDB Tables
Create the following tables in region `ap-south-1` with **On-Demand (PAY_PER_REQUEST)** billing:
| Table Name | Partition Key (HASH) | Description |
|---|---|---|
| `GVPS_Students` | `id` (String) | Enrolled student records |
| `GVPS_Teachers` | `id` (String) | Faculty members |
| `GVPS_Classes` | `id` (String) | Class divisions & rooms |
| `GVPS_Subjects` | `id` (String) | Curriculum catalog |
| `GVPS_Attendance` | `id` (String) | Daily roll-call entries |
| `GVPS_Exams` | `id` (String) | Exam schedules |
| `GVPS_Marks` | `id` (String) | Student grades & marks |
| `GVPS_Fees` | `id` (String) | Fee ledgers & receipts |
| `GVPS_Announcements` | `id` (String) | Circulars & notices |
| `GVPS_Timetable` | `id` (String) | Weekly period allotments |

### Step 5 — Deploy Lambda Functions
You can use the provided **AWS SAM** template (`aws-backend/template.yaml`) for one-click deployment:
```bash
cd aws-backend
sam build
sam deploy --guided
```
Or manually create functions in AWS Console:
- Runtime: `Node.js 20.x`
- Architecture: `x86_64` or `arm64`
- Handlers in `aws-backend/lambdas/`:
  - `student-api`
  - `teacher-api`
  - `attendance-api`
  - `marks-api`
  - `fee-api`
  - `announcement-api`
- Attach Environment Variables: `STUDENTS_TABLE=GVPS_Students`, etc.

### Step 6 — Configure Amazon API Gateway
1. Create a REST API named `GVPS-School-API`.
2. Create Resources and Methods corresponding to `aws-backend/openapi.yaml`:
   - `/students` (GET, POST), `/students/{id}` (GET, PUT, DELETE)
   - `/teachers` (GET, POST), `/teachers/{id}` (PUT, DELETE)
   - `/attendance` (GET, POST)
   - `/marks` (GET, POST)
   - `/fees` (GET, POST)
   - `/announcements` (GET, POST)
3. Connect each route to its corresponding Lambda function with Lambda Proxy Integration.
4. Add **Cognito Authorizer**:
   - Type: Cognito
   - User Pool: `gvps-user-pool-jalandhar`
   - Token Source: `Authorization`
5. Enable **CORS** on all resources.
6. Deploy API to stage `prod`.

### Step 7 — Configure Secure S3 File Storage
- For student passport photos and report cards, generate S3 Presigned URLs from Lambda (`getSignedUrl` from `@aws-sdk/s3-request-presigner`).
- The frontend uploads or reads images directly via the presigned URL with an expiry time of 15 minutes.

### Step 8 — CloudWatch Monitoring
1. Lambda automatically logs all `console.log` and `console.error` events into CloudWatch Log Groups `/aws/lambda/<function-name>`.
2. In CloudWatch, create a Metric Alarm for **API Gateway 5XX Errors** (> 5 in 5 minutes) with an email alert.

### Step 9 — IAM Least-Privilege Roles
- Never use the AWS root account.
- Never commit `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` to code.
- Lambda execution role requires only:
  - `AWSLambdaBasicExecutionRole`
  - DynamoDB read/write permissions scoped strictly to `arn:aws:dynamodb:ap-south-1:*:table/GVPS_*`

### Step 10 — Connect Frontend to AWS
Update `js/config.js` or navigate to `settings.html` and update:
```javascript
const APP_CONFIG = {
  ENVIRONMENT: 'PRODUCTION',
  USE_AWS_BACKEND: true,

  AWS: {
    REGION: 'ap-south-1',
    API_BASE_URL: 'https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod',
    COGNITO_USER_POOL_ID: 'ap-south-1_xxxxxxxxx',
    COGNITO_CLIENT_ID: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    S3_BUCKET_NAME: 'gvps-school-documents-jalandhar',
    CLOUDFRONT_DOMAIN: 'https://d111111abcdef8.cloudfront.net'
  }
};
```
Upload the updated files to your S3 frontend bucket and invalidate the CloudFront cache (`/*`).

---

## 8. Testing Verification Matrix
| Module | Test Case | Status |
|---|---|---|
| **Authentication** | Admin, Teacher, Student, Parent logins & invalid password rejection | PASS |
| **Students** | Add student with Jalandhar address, edit, search, filter by class, CSV export | PASS |
| **Teachers** | Add faculty, assign subject & class in-charge, deactivate | PASS |
| **Classes** | Create class & section, seat capacity stats | PASS |
| **Subjects** | Add subject, configure weekly periods & categories | PASS |
| **Attendance** | Roll-call for Class 10-A, P/A/L/Leave buttons, percentage calculation | PASS |
| **Exams** | Schedule Half-Yearly Exam, Unit Test, Pre-Boards | PASS |
| **Marks Entry** | Enter scores, live percentage, CBSE grade (A1 to E), pass/fail | PASS |
| **Results** | Generate official printable CBSE Report Card with School Crest | PASS |
| **Fees** | Record fee payment, calculate pending balance, generate printable receipt | PASS |
| **Timetable** | Weekly schedule matrix with recess period & room numbers | PASS |
| **Reports** | Master student, fee ledger, and marks reports with CSV download | PASS |
| **Responsive** | Mobile hamburger drawer, adaptive cards, print styles | PASS |
| **AWS Readiness** | SAM template validation, OpenAPI 3.0 spec, decoupled config | PASS |

---

## 9. Application Screenshots

All screenshots are taken from the live running application at **1920×1080** resolution. No mock-ups or placeholders.

### Screenshot Index

| # | Screen | File | Category |
|---|--------|------|----------|
| 01 | School Portal Landing Page | `screenshots/01_landing_page.png` | Public |
| 02 | Login Page | `screenshots/02_login_page.png` | Public |
| 03 | Login Page (Credentials Filled) | `screenshots/03_login_filled.png` | Public |
| 04 | Admin Dashboard | `screenshots/04_admin_dashboard.png` | Core Module |
| 05 | Student Management | `screenshots/05_students.png` | Core Module |
| 06 | Teacher Management | `screenshots/06_teachers.png` | Core Module |
| 07 | Class Management | `screenshots/07_classes.png` | Core Module |
| 08 | Subject Management | `screenshots/08_subjects.png` | Core Module |
| 09 | Attendance Tracking | `screenshots/09_attendance.png` | Core Module |
| 10 | Exam Scheduler | `screenshots/10_exams.png` | Core Module |
| 11 | Marks Entry | `screenshots/11_marks.png` | Core Module |
| 12 | Results / Report Cards | `screenshots/12_results.png` | Core Module |
| 13 | Assignments | `screenshots/13_assignments.png` | Core Module |
| 14 | Announcements | `screenshots/14_announcements.png` | Core Module |
| 15 | Fee Management | `screenshots/15_fees.png` | Core Module |
| 16 | Timetable | `screenshots/16_timetable.png` | Core Module |
| 17 | Reports | `screenshots/17_reports.png` | Core Module |
| 18 | Library Management | `screenshots/18_library.png` | Core Module |
| 19 | User Management | `screenshots/19_user_management.png` | Core Module |
| 20 | Settings | `screenshots/20_settings.png` | Core Module |
| 21 | User Profile | `screenshots/21_profile.png` | Core Module |
| 22 | Audit Logs | `screenshots/22_audit_logs.png` | Core Module |
| 23 | Access Denied (403) | `screenshots/23_access_denied.png` | Security |
| 24 | Super Admin Dashboard | `screenshots/roles/super_admin_dashboard.png` | RBAC - Role View |
| 25 | Admin Dashboard | `screenshots/roles/admin_dashboard.png` | RBAC - Role View |
| 26 | Principal Dashboard | `screenshots/roles/principal_dashboard.png` | RBAC - Role View |
| 27 | Teacher Dashboard | `screenshots/roles/teacher_dashboard.png` | RBAC - Role View |
| 28 | Student Dashboard | `screenshots/roles/student_dashboard.png` | RBAC - Role View |
| 29 | Parent Dashboard | `screenshots/roles/parent_dashboard.png` | RBAC - Role View |
| 30 | Accountant Dashboard | `screenshots/roles/accountant_dashboard.png` | RBAC - Role View |
| 31 | Librarian Dashboard | `screenshots/roles/librarian_dashboard.png` | RBAC - Role View |
| 32 | Receptionist Dashboard | `screenshots/roles/receptionist_dashboard.png` | RBAC - Role View |
| 33 | RBAC Access Denied (Student → Users) | `screenshots/roles/rbac_access_denied_student.png` | RBAC - Security |

---

### 9.1 Public Pages

**Landing Page** — School portal home with quick links and school information.

![Landing Page](screenshots/01_landing_page.png)

**Login Page** — Multi-role login supporting 9 demo accounts with one-click Quick Demo fill buttons.

![Login Page](screenshots/02_login_page.png)

**Login Page (Filled)** — Login form with credentials filled, ready to submit.

![Login Filled](screenshots/03_login_filled.png)

---

### 9.2 Admin Dashboard & Core Modules

**Admin Dashboard** — Central command panel with statistics for students, teachers, attendance, fees, and recent activity.

![Admin Dashboard](screenshots/04_admin_dashboard.png)

**Student Management** — Full CRUD for student records with Jalandhar addresses, class/section filters, and CSV export.

![Students](screenshots/05_students.png)

**Teacher Management** — Faculty directory with qualifications, assigned classes, subjects, and status management.

![Teachers](screenshots/06_teachers.png)

**Class Management** — Class and section configuration from Nursery to Class 12 with room capacity tracking.

![Classes](screenshots/07_classes.png)

**Subject Management** — CBSE curriculum catalog with subject categories and weekly period configuration.

![Subjects](screenshots/08_subjects.png)

**Attendance Tracking** — Daily roll-call with Present / Absent / Late / Leave status and percentage statistics.

![Attendance](screenshots/09_attendance.png)

**Exam Scheduler** — Schedule Unit Tests, Half-Yearly, Pre-Boards, and Final exams with date/time management.

![Exams](screenshots/10_exams.png)

**Marks Entry** — Live CBSE 9-point grade computation (A1–E) with real-time percentage calculation.

![Marks](screenshots/11_marks.png)

**Results / Report Cards** — Printable official CBSE report cards with school crest and grade summary.

![Results](screenshots/12_results.png)

**Assignments** — Homework tracking with deadlines, submission status, and subject-wise filters.

![Assignments](screenshots/13_assignments.png)

**Announcements** — School circulars and notice board filtered by audience (All / Teachers / Students / Parents).

![Announcements](screenshots/14_announcements.png)

**Fee Management** — Fee ledger with Tuition / Annual / Transport categories, INR receipt generation, and pending dues.

![Fees](screenshots/15_fees.png)

**Timetable** — Interactive weekly timetable matrix with recess periods and room numbers.

![Timetable](screenshots/16_timetable.png)

**Reports** — Multi-module report center with student master list, fee ledger, and marks reports with CSV download.

![Reports](screenshots/17_reports.png)

**Library Management** — Book catalog, issue/return tracker, and overdue fine management.

![Library](screenshots/18_library.png)

**User Management** — System user directory with RBAC role assignment and account status control.

![User Management](screenshots/19_user_management.png)

**Settings** — School profile configuration, CBSE grading setup, and AWS cloud connection switcher.

![Settings](screenshots/20_settings.png)

**User Profile** — Logged-in user profile with contact details, role, designation, and active permissions.

![Profile](screenshots/21_profile.png)

**Audit Logs** — Real-time security and administrative audit trail with CSV export.

![Audit Logs](screenshots/22_audit_logs.png)

---

### 9.3 Security — Access Denied Page

**403 Forbidden Page** — Shown when a user attempts to access a page not permitted by their role.

![Access Denied](screenshots/23_access_denied.png)

---

### 9.4 Role-Specific Dashboards (RBAC)

Each role sees a completely different dashboard with data and actions scoped to their permissions.

**Super Admin Dashboard** — Full system authority. Complete metrics, cloud health, all data, security master.

![Super Admin Dashboard](screenshots/roles/super_admin_dashboard.png)

**Admin Dashboard** — Daily operations view. Students, staff, fees, announcements. Cannot modify Super Admin accounts.

![Admin Dashboard](screenshots/roles/admin_dashboard.png)

**Principal Dashboard** — Academic oversight. Teacher evaluations, attendance summaries, exam approvals, class performance.

![Principal Dashboard](screenshots/roles/principal_dashboard.png)

**Teacher Dashboard** — Scoped to assigned class (Class 10-A, Mathematics). Attendance, marks entry, assignments.

![Teacher Dashboard](screenshots/roles/teacher_dashboard.png)

**Student Dashboard** — Personal view only. Own attendance percentage, marks, results, assignments, fee receipts.

![Student Dashboard](screenshots/roles/student_dashboard.png)

**Parent Dashboard** — Multi-child switcher (Arshdeep 10-A / Simranjit 8-B). Child attendance, marks, fee status.

![Parent Dashboard](screenshots/roles/parent_dashboard.png)

**Accountant Dashboard** — Financial operations only. Fee collection, invoices, pending dues, receipts, financial reports.

![Accountant Dashboard](screenshots/roles/accountant_dashboard.png)

**Librarian Dashboard** — Library operations only. Book inventory, issue/return tracker, overdue fines, catalog management.

![Librarian Dashboard](screenshots/roles/librarian_dashboard.png)

**Receptionist Dashboard** — Front desk operations. Visitor logs, new student admission intake, announcements, teacher directory.

![Receptionist Dashboard](screenshots/roles/receptionist_dashboard.png)

---

### 9.5 RBAC Enforcement — Access Denied in Action

**Student Attempting Admin Page** — When a Student account tries to access the User Management page directly via URL, the system intercepts and displays the 403 Access Denied screen. This demonstrates that RBAC is enforced at the **route level**, not just by hiding menu items.

![RBAC Access Denied — Student](screenshots/roles/rbac_access_denied_student.png)
