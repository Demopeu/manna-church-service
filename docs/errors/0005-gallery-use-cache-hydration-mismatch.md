# Error-0005: Gallery 페이지 'use cache' Hydration Mismatch (#418)

## 📣 해결 여부

미해결 - 2026-02-13 조사 중

## 📋 에러 정보

### 에러 로그

```
Minified React error #418
(Hydration failed because the server rendered HTML didn't match the client)
```

- **환경**: Production only (`pnpm build` → `pnpm start`)
- **URL**: `/news/gallery` (리스트 페이지)
- **재현 패턴**: 첫 로드 정상 → 새로고침 시 에러 발생
- **dev 모드**: 에러 없음

### 영향 범위

- `/news/gallery` 리스트 페이지에서만 발생
- 같은 엔티티의 다른 페이지(`/news/gallery/[id]` 상세, 홈 섹션)는 정상
- 다른 엔티티(`announcements`, `bulletins`, `events`)의 동일 패턴 페이지는 정상

---

## 📊 Phase 1: getGalleries() 함수 격리 테스트

처음에는 `getGalleries()` 함수 자체가 원인이라고 가정하고, 함수 내부를 단계적으로 변경하며 테스트했다.

### ✅ 성공 (에러 없음)

| #   | 조건                                                             | 핵심 확인           |
| --- | ---------------------------------------------------------------- | ------------------- |
| 1   | `'use cache'` + Supabase 없음 + `[]` 반환                        | 함수 구조 OK        |
| 2   | `'use cache'` + Supabase fetch + 응답 **무시**                   | fetch 자체 OK       |
| 3a  | `'use cache'` + `count`만 사용 + `[]` 반환                       | primitive 데이터 OK |
| 3c  | `'use cache'` + Supabase fetch + **하드코딩** 비어있지 않은 배열 | 배열 구조 OK        |
| —   | `getGalleries()`에서 `'use cache'` **완전 제거**                 | 캐싱 없으면 항상 OK |

### ❌ 실패 (hydration #418)

| #     | 조건                                                 | 핵심 확인                   |
| ----- | ---------------------------------------------------- | --------------------------- |
| 원본  | `gallery_images(*)` 중첩 데이터                      | 최초 발견                   |
| —     | `gallery_images(count)` 집계만                       | 중첩 제거해도 실패          |
| —     | `select('*')` galleries 테이블                       | 플랫 데이터도 실패          |
| 3b    | `data.map(g => ({id: g.id, ...하드코딩}))`           | 실제 값 1개만 사용해도 실패 |
| 4     | `JSON.parse(JSON.stringify(data))` 정제 후 매핑      | 프로토타입 제거해도 실패    |
| —     | `galleries_with_count` View 사용                     | View도 실패                 |
| A+B+D | primitive 파라미터 + const 체인 + **notices 테이블** | 다른 테이블도 실패          |

---

## 📊 Phase 2: 렌더링 컨텍스트 테스트

Phase 1에서 `getAnnouncements()`가 동일한 코드 패턴임에도 정상 작동한다는 점에 주목.
`getGalleries()` 코드가 아니라 **호출되는 맥락**을 테스트하기 시작.

### 결정적 테스트 E: gallery List.tsx에서 getAnnouncements() 호출

gallery의 `List.tsx`에서 `getGalleries()` 대신 `getAnnouncements()`를 호출.
**→ ❌ 실패.** announcements 페이지에서는 정상인 동일 함수가 gallery 컨텍스트에서는 실패.

**결론: 문제는 queries 함수가 아니라 갤러리 페이지의 렌더링 컨텍스트.**

### 결정적 테스트 F: gallery page.tsx에서 AnnouncementList 렌더링

gallery `page.tsx`에서 `@/widgets/gallery-section`을 전혀 import하지 않고,
대신 `@/widgets/announcements-section`에서 `AnnouncementList`를 직접 import하여 렌더링.
**→ ✅ 성공.** hydration 에러 없음.

**결론: `@/widgets/gallery-section` barrel import가 페이지 모듈 그래프에 포함되면 에러 발생.**

