# 만나교회 관리자 CMS (`apps/admin`)

> 기술을 모르는 목사님이 교회 콘텐츠를 **원클릭**으로 관리할 수 있는 직관적 관리자 시스템.

|                                          1. 대시보드                                          |                               2. 콘텐츠 등록 폼                                |
| :-------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                    ![대시보드 메인](docs/screenshots/admin-dashboard.png)                     |           ![주보 등록 폼](docs/screenshots/admin-bulletin-form.png)            |
| 여러 도메인의 요약 정보를 위젯 형태로 제공하며, 부분 실패(Partial Failure)를 허용하도록 설계. | Zod 기반의 실시간 유효성 검증과 직관적인 드래그 앤 드롭 파일 업로드 UX를 제공. |

---

## 1. 개발 환경

| 항목                | 내용                                       |
| :------------------ | :----------------------------------------- |
| **Node.js**         | 루트 기준 >= 24.0.0                        |
| **Package Manager** | pnpm (루트 `packageManager: pnpm@10.25.0`) |
| **Dev Server Port** | `3001`                                     |

---

## 2. 기술 소개

### 핵심 기술 스택

| 분류           | 기술                        | 버전   | 역할                             |
| :------------- | :-------------------------- | :----- | :------------------------------- |
| **Framework**  | Next.js                     | 16.1.1 | App Router + `force-dynamic` SSR |
| **UI Library** | React                       | 19.2.3 | 함수형 컴포넌트 + React Compiler |
| **Language**   | TypeScript                  | 5.9.3  | Strict 모드                      |
| **Styling**    | Tailwind CSS                | 4.1.18 | 유틸리티 퍼스트 CSS              |
| **Compiler**   | babel-plugin-react-compiler | 1.0.0  | 자동 메모이제이션                |

### Dependencies 분석

#### 폼 & 유효성 검증

| 패키지                | 버전   | 역할                         |
| :-------------------- | :----- | :--------------------------- |
| `react-hook-form`     | 7.70.0 | 비제어 컴포넌트 기반 폼 관리 |
| `@hookform/resolvers` | 5.2.2  | Zod 스키마 연동 리졸버       |
| `zod`                 | 4.3.5  | 런타임 스키마 유효성 검증    |

#### 미디어 처리

| 패키지                      | 버전    | 역할                                    |
| :-------------------------- | :------ | :-------------------------------------- |
| `browser-image-compression` | 2.0.2   | 클라이언트 이미지 → WebP 자동 압축      |
| `pdfjs-dist`                | 5.4.530 | PDF → WebP 이미지 변환 (주보 업로드 시) |

#### 인프라 & 모니터링

| 패키지           | 버전      | 역할                                        |
| :--------------- | :-------- | :------------------------------------------ |
| `@sentry/nextjs` | 10.36.0   | 에러 추적 (서버/클라이언트/엣지)            |
| `@repo/database` | workspace | Supabase Client + Auth + Middleware + Types |
| `@repo/ui`       | workspace | 공통 디자인 시스템 (Shadcn/UI + Radix)      |

#### 유틸리티

| 패키지         | 버전    | 역할               |
| :------------- | :------ | :----------------- |
| `date-fns`     | 4.1.0   | 날짜 포맷팅/계산   |
| `lucide-react` | 0.546.0 | 아이콘             |
| `sonner`       | 2.0.7   | Toast 알림         |
| `use-debounce` | 10.1.0  | 검색 입력 디바운스 |

### 기능 개요

관리자 CMS는 교회 콘텐츠의 **CRUD(생성/조회/수정/삭제)** 를 담당합니다.

#### 관리 대상 콘텐츠 (9개 라우트)

| 라우트           | 도메인        | 주요 기능                                              |
| :--------------- | :------------ | :----------------------------------------------------- |
| `/`              | 대시보드      | 최근 콘텐츠 현황 위젯, 부분 실패(Partial Failure) 허용 |
| `/sermons`       | 설교          | YouTube/Instagram URL 등록, 썸네일 자동 추출           |
| `/bulletins`     | 주보          | PDF 업로드 → WebP 자동 변환, 연/월 필터                |
| `/gallery`       | 갤러리        | 다중 이미지 드래그&드롭, 썸네일 선택, 최대 10장        |
| `/events`        | 이벤트        | 교회 행사 등록/관리, 이미지 첨부                       |
| `/announcements` | 공지          | 교회 공지사항 등록/관리                                |
| `/servants`      | 섬기는 사람들 | 역할별(담임/협동/구역장) 필터, 공개/비공개 토글        |
| `/missionaries`  | 선교사        | 선교사 등록/관리, 이미지 첨부                          |
| `/setting`       | 설정          | 히어로 배너 관리                                       |

---

## 3. 아키텍처

