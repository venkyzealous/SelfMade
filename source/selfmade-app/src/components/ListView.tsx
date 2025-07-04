import type { Task } from "../types/project";
import { PriorityIcon, formatDate } from "./Helper";

// List view
export const ListView = ({ tasks, onTaskClick }:{tasks:Task[], onTaskClick:(task:Task)=>void}) => (
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
