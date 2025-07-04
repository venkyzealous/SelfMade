### Code Structure

useStore (Zustand store creator)
    hydrate
    saveState
    addProject
    deleteProject
    setActiveProject
    setActiveView
    addTask
    updateTask
    deleteTask
    importState
    getActiveProject
GlowIcon (Component)
PriorityIcon (Component)
formatDate (Helper function)
TaskModal (Component)
    handleSave
ConfirmationModal (Component)
TaskCard (Component)
KanbanBoard (Component)
    onDragEnd
ListView (Component)
Sidebar (Component)
    handleAddProject
    handleDeleteClick
    confirmDelete
DataManagement (Component)
    showMessage
    handleExport
    handleImportRequest
    confirmImport
App (Component)
    openModal
    closeModal
    handleSaveTask
    handleTaskMove
    handleDeleteClick
    confirmDeleteTask



### Call Flow Chains

Project Management
Create a New Project Sidebar (Add Project button) → setShowInput → Sidebar (form onSubmit) → handleAddProject → useStore.addProject → useStore.setActiveProject

Select an Active Project Sidebar (project link onClick) → useStore.setActiveProject

Delete a Project Sidebar (delete icon onClick) → handleDeleteClick → setProjectToDelete → ConfirmationModal (onConfirm) → confirmDelete → useStore.deleteProject

Task Management
Create a New Task App (floating + button onClick) → openModal → TaskModal (form onSubmit) → handleSave → App.handleSaveTask → useStore.addTask

Edit an Existing Task KanbanBoard / ListView (TaskCard onClick) → App.openModal → TaskModal (form onSubmit) → handleSave → App.handleSaveTask → useStore.updateTask

Move a Task Between Statuses (Kanban) KanbanBoard (user drags and drops a TaskCard) → DragDropContext.onDragEnd → KanbanBoard.onDragEnd → App.handleTaskMove → useStore.updateTask

Delete a Task (Note: The UI trigger for this seems to be missing, but the logic exists) UI Element (onClick) → App.handleDeleteClick → setTaskToDelete → ConfirmationModal (onConfirm) → confirmDeleteTask → useStore.deleteTask

View and Data Management
Switch Between Board and List View App (view toggle button onClick) → useStore.setActiveView

Export Workspace Data DataManagement (Export button onClick) → handleExport → window.showSaveFilePicker (or fallback) → showMessage

Import Workspace Data DataManagement (Import button onClick) → handleImportRequest → window.showOpenFilePicker (or fallback) → setDataToImport & setShowConfirmation → ConfirmationModal (onConfirm) → confirmImport → useStore.importState → showMessage

State Persistence (Automatic)
Load State on App Start App (component mount) → useEffect → useStore.hydrate → localStorage.getItem

Save State on Any Change Any state change → useStore.subscribe → useStore.saveState → localStorage.setItem