import React, { useState } from 'react';
import type { Project } from '../types/project';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Omit<Project, 'id'>) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSave({ title, description });
            setTitle('');
            setDescription('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4">New Project</h3>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label htmlFor="project-title" className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                        <input id="project-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="project-desc" className="block text-sm font-medium text-slate-600 mb-1">Description (Optional)</label>
                        <textarea id="project-desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-slate-100 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
