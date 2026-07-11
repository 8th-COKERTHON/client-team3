import { request } from "./client";
import type { CalendarDayChores } from "../types/calendar";

// GET /api/groups/{groupId}/chores/calendar - 캘린더용 날짜 범위 집안일 조회
export async function fetchCalendarChores(
  groupId: number,
  startDate: string,
  endDate: string,
): Promise<CalendarDayChores[]> {
  const response = await request<CalendarDayChores[]>(
    `/api/groups/${groupId}/chores/calendar?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
    },
  );

  return response.data;
}
