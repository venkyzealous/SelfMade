import { Calendar } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import type { Task } from "../types/project";
import { PriorityIcon, formatDate } from "./Helper";


// Kanban board task card
export const TaskCard = ({ task, index, onClick }:{task:Task, index:number, onClick:(task:Task)=>void}) => {
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