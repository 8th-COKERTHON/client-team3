import { Plus } from "lucide-react";
import {
  MEMBER_BORDER_CLASS,
  MEMBER_TEXT_CLASS,
  MEMBER_TINT_CLASS,
  type FamilyMember,
} from "../../types/main";

// 필터 칩 하나의 식별자 ("all" 또는 family member id)
export type FilterId = "all" | string;

interface FamilyFilterProps {
  members: FamilyMember[];
  activeId: FilterId;
  onSelect: (id: FilterId) => void;
}

function FamilyFilter({ members, activeId, onSelect }: FamilyFilterProps) {
  return (
    // 가족 구성원 필터 섹션
    <section className="w-full">
      {/* 섹션 타이틀 */}
      <div className="mb-3 flex items-center gap-1.5">
        <h2 className="text-subtitle leading-tight font-bold text-gray-900">우리 방</h2>
        <span className="rounded-full bg-[#F0F0F6] px-2 py-0.5 text-caption leading-none font-medium text-gray-400">
          {members.length}명
        </span>
      </div>

      {/* 구성원 아바타 칩 목록 */}
      <div className="flex items-start gap-4 overflow-x-auto">
        {/* "전체" 칩 */}
        <button
          type="button"
          onClick={() => onSelect("all")}
          className="flex w-12 shrink-0 flex-col items-center gap-1.5"
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand text-caption leading-none font-bold ${
              activeId === "all" ? "bg-brand/10 text-brand" : "bg-[#F5F5FA] text-gray-300"
            }`}
          >
            전체
          </span>
          <span
            className={`text-body-02 leading-none font-medium ${
              activeId === "all" ? "text-gray-900" : "text-gray-300"
            }`}
          >
            전체
          </span>
        </button>

        {/* 구분선 */}
        <span className="mt-5 h-11 w-px shrink-0 bg-gray-100" />

        {/* 가족 구성원 칩 목록 */}
        {members.map((member) => {
          const memberId = String(member.id);
          const isActive = activeId === memberId;
          const ringClass = MEMBER_BORDER_CLASS[member.color];
          const activeBgClass = MEMBER_TINT_CLASS[member.color];
          const activeTextClass = MEMBER_TEXT_CLASS[member.color];

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelect(memberId)}
              className="flex w-14 shrink-0 flex-col items-center gap-1.5"
            >
              {/* 아바타 + "나" 배지 래퍼 */}
              <span className="relative flex h-11 w-11 items-center justify-center">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${ringClass} ${
                    isActive ? activeBgClass : "bg-[#F5F5FA]"
                  }`}
                >
                  <span
                    className={`text-title-02 leading-none font-medium ${
                      isActive ? activeTextClass : "text-gray-300"
                    }`}
                  >
                    {member.fullName.slice(0, 1)}
                  </span>
                </span>

                {member.isMe && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-1.5 py-0.5 text-[9px] leading-none font-bold text-white">
                    나
                  </span>
                )}
              </span>

              <span
                className={`text-body-02 leading-none font-medium whitespace-nowrap ${
                  isActive ? "text-gray-900" : "text-gray-300"
                }`}
              >
                {member.fullName}
              </span>
            </button>
          );
        })}

        {/* 가족 구성원 초대 칩 */}
        <button type="button" className="flex w-12 shrink-0 flex-col items-center gap-1.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-[#F5F5FA]">
            <Plus size={16} strokeWidth={1.5} className="text-gray-400" />
          </span>
          <span className="text-body-02 leading-none font-medium text-gray-400">초대</span>
        </button>
      </div>
    </section>
  );
}

export default FamilyFilter;
