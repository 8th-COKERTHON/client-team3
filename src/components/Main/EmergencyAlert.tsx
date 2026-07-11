import { AlertTriangle } from "lucide-react";

interface EmergencyAlertProps {
  choreName: string;
  memberName: string;
}

function EmergencyAlert({ choreName, memberName }: EmergencyAlertProps) {
  return (
    <section className="w-full">
      <div className="flex items-center gap-3 rounded-[28px] border border-brand/15 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(253,95,84,0.08)]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand">
          <AlertTriangle className="text-white" size={18} strokeWidth={2.25} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-body-01 leading-[1.5] font-extrabold text-gray-900">
            {choreName}을 빨리 해결해주세요!
          </p>
          <p className="mt-1 text-body-02 leading-[1.5] font-medium text-brand">
            {memberName} 사원의 긴급 출동을 요청합니다 🚨
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmergencyAlert;