### 3-1. Clean FSD + CQRS 구조

```
src/
├── app/                         # App Layer — 라우팅 전용
│   ├── (admin)/                 # 인증 필요 라우트 그룹 (force-dynamic)
│   │   ├── (main)/              #   대시보드 (/)
│   │   ├── sermons/             #   설교 관리
│   │   ├── bulletins/           #   주보 관리
│   │   ├── gallery/             #   갤러리 관리
│   │   ├── events/              #   이벤트 관리
│   │   ├── announcements/       #   공지 관리
│   │   ├── servants/            #   섬기는 사람들 관리
│   │   ├── missionaries/        #   선교사 관리
│   │   ├── setting/             #   설정 (배너)
│   │   └── layout.tsx           #   Sidebar + Header + SidebarProvider
│   ├── login/                   # 비인증 라우트 (로그인 페이지)
│   ├── styles/                  # globals.css (Tailwind v4 엔트리)
│   ├── layout.tsx               # RootLayout (폰트, Toaster)
│   ├── error.tsx                # 에러 바운더리
│   ├── global-error.tsx         # 전역 에러 바운더리 (Sentry 캡처)
│   └── not-found.tsx            # 404 페이지
├── widgets/                     # Widgets Layer — 페이지 구획별 조합 컴포넌트 (11개)
│   ├── dashboard/               #   대시보드 카드 위젯 (5개 도메인 최근 데이터)
│   │   └── ui/                  #     Date, RecentBulletinCard, RecentAnnouncementCard,
│   │                            #     RecentEventCard, RecentSermonCard, RecentGalleryCard
│   ├── main-layout/             #   Sidebar + MainHeader + SidebarProvider (Context)
│   ├── login-card/              #   로그인 카드
│   ├── bulletin-list/           #   주보 목록 (DataTable + 연/월 필터 + 페이지네이션)
│   ├── sermon-list/             #   설교 목록
│   ├── gallery-list/            #   갤러리 목록
│   ├── event-list/              #   이벤트 목록
│   ├── announcement-list/       #   공지 목록
│   ├── servant-list/            #   섬기는 사람들 목록 (역할 필터)
│   ├── missionary-list/         #   선교사 목록
│   └── banner-list/             #   배너 목록
├── features/                    # Features Layer — CUD 로직 (9개 도메인)
│   ├── auth/                    #   로그인/로그아웃 (Supabase Auth)
│   │   ├── api/                 #     Server Actions (login, logout)
│   │   ├── model/               #     login-schema.ts (Zod), useAuth hook
│   │   └── ui/                  #     LoginForm, LogoutDropdownItem
│   ├── bulletin/                #   주보 CRUD + PDF→WebP 변환
│   │   ├── api/                 #     Server Actions (create, update, delete, storage)
│   │   ├── lib/                 #     PDF 변환 유틸리티
│   │   ├── model/               #     Zod 스키마, useForm hooks
│   │   └── ui/                  #     CreateButton, EditButton, DeleteButton + Form
│   ├── gallery/                 #   갤러리 CRUD + 다중 이미지 관리
│   ├── sermon/                  #   설교 CRUD + YouTube ID 추출
│   ├── event/                   #   이벤트 CRUD + EventForm
│   ├── announcement/            #   공지 CRUD
│   ├── servant/                 #   섬기는 사람들 CRUD + ServantForm
│   ├── missionary/              #   선교사 CRUD
│   └── banner/                  #   배너 CRUD
├── entities/                    # Entities Layer — Read 전용 (9개 도메인)
│   ├── announcement/            #   model/ + api/ (dto, mapper, queries)
│   ├── bulletin/                #   주보 데이터
│   ├── event/                   #   이벤트 데이터
│   ├── gallery/                 #   갤러리 + 중첩 이미지 데이터
│   ├── sermon/                  #   설교 데이터
│   ├── servant/                 #   섬기는 사람들 데이터 + config/positions
│   ├── banner/                  #   히어로 배너 데이터
│   ├── missionary/              #   선교사 데이터
│   └── user/                    #   현재 로그인 사용자 정보
├── shared/                      # Shared Layer — 순수 유틸리티 & UI
│   ├── api/                     #   tryCatchAction, tryCatchVoid (에러 래퍼 + Sentry)
│   ├── config/                  #   ADMIN_ROUTES (사이드바 네비게이션 설정)
│   ├── lib/                     #   imageConverter, pdfToWebpConverter, requireAuth,
│   │                            #   useDialog, useInput, useToastAndRefresh, date, guard
│   ├── model/                   #   ActionState 타입 정의 (SuccessState | ErrorState)
│   └── ui/                      #   base/ (Shadcn 래퍼 16개), components/ (SearchInput,
│                                #   Pagination 등), DataTable, DeleteDialog, ImageDialog,
│                                #   MultiImageDialog, FormTriggerButton, SectionCard, Toaster
├── proxy.ts                     # Next.js Middleware (인증 라우트 가드)
├── instrumentation.ts           # Sentry 서버 계측 (빌드 타임 초기화)
└── instrumentation-client.ts    # Sentry 클라이언트 계측 (브라우저 초기화)
```

