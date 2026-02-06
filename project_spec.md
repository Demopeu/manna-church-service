# Project Specification: Manna Church Service Platform

## 1. 프로젝트 개요 (Project Overview)

- **Project Name:** `manna-church-service`
- **Client:** 만나교회 (Manna Church)
- **Architecture:** Turborepo Monorepo (User Web + Admin CMS)
- **Mission:**
  > "디지털 소외 계층인 고령의 성도들이 **가장 쉽고 빠르게** 교회 소식에 접근할 수 있게 하고, 기술을 모르는 목사님이 **스트레스 없이** 운영할 수 있는 시스템을 구축한다."

### 🔑 핵심 가치 (Core Values)

1.  **Extreme Accessibility (초-접근성):**
    - 예쁘기만 한 디자인보다 **"보이는"** 디자인이 우선이다. (고대비, 큰 글씨)
    - 화려한 인터랙션보다 **"직관적인"** UX가 우선이다. (멀미 방지, 명확한 버튼)
2.  **Performance on Low-End (저사양 최적화):**
    - 최신 아이폰이 아닌, **보급형 갤럭시 A 시리즈**에서 60fps가 나와야 한다.
    - 초기 로딩(FCP)을 늦추는 무거운 라이브러리는 가차 없이 제거한다.
3.  **Zero-Ops Automation (운영 자동화):**
    - "개발자한테 전화해야 해결되는 일"을 만들지 않는다.
    - 목사님이 실수를 해도 시스템이 알아서 방어하고 보정한다. (이미지 자동 압축 등)

---

## 2. 사용자 페르소나 및 제약 사항 (Target Audience & Constraints)

> 🤖 **AI Instruction:** 코드를 작성할 때 항상 아래 두 페르소나(김권사님, 이목사님)가 사용한다고 상상하고 구현하라.

### A. 성도: "70대 김권사님" (End User)

- **Environment (환경):**
  - **Device:** 3년 지난 갤럭시 A32, 폰트 크기 '크게' 설정 사용 중.
  - **Network:** 교회 지하 식당의 느리고 끊기는 Wi-Fi.
- **Pain Points (불편함):**
  - "글씨가 깨알 같아서 안 보여. 돋보기 어디 갔지?"
  - "화면이 휙휙 넘어가니까 어지러워. (전정 기관 예민/멀미)"
  - "메뉴가 영어로 되어 있어서 뭔지 모르겠어."
- **Requirements (요구사항):**
  - **Zero-Lag:** 터치했을 때 즉각 반응해야 한다 (SSR/SSG 필수).
  - **Readability:** 기본 폰트는 커야 하며, 더 크게 조절할 수 있어야 한다.
  - **Simplicity:** 메인 화면에서 '설교'와 '주보'를 한 번에 찾을 수 있어야 한다.

### B. 관리자: "60대 김목사님" (Admin)

- **Tech Level (기술 수준):**
  - 한글/워드 작업은 가능하지만, '이미지 리사이징', 'HTML', 'URL 복사' 개념이 낯설음.
  - 복잡한 대시보드 화면을 보면 겁을 먹음.
- **Behavior (행동 패턴):**
  - DSLR로 찍은 15MB짜리 원본 사진을 그대로 업로드함.
  - 주보를 이미지로 변환할 줄 몰라 PDF 파일을 그대로 올림.
- **Requirements (요구사항):**
  - **Blog-like UX:** 네이버 블로그 글쓰기처럼 단순하고 직관적인 에디터.
  - **Auto-Processing:** 원본을 올려도 알아서 웹용으로 변환되어야 함.
  - **Fail-Safe:** 잘못된 파일을 올려도 서버가 죽지 않고 친절하게 안내해야 함.

---

## 3. 기술 스택 및 버전 전략 (Tech Stack Strategy)

### Core Framework

- **Runtime:** Node.js >= 25.0.0
- **Package Manager:** pnpm 10.25.0
- **Monorepo:** Turborepo 2.7.2 (`pnpm` workspace)
- **Framework:** **Next.js 16.1.1 (Stable)**
  - _Strategy:_ Admin은 `force-dynamic` + Server Actions 위주, Web은 SSG/ISR 위주.
- **Library:** **React 19.2.3 (Stable)**
  - _Strategy:_ React Compiler(`babel-plugin-react-compiler`)를 통한 자동 렌더링 최적화, `useActionState` + `useEffectEvent` 등 React 19 훅 활용, Server Actions를 통한 API 개발 생산성 증대.
