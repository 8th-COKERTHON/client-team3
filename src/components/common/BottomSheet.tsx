import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  if (!open) return null;

  return (
    // 바텀시트 오버레이
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 배경 딤 처리 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 시트 패널 */}
      <div className="relative w-full max-w-md rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl">
        {/* 드래그 핸들 */}
        <div className="flex justify-center py-2.5">
          <span className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
