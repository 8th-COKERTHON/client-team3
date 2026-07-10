import { CalendarDays, ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createGroupChore, createGroupChoreFromCatalog } from "../api/chore";
import { getSavedGroupId, getGroupMembers } from "../api/group";
import RouletteBottomSheet from "../components/bottomsheet/RouletteBottomSheet";
import { CalendarPicker } from "../components/chore/CalendarPicker";
import { DifficultySelector } from "../components/chore/DifficultySelector";
import { TextBox } from "../components/chore/TextBox";
import type { GroupMember } from "../types/group";
import type { AssignType, GroupChoreResponse, RepeatCycle } from "../types/chore";
import { getTodayIsoDate } from "../types/main";

interface CatalogSelection {
  choreId?: number;
  name?: string;
  difficulty?: number;
  score?: number;
}

const WEEKDAY_OPTIONS = [
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
  { label: "일", value: "SUN" },
] as const;

function getWeekdayCode(isoDate: string) {
  const weekday = new Date(isoDate).getDay();
  return WEEKDAY_OPTIONS[(weekday + 6) % 7].value;
}

export default function ChoreAddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = (location.state as CatalogSelection | null) ?? null;
  const isFromCatalog = Boolean(selected?.choreId);
  const groupId = useMemo(() => getSavedGroupId(), []);

  const [name, setName] = useState(selected?.name ?? "");
  const [nameTouched, setNameTouched] = useState(false);
  const [difficulty, setDifficulty] = useState(selected?.difficulty ?? 0);
  const [date, setDate] = useState(getTodayIsoDate());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatWeekdays, setRepeatWeekdays] = useState<string[]>([getWeekdayCode(getTodayIsoDate())]);
  const [assignType, setAssignType] = useState<AssignType>("MANUAL");
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [rouletteChore, setRouletteChore] = useState<GroupChoreResponse | null>(null);

  const nameError =
    nameTouched && name.trim() === "" ? "제목을 입력해 주세요." : undefined;
  const dateError = !date ? "날짜를 선택해 주세요." : undefined;
  const assigneeError =
    assignType === "MANUAL" && !selectedAssigneeId ? "담당자를 선택해 주세요." : undefined;

  useEffect(() => {
    if (!groupId) {
      navigate("/room-entry", { replace: true });
      return;
    }

    let cancelled = false;

    getGroupMembers(groupId)
      .then((response) => {
        if (cancelled) return;
        setMembers(response.data.members);
        setSelectedAssigneeId((prev) => prev ?? response.data.members[0]?.memberId ?? null);
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorMessage(error instanceof Error ? error.message : "그룹 멤버를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingMembers(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [groupId, navigate]);

  const toggleRepeatWeekday = (weekday: string) => {
    setRepeatWeekdays((prev) => {
      if (prev.includes(weekday)) {
        return prev.length === 1 ? prev : prev.filter((item) => item !== weekday);
      }

      return [...prev, weekday];
    });
  };

  const handleRepeatToggle = () => {
    setIsRepeating((prev) => {
      const next = !prev;
      if (next && repeatWeekdays.length === 0) {
        setRepeatWeekdays([getWeekdayCode(date)]);
      }
      return next;
    });
  };

  const handleDateChange = (nextDate: string) => {
    setDate(nextDate);
    if (isRepeating && repeatWeekdays.length === 0) {
      setRepeatWeekdays([getWeekdayCode(nextDate)]);
    }
    setShowCalendar(false);
  };

  const handleSave = async () => {
    setNameTouched(true);
    setErrorMessage(null);

    if (!groupId || !date || name.trim() === "" || difficulty === 0 || assigneeError) {
      return;
    }

    const repeatCycle: RepeatCycle = isRepeating ? "WEEKLY" : "NONE";
    const repeatPattern = isRepeating ? repeatWeekdays.join(",") : undefined;
    const basePayload = {
      date,
      assignType,
      assigneeId: assignType === "MANUAL" ? selectedAssigneeId ?? undefined : undefined,
      repeatCycle,
      repeatPattern,
      memo: memo.trim() || undefined,
    };

    try {
      setIsSubmitting(true);

      let createdChore: GroupChoreResponse;

      if (isFromCatalog && selected?.choreId) {
        const response = await createGroupChoreFromCatalog(groupId, selected.choreId, {
          ...basePayload,
          name: name.trim() || undefined,
        });
        createdChore = response.data;
      } else {
        const response = await createGroupChore(groupId, {
          ...basePayload,
          name: name.trim(),
          difficulty,
        });
        createdChore = response.data;
      }

      if (assignType === "ROULETTE") {
        setRouletteChore(createdChore);
        return;
      }

      navigate("/main", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "집안일을 저장하지 못했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-8">
      <header
        className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 pb-4"
        style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}
      >
        <button type="button" onClick={() => navigate(-1)} className="flex h-8 w-8 items-center">
          <ChevronLeft size={20} className="text-gray-900" />
        </button>
        <h1 className="text-body-01 font-bold text-gray-900">집안일 추가</h1>
        <div className="w-8" />
      </header>

      <div className="flex flex-col gap-5 px-5 pb-[calc(var(--safe-bottom)+24px)]">
        {errorMessage && <p className="text-body-02 font-medium text-brand">{errorMessage}</p>}

      <TextBox
        label="제목"
        value={name}
        onChange={setName}
        onBlur={() => setNameTouched(true)}
        placeholder="집안일 이름을 입력해 주세요"
        error={nameError}
      />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">날짜</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCalendar((prev) => !prev)}
              className="flex h-12 flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700"
            >
              <span className={date ? "text-gray-700" : "text-gray-400"}>{date || "YYYY-MM-DD"}</span>
              <CalendarDays size={18} className="text-gray-500" />
            </button>
            <button
              type="button"
              onClick={handleRepeatToggle}
              className={`h-12 rounded-xl px-4 text-sm font-semibold ${
                isRepeating ? "bg-brand text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              반복하기
            </button>
          </div>
          {dateError && <p className="text-xs text-brand">{dateError}</p>}
          {showCalendar && <CalendarPicker value={date} onChange={handleDateChange} />}
          {isRepeating && (
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAY_OPTIONS.map((weekday) => {
                const selectedWeekday = repeatWeekdays.includes(weekday.value);
                return (
                  <button
                    key={weekday.value}
                    type="button"
                    onClick={() => toggleRepeatWeekday(weekday.value)}
                    className={`flex h-10 items-center justify-center rounded-xl border text-sm font-medium ${
                      selectedWeekday
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    {weekday.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          난이도
        </label>
        <DifficultySelector
          value={difficulty}
          onChange={setDifficulty}
          disabled={isFromCatalog}
        />
      </div>

        <TextBox
          label="메모"
          value={memo}
          onChange={setMemo}
          placeholder="메모를 입력해 주세요"
        />

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">담당자</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAssignType("NONE")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:outline-none ${
                assignType === "NONE" ? "bg-brand text-white" : "bg-[#F5F5FA] text-gray-500"
              }`}
            >
              선택안함
            </button>
            <button
              type="button"
              onClick={() => setAssignType("MANUAL")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:outline-none ${
                assignType === "MANUAL" ? "bg-brand text-white" : "bg-[#F5F5FA] text-gray-500"
              }`}
            >
              직접선택
            </button>
            <button
              type="button"
              onClick={() => setAssignType("ROULETTE")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:outline-none ${
                assignType === "ROULETTE" ? "bg-brand text-white" : "bg-[#F5F5FA] text-gray-500"
              }`}
            >
              룰렛
            </button>
          </div>

          {assignType === "MANUAL" && (
            <div className="flex flex-col gap-2">
              {isLoadingMembers ? (
                <p className="rounded-2xl bg-[#FCFCFE] px-4 py-4 text-sm text-gray-400">
                  멤버를 불러오는 중...
                </p>
              ) : (
                members.map((member) => {
                  const isSelected = selectedAssigneeId === member.memberId;

                  return (
                    <button
                      key={member.memberId}
                      type="button"
                      onClick={() => setSelectedAssigneeId(member.memberId)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left ${
                        isSelected
                          ? "border-brand bg-brand/5 shadow-[0_10px_24px_rgba(253,95,84,0.08)]"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                          {member.name.slice(0, 1)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{member.name}</span>
                      </div>
                      <span
                        className={`h-5 w-5 rounded-full border ${
                          isSelected ? "border-brand bg-brand" : "border-gray-300 bg-white"
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>
          )}

          {assigneeError && <p className="text-xs text-brand">{assigneeError}</p>}
        </div>

        <button
          type="button"
          disabled={isSubmitting || !groupId || !date || name.trim() === "" || difficulty === 0 || Boolean(assigneeError)}
          onClick={handleSave}
          className="mt-2 h-14 w-full rounded-2xl bg-brand text-body-01 font-bold text-white disabled:bg-[#F0F0F6] disabled:text-gray-400"
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {groupId && rouletteChore && (
        <RouletteBottomSheet
          groupId={groupId}
          groupChoreId={rouletteChore.id}
          nextWeekStartDate={rouletteChore.date}
          onClose={() => {
            setRouletteChore(null);
            navigate("/main", { replace: true });
          }}
          onSave={() => {
            setRouletteChore(null);
            navigate("/main", { replace: true });
          }}
        />
      )}
    </main>
  );
}
