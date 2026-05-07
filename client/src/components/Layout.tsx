import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar />
     
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden">
       
        <div className="w-full mx-auto max-w-screen-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}