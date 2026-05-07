import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

import TasksDashboard from './pages/TasksDashboard';
import AdminUsers from './pages/AdminUsers';

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TasksDashboard />} />
        
        <Route 
          path="users" 
          element={
            currentUser.role === 'org_admin' 
              ? <AdminUsers /> 
              : <Navigate to="/" replace />
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;