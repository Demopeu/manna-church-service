# ADR-0005: 프론트엔드 통합 테스트 파이프라인 구축 (Vitest & Playwright) 및 인증 제어 분리

## 📣 상태

채택됨 (Accepted) - 2026-05-12

## 📋 상황

어드민 페이지(공지사항, 이벤트 등)의 기능 고도화와 FSD(Feature-Sliced Design) 아키텍처 도입으로 인해, 개별 컴포넌트/로직의 검증과 전체 사용자 시나리오(E2E) 검증을 모두 커버할 수 있는 체계적인 테스트 환경이 필요해짐.

### 해결해야 할 페인 포인트

1. **테스트 커버리지 파편화:** 공용 UI 컴포넌트나 순수 유틸리티 함수(e.g., FSD의 `shared`, `entities`)는 가볍고 빠르게 테스트해야 하며, 페이지 단위의 흐름(`app`, `pages`)은 실제 브라우저 환경에서 검증해야 하는 요구사항 충돌.
2. **수동 테스트의 한계:** 배포 전 개발자가 직접 브라우저를 띄워 로그인하고, 폼을 채우고 삭제하는 수동 테스트 반복으로 생산성 저하 및 휴먼 에러 발생.
3. **Next.js App Router 런타임 환경과의 충돌:** 테스트 환경(Node.js)에서 기존 앱 내부의 `@supabase/ssr` 클라이언트를 그대로 사용하면, 요청(Request) 컨텍스트가 존재하지 않아 `cookies() was called outside a request scope` 에러가 발생함.
4. **인증 오버헤드 및 데이터 오염:** E2E 테스트 시나리오마다 매번 로그인 로직이 중복되어 실행 시간이 길어지며, 테스트 종료 후 DB에 더미 데이터가 남는 문제.

## 🔨 결정 (Decisions)

### 1. 테스트 피라미드 전략 도입 (Vitest + Playwright)

목적에 맞게 두 가지 테스트 프레임워크를 결합하여 사용함.

- **Unit / Integration (Vitest + React Testing Library):** FSD 아키텍처의 `entities`, `features` 계층에 존재하는 UI 컴포넌트, 커스텀 훅, 순수 비즈니스 로직을 검증함. ESM 기반의 빠른 실행 속도를 활용해 즉각적인 피드백 루프(TDD)를 구성함.
- **E2E (Playwright):** 다양한 브라우저 환경에서 라우팅, 인증, Supabase DB 통신이 포함된 전체 사용자 시나리오(CRUD)를 검증함.

### 2. 순수 `supabase-js`를 활용한 어드민 클라이언트 분리 (`tests/utils/supabase.ts`)

Next.js의 쿠키 시스템에 의존하지 않는 순수 DB 제어용 클라이언트를 생성함.

- 이 클라이언트는 오직 Playwright의 `beforeEach`와 `afterEach` 훅에서 테스트용 찌꺼기 데이터(e.g., `[E2E_TEST]`)를 확실하게 청소(Teardown)하는 용도로만 사용함.
- **Fail Fast 원칙:** 파일 최상단에서 필수 환경 변수를 검증하여, 설정 오류 시 테스트가 즉각 중단되도록 설계함.

### 3. 인증(Auth) 로직의 의존성 분리 (Storage State 패턴)

각 E2E 테스트(Spec) 파일에서 반복되는 로그인 과정을 제거하고, 한 번 로그인한 세션을 재사용하는 구조를 도입함.

- `tests/auth.setup.ts` 파일(Setup Project)을 생성하여 최초 1회 로그인을 수행함.
- 로그인 성공 후 발급된 쿠키와 세션을 `playwright/.auth/user.json`에 스냅샷으로 저장함.
- 실제 검증을 담당하는 테스트 프로젝트(`chromium` 등)는 `setup` 프로젝트에 의존성(`dependencies`)을 가지며, 저장된 세션(`storageState`)을 주입받아 이미 로그인된 상태에서 테스트를 시작함.

### 4. GitHub Actions CI 연동 및 보안 변수 주입

로컬을 넘어 원격 저장소에 Push/PR이 발생할 때마다 자동으로 검증되도록 파이프라인을 구축함.

- `pnpm build`를 선행하여 최신 렌더링 결과물이 반영된 상태에서 `pnpm start`로 테스트 서버를 구동(`webServer` 설정 활용).
- GitHub Secrets를 통해 관리자 이메일, 패스워드, Supabase 키를 안전하게 주입하여, 코드베이스 내 중요 정보 하드코딩을 원천 차단함.

## 📊 영향 (Consequences)

### 📈 긍정적 영향

- **배포 안정성 극대화:** PR 시점에 FSD 단위별 컴포넌트 동작(Vitest)부터 전체 사용자 흐름(Playwright)까지 2중으로 검증하여 배포 성공률을 100%에 가깝게 끌어올림.
- **테스트 속도 최적화:** 모든 E2E 스펙에서 로그인 단계를 건너뛰고(세션 재사용), 무거운 로직은 E2E가 아닌 Vitest로 이관하여 전체 CI 실행 시간을 단축함.
- **깔끔한 DB 상태 유지:** Service Role 클라이언트를 통한 강제 삭제 로직(`ilike('%[E2E_TEST]%')`)을 통해 테스트 전후의 DB 상태 무결성을 보장함.

### 📉 부정적 영향 및 대응

- **CI 설정 복잡도 및 보일러플레이트 증가:** 두 가지 프레임워크를 동시에 세팅하고 유지보수해야 함.
  - _대응:_ 명확한 폴더 컨벤션(`tests/specs` E2E 전용, 컴포넌트 옆에는 `*.test.tsx` 단위 테스트 전용)을 수립하여 혼란을 방지함.
- **UI 변경 시 테스트 깨짐(Flaky Tests) 위험:** 컴포넌트 마크업이 변경되면 Playwright 로케이터가 실패할 수 있음.
  - _대응:_ CSS 클래스에 의존하지 않고, 사용자 접근성 기준(`getByRole`, `getByText` 등)을 우선적으로 사용하여 UI 변경에 대한 내성을 높임.

## 📝 대안 (Alternatives)

### 1. Cypress 단독 사용

- **기각 사유:** iframe 기반으로 동작하여 멀티 탭/새 창 검증에 제약이 많음. 병렬 테스트 등 고급 기능이 유료 버전(Cypress Cloud)에 묶여 있으며, 전반적인 실행 속도가 Playwright에 비해 느림.

### 2. Jest + React Testing Library 단독 사용 (통합 테스트 한계)

- **기각 사유:** 컴포넌트 렌더링 단위의 테스트에는 매우 훌륭하나, Next.js의 Server Actions, 라우팅, 실제 브라우저와 Supabase DB 간의 통신까지 아우르는 '실제 유저와 100% 동일한 환경'을 검증하기에는 한계가 뚜렷하여 Playwright와 혼용(Vitest로 대체)하기로 결정함.
