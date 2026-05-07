const express = require('express');
const cors = require('cors');
const taskRoutes = require('./src/routes/tasks');
const userRoutes = require('./src/routes/users');

const app = express();
app.use(cors()); 
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});