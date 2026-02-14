# Project Specification: Manna Church Service Platform

## 1. 프로젝트 개요

- **프로젝트명:** `manna-church-service`
- **클라이언트:** 만나교회 (부산 사하구 다대동)
- **아키텍처:** Turborepo 모노레포 (사용자 웹 + 관리자 CMS)
- **미션:**
  > "디지털 소외 계층인 고령의 성도들이 **가장 쉽고 빠르게** 교회 소식에 접근할 수 있게 하고, 기술을 모르는 목사님이 **스트레스 없이** 운영할 수 있는 시스템을 구축한다."

### 핵심 가치

1. **초-접근성:** 예쁘기만 한 디자인보다 **"보이는"** 디자인 우선. (고대비, 큰 글씨, 직관적 UX)
2. **저사양 최적화:** **보급형 갤럭시 A 시리즈**에서 60fps 보장. 무거운 라이브러리 사용 금지.
3. **운영 자동화:** "개발자한테 전화해야 해결되는 일"을 만들지 않는다. 이미지 자동 압축 등 시스템 방어.

---

## 2. 사용자 페르소나 및 제약 사항

> 🤖 **AI Instruction:** 코드를 작성할 때 항상 아래 두 페르소나를 상상하고 구현하라.

### A. 성도: "70대 김권사님" (End User)

- **환경:** 3년 지난 갤럭시 A32, 폰트 크기 '크게', 교회 지하 식당 Wi-Fi.
- **불편함:** 깨알 같은 글씨, 빠르게 넘어가는 화면, 영어 메뉴.
- **요구사항:**
  - **Zero-Lag:** 터치 시 즉각 반응 (SSG + `'use cache'` 필수).
  - **Readability:** 기본 폰트가 커야 한다.
  - **Simplicity:** 메인 화면에서 주요 콘텐츠를 한 번에 찾을 수 있어야 한다.

### B. 관리자: "60대 김목사님" (Admin)

- **기술 수준:** 한글/워드 가능, '이미지 리사이징' 등 개념 낯설음.
- **행동 패턴:** DSLR 원본(15MB) 그대로 업로드, PDF 파일을 그대로 올림.
- **요구사항:**
  - **Blog-like UX:** 네이버 블로그처럼 단순하고 직관적인 에디터.
  - **Auto-Processing:** 원본을 올려도 알아서 웹용으로 변환.
  - **Fail-Safe:** 잘못된 파일을 올려도 서버가 죽지 않고 친절하게 안내.

---

## 3. 기술 스택

### Core Framework

- **Runtime:** Node.js >= 25.0.0
- **Package Manager:** pnpm 10.25.0
- **Monorepo:** Turborepo 2.7.2 (`pnpm` workspace)
- **Framework:** **Next.js 16.1.1 (Stable)**
  - _Strategy:_ Admin은 `force-dynamic` + Server Actions, Web은 `'use cache'` + SSG.
- **Library:** **React 19.2.3 (Stable)**
  - React Compiler (`babel-plugin-react-compiler` 1.0.0)를 통한 자동 렌더링 최적화.
  - `cacheComponents: true` — 컴포넌트 수준 캐싱 활성화.
- **TypeScript:** 5.9.3 (Strict Mode)

### Infrastructure & Database

- **BaaS:** Supabase (PostgreSQL, Auth, Storage)
- **Monitoring:** Sentry (`@sentry/nextjs` 10.36.0)
  - `instrumentation.ts`에서 서버/엣지 런타임별 Sentry 초기화.
  - `onRequestError = Sentry.captureRequestError`로 요청 에러 자동 캡처.
- **Deployment:** Vercel (Production)

### State Management & Data Fetching

- **Client State:** 전역 상태 관리 라이브러리 미사용. 컴포넌트 로컬 `useState`로 충분.
- **Data Fetching Strategy (Web):** **`'use cache'` + `React.cache()` + `cacheLife` / `cacheTag`**
  - 모든 Entity 쿼리 파일에 `'use cache'` 디렉티브 적용.
  - `cacheLife('hours')` (리스트/최근), `cacheLife('days')` (상세/정적) 단위로 캐시 수명 관리.
  - `cacheTag`로 태그 기반 캐시 무효화 지원 (예: `cacheTag('announcement-list')`).
  - `createPublicClient()`로 Supabase Public Client 생성 (인증 불필요).