### 후속 테스트 G: file-level 'use cache' 제거

`queries.ts`에서 file-level `'use cache'` 제거, 각 함수에 function-level `'use cache'`만 유지.
gallery page는 `@/widgets/gallery-section` barrel import 사용.
**→ ❌ 실패.** file-level 제거만으로는 해결 안 됨.

### 후속 테스트 H: getGalleries 별도 파일 분리

`getGalleries()`를 `queries-list.ts`로 분리. 중첩 쿼리(`gallery_images(*)`) 함수와 물리적 격리.
entity barrel에서 `getGalleries`는 `queries-list.ts`에서 re-export.
하지만 widget barrel은 여전히 `Section.tsx`/`Detail.tsx`를 로드 → `queries.ts` 포함.
**→ ❌ 실패.** 모듈 그래프에 `queries.ts`가 여전히 포함되어 효과 없음.

### 후속 테스트 I: List.tsx에서 queries.ts 직접 import (barrel 우회)

`import { getGalleries } from '@/entities/gallery/api/queries'`로 barrel 우회.
하지만 widget barrel을 통해 `Section.tsx`/`Detail.tsx`는 여전히 로드됨.
**→ ❌ 실패.**

---

## 🔍 핵심 발견 요약

### 1. 코드 패턴은 무관

`getAnnouncements()`와 `getGalleries()`는 완전히 동일한 패턴:

- `cache()` 래퍼 + `'use cache'`
- 객체 구조분해 파라미터
- `let queryBuilder` + 조건부 재할당
- `{ count: 'exact' }` + `.range()`
- `(data || []).map(mapper)` 반환

### 2. 데이터/테이블은 무관

`getGalleries()` 안에서 `notices` 테이블을 쿼리해도 실패.
announcements에서 정상 작동하는 동일 테이블.

### 3. 함수 자체도 무관

`getAnnouncements()` (다른 파일의 다른 함수)를 gallery `List.tsx`에서 호출해도 실패.

### 4. gallery-section barrel import가 트리거

gallery `page.tsx`에서 `@/widgets/gallery-section`을 import하지 않으면 정상.
import하면 — 그 안에서 어떤 함수를 호출하든 — 실패.

### 5. barrel이 로드하는 모듈 체인

```
gallery/page.tsx
  → @/widgets/gallery-section (barrel)
    → Section.tsx → @/entities/gallery → queries.ts (gallery_images(*) + 'use cache')
    → Detail.tsx  → @/entities/gallery → queries.ts
    → List.tsx    → @/entities/gallery → queries-list.ts (분리해도 효과 없음)
```

`queries.ts`에는 `gallery_images(*)` 중첩 관계를 fetch하는 함수가 있고,
이 함수들이 `'use cache'`로 마킹되어 있다.
이 파일이 페이지의 모듈 그래프에 포함되면 hydration 에러가 발생한다.

---

## 🧩 미해결 의문점

### 의문 1: queries.ts의 중첩 쿼리 함수가 모듈 전체를 오염시키는가?

`queries.ts`에서 `gallery_images(*)`를 사용하는 `getRecentGalleries()`와 `getGalleryByShortId()`가 문제의 근원인가?
이 함수들의 `'use cache'` 컴파일러 변환이 같은 페이지의 다른 컴포넌트 렌더링에 영향을 주는가?

**검증 방법**: `queries.ts`에서 `gallery_images(*)` 참조를 모두 제거하고 `select('*')`로 변경한 뒤 테스트.

### 의문 2: widget barrel의 tree shaking이 실패하는가?

gallery `page.tsx`는 `GalleryList`와 `galleryData`만 사용.
하지만 barrel이 `Section.tsx`, `Detail.tsx`도 로드한다.
Next.js/Turbopack이 `'use cache'` 함수를 tree shaking하지 못해서 불필요한 모듈이 포함되는 것인가?

**검증 방법**: widget barrel에서 `Section`/`Detail` export를 임시 제거하고 테스트.

