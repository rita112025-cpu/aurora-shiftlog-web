export interface WorkRecord {
  id: string;
  date: string;
  projectCode: string;
  systemType: 'SCADA' | 'REVIT' | 'AI' | 'PLC' | 'HMI' | 'OTHER';
  hours: number;
  notes: string;
  status: 'pending' | 'in-progress' | 'completed' | 'review';
  createdAt: string;
}

export interface Project {
  code: string;
  name: string;
  client?: string;
}

export type ViewMode = 'dashboard' | 'table' | 'gantt';

export interface PomodoroState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'work' | 'break';
  sessions: number;
}
