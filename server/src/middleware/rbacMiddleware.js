const db = require('../db/database');

const authenticateMockUser = (req, res, next) => {
  const userId = parseInt(req.headers['x-user-id'], 10);
  
  if (!userId) {
    return res.status(401).json({ error: "Auth required: Missing x-user-id header" });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Access denied: Invalid session user" });
  }

  req.user = user;
  next();
};

/**
 * DEPT guard
 * @param {string[]} roles 
 * @param {boolean} sameDeptOnly 
 */
const requireRole = (roles = [], sameDeptOnly = false) => {
  return (req, res, next) => {
    const { role, department } = req.user;

    if (role === 'org_admin') return next();

    // Role Check
    if (roles.length > 0 && !roles.includes(role)) {
      return res.status(403).json({ 
        error: `Forbidden: This action requires ${roles.join(' or ')} privileges.` 
      });
    }

    if (sameDeptOnly) {
      const targetDept = req.body.department || req.query.department;
      
      if (targetDept && targetDept !== department) {
        return res.status(403).json({ 
          error: "Forbidden: You cannot modify resources outside your department." 
        });
      }
    }

    next();
  };
};

module.exports = { authenticateMockUser, requireRole };