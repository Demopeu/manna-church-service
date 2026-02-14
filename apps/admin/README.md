# 만나교회 관리자 CMS (`apps/admin`)

> 기술을 모르는 목사님이 교회 콘텐츠를 관리할 수 있는 원클릭 관리자 시스템.

---

## 1. 개발 환경

| 항목                | 내용                                       |
| :------------------ | :----------------------------------------- |
| **Node.js**         | 루트 기준 >= 25.0.0                        |
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

| 패키지           | 버전      | 역할                                   |
| :--------------- | :-------- | :------------------------------------- |
| `@sentry/nextjs` | 10.36.0   | 에러 추적 (서버/클라이언트/엣지)       |
| `@repo/database` | workspace | Supabase Client + Auth + Types         |
| `@repo/ui`       | workspace | 공통 디자인 시스템 (Shadcn/UI + Radix) |

#### 유틸리티

| 패키지         | 버전    | 역할               |
| :------------- | :------ | :----------------- |
| `date-fns`     | 4.1.0   | 날짜 포맷팅/계산   |
| `lucide-react` | 0.546.0 | 아이콘             |
| `sonner`       | 2.0.7   | Toast 알림         |
| `use-debounce` | 10.1.0  | 검색 입력 디바운스 |

### 기능 개요

관리자 CMS는 교회 콘텐츠의 **CRUD(생성/조회/수정/삭제)** 를 담당합니다.

#### 관리 대상 콘텐츠 (7개 도메인)

| 라우트           | 도메인        | 주요 기능                                       |
| :--------------- | :------------ | :---------------------------------------------- |
| `/`              | 대시보드      | 최근 콘텐츠 현황, 주보 미등록 알림              |
| `/sermons`       | 설교          | YouTube/Instagram URL 등록, 썸네일 자동 추출    |
| `/bulletins`     | 주보          | PDF 업로드 → WebP 자동 변환, 연/월 필터         |
| `/gallery`       | 갤러리        | 다중 이미지 드래그&드롭, 썸네일 선택, 최대 10장 |
| `/events`        | 이벤트        | 교회 행사 등록/관리, 이미지 첨부                |
| `/announcements` | 공지          | 교회 공지사항 등록/관리                         |
| `/servants`      | 섬기는 사람들 | 역할별(담임/협동/구역장) 필터, 공개/비공개 토글 |

---

## 3. 아키텍처

### Clean FSD + CQRS 구조

```
src/
├── app/              # App Layer — 라우팅 전용 (page.tsx, layout.tsx)
│   ├── (admin)/      # 인증 필요 라우트 그룹
│   │   ├── (main)/   #   └── 대시보드 (/)
│   │   ├── sermons/
│   │   ├── bulletins/
│   │   ├── gallery/
│   │   ├── events/
│   │   ├── announcements/
│   │   └── servants/
│   └── login/        # 비인증 라우트
├── widgets/          # Widgets Layer — 페이지 구획별 조합 컴포넌트
│   ├── dashboard/    #   대시보드 카드 (최근 주보/설교/공지/이벤트/갤러리)
│   ├── main-layout/  #   Sidebar + Header + SidebarProvider
│   ├── login-card/   #   로그인 카드
│   └── *-list/       #   각 도메인별 목록 위젯 (DataTable + 검색 + 페이지네이션)
├── features/         # Features Layer — CUD 로직 (Server Actions + 폼)
│   ├── auth/         #   로그인/로그아웃 (Supabase Auth)
│   ├── announcement/ #   공지 CRUD
│   ├── bulletin/     #   주보 CRUD + PDF→WebP 변환
│   ├── event/        #   이벤트 CRUD
│   ├── gallery/      #   갤러리 CRUD + 다중 이미지 관리
│   ├── sermon/       #   설교 CRUD + YouTube ID 추출
│   └── servant/      #   섬기는 사람들 CRUD
├── entities/         # Entities Layer — Read 전용 (쿼리 + 도메인 모델)
│   ├── announcement/ #   model/ + api/ (dto, mapper, queries)
│   ├── bulletin/
│   ├── event/
│   ├── gallery/
│   ├── sermon/
│   ├── servant/
│   └── user/         #   현재 로그인 사용자 정보
└── shared/           # Shared Layer — 순수 유틸리티 & UI
    ├── api/          #   tryCatchAction, tryCatchVoid (에러 래퍼)
    ├── config/       #   ADMIN_ROUTES (사이드바 네비게이션 설정)
    ├── lib/          #   imageConverter, pdfToWebpConverter, requireAuth, useDialog 등
    ├── model/        #   ActionState 타입 정의
    └── ui/           #   base/ (Shadcn 래퍼), components/ (DataTable, Pagination 등)
```

### 의존성 규칙

```
App → Widgets → Features → Entities → Shared → @repo/ui
```

