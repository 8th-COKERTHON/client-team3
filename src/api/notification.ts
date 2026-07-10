import { request } from "./client";
import type { ChoreRequestNotification } from "../types/notification";

// GET /api/chore-requests/notifications - 알림 목록 조회 (벨 클릭 시 호출, 조회와 동시에 읽음 처리됨)
export function getChoreRequestNotifications() {
  return request<ChoreRequestNotification[]>("/api/chore-requests/notifications", {
    method: "GET",
  });
}

// GET /api/chore-requests/unread-count - 읽지 않은 알림 수 조회 (벨 빨간 점 표시 여부, 주기적으로 폴링)
export function getUnreadNotificationCount() {
  return request<number>("/api/chore-requests/unread-count", {
    method: "GET",
  });
}
