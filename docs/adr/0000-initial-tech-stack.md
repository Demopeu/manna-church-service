# ADR-0000: 초기 기술 스택 및 아키텍처 수립전략

## 📣 상태

채택됨 (Accepted)

- 1~5 : 2026-01-05

## 📋 상황

만나교회 통합 플랫폼 구축 프로젝트. 단순한 정보 전달용 홈페이지가 아니며, 다음의 제약 조건을 해결해야 하는 엔지니어링 과제다.

### 1. 하드웨어 및 사용자 제약

- **디바이스:** 주 사용자는 60대 이상 어르신으로, 보급형 구형 안드로이드 기기 사용. CPU 성능 낮고 메모리 부족.
- **네트워크:** 교회 내부 와이파이, 3G/LTE 등 불안정한 환경.
- **신체적 제약:**
  - **시력:** 노안으로 인해 작은 글씨 식별 불가.
  - **전정 기관:** 화려한 화면 전환이나 패럴랙스 스크롤 시 멀미 발생.

### 2. 운영 리소스 제약

- **운영자:** IT 비전문가. 이미지 리사이징이나 HTML 편집 불가.
- **지속 가능성:** 1인 개발자가 떠난 후에도 시스템이 자동으로 작동해야 함.
- **비용:** Vercel/Supabase Free Tier 한도 내에서 운영.

## 🔨 결정 (Decisions)

### 1. Rendering Optimization: React 19 & Zero-Animation

- **결정:** React 19 Stable 도입 및 JS 애니메이션 배제.
- **논리적 근거:**
  - **생산성 향상:**
    - **React 18의 문제:** 폼 하나에 API Route 생성 → fetch 작성 → loading/error 상태 관리 등 보일러플레이트 과다.
    - **React 19 해결책:** Server Actions로 백엔드 API 없이 함수 하나로 DB 통신 완료.
    - 1인 개발 환경에서 API 엔드포인트 관리 비용 제거로 개발 생산성 2배 향상. 절감 시간을 고령층 UX 개선에 집중.
  - **성능 최적화:**
    - **React 18의 문제:** useMemo, useCallback 수동 관리 필수. 실수 시 구형 폰에서 렌더링 버벅임.
    - **React 19 해결책:** React Compiler가 자동 메모이제이션 처리로 최적화 실수 원천 차단.
    - 구형 안드로이드 사용 어르신층에게 별도 튜닝 없이 안정적인 렌더링과 쾌적한 스크롤 경험 보장.
  - **유지보수성:**
    - **React 18의 리스크:** 1~2년 뒤 React 19 마이그레이션 시 코드 전면 수정 필요. 지연된 기술 부채 발생.
    - **React 19 전략:** 1인 개발자 이탈 후에도 장기 운영 필요. 곧 표준이 될 React 19 문법으로 향후 2~3년간 레거시 방지.
  - **애니메이션:** Framer Motion 등 무거운 라이브러리는 구형 폰 렉 유발 및 멀미 발생. CSS Native만 사용.

### 2. Core Framework: Next.js 16 (SSG/ISR Priority)

- **결정:** Next.js 16 Stable + App Router를 사용하되, SSG를 기본 전략으로 채택한다.
- **논리적 근거:**
  - **렌더링 전략:**
    - **CSR의 문제:** 클라이언트에서 JS 해석 후 렌더링. 구형 폰에서 초기 흰 화면 장시간 지속 및 버벅임.
    - **SSG 해결책:** 빌드 타임에 완성된 HTML 생성. 저성능 폰에서도 연산 없이 즉시 콘텐츠 표시.
  - **생태계 호환성:**
    - **React 19 활용:** Server Actions, React Compiler, Streaming은 프레임워크 네이티브 지원 없이 설정 복잡.
    - **Next.js 16 통합:** React 19 신규 훅과 스트리밍 기능을 네이티브 통합.
    - Server Actions 안정화와 React Compiler 최적화를 위한 선택. Hydration Error 등 호환성 이슈 사전 차단.
  - **보안 관리:**
    - **1인 개발 현실:** 보안 담당자 부재. NPM 패키지 취약점 빈번 발견. 구버전은 패치 지연 또는 지원 종료.
    - **최신 Stable 전략:** 최신 보안 패치 적용으로 취약점 공격 방어. 최신은 모험이 아닌 가장 안전한 선택.
  - **개발 생산성:**
    - React 19 개선된 폼 핸들링 + Next.js 16 간결한 라우팅으로 생산성 극대화.
    - 보일러플레이트 감소로 고령층 UI/UX 개선에 시간 집중.

### 3. Database & Styling: Supabase + Tailwind CSS + Shadcn UI

