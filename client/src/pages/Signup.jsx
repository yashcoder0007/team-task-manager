import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden px-4">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-glass overflow-hidden hover:border-primary-500/30 transition-all duration-300">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-2xl mb-4 border border-primary-500/30 shadow-glow-primary">
              <UserPlus className="text-primary-400" size={30} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-100 bg-clip-text text-transparent">Create Account</h2>
            <p className="text-slate-400 text-sm mt-2">Join the team and stay organized</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <UserIcon size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  className="input pl-10"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  className="input pl-10"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <ShieldCheck size={18} />
                </div>
                <select
                  name="role"
                  className="input pl-10 appearance-none bg-slate-900/60 text-slate-100"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="member" className="bg-slate-900 text-slate-100">Member</option>
                  <option value="admin" className="bg-slate-900 text-slate-100">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-11 flex items-center justify-center mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