- **TypeScript:** 5.9.3 (Strict Mode)

### Infrastructure & Database

- **BaaS:** Supabase (PostgreSQL, Auth, Storage)
- **Monitoring:** Sentry (`@sentry/nextjs` 10.36.0)
- **Deployment:** Vercel (Production)

### State Management & Data Fetching

- **Client State:** 전역 상태 관리 라이브러리 미사용. 컴포넌트 로컬 `useState` + `useActionState`로 충분.
  - _(참고: 초기 계획의 Zustand는 `apps/web`에서만 사용 예정 — Work in Progress)_
- **Data Fetching Strategy (Admin):** **Supabase Client (`@repo/database/client`) + `React.cache()`**
  - **Read Strategy:**
    - Server Component에서 `createClient()`로 Supabase 클라이언트 생성, `React.cache()`로 요청 단위 메모이제이션.
    - Admin은 `export const dynamic = 'force-dynamic'`으로 항상 최신 데이터를 보장한다.
  - **Write Strategy (On-Demand Revalidation):**
    - Server Actions 성공 시, `revalidatePath()`를 호출하여 즉시 캐시를 무효화하고 최신 데이터를 반영한다.
    - _Goal:_ "목사님이 올리면 바로 뜬다"는 UX 보장.

### Styling

- **CSS:** Tailwind CSS v4 (Mobile First)
  - _Config:_ `packages/tailwind-config`를 통해 웹과 어드민이 동일한 디자인 토큰(Color, Font) 공유.
- **Components:** Shadcn/UI (Radix UI 기반 Headless)
  - _Location:_ **`packages/ui`**에 설치하여 모든 앱에서 import하여 사용 (`@repo/ui`).
- **Icons:** Lucide React

---

## 4. 아키텍처 및 폴더 구조 (Architecture Rules)

### Monorepo Structure

- `apps/web`: 사용자용 서비스 (Next.js App Router, SSG/ISR 위주, 고령층 최적화). _(Work in Progress)_
- `apps/admin`: 관리자용 CMS (Next.js 16.1.1 App Router, `force-dynamic` + Server Actions, 비전문가 친화 UI). ✅ **구현 완료**
- `packages/ui` (`@repo/ui`): 공통 디자인 시스템 (Shadcn/UI + Radix UI 기반).
  - Exports: `./shadcn`, `./lib`, `./components`, `./hooks`, `./styles.css`
  - Shadcn 컴포넌트: Accordion, AlertDialog, Avatar, Badge, Button, Card, Carousel, Dialog, DropdownMenu, Form, Input, Label, NavigationMenu, Progress, Select, Sheet, Skeleton, Switch, Table, Textarea
  - 공유 컴포넌트: `AspectRatio`
  - 유틸리티: `cn()` (clsx + tailwind-merge)
- `packages/tailwind-config` (`@repo/tailwind-config`): Tailwind CSS v4 공통 스타일 + PostCSS 설정.
- `packages/typescript-config` (`@repo/typescript-config`): TypeScript 공통 설정 (`base.json`, `nextjs.json`, `react-library.json`).
- `packages/eslint-config` (`@repo/eslint-config`): ESLint Flat Config (`base`, `next-js`, `react-internal`).
- `packages/database` (`@repo/database`): Supabase Generated Types + Client Factory.
  - Exports: `./client` (Server Component용), `./auth` (Auth 헬퍼), `./middleware` (미들웨어용), `./types`
  - _Why:_ `any` 타입 사용 방지, 앱 간 DB 스키마 동기화 보장.
- ~~`packages/utils`~~: **미구현.** 유틸리티 함수는 각 앱의 `src/shared/lib/`에 위치.

## 5. 아키텍처 및 폴더 구조 (Clean FSD + CQRS Pattern)

Next.js App Router의 특성과 CQRS(명령과 조회의 분리) 패턴을 적용하여, **읽기(Read)**와 **쓰기(Write)**의 관심사를 명확히 분리한 Clean FSD 구조를 따른다.

### Layer Rules (엄격 준수)

#### 1. App Layer (`apps/*/app/`) - "Routing & Page Composition"

- **역할:** 기존 FSD의 `pages` 레이어를 흡수.
- **규칙:**
  - 비즈니스 로직 작성 금지.
  - `Widgets` 레이어의 컴포넌트를 import하여 배치(Layout)하는 역할만 수행.
  - Next.js의 `page.tsx`, `layout.tsx`, `loading.tsx`등 16버전 기준 사용할 수 있는 것만 존재.

