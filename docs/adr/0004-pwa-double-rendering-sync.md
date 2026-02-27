# ADR-0004: PWA 설치 프롬프트 상태 관리 분리 및 렌더링 최적화 (External Store 패턴)

## 📣 상태

채택됨 (Accepted) - 2026-02-24

## 📋 상황

기존 PWA 설치 유도 팝업(`usePWA` 훅)은 브라우저 API(`BeforeInstallPromptEvent`), 스토리지 로직(`localStorage`, `sessionStorage`), 그리고 UI 상태가 하나의 훅 안에 강하게 결합(Coupling)되어 있었음.

### 해결해야 할 페인 포인트

1. **관심사의 혼재 (Separation of Concerns 위배):** UI를 담당하는 훅 안에서 조회수 계산, 7일 쿨타임 만료일 계산 등 비즈니스 로직이 혼재되어 유지보수성이 떨어짐.
2. **리렌더링 낭비 (성능 저하):** 상태가 바뀔 때마다 매번 새로운 객체를 생성하여 반환하므로, 리액트의 얕은 비교(`Object.is`) 특성상 실질적인 화면 변화(팝업 노출 여부)가 없어도 불필요한 컴포넌트 리렌더링이 발생함.
3. **SSR 환경의 런타임 에러 위험:** 브라우저 전용 API인 `window`와 `Storage` 객체에 접근하는 코드가 혼재되어 있어, Next.js의 서버 렌더링 단계에서 Hydration 에러나 ReferenceError가 발생할 위험이 존재함.
4. **상태 동기화 파편화:** 여러 컴포넌트에서 PWA 상태를 참조할 경우, 로컬 `useState`로는 탭 간 또는 컴포넌트 간 상태 동기화가 불가능함.

## 🔨 결정 (Decisions)

### 1. FSD 아키텍처 기반의 순수 바닐라 Store 분리 (`widgets/pwa/model`)

비즈니스 로직(스토리지 접근, 쿨타임 계산)을 리액트 생명주기에서 완전히 분리하여 순수 TypeScript 클로저 기반의 `pwaStore`로 캡슐화함.

- 전역 변수 오염을 막기 위해 팩토리 함수(`createPwaStore`) 내부의 지역 변수(`let state`)로 상태를 은닉함.
- `incrementViews`, `setCooldown` 등의 액션 메서드만 외부에 노출하여 스토어의 무결성을 보장함.
- 초기화 로직(`init`)을 모듈 로드 시점에 단 한 번만 실행되도록 처리하여 성능을 최적화함.

```typescript
'use client';

function createPwaStore() {
  const listeners = new Set<() => void>();
  let state: PwaState = { views: 0, isCoolingDown: false };

  const init = () => { /* 스토리지 동기화 */ };
  init();

  return {
    getSnapshot: () => state, // 순수 함수 유지
    subscribe: /* ... */,
    incrementViews: /* ... */,
    setCooldown: /* ... */
  };
}
```

### 2. `useSyncExternalStore` 및 Selector 패턴을 통한 렌더링 최적화

리액트 코어 훅인 `useSyncExternalStore`를 사용하여 외부 스토어(`pwaStore`)와 리액트 트리를 안전하게 동기화함. 특히, 무한 리렌더링을 막기 위해 **파생 상태 셀렉터(Selector)** 패턴을 적용함.

- 스토어의 전체 객체(`{ views, isCoolingDown }`)를 그대로 반환하지 않음.
- 훅 내부에서 `checkShouldShowPrompt` 함수를 통해 최종적으로 팝업을 띄울지 말지에 대한 **원시값(boolean)**인 `isPromptEligible`만 찝어내어(Select) 반환함.
- 조회수가 올라도 최종 결과(boolean)가 동일하면 리액트가 렌더링을 차단(Bailout)하도록 구성함.

### 3. 리액트 상태와 외부 스토어 상태의 완벽한 관심사 분리

브라우저가 부여하는 설치 권한증(`deferredPrompt`)은 외부 스토어에 넣지 않고 리액트 로컬 상태(`useState`)로 유지함.

- `useSyncExternalStore`의 `getSnapshot`은 오직 스토어 데이터만 참조하는 **순수 함수(Pure Function)**로 유지함.
- 렌더링 단계에서 브라우저 권한(`!!deferredPrompt`)과 스토어의 비즈니스 자격(`isPromptEligible`)을 결합하여 최종 `isInstallable` 상태를 도출함.

```typescript
// 스토어 자격과 브라우저 권한의 철저한 분리
const isPromptEligible = useSyncExternalStore(
  pwaStore.subscribe,
  () => checkShouldShowPrompt(pwaStore.getSnapshot()), // 오직 스토어 데이터만 계산
  () => false,
);

const isInstallable = !!deferredPrompt && isPromptEligible;
```

### 4. Next.js SSR 대응 및 안전한 Cleanup

- 스토어 파일 최상단에 `'use client'` 지시어를 명시하여 클라이언트 전용 모듈임을 번들러에 선언함.
- `useSyncExternalStore`의 세 번째 인자(Server Snapshot)로 `() => false`를 제공하여 SSR 환경에서의 안전성을 보장함.
- 프롬프트 액션 종료(승인/거절) 후 `setDeferredPrompt(null)`을 호출하여 일회성 이벤트 객체를 메모리에서 완전히 해제함.

## 📊 영향 (Consequences)

### 📈 긍정적 영향

- **완벽한 렌더링 최적화:** 스토리지 값이 변하더라도, 실질적인 UI 상태(팝업 노출 여부)가 변하지 않으면 컴포넌트 리렌더링이 0회 발생함.
- **높은 응집도와 낮은 결합도:** `usePWA` 훅은 오직 UI 상태 결정과 이벤트 리스너 관리에만 집중하며, 복잡한 날짜/조회수 계산은 스토어가 전담함.
- **Zero-Dependency:** Zustand, Redux 등 무거운 서드파티 상태 관리 라이브러리 추가 없이 리액트 순정 API만으로 전역 상태 동기화를 가볍게 구현하여 번들 사이즈를 절감함.
- **안정성 확보:** 브라우저 API가 없는 서버 환경(SSR)에서 렌더링 트리가 붕괴되는 현상을 원천 차단함.

### 📉 부정적 영향 및 대응

- **바닐라 JS 보일러플레이트 증가:** 스토어를 직접 구현하기 위해 옵저버 패턴(`subscribe`, `emitChange`) 코드를 직접 작성해야 함.
  - _대응:_ 해당 로직을 템플릿화하였으며, PWA 외에 유사한 로컬 스토리지 동기화가 필요한 위젯 발생 시 `shared` 계층의 범용 유틸리티로 추상화할 수 있도록 설계함.

## 📝 대안 (Alternatives)

### 1. Zustand + `persist` 미들웨어 사용

- **기각 사유:** 로직 구현은 가장 빠르지만, 오직 PWA 팝업 단일 위젯만을 위해 전역 상태 라이브러리 의존성을 추가하는 것은 FSD의 위젯 고립성 원칙에 위배되며 오버엔지니어링이라고 판단함.

### 2. Custom Event + `useEffect` 조합

- **기각 사유:** 스토리지가 변경될 때마다 `window.dispatchEvent`로 커스텀 이벤트를 쏘고 컴포넌트에서 수신하는 방식. 구현이 파편화되고 동기화 타이밍 이슈(Tearing)가 발생할 수 있어, 리액트 18의 권장 표준인 `useSyncExternalStore`를 채택함.
