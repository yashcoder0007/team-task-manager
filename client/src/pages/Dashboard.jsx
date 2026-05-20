import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Calendar
} from 'lucide-react';
import dashboardService from '../services/dashboard.service';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Fetching Stats...</p>
    </div>
  );

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-800/30' },
    { label: 'Total Tasks', value: stats?.totalTasks, icon: ListTodo, color: 'text-indigo-400', bg: 'bg-indigo-950/30 border-indigo-800/30' },
    { label: 'In Progress', value: stats?.inProgressTasks, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-800/30' },
    { label: 'Completed', value: stats?.completedTasks, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-800/30' },
    { label: 'Pending', value: stats?.pendingTasks, icon: Clock, color: 'text-slate-400', bg: 'bg-slate-800/30 border-slate-700/30' },
    { label: 'Overdue', value: stats?.overdueTasksCount, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-950/30 border-red-850/40 shadow-glow-primary/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="border-b border-slate-800/50 pb-5">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent tracking-tight">Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time workspace activity and operations.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {statCards.map((card) => (
          <motion.div 
            key={card.label} 
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card p-5 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 border backdrop-blur-md shadow-sm", card.bg, card.color)}>
              <card.icon size={22} />
            </div>
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{card.label}</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/25">
            <h3 className="font-bold text-slate-100 tracking-wide">Recent Tasks</h3>
            <button className="text-xs text-primary-400 font-bold tracking-wide uppercase hover:text-primary-300 transition-colors hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-800/40">
            {stats?.recentTasks?.length > 0 ? (
              stats.recentTasks.map((task) => (
                <div key={task._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-900/20 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200 text-sm sm:text-base">{task.title}</span>
                    <span className="text-xs text-slate-450 mt-0.5">{task.project?.title}</span>
                  </div>
                  <span className={clsx(
                    "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full border",
                    {
                      'bg-slate-950/60 text-slate-400 border-slate-800': task.status === 'todo',
                      'bg-primary-950/60 text-primary-300 border-primary-800/40': task.status === 'in-progress',
                      'bg-emerald-950/60 text-emerald-350 border-emerald-800/40': task.status === 'completed',
                    }
                  )}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 italic text-sm">No tasks found</div>
            )}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="glass-card overflow-hidden border-red-950/40">
          <div className="px-6 py-4 border-b border-red-900/20 flex justify-between items-center bg-red-950/15">
            <h3 className="font-bold text-red-300 flex items-center tracking-wide">
              <AlertCircle size={18} className="mr-2 text-red-400" />
              Overdue Tasks
            </h3>
            <span className="px-2.5 py-0.5 bg-red-950/60 border border-red-800/40 text-red-400 text-[10px] font-extrabold rounded-full">
              {stats?.overdueTasksCount}
            </span>
          </div>
          <div className="divide-y divide-slate-800/40">
            {stats?.overdueTasksList?.length > 0 ? (
              stats.overdueTasksList.map((task) => (
                <div key={task._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-900/20 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200 text-sm sm:text-base">{task.title}</span>
                    <div className="flex items-center text-xs text-red-400 mt-1">
                      <Calendar size={12} className="mr-1" />
                      {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {task.project?.title}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-550 italic text-sm">No overdue tasks! Outstanding job.</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