상위 레이어는 하위 레이어를 import 할 수 있지만, **역방향은 금지**입니다.

### 렌더링 전략

- **`force-dynamic`**: 모든 인증된 라우트에 적용. 관리자 페이지는 항상 최신 데이터를 표시해야 하므로 캐싱하지 않음.
- **Server Actions**: 모든 쓰기 작업은 `'use server'` Server Actions으로 처리. `revalidatePath()`로 캐시 무효화.
- **`requireAuth()` 가드**: 모든 Server Action 진입부에서 세션 검증. 미인증 시 에러 반환 또는 throw.

### 인증 흐름

```
[브라우저 요청]
      │
      ▼
[Middleware (proxy.ts)] ── 미인증 → /login 리다이렉트
      │                   ── 인증됨 + /login → / 리다이렉트
      ▼
[(admin) Layout] ── Sidebar + Header 렌더링
      │
      ▼
[Server Action 호출] ── requireAuth() 가드 → Supabase Auth 세션 검증
```

### 핵심 패턴

#### 1. 클라이언트 이미지 압축

모든 이미지 업로드 시 서버 전송 **전에** 클라이언트에서 WebP 변환 + 압축을 수행합니다.

```
[원본 이미지] → browser-image-compression → [WebP, max 100KB, max 1920px]
                                              → FormData에 설정
                                              → Server Action으로 전송
```

#### 2. PDF → WebP 변환 (주보)

`pdfjs-dist`를 동적 import하여 브라우저에서 PDF를 페이지별 WebP 이미지로 변환합니다.

```
[PDF 파일] → pdfjs-dist (Dynamic Import)
           → Canvas 렌더링 (페이지별)
           → canvas.toBlob('image/webp')
           → Supabase Storage 업로드
```

#### 3. Server Action 에러 처리

```
[Server Action]
  → requireAuth()     // 인증 검증
  → schema.safeParse() // Zod 유효성 검증
  → tryCatchAction()  // try-catch + Sentry 에러 캡처
  → ActionState 반환  // { success, message, fieldErrors? }
```

---

## 4. 트러블슈팅

### 4-1. `pdfjs-dist` DOMMatrix SSR 에러

> 상세: `docs/errors/0001-dommatrix-defined.md`

**문제:** `pdfjs-dist`를 Top-level Import하면 Node.js(SSR) 환경에서 `ReferenceError: DOMMatrix is not defined` 발생.

**원인:** `pdfjs-dist` 내부 `canvas.js`에서 `new DOMMatrix()`를 전역 스코프에서 즉시 실행. Node.js에는 `DOMMatrix` API가 존재하지 않음. `'use client'` 지시어가 있어도 서버가 모듈 그래프를 평가하는 과정에서 실행됨.

**해결:** Static Import → **Dynamic Import** (`await import('pdfjs-dist')`)로 변경. 타입은 `import type`으로만 가져와 런타임 영향 없이 타입 안전성 유지.

### 4-2. Tailwind CSS 미디어쿼리 우선순위 깨짐

> 상세: `docs/errors/0003-tailwind-css-cascade-order.md`

**문제:** 모노레포 환경에서 `hidden lg:flex` 등 반응형 유틸리티가 작동하지 않음. `display: none`이 미디어쿼리를 덮어씀.

**원인:** `@repo/ui/styles.css`와 `globals.css` 모두에서 Tailwind를 import하면서 `.hidden` 규칙이 미디어쿼리보다 나중에 재선언됨 (CSS Cascade Order 문제).

**해결:** Turborepo 공식 패턴 적용. `layout.tsx`에서 `@repo/ui/styles.css`를 먼저 import한 뒤 `globals.css`를 import하여 로드 순서 보장.

### 4-3. Supabase ILIKE 연산자 타입 불일치

> 상세: `docs/errors/0004-supabase-bulletin-query-errors.md`

**문제:** 주보 검색 시 `published_at` (date 타입) 컬럼에 `ilike` 연산자 적용 → `operator does not exist: date ~~* unknown` 에러.

**원인:** PostgREST는 `::text` 타입 캐스팅을 지원하지 않음. date 타입에 text 전용 연산자(`~~*`) 적용 불가.

**해결:** 텍스트 검색을 제거하고 **연/월 Select 필터 + 범위 쿼리(`gte`, `lt`)** 방식으로 전면 변경. `getCurrentYearMonth()` 유틸리티로 날짜 처리 표준화.

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

`apps/admin/.env.local` 파일에 다음 환경 변수를 설정합니다:

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
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

1. **Root Directory:** `/` (루트)
2. **Build Command:** `cd ../.. && pnpm turbo build --filter=admin`
3. **Output Directory:** `apps/admin/.next`
4. **Install Command:** `pnpm install`

환경 변수는 Vercel 프로젝트 설정에서 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SENTRY_AUTH_TOKEN` 등을 등록합니다.