- **결정:** Supabase(PostgreSQL + Auth + Storage), Tailwind CSS v4, Shadcn UI를 채택한다.
- **논리적 근거:**
  - **백엔드 인프라:**
    - **생산성:** PostgreSQL + Auth + Storage + Real-time을 일괄 제공. 백엔드 인프라 별도 구축 불필요.
    - **타입 안정성:** Supabase CLI로 DB 스키마 기반 TypeScript 타입 자동 생성. 런타임 에러를 빌드 타임에 차단. 모노레포 환경 타입 일관성 보장.
    - **Zero-Ops:** Row Level Security로 DB 레벨 권한 제어. API 보안 로직 불필요.
    - **비용:** Free Tier로 초기 비용 0원. 사용량 기반 과금으로 예측 가능한 비용 관리.
  - **스타일링 시스템:**
    - **개발 속도:** 유틸리티 퍼스트 방식으로 HTML 내 즉시 스타일링. CSS 파일 이동 시간 제거.
    - **번들 최적화:** 미사용 CSS 자동 제거로 구형 폰 빠른 로딩.
    - **디자인 토큰:** theme 설정으로 색상, 간격, 글꼴 중앙 관리. 접근성 가이드를 코드 레벨 강제.
  - **컴포넌트 라이브러리:**
    - **접근성:** Radix UI 기반 WAI-ARIA 준수. 스크린 리더 및 키보드 내비게이션 지원.
    - **커스터마이징:** 컴포넌트 코드를 프로젝트에 복사하는 방식. 프로젝트 특화 요구사항 자유롭게 수정 가능.
    - **디자인 일관성:** packages/ui로 공통 컴포넌트 격리. Web과 Admin에서 재사용으로 브랜드 통일 및 개발 속도 향상.

### 4. Design Architecture: Feature Sliced Design (FSD)

- **결정:** Feature-Sliced Design(FSD) 아키텍처를 도입하여 `src/` 하위를 `entities`, `features`, `widgets`, `pages` 계층으로 구조화한다.
- **논리적 근거:**
  - **재사용성:**
    - Sermon Entity는 동일하나, 사용자는 영상 재생/목록 보기, 관리자는 등록/수정/삭제 기능 필요.
    - 일반 구조는 로직이 페이지에 분산. FSD로 entities/sermon에 데이터 모델 정의, features/watch-sermon과 features/manage-sermon으로 분리하여 Web/Admin 간 비즈니스 로직 명확히 구분하면서 데이터 구조 일관성 유지.
  - **유지보수성:**
    - 1인 개발 시 코드 스파게티화 위험. 시간에 쫓기면 components 폴더에 모든 것 집어넣는 유혹 발생.
    - FSD 단방향 의존성 규칙 강제로 6개월 후에도 코드 흐름 파악 가능하도록 설계.
  - **구조적 한계 극복:**
    - App Router는 파일 시스템 기반 라우팅. 폴더 깊이 증가 시 비즈니스 로직과 라우팅 파일 혼재.
    - app 폴더는 라우팅 전용, 비즈니스 로직과 UI는 src 하위 FSD 구조로 격리. URL 구조와 기능 구현 물리적 분리.

### 5. Architecture: Turborepo (Monorepo)

- **결정:** apps/web과 apps/admin을 물리적 분리하되, packages로 자원 공유하는 모노레포 구조.
- **논리적 근거:**
  - **타입 안정성:**
    - DB 스키마 정의를 packages/database에서 중앙 관리.
    - DB 구조 변경 시 웹/어드민 양쪽 빌드 에러 발생으로 유지보수 실수 원천 차단.
  - **디자인 시스템:**
    - 고령층을 위한 접근성 컴포넌트를 packages/ui로 분리.
    - 관리자 페이지에서 검증된 UI 재사용으로 개발 속도 향상 및 브랜드 통일.
  - **인프라 독립성:**
    - 사용자 페이지 트래픽 폭주 시에도 관리자 페이지는 별도 인프라로 운영.
    - 웹사이트 장애 시에도 운영자는 콘텐츠 관리 가능.

## 📊 영향 (Consequences)

### 📈 긍정적 영향

### 📉 부정적 영향 및 대응

## 📝 대안 (Alternatives)

### 1. Single Page Application (Create React App / Vite)

- **기각 사유:** Client-Side Rendering(CSR) 방식은 JS 번들을 다 다운받아야 화면이 뜨므로, 인터넷이 느리고 폰이 느린 성도들에게 **'흰 화면' 고문**을 줄 수 있음.

### 2. WordPress

- **기각 사유:** 초기 구축은 빠르나, '글자 크기 조절 영속성', '이미지 자동 클라이언트 압축' 등 디테일한 커스텀 기능을 구현하기 어렵고 매달 서버 비용이 발생함.
