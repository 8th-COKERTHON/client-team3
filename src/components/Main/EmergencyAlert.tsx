import { AlertTriangle } from "lucide-react";

interface EmergencyAlertProps {
  choreName: string;
  memberName: string;
}

// 단어 마지막 글자의 받침 유무로 목적격 조사(을/를)를 판별
function getObjectParticle(word: string): "을" | "를" {
  const lastCharCode = word.charCodeAt(word.length - 1);
  const hasBatchim = (lastCharCode - 0xac00) % 28 !== 0;
  return hasBatchim ? "을" : "를";
}

function EmergencyAlert({ choreName, memberName }: EmergencyAlertProps) {
  return (
    // 긴급 출동 경고 섹션
    <section className="w-full">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10">
          <AlertTriangle className="text-brand" size={16} strokeWidth={2} />
        </span>

        <p className="text-body-01 leading-relaxed font-bold text-gray-900">
          <span className="text-brand">{choreName}</span>
          {getObjectParticle(choreName)} 빨리 해결해주세요!
          <br />
          {memberName} 사원의 긴급 출동을 요청합니다 🚨
        </p>
      </div>
    </section>
  );
}

export default EmergencyAlert;
