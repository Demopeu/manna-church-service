# Error-0005: Gallery 페이지 'use cache' Hydration Mismatch (#418)

## 📣 해결 여부

**해결됨** - 2026-02-13

## ✅ 해결 방법

`List.tsx`에서 `<Link>` 및 그 하위 JSX를 **`'use client'` 컴포넌트(`Item.tsx`)로 분리**.

```tsx
// Item.tsx — 'use client'
'use client';
import Link from 'next/link';
// List.tsx — Server Component (async, 'use cache' 데이터 사용)
import { GalleryItem } from './Item';

export function GalleryItem({ gallery }: Props) {
  return (
    <Link href={`/news/gallery/${gallery.title}-${gallery.shortId}`}>...</Link>
  );
}

async function List({ filterParams }: Props) {
  const { galleries } = await getGalleries({ query, page });
  return galleries.map((g) => <GalleryItem key={g.id} gallery={g} />);
}
```

**핵심**: `Link` 컴포넌트의 렌더링을 `'use cache'`의 RSC payload 캐싱 범위 밖으로 이동.

---

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

## � 원인 분석: `next/link` + `'use cache'` + 모듈 그래프 오염

### next/link 내부 구현

`next/link`의 소스코드([github: packages/next/src/client/link.tsx](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/link.tsx))를 분석한 결과:

1. **`'use client'` 컴포넌트**: `link.tsx` 파일 최상단에 `'use client'` 선언
2. **`useIntersection` 훅**: viewport 진입 감지용 `IntersectionObserver` 사용
3. **`useContext(RouterContext)`**: 런타임 라우터 상태에 의존
4. **`React.useMemo`로 href 해석**: `resolveHref(router, hrefProp, true)` + `addBasePath` + `addLocale`
5. **`React.useEffect`로 prefetch**: viewport에 보이면 자동 prefetch 실행
6. **최종 렌더링**: `<a {...restProps} {...childProps}>{children}</a>`

### 왜 hydration mismatch가 발생하는가

#### Server Component에서 Link를 직접 렌더링할 때 ('use cache' 활성)

```
[빌드/prerender 시]
Server Component (List.tsx)
  → getGalleries() with 'use cache' → 데이터 fetch
  → Link 렌더링 → <a href="/news/gallery/제목-shortId"> (HTML에 포함)
  → RSC payload에 Link의 client reference + props + 렌더된 HTML 캐시
```

```
[런타임 hydration 시]
브라우저가 캐시된 HTML 수신
  → Link 컴포넌트 hydrate
  → useMemo로 href 재계산 (resolveHref + addBasePath)
  → 서버에서 캐시된 <a href="...">와 클라이언트에서 계산된 href 비교
  → 불일치 → Hydration Error #418
```

**`Link`가 `useMemo`로 계산하는 `href`는 런타임 라우터 컨텍스트(`RouterContext`)에 의존한다.**
`'use cache'`로 캐시된 prerender HTML의 `<a>` 태그 `href`와,
hydration 시 `Link`가 다시 계산하는 `href`가 미세하게 달라질 수 있다.

#### 'use client' 컴포넌트로 분리할 때 (해결됨)

```
[빌드/prerender 시]
Server Component (List.tsx)
  → getGalleries() with 'use cache' → 데이터 fetch
  → GalleryItem 렌더링 → client component boundary
  → RSC payload에는 GalleryItem의 reference + serialized props만 캐시
  → Link의 렌더된 HTML은 캐시에 포함되지 않음
```

```
[런타임 hydration 시]
브라우저가 HTML 수신
  → GalleryItem hydrate → Link 렌더링
  → 서버 HTML과 클라이언트 렌더링 모두 동일한 런타임 컨텍스트 사용
  → href 일치 → 정상
```

**핵심 차이: client component boundary가 `'use cache'`의 캐싱 범위를 제한한다.**
`Link`가 client component 내부에 있으면, `'use cache'`는 `Link`의 렌더된 HTML을 캐시하지 않고
client component의 **reference와 props만** 캐시한다.

### 왜 gallery에서만 발생하는가 (모듈 그래프 오염)

announcements도 `Link`를 Server Component에서 직접 렌더링하지만 정상 작동한다.
gallery에서만 발생하는 이유는 **모듈 그래프에 `gallery_images(*)` 중첩 쿼리 함수가 포함**되기 때문이다.

```
gallery/page.tsx
  → @/widgets/gallery-section (barrel)
    → Section.tsx → queries.ts → getRecentGalleries() [gallery_images(*) + 'use cache']
    → Detail.tsx  → queries.ts → getGalleryByShortId() [gallery_images(*) + 'use cache']
    → List.tsx    → queries.ts → getGalleries() [플랫 데이터 + 'use cache']
```

**`gallery_images(*)`를 포함하는 `'use cache'` 함수가 모듈 그래프에 있으면:**

