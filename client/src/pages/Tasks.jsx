import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  Trash2,
  Edit2,
  Calendar
} from 'lucide-react';
import taskService from '../services/task.service';
import projectService from '../services/project.service';
import userService from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { format, isPast, isToday } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ project: '', status: '', priority: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    status: 'todo',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
      fetchData();
    } else {
      // Non-admin needs projects to see project names in modal (if they ever get to see one, though they shouldn't create)
      fetchProjects();
    }
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const { data } = await taskService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([
        projectService.getProjects(),
        userService.getMembers()
      ]);
      setProjects(projectsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Failed to fetch filter data');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getProjects();
      setProjects(data);
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask._id, formData);
        toast.success('Task updated');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await taskService.updateStatus(id, newStatus);
      toast.success('Status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project._id,
      assignedTo: task.assignedTo._id,
      priority: task.priority,
      status: task.status,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd')
    });
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-950/60 text-red-300 border border-red-800/40';
      case 'medium': return 'bg-amber-950/60 text-amber-300 border border-amber-800/40';
      case 'low': return 'bg-blue-950/60 text-blue-300 border border-blue-800/40';
      default: return 'bg-slate-950/60 text-slate-400 border border-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-950/60 text-emerald-355 border border-emerald-800/40';
      case 'in-progress': return 'bg-primary-950/60 text-primary-300 border border-primary-800/40';
      default: return 'bg-slate-950/60 text-slate-400 border border-slate-800';
    }
  };

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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent tracking-tight">Tasks</h2>
          <p className="text-slate-400 text-sm mt-1">Track, filter, and manage workspace milestones.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { 
              setSelectedTask(null); 
              setFormData({
                title: '',
                description: '',
                project: projects[0]?._id || '',
                assignedTo: members[0]?._id || '',
                priority: 'medium',
                status: 'todo',
                dueDate: format(new Date(), 'yyyy-MM-dd')
              });
              setIsModalOpen(true); 
            }}
            className="btn btn-primary flex items-center shadow-glow-primary/20"
          >
            <Plus size={18} className="mr-2" />
            New Task
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 shadow-glass">
        <select 
          className="input bg-slate-950 text-slate-200"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
        >
          <option value="" className="bg-slate-900">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id} className="bg-slate-900">{p.title}</option>)}
        </select>
        <select 
          className="input bg-slate-950 text-slate-200"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="" className="bg-slate-900">All Statuses</option>
          <option value="todo" className="bg-slate-900">Todo</option>
          <option value="in-progress" className="bg-slate-900">In Progress</option>
          <option value="completed" className="bg-slate-900">Completed</option>
        </select>
        <select 
          className="input bg-slate-950 text-slate-200"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="" className="bg-slate-900">All Priorities</option>
          <option value="high" className="bg-slate-900">High</option>
          <option value="medium" className="bg-slate-900">Medium</option>
          <option value="low" className="bg-slate-900">Low</option>
        </select>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-24">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Tasks...</p>
        </motion.div>
      ) : tasks.length > 0 ? (
        <motion.div variants={itemVariants} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Task Details</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {tasks.map((task) => {
                  const isOverdue = isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed';
                  return (
                    <tr key={task._id} className="hover:bg-slate-900/20 transition-colors">
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 text-sm sm:text-base">{task.title}</span>
                          <span className="text-xs text-slate-450 mt-0.5">{task.project?.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-primary-300 flex items-center justify-center text-[10px] font-bold mr-2 border border-slate-700/50">
                            {task.assignedTo?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-slate-350">{task.assignedTo?.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={clsx(
                          "px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border",
                          getPriorityColor(task.priority)
                        )}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className={clsx(
                            "text-sm font-semibold",
                            isOverdue ? "text-red-400" : "text-slate-350"
                          )}>
                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </span>
                          {isOverdue && (
                            <span className="text-[9px] font-bold uppercase text-red-400 flex items-center mt-0.5">
                              <AlertCircle size={10} className="mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <span className={clsx(
                            "px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full border",
                            getStatusColor(task.status)
                          )}>
                            {task.status.replace('-', ' ')}
                          </span>
                          {(!isAdmin && task.assignedTo?._id === user?.id) && (
                            <select 
                              className="text-[9px] font-extrabold border-none bg-slate-900/60 rounded px-1.5 py-0.5 border border-slate-800 text-primary-400 cursor-pointer focus:ring-0"
                              value={task.status}
                              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                            >
                              <option value="todo" className="bg-slate-900">Todo</option>
                              <option value="in-progress" className="bg-slate-900">In-Progress</option>
                              <option value="completed" className="bg-slate-900">Completed</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td>
                        {isAdmin && (
                          <div className="flex justify-end space-x-1">
                            <button 
                              onClick={() => openEditModal(task)}
                              className="p-1.5 text-slate-450 hover:text-primary-400 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(task._id)}
                              className="p-1.5 text-slate-455 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="glass-card p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-center mb-4">
            <CheckCircle2 className="text-slate-500" size={30} />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No tasks found</h3>
          <p className="text-slate-400 mt-1 max-w-sm text-sm">Refine your filters or click the button to create a new task.</p>
        </motion.div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full max-w-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-slate-100">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800/80 shrink-0 bg-slate-950/20">
                <h3 className="text-lg font-bold text-slate-100">
                  {selectedTask ? 'Edit Task' : 'New Task'}
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="label">Task Title</label>
                  <input
                    className="input"
                    placeholder="Enter task name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input h-20 resize-none"
                    placeholder="What needs to be done?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Project</label>
                    <select
                      className="input bg-slate-950 text-slate-100"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      required
                    >
                      <option value="" className="bg-slate-900">Select Project</option>
                      {projects.map(p => <option key={p._id} value={p._id} className="bg-slate-900">{p.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Assign To</label>
                    <select
                      className="input bg-slate-950 text-slate-100"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      required
                    >
                      <option value="" className="bg-slate-900">Select Member</option>
                      {members.map(m => <option key={m._id} value={m._id} className="bg-slate-900">{m.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Priority</label>
                    <select
                      className="input bg-slate-950 text-slate-100"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low" className="bg-slate-900">Low</option>
                      <option value="medium" className="bg-slate-900">Medium</option>
                      <option value="high" className="bg-slate-900">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      className="input bg-slate-950 text-slate-100"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="todo" className="bg-slate-900">Todo</option>
                      <option value="in-progress" className="bg-slate-900">In Progress</option>
                      <option value="completed" className="bg-slate-900">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Due Date</label>
                    <input
                      type="date"
                      className="input bg-slate-950 text-slate-100"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex justify-end space-x-3 rounded-b-2xl shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary shadow-glow-primary/10">
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Tasks;
