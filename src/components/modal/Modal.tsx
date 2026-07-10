interface ModalProps {
  isOpen: boolean;
  title?: string;
  content?: string;
  rejectText?: string;
  acceptText?: string;
  onReject: () => void;
  onAccept: () => void;
}

const Modal = ({
  isOpen,
  title = "타이틀",
  content = "내용을 입력해주세요",
  rejectText = "거절하기",
  acceptText = "수락하기",
  onReject,
  onAccept,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    // 배경 블러 및 어두운 오버레이
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      {/* 모달 컨테이너: 팀의 큰 요소 라운드 토큰(rounded-lg) 반영 */}
      <div className="w-[350px] overflow-hidden rounded-lg bg-white shadow-xl flex flex-col">
        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center justify-center p-5 text-center min-h-[140px]">
          {/* 타이틀: 정의된 text-title-01 및 font-bold 반영 */}
          <h2 className="text-title-01 font-bold text-gray-900 tracking-tight pb-2">
            {title}
          </h2>
          {/* 본문: 정의된 text-body-01 및 font-medium 반영 */}
          <p className="text-body-01 font-medium text-gray-500 whitespace-pre-wrap leading-normal">
            {content}
          </p>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex border-t border-gray-200 h-14">
          {/* 거절하기 버튼: text-subtitle 및 font-semibold 반영 */}
          <button
            type="button"
            onClick={onReject}
            className="flex-1 text-subtitle font-semibold text-gray-950 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-200"
          >
            {rejectText}
          </button>

          {/* 수락하기 버튼: text-subtitle 및 font-semibold 반영 */}
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 text-subtitle font-semibold text-red-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
