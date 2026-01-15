export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export enum TaskPriority {
  LOWEST = 'Lowest',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  HIGHEST = 'Highest'
}

export enum TaskType {
  STORY = 'Story',
  TASK = 'Task',
  BUG = 'Bug',
  EPIC = 'Epic'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  type: 'Software' | 'Service Desk' | 'Business';
  leadId: string;
}

export interface Task {
  id: string;
  key: string; 
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignee: User | null;
  reporter: User;
  createdAt: string;
  updatedAt: string;
  acceptanceCriteria?: string;
  stepsToReproduce?: string;
  storyPoints?: number;
}

export type AppView = 'AUTH' | 'ORG_SETUP' | 'PROJECT_SETUP' | 'BOARD';
export type AuthSubView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';