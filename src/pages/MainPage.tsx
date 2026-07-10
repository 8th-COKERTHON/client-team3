import { useState } from "react";
import Header from "../components/common/Header";
import FamilyFilter, { type FilterId } from "../components/Main/FamilyFilter";
import WeeklyCalendar from "../components/Main/WeeklyCalender";
import EmergencyAlert from "../components/Main/EmergencyAlert";
import ChoreList from "../components/Main/ChoreList";
import { chores as initialChores, TODAY_ISO } from "../mockData";

function MainPage() {
  const [chores, setChores] = useState(initialChores);
  const [activeFilterId, setActiveFilterId] = useState<FilterId>("all");

  const todayChores = chores.filter((chore) => chore.date === TODAY_ISO);
  const visibleChores =
    activeFilterId === "all"
      ? todayChores
      : todayChores.filter((chore) => chore.assigneeId === activeFilterId);
  const urgentChore = todayChores.find((chore) => !chore.done);

  const handleToggle = (id: string) => {
    setChores((prev) =>
      prev.map((chore) => (chore.id === id ? { ...chore, done: !chore.done } : chore))
    );
  };

  return (
    // 메인 홈 화면 페이지
    <main className="min-h-screen w-full max-w-md mx-auto bg-gray-50">
      {/* 상단 헤더 */}
      <Header title="홈" />

      <div className="flex flex-col gap-5 px-5 py-4">
        {/* 가족 구성원 필터 섹션 */}
        <FamilyFilter activeId={activeFilterId} onSelect={setActiveFilterId} />

        {/* 주간 달력 섹션 */}
        <WeeklyCalendar />

        {/* 긴급 출동 알림 섹션 */}
        {urgentChore && (
          <EmergencyAlert choreName={urgentChore.title} memberName={urgentChore.assigneeName} />
        )}

        {/* 오늘의 과업 섹션 */}
        <ChoreList chores={visibleChores} onToggle={handleToggle} />
      </div>
    </main>
  );
}

export default MainPage;
