
import { Task, TaskStatus, TaskPriority, TaskType, User } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0052CC&color=fff' },
  { id: 'u2', name: 'Sarah Miller', email: 'sarah@example.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=00875A&color=fff' },
  { id: 'u3', name: 'Mike Ross', email: 'mike@example.com', avatar: 'https://ui-avatars.com/api/?name=Mike+Ross&background=E34935&color=fff' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    key: 'JC-1',
    projectId: 'p-1',
    title: 'Implement enterprise auth flow',
    description: 'Create login, signup and password recovery screens using modern Tailwind UI.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    type: TaskType.STORY,
    assignee: USERS[0],
    reporter: USERS[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    key: 'JC-2',
    projectId: 'p-1',
    title: 'AI model integration for ticket generation',
    description: 'Connect Gemini 3 Flash to provide smart descriptions and priority suggestions.',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGHEST,
    type: TaskType.TASK,
    assignee: USERS[1],
    reporter: USERS[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const PRIORITY_COLORS = {
  [TaskPriority.LOWEST]: 'text-gray-400',
  [TaskPriority.LOW]: 'text-blue-500',
  [TaskPriority.MEDIUM]: 'text-orange-500',
  [TaskPriority.HIGH]: 'text-red-500',
  [TaskPriority.HIGHEST]: 'text-red-700 font-bold',
};

export const TYPE_ICONS = {
  [TaskType.STORY]: 'fa-solid fa-bookmark text-green-500',
  [TaskType.TASK]: 'fa-solid fa-check-square text-blue-500',
  [TaskType.BUG]: 'fa-solid fa-circle-exclamation text-red-500',
  [TaskType.EPIC]: 'fa-solid fa-bolt text-purple-600',
};
