import { AlertTriangle,ChevronsRight} from 'lucide-react';
import type { ReactNode } from 'react';


// --- CUSTOM ICONS (for that unique gaming UI feel) ---
// const IconContainer = ({ children }) => (
//     <div className="w-12 h-12 bg-slate-900/50 border border-slate-700/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
//         {children}
//     </div>
// );

export const  GlowIcon = ({ children }:{children:ReactNode}) => (
    <div className="relative group">
        {children}
        <div className="absolute -inset-1 bg-cyan-400/50 rounded-lg blur-sm opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
    </div>
);

// --- HELPER COMPONENTS ---
export const PriorityIcon = ({ priority, className }:{priority?:string, className?:string}) => {
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

export const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};