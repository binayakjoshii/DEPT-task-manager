export type Role = 'org_admin' | 'dept_head' | 'member';
export type Department = 'engineering' | 'design' | 'hr' | 'sales';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface User {
  id: number;
  name: string;
  role: Role;
  department: Department;
}

export interface Task {
  id: number;
  title: string;
  department: Department;
  assignedTo: number;
  status: TaskStatus;
}