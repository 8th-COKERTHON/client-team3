export type ChoreStatus = "SCHEDULED" | "IN_PROGRESS" | "DONE";
export type AssignType = "NONE" | "MANUAL" | "ROULETTE";
export type RepeatCycle = "NONE" | "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "YEARLY";

export type ChoreStatusOption = "pending" | "inProgress" | "done";

export interface ChoreBoardItem {
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
  status: ChoreStatus;
}

export interface ChoreBoardResponse {
  scheduled: ChoreBoardItem[];
  inProgress: ChoreBoardItem[];
  done: ChoreBoardItem[];
}

export interface UpdateChoreStatusRequest {
  status: ChoreStatus;
  performerId?: number;
}

export type UpdateChoreStatusResponse = ChoreBoardItem;

export const CHORE_STATUS_TO_OPTION: Record<ChoreStatus, ChoreStatusOption> = {
  SCHEDULED: "pending",
  IN_PROGRESS: "inProgress",
  DONE: "done",
};

export const CHORE_OPTION_TO_STATUS: Record<ChoreStatusOption, ChoreStatus> = {
  pending: "SCHEDULED",
  inProgress: "IN_PROGRESS",
  done: "DONE",
};

export interface CatalogChore {
  id: number;
  category: string;
  name: string;
  difficulty: number;
  score: number;
  memo: string;
}

export type ChoreCatalogResponse = CatalogChore[];

export interface GroupChoreCreateRequest {
  name: string;
  difficulty: number;
  date: string;
  assignType: AssignType;
  assigneeId?: number;
  repeatCycle: RepeatCycle;
  repeatPattern?: string;
  memo?: string;
}

export interface GroupChoreFromCatalogRequest {
  name?: string;
  date: string;
  assignType: AssignType;
  assigneeId?: number;
  repeatCycle: RepeatCycle;
  repeatPattern?: string;
  memo?: string;
}

export type GroupChoreResponse = ChoreBoardItem;
