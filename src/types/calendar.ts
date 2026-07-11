import type { ApiResponse } from "./api";

export interface ApiChore {
  id: number;
  groupId: number;
  choreId: number;
  category: string;
  name: string;
  date: string;
  difficulty: number;
  assignType: string;
  assigneeId: number;
  assigneeName: string;
  repeatCycle: string;
  repeatPattern: string;
  memo: string;
  score: number;
  status: string;
}

export interface CalendarDayChores {
  date: string;
  chores: ApiChore[];
}

export interface DailyChoresResponse {
  date: string;
  totalCount: number;
  completedCount: number;
  chores: ApiChore[];
}

export type CalendarChoresResponse = ApiResponse<CalendarDayChores[]>;
