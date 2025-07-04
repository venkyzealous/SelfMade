import React, { useState } from "react";
import { useStore } from "../store/store";
import { AnimatePresence, motion } from "framer-motion";
import { Folder, Trash2, Plus } from "lucide-react";
import { ConfirmationModal } from "./ConfirmationModal";
import { GlowIcon } from "./Helper";
import { DataManagement } from "./DataManagement";

// Sidebar component
export const Sidebar = () => {
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
