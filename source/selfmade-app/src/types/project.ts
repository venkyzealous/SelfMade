export interface Project {
  id: string;
  name: string;
  description?: string|null;
  tasks: Task[];
  statuses: Statuses;
}

export interface Task {
  id: string;
  dueDate?: string;
  priority?: Priorities;
  tags?: string[];
  description?: string;
  title: string;
  status: string;
  statuses: Statuses;
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

export type Statuses = string[];

export const Priorities = {
  Low:'Low',
  Medium:'Medium',
  High:'High',
  Critical:'Critical'
} as const;

export type Priorities = typeof Priorities[keyof typeof Priorities];