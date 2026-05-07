// client/src/pages/AdminUsers.tsx
import { useState, useEffect } from 'react';
import { apiFetch } from '../Services/api';
import { useAuth } from '../context/AuthContext';
import type { User, Role, Department } from '../types';

export default function AdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch<User[]>('/users', {}, currentUser.id);
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: number, field: keyof User, value: string) => {
    try {
      await apiFetch<User>(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value })
      }, currentUser.id);
      
      fetchUsers();
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-500 text-sm">Organization Administrators Only</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Department</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateUser(user.id, 'role', e.target.value as Role)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                  >
                    <option value="org_admin">Org Admin</option>
                    <option value="dept_head">Dept Head</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="p-4">
                  <select
                    value={user.department}
                    onChange={(e) => handleUpdateUser(user.id, 'department', e.target.value as Department)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                  >
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="hr">HR</option>
                    <option value="sales">Sales</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}