### 3-2. 의존성 규칙

```
App → Widgets → Features → Entities → Shared → @repo/ui, @repo/database
```

상위 레이어는 하위 레이어를 import 할 수 있지만, **역방향은 금지**입니다.

### 3-3. 렌더링 전략

| 전략                | 적용 범위          | 설명                                              |
| :------------------ | :----------------- | :------------------------------------------------ |
| **`force-dynamic`** | 모든 인증 라우트   | 항상 최신 데이터 표시, SSR 캐싱 비활성화          |
| **Server Actions**  | 모든 CUD 작업      | `'use server'` + `revalidatePath()`로 캐시 무효화 |
| **`requireAuth()`** | 모든 Server Action | 진입부 세션 검증, 미인증 시 에러 반환 또는 throw  |
| **React Compiler**  | 전역               | `reactCompiler: true`로 자동 메모이제이션         |

### 3-4. 인증 흐름

```
[브라우저 요청]
      │
      ▼
[Middleware (proxy.ts)]
      ├── 미인증 + /login 이외 경로 → /login 리다이렉트
      ├── 인증됨 + /login 경로       → / 리다이렉트
      └── 그 외                       → 통과
      │
      ▼
[(admin) Layout] ── Sidebar + MainHeader 렌더링 (SidebarProvider Context)
      │
      ▼
[Server Action 호출]
      ├── requireAuth() 가드 → @repo/database/auth verifySession()
      ├── Zod schema.safeParse() → 유효성 검증
      └── tryCatchAction() → 비즈니스 로직 + Sentry 캡처
```

### 3-5. 핵심 패턴

#### 1. 클라이언트 이미지 압축

모든 이미지 업로드 시 서버 전송 **전에** 클라이언트에서 WebP 변환 + 압축을 수행합니다.

```
[원본 이미지] → browser-image-compression → [WebP, max 100KB, max 1920px]
                                              → FormData에 설정
                                              → Server Action으로 전송
```

#### 2. PDF → WebP 변환 (주보)

`pdfjs-dist`를 **Dynamic Import**하여 브라우저에서 PDF를 페이지별 WebP 이미지로 변환합니다. SSR 환경에서의 `DOMMatrix` 에러를 방지하기 위해 반드시 Dynamic Import를 사용합니다.

```
[PDF 파일] → pdfjs-dist (Dynamic Import)
           → Canvas 렌더링 (페이지별)
           → canvas.toBlob('image/webp')
           → Supabase Storage 업로드
```

#### 3. Server Action 에러 처리 파이프라인

```
[Server Action]
  → requireAuth()      // 인증 검증 (@repo/database/auth)
  → schema.safeParse()  // Zod 유효성 검증 → fieldErrors 반환
  → tryCatchAction()   // try-catch + Sentry captureException
  → ActionState 반환   // { success: true } | { success: false, message, fieldErrors? }
```

`ActionState` 타입:

```typescript
type ActionState =
  | { success: true }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };
```

#### 4. RSC 전용 Async Error Boundary (부분 실패 허용)

`withAsyncBoundary` HOC로 비동기 Server Component를 `Suspense` + `try-catch`로 감싸 독자적인 에러 바운더리를 구축합니다.

**효과:** 대시보드처럼 여러 위젯이 동시에 렌더링되는 화면에서 특정 도메인(예: 주보 API)에 장애가 발생하더라도, **페이지 전체가 다운되지 않고 해당 위젯만 Error Fallback UI를 렌더링하는 '부분 실패(Partial Failure)'를 허용**합니다.

#### 5. Sentry 에러 추적

| 파일                        | 역할                                       |
| :-------------------------- | :----------------------------------------- |
| `instrumentation.ts`        | 서버 사이드 Sentry 초기화 (빌드 타임)      |
| `instrumentation-client.ts` | 클라이언트 사이드 Sentry 초기화 (브라우저) |
| `sentry.server.config.ts`   | 서버 런타임 Sentry 설정                    |
| `sentry.edge.config.ts`     | Edge 런타임 Sentry 설정                    |
| `app/global-error.tsx`      | 전역 에러 바운더리 (Sentry 자동 캡처 + UI) |

---

## 4. 트러블슈팅

### 4-1. `pdfjs-dist` DOMMatrix SSR 에러 및 초기 번들 최적화

> 상세: `docs/errors/0001-dommatrix-defined.md`

