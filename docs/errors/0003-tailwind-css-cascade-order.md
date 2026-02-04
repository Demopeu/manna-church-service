# Error-0003: Tailwind CSS 중복 임포트로 인한 미디어쿼리 우선순위 문제

## 📣 해결 여부

해결 - 2026-02-03

## 📋 상황

Turborepo 모노레포 환경에서 Tailwind CSS v4를 사용 중, `hidden lg:flex` 또는 `hidden sm:flex`와 같은 반응형 유틸리티 클래스가 정상 작동하지 않는 문제 발생. 화면 크기가 브레이크포인트(lg: 1024px, sm: 640px)를 초과해도 요소가 계속 숨겨진 상태(`display: none`)로 유지됨.

```tsx
// widgets/main-layout/ui/NavigationMenu.tsx
export function MainNavigationMenu() {
  return (
    <div className="hidden flex-1 justify-center lg:flex">
      {/* lg(1024px) 이상에서 보여야 하는데 계속 숨겨짐 */}
      <NavigationMenu>...</NavigationMenu>
    </div>
  );
}
```

```tsx
// widgets/main-layout/ui/Icon.tsx
export function Icon() {
  return (
    <div className="hidden items-center gap-1 sm:flex">
      {/* sm(640px) 이상에서 보여야 하는데 계속 숨겨짐 */}
      <Link href="...">...</Link>
    </div>
  );
}
```

브라우저 개발자 도구 확인 결과:

- 화면 너비: 1280px
- `.hidden { display: none }` ✅ 적용됨
- `.lg\:flex { display: flex }` ❌ 무시됨 (체크 해제 상태)

## 🔨 해결 방법

Turborepo 공식 문서 패턴을 따라 **UI 패키지 스타일을 TSX에서 import**하고, `globals.css`에서는 앱 자체의 Tailwind 설정만 담당하도록 분리함.

### 최종 해결 (공식 문서 패턴)

```tsx
/* apps/web/src/app/layout.tsx */
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '@repo/ui/styles.css';
// ← UI 패키지 스타일 먼저 로드
import './styles/globals.css';

// ← 앱 전역 스타일

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

```css
/* apps/web/src/app/styles/globals.css */
@import 'tailwindcss';            // ← 앱 자체 Tailwind 기본
@import '@repo/tailwind-config';  // ← 공유 테마/변수만

@custom-variant dark (&:is(.dark *));

:root {
  /* ... 앱 전용 변수 정의 ... */
}

