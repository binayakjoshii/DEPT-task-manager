import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, CheckSquare, UserCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { currentUser, switchUser, mockUsers } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* left side  */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="bg-indigo-500 p-1.5 rounded-lg shadow-sm">
                <CheckSquare size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">DeptTasks</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1.5">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive('/') 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              
              {currentUser.role === 'org_admin' && (
                <Link 
                  to="/users" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive('/users') 
                      ? 'bg-indigo-500/10 text-indigo-400' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users size={16} /> 
                  User Management
                </Link>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                Viewing As
              </span>
              <select 
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block py-1 pl-3 pr-8 transition-colors cursor-pointer hover:bg-slate-700 outline-none"
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
              >
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
              <UserCircle className="text-indigo-400" size={20} />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}