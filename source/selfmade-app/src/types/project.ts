export interface Project {
  id: string;
  name: string;
  description?: string|null;
  tasks: Task[];
  statuses: Statuses[];
}

export interface Task {
  id: string;
  dueDate?: string;
  priority?: Priorities;
  tags?: string[];
  description?: string;
  title: string;
  status: Statuses;
  
  // projectId: string;
  // parentId: string | null;
}


export interface ProjectStore{
  projects: Project[];
  activeProjectId: string | null;
  activeView: View;
  addProject: (name: string) => void;
  setActiveProject: (projectId: string) => void;
  setActiveView: (view:View) => void;
  addTask: (taskData:Task) => void;
  importState: (state:ProjectStore) => void;
  getActiveProject: () => Project | null ;
  deleteProject: (projectId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (task: Partial<Task>) => void;
  hydrate: () => void;
  saveState: () => void;
}

export const View = {
  Board:'board',
  List:'list'
} as const;

export type View = typeof View[keyof typeof View];

export const Statuses = {
  ToDo:'To Do',
  InProgress:'In Progress',
  Done:'Done'
} as const;

export type Statuses = typeof Statuses[keyof typeof Statuses];


export const Priorities = {
  Low:'Low',
  Medium:'Medium',
  High:'High'
} as const;

export type Priorities = typeof Priorities[keyof typeof Priorities];