@theme inline {
  /* ... 앱 전용 테마 정의 ... */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 대안: CSS에서 통합 관리 (임시 해결)

```css
/* apps/web/src/app/styles/globals.css */
@import '@repo/ui/styles.css';    // ← UI 먼저 로드
@import '@repo/tailwind-config';  // ← 미디어쿼리가 나중에 선언되도록

/* ... 나머지 동일 ... */
```

```tsx
/* apps/web/src/app/layout.tsx */
import './styles/globals.css';

// ← UI + 앱 스타일 한번에
```

**중요**: CSS 파일 수정 후 반드시 캐시를 삭제하고 개발 서버를 재시작해야 함.

```bash
# apps/web 디렉토리에서 실행
pnpm clean  # 또는 rm -rf .next .turbo
```

## 📊 가정한 문제 원인

### 1. **CSS 캐스케이드 원칙 (Cascade Order)**

- CSS는 같은 specificity를 가진 규칙이 여러 번 선언되면 **마지막에 선언된 것이 우선**함.
- `.hidden`과 `.lg\:flex`는 모두 단일 클래스 선택자이므로 specificity가 동일 (0, 0, 1, 0).
- 미디어쿼리(`@media`)도 선언 순서에 영향을 받음.

### 2. **Tailwind CSS 로드 구조 차이**

- Turborepo 모노레포 환경에서는 각 패키지가 독립적으로 작동해야 하므로, `@repo/tailwind-config`를 여러 곳에서 import함.
- 이는 **의도된 설계**이지만, **모든 CSS import를 한 파일에서 관리**하면 순서 문제가 발생함.

**잘못된 패턴 (문제 발생):**

```css
/* globals.css에서 모든 것을 import */
@import 'tailwindcss'; /* 1. 앱 Tailwind */
@import '@repo/tailwind-config'; /* 2. 공유 설정 (내부에 tailwindcss) */
@import '@repo/ui/styles.css'; /* 3. UI 스타일 (내부에 tailwind-config) */
```

**실제 로드 순서:**

```
1. tailwindcss → .hidden, @media lg:flex
2. tailwind-config → .hidden, @media lg:flex (재선언)
3. ui/styles.css → tailwind-config → .hidden, @media lg:flex (또 재선언)
```

결과: `.hidden`이 미디어쿼리보다 나중에 여러 번 재선언되어, `display: none`이 항상 최종 규칙으로 적용됨.

**공식 문서 패턴 (해결):**

```tsx
/* layout.tsx */
import '@repo/ui/styles.css';
/* 1. UI 스타일 먼저 (TSX에서) */
import './globals.css';

/* 2. 앱 스타일 (CSS에서) */
```

```css
/* globals.css */
@import 'tailwindcss'; /* 앱 자체 Tailwind만 */
@import '@repo/tailwind-config'; /* 공유 변수/테마만 */
```

**실제 로드 순서:**

```
1. ui/styles.css → tailwind-config → .hidden, @media lg:flex
2. globals.css → tailwindcss → .hidden, @media lg:flex (앱용)
3. globals.css → tailwind-config → 변수/테마만 (Tailwind 재로드 없음)
```

결과: UI와 앱의 Tailwind가 **독립적으로** 로드되어 충돌 없음. 미디어쿼리가 정상 작동함.

### 3. **Turborepo의 표준 패턴**

- 공식 문서에서도 각 패키지와 앱이 독립적으로 `@repo/tailwind-config`를 import하는 구조를 권장함.
- UI 패키지는 `@apply` 지시자를 사용하므로 자체적으로 Tailwind를 로드해야 함.
- 앱도 마찬가지로 `globals.css`에서 `@apply`를 사용하므로 Tailwind를 로드해야 함.

```css
/* packages/ui/src/styles.css */
@import '@repo/tailwind-config'; /* @apply 사용을 위해 필요 */

@layer base {
  * {
    @apply border-border outline-ring/50; /* Tailwind 지시자 사용 */
  }
}
```

## 📝 고려한 대안

### 1. **TSX와 CSS 분리 패턴 (공식 문서, 최종 선택)**

```tsx
/* layout.tsx */
import '@repo/ui/styles.css';
import './globals.css';
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@repo/tailwind-config';
```

- **장점**:
  - UI와 앱의 Tailwind가 독립적으로 로드됨
  - 순서 문제 발생하지 않음
  - Turborepo 공식 권장 패턴
  - 각 패키지의 독립성 완벽히 보장
- **단점**: import가 TSX와 CSS에 분산됨 (관리 포인트 증가)

### 2. **CSS 통합 관리 + 순서 조정**

```css
/* globals.css */
@import '@repo/ui/styles.css';
@import '@repo/tailwind-config';
```

- **장점**: 모든 CSS import를 한 곳에서 관리
- **단점**:
  - Tailwind를 2번 중복 로드 (비효율)
  - 순서에 민감함 (나중에 다시 문제 발생 가능)
  - 공식 패턴과 다름

### 3. **Tailwind 단일 로드 (UI 패키지에서만)**

```css
/* globals.css */
@import '@repo/ui/styles.css';
```

- **문제점**: `globals.css`에서 `@apply` 지시자 사용 불가
- `@layer base { @apply ... }` 작동 안 함

### 4. **UI 패키지에서 Tailwind 제거**

```css
/* packages/ui/src/styles.css */
/* @import '@repo/tailwind-config'; 제거 */
```

- **문제점**: UI 패키지 내부에서 `@apply` 사용 불가
- UI 패키지가 독립적으로 작동하지 못함 (Turborepo 철학 위배)

## 🎯 핵심 개념 정리

### CSS Cascade (캐스케이드) 원칙

1. **Specificity (특이성)**: 선택자의 우선순위
   - Inline style > ID > Class > Element
   - `.hidden`과 `.lg\:flex`는 같은 Class 레벨 (0, 0, 1, 0)

2. **Source Order (선언 순서)**: Specificity가 같으면 나중에 선언된 것이 이김
   - 미디어쿼리도 선언 순서의 영향을 받음
   - 같은 규칙이 여러 번 선언되면, 마지막 것이 최종 적용

3. **Media Query Cascade**:
   ```css
   .hidden {
     display: none;
   } /* 1번 선언 */
   @media (min-width: 64rem) {
     .lg\:flex {
       display: flex;
     } /* 2번 선언 */
   }
   .hidden {
     display: none;
   } /* 3번 선언 (1번을 덮어씀) */
   ```

   - 조건 충족 시: 2번(`display: flex`)이 3번(`display: none`)과 경쟁
   - 3번이 더 나중에 선언되었으므로 3번이 승리 → 숨겨진 상태 유지

### Turborepo + Tailwind CSS 패턴

- **각 패키지가 독립적으로 Tailwind를 import하는 것은 정상**
- 공식 예제: https://github.com/vercel/turborepo/tree/main/examples/with-tailwind
- UI 패키지: 자체 스타일링을 위해 Tailwind 필요
- 앱: 전역 스타일과 테마 정의를 위해 Tailwind 필요

## 📚 참고자료

- [Turborepo - Tailwind CSS Guide](https://turborepo.dev/docs/guides/tools/tailwind)
- [MDN - CSS Cascade and Inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)
- [Tailwind CSS v4 - Import Order](https://tailwindcss.com/docs/v4-beta#css-first-configuration)
- [CSS Specificity Calculator](https://specificity.keegan.st/)
