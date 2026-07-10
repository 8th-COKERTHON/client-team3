import BottomSheet from "../common/BottomSheet";

interface InviteCodeBottomSheetProps {
  open: boolean;
  inviteCode: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
}

function InviteCodeBottomSheet({
  open,
  inviteCode,
  isLoading = false,
  errorMessage = null,
  onClose,
}: InviteCodeBottomSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-8">
        <div className="mb-8">
          <h2 className="text-title-01 font-extrabold leading-tight text-gray-900">친구 초대</h2>
          <p className="mt-2 text-body-01 font-medium leading-[1.5] text-gray-400">
            코드를 공유해서 우리 집에 초대하세요
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-white px-5 py-8">
          <div className="absolute -left-4 bottom-2 h-[58px] w-[58px] rounded-full bg-[#E7FBFB]" />
          <div className="absolute -right-3 top-1 h-[80px] w-[80px] rounded-full bg-[#FFE8E5]" />

          <p className="relative text-center text-body-02 font-bold leading-none text-[#A8A4C2]">
            초대 코드
          </p>
          <div className="relative mt-6 text-center">
            {isLoading ? (
              <p className="text-title-01 font-bold text-gray-400">불러오는 중...</p>
            ) : errorMessage ? (
              <p className="text-body-01 font-medium leading-[1.5] text-brand">{errorMessage}</p>
            ) : (
              <p className="text-[48px] font-extrabold leading-none tracking-[-0.03em] text-brand">
                {inviteCode || "-----"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-brand/20 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(253,95,84,0.08)]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-body-01 font-extrabold text-white">
            !
          </span>
          <p className="text-body-01 font-bold leading-[1.6] text-gray-900">
            상대방이 초대 코드 입력에서
            <br />
            이 코드를 입력하면 방에 합류할 수 있어요.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

export default InviteCodeBottomSheet;
