import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, isAdmin } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Team Members', href: '/team', icon: Users });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-45 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={clsx(
        "fixed inset-y-0 left-0 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 z-50 transition-transform duration-300 transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/60 bg-slate-950/20">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 via-indigo-400 to-primary-300 bg-clip-text text-transparent tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 shadow-glow-primary"></span>
              TeamTask
            </span>
            <button onClick={toggleSidebar} className="lg:hidden p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => clsx(
                  "flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group border-l-4",
                  isActive 
                    ? "bg-gradient-to-r from-primary-500/20 to-indigo-500/5 text-primary-300 border-primary-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border-transparent"
                )}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={clsx(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-400"
                    )} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/60">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-semibold text-red-400 rounded-xl bg-red-950/10 border border-red-900/30 hover:bg-red-950/30 hover:border-red-900/60 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
