import { useState } from "react";
import Header from "../components/common/Header";
import BottomNav from "../components/BottomNav";
import FamilyFilter, { type FilterId } from "../components/Main/FamilyFilter";
import WeeklyCalendar from "../components/Main/WeeklyCalender";
import EmergencyAlert from "../components/Main/EmergencyAlert";
import ChoreList from "../components/Main/ChoreList";
import DateChoreSheet from "../components/Main/DateChoreSheet";
import TaskDetailBottomSheet from "../components/bottomsheet/TaskDetailBottomSheet";
import { TEMP_GROUP_ID } from "../api/calendar";
import { chores as initialChores, familyMembers, TODAY_ISO, type Chore } from "../mockData";

// mock Chore.id(예: "t3")에서 숫자만 뽑아 TaskDetailBottomSheet가 요구하는 choreId로 변환
function toNumericChoreId(id: string): number {
  return Number(id.replace(/\D/g, "")) || 0;
}

function MainPage() {
  const [chores, setChores] = useState(initialChores);
  const [activeFilterId, setActiveFilterId] = useState<FilterId>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedChoreId, setSelectedChoreId] = useState<string | null>(null);

  const todayChores = chores.filter((chore) => chore.date === TODAY_ISO);
  const visibleChores =
    activeFilterId === "all"
      ? todayChores
      : todayChores.filter((chore) => chore.assigneeId === activeFilterId);
  const urgentChore = todayChores.find((chore) => !chore.done);
  const selectedDateChores = chores.filter((chore) => chore.date === selectedDate);
  const selectedChore: Chore | null = chores.find((chore) => chore.id === selectedChoreId) ?? null;

  const handleToggle = (id: string) => {
    setChores((prev) =>
      prev.map((chore) => (chore.id === id ? { ...chore, done: !chore.done } : chore))
    );
  };

  const handleComplete = (id: string) => {
    setChores((prev) => prev.map((chore) => (chore.id === id ? { ...chore, done: true } : chore)));
  };

  return (
    // 메인 홈 화면 페이지
    <main className="relative min-h-screen w-full max-w-md mx-auto bg-gray-50 pb-[calc(var(--bottom-nav-height)+var(--safe-bottom))]">
      {/* 상단 헤더 */}
      <Header title="홈" />

      <div className="flex flex-col gap-5 px-5 py-4">
        {/* 가족 구성원 필터 섹션 */}
        <FamilyFilter activeId={activeFilterId} onSelect={setActiveFilterId} />

        {/* 주간 달력 섹션 */}
        <WeeklyCalendar onSelectDate={setSelectedDate} />

        {/* 긴급 출동 알림 섹션 */}
        {urgentChore && (
          <EmergencyAlert choreName={urgentChore.title} memberName={urgentChore.assigneeName} />
        )}

        {/* 오늘의 과업 섹션 */}
        <ChoreList
          chores={visibleChores}
          onToggle={handleToggle}
          onOpenDetail={(chore) => setSelectedChoreId(chore.id)}
        />
      </div>

      {/* 날짜별 과업 바텀시트 */}
      <DateChoreSheet
        date={selectedDate}
        chores={selectedDateChores}
        onClose={() => setSelectedDate(null)}
        onToggle={handleToggle}
      />

      {/* 과업 상태 변경 모달 (팀 공용 TaskDetailBottomSheet, 실제 API 연동) */}
      {selectedChore && (
        <TaskDetailBottomSheet
          groupId={TEMP_GROUP_ID}
          choreId={toNumericChoreId(selectedChore.id)}
          members={familyMembers.map((member) => ({ id: member.id, label: member.fullName }))}
          onStatusUpdated={(updatedChore) => {
            if (updatedChore.status === "DONE") {
              handleComplete(selectedChore.id);
            }
          }}
          onClose={() => setSelectedChoreId(null)}
        />
      )}

      {/* 하단 네비게이션 */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md">
        <BottomNav />
      </div>
    </main>
  );
}

export default MainPage;
