import type { ApiChore } from "./calendar";
import type { ChoreBoardItem } from "./chore";
import type { GroupMember } from "./group";

export type ChoreCategory = "kitchen" | "cleaning" | "trash" | "laundry" | "bathroom";
export type MemberColor = "red" | "blue" | "green";

export interface FamilyMember {
  id: number;
  fullName: string;
  color: MemberColor;
  isMe?: boolean;
}

export interface MainChore {
  id: number;
  choreId: number;
  title: string;
  category: ChoreCategory | null;
  difficulty: number;
  assigneeId: number;
  assigneeName: string;
  color: MemberColor;
  point: number;
  done: boolean;
  date: string;
}

const MEMBER_COLORS: MemberColor[] = ["red", "blue", "green"];

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

export const MEMBER_TINT_CLASS: Record<MemberColor, string> = {
  red: "bg-brand/10",
  blue: "bg-info/10",
  green: "bg-member-green/10",
};

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

const CATEGORY_KEYWORDS: Record<ChoreCategory, string[]> = {
  kitchen: ["주방", "설거지", "냉장고"],
  cleaning: ["청소", "정리"],
  trash: ["쓰레기", "분리수거", "음식물"],
  laundry: ["세탁", "빨래"],
  bathroom: ["화장실", "욕실"],
};

export function getTodayIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function resolveChoreCategory(rawCategory: string, choreName?: string): ChoreCategory | null {
  const normalizedSource = `${rawCategory} ${choreName ?? ""}`;

  const entry = (Object.entries(CATEGORY_KEYWORDS) as [ChoreCategory, string[]][])
    .find(([, keywords]) => keywords.some((keyword) => normalizedSource.includes(keyword)));

  return entry ? entry[0] : null;
}

export function buildFamilyMembers(members: GroupMember[]): FamilyMember[] {
  return members.map((member, index) => ({
    id: member.memberId,
    fullName: member.name,
    color: MEMBER_COLORS[index % MEMBER_COLORS.length],
  }));
}

function getMemberColor(memberId: number, members: FamilyMember[]) {
  return members.find((member) => member.id === memberId)?.color ?? MEMBER_COLORS[memberId % MEMBER_COLORS.length];
}

export function buildMainChoreFromBoard(chore: ChoreBoardItem, members: FamilyMember[]): MainChore {
  return {
    id: chore.id,
    choreId: chore.choreId,
    title: chore.name,
    category: resolveChoreCategory(chore.category, chore.name),
    difficulty: chore.difficulty,
    assigneeId: chore.assigneeId,
    assigneeName: chore.assigneeName,
    color: getMemberColor(chore.assigneeId, members),
    point: chore.score,
    done: chore.status === "DONE",
    date: chore.date,
  };
}

export function buildMainChoreFromCalendar(chore: ApiChore, members: FamilyMember[]): MainChore {
  return {
    id: chore.id,
    choreId: chore.choreId,
    title: chore.name,
    category: resolveChoreCategory(chore.category, chore.name),
    difficulty: chore.difficulty,
    assigneeId: chore.assigneeId,
    assigneeName: chore.assigneeName,
    color: getMemberColor(chore.assigneeId, members),
    point: chore.score,
    done: chore.status === "DONE",
    date: chore.date,
  };
}
