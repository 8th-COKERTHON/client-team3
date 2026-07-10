import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Header from "../components/common/Header";
import BottomNav from "../components/BottomNav";
import FamilyFilter, { type FilterId } from "../components/Main/FamilyFilter";
import WeeklyCalendar from "../components/Main/WeeklyCalender";
import EmergencyAlert from "../components/Main/EmergencyAlert";
import ChoreList from "../components/Main/ChoreList";
import DateChoreSheet from "../components/Main/DateChoreSheet";
import ChoreCatalogBottomSheet from "../components/chore/ChoreCatalogBottomSheet";
import InviteCodeBottomSheet from "../components/bottomsheet/InviteCodeBottomSheet";
import TaskDetailBottomSheet from "../components/bottomsheet/TaskDetailBottomSheet";
import { getSavedUserNickname } from "../api/auth";
import { getChoreBoard, updateChoreStatus } from "../api/chore";
import { getGroupInviteCode, getGroupMembers, getSavedGroupId } from "../api/group";
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
  const groupId = useMemo(() => getSavedGroupId(), []);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [chores, setChores] = useState<MainChore[]>([]);
  const [activeFilterId, setActiveFilterId] = useState<FilterId>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateChores, setSelectedDateChores] = useState<MainChore[]>([]);
  const [selectedChoreId, setSelectedChoreId] = useState<number | null>(null);
  const [isChoreCatalogOpen, setIsChoreCatalogOpen] = useState(false);
  const [isInviteSheetOpen, setIsInviteSheetOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isInviteCodeLoading, setIsInviteCodeLoading] = useState(false);
  const [inviteCodeErrorMessage, setInviteCodeErrorMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const todayIso = useMemo(() => getTodayIsoDate(), []);
  const savedUserNickname = useMemo(() => getSavedUserNickname(), []);
  const todayChores = chores.filter((chore) => chore.date === todayIso);
  const visibleChores =
    activeFilterId === "all"
      ? todayChores
      : todayChores.filter((chore) => String(chore.assigneeId) === activeFilterId);
  const urgentChore = todayChores.find((chore) => !chore.done);
  const selectedChore: MainChore | null =
    chores.find((chore) => chore.id === selectedChoreId) ??
    selectedDateChores.find((chore) => chore.id === selectedChoreId) ??
    null;

  useEffect(() => {
    if (!groupId) {
      navigate("/room-entry", { replace: true });
    }
  }, [groupId, navigate]);

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

        const nextMembers = buildFamilyMembers(membersResponse.data.members, savedUserNickname);
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
  }, [groupId, savedUserNickname]);

  const profileInitial = useMemo(
    () => members.find((member) => member.isMe)?.fullName.slice(0, 1) ?? savedUserNickname?.slice(0, 1) ?? "?",
    [members, savedUserNickname],
  );

  const syncUpdatedChore = (updatedChore: ChoreBoardItem) => {
    setChores((prev) =>
      prev
        .map((chore) =>
          chore.id === updatedChore.id ? buildMainChoreFromBoard(updatedChore, members) : chore,
        )
        .sort(sortChoresByDone),
    );
    setSelectedDateChores((prev) =>
      prev
        .map((chore) =>
          chore.id === updatedChore.id ? buildMainChoreFromBoard(updatedChore, members) : chore,
        )
        .sort(sortChoresByDone),
    );
  };

  const handleToggle = async (groupChoreId: number, done: boolean) => {
    if (!groupId) {
      return;
    }

    const nextStatus: ChoreStatus = done ? "SCHEDULED" : "DONE";

    try {
      const response = await updateChoreStatus(groupId, groupChoreId, nextStatus);
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

  const handleOpenInviteSheet = async () => {
    if (!groupId) {
      return;
    }

    setIsInviteSheetOpen(true);
    setIsInviteCodeLoading(true);
    setInviteCodeErrorMessage(null);

    try {
      const response = await getGroupInviteCode(groupId);
      setInviteCode(response.data.inviteCode);
    } catch (error) {
      setInviteCode("");
      setInviteCodeErrorMessage(
        error instanceof Error ? error.message : "초대 코드를 불러오지 못했어요.",
      );
    } finally {
      setIsInviteCodeLoading(false);
    }
  };

  if (isLoading && groupId) {
    return (
      <main className="relative min-h-screen w-full max-w-md mx-auto bg-white">
        <Header title="홈" profileInitial={profileInitial} />
        <div className="flex min-h-[60vh] items-center justify-center px-5">
          <p className="text-body-02 font-medium text-gray-400">메인 정보를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full max-w-md mx-auto bg-white pb-[calc(var(--bottom-nav-height)+var(--safe-bottom))]">
      <Header title="홈" profileInitial={profileInitial} />

      <div className="flex flex-col gap-5 px-5 pb-4 pt-0">
        <section className="-mx-5 rounded-b-[32px] bg-white px-5 pb-8 pt-2 shadow-[0_18px_45px_rgba(20,20,43,0.08)]">
          <div className="flex flex-col gap-6">
            <FamilyFilter
              members={members}
              activeId={activeFilterId}
              onSelect={setActiveFilterId}
              onInviteClick={handleOpenInviteSheet}
            />
            {groupId && <WeeklyCalendar groupId={groupId} onSelectDate={handleDateSelect} />}
          </div>
        </section>

        {urgentChore && (
          <EmergencyAlert choreName={urgentChore.title} memberName={urgentChore.assigneeName} />
        )}

        {errorMessage && (
          <p className="text-body-02 font-medium text-brand">{errorMessage}</p>
        )}

        <ChoreList
          chores={visibleChores}
          onToggle={handleToggle}
          onOpenDetail={(chore) => setSelectedChoreId(chore.id)}
        />
      </div>

      <button
        type="button"
        aria-label="과업 추가"
        onClick={() => setIsChoreCatalogOpen(true)}
        className="fixed bottom-[calc(var(--bottom-nav-height)+var(--safe-bottom)+20px)] right-[max(20px,calc((100vw-min(100vw,var(--app-max-width)))/2+20px))] z-20 flex h-[62px] w-[62px] items-center justify-center rounded-[20px] bg-brand text-white shadow-[0_18px_30px_rgba(253,95,84,0.32)]"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {isChoreCatalogOpen && (
        <ChoreCatalogBottomSheet onClose={() => setIsChoreCatalogOpen(false)} />
      )}

      <DateChoreSheet
        date={selectedDate}
        chores={selectedDateChores}
        onClose={() => setSelectedDate(null)}
        onToggle={handleToggle}
      />

      <InviteCodeBottomSheet
        open={isInviteSheetOpen}
        inviteCode={inviteCode}
        isLoading={isInviteCodeLoading}
        errorMessage={inviteCodeErrorMessage}
        onClose={() => setIsInviteSheetOpen(false)}
      />

      {selectedChore && groupId && (
        <TaskDetailBottomSheet
          groupId={groupId}
          groupChoreId={selectedChore.id}
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
