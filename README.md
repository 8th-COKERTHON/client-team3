# 집:적

집안일을 기록하고, 구성원별 기여도를 시각화해 더 공정한 분담을 돕는 가사 성과 기록 서비스입니다.  
보이지 않던 가사노동을 `성과`로 남기고, 다음 집안일 배분까지 자연스럽게 연결하는 경험을 목표로 합니다.

## Overview

집안일은 하지 않으면 바로 티가 나지만, 누가 했는지는 쉽게 잊히기 쉽습니다.  
`집:적`은 이런 공동 생활의 불균형을 기록과 시각화로 풀어내는 서비스입니다.

- 누가 어떤 집안일을 했는지 기록
- 구성원별 기여도 확인
- 리포트와 랭킹으로 성과 요약
- 룰렛 기반 집안일 분배로 공정성 강화
- 요청 알림으로 부담스러운 말을 앱이 대신 전달

## Features

- 회원가입 및 로그인
- 방 생성 및 초대코드 참여
- 오늘의 집안일 조회
- 날짜별 집안일 확인
- 집안일 추가 및 반복 설정
- 담당자 직접 지정 또는 룰렛 배정
- 주간 리포트 및 랭킹 확인
- 집안일 요청 알림 확인

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Lucide React
- Tabler Icons

## Project Structure

```text
src/
  api/           API 요청 및 클라이언트 유틸
  assets/        이미지 및 아이콘 에셋
  components/    공통 UI 및 기능별 컴포넌트
  pages/         라우트 단위 페이지
  types/         API/도메인 타입 정의
  utils/         포맷팅 및 데이터 가공 유틸
```

## Pages

- `/`: 서비스 소개 및 인증 진입
- `/room-entry`: 방 생성/참여 선택
- `/room/create`: 방 생성 및 초대코드 확인
- `/room/join`: 초대코드 입력 후 참여
- `/main`: 메인 대시보드
- `/add-chore`: 집안일 추가
- `/report`: 주간 리포트 및 랭킹
- `/notifications`: 요청 알림 목록

## API Notes

- 모든 요청은 `credentials: include`로 전송됩니다.
- 그룹 ID는 브라우저 `localStorage`에 저장됩니다.
- 주요 API는 `/api/groups`, `/api/chore`, `/api/notifications` 경로를 사용합니다.

## Service Link

[Vercel 링크 ](https://cokerthon-team3.vercel.app)
