let db = {
  users: [
    { id: 1, name: "Alice", role: "org_admin", department: "engineering" },
    { id: 2, name: "Bob", role: "dept_head", department: "engineering" },
    { id: 3, name: "Charlie", role: "member", department: "engineering" },
    { id: 4, name: "Diana", role: "dept_head", department: "design" },
    { id: 5, name: "Eve", role: "member", department: "design" },
    { id: 6, name: "Frank", role: "member", department: "engineering" }
  ],
  tasks: [
    { id: 1, title: "Fix login bug", department: "engineering", assignedTo: 3, status: "in_progress" },
    { id: 2, title: "Design new landing page", department: "design", assignedTo: 5, status: "todo" },
    { id: 3, title: "API refactor", department: "engineering", assignedTo: 6, status: "completed" }
  ]
};

module.exports = db;