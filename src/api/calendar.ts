import { request } from "./client";
import type { CalendarDayChores, DailyChoresResponse } from "../types/calendar";

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

export async function fetchDailyChores(
  groupId: number,
  date?: string,
): Promise<DailyChoresResponse> {
  const query = date ? `?date=${date}` : "";
  const response = await request<DailyChoresResponse>(
    `/api/groups/${groupId}/chores/daily${query}`,
    {
      method: "GET",
    },
  );

  return response.data;
}
