# Manna Church Service Platform

> 디지털 소외 계층인 고령의 성도들이 **쉽고 빠르게** 교회 소식에 접근할 수 있게 하고, 기술을 모르는 목사님이 **복잡함 없이** 운영할 수 있는 시스템.

---

## 1. 프로젝트 개요

| 항목                 | 내용                                                                               |
| :------------------- | :--------------------------------------------------------------------------------- |
| **클라이언트**       | 만나교회 (부산광역시 사하구 다대동)                                                |
| **개발 기간**        | `2025.01.05 ~ 2025.02.13`                                                          |
| **배포 URL (Web)**   | [https://www.mannachurch.or.kr](https://www.mannachurch.or.kr)                     |
| **배포 URL (Admin)** | [https://manna-church-service.vercel.app](https://manna-church-service.vercel.app) |

### 프로젝트 설명

만나교회의 디지털 전환을 위한 **모노레포 기반 풀스택 웹 서비스**입니다.
60대 이상 고령 성도를 위한 **접근성 사용자 웹**과, 비전문가 목사님을 위한 **관리자 CMS** 두 개의 앱으로 구성됩니다.

| 앱                          | 설명                                                                                     |
| :-------------------------- | :--------------------------------------------------------------------------------------- |
| **사용자 웹** `apps/web`    | Next.js 16 `'use cache'` + SSG 기반 정적 최적화, PWA 오프라인 지원, 모바일 퍼스트 반응형 |
| **관리자 CMS** `apps/admin` | Server Actions + React Hook Form + Zod 유효성 검증, 이미지 자동 압축 · PDF→WebP 변환     |

### 스크린샷

|                          사용자 웹                          |                           관리자 CMS                           |
| :---------------------------------------------------------: | :------------------------------------------------------------: |
|<img width="400" height="600" alt="만나교회 홈페이지" src="https://github.com/user-attachments/assets/9a8f7fd0-e7a3-4d9e-9da9-994f4e3c83b5" />|<img width="400" height="600" alt="관리자 대쉬보드" src="https://github.com/user-attachments/assets/ecb61613-ee58-421e-8c8d-f777ea948947" /> |

> **각 앱의 상세 화면, 기능, 트러블슈팅은 개별 README를 참조해 주세요.**
>
> - [apps/web README](./apps/web/README.md)
> - [apps/admin README](./apps/admin/README.md)

### 아키텍처

#### 모노레포 아키텍처

<img width="2752" height="1536" alt="모노레포 아키텍쳐" src="https://github.com/user-attachments/assets/6420add7-a6e8-4d78-b412-9ed857a65240" />


#### 모노레포 의존성 다이어그램

![모노레포 의존성 다이어그램](docs/screenshots/dependencies.png)

---

## 2. 기술 스택

### Core

| 분류                | 기술       | 버전           |
| :------------------ | :--------- | :------------- |
| **Runtime**         | Node.js    | >= 24.0.0      |
| **Package Manager** | pnpm       | 10.25.0        |
| **Monorepo**        | Turborepo  | 2.7.2          |
| **Framework**       | Next.js    | 16.1.1         |
| **Library**         | React      | 19.2.3         |
| **Language**        | TypeScript | 5.9.3 (Strict) |

### Infrastructure

| 분류           | 기술                              | 용도                           |
| :------------- | :-------------------------------- | :----------------------------- |
| **BaaS**       | Supabase                          | PostgreSQL, Auth, Storage      |
| **Deployment** | Vercel                            | Production 호스팅 (Edge)       |
| **Monitoring** | Sentry (`@sentry/nextjs` 10.36.0) | 에러 추적 (Server/Client/Edge) |
| **Analytics**  | Vercel Analytics + Speed Insights | RUM 성능 지표 수집             |

### Styling & UI

| 분류          | 기술                 | 버전    |
| :------------ | :------------------- | :------ |
| **CSS**       | Tailwind CSS         | v4.1.18 |
| **Component** | Shadcn/UI (Radix UI) | —       |
| **Icons**     | Lucide React         | 0.546.0 |

### 루트 Dev Dependencies (코드 품질 도구)

| 패키지                                  | 버전   | 역할                                  |
| :-------------------------------------- | :----- | :------------------------------------ |
| `turbo`                                 | 2.7.2  | 모노레포 빌드 오케스트레이터          |
| `typescript`                            | 5.9.3  | 타입 시스템                           |
| `prettier`                              | 3.7.4  | 코드 포매터                           |
| `@trivago/prettier-plugin-sort-imports` | 6.0.2  | FSD 레이어 순서 기반 import 자동 정렬 |
| `prettier-plugin-tailwindcss`           | 0.7.2  | Tailwind 클래스 자동 정렬             |
| `husky`                                 | 9.1.7  | Git hooks 자동화                      |
| `@commitlint/cli`                       | 20.3.0 | 커밋 메시지 린트                      |
| `@commitlint/config-conventional`       | 20.3.0 | Conventional Commits 규칙             |
| `cross-env`                             | 10.1.0 | 크로스 플랫폼 환경 변수               |

---

## 3. 개발 방법론 및 아키텍처

### 3-1. AI-Assisted Development: 프롬프트 엔지니어링과 컨텍스트 통제

단순히 AI에게 코드를 짜달라고 요청하는 것을 넘어, 프로젝트의 품질을 유지하기 위한 시스템을 구축했습니다.

- **Rule 기반 AI 통제 (`.windsurf/`):** 프로젝트 루트에 `.windsurf` 설정(Rules + Skills)을 구성하고, 그 안에 `vercel-react-best-practices` 및 Next.js 16/React 19 최신 권장 사항을 주입했습니다. AI가 구버전 코드를 생성하거나 안티 패턴을 작성하는 것을 방지하고, 항상 프로젝트 컨벤션에 맞는 코드를 출력하도록 강제합니다.
- **Living Specification (`project_spec.md`):** 요구사항, DB 스키마, 컴포넌트 구조를 담은 명세서를 작성하고 개발 과정 내내 지속적으로 업데이트했습니다. AI에게 새로운 기능을 요청할 때마다 이 명세서를 최우선 컨텍스트로 읽게 하여, 전체 시스템 아키텍처에서 벗어나지 않는 코드를 유도했습니다.

### 3-2. 아키텍처: CQRS를 접목한 Custom Clean-FSD

기존 FSD(Feature-Sliced Design)가 가진 "비즈니스 로직을 Entities와 Features 중 어디에 두어야 하는가?"에 대한 모호함을 해결하고, Next.js App Router와의 결합도를 높이기 위해 **CQRS(명령/조회 책임 분리) 개념을 도입한 Custom Clean-FSD** 아키텍처를 설계했습니다.

- **`app` Layer (Pages 통합):** Next.js App Router의 특성에 맞춰 FSD의 `app`과 `pages` 레이어를 하나로 통합하여 라우팅과 페이지 엔트리를 담당합니다.
- **`widgets` Layer:** 여러 Feature와 Entity를 조합하여 독립적으로 동작하는 복합 UI 블록을 구성합니다.
- **`features` Layer (CUD 담당 - Command):**
  - 데이터의 **생성(Create), 수정(Update), 삭제(Delete)** 와 관련된 비즈니스 로직과 UI만을 격리했습니다.
  - 주로 Form 제출, Server Actions 호출, 사용자 상호작용에 의한 Mutation 로직이 이곳에 응집됩니다.
- **`entities` Layer (Read 담당 - Query):**
  - 데이터의 **조회(Read)** 와 도메인 타입 등 읽기 전용 로직만을 담당합니다.
  - Next.js의 Server Component 데이터 페칭 및 캐싱 로직이 위치하여, 상태 변경 없이 순수하게 도메인 데이터를 렌더링하는 데 집중합니다.
- **`shared` Layer:** 프로젝트 전반에서 사용되는 순수 UI 컴포넌트(Design System)와 유틸리티 함수를 배치했습니다.

**도입 효과:**
Read 로직(Entities)과 Mutation 로직(Features)의 경계가 명확해지면서 컴포넌트의 책임이 단일화되었고, AI 도구(Windsurf)에게 코드를 위임할 때도 "Feature 레이어에 CUD 로직을 작성해"라는 명확한 프롬프팅이 가능해져 일관된 코드 품질을 유지할 수 있었습니다.

## 4. 모노레포 구조

```
manna-church-service/
├── apps/
│   ├── web/                      # 사용자 웹 (Next.js 16, 'use cache' + SSG + PWA)
│   └── admin/                    # 관리자 CMS (Next.js 16, force-dynamic + Server Actions)
├── packages/
│   ├── ui/                       # @repo/ui — 공통 디자인 시스템 (Shadcn/UI + Radix)
│   ├── database/                 # @repo/database — Supabase Types + Client + Auth + Middleware
│   ├── tailwind-config/          # @repo/tailwind-config — Tailwind v4 공통 스타일 + PostCSS
│   ├── typescript-config/        # @repo/typescript-config — base / nextjs / react-library
│   └── eslint-config/            # @repo/eslint-config — ESLint Flat Config (base / next-js / react-internal)
├── docs/
│   ├── adr/                      # Architecture Decision Records (5건)
│   ├── errors/                   # 트러블슈팅 상세 문서 (5건)
│   └── analysis/                 # 기술 분석 문서
├── .github/
│   └── ISSUE_TEMPLATE/           # GitHub Issue 템플릿 (4종)
├── .windsurf/                    # AI 통제 Rules + Skills (52개 파일)
├── project_spec.md               # Living Specification (AI 컨텍스트 + 아키텍처 명세)
├── turbo.json                    # Turborepo 태스크 파이프라인
├── pnpm-workspace.yaml           # pnpm 워크스페이스 정의
├── commitlint.config.js          # Conventional Commits 규칙
├── .prettierrc                   # Prettier + FSD import 정렬 + Tailwind 클래스 정렬
└── package.json                  # 루트 스크립트 + 코드 품질 devDependencies
```

### 4-1. 내부 패키지 상세

#### `@repo/database`

Supabase 인프라 접근 계층. 앱이 Supabase와 통신하기 위한 모든 클라이언트 팩토리와 인증 헬퍼를 제공합니다.

| Export Path    | 설명                                                                 |
| :------------- | :------------------------------------------------------------------- |
| `./client`     | `createClient()` (Server Component용), `createPublicClient()` (공용) |
| `./auth`       | `verifySession()` — 세션 검증 헬퍼                                   |
| `./middleware` | `createMiddlewareClient()` — Next.js Middleware 전용 클라이언트      |
| `./types`      | Supabase CLI로 자동 생성된 `Database` 타입 (12,600+ lines)           |

#### `@repo/ui`

Shadcn/UI + Radix UI 기반 공통 디자인 시스템. `tsc` + `tsc-alias`로 사전 빌드하며, Tailwind CSS도 별도 빌드합니다.

| Export Path    | 설명                                                      |
| :------------- | :-------------------------------------------------------- |
| `./styles.css` | 컴파일된 Tailwind CSS (앱 `layout.tsx`에서 최우선 import) |
| `./shadcn`     | 21개 Shadcn/UI 컴포넌트 (Button, Card, Dialog, Table 등)  |
| `./components` | 커스텀 컴포넌트 (AspectRatio 등)                          |
| `./lib`        | 유틸리티 (`cn()` 등)                                      |
| `./hooks`      | 공통 훅 (`useMobile` 등)                                  |

#### `@repo/typescript-config`

| 설정 파일            | 적용 대상                    |
| :------------------- | :--------------------------- |
| `base.json`          | 모든 패키지 (strict, ES2022) |
| `nextjs.json`        | `apps/web`, `apps/admin`     |
| `react-library.json` | `@repo/ui`                   |

#### `@repo/eslint-config`

ESLint Flat Config 기반. 3가지 프리셋을 제공합니다.

| 프리셋           | 적용 대상                |
| :--------------- | :----------------------- |
| `base`           | 모든 패키지              |
| `next-js`        | `apps/web`, `apps/admin` |
| `react-internal` | `@repo/ui`               |

#### `@repo/tailwind-config`

Tailwind CSS v4 공통 디자인 토큰과 PostCSS 설정을 공유합니다.

### 4-2. 내부 패키지 컴파일 전략: JIT → `dist` 빌드

모노레포의 내부 패키지(`@repo/ui`, `@repo/database`)는 초기에 **JIT(Just-In-Time) Transpilation** 방식을 사용했으나, 이후 **사전 빌드(`dist/`) 전략**으로 전환했습니다.

#### 문제: JIT 방식의 한계

```
[앱 빌드 시작] → [내부 패키지 소스를 매번 트랜스파일] → 빌드 시간 증가, 캐시 무효화 빈번
```

- Next.js의 `transpilePackages`를 통한 소스 직접 컴파일은 **소규모에서는 편리**하지만, 패키지가 커질수록 빌드 시간이 기하급수적으로 증가
- `@repo/ui`에 21개 이상의 Radix 컴포넌트가 포함되면서 병목 현상 발생

#### 해결: 사전 빌드 + `exports` 필드

```
[pnpm build] → [@repo/ui: tsc + tailwindcss → dist/] → [@repo/database: tsc → dist/]
                              ↓                                     ↓
                     [앱에서 dist/ import] ──────── 빌드 시간 대폭 단축
```

**효과:**

- Turborepo의 `dependsOn: ["^build"]`로 패키지 빌드 순서 자동 보장
- `dist/` 출력물이 변경되지 않으면 Turborepo 캐시 히트 → **앱 재빌드 스킵**
- 타입 안전성 유지: `.d.ts` 파일을 통해 타입 추론 완전 지원

### 설정 공유 전략

| 패키지                    | 역할                                                     | 공유 대상                            |
| :------------------------ | :------------------------------------------------------- | :----------------------------------- |
| `@repo/typescript-config` | `base.json`, `nextjs.json`, `react-library.json`         | 모든 앱/패키지                       |
| `@repo/eslint-config`     | ESLint Flat Config (`base`, `next-js`, `react-internal`) | 모든 앱/패키지                       |
| `@repo/tailwind-config`   | Tailwind v4 공통 디자인 토큰 + PostCSS                   | `apps/web`, `apps/admin`, `@repo/ui` |
| `@repo/database`          | Supabase Generated Types + Client Factory                | `apps/web`, `apps/admin`             |

---

## 5. 빌드 안정성 & Git Hooks

커밋과 푸시 과정에서 **자동 품질 검증 파이프라인**이 실행됩니다.

### Git Hook 체인

| Hook         | 실행 시점           | 실행 내용                                                  |
| :----------- | :------------------ | :--------------------------------------------------------- |
| `pre-commit` | `git commit` 시     | `turbo lint check-types` (전체 앱/패키지 린트 + 타입 체크) |
| `commit-msg` | 커밋 메시지 작성 후 | `commitlint` (Conventional Commits 규칙 검증)              |
| `pre-push`   | `git push` 시       | `cross-env ANALYZE=true pnpm run build` (전체 빌드 검증)   |

**효과:**

- **원천 차단**: 린트/타입 에러가 있는 코드가 원격 저장소에 Push되는 것을 사전에 방지합니다.
- **Turborepo 캐시 활용 (Fast pre-push)**: pre-push 단계에서 전체 빌드를 검증하지만, Turborepo 캐싱 메커니즘 덕분에 변경사항이 없는 패키지는 빌드를 건너뛰어(Cache Hit) 개발자의 푸시 대기 시간을 최소화합니다.

---

## 6. 컨벤션

### Naming Convention

| 대상                         | 규칙            | 예시                               |
| :--------------------------- | :-------------- | :--------------------------------- |
| React 컴포넌트 파일 (`.tsx`) | **PascalCase**  | `LoginForm.tsx`, `HeroBanner.tsx`  |
| 로직/스키마/유틸리티 (`.ts`) | **kebab-case**  | `login-schema.ts`, `use-auth.ts`   |
| 폴더명                       | **kebab-case**  | `hero-carousel/`, `bulletin-list/` |
| 변수/함수                    | **camelCase**   | `formatKoreanDate`, `requireAuth`  |
| 상수                         | **UPPER_SNAKE** | `ADMIN_ROUTES`, `BASE_URL`         |

#### 레이어별 적용 예시 (FSD 구조)

```text
src/features/auth/
├── model/
│   └── login-schema.ts   # (Logic) kebab-case
└── ui/
    └── LoginForm.tsx     # (UI) PascalCase
```

### Git Workflow & Convention

이 프로젝트는 빠르고 효율적인 개발을 위해 **GitHub Flow** 전략을 따릅니다.
Main 브랜치를 항상 배포 가능한 상태로 유지하며, 기능 단위로 브랜치를 관리합니다.

#### Branch Strategy (GitHub Flow)

- **main**: 제품으로 출시 가능한 소스 코드를 모아두는 기준 브랜치입니다.
- **feature**: 기능을 개발하는 브랜치입니다. 이슈 단위로 생성하며 작업 후 `main`에 병합(Squash & Merge)됩니다.

#### Branch Naming

브랜치명은 `타입/기능명-#이슈번호` 형식을 따릅니다. 이슈 추적을 위해 이슈 번호를 반드시 포함합니다.

- 예시: `feature/login-ui-#1`
- 예시: `fix/login-error-#2`

#### Commit Message Convention

협업과 유지보수를 위해 **Conventional Commits** 규칙을 준수합니다. (`commitlint` 자동 검증)

| 타입       | 설명                                           |
| :--------- | :--------------------------------------------- |
| `init`     | 프로젝트 초기 설정                             |
| `feat`     | 새로운 기능 추가                               |
| `fix`      | 버그 수정                                      |
| `design`   | CSS 등 사용자 UI 디자인 변경                   |
| `refactor` | 코드 리팩토링 (기능 변경 없음)                 |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음) |
| `docs`     | 문서 수정 (README 등)                          |
| `chore`    | 빌드 업무, 패키지 매니저 설정 등               |
| `test`     | 테스트 코드                                    |
| `wip`      | 작업 중 (Work in Progress)                     |

**작성 예시:**

```text
feat: 로그인 유효성 검사 로직 구현
design: 메인 페이지 배너 스타일 수정
```

#### Work Process (Issue Driven Development)

모든 작업은 이슈 생성부터 시작됩니다.

1. **Issue 생성**: 작업할 내용을 GitHub Issue로 등록합니다.
2. **Branch 생성**: `main` 브랜치에서 새로운 기능 브랜치를 생성합니다. (`git checkout -b feature/name-#1`)
3. **Code & Commit**: 작업을 진행하고 컨벤션에 맞춰 커밋합니다.
4. **Pull Request**: 작업이 완료되면 PR을 생성합니다. 내용에 `Closes #이슈번호`를 기재하여 이슈를 자동으로 종료합니다.
5. **Merge**: 코드 리뷰(Self-Review) 후 `main` 브랜치로 병합합니다.

---

## 7. 트러블슈팅

### 내부 패키지 JIT vs. Build 전략 전환

**문제:**
모노레포 초기에 `@repo/ui`, `@repo/database` 등 내부 패키지를 별도의 사전 빌드 과정 없이 JIT(소스 직접 import) 방식으로 사용했습니다. Next.js의 `transpilePackages` 옵션을 통해 앱 빌드 시 내부 패키지를 함께 트랜스파일하는 구조였습니다.

**증상 및 한계:**

- **Turborepo 캐시 히트 실패 및 빌드 병목:** 앱과 패키지가 하나의 빌드 파이프라인으로 묶이면서 내부 패키지가 독립적으로 캐싱되지 않았고, `@repo/ui`에 컴포넌트가 추가될수록 앱의 전체 빌드 시간이 기하급수적으로 증가했습니다.
- **경로 꼬임 및 강결합(Tight Coupling) 발생:** 내부 패키지의 CSS 등을 절대 경로로 가져올 때 간헐적인 앱 빌드 에러가 발생했습니다. 이를 회피하기 위해 `../../packages/ui/...` 와 같은 상대 경로를 사용해야 했는데, 이는 앱이 내부 패키지의 물리적 위치에 직접 의존하게 만들어 모노레포 패키지 간의 독립성을 심각하게 해치는 아키텍처 결함이라고 판단했습니다.

**해결 (사전 빌드 전략 도입):**

- **`tsc` 빌드 파이프라인 분리:** 모든 내부 패키지에 `tsc` 사전 빌드 스크립트를 추가하여 `dist/` 디렉토리로 출력물을 생성하도록 변경했습니다.
- **`exports` 필드 설정:** `package.json`의 진입점을 소스 코드가 아닌 `dist/` 내의 컴파일된 JS/DTS 및 CSS 파일로 명시했습니다.
- **빌드 오케스트레이션:** `turbo.json`에 `"dependsOn": ["^build"]` 설정을 추가하여, 패키지가 선행 빌드된 후 앱이 빌드되도록 순서를 강력하게 보장했습니다.

**효과:**

- **의존성 분리 및 독립성 확보:** 억지스러운 상대 경로를 제거하고 패키지 본연의 방식대로 깔끔하게 import 할 수 있게 되어, 모노레포 도입 목적에 맞는 완벽한 **느슨한 결합(Loose Coupling)**을 달성했습니다.
- **캐시 효율 극대화:** `dist/` 출력물이 변경되지 않으면 Turborepo가 내부 패키지 재빌드를 완전히 스킵(Cache Hit)하므로, 앱 재빌드 시간이 대폭 단축되었습니다.

> 앱별 상세 트러블슈팅: [apps/web](./apps/web/README.md#5-트러블슈팅) · [apps/admin](./apps/admin/README.md#4-트러블슈팅)

---

## 8. 실행 방법

### 사전 요구사항

| 도구    | 최소 버전  |
| :------ | :--------- |
| Node.js | >= 24.0.0  |
| pnpm    | >= 10.25.0 |

### 환경 변수

각 앱의 `.env.local` 파일에 다음 환경 변수를 설정합니다.

#### `apps/web/.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID="your-naver-map-client-id"
```

#### `apps/admin/.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

#### 프로덕션 전용 (Vercel 환경 변수)

```bash
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

### 설치 및 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 내부 패키지 빌드 (최초 1회 필수 — @repo/ui, @repo/database)
pnpm build

# 3. 개발 서버 실행 (web: localhost:3000, admin: localhost:3001)
pnpm dev

# 4. 단일 앱만 실행
pnpm --filter web dev      # 사용자 웹만
pnpm --filter admin dev    # 관리자 CMS만
```

### Turbo 태스크

| 명령어                     | 설명                                     |
| :------------------------- | :--------------------------------------- |
| `pnpm dev`                 | 모든 앱/패키지 개발 서버 동시 실행       |
| `pnpm build`               | 전체 빌드 (패키지 → 앱 순서 자동 보장)   |
| `pnpm lint`                | 전체 ESLint 실행                         |
| `pnpm check-types`         | 전체 TypeScript 타입 체크                |
| `pnpm check-before-commit` | 린트 + 타입 체크 (커밋 전 검증)          |
| `pnpm test`                | Playwright 테스트 실행                   |
| `pnpm clean`               | `dist/`, `.next/`, `.turbo/` 캐시 정리   |
| `pnpm format`              | Prettier 코드 포매팅 (`ts`, `tsx`, `md`) |
| `pnpm format`              | Prettier 코드 포매팅 (`ts`, `tsx`, `md`) |
