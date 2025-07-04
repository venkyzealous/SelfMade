import { AnimatePresence, motion } from "framer-motion";
import { HardDrive, Upload } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/store.ts";
import type { ProjectStore } from "../types/project";
import { ConfirmationModal } from "./ConfirmationModal";

// Data Management Component (The "Data Sovereignty" feature)
export const DataManagement = () => {
    const { projects, activeProjectId, importState } = useStore();
    const [message, setMessage] = useState(null as { text: string, type: string } | null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [dataToImport, setDataToImport] = useState(null as ProjectStore|null);

    const showMessage = (text: string, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleExport = async () => {
        try {
            const stateToSave = { projects, activeProjectId };
            const blob = new Blob([JSON.stringify(stateToSave, null, 2)], { type: 'application/json' });

            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: `selfmade-backup-${new Date().toISOString().split('T')[0]}.json`,
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else { // Fallback for browsers that don't support showSaveFilePicker
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `selfmade-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            showMessage('Data exported successfully!', 'success');
        } catch (err) {
            // Ignore DOMException: The user aborted a request.
            if(err instanceof DOMException){
                if (err.name !== 'AbortError') {
                    console.error('Export failed:', err);
                    showMessage('Export failed. Check console for details.', 'error');
                }
            }
        }
    };

    const handleImportRequest = async () => {
        try {
            if (window.showOpenFilePicker) {
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const file = await handle.getFile();
                const contents = await file.text();
                const parsedData = JSON.parse(contents);
                
                // Validate data structure
                if (parsedData && Array.isArray(parsedData.projects)) {
                    setDataToImport(parsedData);
                    setShowConfirmation(true);
                } else {
                     showMessage('Invalid data file structure.', 'error');
                }
            } else { // Fallback for older browsers
                 const input = document.createElement('input');
                 input.type = 'file';
                 input.accept = '.json,application/json';
                 input.onchange = (e:Event) => {

                    const target = e.target as HTMLInputElement;

                    if (!target || !target.files) return;
                    const file = target.files[0] as Blob;
                    const reader = new FileReader();
                    reader.onload = readerEvent => {
                        const content = readerEvent.target?.result || '';

                        if(typeof content === 'string') {
                            const parsedData = JSON.parse(content);
                            if (parsedData && Array.isArray(parsedData.projects)) {
                                setDataToImport(parsedData);
                                setShowConfirmation(true);
                            }
                        }
                        else {
                        showMessage('Invalid data file structure.', 'error');
                        }
                    }
                    reader.readAsText(file, 'UTF-8');
                 };
                 input.click();
            }
        } catch (err) {
            if(err instanceof DOMException){
                if (err.name !== 'AbortError') {
                    console.error('Import failed:', err);
                    showMessage('Import failed. Check console for details.', 'error');
                }
            }
        }
    };
    
    const confirmImport = () => {

        if (!dataToImport){
            showMessage('No data to import.', 'error');
            return;
        } 

        importState(dataToImport);
        setShowConfirmation(false);
        setDataToImport(null);
        showMessage('Data imported successfully!', 'success');
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-800">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Data Core</h2>
            <div className="space-y-2">
                <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <HardDrive size={18} />
                    <span>Export Workspace</span>
                </button>
                <button onClick={handleImportRequest} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Upload size={18} />
                    <span>Import Workspace</span>
                </button>
            </div>
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`mt-3 p-2 text-center text-sm rounded-md ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
             <AnimatePresence>
                {showConfirmation && (
                    <ConfirmationModal 
                        title="Import Workspace?"
                        message="This will overwrite all current projects and tasks in your workspace. This action cannot be undone."
                        onConfirm={confirmImport}
                        onCancel={() => setShowConfirmation(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};