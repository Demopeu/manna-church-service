# ADR-0001: Tailwind CSS v4 모노레포 패키지 빌드 전략

## 📣 상태

채택됨 (Accepted) - 2026-01-05

## 📋 상황

이전 프로젝트에서는 `apps` 레벨에서 `packages/ui`의 소스 코드를 직접 스캔(`@source`)하여 CSS를 생성하는 방식을 사용했음. 하지만 Node 25 도입과 함께 모듈 해석(Module Resolution)이 엄격해지면서 기존 구조가 한계에 봉착함.

### 문제의 핵심

1.  **의존성 역전 및 결합도 증가**
    - `apps/web`이 `packages/ui`의 내부 폴더 구조(`src/**/*`)를 상세히 알고 있어야 함.
    - UI 패키지의 폴더 구조를 리팩토링하면 앱의 Tailwind 설정이 깨지는 문제 발생.

2.  **Alias 경로 파괴 (Module not found)**
    - `packages/ui`를 빌드(`tsc`)하여 `dist`로 내보낼 때, 코드 내의 `@/lib/utils`와 같은 별칭(Alias)이 상대 경로로 변환되지 않음.
    - 이로 인해 앱에서 실행 시 해당 모듈을 찾을 수 없는 에러 발생.

3.  **불명확한 모듈 경계**
    - `import { Button } from "@repo/ui"` 형태는 트리쉐이킹에 불리함.
    - Hook인지, 유틸리티인지, 컴포넌트인지 출처가 직관적이지 않음.

### 변경 전 흐름

> **Apps(Tailwind)** ➡️ 스캔(Scan) ➡️ **UI Source(TypeScript)**
> _(앱이 UI 소스 내부를 직접 뒤져서 해석함)_

### 변경 후 흐름

> **UI Package** ➡️ 빌드(Build) ➡️ **dist(CSS/JS)** ⬅️ **Apps(Import)**
> _(UI가 완성된 제품을 납품하고, 앱은 가져다 쓰기만 함)_

## ✋ 나의 생각

- **라이브러리는 독립적이어야 한다**: `packages/ui`는 소비하는 쪽(`apps`)이 Next.js든 Vite든 상관없이, 이미 완성된 CSS와 JS를 제공해야 한다.
- **Tailwind v4의 CLI 기능 활용**: 앱의 빌드 파이프라인에 의존하지 않고, 패키지 스스로 CSS를 구울 수 있는 `tailwindcss -i ... -o ...` 기능을 활용해야 한다.
- **경로 지옥 해결**: `../../lib/utils`처럼 깊은 상대 경로를 수동으로 관리하는 것은 개발 경험(DX)을 심각하게 저해한다. 이를 자동화할 도구가 필수적이다.
- **구조화된 내보내기**: `shadcn`, `hooks`, `lib` 등 용도별로 진입점을 나누는 것(Subpath Exports)이 현대적인 패키지 관리 표준이다.

### 기술적 제약 사항

- `tsc(TypeScript Compiler)`는 기본적으로 path alias(`@/*`)를 `Resolve`해주지 않음.
- Next.js의 `transpilePackages`만으로는 빌드된 결과물(dist) 내부의 alias 문제를 해결할 수 없음.

### 기술적 제약 사항

- `tsc`(TypeScript Compiler)는 기본적으로 path alias(`@/*`)를 빌드 결과물에서 상대 경로로 변환(`Resolve`)해주지 않음.
- Next.js의 `transpilePackages` 옵션만으로는 빌드된 결과물(`dist`) 내부의 alias 경로 문제를 해결할 수 없음.

## 🔨 결정

**Build Artifact(빌드 결과물) 배포 및 tsc-alias 도입**

### 1. UI 패키지 자체 빌드 (CSS + JS)

앱이 스캔하는 대신, UI 패키지가 스스로 빌드하여 `dist` 폴더에 결과물을 생성한다.

```json
// packages/ui/package.json
"scripts": {
  "build:styles": "tailwindcss -i ./src/styles.css -o ./dist/index.css",
  "build:components": "tsc && tsc-alias"
}
```

### 2. tsc-alias를 이용한 경로 치환

빌드 시점에 별칭 경로(@/)를 상대 경로(../../)로 자동 변환하여 dist의 이식성을 확보한다.

- Source: import { cn } from "@/lib/utils"
- Dist: const utils_1 = require("../../lib/utils")

### 3. Subpath Exports 적용

패키지 진입점을 명확히 분리하여 사용성을 개선하고 트리쉐이킹 효율을 높인다.

```json
"exports": {
  "./styles.css": "./dist/index.css",
  "./shadcn": { "default": "./dist/shadcn/index.js" },
  "./hooks": { "default": "./dist/hooks/index.js" },
  "./lib": { "default": "./dist/lib/index.js" }
}
```

### 4. 앱(Apps)에서의 단순화된 소비

