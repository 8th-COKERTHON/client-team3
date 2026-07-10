import { useNavigate } from "react-router-dom";
import HouseIcon from "../assets/house.svg";
import CTAButton from "../components/CTAButton";

function StartPage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex h-dvh w-full flex-col items-start justify-center gap-9 bg-[#F5F5FA] pb-[172px]">
      <section className="flex flex-col gap-6">
        <img src={HouseIcon} alt="집 일러스트" className="h-auto w-[238px]" />
        <div className="flex flex-col gap-4 px-9">
          <h1 className="text-headline font-bold leading-[1.5] text-black">
            집:적
          </h1>
          <p className="text-subtitle font-medium leading-[1.5] text-gray-09 text-start">
            친구와 함께 집안일을 쉽고
            <br />
            재미있게 관리해요!
          </p>
        </div>
      </section>

      <section className="absolute right-0 bottom-8 left-0 flex w-full flex-col items-center gap-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <CTAButton
          onClick={() => navigate("/login")}
          className="bg-gray-01 text-brand border border-brand shadow-none"
          textClassName="text-brand"
        >
          로그인
        </CTAButton>
        <CTAButton onClick={() => navigate("/signup")}>
          회원가입
        </CTAButton>
      </section>
    </main>
  );
}

export default StartPage;
