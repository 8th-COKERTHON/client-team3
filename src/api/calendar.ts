import type { ChoreCategory } from "../mockData";

// 서버 임시 그룹 ID. 로그인/그룹 선택 기능이 생기면 그 값으로 교체한다.
export const TEMP_GROUP_ID = 1;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  reasons?: Record<string, string>;
}

// GET /api/groups/{groupId}/chores/calendar - 캘린더용 날짜 범위 집안일 조회
export async function fetchCalendarChores(
  groupId: number,
  startDate: string,
  endDate: string,
): Promise<CalendarDayChores[]> {
  const url = new URL(`${API_BASE_URL}/api/groups/${groupId}/chores/calendar`);
  url.searchParams.set("startDate", startDate);
  url.searchParams.set("endDate", endDate);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`캘린더 과업 조회 실패 (${response.status})`);
  }

  const body: ApiEnvelope<CalendarDayChores[]> = await response.json();
  return body.data;
}

// 서버의 자유 문자열 category를 화면에서 쓰는 5종 카테고리로 매칭
const CATEGORY_KEYWORDS: Record<ChoreCategory, string[]> = {
  kitchen: ["주방", "설거지", "냉장고"],
  cleaning: ["청소", "정리"],
  trash: ["쓰레기", "분리수거", "음식물"],
  laundry: ["세탁", "빨래"],
  bathroom: ["화장실", "욕실"],
};

export function resolveChoreCategory(rawCategory: string): ChoreCategory | null {
  const entry = (Object.entries(CATEGORY_KEYWORDS) as [ChoreCategory, string[]][]).find(
    ([, keywords]) => keywords.some((keyword) => rawCategory.includes(keyword)),
  );
  return entry ? entry[0] : null;
}
