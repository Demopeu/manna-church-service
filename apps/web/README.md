# 만나교회 사용자 웹사이트 (`apps/web`)

> 60대 이상 어르신도 **구형 스마트폰**에서 버벅임 없이 교회 소식을 확인할 수 있는 고성능 SSG 웹사이트.

- **프로덕션 URL:** [https://mannachurch.or.kr](https://mannachurch.or.kr)

---

## 1. 개발 환경

| 항목                | 내용                                       |
| :------------------ | :----------------------------------------- |
| **Node.js**         | 루트 기준 >= 25.0.0                        |
| **Package Manager** | pnpm (루트 `packageManager: pnpm@10.25.0`) |
| **Dev Server Port** | `3000`                                     |

---

## 2. 기술 소개

### 핵심 기술 스택

| 분류          | 기술                        | 버전   | 역할                                 |
| :------------ | :-------------------------- | :----- | :----------------------------------- |
| **Framework** | Next.js                     | 16.1.1 | App Router + SSG/ISR + `'use cache'` |
| **UI**        | React                       | 19.2.3 | 함수형 컴포넌트 + React Compiler     |
| **Language**  | TypeScript                  | 5.9.3  | Strict 모드                          |
| **Styling**   | Tailwind CSS                | 4.1.18 | 유틸리티 퍼스트 CSS                  |
| **Compiler**  | babel-plugin-react-compiler | 1.0.0  | 자동 메모이제이션                    |

### Dependencies 분석

#### 데이터 & 인프라

| 패키지           | 버전      | 역할                                        |
| :--------------- | :-------- | :------------------------------------------ |
| `@repo/database` | workspace | Supabase Client + 자동 생성 TypeScript 타입 |
| `@repo/ui`       | workspace | 공통 디자인 시스템 (Shadcn/UI + Radix)      |
| `@sentry/nextjs` | 10.36.0   | 에러 추적 (서버/클라이언트/엣지)            |

#### UI & 인터랙션

| 패키지                    | 버전    | 역할                               |
| :------------------------ | :------ | :--------------------------------- |
| `embla-carousel-autoplay` | 8.6.0   | 히어로 배너 자동 재생 캐러셀       |
| `lucide-react`            | 0.546.0 | 아이콘                             |
| `react-naver-maps`        | 0.1.4   | 네이버 지도 API (오시는 길 페이지) |

#### 유틸리티

| 패키지     | 버전  | 역할        |
| :--------- | :---- | :---------- |
| `date-fns` | 4.1.0 | 날짜 포맷팅 |

### 기능 개요

만나교회 사용자 웹사이트는 **교회 정보 열람 전용** 사이트입니다. 관리자 CMS(`apps/admin`)에서 등록한 콘텐츠를 성도님들이 조회합니다.

#### 페이지 구성

| 라우트                     | 페이지        | 주요 기능                                              |
| :------------------------- | :------------ | :----------------------------------------------------- |
| `/`                        | 메인 홈       | 히어로 캐러셀, 퀵 메뉴, 최근 공지, 이벤트 마퀴, 갤러리 |
| `/about/intro`             | 만나교회 소개 | 담임목사 인사말, 교회 비전                             |
| `/about/worship`           | 예배 안내     | 예배 시간표, 모임 안내                                 |
| `/about/servants`          | 섬기는 사람들 | 담임/협동목사, 구역장 소개                             |
| `/about/location`          | 오시는 길     | 네이버 지도, 주소, 교통편 안내                         |
| `/about/bulletins`         | 주보          | 연/월 필터 + 페이지네이션                              |
| `/about/bulletins/[date]`  | 주보 상세     | 주보 이미지 목록                                       |
| `/about/missionary`        | 선교사 후원   | 선교사 소개                                            |
| `/news/announcements`      | 공지사항      | 검색 + 페이지네이션                                    |
| `/news/announcements/[id]` | 공지사항 상세 | 본문, 이미지, 뒤로가기                                 |
| `/news/events`             | 이벤트        | 검색 + 페이지네이션                                    |
| `/news/events/[id]`        | 이벤트 상세   | 본문, 이미지, 뒤로가기                                 |
| `/news/gallery`            | 갤러리        | 검색 + 페이지네이션 (썸네일 그리드)                    |
| `/news/gallery/[id]`       | 갤러리 상세   | 이미지 목록, 뒤로가기                                  |

---

## 3. 아키텍처

### Clean FSD (Feature-Sliced Design)

```
src/
├── app/                       # App Layer — 라우팅 전용
│   ├── (main)/                # 메인 레이아웃 (Header + Footer + ScrollFAB)
│   │   ├── page.tsx           #   홈 (HeroCarousel, QuickMenu, 공지, 이벤트, 갤러리)
│   │   └── (content)/         #   콘텐츠 레이아웃 (AboutSidebar + children)
│   │       ├── about/         #     교회소개 섹션 (intro, worship, servants, location, bulletins, missionary)
│   │       └── news/          #     만나소식 섹션 (announcements, events, gallery)
│   ├── layout.tsx             # RootLayout (폰트, SEO 메타데이터, JSON-LD 스키마)
│   ├── sitemap.ts             # 동적 Sitemap 생성 (정적 + DB 기반 동적 경로)
│   └── robots.ts              # robots.txt
├── widgets/                   # Widgets Layer — 페이지 구획별 조합 컴포넌트
│   ├── hero-carousel/         #   Embla Carousel + Autoplay 기반 히어로 배너
│   ├── quick-menu/            #   QuickMenu 그리드 + YouTube 섹션
│   ├── announcements-section/ #   공지사항 홈 섹션 / 리스트 / 상세
│   ├── events-section/        #   이벤트 마퀴 / 리스트 / 상세
│   ├── gallery-section/       #   갤러리 홈 섹션 / 리스트 / 상세
│   ├── bulletins-section/     #   주보 리스트 + 연/월 필터 / 상세
│   ├── intro-section/         #   담임목사 인사말
│   ├── worship-section/       #   예배 안내
│   ├── servants-section/      #   섬기는 사람들
│   ├── missionary-section/    #   선교사 후원
│   ├── location-section/      #   네이버 지도 + 주소 + 교통편
│   ├── about-layout/          #   콘텐츠 사이드바 네비게이션
│   └── main-layout/           #   Header + Footer + MobileMenu + ScrollFAB
├── entities/                  # Entities Layer — Read 전용 (쿼리 + 도메인 모델)
│   ├── announcement/          #   model/ + api/ (dto, mapper, queries)
│   ├── banner/                #   히어로 배너 데이터
│   ├── bulletin/              #   주보 데이터
│   ├── event/                 #   이벤트 데이터
│   ├── gallery/               #   갤러리 + 중첩 이미지 데이터
│   ├── missionary/            #   선교사 데이터
│   ├── sermon/                #   설교 데이터
│   └── servant/               #   섬기는 사람들 데이터
└── shared/                    # Shared Layer — 순수 유틸리티 & UI
    ├── config/                #   churchData (교회 정보), menuData, Items (퀵 메뉴)
    ├── icon/                  #   소셜 아이콘 (Google, Kakao, Naver)
    ├── lib/                   #   formatKoreanDate 등 날짜 유틸리티
    └── ui/                    #   base/ (Shadcn 래퍼), components/ (PaginationBar, HeroBanner 등)
```

### 의존성 규칙

```
App → Widgets → Entities → Shared → @repo/ui
```

`apps/web`에는 `features/` 레이어가 **없습니다**. 사용자 웹은 읽기 전용이므로 CUD 로직이 불필요합니다.

### 렌더링 & 캐싱 전략

| 전략                        | 적용 범위             | 설명                                               |
| :-------------------------- | :-------------------- | :------------------------------------------------- |
| **`'use cache'`**           | 모든 Entity 쿼리 함수 | 파일 레벨 `'use cache'` + `cacheTag` + `cacheLife` |
| **`cacheLife('hours')`**    | 리스트/최근 데이터    | 시간 단위 캐시 (공지 목록, 최근 갤러리 등)         |
| **`cacheLife('days')`**     | 상세 페이지 데이터    | 일 단위 캐시 (개별 공지, 갤러리 상세 등)           |
| **`cacheComponents: true`** | `next.config.ts`      | PPR(Partial Prerendering) 활성화                   |
| **React Compiler**          | 전역                  | `reactCompiler: true`로 자동 메모이제이션          |

### SEO 최적화

| 항목              | 구현                                                           |
| :---------------- | :------------------------------------------------------------- |
| **메타데이터**    | `churchData` 중앙 관리 → `Metadata` API로 전역 + 페이지별 설정 |
| **JSON-LD**       | `RootLayout`에 `@type: Church` 구조화 데이터 삽입              |
| **Sitemap**       | 정적 10개 + 동적 경로 (공지, 주보, 이벤트, 갤러리) 자동 생성   |
| **robots.txt**    | 전체 허용, `/api/` 차단                                        |
| **검색엔진 인증** | Google Search Console + Naver Search Advisor                   |
| **OpenGraph**     | 전역 OG 이미지 + 페이지별 타이틀 템플릿                        |
| **URL 슬러그**    | `제목-shortId` 형식 (SEO 친화적 + 고유성 보장)                 |

### 핵심 패턴

#### 1. `withAsyncBoundary` HOC

모든 비동기 Server Component에 적용하는 에러/로딩 통합 래퍼입니다.

```
[비동기 Server Component]
  → Suspense (loadingFallback: Skeleton)
  → try-catch (errorFallback: 에러 UI)
  → Next.js 내부 에러 → rethrow (searchParams, dynamic-server-error)
  → 일반 에러 → Sentry 캡처 + 에러 UI 표시
```

#### 2. Client Component Boundary

`'use cache'` 환경에서 `next/link`의 hydration mismatch를 방지하기 위해, 인터랙티브 렌더링은 `'use client'` 컴포넌트로 분리합니다.

```
[Server Component (List.tsx)]
  → 'use cache' 데이터 fetch
  → Client Component (Item.tsx) 렌더링
    → Link + Image + 인터랙션 로직
```

#### 3. 네이버 지도 통합

`react-naver-maps`를 사용하여 `'use client'` 컴포넌트에서 네이버 지도를 렌더링합니다. `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 환경 변수가 필요합니다.

---

## 4. 트러블슈팅

### 4-1. Tailwind CSS 미디어쿼리 우선순위 깨짐

> 상세: `docs/errors/0003-tailwind-css-cascade-order.md`

**문제:** 모노레포 환경에서 `hidden lg:flex` 등 반응형 유틸리티가 작동하지 않음. `display: none`이 미디어쿼리를 덮어씀.

**원인:** `@repo/ui/styles.css`와 `globals.css`에서 Tailwind를 각각 import하면서 `.hidden` 규칙이 미디어쿼리보다 나중에 재선언됨 (CSS Cascade Order 문제).

**해결:** Turborepo 공식 패턴 적용. `layout.tsx`에서 `import '@repo/ui/styles.css'`를 **먼저** import한 뒤 `import './styles/globals.css'`를 import하여 로드 순서 보장. CSS 변경 후 `pnpm clean` 필수.

### 4-2. Gallery `'use cache'` Hydration Mismatch (#418)

> 상세: `docs/errors/0005-gallery-use-cache-hydration-mismatch.md`

**문제:** 갤러리 리스트 페이지에서 프로덕션 빌드 시 `Minified React error #418` (Hydration Mismatch) 발생. 첫 로드 정상 → 새로고침 시 에러. dev 모드에서는 미발생.

**원인:** `gallery/api/queries.ts`에 `gallery_images(*)` 중첩 관계형 쿼리가 포함된 `'use cache'` 함수가 모듈 그래프에 존재할 때, Server Component에서 `next/link`를 직접 렌더링하면 RSC payload 캐시에 Link의 server-rendered HTML이 포함됨. hydration 시 `Link` 내부 `useMemo`가 `RouterContext` 기반으로 href를 재계산하면서 캐시된 HTML과 불일치 발생.

**해결:** `Link`를 `'use client'` 컴포넌트(`Item.tsx`)로 분리하여 client component boundary 생성. `'use cache'`의 RSC payload 캐싱이 client component boundary에서 멈추므로, Link의 렌더된 HTML이 캐시에 포함되지 않음.

---

## 5. 포팅 & 실행 매뉴얼

### 사전 요구사항

- Node.js >= 25.0.0
- pnpm >= 10.25.0
- **내부 패키지 빌드 완료** (`@repo/ui`, `@repo/database`의 `dist/` 필요)

### 설치

```bash
# 루트 디렉토리에서 실행
pnpm install

# 내부 패키지 빌드 (최초 1회 필수)
pnpm build
```

### 환경 변수

`apps/web/.env.local` 파일에 다음 환경 변수를 설정합니다:

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID="your-naver-map-client-id"
```

### 개발 서버 실행

```bash
# 루트에서 전체 실행 (web + admin 동시)
pnpm dev

# 또는 web만 단독 실행
pnpm --filter web dev
```

개발 서버: [http://localhost:3000](http://localhost:3000)

### 프로덕션 빌드

```bash
# 전체 빌드 (패키지 → 앱 순서 자동 보장)
pnpm build

# web만 단독 빌드
pnpm --filter web build

# 프로덕션 서버 실행
pnpm --filter web start
```

### 배포 (Vercel)

Vercel에서 모노레포 프로젝트로 설정 시:

1. **Root Directory:** `/` (루트)
2. **Build Command:** `cd ../.. && pnpm turbo build --filter=web`
3. **Output Directory:** `apps/web/.next`
4. **Install Command:** `pnpm install`

환경 변수는 Vercel 프로젝트 설정에서 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`, `SENTRY_AUTH_TOKEN` 등을 등록합니다.
