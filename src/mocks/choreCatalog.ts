// src/mocks/choreCatalog.ts
export interface CatalogChore {
  choreId: number;
  category: string;
  name: string;
  difficulty: number; // 화면 표시용 (닷 개수)
  score: number; // 실제 포인트, 서버가 랭킹 계산에 씀
}

export const MOCK_CHORE_CATALOG: CatalogChore[] = [
  // 주방
  { choreId: 1, category: "주방", name: "식탁 닦기", difficulty: 1, score: 5 },
  { choreId: 2, category: "주방", name: "설거지하기", difficulty: 1, score: 5 },
  {
    choreId: 3,
    category: "주방",
    name: "냉장고 정리",
    difficulty: 1,
    score: 5,
  },
  // 청소
  { choreId: 4, category: "청소", name: "정리정돈", difficulty: 1, score: 5 },
  {
    choreId: 5,
    category: "청소",
    name: "청소기 돌리기",
    difficulty: 1,
    score: 5,
  },
  {
    choreId: 6,
    category: "청소",
    name: "바닥 물걸레질",
    difficulty: 1,
    score: 5,
  },
  // 쓰레기 배출
  {
    choreId: 7,
    category: "쓰레기 배출",
    name: "일반 쓰레기 버리기",
    difficulty: 1,
    score: 5,
  },
  {
    choreId: 8,
    category: "쓰레기 배출",
    name: "음식물 쓰레기 비우기",
    difficulty: 1,
    score: 5,
  },
  {
    choreId: 9,
    category: "쓰레기 배출",
    name: "분리수거 버리기",
    difficulty: 1,
    score: 5,
  },
  // 세탁
  {
    choreId: 10,
    category: "세탁",
    name: "빨래 돌리고 널기",
    difficulty: 1,
    score: 5,
  },
  { choreId: 11, category: "세탁", name: "빨래 개기", difficulty: 1, score: 5 },
  // 화장실
  {
    choreId: 12,
    category: "화장실",
    name: "배수구 머리카락 정리",
    difficulty: 1,
    score: 5,
  },
  {
    choreId: 13,
    category: "화장실",
    name: "화장실 전체 청소",
    difficulty: 1,
    score: 5,
  },
];
