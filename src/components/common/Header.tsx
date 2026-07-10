import { Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps) {
  return (
    // 상단 헤더 (로고/타이틀 · 알림 · 프로필)
    <header
      className="flex w-full items-center justify-between px-5 pb-3"
      style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}
    >
      {/* 로고 또는 페이지 타이틀 */}
      {title ? (
        <span className="text-title-01 leading-tight font-bold text-gray-900">{title}</span>
      ) : (
        <div className="flex items-baseline gap-0.5">
          <span className="text-title-02 leading-none font-bold text-gray-900">한땀</span>
          <span className="text-body-02 leading-none font-bold text-brand">績</span>
        </div>
      )}

      {/* 알림 · 프로필 아바타 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5FA]"
        >
          <Bell size={16} strokeWidth={2} className="text-gray-900" />
        </button>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-body-01 leading-none font-bold text-white">
          김
        </span>
      </div>
    </header>
  );
}

export default Header;
