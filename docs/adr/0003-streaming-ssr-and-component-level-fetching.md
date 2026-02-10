# ADR-0003: Blocking SSR에서 Streaming SSR로의 전환 (Component-Level Fetching)

## 📣 상태

채택됨 (Accepted) - 2026-02-10

## 📋 상황

홈페이지(`page.tsx`)에서 모든 데이터를 `Promise.all`로 한꺼번에 가져온 뒤 자식 위젯에 Props로 내려주는 **Blocking SSR** 방식을 사용하고 있었음.

### 해결해야 할 페인 포인트

1. **Waterfall 병목:** `page.tsx` 상단에서 `getBanners()`, `getLatestSermon()`, `getRecentAnnouncements()`, `getRecentEvents()`, `getRecentGalleries()` 총 5개의 비동기 호출을 `Promise.all`로 묶어 실행함. 하나라도 느리면 **전체 페이지의 HTML 응답이 지연**됨.

```typescript
// ❌ BEFORE: 모든 데이터가 resolve될 때까지 HTML 전송 불가
const [banners, sermon, announcements, events, recentGalleries] =
  await Promise.all([
    getBanners(),
    getLatestSermon(),
    getRecentAnnouncements(),
    getRecentEvents(),
    getRecentGalleries(),
  ]);
```

2. **전체 페이지 블로킹:** 5개 API 중 가장 느린 응답이 전체 Time to First Byte(TTFB)를 결정함. Supabase Cold Start 또는 네트워크 지연 시 사용자는 **3초 이상 흰 화면**을 보게 됨.
3. **Prop Drilling 유지보수 비용:** 위젯에 데이터 타입이 변경되면 `page.tsx`의 Props 인터페이스와 자식 컴포넌트 모두 수정 필요. 데이터 소유권이 분산되어 있어 변경 영향 범위 추적이 어려움.
4. **에러 전파:** 하나의 API 실패 시 `Promise.all`이 reject되어 **페이지 전체가 에러 상태**로 전환됨. 공지사항 API 장애 때문에 배너와 갤러리까지 안 보이는 상황 발생.
5. **LCP 저하:** Hero 배너 이미지(LCP 요소)조차 모든 API 응답을 기다린 후에야 렌더링 시작. Core Web Vitals 점수에 직접적 악영향.

## 🔨 결정 (Decisions)

### 1. Shell & Content 아키텍처 분리

`page.tsx`를 데이터 없이 **즉시 렌더링 가능한 Shell(뼈대)**로 전환함. 데이터 패칭 책임을 각 위젯 내부로 이동(Colocation).

```typescript
// ✅ AFTER: page.tsx는 순수한 레이아웃 Shell
export default async function Home() {
  return (
    <main className="flex-1">
      <HeroCarousel />       {/* 내부에서 getBanners() */}
      <QuickMenu />
      <SectionWrapper>
        <YoutubeImageBox />   {/* 내부에서 getLatestSermon() */}
        <AnnouncementsSection /> {/* 내부에서 getRecentAnnouncements() */}
      </SectionWrapper>
      <EventsMarquee />      {/* 내부에서 getRecentEvents() */}
      <GallerySection />      {/* 내부에서 getRecentGalleries() */}
    </main>
  );
}
```

- `page.tsx`에는 `import`문 외에 **단 하나의 `await`도 없음**.
- Shell HTML이 즉시 클라이언트에 전송되고, 각 위젯이 독립적으로 Streaming됨.

### 2. `withAsyncBoundary` HOC를 통한 Suspense + Error Boundary 통합

ADR-0002에서 정의한 `withAsyncBoundary` 패턴을 홈페이지 위젯 전체에 적용함. 이 HOC는 `Suspense`(로딩)와 `try-catch` Error Boundary(에러)를 하나의 래퍼로 통합함.

```typescript
// shared/ui/utils/withAsyncBoundary.tsx
export function withAsyncBoundary<T extends object>(
  Component: (props: T) => Promise<React.ReactNode>,
  options: BoundaryOptions = {},
) {
  // Suspense로 로딩 상태 처리
  // try-catch로 에러 상태 처리 + Sentry 자동 보고
}
```

**적용된 위젯별 전략:**

| 위젯 | async 컴포넌트 | Loading Fallback | Error Fallback | 전략 |
|---|---|---|---|---|
| `HeroCarousel` | `HeroCarouselBase` | 기본 배너 이미지 (LCP 보장) | 기본 배너 이미지 | **Default Content** |
| `SermonOverlay` | `SermonOverlayBase` | Skeleton (pulse) | 기본 설교 정보 표시 | **Variant Pattern** |
| `AnnouncementsSection` | `AnnouncementsSectionBase` | Skeleton 리스트 (5행) | 에러 안내 메시지 | **Variant Pattern** |
| `EventsMarquee` | `EventsMarqueeBase` | Skeleton 카드 (6장) | `null` (섹션 숨김) | **Graceful Hide** |
| `GallerySection` | `GallerySectionBase` | Skeleton 그리드 (4장) | `null` (섹션 숨김) | **Graceful Hide** |

