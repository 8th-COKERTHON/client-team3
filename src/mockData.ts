// 가사 과업 카테고리 (Figma 디자인 기준 5종) - 주간 달력 태그용
export type ChoreCategory = "kitchen" | "cleaning" | "trash" | "laundry" | "bathroom";

// 가족 구성원 식별 색상 - 오늘의 과업 리스트에서 담당자 구분용
export type MemberColor = "red" | "blue" | "green";

// 가족 구성원
export interface FamilyMember {
  id: string;
  fullName: string; // 필터 칩, 과업 카드 등 모든 곳에서 사용하는 전체 이름 (예: "김민준")
  color: MemberColor;
  isMe?: boolean;
}

// 가사 과업(퀘스트) 한 건
export interface Chore {
  id: string;
  title: string;
  category: ChoreCategory;
  difficulty: 1 | 2 | 3 | 4 | 5; // 난이도 (Figma DifficultyBar 5칸 기준)
  assigneeId: string;
  assigneeName: string;
  color: MemberColor; // 담당자 색상 (assigneeId의 color를 그대로 반영)
  point: number;
  done: boolean;
  date: string; // YYYY-MM-DD
}

// 오늘 날짜 (목데이터 기준 고정값)
export const TODAY_ISO = "2026-07-11";

// 담당자 색상 (index.css @theme 토큰과 매칭)
// Tailwind는 클래스명을 정적으로 스캔하므로 조합이 아닌 완성된 클래스 문자열로 선언한다.
export const MEMBER_BG_CLASS: Record<MemberColor, string> = {
  red: "bg-brand",
  blue: "bg-info",
  green: "bg-member-green",
};

export const MEMBER_TEXT_CLASS: Record<MemberColor, string> = {
  red: "text-brand",
  blue: "text-info",
  green: "text-member-green",
};

export const MEMBER_BORDER_CLASS: Record<MemberColor, string> = {
  red: "border-brand",
  blue: "border-info",
  green: "border-member-green",
};

// 선택된 아바타 칩 배경(옅은 틴트). "/10" opacity modifier까지 포함해 리터럴로 선언해야
// Tailwind의 정적 클래스 스캐너가 인식한다.
export const MEMBER_TINT_CLASS: Record<MemberColor, string> = {
  red: "bg-brand/10",
  blue: "bg-info/10",
  green: "bg-member-green/10",
};

// 카테고리별 표시 색상 (index.css @theme 토큰과 매칭) - 주간 달력 태그 전용
export const CATEGORY_BG_CLASS: Record<ChoreCategory, string> = {
  kitchen: "bg-category-kitchen",
  cleaning: "bg-category-cleaning",
  trash: "bg-category-trash",
  laundry: "bg-category-laundry",
  bathroom: "bg-category-bathroom",
};

export const CATEGORY_TEXT_CLASS: Record<ChoreCategory, string> = {
  kitchen: "text-category-kitchen",
  cleaning: "text-category-cleaning",
  trash: "text-category-trash",
  laundry: "text-category-laundry",
  bathroom: "text-category-bathroom",
};

// 주간 달력 태그 배경(옅은 틴트). "/10" opacity modifier까지 포함해 리터럴로 선언해야
// Tailwind의 정적 클래스 스캐너가 인식한다.
export const CATEGORY_TINT_CLASS: Record<ChoreCategory, string> = {
  kitchen: "bg-category-kitchen/10",
  cleaning: "bg-category-cleaning/10",
  trash: "bg-category-trash/10",
  laundry: "bg-category-laundry/10",
  bathroom: "bg-category-bathroom/10",
};

export const CATEGORY_LABEL: Record<ChoreCategory, string> = {
  kitchen: "주방",
  cleaning: "청소",
  trash: "쓰레기 배출",
  laundry: "세탁",
  bathroom: "화장실",
};

export const familyMembers: FamilyMember[] = [
  { id: "kim-minjun", fullName: "김민준", color: "red", isMe: true },
  { id: "lee-minjun", fullName: "이민준", color: "blue" },
  { id: "park-minjun", fullName: "박민준", color: "green" },
];

export const chores: Chore[] = [
  // 이번 주 이전 날짜 (주간 달력 카테고리 태그 표시용)
  { id: "w1", title: "빨래 돌리고 널기", category: "laundry", difficulty: 2, assigneeId: "lee-minjun", assigneeName: "이민준", color: "blue", point: 10, done: true, date: "2026-07-06" },
  { id: "w2", title: "분리수거 버리기", category: "trash", difficulty: 3, assigneeId: "kim-minjun", assigneeName: "김민준", color: "red", point: 15, done: true, date: "2026-07-07" },
  { id: "w3", title: "음식물 쓰레기 비우기", category: "trash", difficulty: 2, assigneeId: "park-minjun", assigneeName: "박민준", color: "green", point: 10, done: true, date: "2026-07-07" },
  { id: "w4", title: "빨래 개기", category: "laundry", difficulty: 2, assigneeId: "kim-minjun", assigneeName: "김민준", color: "red", point: 10, done: true, date: "2026-07-08" },
  { id: "w5", title: "음식물 쓰레기 비우기", category: "trash", difficulty: 2, assigneeId: "lee-minjun", assigneeName: "이민준", color: "blue", point: 10, done: true, date: "2026-07-09" },
  { id: "w6", title: "빨래 돌리고 널기", category: "laundry", difficulty: 2, assigneeId: "park-minjun", assigneeName: "박민준", color: "green", point: 10, done: true, date: "2026-07-10" },
  { id: "w7", title: "설거지하기", category: "kitchen", difficulty: 2, assigneeId: "lee-minjun", assigneeName: "이민준", color: "blue", point: 10, done: true, date: "2026-07-12" },

  // 오늘 (2026-07-11)의 과업 7건 - 1건만 완료, 3명에게 분배
  { id: "t1", title: "설거지하기", category: "kitchen", difficulty: 2, assigneeId: "kim-minjun", assigneeName: "김민준", color: "red", point: 10, done: true, date: TODAY_ISO },
  { id: "t2", title: "냉장고 정리", category: "kitchen", difficulty: 4, assigneeId: "kim-minjun", assigneeName: "김민준", color: "red", point: 20, done: false, date: TODAY_ISO },
  { id: "t3", title: "청소기 돌리기", category: "cleaning", difficulty: 2, assigneeId: "lee-minjun", assigneeName: "이민준", color: "blue", point: 10, done: false, date: TODAY_ISO },
  { id: "t4", title: "분리수거 버리기", category: "trash", difficulty: 3, assigneeId: "park-minjun", assigneeName: "박민준", color: "green", point: 15, done: false, date: TODAY_ISO },
  { id: "t5", title: "빨래 개기", category: "laundry", difficulty: 2, assigneeId: "lee-minjun", assigneeName: "이민준", color: "blue", point: 10, done: false, date: TODAY_ISO },
  { id: "t6", title: "화장실 전체 청소", category: "bathroom", difficulty: 5, assigneeId: "park-minjun", assigneeName: "박민준", color: "green", point: 25, done: false, date: TODAY_ISO },
  { id: "t7", title: "정리정돈", category: "cleaning", difficulty: 1, assigneeId: "lee-minjun", assigneeName: "이민준", color: "blue", point: 5, done: false, date: TODAY_ISO },
];
