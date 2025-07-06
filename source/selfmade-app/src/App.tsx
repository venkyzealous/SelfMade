import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, List, LayoutGrid } from 'lucide-react';
import './App.css';
import type { Task, Statuses } from './types/project.ts';
import { useStore } from './store/store.ts';
import { GlowIcon } from './components/Helper.tsx';
import { TaskModal } from './components/TaskModal.tsx';
import { ConfirmationModal } from './components/ConfirmationModal.tsx';
import { KanbanBoard } from './components/KanbanBoard.tsx';
import { ListView } from './components/ListView.tsx';
import { Sidebar } from './components/Sidebar.tsx';



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

    const handleTaskMove = (taskId: string, newStatus: string) => {
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

