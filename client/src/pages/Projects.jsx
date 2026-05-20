import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Trash2, Edit2, Users, Briefcase } from 'lucide-react';
import projectService from '../services/project.service';
import userService from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'active', teamMembers: [] });
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchMembers();
  }, [isAdmin]);

  const fetchMembers = async () => {
    try {
      const { data } = await userService.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProject) {
        await projectService.updateProject(selectedProject._id, formData);
        toast.success('Project updated');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created');
      }
      setIsModalOpen(false);
      setSelectedProject(null);
      setFormData({ title: '', description: '', status: 'active', teamMembers: [] });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? All associated tasks will be deleted.')) {
      try {
        await projectService.deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({ 
      title: project.title, 
      description: project.description,
      status: project.status || 'active',
      teamMembers: project.teamMembers?.map(m => typeof m === 'object' ? m._id : m) || []
    });
    setIsModalOpen(true);
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
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent tracking-tight">Projects</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your team's projects and active assignments.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { 
              setSelectedProject(null); 
              setFormData({ title: '', description: '', status: 'active', teamMembers: [] }); 
              setIsModalOpen(true); 
            }}
            className="btn btn-primary flex items-center shadow-glow-primary/20"
          >
            <Plus size={18} className="mr-2" />
            New Project
          </button>
        )}
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-24">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Projects...</p>
        </motion.div>
      ) : projects.length > 0 ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div 
              key={project._id} 
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card flex flex-col group relative overflow-hidden"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={clsx(
                    "px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border",
                    project.status === 'active' 
                      ? "bg-primary-950/60 text-primary-300 border-primary-800/40" 
                      : "bg-emerald-950/60 text-emerald-350 border-emerald-800/40"
                  )}>
                    {project.status}
                  </span>
                  {isAdmin && (
                    <div className="flex space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(project)}
                        className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-primary-300 transition-colors">{project.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="flex items-center text-xs text-slate-400 space-x-4">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1 text-slate-500" />
                    {project.teamMembers?.length || 0} Members
                  </div>
                  <div className="flex items-center">
                    <CheckSquare size={14} className="mr-1 text-slate-500" />
                    {project.taskCount || 0} Tasks
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-850 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.teamMembers?.slice(0, 3).map((m, i) => (
                    <div 
                      key={i} 
                      className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-primary-300 ring-1 ring-slate-850"
                      title={m.name}
                    >
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.teamMembers?.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      +{project.teamMembers.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="glass-card p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-center mb-4">
            <Briefcase className="text-slate-555" size={30} />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No projects found</h3>
          <p className="text-slate-400 mt-1 max-w-sm text-sm">
            {isAdmin ? 'Get started by creating your first project.' : 'Please contact your admin to assign you to a project.'}
          </p>
        </motion.div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-slate-100">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800/80 shrink-0 bg-slate-950/20">
                <h3 className="text-lg font-bold text-slate-100">
                  {selectedProject ? 'Edit Project' : 'New Project'}
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="label">Project Title</label>
                  <input
                    className="input"
                    placeholder="Enter project name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input h-28 resize-none"
                    placeholder="What is this project about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                
                {/* Admin Powers: Status and Team Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Project Status</label>
                    <select
                      className="input bg-slate-950 text-slate-100"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active" className="bg-slate-900">Active</option>
                      <option value="completed" className="bg-slate-900">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Team Members</label>
                    <div className="border border-slate-800 bg-slate-950/40 rounded-xl max-h-32 overflow-y-auto p-2 space-y-1">
                      {members.map(member => (
                        <label key={member._id} className="flex items-center p-1.5 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-800 bg-slate-950/40 text-primary-500 focus:ring-primary-500 focus:ring-offset-slate-900 mr-2"
                            checked={formData.teamMembers.includes(member._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, teamMembers: [...formData.teamMembers, member._id] });
                              } else {
                                setFormData({ ...formData, teamMembers: formData.teamMembers.filter(id => id !== member._id) });
                              }
                            }}
                          />
                          <span className="text-xs font-semibold text-slate-350">{member.name}</span>
                        </label>
                      ))}
                      {members.length === 0 && <span className="text-xs text-slate-500 p-1">No members available</span>}
                    </div>
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
                  {selectedProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Internal icon dependency fix
const CheckSquare = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

export default Projects;