- **Data Fetching Strategy (Admin):** **Supabase Client (`@repo/database/client`) + `React.cache()`**
  - `force-dynamic`으로 항상 최신 데이터를 보장.
  - Server Actions 성공 시 `revalidatePath()` 호출하여 즉시 캐시 무효화.

### Styling

- **CSS:** Tailwind CSS v4.1.18 (Mobile First)
  - _Config:_ `packages/tailwind-config`를 통해 웹과 어드민이 동일한 디자인 토큰 공유.
- **Components:** Shadcn/UI (Radix UI 기반 Headless)
  - _Location:_ **`packages/ui`**에 설치, `@repo/ui`로 import.
- **Icons:** Lucide React 0.546.0

### Web 전용 의존성

| 패키지                    | 버전  | 용도                        |
| :------------------------ | :---- | :-------------------------- |
| `date-fns`                | 4.1.0 | 날짜 포맷팅 (한국어 locale) |
| `embla-carousel-autoplay` | 8.6.0 | Hero Carousel 자동 재생     |
| `react-naver-maps`        | 0.1.4 | 오시는 길 네이버 지도       |

---

## 4. 모노레포 구조

- `apps/web`: 사용자용 서비스 (Next.js App Router, `'use cache'` + SSG, 고령층 최적화). ✅ **구현 완료**
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
- ~~`packages/utils`~~: **미구현.** 유틸리티 함수는 각 앱의 `src/shared/lib/`에 위치.

## 5. 아키텍처 및 폴더 구조 (Clean FSD + CQRS Pattern)

Next.js App Router의 특성과 CQRS(명령과 조회의 분리) 패턴을 적용하여, **읽기(Read)**와 **쓰기(Write)**의 관심사를 명확히 분리한 Clean FSD 구조를 따른다.

### Layer Rules (엄격 준수)

#### 1. App Layer (`apps/*/app/`) — "Routing & Page Composition"

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

`App` → `Widgets` → `Features` → `Entities` → `Shared` (Wrapper) → `@repo/ui`
(상위 레이어는 하위 레이어를 import 할 수 있지만, 역은 성립하지 않는다.)

---

## 6. 주요 기능 명세

### A. 공통 / UX

- **Motion Reduction (Vestibular Disorder):**
  - **No GIF/Animation:** 어지러움 방지를 위해 UI 애니메이션은 CSS `transition`만 허용하며, 콘텐츠의 GIF도 정지 이미지로 변환하여 보여준다.
  - **No Modals:** 갑자기 튀어나오는 팝업(Modal)은 고령층에게 혼란을 주므로, 페이지 내 삽입(Inline) 방식이나 바텀 시트(Bottom Sheet)를 우선한다.
- **Loading & Error Strategy:**
  - `Spinner` 대신 **Skeleton UI** 사용 (CLS 방지).
  - **`withAsyncBoundary` HOC:** `Suspense` + 서버 에러 처리를 하나의 패턴으로 통합.
    - `loadingFallback`: Skeleton 컴포넌트.
    - `errorFallback`: 에러 안내 UI.
    - Next.js 내부 에러(`NEXT_` digest)는 리스로우, 그 외는 `Sentry.captureException()` 후 폴백 표시.
  - **Image Fallback:** 이미지 로딩 실패 시 기본 이미지(`DEFAULT_BANNER`, `DEFAULT_BULLETIN` 등) 표시.
- **Global Error Page (`global-error.tsx`):**
  - Sentry 에러 로깅, 재시도/홈 이동/전화 걸기 버튼 제공.
- **404 Page (`not-found.tsx`):**
  - 사용자 친화적 메시지, 이전 페이지/홈 이동 버튼.

### B. 사용자 웹 (`apps/web`) ✅ 구현 완료

#### B-1. 메인 페이지 (`/`)

- **Hero Carousel:** `embla-carousel-autoplay`로 자동 재생(5초 간격), 루프, 이전/다음 화살표, 도트 인디케이터.
  - 서버에서 `getBanners()` 호출 → `banners` 테이블 데이터 표시.
  - 배너 없을 시 기본 이미지(`DEFAULT_BANNER1.webp`) 표시.