**문제:** `pdfjs-dist`를 Top-level Import하면 Node.js(SSR) 환경에서 `ReferenceError: DOMMatrix is not defined` 발생.

**원인:** `pdfjs-dist` 내부 `canvas.js`에서 `new DOMMatrix()`를 전역 스코프에서 즉시 실행. Node.js에는 `DOMMatrix` API가 존재하지 않음. `'use client'` 지시어가 있어도 서버가 모듈 그래프를 평가하는 과정에서 실행됨.

**해결:** Static Import → **Dynamic Import** (`await import('pdfjs-dist')`)로 변경. 타입은 `import type`으로만 가져와 런타임 영향 없이 타입 안전성 유지.

**최적화:** 수 MB에 달하는 무거운 PDF 파싱 라이브러리가 초기 번들(Initial Bundle)에 포함되는 것을 막아 관리자 페이지의 초기 로딩 속도(TTV)를 대폭 개선.

### 4-2. Tailwind CSS 미디어쿼리 우선순위 깨짐

> 상세: `docs/errors/0003-tailwind-css-cascade-order.md`

**문제:** 모노레포 환경에서 `hidden lg:flex` 등 반응형 유틸리티가 작동하지 않음. `display: none`이 미디어쿼리를 덮어씀.

**원인:** 단일 앱 환경과 달리 모노레포 구조에서는 외부 패키지(`@repo/ui/styles.css`)와 메인 앱(`globals.css`)의 CSS가 개별적으로 컴파일되어 로드. 이 과정에서 병합 순서가 꼬이면서 메인 앱의 기본 `.hidden` 클래스가 UI 패키지의 반응형 미디어쿼리 규칙보다 나중에 선언되어 우선순위(CSS Cascade Specificity)를 덮어쓰는 아키텍처 결함 발생.

**해결:** Turborepo 공식 패턴 적용. `layout.tsx`에서 `@repo/ui/styles.css`를 먼저 import한 뒤 `globals.css`를 import하여 로드 순서 보장.

### 4-3. Supabase ILIKE 연산자 타입 불일치

> 상세: `docs/errors/0004-supabase-bulletin-query-errors.md`

**문제:** 주보 검색 시 `published_at` (date 타입) 컬럼에 `ilike` 연산자 적용 → `operator does not exist: date ~~* unknown` 에러.

**원인:** PostgREST는 `::text` 타입 캐스팅을 지원하지 않음. date 타입에 text 전용 연산자(`~~*`) 적용 불가.

**해결:** 텍스트 검색을 제거하고 **연/월 Select 필터 + 범위 쿼리(`gte`, `lt`)** 방식으로 전면 변경. `getCurrentYearMonth()` 유틸리티로 날짜 처리 표준화.

---

## 5. 실행 매뉴얼

### 사전 요구사항

| 도구    | 최소 버전  | 비고                                        |
| :------ | :--------- | :------------------------------------------ |
| Node.js | >= 24.0.0  | 루트 `package.json` engines 기준            |
| pnpm    | >= 10.25.0 | 루트 `packageManager` 기준                  |
| 빌드    | —          | `@repo/ui`, `@repo/database`의 `dist/` 필요 |

### 설치

```bash
# 루트 디렉토리에서 실행
pnpm install

# 내부 패키지 빌드 (최초 1회 필수)
pnpm build
```

### 환경 변수

`apps/admin/.env.local` 파일에 다음 환경 변수를 설정합니다:

| 변수명                          | 필수 | 설명                   |
| :------------------------------ | :--- | :--------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | O    | Supabase 프로젝트 URL  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | O    | Supabase Anonymous Key |

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 개발 서버 실행

```bash
# 루트에서 전체 실행 (web + admin 동시)
pnpm dev

# 또는 admin만 단독 실행
pnpm --filter admin dev
```

개발 서버: [http://localhost:3001](http://localhost:3001)

### 프로덕션 빌드

```bash
# 전체 빌드 (패키지 → 앱 순서 자동 보장)
pnpm build

# admin만 단독 빌드
pnpm --filter admin build

# 프로덕션 서버 실행
pnpm --filter admin start
```

### 배포 (Vercel)

Vercel에서 모노레포 프로젝트로 설정 시:

| 설정             | 값                                            |
| :--------------- | :-------------------------------------------- |
| Root Directory   | `/` (루트)                                    |
| Build Command    | `cd ../.. && pnpm turbo build --filter=admin` |
| Output Directory | `apps/admin/.next`                            |
| Install Command  | `pnpm install`                                |

**Vercel 환경 변수:**

| 변수명                          | 필수 | 설명                      |
| :------------------------------ | :--- | :------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | O    | Supabase 프로젝트 URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | O    | Supabase Anonymous Key    |
| `SENTRY_AUTH_TOKEN`             | O    | Sentry 소스맵 업로드 토큰 |
