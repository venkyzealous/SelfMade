import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// Confirmation Modal
export const ConfirmationModal = ({ title, message, onConfirm, onCancel }:{title:string, message:string, onConfirm:()=>void, onCancel:()=>void}) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onCancel}
    >
        <motion.div
            initial={{ scale: 0.9, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-slate-900/80 border border-red-500/30 rounded-lg shadow-2xl shadow-red-500/10 w-full max-w-md p-6 m-4 text-slate-100"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-900/50 border border-red-700/80 rounded-full flex-shrink-0 flex items-center justify-center">
                    <AlertTriangle className="text-red-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 tracking-wider mb-2">{title}</h2>
                    <p className="text-slate-300">{message}</p>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-500 font-semibold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition">
                    Confirm
                </button>
            </div>
        </motion.div>
    </motion.div>
);