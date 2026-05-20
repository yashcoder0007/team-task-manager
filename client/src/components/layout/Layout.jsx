import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading TeamTask...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Decorative Glow Orbs */}
      <div className="glow-orb bg-indigo-600/10 w-[500px] h-[500px] -top-48 -right-48" />
      <div className="glow-orb bg-primary-600/10 w-[600px] h-[600px] -bottom-96 -left-96" />
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col min-h-screen lg:pl-64 transition-all duration-300 relative z-10">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

