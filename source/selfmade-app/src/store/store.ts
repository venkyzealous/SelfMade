// --- STATE MANAGEMENT (ZUSTAND) ---
import { create } from "zustand";
import type { ProjectStore, Project, Task } from "../types/project";
import {View} from '../types/project.ts';

// Using Zustand as recommended for a lightweight, powerful state management solution.
export const useStore = create<ProjectStore>()((set, get) => ({
  projects: [],
  activeProjectId: null,
  activeView: View.Board, // 'board', 'list'
  
  // Initialize state from localStorage if available
  hydrate: () => {
    try {
      const savedState = localStorage.getItem('selfmade-state');
      if (savedState) {
        const { projects, activeProjectId } = JSON.parse(savedState);
        if (projects && Array.isArray(projects)) {
            set({ projects, activeProjectId: activeProjectId || (projects[0]?.id || null) });
        }
      } else {
        // Create a default project if no state exists
        const defaultProjectId = `proj_${Date.now()}`;
        set({
            projects: [{ id: defaultProjectId, name: 'My First Project', tasks: [], statuses: ['To Do', 'In Progress', 'Done'] }],
            activeProjectId: defaultProjectId,
        });
      }
    } catch (e) {
      console.error("Could not hydrate state from localStorage", e);
      // Handle potential errors if localStorage is blocked or data is corrupt
      const defaultProjectId = `proj_${Date.now()}`;
        set({
            projects: [{ id: defaultProjectId, name: 'My First Project', tasks: [], statuses: ['To Do', 'In Progress', 'Done'] }],
            activeProjectId: defaultProjectId,
        });
    }
  },

  // Save state to localStorage
  saveState: () => {
    try {
      const { projects, activeProjectId }  = get();   //: {Project[], string }
      const stateToSave = JSON.stringify({ projects, activeProjectId });
      localStorage.setItem('selfmade-state', stateToSave);
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  },
  
  // Actions
  addProject: (name: string) => {
    const newProject: Project = { 
      id: `proj_${Date.now()}`, 
      name, 
      tasks: [],
      statuses: ['To Do', 'In Progress', 'Done'] 
    };
    set(state => ({ projects: [...state.projects, newProject] }));
    get().setActiveProject(newProject.id);
  },

  deleteProject: (projectId: string) => {
    set(state => {
      const remainingProjects = state.projects.filter(p => p.id !== projectId);
      let newActiveProjectId = state.activeProjectId;
      if (state.activeProjectId === projectId) {
        newActiveProjectId = remainingProjects.length > 0 ? remainingProjects[0].id : null;
      }
      return { projects: remainingProjects, activeProjectId: newActiveProjectId };
    });
  },

  setActiveProject: (id) => set({ activeProjectId: id }),
  setActiveView: (view: View) => set({ activeView: view }),

  addTask: (taskData) => {
    set(state => {
      const newTask: Task = { ...taskData, id: `task_${Date.now()}` };
      const updatedProjects = state.projects.map(p => 
        p.id === state.activeProjectId 
          ? { ...p, tasks: [...p.tasks, newTask] } 
          : p
      );

      return { projects: updatedProjects };

    });
  },

  updateTask: (task: Partial<Task>) => {
    set(state => {
      const updatedProjects = state.projects.map(p => {
        if (p.id === state.activeProjectId) {
          return {
            ...p,
            tasks: p.tasks.map(t => t.id === task.id ? { ...t, ...task } : t)  
            // TODO: Remove update based on id and update by reference
          };
        }
        return p;
      });
      return { projects: updatedProjects };
    });
  },


  deleteTask: (taskId: string) => {
    set(state => {
        const updatedProjects = state.projects.map(p => 
            p.id === state.activeProjectId
            ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
            : p
        );
        return { projects: updatedProjects };
    });
  },

  // State import/export for data sovereignty
  importState: (newState) => {
    if (newState && Array.isArray(newState.projects)) {
      set({ 
        projects: newState.projects, 
        activeProjectId: newState.activeProjectId || (newState.projects[0]?.id || null) 
      });
    }
  },
  
  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find(p => p.id === activeProjectId) || null;
  },
}));