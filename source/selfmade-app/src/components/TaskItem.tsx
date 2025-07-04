import React from 'react';
import type { Task } from '../types/project';
import { PlusIcon, EditIcon } from './icons';

interface TaskItemProps {
  task: Task;
  level: number;
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onAddSubtask: (parentId: string) => void;
  children: React.ReactNode;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, level, onToggleStatus, onEdit, onAddSubtask, children }) => {
    const isDone = task.status === 'Done';
    return (
        <div>
            <div className="task-item flex items-start space-x-3 group py-1" style={{ paddingLeft: `${level * 24}px` }}>
                <div className="pt-1">
                    <input type="checkbox" checked={isDone} onChange={() => onToggleStatus(task.id)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-medium ${isDone ? 'line-through text-slate-500' : ''}`}>{task.title}</p>
                    <p className="text-sm text-slate-500 truncate">{task.description}</p>
                </div>
                <div className="actions flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onAddSubtask(task.id)} className="text-slate-400 hover:text-blue-600" title="Add sub-task"><PlusIcon /></button>
                    <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-blue-600" title="Edit task"><EditIcon /></button>
                </div>
            </div>
            {children}
        </div>
    );
};