#### 2. Widgets Layer (`src/widgets/`) - "Composition"

- **역할:** `Entities`와 `Features`를 조합하여 하나의 완성된 섹션을 만듦.
- **예시:** `SermonListSection` (설교 리스트(Entity) + 페이지네이션(Feature) + 더보기 버튼(Feature)).
- **규칙:** 재사용성이 없어도 되며, 페이지의 특정 구획을 담당.

#### 3. Features Layer (`src/features/`) - "Write (CUD) & Interaction"

- **역할:** 데이터를 변경(Create, Update, Delete)하거나 사용자와 상호작용하는 기능.
- **기술:** 주로 **Client Component**로 구성되며, **Server Actions**를 호출함.
- **예시:**
  - `SermonUploadForm` (설교 등록 폼)
  - `DeleteSermonButton` (삭제 버튼)
  - `FontScaleToggle` (폰트 조절 - 로컬 스토리지 Write)

#### 4. Entities Layer (`src/entities/`) - "Read (R) & Domain Model"

- **역할:** 도메인 데이터를 정의하고, 데이터를 **보여주는(Read)** 역할.
- **기술:** 주로 **Server Component**에서 사용하기 좋은 "표시 전용" 컴포넌트.
- **예시:**
  - `SermonCard` (설교 정보 표시)
  - `BulletinImage` (주보 이미지 표시)
  - `model/types.ts` (Supabase 데이터 타입 가공)

#### 5. Shared Layer (`packages/` or `src/shared/`) - "Pure"

- **역할:** 비즈니스 로직을 전혀 모르는 순수 유틸리티 및 UI.
- **UI Wrapper Rule (중요):**
  - `apps` 내부에서는 `packages/ui`(`@repo/ui`)를 **직접 import 하지 않는다.**
  - 반드시 `src/shared/ui` 폴더에 래핑(Re-export)된 컴포넌트를 사용해야 한다.
  - _예시:_ `import { Button } from "@/shared/ui/button"` (O) / `from "@repo/ui/button"` (X)
- **Reference Check:**
  - **기존 파일 우선:** 이미 `src/shared/ui`에 래핑된 컴포넌트가 많이 존재한다. AI는 코드를 작성하기 전에 **반드시 파일 트리를 스캔하여 이미 만들어진 Wrapper가 있는지 확인**해야 한다.

---

### Dependency Rule (의존성 규칙)

`App` -> `Widgets` -> `Features` -> `Entities` -> `Shared` (Wrapper) -> `@repo/ui`
(상위 레이어는 하위 레이어를 import 할 수 있지만, 역은 성립하지 않는다.)

---

## 6. 주요 기능 명세 (Feature Specifications)

### A. 공통 / UX (Common UX & Error Handling)

- **Motion Reduction (Vestibular Disorder):**
  - **No GIF/Animation:** 어지러움 방지를 위해 UI 애니메이션은 CSS `transition`만 허용하며, 콘텐츠의 GIF도 정지 이미지로 변환하여 보여준다.
  - **No Modals:** 갑자기 튀어나오는 팝업(Modal)은 고령층에게 혼란을 주므로, 페이지 내 삽입(Inline) 방식이나 바텀 시트(Bottom Sheet)를 우선한다.
- **Loading & Error Strategy:**
  - **Loading UI:** `Spinner` 대신 **`Skeleton UI`**를 사용하여 화면 덜컹거림(CLS)을 방지하고 로딩 체감 속도를 줄인다.
  - **Image Fallback:** 이미지 로딩 실패 시 '엑박' 대신 미리 준비된 `fallback_logo.png`를 보여준다.
  - **Toast Notification:**
    - 에러 및 성공 메시지는 디자인 일관성을 위해 **Toast UI**를 사용한다.
    - **Accessibility Rule:** 노인분들이 읽을 시간을 확보하기 위해 Toast 지속 시간(`duration`)을 **최소 4초(4000ms) 이상**으로 설정한다.

### B. 사용자 웹 (`apps/web`)

- **Dynamic Font Scale (Web Only):**
  - **Feature:** `Zustand`로 폰트 크기 상태 관리 (Default/Large/X-Large).
  - **Implementation:** Tailwind `rem` 단위를 기반으로 `root` 폰트 사이즈를 조절하여 전체 UI 스케일링.
