<!DOCTYPE html>
<html lang="en">
<body>

    <h1>DeptTasks — RBAC Management System</h1>
    <p>A streamlined Task Management application built to demonstrate Role-Based Access Control (RBAC) and department-level resource isolation.</p>

    <hr />

    <h2>🚀 Quick Start</h2>

    <h3>1. Prerequisites</h3>
    <ul>
        <li>Node.js (v18 or higher)</li>
        <li>npm</li>
    </ul>

    <h3>2. Backend Setup</h3>
    <pre><code>cd server
npm install
npm start</code></pre>
    <p>The server will run on <strong>http://localhost:5000</strong>.</p>

    <h3>3. Frontend Setup</h3>
    <pre><code>cd client
npm install
npm run dev</code></pre>
    <p>The app will be available at <strong>http://localhost:5173</strong>.</p>

    <hr />

    <h2>🛠 Technical Decisions & Assumptions</h2>

    <h3>1. Authentication & Session</h3>
    <ul>
        <li><strong>Mock Logic:</strong> I implemented a "User Persona Switcher" in the navigation bar to allow for seamless testing of different roles without needing a full registration/login flow.</li>
        <li><strong>Identity Handling:</strong> Since this is a technical assessment focused on logic, I used a custom <code>x-user-id</code> header to pass the authenticated user's ID to the backend.</li>
        <li><strong>Persistence:</strong> I opted for in-memory state for the active user. Refreshing the page resets the session to the default Admin (Alice). This keeps the assessment environment predictable and fast to reset.</li>
    </ul>

    <h3>2. Authorization (The "Permission Matrix")</h3>
    <ul>
        <li><strong>Resource Isolation:</strong> I built a backend middleware factory <code>requireRole</code> that enforces Role verification and Department isolation. For example, a Dept Head is blocked from modifying tasks outside their own department.</li>
        <li><strong>Fail-Fast Policy:</strong> Any unauthorized request (e.g., a Member attempting to delete a task) is met with an explicit <code>403 Forbidden</code> response.</li>
        <li><strong>UI Safety:</strong> The interface dynamically renders buttons and filters assignee dropdowns based on the active user’s specific department and role.</li>
    </ul>

    <h3>3. Data Management</h3>
    <ul>
        <li><strong>In-Memory Store:</strong> I used a centralized in-memory store on the server. Data persists during the server's uptime but resets to seed values upon a restart.</li>
    </ul>

    <hr />

    <h2>🧪 Testing the Requirements</h2>
    <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr style="background-color: #f8f9fa;">
                <th>Role</th>
                <th>Access Level</th>
                <th>Expected Behavior</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Org Admin</strong></td>
                <td>Global</td>
                <td>Can view all users and delete any task across any department.</td>
            </tr>
            <tr>
                <td><strong>Dept Head</strong></td>
                <td>Scoped</td>
                <td>Can only create/assign tasks to members within their own department.</td>
            </tr>
            <tr>
                <td><strong>Member</strong></td>
                <td>Personal</td>
                <td>Can only view tasks assigned to them; restricted to status updates only.</td>
            </tr>
            <tr>
                <td><strong>Edge Case</strong></td>
                <td>Unauthorized</td>
                <td>Backend blocks cross-department modifications even if UI is bypassed.</td>
            </tr>
        </tbody>
    </table>

    <hr />

    <h2>📦 Project Structure</h2>
    <pre><code>├── client/
│   ├── src/
│   │   ├── context/      # Global Auth & User state
│   │   ├── pages/        # Dashboard & Admin views
│   │   └── services/     # API Fetch abstraction
└── server/
    ├── src/
    │   ├── middleware/   # Custom RBAC & Auth logic
    │   └── routes/       # Protected REST endpoints
    └── server.js         # Entry point</code></pre>

    <hr />

    <h2>⚠️ Known Limitations</h2>
    <ul>
        <li><strong>No Persistence:</strong> Data resets on server restart.</li>
        <li><strong>Alert-based Errors:</strong> Used standard <code>alert()</code> calls for critical API errors to keep UI dependencies minimal.</li>
        <li><strong>Self-Demotion:</strong> Added a check to prevent Org Admins from accidentally demoting themselves to Member, preventing lockout.</li>
    </ul>

</body>
</html>
