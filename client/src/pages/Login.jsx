import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden px-4">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-glass overflow-hidden hover:border-primary-500/30 transition-all duration-300">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-2xl mb-4 border border-primary-500/30 shadow-glow-primary">
              <LogIn className="text-primary-400" size={30} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-100 bg-clip-text text-transparent">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-2">Sign in to manage your team & tasks</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-11 flex items-center justify-center mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-400 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

          <div className="px-8 py-5 bg-slate-950/60 border-t border-slate-800/80 flex flex-col space-y-2.5">
            <p className="text-[9px] uppercase tracking-widest font-extrabold text-primary-400 text-center">Demo Access Credentials</p>
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Admin: <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded border border-slate-800/50">admin@test.com</code></span>
              <span>Pass: <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded border border-slate-800/50">Admin@123</code></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