- **Main Page & Navigation:**
  - **Urgent Notice (긴급 공지 Logic):**
    - `is_urgent: true`인 공지사항은 일반 공지보다 **우선순위(Priority)**를 높여 노출한다.
    - **Visual:** 구체적인 디자인(배너, 색상 등)은 자유롭게 구현하되, 일반 게시글과 시각적으로 구분되어야 한다.
  - 가장 중요한 '예배 시간', '오시는 길', '최신 설교'를 최상단 배치.
- **Sermon Player:** `@next/third-parties`의 `<YouTubeEmbed>` 사용.
- **Gallery Viewer:** `virtua` (가상 스크롤) + `yet-another-react-lightbox` (핀치 줌).
- **SEO & Open Graph:**
  - **Dynamic Metadata:** 설교/공지 상세 페이지 접근 시 `generateMetadata`를 통해 `og:title`, `og:image` 동적 생성.
  - **Kakao Preview:** 카카오톡 공유 시 썸네일이 정상적으로 뜨도록 메타태그 최적화.
  - **Sitemap/Robots:** `next-sitemap`을 사용하여 빌드 시 자동 생성.
- **No Search Feature:**
  - 본 프로젝트는 복잡도를 낮추기 위해 **검색 기능을 구현하지 않는다.**
  - 모든 리스트는 최신순 정렬 및 **페이지네이션(Pagination)만** 제공한다.
- **Pagination Strategy (Standard):**
  - **Per Page:** 기본 페이지당 항목 수는 **12개**로 설정한다.
    - _Reason:_ `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` 레이아웃에서 모든 화면 크기에 깔끔하게 나누어떨어짐.
  - **Implementation:**
    - URL 쿼리 파라미터 방식: `/sermons?page=2`
    - Server Component에서 `searchParams`를 통해 현재 페이지 번호를 받아 데이터 fetch.
  - **UI Components:**
    - Shadcn의 `Pagination` 컴포넌트를 `src/shared/ui`에 래핑하여 사용.
    - **Mobile-Friendly:** 모바일에서는 `[이전] [1] ... [5] [다음]` 형태로 단순화.
  - **Database Query:**
    - PostgreSQL `LIMIT` & `OFFSET` 사용.
    - 총 페이지 수 계산을 위해 `COUNT(*)` 쿼리 별도 실행.

### C. 관리자 CMS (`apps/admin`) ✅ 구현 완료

#### Tech Stack

- **Port:** 3001 (dev & start)
- **Dependencies:**
  - React Hook Form 7.70.0, Zod 4.3.5, @hookform/resolvers 5.2.2
  - use-debounce 10.1.0, date-fns 4.1.0, sonner 2.0.7
  - browser-image-compression 2.0.2, pdfjs-dist 5.4.530
  - @sentry/nextjs 10.36.0, lucide-react 0.546.0
- **Config:** React Compiler enabled (`reactCompiler: true`), Sentry 통합 (`withSentryConfig`)

#### Implemented Routes (All Complete)

- `/login` — 로그인 페이지 (LoginCard widget)
- `/(admin)/(main)/` — 대시보드 (Date, RecentBulletinCard, RecentAnnouncementCard, RecentEventCard, RecentSermonCard, RecentGalleryCard)
- `/(admin)/announcements` — 공지사항 CRUD (search + pagination)
- `/(admin)/bulletins` — 주보 CRUD (year/month 필터 + pagination + PDF→WebP 자동 변환)
- `/(admin)/events` — 이벤트 CRUD (search + pagination + 이미지 자동 압축)
- `/(admin)/gallery` — 갤러리/앨범 CRUD (search + pagination + 다중 이미지 업로드/압축)
- `/(admin)/sermons` — 설교 CRUD (search + pagination + YouTube URL 검증)
- `/(admin)/servants` — 섬기는 사람들 CRUD (포지션 필터 + 정렬)

#### FSD Layer Implementation

**Entities Layer (`src/entities/`):**

- `announcement/`, `bulletin/`, `event/`, `gallery/`, `sermon/`, `servant/`, `user/`
- Structure: `model/` (타입 정의), `api/queries.ts` (Supabase 데이터 페칭), `api/dto.ts` (DTO 타입), `api/mapper.ts` (Row→Domain 매핑), `index.ts` (named export)
- `servant/`에 추가로 `config/positions.ts` (POSITION_OPTIONS 상수)
- `user/`에 `ui/UserProfile.tsx` + `ProfileSkeleton` (프로필 표시 컴포넌트)
- **Status:** Supabase 연동 완료 (Mock 데이터 아님)

