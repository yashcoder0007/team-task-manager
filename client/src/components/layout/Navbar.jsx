import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-slate-800/80 lg:px-8 bg-slate-900/40 backdrop-blur-xl shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-400 rounded-lg lg:hidden hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="ml-4 text-base font-bold text-slate-100 lg:ml-0 truncate max-w-[150px] sm:max-w-none">
          Welcome back, <span className="bg-gradient-to-r from-primary-400 to-indigo-300 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Badge */}
        <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-900/60 rounded-full border border-slate-850">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-glow-primary">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name}</p>
            <span className={({
              'admin': 'text-[9px] uppercase tracking-wider font-bold text-primary-400 bg-primary-950/40 px-1.5 py-0.5 rounded border border-primary-800/30',
              'member': 'text-[9px] uppercase tracking-wider font-bold text-slate-400 bg-slate-950/40 px-1.5 py-0.5 rounded border border-slate-800/30'
            })[user?.role]}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
