import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getChoreRequestNotifications } from "../api/notification";
import type { ChoreRequestNotification } from "../types/notification";
import { formatRelativeTime } from "../utils/formatRelativeTime";

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<
    ChoreRequestNotification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotifications() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getChoreRequestNotifications();
        if (!cancelled) {
          setNotifications(response.data);
        }
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "알림을 불러오지 못했어요.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full max-w-md mx-auto bg-white">
      {/* 상단 헤더 */}
      <header
        className="flex w-full items-center justify-between px-5 pb-3"
        style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5FA]"
          >
            <ChevronLeft size={16} strokeWidth={2} className="text-gray-900" />
          </button>
          <h1 className="text-title-01 leading-tight font-bold text-gray-900">
            알림
          </h1>
        </div>
      </header>

      {/* 알림 목록 */}
      {isLoading ? (
        <p className="px-5 py-8 text-center text-body-02 leading-none font-medium text-gray-04">
          불러오는 중...
        </p>
      ) : errorMessage ? (
        <p className="px-5 py-8 text-center text-body-02 leading-none font-medium text-brand">
          {errorMessage}
        </p>
      ) : notifications.length === 0 ? (
        <p className="px-5 py-8 text-center text-body-02 leading-none font-medium text-gray-04">
          받은 알림이 없어요.
        </p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.requestId}
              className={`flex items-center gap-3 px-5 py-4 ${
                notification.status === "PENDING" ? "bg-brand/7" : "bg-white"
              }`}
            >
              {/* 발신자 아바타 */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-body-01 leading-none font-bold text-white">
                {notification.senderName.slice(0, 1)}
              </span>

              {/* 메시지 */}
              <p className="min-w-0 flex-1 text-body-02 leading-snug font-medium text-gray-900">
                {notification.senderName}님이 {notification.message}
              </p>

              {/* 상대 시간 */}
              <span className="shrink-0 text-caption leading-none font-medium text-gray-08">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default NotificationsPage;
