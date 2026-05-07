DeptTasks - RBAC Management SystemA streamlined Task Management application built to demonstrate Role-Based Access Control (RBAC) and department-level resource isolation.🚀 Quick Start1. PrerequisitesNode.js (v18 or higher)npm2. Backend SetupBashcd server
npm install
npm start
The server will run on http://localhost:5000.3. Frontend SetupBashcd client
npm install
npm run dev
The app will be available at http://localhost:5173.🛠 Technical Decisions & Assumptions1. Authentication & SessionMock Logic: I implemented a "User Persona Switcher" in the navigation bar to allow for seamless testing of different roles without needing a full registration/login flow.Identity Handling: Since this is a technical assessment focused on logic, I used a custom x-user-id header to pass the authenticated user's ID to the backend.Persistence: I opted for in-memory state for the active user. Note that refreshing the page resets the session to the default Admin (Alice). This was a deliberate choice to keep the assessment environment predictable and fast to reset.2. Authorization (The "Permission Matrix")Resource Isolation: I built a backend middleware factory requireRole that enforces two layers of security: Role verification (is the user an admin?) and Department isolation (is this Dept Head trying to touch a task outside their own department?).Fail-Fast Policy: Any unauthorized request (e.g., a Member attempting to delete a task) is met with an explicit 403 Forbidden response rather than just a silent failure.UI Safety: The interface dynamically renders buttons (Create/Delete) and filters assignee dropdowns based on the active user’s specific department and role.3. Data ManagementIn-Memory Store: For the scope of this assignment, I used a centralized in-memory store on the server. Data persists as long as the server is running but will reset to seed values upon a server restart.🧪 Testing the RequirementsRoleAccess LevelExpected BehaviorOrg AdminGlobalCan view all users and delete any task across any department.Dept HeadScopedCan only create/assign tasks to members within their own department.MemberPersonalCan only view tasks assigned to them; restricted to status updates only.Edge CaseUnauthorizedBackend blocks cross-department modifications even if UI is bypassed.📦 Project StructurePlaintext├── client/
│   ├── src/
│   │   ├── context/      # Global Auth & User state
│   │   ├── pages/        # Dashboard (Task View) & Admin (User View)
│   │   ├── services/     # API Fetch abstraction
│   │   └── types.ts      # Shared TypeScript interfaces
└── server/
    ├── src/
    │   ├── middleware/   # Custom RBAC & Auth logic
    │   ├── routes/       # Protected REST endpoints
    │   └── db/           # Initial JSON seed data
    └── server.js         # Entry point
⚠️ Known LimitationsNo Persistence: Data resets on server restart.Alert-based Errors: Used standard alert() calls for critical API errors to keep UI dependencies minimal while ensuring error visibility.Self-Demotion: Added a check to prevent Org Admins from accidentally changing their own role to Member, which would cause an immediate lockout.
