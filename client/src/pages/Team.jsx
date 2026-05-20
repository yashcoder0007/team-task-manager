import { useState, useEffect } from 'react';
import { Users, Mail, Shield, ShieldCheck } from 'lucide-react';
import userService from '../services/user.service';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800/50 pb-5">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent tracking-tight">Team Members</h2>
        <p className="text-slate-400 text-sm mt-1">Manage and audit your organization's members and access levels.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Team...</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-900/20 transition-colors">
                    <td>
                      <div className="flex items-center">
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 border shadow-sm",
                          user.role === 'admin' 
                            ? "bg-gradient-to-br from-primary-500 to-indigo-650 text-white border-primary-400/20 shadow-glow-primary/10" 
                            : "bg-slate-800 border-slate-700/50 text-slate-300"
                        )}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-200">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-slate-350 text-sm font-medium">
                        <Mail size={14} className="mr-2 text-slate-500" />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        {user.role === 'admin' ? (
                          <span className="flex items-center px-2.5 py-1 bg-primary-950/60 text-primary-300 text-[9px] font-extrabold uppercase tracking-wider rounded-full border border-primary-850">
                            <ShieldCheck size={12} className="mr-1 text-primary-400" />
                            Admin
                          </span>
                        ) : (
                          <span className="flex items-center px-2.5 py-1 bg-slate-950/60 text-slate-400 text-[9px] font-extrabold uppercase tracking-wider rounded-full border border-slate-800">
                            <Shield size={12} className="mr-1 text-slate-500" />
                            Member
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-450 font-semibold">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
