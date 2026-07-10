import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUnreadNotificationCount } from "../../api/notification";

const UNREAD_POLL_INTERVAL_MS = 30_000;

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);

  // 벨 빨간 점 표시 여부를 주기적으로 폴링
  useEffect(() => {
    let cancelled = false;

    async function fetchUnreadCount() {
      try {
        const response = await getUnreadNotificationCount();
        if (!cancelled) {
          setHasUnread(response.data > 0);
        }
      } catch {
        // 폴링 실패는 조용히 무시 (다음 주기에 재시도)
      }
    }

    void fetchUnreadCount();
    const intervalId = window.setInterval(fetchUnreadCount, UNREAD_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

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
          onClick={() => navigate("/notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5FA]"
        >
          <Bell size={16} strokeWidth={2} className="text-gray-900" />
          {hasUnread && (
            <span className="absolute right-2 top-[7px] h-2 w-2 rounded-full bg-brand" />
          )}
        </button>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-body-01 leading-none font-bold text-white">
          김
        </span>
      </div>
    </header>
  );
}

export default Header;