**Features Layer (`src/features/`):**

- `announcement/`, `auth/`, `bulletin/`, `event/`, `gallery/`, `sermon/`, `servant/`
- Structure:
  - `ui/`: CreateButton, EditButton, DeleteButton, Form 컴포넌트
  - `api/actions.ts`: Server Actions (requireAuth + Zod 검증 + tryCatchAction + revalidatePath)
  - `api/create.ts`, `api/update.ts`, `api/delete.ts`: Supabase Storage 연동 CRUD 로직
  - `model/schema.ts`: Zod 스키마 (z.instanceof(File) 사용, z.any() 금지)
  - `model/use-form.ts`: React Hook Form + useActionState 커스텀 훅
  - `model/use-delete.ts`: 삭제 확인 다이얼로그 + 삭제 액션 훅
  - `lib/`: 유틸리티 (extractVideoId, parseStorageUrl, validatePdf, mapper 등)
  - `ui/form-data.ts`: FormData 매핑 유틸리티
- **bulletin** 추가: `ui/YearMonthSelect.tsx`, `ui/YearMonthSelectSkeleton.tsx` (연/월 필터)
- **gallery** 추가: `lib/use-gallery-images.ts` (다중 이미지 관리 훅, 썸네일 지정 포함)
- **Pattern:** Server Actions + `useActionState` + React Hook Form + `@hookform/resolvers/zod`

**Widgets Layer (`src/widgets/`):**

- `*-list/`: AnnouncementsList, BulletinsList, EventsList, GalleriesList, SermonsList, ServantsList
  - 각 위젯에 `ui/labels.ts` (UI 라벨 상수), `ui/columns.ts` (테이블 컬럼 정의), `*Item.tsx` (리스트 아이템)
  - `gallery-list/`에 추가로 `GalleriesImage.tsx` (이미지 썸네일 표시)
  - `servant-list/`에 추가로 `ServantsFilters.tsx` (포지션 필터)
- `dashboard/`: Date, RecentBulletinCard, RecentAnnouncementCard, RecentEventCard, RecentSermonCard, RecentGalleryCard, CardSkeleton, CardError, DashboardCardWrapper
- `login-card/`: LoginCard
- `main-layout/`: Sidebar, **MainHeader (Server Component)**, HeaderClient (Client Component), SidebarNav, SidebarHeader, SidebarFooter, SidebarProvider (context)

**Shared Layer (`src/shared/`):**

- `config/route.ts` — ADMIN_ROUTES 정의 (href, label, Lucide icon)
- `ui/base/` — @repo/ui 래핑 컴포넌트 (Avatar, AlertDialog, Badge, Button, Card, Dialog, DropdownMenu, Form, Input, Label, Progress, Select, Skeleton, Switch, Table, Textarea)
- `ui/components/` — EmptyState, ListSkeleton, LoadingProgress, Pagination, SearchInput(+Skeleton)
- `ui/utils/` — withAsyncBoundary (Suspense + ErrorBoundary 합성)
- `ui/` (root) — DataTable, DeleteDialog, FormTriggerButton, ImageDialog, MultiImageDialog, SectionCard, Toaster
- `ui/index.ts` — 모든 UI 컴포넌트의 named export 배럴 파일
- `api/try-catch-wrapper.ts` — tryCatchAction, tryCatchVoid (Server Action 에러 핸들링)
- `lib/` — date (formatKoreanDate, formatRelativeDate, getCurrentYearMonth), guard (requireAuth), image (imageConverter: browser-image-compression), pdf (pdfToWebpConverter: pdfjs-dist), use-dialog, use-input (useImageInput, usePdfInput), use-toast-and-refresh
- `model/action.ts` — ActionState 타입 (ErrorState | SuccessState)

#### Page Pattern (All CRUD Pages)

```tsx
// searchParams: { q?: string; page?: string }
// Suspense + ListSkeleton fallback (labels.ts에서 title/description 참조)
// CreateButton + List widget
```

#### Form Pattern

- **Schema:** Zod validation — `z.instanceof(File)` 사용 (z.any() 금지)
- **Actions:** Server Actions — `requireAuth()` → Zod 파싱 → 비즈니스 로직 → `revalidatePath()`
- **Hook:** `useActionState` + custom `use-form.ts` 훅 (React Hook Form 연동)
- **UI:** React Hook Form, field-level 에러, `isPending` → `LoadingProgress` 오버레이
- **Success:** `revalidatePath()` + `toast.success()` + `router.refresh()`