복잡한 @source 설정 없이, 빌드된 CSS만 import하여 사용한다.

```css
/* apps/web/src/app/globals.css */
@import '@repo/ui/styles.css';
```

## 📊 영향

### 📈 긍정적 영향

- **완벽한 캡슐화 (Encapsulation)**
  - 앱(`apps/web`)은 UI 패키지의 내부 폴더 구조(`src/components/...`)를 전혀 알 필요가 없음.
  - UI 패키지 내부를 대대적으로 리팩토링해도 앱의 Tailwind 설정이 깨지지 않음.

- **일관된 스타일 보장 (Consistency)**
  - UI 패키지에서 빌드 시점에 확정된 CSS(`dist/index.css`)를 사용하므로, 앱마다 `tailwind.config` 설정 차이로 인해 스타일이 다르게 보이는 문제를 원천 차단함.

- **개발 생산성 향상 (DX)**
  - `tsc-alias`가 빌드 시점에 경로를 자동으로 수정해주므로, `shadcn` CLI로 컴포넌트를 추가할 때마다 import 경로(`@/lib/utils`)를 수동으로 고칠 필요가 없음.
  - 개발자는 로직 구현에만 집중 가능.

- **명시적 Import와 트리쉐이킹**
  - `import { Button } from "@repo/ui/shadcn"` 처럼 출처가 명확해짐.
  - 불필요한 모듈(예: 쓰지 않는 hook)이 번들에 포함되는 것을 방지하는 데 유리함.

### 📉 부정적 영향

- **빌드 프로세스 의존성**
  - UI 패키지의 코드를 수정하면 반드시 빌드(또는 Watch 모드)가 선행되어야 앱에 반영됨. (즉시 반영되지 않음)
  - 초기 세팅(`concurrently`, `tsc-alias` 등) 복잡도가 기존 `@source` 방식보다 높음.

- **디버깅 난이도**
  - 앱에서 에러가 발생했을 때, 스택 트레이스가 소스 코드(`src`)가 아닌 빌드된 코드(`dist`)를 가리킬 수 있음.
  - 이를 완화하기 위해 `declarationMap` 및 Sourcemap 설정이 필수적임.

## 📝 고려한 대안

### 1. **기존 방식 유지 (@source 스캔)**

```css
@source '../../../packages/ui/src/**/*.tsx';
```

- 장점: 별도의 빌드 스텝 없이 소스 수정 즉시 반영.
- 단점: 패키지의 독립성을 해침. 앱마다 Tailwind 설정을 반복해야 하며, UI 패키지 의존성(플러그인)을 앱에도 설치해야 하는 누수 발생.

### 2. **수동 상대 경로 사용 (`../../`)**

`tsc-alias` 같은 도구 없이 개발자가 직접 `import { cn } from "../../lib/utils"` 형태로 작성하는 방식.

- **장점**:
  - `tsc-alias` 등 외부 라이브러리에 대한 의존성이 없음.
  - 빌드 파이프라인이 단순해짐.

- **단점**:
  - `shadcn` CLI로 컴포넌트를 추가할 때마다 생성된 코드의 경로(`@/lib/utils`)를 일일이 수동으로 수정해야 함 (Human Error 발생 가능성 높음).
  - 폴더 구조를 변경하거나 파일을 이동할 때마다 상대 경로 지옥(Dependency Hell)을 맛보게 됨.
  - 개발자 경험(DX)이 극도로 저하됨.

### 3. **Bundler (Vite/Rollup) 사용**

`tsc` 대신 Vite 라이브러리 모드나 Rollup을 사용하여 패키지를 번들링하는 방식.

- **장점**:
  - Alias 처리, 이미지 로딩, 플러그인 생태계 등 강력한 기능을 제공함.
  - 하나의 파일로 합쳐주는 등 배포 최적화가 가능함.

- **단점**:
  - 단순한 내부 UI 컴포넌트 라이브러리(Internal Package)를 빌드하기에는 설정이 과하고 무거움 (Over-engineering).
  - Next.js의 Server Components와 호환되도록 설정하려면 추가적인 복잡도가 발생함 (`use client` 지시어 처리 등).

## 📚 참고자료

- [Turborepo - Tailwind CSS Guide](https://turborepo.com/docs/guides/tools/tailwind)
  - Turborepo 환경에서 Tailwind CSS를 설정하고 공유하는 공식 가이드
- [shadcn/ui - Monorepo Guide](https://ui.shadcn.com/docs/monorepo)
  - 모노레포에서 shadcn/ui를 구성하는 표준 아키텍처 및 설정 방법
- [GitHub - dan5py/turborepo-shadcn-ui](https://github.com/dan5py/turborepo-shadcn-ui)
  - Turborepo, Tailwind, shadcn/ui를 활용한 모노레포 구성의 대표적인 레퍼런스 구현체