- **Quick Menu:** 8개 아이콘 바로가기 (교회소개, 예배안내, 오시는길, 공지사항, 이벤트, 갤러리, 주보, YouTube).
- **YouTube 이미지 박스:** YouTube 채널 바로가기 (썸네일 이미지 + 오버레이 링크).
- **공지사항 섹션:** 최근 5건 공지 표시 (`getRecentAnnouncements()`), 긴급 배지, 더보기 버튼.
- **이벤트 마키:** CSS 마키 애니메이션 이벤트 카드 슬라이더 (`getRecentEvents()`), 호버 시 상세 보기 버튼.
- **갤러리 섹션:** 최근 4건 갤러리 카드 그리드 (`getRecentGalleries()`), 호버 시 오버레이 효과.

#### B-2. 교회 소개 (`/about/*`)

| 경로                      | 위젯                         | 설명                                                                                |
| :------------------------ | :--------------------------- | :---------------------------------------------------------------------------------- |
| `/about`                  | —                            | `/about/intro`로 리다이렉트                                                         |
| `/about/intro`            | `PastorGreetingIntroSection` | 담임목사 인사말, 프로필 사진/서명                                                   |
| `/about/worship`          | `WorshipContent`             | 예배 시간표 (주일/주중/다음세대, 카드 UI)                                           |
| `/about/location`         | `LocationContent`            | 네이버 지도 (`react-naver-maps`), 주소, 교통편, 외부 지도 링크 (네이버/카카오/구글) |
| `/about/servants`         | `ServantsContent`            | 담임목사/부교역자/구역장 섹션별 표시 (`getAllServants()`)                           |
| `/about/missionary`       | `MissionarySection`          | 선교사 폴라로이드 카드 그리드 (`getAllMissionaries()`)                              |
| `/about/bulletins`        | `BulletinList`               | 주보 목록 (연/월 필터 + 페이지네이션, 페이지당 8개)                                 |
| `/about/bulletins/[date]` | `BulletinDetail`             | 특정 날짜 주보 상세 (표지 + 내지 이미지 목록)                                       |

#### B-3. 소식 (`/news/*`)

| 경로                       | 위젯                 | 설명                                                          |
| :------------------------- | :------------------- | :------------------------------------------------------------ |
| `/news`                    | —                    | `/news/announcements`로 리다이렉트                            |
| `/news/announcements`      | `AnnouncementList`   | 공지사항 목록 (검색 + 페이지네이션, 페이지당 10개)            |
| `/news/announcements/[id]` | `AnnouncementDetail` | 공지 상세 (긴급 배지, 본문, 뒤로가기)                         |
| `/news/events`             | `EventList`          | 이벤트 목록 (검색 + 페이지네이션, 페이지당 10개, 카드 그리드) |
| `/news/events/[id]`        | `EventDetail`        | 이벤트 상세 (포스터 이미지, 날짜, 설명)                       |
| `/news/gallery`            | `GalleryList`        | 갤러리 목록 (검색 + 페이지네이션, 페이지당 9개, 3열 그리드)   |
| `/news/gallery/[id]`       | `GalleryDetail`      | 갤러리 상세 (전체 이미지 세로 나열, 이미지 장수 표시)         |

#### B-4. 검색 & 페이지네이션

- **검색 기능 구현 완료:** 공지사항/이벤트/갤러리 목록에 `ContentWrapper` 통합 검색 UI 제공.
  - URL 쿼리 파라미터 방식: `?query=검색어&page=1`
  - Supabase `ilike` 연산자로 서버 사이드 검색.
- **주보:** 연/월 Select 필터 (`BulletinContentWrapper`), 검색 없음.
- **페이지당 항목 수:** 공지사항 10개, 이벤트 10개, 갤러리 9개, 주보 8개.
- **PaginationBar:** 5페이지 윈도우, 이전/다음 버튼, 1페이지일 때 자동 숨김.
- **Database Query:** Supabase `select('*', { count: 'exact' })` + `.range(from, to)`.

#### B-5. SEO & Open Graph

- **Root Metadata:** `layout.tsx`에서 `churchData` 기반 메타데이터 일괄 설정.
  - `title`, `description`, `keywords`, `openGraph`, `twitter`, `robots`, `verification` (naver, google).