#### Validation Schemas (Actual)

- **Announcement:** title (required), content (required), isUrgent (boolean)
- **Bulletin:** publishedAt (date), pdfFile (File, PDF only, max 10MB), coverImageFile (optional image), imageFiles (File[])
- **Event:** title, description (optional), startDate, photoFile (Image: jpg/png/webp, max 10MB)
- **Sermon:** title, preacher, date, videoUrl (YouTube URL, extractVideoId로 검증)
- **Gallery:** title, eventDate, images[] ({file, isThumbnail, id}, max 10장, 10MB each)
- **Servant:** (별도 Server Action에서 FormData 직접 파싱)
- **Auth:** email (이메일 형식 검증), password (영문+숫자 필수)

#### Layout Structure

- `layout.tsx` (root) — Noto Sans KR font, metadata, Sentry 통합
- `(admin)/layout.tsx` — SidebarProvider + Sidebar + **MainHeader (Server Component)** + content area
  - `MainHeader`는 Server Component로 `getMyProfile()`을 직접 호출하고 `Suspense` + `ProfileSkeleton`으로 감싸 스트리밍.
  - `HeaderClient`가 클라이언트 인터랙션 (sidebar toggle, logout dropdown) 담당.
- Sidebar: ADMIN_ROUTES 네비게이션 (Lucide icons), 반응형 (모바일 hamburger + overlay)

#### Auth & Middleware

- `src/proxy.ts` — Supabase 미들웨어 클라이언트로 인증 체크:
  - 비로그인 상태 + `/login` 외 경로 → `/login`으로 리다이렉트
  - 로그인 상태 + `/login` 경로 → `/`로 리다이렉트
- `src/shared/lib/guard.ts` — `requireAuth()`: Server Action 내부에서 인증 상태 확인
- `src/instrumentation.ts`, `src/instrumentation-client.ts` — Sentry 계측

#### Image & PDF Processing (구현 완료)

- **Image Compression:** `browser-image-compression` 라이브러리로 클라이언트 사이드 이미지 압축 (`src/shared/lib/image.ts`)
- **PDF → WebP:** `pdfjs-dist`로 PDF 페이지를 Canvas에 렌더링 후 WebP Blob 변환 (`src/shared/lib/pdf.ts`)

## 7. 데이터베이스 스키마 상세 명세 (Database Schema & Policies)

> AI는 아래 명세를 바탕으로 Supabase `init_schema.sql`을 작성해야 한다.

### A. 공통 설계 원칙 (General Rules)

- **Primary Key:** 모든 테이블의 ID는 `UUID`이며 `gen_random_uuid()`를 사용.
- **Hard Delete Policy:**
  - Supabase Free Tier 용량 확보를 위해 **Soft Delete(`deleted_at`)를 사용하지 않는다.**
  - 데이터 삭제 시 즉시 DB에서 제거(`DELETE`)되며, 연결된 Storage 파일도 삭제 로직을 수행해야 한다.
  - 참조 관계(Foreign Key)가 있는 경우 `ON DELETE CASCADE`를 적용하여 고아 데이터를 남기지 않는다.
- **Security (RLS):**
  - **Read:** `public` (누구나 조회 가능, 단 `members` 테이블은 `is_public` 필터링 필수).
  - **Write/Delete:** `authenticated` (로그인한 관리자만 가능). _별도 `profiles` 테이블 없이 특정 이메일/UID 하드코딩으로 관리._

---

### B. 테이블 명세 (Table Definitions) — Supabase Generated Types 기준

#### 1. `sermons` (설교 영상)

- **Columns:**
  - `id`: UUID (PK)
  - `title`: TEXT (NOT NULL)
  - `preacher`: TEXT (NOT NULL, 예: "김목사")
  - `preached_at`: DATE (NOT NULL, 설교 날짜)
  - `video_url`: TEXT (NOT NULL, YouTube Link)
  - `created_at`: TIMESTAMPTZ (Default: NOW())

#### 2. `galleries` (교회 앨범)

- **Columns:**
  - `id`: UUID (PK)
  - `title`: TEXT (NOT NULL)
  - `event_date`: DATE (NOT NULL)
  - `thumbnail_url`: TEXT (Nullable)
  - `created_at`: TIMESTAMPTZ

#### 3. `gallery_images` (앨범 상세 이미지)

> `galleries` 삭제 시 자동 삭제됨 (Cascade).

