export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  recurring: 'none' | 'daily' | 'weekdays' | 'weekends' | 'custom';
  recurringDays?: number[]; // 0-6, Sunday-Saturday
  tone: string;
  isRinging: boolean;
}

export interface AppSettings {
  is24Hour: boolean;
  darkMode: boolean;
  snoozeInterval: number; // minutes
  alarmVolume: number; // 0-1
  defaultTone: string;
}

export type Tab = 'clock' | 'timer' | 'stopwatch';