import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../Services/api';
import type { Task, TaskStatus } from '../types';
import { Trash2, Plus, ArrowRight, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export default function TasksDashboard() {
  const { currentUser, mockUsers } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const teamMembers = mockUsers.filter(u => u.department === currentUser.department);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Task[]>('/tasks', {}, currentUser.id);
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Authorization Error: Unable to fetch tasks for your current role.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigneeId) return alert('Please select a team member for assignment.');

    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          department: currentUser.department,
          assignedTo: Number(assigneeId),
          status: 'todo'
        })
      }, currentUser.id);
      
      setTitle('');
      setAssigneeId('');
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      alert('Access Denied: You do not have permission to create tasks here.');
    }
  };

  const advanceStatus = async (task: Task) => {
    const sequence: Record<TaskStatus, TaskStatus> = {
      'todo': 'in_progress',
      'in_progress': 'completed',
      'completed': 'completed'
    };

    try {
      await apiFetch(`/tasks/${task.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: sequence[task.status] })
      }, currentUser.id);
      loadData();
    } catch (err) {
      alert('Action Forbidden: Status updates restricted.');
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' }, currentUser.id);
      loadData();
    } catch (err) {
      alert('Unauthorized: Only Org Admins or relevant Dept Heads can delete tasks.');
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    const styles = {
      todo: 'bg-slate-100 text-slate-600 border-slate-200',
      in_progress: 'bg-blue-50 text-blue-600 border-blue-100',
      completed: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    
    const icons = {
      todo: <Clock size={12} />,
      in_progress: <PlayCircle size={12} />,
      completed: <CheckCircle2 size={12} />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wider ${styles[status]}`}>
        {icons[status]} {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse font-medium tracking-tight">Verifying Permissions & Fetching Tasks...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tasks Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Access:</span>
            <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded italic">
              {currentUser.role.replace('_', ' ')} @ {currentUser.department}
            </span>
          </div>
        </div>

        {(currentUser.role === 'org_admin' || currentUser.role === 'dept_head') && (
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            {isFormOpen ? 'Cancel Request' : <><Plus size={18} /> New Task</>}
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreate} className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 flex flex-wrap gap-4 items-end shadow-inner">
          <div className="flex-1 min-w-[260px]">
            <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Task Requirement</label>
            <input 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 bg-white border border-indigo-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="What needs to be assigned?"
            />
          </div>
          <div className="w-full sm:w-64">
            <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Assign To Team Member</label>
            <select 
              required
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              className="w-full p-2.5 bg-white border border-indigo-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Select Assignee...</option>
              {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100">
            Confirm Assignment
          </button>
        </form>
      )}

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-xs font-bold text-center uppercase tracking-widest">{error}</div>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Objective</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Current Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-16 text-center text-slate-400 italic text-sm">No authorized tasks found for this scope.</td></tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id} className="group hover:bg-slate-50/40 transition-all">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-800 text-sm">{task.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">REF_ID: {task.id.toString().padStart(3, '0')} | DEPT: {task.department}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                      {task.status !== 'completed' && (
                        <button 
                          onClick={() => advanceStatus(task)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Advance Status"
                        >
                          <ArrowRight size={18} />
                        </button>
                      )}
                      {(currentUser.role === 'org_admin' || (currentUser.role === 'dept_head' && task.department === currentUser.department)) && (
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Permanent"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}