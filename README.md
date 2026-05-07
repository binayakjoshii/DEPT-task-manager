<div align="left">
  <h1>DeptTasks — RBAC Management System</h1>
  <p>A streamlined Task Management application built to demonstrate Role-Based Access Control (RBAC) and department-level resource isolation.</p>

  <hr />

  <h2> Quick Start</h2>

  <h3>1. Prerequisites</h3>
  <ul>
    <li>Node.js (v18 or higher)</li>
    <li>npm</li>
  </ul>

  <h3>2. Backend Setup</h3>
  <pre><code>cd server
npm install
npm start</code></pre>
  <p>The server will run on <b>http://localhost:5000</b>.</p>

  <h3>3. Frontend Setup</h3>
  <pre><code>cd client
npm install
npm run dev</code></pre>
  <p>The app will be available at <b>http://localhost:5173</b>.</p>

  <hr />

  <h2>Technical Decisions & Assumptions</h2>

  <h3>1. Authentication & Session</h3>
  <ul>
    <li><b>Mock Logic:</b> Implemented a "User Persona Switcher" in the navigation bar to allow for seamless testing of different roles without needing a full registration/login flow.</li>
    <li><b>Identity Handling:</b> Used a custom <code>x-user-id</code> header to pass the authenticated user's ID to the backend for authorization checks.</li>
    <li><b>Persistence:</b> Opted for in-memory state. Refreshing the page resets the session to the default Admin (Alice). This was a deliberate choice to keep the assessment environment predictable and fast to reset.</li>
  </ul>

  <h3>2. Authorization (The "Permission Matrix")</h3>
  <ul>
    <li><b>Resource Isolation:</b> Built a backend middleware factory <code>requireRole</code> that enforces Role verification and Department isolation. For example, a Dept Head is blocked from modifying tasks outside their own department.</li>
    <li><b>Fail-Fast Policy:</b> Any unauthorized request (e.g., a Member attempting to delete a task) is met with an explicit <code>403 Forbidden</code> response.</li>
    <li><b>UI Safety:</b> The interface dynamically renders buttons and filters assignee dropdowns based on the active user’s specific department and role.</li>
  </ul>

  <h3>3. Data Management</h3>
  <ul>
    <li><b>In-Memory Store:</b> I used a centralized in-memory store on the server. Data persists during the server's uptime but resets to seed values upon a restart.</li>
  </ul>

  <hr />

  <h2> Testing the Requirements</h2>
  <table width="100%" style="border-collapse: collapse; border: 1px solid #e2e8f0; text-align: left;">
    <thead>
      <tr style="background-color: #f8fafc;">
        <th style="padding: 12px; border: 1px solid #e2e8f0;">Role</th>
        <th style="padding: 12px; border: 1px solid #e2e8f0;">Access Level</th>
        <th style="padding: 12px; border: 1px solid #e2e8f0;">Expected Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0;"><b>Org Admin</b></td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Global</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Can view all users and delete any task across any department.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0;"><b>Dept Head</b></td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Scoped</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Can only create/assign tasks to members within their own department.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0;"><b>Member</b></td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Personal</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Can only view tasks assigned to them; restricted to status updates only.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0;"><b>Edge Case</b></td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Unauthorized</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">Backend blocks cross-department modifications even if UI is bypassed.</td>
      </tr>
    </tbody>
  </table>

  <hr />

  <h2> Project Structure</h2>
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

  <h2> Known Limitations</h2>
  <ul>
    <li><b>No Persistence:</b> Data resets on server restart.</li>
    <li><b>Alert-based Errors:</b> Used standard <code>alert()</code> calls for critical API errors to keep UI dependencies minimal.</li>
    <li><b>Self-Demotion:</b> Added a check to prevent Org Admins from accidentally demoting themselves to Member, preventing lockout.</li>
  </ul>
</div>
