const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateMockUser, requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateMockUser);
router.use(requireRole(['org_admin']));


router.get('/', (req, res) => {
  res.json(db.users);
});


router.patch('/:id', (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  const { role, department } = req.body;
  const currentAdminId = req.user.id;

  const user = db.users.find(u => u.id === targetId);
  if (!user) return res.status(404).json({ error: "User not found" });

 
  if (targetId === currentAdminId && role && role !== 'org_admin') {
    return res.status(400).json({ error: "Self-demotion is restricted to prevent lockout" });
  }


  const validRoles = ['org_admin', 'dept_head', 'member'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  if (role) user.role = role;
  if (department) user.department = department;

  res.json(user);
});

module.exports = router;