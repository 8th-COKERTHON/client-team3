import { request } from "./client";
import type {
  ChoreBoardResponse,
  ChoreStatus,
  UpdateChoreStatusResponse,
  ChoreCatalogResponse,
} from "../types/chore";

export function getChoreBoard(groupId: number) {
  return request<ChoreBoardResponse>(`/api/groups/${groupId}/chores/board`, {
    method: "GET",
  });
}

export function updateChoreStatus(
  groupId: number,
  choreId: number,
  status: ChoreStatus,
) {
  return request<UpdateChoreStatusResponse>(
    `/api/groups/${groupId}/chores/${choreId}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}

export function getChoreCatalog() {
  return request<ChoreCatalogResponse>("/api/chores", {
    method: "GET",
  });
}
