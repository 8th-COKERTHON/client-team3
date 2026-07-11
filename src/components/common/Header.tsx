import { useEffect, useState } from "react";
import { Bell, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUnreadNotificationCount } from "../../api/notification";

const UNREAD_POLL_INTERVAL_MS = 30_000;

interface HeaderProps {
  title?: string;
  profileInitial?: string;
  onBack?: () => void;
  showActions?: boolean;
  backgroundClassName?: string;
  compact?: boolean;
}

function Header({
  title,
  profileInitial = "?",
  onBack,
  showActions = false,
  backgroundClassName = "bg-white",
  compact = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);
  const shouldBalanceTitle = Boolean(onBack && title);
  const isBackHeader = Boolean(onBack) && !showActions;

  // 벨 빨간 점 표시 여부를 주기적으로 폴링
  useEffect(() => {
    if (!showActions) {
      return;
    }

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
  }, [showActions]);
  return (
    <header
      className={`relative flex w-full items-center px-5 ${
        isBackHeader ? "h-12" : compact ? "pb-1" : "pb-3"
      } ${backgroundClassName} ${
        showActions ? "justify-between" : "justify-start"
      }`}
      style={{
        paddingTop: isBackHeader
          ? "var(--safe-top)"
          : compact
            ? "calc(var(--safe-top) + 8px)"
            : "calc(var(--safe-top) + 12px)",
      }}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-900 outline-none focus:outline-none"
          style={{ marginTop: "calc(var(--safe-top) / 2)" }}
        >
          <ChevronLeft size={20} />
        </button>
      ) : null}

      {title ? (
        <span
          className={`text-title-01 leading-tight font-bold text-gray-900 ${
            shouldBalanceTitle ? "mx-auto" : ""
          }`}
        >
          {title}
        </span>
      ) : null}

      {showActions ? (
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
            {profileInitial}
          </span>
        </div>
      ) : shouldBalanceTitle ? (
        <div className="w-8 shrink-0" />
      ) : null
      }
    </header>
  );
}

export default Header;