### 의문 3: 홈 페이지의 GallerySection이 빌드 시 캐시를 오염시키는가?

홈 페이지(`/`)에서 `GallerySection` → `getRecentGalleries()` → `gallery_images(*)` 호출.
빌드 시 이 함수가 실행되면서 `'use cache'` 캐시에 중첩 데이터가 저장되고,
이것이 `/news/gallery` 페이지의 캐시 동작에 영향을 주는가?

**검증 방법**: 홈 페이지에서 `GallerySection` 임시 제거 후 테스트.

### 의문 4: getGalleryByShortId의 gallery_images 정렬이 문제인가?

`getGalleryByShortId()`에는 `.order('created_at', { referencedTable: 'gallery_images' })`가 없다.
`gallery_images`의 비결정적 정렬이 `'use cache'` 직렬화에서 서버/클라이언트 불일치를 유발하고,
이것이 같은 모듈에 있는 다른 함수의 캐시 동작에까지 파급되는가?

### 의문 5: Next.js 16 'use cache' 컴파일러 버그인가?

`'use cache'`는 Next.js 15에서 experimental, Next.js 16에서 stable이 된 비교적 새로운 기능이다.
중첩 관계형 데이터(`gallery_images(*)`)를 반환하는 함수의 `'use cache'` 컴파일러 변환에
아직 알려지지 않은 직렬화 버그가 있을 수 있다.

### 의문 6: Partial Prerendering(PPR)과의 상호작용인가?

`next.config.ts`에 PPR 관련 설정이 있다.
PPR은 정적/동적 파트를 분리하여 렌더링하는데,
`'use cache'` 함수가 포함된 모듈이 PPR의 정적/동적 경계를 횡단할 때
prerender 시점의 HTML과 runtime RSC payload 간 불일치가 발생할 수 있다.

---

## 🎯 가장 유력한 다음 시도

### 즉시 시도 (빠른 검증)

1. **widget barrel에서 Section/Detail export 임시 제거** — `queries.ts`가 모듈 그래프에서 빠지는지 확인
2. **queries.ts의 모든 `gallery_images(*)` → `select('*')`로 변경** — 중첩 쿼리 자체가 오염 원인인지 확인

### 구조적 해결 (위 검증 후)

3. **widget barrel 분리** — List, Detail, Section을 별도 barrel로 분리하여 필요한 것만 import
4. **`'use cache'` 제거 + 다른 캐싱 전략** — `getGalleries()`에만 `cache()` (React) 사용, 빌드 경고 처리

### 장기 해결

5. **Next.js GitHub Issue 등록** — 재현 가능한 최소 예제와 함께 버그 리포트
6. **Next.js 버전 업데이트 시 재테스트** — 컴파일러 버그라면 향후 패치될 가능성

---

## 📚 관련 파일

- `apps/web/src/entities/gallery/api/queries.ts` — 중첩 쿼리 함수 위치
- `apps/web/src/entities/gallery/api/queries-list.ts` — getGalleries 분리 시도 (효과 없음)
- `apps/web/src/widgets/gallery-section/index.ts` — widget barrel (Section/Detail/List 모두 export)
- `apps/web/src/widgets/gallery-section/ui/List.tsx` — 갤러리 리스트 컴포넌트
- `apps/web/src/widgets/gallery-section/ui/Section.tsx` — 홈 섹션 (getRecentGalleries 호출)
- `apps/web/src/widgets/gallery-section/ui/Detail.tsx` — 상세 (getGalleryByShortId 호출)
- `apps/web/src/app/(main)/(content)/news/gallery/page.tsx` — 갤러리 리스트 페이지
- `apps/web/src/app/(main)/page.tsx` — 홈 페이지 (GallerySection 사용)
- `apps/web/src/entities/announcement/api/queries.ts` — 정상 작동 비교 대상 (중첩 쿼리 없음)
- `apps/web/src/shared/ui/utils/withAsyncBoundary.tsx` — Suspense/ErrorBoundary 래퍼
- `apps/web/next.config.ts` — PPR, reactCompiler 등 설정
