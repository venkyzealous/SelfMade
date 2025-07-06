import { type DropResult, DragDropContext, Droppable } from "react-beautiful-dnd";
import type { Task, Statuses } from "../types/project";
import { TaskCard } from "./TaskCard";


// Kanban board view
export const KanbanBoard = ({  tasks, 
                        statuses, 
                        onTaskClick, 
                        onTaskMove 
                      }:{
                        tasks:Task[], 
                        statuses:Statuses, 
                        onTaskClick:(task:Task)=>void,
                        onTaskMove:(taskId:string, newStatus:string) => void
                      }) => {

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        onTaskMove(draggableId, destination.droppableId);
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
