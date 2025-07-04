// Modal for adding/editing tasks

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction, type FormEvent } from "react";
import { useStore } from '../store/store.ts';
import type { Task, Priorities, Statuses } from "../types/project";



export const TaskModal = ({ task, onSave, onClose, handleDeleteClick }:
    {task:Task|null, onSave:(task:Task)=>void, onClose:()=>void, handleDeleteClick:(task: Task)=>void}) => {

    const [title, setTitle] = useState(task?.title || '');
    const [tags/*,setTags*/] = useState(task?.tags || []);
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
