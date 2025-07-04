import React, { useState, useEffect } from 'react';
import type { Task } from '../types/project';
import { TrashIcon } from './icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'projectId' | 'id'> & { id?: string }) => void;
  onDelete: (taskId: string) => void;
  task: (Omit<Task, 'projectId' | 'id'> & { id?: string }) | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do');

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'To Do');
  }, [task]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ id: task?.id, parentId: task?.parentId || null, title, description, status });
    }
  };
  
  const handleDelete = () => {
    if(task?.id && window.confirm('Are you sure you want to delete this task and all its sub-tasks?')) {
        onDelete(task.id);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl font-bold mb-4">{task?.id ? 'Edit Task' : (task?.parentId ? 'New Sub-task' : 'New Task')}</h3>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-600 mb-1">Title</label>
            <input id="task-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="task-desc" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
            <textarea id="task-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="task-status" className="block text-sm font-medium text-slate-600 mb-1">Status</label>
            <select id="task-status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <div>
              {task?.id && (
                <button type="button" onClick={handleDelete} className="text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center">
                  <TrashIcon /> Delete
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="bg-slate-100 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Task</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};