- **JSON-LD:** `Church` 타입 구조화 데이터 (이름, 주소, 전화, URL, 로고, SNS 등).
- **Dynamic Metadata:** 상세 페이지별 `generateMetadata`를 통해 `og:title`, `og:image`, `og:description` 동적 생성.
- **Sitemap:** `sitemap.ts`에서 정적 + 동적 경로 자동 생성 (공지/주보/이벤트/갤러리).
  - 우선순위: 홈(1.0) > 교회소개(0.8) > 리스트(0.7) > 상세(0.6).
- **Robots:** `robots.ts`에서 `/api/` 경로 disallow, 나머지 허용.
- **`generateStaticParams`:** 공지/이벤트/갤러리/주보 상세 페이지에서 빌드 시 정적 경로 생성.

#### B-6. 레이아웃 구조

- **Root Layout:** Noto Sans KR 폰트, Tailwind CSS, Sentry 통합, JSON-LD.
- **Main Layout (`(main)/`):** `MainHeader` + `children` + `MainFooter` + `ScrollFAB`.
  - **Header:** 로고, NavigationMenu (데스크탑), 소셜 아이콘 (YouTube/Instagram), MobileMenu (Sheet).
  - **Footer:** 교회 정보, 저작권, 개인정보처리방침/이용약관 다이얼로그.
  - **ScrollFAB:** 맨 위/아래 이동 FAB (스크롤 300px 이후 상단 버튼 표시).
- **Content Layout (`(main)/(content)/`):** `AboutSidebar` + `children`.
  - **AboutSidebar:** 데스크탑 좌측 고정 사이드바, `menuData` 기반 네비게이션 (lg 이상에서만 표시).

#### B-7. URL 슬러그 패턴

- 공지/이벤트/갤러리: `/{title}-{shortId}` (예: `/news/events/부활절-abc123`)
  - `short_id` 컬럼으로 고유 식별, `title`은 SEO용 접두사.
- 주보: `/about/bulletins/{yyyy-MM-dd}` (예: `/about/bulletins/2025-01-05`)

#### B-8. `apps/web` FSD 구현 상세

**Entities Layer (`src/entities/`):**

- `announcement/` — `Announcement` 타입, `getAnnouncements`, `getAnnouncementByShortId`, `getRecentAnnouncements`, `getRecentAnnouncementShortIds`
- `banner/` — `Banner` 타입, `getBanners`
- `bulletin/` — `Bulletin` 타입, `getBulletins`, `getBulletinByDate`, `getRecentBulletinDates`
- `event/` — `Event` 타입, `getEvents`, `getEventByShortId`, `getRecentEventShortIds`, `getRecentEvents`
- `gallery/` — `Gallery`, `GalleryImage`, `GalleryListItem`, `GalleryWithImages` 타입, `getGalleries`, `getGalleryByShortId`, `getRecentGalleryShortIds`, `getRecentGalleries`
  - `galleries_with_count` DB 뷰를 사용하여 리스트 조회 시 이미지 수 포함.
- `missionary/` — `Missionary` 타입, `getAllMissionaries`
- `servant/` — `Servant` 타입, `getAllServants`, `ROLES` 상수 (`담임목사`, `목사`, `구역장`)
- 구조: `model/` (타입), `api/queries.ts` (`'use cache'` + `React.cache()` + Supabase), `api/mapper.ts` (Row→Domain), `index.ts` (배럴)

**Widgets Layer (`src/widgets/`):**

- `hero-carousel/` — Hero 배너 캐러셀 (Embla Carousel + Autoplay, `useCarousel` 커스텀 훅)
- `quick-menu/` — 퀵 메뉴 아이콘 그리드 + YouTube 이미지 박스
- `announcements-section/` — 홈 공지사항 섹션, 공지 리스트, 공지 상세
- `events-section/` — 홈 이벤트 마키, 이벤트 리스트, 이벤트 상세, `EventItem` (Client)
- `gallery-section/` — 홈 갤러리 섹션, 갤러리 리스트, 갤러리 상세, `GalleryItem` (Client)
- `bulletins-section/` — 주보 리스트 (연/월 필터 `BulletinContentWrapper`), 주보 상세, 커스텀 Skeleton/Error
- `intro-section/` — 담임목사 인사말 (`PastorGreetingIntroSection`)
- `worship-section/` — 예배 시간표 (`WorshipContent`, 카드 기반 UI, `WORSHIP_DATA` 상수)
- `location-section/` — 오시는 길 (네이버 지도, 주소, 교통편, 외부 지도 링크)
- `servants-section/` — 섬기는 사람들 (`LeadPastorSection`, `AssociatePastorList`, `DistrictLeaderList`)
- `missionary-section/` — 선교사 소개 (`HangingPolaroid` 카드)
- `about-layout/` — 콘텐츠 사이드바 (`AboutSidebar`, `NavLink`)
- `main-layout/` — 헤더/푸터/모바일메뉴/로고/아이콘/네비게이션/스크롤FAB/개인정보·이용약관 다이얼로그

