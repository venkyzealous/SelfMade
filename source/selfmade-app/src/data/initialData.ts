import type { Project, Task } from '../types/project';

export const initialProjects: Project[] = [
    { id: 'p1', title: 'Home Renovation', description: 'Complete renovation of the main floor.' },
    { id: 'p2', title: 'Learn Guitar', description: 'From basics to playing a full song.' },
    { id: 'p3', title: 'Side Project: SelfMade', description: 'Build the best task manager for individuals.' },
];

export const initialTasks: Task[] = [
    { id: 't1', projectId: 'p1', parentId: null, title: 'Phase 1: Design', description: '', status: 'Done' },
    { id: 't2', projectId: 'p1', parentId: 't1', title: 'Hire a designer', description: 'Interview at least 3 designers.', status: 'Done' },
    { id: 't3', projectId: 'p1', parentId: 't1', title: 'Finalize floor plan', description: '', status: 'Done' },
    { id: 't4', projectId: 'p1', parentId: null, title: 'Phase 2: Demolition', description: '', status: 'In Progress' },
    { id: 't5', projectId: 'p1', parentId: 't4', title: 'Remove old cabinets', description: 'Be careful with the plumbing.', status: 'In Progress' },
    { id: 't6', projectId: 'p2', parentId: null, title: 'Buy a guitar', description: 'Acoustic, budget $300', status: 'Done' },
    { id: 't7', projectId: 'p2', parentId: null, title: 'Learn basic chords (Am, C, G, D)', description: 'Practice 30 mins a day', status: 'In Progress' },
    { id: 't8', projectId: 'p3', parentId: null, title: 'Finalize Product Documentation', description: 'Cover all core features.', status: 'Done' },
    { id: 't9', projectId: 'p3', parentId: null, title: 'Build MVP 1 Prototype', description: 'Focus on core engine.', status: 'Done' },
    { id: 't10', projectId: 'p3', parentId: 't9', title: 'Create interactive prototype in React', description: 'Use TypeScript and TailwindCSS.', status: 'In Progress' },
];