1. `'use cache'` 컴파일러가 이 함수들의 반환 타입을 직렬화 가능하게 변환
2. 중첩 관계형 데이터(`gallery_images(*)`)의 복잡한 타입 구조가 직렬화 코드에 포함
3. 이 변환이 **같은 페이지의 RSC payload 생성 전체에 영향**
4. `Link`의 server-rendered HTML이 포함된 RSC payload의 직렬화/역직렬화 과정에서 미세한 불일치 발생

announcements의 `queries.ts`에는 중첩 쿼리가 없어서 (플랫 데이터만) 이 문제가 발생하지 않는다.

### 증거 요약

| 조건                                                   | 결과 | 설명                                           |
| ------------------------------------------------------ | ---- | ---------------------------------------------- |
| gallery barrel import 없음 (AnnouncementList 사용)     | ✅   | queries.ts 로드 안 됨                          |
| gallery barrel import + Link 직접 렌더링               | ❌   | queries.ts 로드 + Link HTML 캐시됨             |
| gallery barrel import + Link를 client component로 분리 | ✅   | queries.ts 로드되지만 Link HTML은 캐시 범위 밖 |
| announcements (중첩 쿼리 없음) + Link 직접 렌더링      | ✅   | 중첩 쿼리 없어서 RSC payload 오염 없음         |

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

**Phase 1 결론**: `getGalleries()` 내부 코드는 문제가 아니었다. 문제는 이 함수가 속한 모듈 그래프에 있었다.

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

### 최종 해결 J: Link를 'use client' 컴포넌트로 분리

`Item.tsx`에 `'use client'` + `Link` + 하위 JSX 이동.
**→ ✅ 성공!** `'use cache'`도 정상 적용된 상태에서 hydration 에러 없음.

---

## 🧩 남은 의문점

### 의문 1: announcements는 왜 Link 직접 렌더링이 되는가?

announcements도 `Link`를 Server Component에서 직접 렌더링한다. 차이점은 모듈 그래프에
`gallery_images(*)` 같은 **중첩 관계형 쿼리**가 없다는 것이다.
이것은 `'use cache'` 컴파일러가 중첩 데이터 타입을 처리할 때 RSC payload 직렬화에
부작용을 일으킨다는 것을 시사한다.

### 의문 2: Next.js 컴파일러 버그 가능성

`'use cache'`는 Next.js 15에서 experimental, 16에서 stable이 된 비교적 새로운 기능이다.
중첩 관계형 데이터를 반환하는 `'use cache'` 함수가 같은 모듈 그래프에 있을 때,
`Link`의 server-rendered HTML 직렬화에 영향을 주는 것은 의도된 동작이 아닐 가능성이 높다.

### 의문 3: PPR(Partial Prerendering)과의 상호작용

`cacheComponents: true` 설정 시 PPR이 활성화된다.
PPR은 static shell + dynamic streaming으로 나뉘는데,
`'use cache'` 함수의 결과가 static shell에 포함될 때
`Link`의 `resolveHref`가 prerender 시점과 runtime 시점에서 다른 결과를 내는지 확인 필요.

---

## 📝 교훈 및 권장 패턴

### 1. `'use cache'` Server Component에서 `Link`를 직접 렌더링하지 말 것

특히 모듈 그래프에 **중첩 관계형 쿼리** (`select('*, relation(*)')`)가 포함된 경우.
대신 `Link`를 `'use client'` 컴포넌트로 분리하여 client component boundary를 만들 것.

### 2. client component boundary는 캐싱 범위를 제한하는 역할

`'use cache'`의 RSC payload 캐싱은 client component boundary에서 멈춘다.
캐시 경계 안에서 `Link` 같은 stateful client component를 렌더링하면,
server-rendered HTML과 hydration output 간 불일치 위험이 있다.

### 3. 아이템 렌더링을 별도 컴포넌트로 분리하는 것은 좋은 패턴

```tsx
// ✅ 좋음 — 데이터 fetch는 서버, 렌더링은 클라이언트
<ServerList>
  {items.map(item => <ClientItem key={item.id} data={item} />)}
</ServerList>

// ⚠️ 위험 — 'use cache' 모듈에 중첩 쿼리가 있으면 hydration 에러 가능
<ServerList>
  {items.map(item => <Link href={...}>{item.title}</Link>)}
</ServerList>
```

---

## 📚 관련 파일

- `apps/web/src/widgets/gallery-section/ui/Item.tsx` — **해결: 'use client' 컴포넌트로 Link 분리**
- `apps/web/src/widgets/gallery-section/ui/List.tsx` — 갤러리 리스트 (Server Component)
- `apps/web/src/entities/gallery/api/queries.ts` — 중첩 쿼리 함수 위치 (gallery_images)
- `apps/web/src/widgets/gallery-section/index.ts` — widget barrel
- `apps/web/src/widgets/gallery-section/ui/Section.tsx` — 홈 섹션 (getRecentGalleries 호출)
- `apps/web/src/app/(main)/(content)/news/gallery/page.tsx` — 갤러리 리스트 페이지
- `apps/web/src/entities/announcement/api/queries.ts` — 정상 작동 비교 대상 (중첩 쿼리 없음)
- `next/link 소스코드` — [github](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/link.tsx)
