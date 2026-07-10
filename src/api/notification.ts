import { request } from "./client";
import type { ChoreRequestCreateRequest, ChoreRequestNotification } from "../types/notification";

// GET /api/chore-requests/notifications - 알림 목록 조회 (벨 클릭 시 호출, 조회와 동시에 읽음 처리됨)
export function getChoreRequestNotifications() {
  return request<ChoreRequestNotification[]>("/api/chore-requests/notifications", {
    method: "GET",
  });
}

export function sendChoreRequest(payload: ChoreRequestCreateRequest) {
  return request<void>("/api/chore-requests", {
    method: "POST",
    body: payload,
  });
}
