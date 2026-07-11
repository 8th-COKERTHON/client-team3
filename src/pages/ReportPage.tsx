import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSavedUserNickname } from "../api/auth";
import { getGroupChoreReport, getSavedGroupId, getGroupMembers } from "../api/group";
import BottomNav from "../components/BottomNav";
import Header from "../components/common/Header";
import {
  buildFamilyMembers,
  MEMBER_BG_CLASS,
  MEMBER_TEXT_CLASS,
  type FamilyMember,
  type MemberColor,
} from "../types/main";

interface ReportMember {
  id: number;
  name: string;
  color: MemberColor;
  percentage: number;
  score: number;
  rank: number;
}

const BADGE_CLASS_BY_RANK = [
  "bg-brand/15 text-brand",
  "bg-[#D7D7D7] text-[#6D6D6D]",
  "bg-[#D8B1A2] text-white",
];

function shiftWeek(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount * 7);
  return nextDate;
}

function getWeekOfMonthLabel(date: Date) {
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
  const weekNumber = Math.ceil((date.getDate() + offset) / 7);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${weekNumber}주차`;
}

function buildChartBackground(members: ReportMember[]) {
  if (members.length === 0) {
    return "#F2F3F7";
  }

  let startAngle = 0;
  const segments = members.map((member) => {
    const endAngle = startAngle + (member.percentage / 100) * 360;
    const colorClass = MEMBER_BG_CLASS[member.color];
    const colorValue =
      colorClass === "bg-brand"
        ? "#FD5F54"
        : colorClass === "bg-info"
          ? "#4F80C8"
          : "#34C77B";
    const segment = `${colorValue} ${startAngle}deg ${endAngle}deg`;
    startAngle = endAngle;
    return segment;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

function ReportPage() {
  const navigate = useNavigate();
  const groupId = useMemo(() => getSavedGroupId(), []);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [reportMembers, setReportMembers] = useState<ReportMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [anchorDate, setAnchorDate] = useState(() => new Date());

  const savedUserNickname = useMemo(() => getSavedUserNickname(), []);

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

    async function fetchReportData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const targetWeek = anchorDate.toISOString().slice(0, 10);

        const [membersResponse, reportResponse] = await Promise.all([
          getGroupMembers(currentGroupId),
          getGroupChoreReport(currentGroupId, targetWeek),
        ]);

        if (cancelled) {
          return;
        }

        const nextMembers = buildFamilyMembers(membersResponse.data.members, savedUserNickname);
        const nextReportMembers = reportResponse.data.rankings
          .map((ranking) => {
            const matchedMember = nextMembers.find((member) => member.id === ranking.memberId);

            return {
              id: ranking.memberId,
              name: ranking.memberName,
              color: matchedMember?.color ?? "red",
              percentage: ranking.percentage,
              score: ranking.score,
              rank: ranking.rank,
            };
          })
          .sort((a, b) => a.rank - b.rank || b.score - a.score || a.id - b.id);

        setMembers(nextMembers);
        setReportMembers(nextReportMembers);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "리포트를 불러오지 못했어요.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchReportData();

    return () => {
      cancelled = true;
    };
  }, [anchorDate, groupId, savedUserNickname]);

  const profileInitial = useMemo(
    () => members.find((member) => member.isMe)?.fullName.slice(0, 1) ?? savedUserNickname?.slice(0, 1) ?? "?",
    [members, savedUserNickname],
  );

  const chartMembers = useMemo(
    () => reportMembers.filter((member) => member.percentage > 0),
    [reportMembers],
  );
  const chartBackground = useMemo(() => buildChartBackground(chartMembers), [chartMembers]);
  const weekLabel = useMemo(() => getWeekOfMonthLabel(anchorDate), [anchorDate]);

  return (
    <main className="relative min-h-screen w-full max-w-md mx-auto bg-white pb-[calc(var(--bottom-nav-height)+var(--safe-bottom))]">
      <Header title="리포트" profileInitial={profileInitial} showActions />

      <div className="flex flex-col gap-5 px-5 pb-4 pt-0">
        <section className="-mx-5 rounded-b-[32px] bg-white px-5 pb-8 pt-2 shadow-[0_18px_45px_rgba(20,20,43,0.08)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-headline font-extrabold leading-tight text-gray-900">{weekLabel}</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="이전 주"
                onClick={() => setAnchorDate((prev) => shiftWeek(prev, -1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-300"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="다음 주"
                onClick={() => setAnchorDate((prev) => shiftWeek(prev, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-300"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-3">
            <div
              className="relative h-[192px] w-[192px] rounded-full shadow-[0_10px_24px_rgba(32,32,32,0.12)]"
              style={{ background: chartBackground }}
            >
              <div className="absolute left-1/2 top-1/2 h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-white bg-[#F3F4F8]" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {chartMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${MEMBER_BG_CLASS[member.color]}`} />
                  <span className="text-body-01 font-medium leading-none text-gray-900">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>

            {!isLoading && chartMembers.length === 0 && (
              <p className="mt-6 text-body-01 font-medium text-gray-400">표시할 리포트가 없어요.</p>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_14px_36px_rgba(31,31,31,0.06)]">
          <div className="px-5 pb-4 pt-5">
            <h2 className="text-title-02 font-extrabold leading-tight text-gray-900">랭킹</h2>
          </div>

          {errorMessage ? (
            <div className="px-5 pb-8">
              <p className="text-body-02 font-medium text-brand">{errorMessage}</p>
            </div>
          ) : isLoading ? (
            <div className="px-5 pb-8">
              <p className="text-body-02 font-medium text-gray-400">리포트를 불러오는 중...</p>
            </div>
          ) : reportMembers.length === 0 ? (
            <div className="px-5 pb-8">
              <p className="text-body-02 font-medium text-gray-400">표시할 랭킹이 없어요.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 px-4">
              {reportMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-subtitle font-extrabold leading-none ${
                        BADGE_CLASS_BY_RANK[member.rank - 1] ?? "bg-[#EFEFEF] text-gray-500"
                      }`}
                    >
                      {member.rank}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${MEMBER_BG_CLASS[member.color]}`} />
                      <span className="text-subtitle font-bold leading-none text-gray-900">
                        {member.name}
                      </span>
                    </div>
                  </div>

                  <span className={`text-body-01 font-bold leading-none ${MEMBER_TEXT_CLASS[member.color]}`}>
                    +{member.score}p
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md">
        <BottomNav />
      </div>
    </main>
  );
}

export default ReportPage;
