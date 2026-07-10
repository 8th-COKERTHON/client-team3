import { request } from "./client";
import type {
  ChoreBoardResponse,
  ChoreStatus,
  UpdateChoreStatusResponse,
  ChoreCatalogResponse,
  GroupChoreCreateRequest,
  GroupChoreFromCatalogRequest,
  GroupChoreResponse,
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
  performerId?: number,
) {
  return request<UpdateChoreStatusResponse>(
    `/api/groups/${groupId}/chores/${choreId}/status`,
    {
      method: "PATCH",
      body: performerId === undefined ? { status } : { status, performerId },
    },
  );
}

export function getChoreCatalog() {
  return request<ChoreCatalogResponse>("/api/chores", {
    method: "GET",
  });
}

export function createGroupChore(groupId: number, payload: GroupChoreCreateRequest) {
  return request<GroupChoreResponse>(`/api/groups/${groupId}/chores`, {
    method: "POST",
    body: payload,
  });
}

export function createGroupChoreFromCatalog(
  groupId: number,
  choreId: number,
  payload: GroupChoreFromCatalogRequest,
) {
  return request<GroupChoreResponse>(`/api/groups/${groupId}/chores/catalog/${choreId}`, {
    method: "POST",
    body: payload,
  });
}