- **Columns:**
  - `id`: UUID (PK)
  - `gallery_id`: UUID (FK -> galleries.id, ON DELETE CASCADE)
  - `storage_path`: TEXT (NOT NULL)
  - `width`: INTEGER (NOT NULL)
  - `height`: INTEGER (NOT NULL)
  - `created_at`: TIMESTAMPTZ

#### 4. `bulletins` (주보)

> 관리자는 PDF를 업로드하면, 클라이언트에서 `pdfjs-dist`로 각 페이지를 WebP 이미지로 변환 후 Supabase Storage에 업로드한다.

- **Columns:**
  - `id`: UUID (PK)
  - `published_at`: DATE (NOT NULL)
  - `cover_image_url`: TEXT (Nullable, 대표 이미지. 미입력 시 클라이언트에서 기본 이미지 처리)
  - `image_urls`: TEXT[] (NOT NULL, PDF에서 변환된 주보 본문 이미지 URL 리스트)
  - `original_pdf_url`: TEXT (Nullable, 다운로드용 원본 PDF)
  - `created_at`: TIMESTAMPTZ

#### 5. `notices` (공지사항)

- **Columns:**
  - `id`: UUID (PK)
  - `title`: TEXT (NOT NULL)
  - `content`: TEXT (NOT NULL)
  - `is_urgent`: BOOLEAN (Default: false)
  - `created_at`: TIMESTAMPTZ

#### 6. `events` (행사/이벤트)

- **Columns:**
  - `id`: UUID (PK)
  - `title`: TEXT (NOT NULL)
  - `description`: TEXT (Nullable, 설명)
  - `photo_url`: TEXT (NOT NULL, 행사 포스터/사진)
  - `start_date`: DATE (NOT NULL, 행사 시작일)
  - `created_at`: TIMESTAMPTZ

#### 7. `members` (섬기는 사람들)

- **Columns:**
  - `id`: UUID (PK)
  - `name`: TEXT (NOT NULL)
  - `role`: TEXT (NOT NULL, 직분 - 예: 담임목사, 장로)
  - `photo_url`: TEXT (Nullable, 사진)
  - `contact`: TEXT (Nullable, 연락처)
  - `introduction`: TEXT (Nullable, 소개글)
  - `is_public`: BOOLEAN (Default: true, 인터넷 노출 여부)
  - `sort_order`: INTEGER (Default: 0, 목사님을 맨 위로 올리기 위한 정렬 순서)
  - `created_at`: TIMESTAMPTZ

#### 8. `banners` (배너) — 초기 계획에 없던 추가 테이블

- **Columns:**
  - `id`: UUID (PK)
  - `title`: TEXT (NOT NULL)
  - `image_url`: TEXT (NOT NULL)
  - `sort_order`: INTEGER (Nullable, 정렬 순서)
  - `created_at`: TIMESTAMPTZ

---

### C. 스토리지 정책 (Storage Bucket Policies)

> Hard Delete 전략에 따라, DB Row 삭제 시 스토리지 파일도 정리하는 것이 중요함.

1.  **Buckets:** `sermon-covers`, `gallery-images`, `bulletin-files`, `event-images`, `member-photos`
2.  **Access:** Public Read / Admin Write & Delete.

---

## 8. 개발 컨벤션 (Conventions)

- **Strict Type Safety:** `any` 사용 절대 금지. `packages/database`의 타입을 import하여 사용.
- **Naming Convention (기존 코드베이스 참조 필수):**
  - **컴포넌트:** PascalCase (예: `AnnouncementsList`, `CreateButton`)
  - **함수:** camelCase (예: `getAnnouncements`, `mapBulletin`)
  - **폴더:** kebab-case (예: `announcement-list`, `main-layout`)
  - **파일명:**
    - React 컴포넌트: PascalCase.tsx (예: `AnnouncementsList.tsx`, `LoginCard.tsx`)
    - 유틸/훅: camelCase.ts (예: `use-form.ts`, `mapper.ts`)
    - 타입/모델: 도메인명.ts (예: `announcement.ts`, `schema.ts`)
  - **중요:** 새로운 파일이나 변수를 생성할 때는 **반드시 기존 프로젝트의 유사한 파일들을 먼저 검색하여 네이밍 패턴을 확인**하고 동일한 규칙을 따른다.
    - 예: announcement 기능 추가 시 → bulletin, sermon 등 기존 entities/features 폴더 구조와 파일명 참조
    - AI는 코드 작성 전 `find_by_name`, `grep_search` 등을 활용하여 기존 패턴을 반드시 확인해야 함.
