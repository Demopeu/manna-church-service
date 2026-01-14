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

- **Runtime:** Node.js (Latest LTS)
- **Monorepo:** Turborepo 2.7.2(`pnpm` workspace)
- **Framework:** **Next.js 16 (Stable)**
  - _Strategy:_ SSG/ISR을 기본으로 하여 서버 부하 최소화 및 빠른 FCP 보장.
- **Library:** **React 19 (Stable)**
  - _Strategy:_ React Compiler를 통한 자동 렌더링 최적화, Server Actions를 통한 API 개발 생산성 증대.

### Infrastructure & Database

- **BaaS:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel (Production)

### State Management & Data Fetching

- **Client State (Global):** **Zustand** (with `persist` middleware)
  - _Reason:_ 폰트 크기(Font Scale) 등 사용자 UI 설정의 영속성 보장.
- **Data Fetching Strategy (Server):** **Native Fetch (RSC) + ISR**
  - **Read Strategy:**
    - `fetch` 사용 시 `next: { revalidate: N }` 옵션을 명시하여 캐싱 정책을 제어한다.
    - **Notices / Main Page:** `revalidate = 60` (1분). 긴급 공지나 주보 변경 사항이 빠르게 반영되도록 설정.
    - **Sermons / Galleries:** `revalidate = 3600` (1시간). 데이터 변경 빈도가 낮으므로 긴 캐싱 시간 적용.
  - **Write Strategy (On-Demand Revalidation):**
    - 관리자가 데이터를 생성/수정/삭제(CUD)하는 **Server Actions** 성공 시, 반드시 `revalidatePath()`를 호출하여 즉시 캐시를 무효화(Purge)하고 최신 데이터를 반영한다.
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

- `apps/web`: 사용자용 서비스 (Next.js 16 App Router, SSG/ISR 위주, 고령층 최적화).
- `apps/admin`: 관리자용 CMS (Next.js 16 App Router, CSR/Auth 위주, 비전문가 친화 UI).
- `packages/ui`: 공통 디자인 시스템 (Shadcn/UI 컴포넌트 라이브러리).
- `packages/tailwind-config`: Tailwind CSS v4 공통 설정 (Mobile First, Font Scale 변수).
- `packages/typescript-config`: TypeScript 공통 설정 (Strict Mode, Path Alias).
- `packages/eslint-config`: ESLint 공통 규칙 (Turbopack 호환, React 19 규칙).
- `packages/database`: Supabase Generated Types (`database.types.ts`) 및 Client Factory.
  - _Why:_ `any` 타입 사용 방지, 앱 간 DB 스키마 동기화 보장.
- `packages/utils`: 날짜 포맷팅, 문자열 처리 등 순수 함수 모음.
  - _Why:_ 중복 코드 제거, 유닛 테스트 용이성.

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

### C. 관리자 CMS (`apps/admin`)

- **Page Structure (Routes Definition Only):**

  > 디자인과 레이아웃(Table vs Grid 등)은 개발자가 자유롭게 구현한다. AI는 아래 URL에 맞는 **폴더 및 파일 구조(`page.tsx`)만 생성**한다.
  - `/login`: 로그인 페이지.
  - `/`: 메인 대시보드.
  - `/sermons`: 설교 관리 (CRUD).
  - `/gallery`: 갤러리/앨범 관리.
  - `/bulletin`: 주보 관리.
  - `/announcements`: 공지사항 관리.
  - `/events`: 행사 관리.
  - `/servants`: 섬기는 사람들 관리.

- **Feature: PDF to Image Converter (Strict Rule):**
  - **Library:** `pdfjs-dist` (Latest Version) 사용.
  - **Logic:**
    - 주보 PDF 업로드 시, **반드시 1~3페이지를 추출**하여 이미지(WebP)로 변환한다.
    - **Resolution:** 가독성을 위해 Width 기준 `1920px` 이상으로 렌더링한다.
    - **Memory Safety:** 브라우저 멈춤 방지를 위해 3장을 동시에 변환하지 않고, **한 장씩 순차적으로(Sequential) 처리**한다.
  - **Constraint:** 원본 PDF가 3장 미만일 경우 있는 페이지만 변환하고, 3장을 초과해도 **앞의 3장까지만** 저장한다.

- **Feature: File Upload UX:**
  - **Loading State (Indeterminate):**
    - 정확한 퍼센트(%)를 보여주기 위해 복잡한 XHR을 사용하지 않는다.
    - 대신 **React 19의 `useFormStatus` (pending)**를 활용하여, 업로드 중임을 알리는 **"로딩 스피너"**나 **"업로드 중..." 텍스트**를 표시한다.
  - **Blocking:** 업로드(Action)가 진행되는 동안에는 Submit 버튼을 `disabled` 처리하여 중복 전송을 방지한다.

- **Image Pipeline (Client-Side Compression):**
  - 라이브러리: `browser-image-compression`.
  - 로직: 업로드 전 브라우저에서 `Max 1MB`, `WebP Format`으로 변환.
  - GIF 처리: 첫 프레임 추출 후 정적 이미지로 변환.
  - 에러 처리: 압축/변환 실패 시 Toast 메시지 출력 후 업로드 차단.

- **Auth:** 화이트리스트 아이디 기반 접속 허용.

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

### B. 테이블 명세 (Table Definitions)

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

> Plan C 적용: 관리자는 PDF를 올리지만, 시스템은 이를 이미지로 변환하여 저장 및 서빙한다.

- **Columns:**
  - `id`: UUID (PK)
  - `published_at`: DATE (NOT NULL)
  - `cover_image_url`: TEXT (NOT NULL, 대표 이미지. 미입력 시 클라이언트에서 기본 이미지 처리)
  - `content_image_urls`: TEXT[] (NOT NULL, PDF에서 변환된 3장의 주보 본문 이미지 URL 리스트)
  - `original_pdf_url`: TEXT (Nullable, 다운로드용 원본 파일. 필요 시 저장)
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
  - `photo_url`: TEXT (Nullable, 행사 포스터/사진)
  - `start_date`: DATE (Nullable, 행사 시작일 - 필요 시 사용)
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

---

### C. 스토리지 정책 (Storage Bucket Policies)

> Hard Delete 전략에 따라, DB Row 삭제 시 스토리지 파일도 정리하는 것이 중요함.

1.  **Buckets:** `sermon-covers`, `gallery-images`, `bulletin-files`, `event-images`, `member-photos`
2.  **Access:** Public Read / Admin Write & Delete.

---

## 8. 개발 컨벤션 (Conventions)

- **Strict Type Safety:** `any` 사용 절대 금지. `packages/database`의 타입을 import하여 사용.
- **Naming:** 컴포넌트는 PascalCase, 함수는 camelCase, 폴더는 kebab-case.
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
NEXT_PUBLIC_SUPABASE_URL="[https://your-project-id.supabase.co](https://your-project-id.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# [Admin Only] 관리자 앱 전용 설정
# *주의: SERVICE_ROLE_KEY는 절대 브라우저에 노출되면 안 됨 (Server Actions 내부용)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# [Admin Only] 화이트리스트 (로그인 허용 이메일)
# 쉼표(,)로 구분하여 관리. 코드 레벨에서 이메일 일치 여부 확인.
NEXT_PUBLIC_ADMIN_EMAILS="pastor@manna.church,admin@manna.church"

# [Web Only] 메타데이터 및 SEO 설정
NEXT_PUBLIC_SITE_URL="[https://manna-church.com](https://manna-church.com)"
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
