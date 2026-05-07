const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateMockUser, requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateMockUser);

router.get('/', (req, res) => {
  const { role, department, id: userId } = req.user;

  if (role === 'org_admin') return res.json(db.tasks);

  if (role === 'dept_head') {
    const deptTasks = db.tasks.filter(t => t.department === department);
    return res.json(deptTasks);
  }

  const personalTasks = db.tasks.filter(t => t.assignedTo === userId);
  res.json(personalTasks);
});

router.post('/', requireRole(['org_admin', 'dept_head']), (req, res) => {
  const { title, department, assignedTo, status } = req.body;
  const { role, department: userDept } = req.user;


  if (role === 'dept_head') {
    if (department !== userDept) {
      return res.status(403).json({ error: "Cannot create tasks for other departments" });
    }

    const assignee = db.users.find(u => u.id === Number(assignedTo));
    if (!assignee || assignee.department !== userDept) {
      return res.status(403).json({ error: "Assignee must belong to your department" });
    }
  }

  const newTask = {
    id: db.tasks.length ? Math.max(...db.tasks.map(t => t.id)) + 1 : 1,
    title,
    department,
    assignedTo: Number(assignedTo),
    status: status || 'todo'
  };

  db.tasks.push(newTask);
  res.status(201).json(newTask);
});

router.patch('/:id/status', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { status } = req.body;
  const { role, department, id: userId } = req.user;

  const task = db.tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const canUpdate = 
    role === 'org_admin' || 
    (role === 'dept_head' && task.department === department) || 
    (role === 'member' && task.assignedTo === userId);

  if (!canUpdate) {
    return res.status(403).json({ error: "Forbidden: You are not authorized to update this task" });
  }

  task.status = status;
  res.json(task);
});


router.delete('/:id', requireRole(['org_admin', 'dept_head']), (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { role, department } = req.user;
  const taskIndex = db.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });
  const task = db.tasks[taskIndex];

  if (role === 'dept_head' && task.department !== department) {
    return res.status(403).json({ error: "Forbidden: You can only delete tasks within your department" });
  }

  db.tasks.splice(taskIndex, 1);
  res.status(204).send(); 
});

module.exports = router;