- **Performance Check:** 컴포넌트 개발 시 불필요한 `useEffect` 사용을 지양하고, Server Actions를 우선 고려.

- **Responsive Design Strategy (Standard):**
  - **Mobile First Principle:** 모든 UI는 기본적으로 모바일(Small Screen)을 기준으로 작성한다.
  - **Breakpoint Overrides:** 데스크탑 등 큰 화면에서는 Tailwind의 `md:`, `lg:`, `xl:` 접두사를 사용하여 레이아웃을 확장한다.
  - **Layout Example:**
    - 설교 리스트: 모바일 `grid-cols-1` -> 태블릿 `md:grid-cols-2` -> 데스크탑 `lg:grid-cols-3`.
    - 네비게이션: 모바일 `Hamburger Menu` -> 데스크탑 `Top Horizontal Bar`.
  - **Full Width Usage:** 데스크탑 환경에서는 `max-w-screen-xl mx-auto` 등을 활용하여 화면 공간을 효율적으로 사용한다 (모바일 뷰 강제 금지).

## 9. 환경 설정 및 Supabase 상세 전략 (Environment & Configuration)

### A. 환경 변수 (Environment Variables)

> `.env.local` 파일에 관리하며, `apps/web`과 `apps/admin`에 각각 적용한다.

```bash
# [Common] Supabase 연결 정보 (Web & Admin 공통)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# [Admin Only] 관리자 앱 전용 설정
# *주의: SERVICE_ROLE_KEY는 절대 브라우저에 노출되면 안 됨 (Server Actions 내부용)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# [Admin Only] 화이트리스트 (로그인 허용 이메일)
# 쉼표(,)로 구분하여 관리. 코드 레벨에서 이메일 일치 여부 확인.
NEXT_PUBLIC_ADMIN_EMAILS="pastor@manna.church,admin@manna.church"

# [Monitoring] Sentry 소스맵 업로드용
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# [Web Only] 메타데이터 및 SEO 설정
NEXT_PUBLIC_SITE_URL="https://manna-church.com"
```

### B. Supabase Storage Buckets

> 모든 버킷은 `Public Access`를 활성화하여 읽기를 허용한다.

| Bucket Name          | 용도                           | 정책 (RLS)                |
| :------------------- | :----------------------------- | :------------------------ |
| **`sermon-covers`**  | 설교 썸네일                    | Public Read / Admin Write |
| **`gallery-images`** | 갤러리/앨범 사진               | Public Read / Admin Write |
| **`bulletin-files`** | 주보 (PDF 원본 및 변환된 WebP) | Public Read / Admin Write |
| **`event-images`**   | 행사 포스터/배너               | Public Read / Admin Write |
| **`member-photos`**  | 섬기는 사람들 프로필 사진      | Public Read / Admin Write |

### C. Auth & Security 전략

#### 1. 인증 방식 (Authentication)

- **Providers:** `Email/Password`만 사용.
- **Sign-up Policy:**
  - **공개 회원가입(Sign-up)을 비활성화(Disable)**한다.
  - 관리자 계정은 Supabase Dashboard에서 개발자가 직접 생성(`Invite User`)하여 목사님께 계정 정보를 전달한다.
  - _이유:_ 관리자 외에는 로그인이 불필요하므로, 회원가입 페이지 자체를 구현하지 않는다.

#### 2. 화이트리스트 (Authorization)

- **Middleware Check:** `apps/admin`의 미들웨어에서 로그인한 유저의 이메일이 `NEXT_PUBLIC_ADMIN_EMAILS`에 포함되어 있는지 확인한다.
- **Double Check:** 포함되지 않은 이메일로 로그인 시도 시 즉시 로그아웃 및 차단 처리.

#### 3. RLS (Row Level Security) - "Public Read, Admin Write"

모든 테이블(`sermons`, `galleries` 등)에 대해 아래 정책을 적용한다.

```sql
-- [Policy 1] 누구나 읽을 수 있다 (Select)
CREATE POLICY "Enable read access for all users" ON "public"."table_name"
AS PERMISSIVE FOR SELECT TO public USING (true);

-- [Policy 2] 관리자만 쓰고/지울 수 있다 (Insert/Update/Delete)
-- *조건: 로그인 되어 있어야 함 (authenticated)
CREATE POLICY "Enable write access for authenticated users only" ON "public"."table_name"
AS PERMISSIVE FOR ALL TO authenticated USING (true);
```
