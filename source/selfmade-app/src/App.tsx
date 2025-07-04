import React, { useState, useEffect, type Dispatch, type SetStateAction, type ReactNode, type FormEvent } from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { Plus, X, HardDrive, Upload, List, LayoutGrid, AlertTriangle, Calendar, ChevronsRight, Folder, Trash2 } from 'lucide-react';
import './App.css';
import type {Project, Task, ProjectStore, Statuses, Priorities} from './types/project.ts'
import {View} from './types/project.ts'



// --- STATE MANAGEMENT (ZUSTAND) ---
// Using Zustand as recommended for a lightweight, powerful state management solution.
const useStore = create<ProjectStore>()((set, get) => ({
  projects: [],
  activeProjectId: null,
  activeView: View.Board, // 'board', 'list'
  
  // Initialize state from localStorage if available
  hydrate: () => {
    try {
      const savedState = localStorage.getItem('selfmade-state');
      if (savedState) {
        const { projects, activeProjectId } = JSON.parse(savedState);
        if (projects && Array.isArray(projects)) {
            set({ projects, activeProjectId: activeProjectId || (projects[0]?.id || null) });
        }
      } else {
        // Create a default project if no state exists
        const defaultProjectId = `proj_${Date.now()}`;
        set({
            projects: [{ id: defaultProjectId, name: 'My First Project', tasks: [], statuses: ['To Do', 'In Progress', 'Done'] }],
            activeProjectId: defaultProjectId,
        });
      }
    } catch (e) {
      console.error("Could not hydrate state from localStorage", e);
      // Handle potential errors if localStorage is blocked or data is corrupt
      const defaultProjectId = `proj_${Date.now()}`;
        set({
            projects: [{ id: defaultProjectId, name: 'My First Project', tasks: [], statuses: ['To Do', 'In Progress', 'Done'] }],
            activeProjectId: defaultProjectId,
        });
    }
  },

  // Save state to localStorage
  saveState: () => {
    try {
      const { projects, activeProjectId }  = get();   //: {Project[], string }
      const stateToSave = JSON.stringify({ projects, activeProjectId });
      localStorage.setItem('selfmade-state', stateToSave);
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  },
  
  // Actions
  addProject: (name: string) => {
    const newProject: Project = { 
      id: `proj_${Date.now()}`, 
      name, 
      tasks: [],
      statuses: ['To Do', 'In Progress', 'Done'] 
    };
    set(state => ({ projects: [...state.projects, newProject] }));
    get().setActiveProject(newProject.id);
  },

  deleteProject: (projectId: string) => {
    set(state => {
      const remainingProjects = state.projects.filter(p => p.id !== projectId);
      let newActiveProjectId = state.activeProjectId;
      if (state.activeProjectId === projectId) {
        newActiveProjectId = remainingProjects.length > 0 ? remainingProjects[0].id : null;
      }
      return { projects: remainingProjects, activeProjectId: newActiveProjectId };
    });
  },

  setActiveProject: (id) => set({ activeProjectId: id }),
  setActiveView: (view: View) => set({ activeView: view }),

  addTask: (taskData) => {
    set(state => {
      const newTask: Task = { ...taskData, id: `task_${Date.now()}` };
      const updatedProjects = state.projects.map(p => 
        p.id === state.activeProjectId 
          ? { ...p, tasks: [...p.tasks, newTask] } 
          : p
      );

      return { projects: updatedProjects };

    });
  },

  updateTask: (task: Partial<Task>) => {
    set(state => {
      const updatedProjects = state.projects.map(p => {
        if (p.id === state.activeProjectId) {
          return {
            ...p,
            tasks: p.tasks.map(t => t.id === task.id ? { ...t, ...task } : t)  
            // TODO: Remove update based on id and update by reference
          };
        }
        return p;
      });
      return { projects: updatedProjects };
    });
  },


  deleteTask: (taskId: string) => {
    set(state => {
        const updatedProjects = state.projects.map(p => 
            p.id === state.activeProjectId
            ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
            : p
        );
        return { projects: updatedProjects };
    });
  },

  // State import/export for data sovereignty
  importState: (newState) => {
    if (newState && Array.isArray(newState.projects)) {
      set({ 
        projects: newState.projects, 
        activeProjectId: newState.activeProjectId || (newState.projects[0]?.id || null) 
      });
    }
  },
  
  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find(p => p.id === activeProjectId) || null;
  },
}));