### 3. Graceful Degradation 전략 세분화

에러 발생 시 위젯의 **중요도에 따라 3가지 전략**을 구분하여 적용함.

- **Default Content (최상위 우선):** Hero 배너처럼 LCP에 직접 영향을 주는 위젯은 에러 시에도 기본 이미지를 표시하여 레이아웃 붕괴를 방지함.
- **Variant Pattern (정보 중심):** 공지사항, 설교 오버레이처럼 텍스트 정보가 핵심인 위젯은 `skeleton` | `fallback` | `error` | `empty` 등의 variant로 상태별 UI를 명시적으로 분리함.
- **Graceful Hide (보조 콘텐츠):** 이벤트 Marquee, 갤러리처럼 보조적인 섹션은 에러 시 `null`을 반환하여 해당 영역만 조용히 숨김. 사용자는 에러를 인지하지 못함.

### 4. LCP 최적화: 기본 배너 즉시 렌더링

`HeroCarousel`은 Suspense fallback으로 **정적 기본 배너 이미지**를 렌더링함. 이미지에 `priority` 속성이 설정되어 있어, API 응답과 무관하게 **LCP 요소가 Shell과 함께 즉시 전송**됨.

```typescript
export const HeroCarousel = withAsyncBoundary(HeroCarouselBase, {
  loadingFallback: <HeroCarouselPlaceholder />,  // 기본 배너 이미지 (priority)
  errorFallback: <HeroCarouselPlaceholder />,     // 동일한 기본 배너
});
```

## 📊 영향 (Consequences)

### 📈 긍정적 영향

- **TTFB 0ms 수준으로 단축:** Shell HTML이 데이터 패칭과 무관하게 즉시 전송됨. 사용자는 페이지 전환 직후 레이아웃을 확인 가능.
- **FCP/LCP 개선:** Hero 배너가 기본 이미지로 즉시 렌더링되어 Largest Contentful Paint가 API 응답 시간에 종속되지 않음.
- **장애 격리:** 공지사항 API가 실패해도 배너, 이벤트, 갤러리는 정상 표시됨. 단일 장애 지점(Single Point of Failure)이 제거됨.
- **체감 속도 향상:** Skeleton UI가 즉시 표시되어 시스템이 작동 중임을 사용자에게 전달. "흰 화면 3초 → 뿅" 패턴이 "즉시 뼈대 → 콘텐츠 스트리밍" 패턴으로 전환됨.
- **유지보수 간소화:** 위젯의 데이터 인터페이스 변경이 `page.tsx`에 전파되지 않음. 위젯 내부에서 데이터 소유권이 완결됨 (Colocation).
- **PPR(Partial Prerendering) Ready:** Shell이 정적이고 각 위젯이 독립적 Suspense Boundary로 감싸져 있어, Next.js PPR 도입 시 추가 리팩토링 없이 즉시 적용 가능.

### 📉 부정적 영향 및 대응

- **위젯별 비동기 상태 관리 복잡도 증가:** 각 위젯이 자체적으로 로딩/에러/빈 상태를 처리해야 하므로 Placeholder 컴포넌트가 위젯마다 필요함. 그러나 `withAsyncBoundary` HOC로 보일러플레이트를 최소화하고, Variant Pattern으로 상태 UI를 하나의 컴포넌트에 응집시켜 대응함.
- **병렬 요청의 명시적 제어 상실:** `Promise.all`을 통해 5개 요청을 동시에 시작하던 것이, 각 컴포넌트가 독립적으로 요청을 시작하는 방식으로 변경됨. 그러나 React의 Streaming SSR에서 서버 컴포넌트들은 본질적으로 병렬 실행되므로 실질적인 성능 차이는 미미함.
- **N+1 요청 가능성:** 동일 데이터를 여러 위젯에서 참조할 경우 중복 요청 발생 가능. 현재는 `react cache()`로 요청 중복을 제거하여 대응 중.

## 📝 대안 (Alternatives)

### 1. Page-Level `Promise.all` 유지 + `loading.tsx` 활용

- **기각 사유:** Next.js `loading.tsx`는 페이지 단위 Suspense Boundary로, 전체 페이지가 하나의 로딩 상태를 공유함. 위젯별 독립적인 로딩/에러 제어가 불가능하고, Hero 배너까지 Skeleton으로 대체되어 LCP가 악화됨.

### 2. Client-Side Fetching (React Query / SWR)

- **기각 사유:** 클라이언트에서 데이터를 패칭하면 JS 번들 다운로드 → Hydration → fetch 시작까지 추가 딜레이 발생. 구형 모바일 기기에서 체감 속도가 오히려 느려짐. Server Component의 서버 사이드 실행 이점을 포기하게 됨.

### 3. `Promise.allSettled` + 부분 렌더링

- **기각 사유:** API 실패를 개별 처리할 수 있으나, 여전히 **가장 느린 API가 TTFB를 결정**하는 근본 문제가 해결되지 않음. Shell 즉시 전송이라는 핵심 이점이 없음.