**Shared Layer (`src/shared/`):**

- `config/` — `metadata.ts` (churchData, BASE_URL, DEFAULT_OG_IMAGE), `route.ts` (menuData, Items)
- `lib/` — `date.ts` (formatKoreanDate: date-fns + ko locale)
- `icon/` — Google, Naver, Kakao 커스텀 SVG 아이콘
- `ui/base/` — @repo/ui 래핑 (NavigationMenu, Sheet, Carousel, Button, Card, Badge, Select, Dialog, Input, AspectRatio)
- `ui/components/` — PaginationBar, HeroBanner, NotImage, ReadMoreButton, ListError, ListSkeleton, BackButton
- `ui/utils/` — withAsyncBoundary (Suspense + 서버 에러 바운더리 합성)
- `ui/` (root) — ContentWrapper (검색+페이지네이션 통합), MainWrapper, SectionWrapper
- `ui/index.ts` — 모든 UI 컴포넌트 배럴 파일

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
  - `short_id`: TEXT (NOT NULL, UNIQUE, URL 슬러그용 짧은 ID)
  - `title`: TEXT (NOT NULL)
  - `event_date`: DATE (NOT NULL)
  - `thumbnail_url`: TEXT (Nullable)
  - `created_at`: TIMESTAMPTZ
- **View:** `galleries_with_count` — `galleries` + 이미지 수(`images_count`) 조인 뷰 (리스트 조회용)

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
  - `short_id`: TEXT (NOT NULL, UNIQUE, URL 슬러그용 짧은 ID)
  - `title`: TEXT (NOT NULL)
  - `content`: TEXT (NOT NULL)
  - `is_urgent`: BOOLEAN (Default: false)
  - `created_at`: TIMESTAMPTZ

#### 6. `events` (행사/이벤트)

- **Columns:**
  - `id`: UUID (PK)
  - `short_id`: TEXT (NOT NULL, UNIQUE, URL 슬러그용 짧은 ID)
  - `title`: TEXT (NOT NULL)
  - `description`: TEXT (Nullable, 설명)
  - `photo_url`: TEXT (NOT NULL, 행사 포스터/사진)
  - `start_date`: DATE (NOT NULL, 행사 시작일)
  - `created_at`: TIMESTAMPTZ

#### 7. `members` (섬기는 사람들)

- **Columns:**
  - `id`: UUID (PK)
  - `name`: TEXT (NOT NULL)
  - `role`: TEXT (NOT NULL, 직분 — `담임목사` | `목사` | `구역장`)
  - `photo_file`: TEXT (Nullable, Storage 파일 경로)
  - `contact`: TEXT (Nullable, 연락처)
  - `introduction`: TEXT (Nullable, 소개글)
  - `is_public`: BOOLEAN (Default: true, 인터넷 노출 여부)
  - `sort_order`: INTEGER (Default: 0, 정렬 순서)
  - `created_at`: TIMESTAMPTZ

#### 8. `banners` (메인 배너)

- **Columns:**
  - `id`: UUID (PK)
  - `title`: TEXT (NOT NULL)
  - `image_url`: TEXT (NOT NULL)
  - `sort_order`: INTEGER (Nullable, 정렬 순서)
  - `created_at`: TIMESTAMPTZ

#### 9. `missionaries` (선교사)

- **Columns:**
  - `id`: UUID (PK)
  - `name`: TEXT (NOT NULL)
  - `country`: TEXT (NOT NULL, 선교 국가)
  - `image_url`: TEXT (Nullable, 선교사 사진)
  - `description`: TEXT (NOT NULL, 소개)
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

# [Web Only] 네이버 지도 API
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID="your-naver-map-client-id"
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