// --- CUSTOM ICONS (for that unique gaming UI feel) ---
// const IconContainer = ({ children }) => (
//     <div className="w-12 h-12 bg-slate-900/50 border border-slate-700/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
//         {children}
//     </div>
// );

const GlowIcon = ({ children }:{children:ReactNode}) => (
    <div className="relative group">
        {children}
        <div className="absolute -inset-1 bg-cyan-400/50 rounded-lg blur-sm opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
    </div>
);

// --- HELPER COMPONENTS ---
const PriorityIcon = ({ priority, className }:{priority?:string, className?:string}) => {
    const config:{[key:string]:{icon:ReactNode, color:string}} = {
        'Low': { icon: <ChevronsRight size={16} />, color: 'text-sky-400' },
        'Medium': { icon: <ChevronsRight size={16} className="[transform:rotate(-90deg)]" />, color: 'text-yellow-400' },
        'High': { icon: <ChevronsRight size={16} className="[transform:rotate(-90deg)_scale(1.5)]" />, color: 'text-red-400' },
        'Critical': { icon: <AlertTriangle size={16} />, color: 'text-fuchsia-500' },
    };

    if(priority){
        const { icon, color } = config[priority]; //|| config['Medium'];
        return <div className={`flex items-center gap-1 ${color} ${className}`}>{icon} {priority}</div>;
    }
    else {
        return <div className={`flex items-center gap-1`}></div>;
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// --- CORE UI COMPONENTS ---

// Modal for adding/editing tasks
const TaskModal = ({ task, onSave, onClose, handleDeleteClick }:
    {task:Task|null, onSave:(task:Task)=>void, onClose:()=>void, handleDeleteClick:(task: Task)=>void}) => {

    const [title, setTitle] = useState(task?.title || '');
    const [tags,setTags] = useState(task?.tags || []);
    const [description, setDescription] = useState(task?.description || '');
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [priority, setPriority] = useState<Priorities>(task?.priority || 'Medium');
    const { getActiveProject } = useStore();
    const [status, setStatus]:[Statuses, Dispatch<SetStateAction<Statuses>>] = useState(task?.status || getActiveProject()?.statuses[0] || 'To Do');
    const projectStatuses = getActiveProject()?.statuses || ['To Do', 'In Progress', 'Done'];

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;
        const id = (task?.id||'');
        onSave({ title, description, dueDate, priority, status,id: id, tags });
        onClose();
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleDeleteClick(task as Task);
        onClose();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="bg-slate-900/80 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-2xl p-6 m-4 text-slate-100"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSave}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-cyan-400 tracking-wider">
                            {task ? 'EDIT TASK' : 'CREATE TASK'}
                        </h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Task Title..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            required
                        />
                        <textarea
                            placeholder="Description (Markdown supported)..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                                <select value={priority} onChange={e => setPriority(e.target.value as Priorities)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value as Statuses)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition">
                                    {projectStatuses.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-4">
                        {task ? <button type="button" onClick={handleDelete} className="px-6 py-2 rounded-md bg-red-900/50 text-red-400 hover:bg-red-800/50 font-semibold transition">Delete Task</button> : <div></div>}
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold shadow-[0_0_15px_rgba(56,189,248,0.4)] transition">
                            {task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Confirmation Modal
const ConfirmationModal = ({ title, message, onConfirm, onCancel }:{title:string, message:string, onConfirm:()=>void, onCancel:()=>void}) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onCancel}
    >
        <motion.div
            initial={{ scale: 0.9, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-slate-900/80 border border-red-500/30 rounded-lg shadow-2xl shadow-red-500/10 w-full max-w-md p-6 m-4 text-slate-100"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-900/50 border border-red-700/80 rounded-full flex-shrink-0 flex items-center justify-center">
                    <AlertTriangle className="text-red-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 tracking-wider mb-2">{title}</h2>
                    <p className="text-slate-300">{message}</p>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-500 font-semibold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition">
                    Confirm
                </button>
            </div>
        </motion.div>
    </motion.div>
);

// Kanban board task card
const TaskCard = ({ task, index, onClick }:{task:Task, index:number, onClick:(task:Task)=>void}) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    className={`bg-slate-800/80 p-4 rounded-lg border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer mb-3 shadow-lg ${snapshot.isDragging ? 'shadow-cyan-400/30 ring-2 ring-cyan-500' : ''}`}
                    style={{...provided.draggableProps.style}}
                >
                    <h3 className="font-bold text-slate-100 mb-2">{task.title}</h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs">
                        <PriorityIcon priority={task.priority} />
                        <div className="flex items-center gap-1 text-slate-500">
                            <Calendar size={14} />
                            <span>{ formatDate(task.dueDate)}</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

// Kanban board view
const KanbanBoard = ({  tasks, 
                        statuses, 
                        onTaskClick, 
                        onTaskMove 
                      }:{
                        tasks:Task[], 
                        statuses:Statuses[], 
                        onTaskClick:(task:Task)=>void,
                        onTaskMove:(taskId:string, newStatus:Statuses) => void
                      }) => {

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        onTaskMove(draggableId, destination.droppableId as Statuses);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-1">
                {statuses.map(status => (
                    <Droppable droppableId={status} key={status}>
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef}
                                className="bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col"
                            >
                                <h2 className="text-lg font-bold text-cyan-300 p-4 border-b border-slate-800 tracking-widest">{status.toUpperCase()} <span className="text-slate-500 text-sm ml-2">{tasks.filter(t => t.status === status).length}</span></h2>
                                <div className="p-4 flex-grow min-h-[200px] overflow-y-auto">
                                    {tasks.filter(t => t.status === status).map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} onClick={onTaskClick} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

// List view
const ListView = ({ tasks, onTaskClick }:{tasks:Task[], onTaskClick:(task:Task)=>void}) => (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="p-3">Title</th>
                    <th className="p-3 hidden md:table-cell">Status</th>
                    <th className="p-3 hidden sm:table-cell">Priority</th>
                    <th className="p-3 hidden lg:table-cell">Due Date</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr 
                        key={task.id} 
                        onClick={() => onTaskClick(task)}
                        className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                        <td className="p-3 font-semibold text-slate-100">{task.title}</td>
                        <td className="p-3 text-slate-300 hidden md:table-cell">{task.status}</td>
                        <td className="p-3 hidden sm:table-cell"><PriorityIcon priority={task.priority} /></td>
                        <td className="p-3 text-slate-400 hidden lg:table-cell">{formatDate(task.dueDate)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Sidebar component
const Sidebar = () => {
    const { projects, activeProjectId, setActiveProject, addProject, deleteProject } = useStore();
    const [newProjectName, setNewProjectName] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null as string | null);

    const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            addProject(newProjectName.trim());
            setNewProjectName('');
            setShowInput(false);
        }
    };
    
    const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setProjectToDelete(projectId);
    };

    const confirmDelete = () => {
        if(projectToDelete) {
            deleteProject(projectToDelete);
            setProjectToDelete(null);
        }
    };

    return (
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800/80 backdrop-blur-md flex flex-col p-4 text-slate-300">
            <div className="flex items-center gap-3 mb-8">
                <GlowIcon>
                    <div className="w-12 h-12 bg-cyan-900/50 border border-cyan-700/80 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5zM12 13.5l-10-5v4.5l10 5 10-5V8.5l-10 5z"></path>
                        </svg>
                    </div>
                </GlowIcon>
                <h1 className="text-2xl font-bold tracking-wider text-slate-100">SelfMade</h1>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Projects</h2>
                <ul className="space-y-2">
                    {projects.map(project => (
                        <li key={project.id}>
                            <a
                                href="#"
                                onClick={() => setActiveProject(project.id)}
                                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${activeProjectId === project.id ? 'bg-cyan-500/20 text-cyan-300 shadow-inner' : 'hover:bg-slate-800/50'}`}
                            >
                               <span className="flex items-center gap-3">
                                <Folder size={18} className={`${activeProjectId === project.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                                {project.name}
                               </span>
                               {projects.length > 1 &&
                                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteClick(e, project.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity">
                                    <Trash2 size={16}/>
                                </button>
                               }
                            </a>
                        </li>
                    ))}
                </ul>
                <AnimatePresence>
                {showInput && (
                    <motion.form
                        onSubmit={handleAddProject}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                    >
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="New project name..."
                            autoFocus
                            onBlur={() => !newProjectName && setShowInput(false)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                    </motion.form>
                )}
                </AnimatePresence>

                <button
                    onClick={() => setShowInput(true)}
                    className="w-full flex items-center justify-center gap-2 p-2 mt-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>
             <DataManagement />

             <AnimatePresence>
                {projectToDelete && (
                    <ConfirmationModal 
                        title="Delete Project?"
                        message={`Are you sure you want to delete the project "${projects.find(p=>p.id === projectToDelete)?.name}"? This action cannot be undone.`}
                        onConfirm={confirmDelete}
                        onCancel={() => setProjectToDelete(null)}
                    />
                )}
            </AnimatePresence>
        </aside>
    );
};

// Data Management Component (The "Data Sovereignty" feature)
const DataManagement = () => {
    const { projects, activeProjectId, importState } = useStore();
    const [message, setMessage] = useState(null as { text: string, type: string } | null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [dataToImport, setDataToImport] = useState(null as ProjectStore|null);

    const showMessage = (text: string, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleExport = async () => {
        try {
            const stateToSave = { projects, activeProjectId };
            const blob = new Blob([JSON.stringify(stateToSave, null, 2)], { type: 'application/json' });

            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: `selfmade-backup-${new Date().toISOString().split('T')[0]}.json`,
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else { // Fallback for browsers that don't support showSaveFilePicker
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `selfmade-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            showMessage('Data exported successfully!', 'success');
        } catch (err) {
            // Ignore DOMException: The user aborted a request.
            if(err instanceof DOMException){
                if (err.name !== 'AbortError') {
                    console.error('Export failed:', err);
                    showMessage('Export failed. Check console for details.', 'error');
                }
            }
        }
    };

    const handleImportRequest = async () => {
        try {
            if (window.showOpenFilePicker) {
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const file = await handle.getFile();
                const contents = await file.text();
                const parsedData = JSON.parse(contents);
                
                // Validate data structure
                if (parsedData && Array.isArray(parsedData.projects)) {
                    setDataToImport(parsedData);
                    setShowConfirmation(true);
                } else {
                     showMessage('Invalid data file structure.', 'error');
                }
            } else { // Fallback for older browsers
                 const input = document.createElement('input');
                 input.type = 'file';
                 input.accept = '.json,application/json';
                 input.onchange = (e:Event) => {

                    const target = e.target as HTMLInputElement;

                    if (!target || !target.files) return;
                    const file = target.files[0] as Blob;
                    const reader = new FileReader();
                    reader.onload = readerEvent => {
                        const content = readerEvent.target?.result || '';

                        if(typeof content === 'string') {
                            const parsedData = JSON.parse(content);
                            if (parsedData && Array.isArray(parsedData.projects)) {
                                setDataToImport(parsedData);
                                setShowConfirmation(true);
                            }
                        }
                        else {
                        showMessage('Invalid data file structure.', 'error');
                        }
                    }
                    reader.readAsText(file, 'UTF-8');
                 };
                 input.click();
            }
        } catch (err) {
            if(err instanceof DOMException){
                if (err.name !== 'AbortError') {
                    console.error('Import failed:', err);
                    showMessage('Import failed. Check console for details.', 'error');
                }
            }
        }
    };
    
    const confirmImport = () => {

        if (!dataToImport){
            showMessage('No data to import.', 'error');
            return;
        } 

        importState(dataToImport);
        setShowConfirmation(false);
        setDataToImport(null);
        showMessage('Data imported successfully!', 'success');
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-800">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Data Core</h2>
            <div className="space-y-2">
                <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <HardDrive size={18} />
                    <span>Export Workspace</span>
                </button>
                <button onClick={handleImportRequest} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Upload size={18} />
                    <span>Import Workspace</span>
                </button>
            </div>
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`mt-3 p-2 text-center text-sm rounded-md ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
             <AnimatePresence>
                {showConfirmation && (
                    <ConfirmationModal 
                        title="Import Workspace?"
                        message="This will overwrite all current projects and tasks in your workspace. This action cannot be undone."
                        onConfirm={confirmImport}
                        onCancel={() => setShowConfirmation(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Main App component
export default function App() {
    const { activeView, setActiveView, addTask, updateTask, deleteTask, getActiveProject, hydrate, saveState } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask]:[editingtask:Task|null, setEditingTask: Dispatch<SetStateAction<Task|null>>] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState(null as Task | null);

    const activeProject = getActiveProject();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        // Save state to localStorage whenever it changes
        const unsubscribe = useStore.subscribe(saveState);
        return () => unsubscribe();
    }, [saveState]);


    const openModal = (task: Task|null = null) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleSaveTask = (taskData: Task) => {
        if (editingTask) {
            updateTask({...taskData, id:editingTask.id});
        } else {
            addTask(taskData);
        }
    };

    const handleTaskMove = (taskId: string, newStatus: Statuses) => {
        updateTask({ id: taskId,  status: newStatus });
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
    };

    const confirmDeleteTask = () => {
        if(taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
        }
    }

    if (!activeProject) {
        return (
            <div className="h-screen w-screen bg-slate-950 flex">
                <Sidebar />
                <main className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
                    <div className="text-center">
                       <GlowIcon>
                            <div className="w-24 h-24 bg-cyan-900/50 border border-cyan-700/80 rounded-lg flex items-center justify-center mx-auto mb-6">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-cyan-400">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5zM12 13.5l-10-5v4.5l10 5 10-5V8.5l-10 5z"></path>
                                </svg>
                            </div>
                        </GlowIcon>
                        <h2 className="text-3xl font-bold text-slate-100 mb-2">Welcome to SelfMade</h2>
                        <p>Create your first project in the sidebar to get started.</p>
                    </div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="h-screen w-screen bg-slate-950 flex font-sans overflow-hidden">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;700&display=swap');
                .font-sans { font-family: 'Rajdhani', sans-serif; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #1e293b; }
                ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #64748b; }
                `}
            </style>

            <Sidebar />

            <main className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-100 tracking-wide">{activeProject.name}</h2>
                        <p className="text-slate-400">Manage your tasks and conquer your goals.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 p-1 rounded-lg">
                        <button onClick={() => setActiveView('board')} className={`p-2 rounded-md ${activeView === 'board' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}><LayoutGrid size={20}/></button>
                        <button onClick={() => setActiveView('list')} className={`p-2 rounded-md ${activeView === 'list' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}><List size={20}/></button>
                    </div>
                </header>

                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeView === 'board' ? (
                                <KanbanBoard tasks={activeProject.tasks} statuses={activeProject.statuses} onTaskClick={openModal} onTaskMove={handleTaskMove} />
                            ) : (
                                <ListView tasks={activeProject.tasks} onTaskClick={openModal} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transform hover:scale-105 transition-all duration-300"
                >
                    <Plus size={32} />
                </button>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <TaskModal
                        task={editingTask}
                        onSave={handleSaveTask}
                        onClose={closeModal}
                        handleDeleteClick={handleDeleteClick}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {taskToDelete && (
                     <ConfirmationModal 
                        title="Delete Task?"
                        message={`Are you sure you want to delete the task "${taskToDelete.title || ''}"? This action cannot be undone.`}
                        onConfirm={confirmDeleteTask}
                        onCancel={() => setTaskToDelete(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

