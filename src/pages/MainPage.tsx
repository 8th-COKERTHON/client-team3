import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import BottomNav from "../components/BottomNav";
import FamilyFilter, { type FilterId } from "../components/Main/FamilyFilter";
import WeeklyCalendar from "../components/Main/WeeklyCalender";
import EmergencyAlert from "../components/Main/EmergencyAlert";
import ChoreList from "../components/Main/ChoreList";
import DateChoreSheet from "../components/Main/DateChoreSheet";
import TaskDetailBottomSheet from "../components/bottomsheet/TaskDetailBottomSheet";
import { getChoreBoard, updateChoreStatus } from "../api/chore";
import { getGroupMembers, getSavedGroupId } from "../api/group";
import type { ApiChore } from "../types/calendar";
import type { ChoreBoardItem, ChoreStatus } from "../types/chore";
import {
  buildFamilyMembers,
  buildMainChoreFromBoard,
  buildMainChoreFromCalendar,
  getTodayIsoDate,
  type FamilyMember,
  type MainChore,
} from "../types/main";

function sortChoresByDone(a: MainChore, b: MainChore) {
  if (a.done !== b.done) {
    return Number(a.done) - Number(b.done);
  }

  return a.choreId - b.choreId;
}

function mapBoardToMainChores(board: ChoreBoardItem[], members: FamilyMember[]) {
  return board.map((chore) => buildMainChoreFromBoard(chore, members)).sort(sortChoresByDone);
}

function MainPage() {
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [chores, setChores] = useState<MainChore[]>([]);
  const [activeFilterId, setActiveFilterId] = useState<FilterId>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateChores, setSelectedDateChores] = useState<MainChore[]>([]);
  const [selectedChoreId, setSelectedChoreId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const todayIso = useMemo(() => getTodayIsoDate(), []);
  const todayChores = chores.filter((chore) => chore.date === todayIso);
  const visibleChores =
    activeFilterId === "all"
      ? todayChores
      : todayChores.filter((chore) => String(chore.assigneeId) === activeFilterId);
  const urgentChore = todayChores.find((chore) => !chore.done);
  const selectedChore: MainChore | null =
    chores.find((chore) => chore.choreId === selectedChoreId) ??
    selectedDateChores.find((chore) => chore.choreId === selectedChoreId) ??
    null;

  useEffect(() => {
    const savedGroupId = getSavedGroupId();

    if (!savedGroupId) {
      navigate("/room-entry", { replace: true });
      return;
    }

    setGroupId(savedGroupId);
  }, [navigate]);

  useEffect(() => {
    if (!groupId) {
      return;
    }

    const currentGroupId = groupId;
    let cancelled = false;

    async function fetchMainPageData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [membersResponse, boardResponse] = await Promise.all([
          getGroupMembers(currentGroupId),
          getChoreBoard(currentGroupId),
        ]);

        if (cancelled) {
          return;
        }

        const nextMembers = buildFamilyMembers(membersResponse.data.members);
        const boardItems = [
          ...boardResponse.data.scheduled,
          ...boardResponse.data.inProgress,
          ...boardResponse.data.done,
        ];

        setMembers(nextMembers);
        setChores(mapBoardToMainChores(boardItems, nextMembers));
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "메인 정보를 불러오지 못했어요.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchMainPageData();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const syncUpdatedChore = (updatedChore: ChoreBoardItem) => {
    setChores((prev) =>
      prev
        .map((chore) =>
          chore.choreId === updatedChore.choreId ? buildMainChoreFromBoard(updatedChore, members) : chore,
        )
        .sort(sortChoresByDone),
    );
    setSelectedDateChores((prev) =>
      prev
        .map((chore) =>
          chore.choreId === updatedChore.choreId ? buildMainChoreFromBoard(updatedChore, members) : chore,
        )
        .sort(sortChoresByDone),
    );
  };

  const handleToggle = async (choreId: number, done: boolean) => {
    if (!groupId) {
      return;
    }

    const nextStatus: ChoreStatus = done ? "SCHEDULED" : "DONE";

    try {
      const response = await updateChoreStatus(groupId, choreId, nextStatus);
      syncUpdatedChore(response.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "과업 상태를 변경하지 못했어요.");
    }
  };

  const handleDateSelect = (date: string, dayChores: ApiChore[]) => {
    setSelectedDate(date);
    setSelectedDateChores(
      dayChores.map((chore) => buildMainChoreFromCalendar(chore, members)).sort(sortChoresByDone),
    );
  };

  if (isLoading && groupId) {
    return (
      <main className="relative min-h-screen w-full max-w-md mx-auto bg-gray-50">
        <Header title="홈" />
        <div className="flex min-h-[60vh] items-center justify-center px-5">
          <p className="text-body-02 font-medium text-gray-400">메인 정보를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full max-w-md mx-auto bg-gray-50 pb-[calc(var(--bottom-nav-height)+var(--safe-bottom))]">
      <Header title="홈" />

      <div className="flex flex-col gap-5 px-5 py-4">
        <FamilyFilter members={members} activeId={activeFilterId} onSelect={setActiveFilterId} />

        {groupId && <WeeklyCalendar groupId={groupId} onSelectDate={handleDateSelect} />}

        {urgentChore && (
          <EmergencyAlert choreName={urgentChore.title} memberName={urgentChore.assigneeName} />
        )}

        {errorMessage && (
          <p className="text-body-02 font-medium text-brand">{errorMessage}</p>
        )}

        <ChoreList
          chores={visibleChores}
          onToggle={handleToggle}
          onOpenDetail={(chore) => setSelectedChoreId(chore.choreId)}
        />
      </div>

      <DateChoreSheet
        date={selectedDate}
        chores={selectedDateChores}
        onClose={() => setSelectedDate(null)}
        onToggle={handleToggle}
      />

      {selectedChore && groupId && (
        <TaskDetailBottomSheet
          groupId={groupId}
          choreId={selectedChore.choreId}
          members={members.map((member) => ({ id: String(member.id), label: member.fullName }))}
          onStatusUpdated={syncUpdatedChore}
          onClose={() => setSelectedChoreId(null)}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md">
        <BottomNav />
      </div>
    </main>
  );
}

export default MainPage;
