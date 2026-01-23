# Error-0001: ReferenceError: DOMMatrix is not defined

## 📣 해결 여부

해결 - 2026-01-24

## 📋 상황

Next.js (App Router) 환경에서 `pdfjs-dist` 라이브러리를 사용하여 PDF를 이미지로 변환하는 기능을 구현하던 중, 서버 사이드 렌더링(SSR) 과정에서 에러가 발생함.

```typescript
// shared/lib/pdf.ts
'use client';

// ❌ 문제의 코드: 파일이 로드되자마자 실행됨 (Top-level Import)
import \* as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export async function pdfToWebpConverter(file: File) {
// ... 생략 ...
const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// ... 생략 ...
}
```

실행(또는 빌드) 시 다음과 같은 에러 발생:

```bash
ReferenceError: DOMMatrix is not defined
pdf.js/src/display/canvas.js @ module evaluation

61 | // Only used in rescaleAndStroke. The goal is to avoid
62 | // creating a new DOMMatrix object each time we need it.

> 63 | const SCALE_MATRIX = new DOMMatrix();

     |                      ^

64 |
```

## 🔨 해결 방법

라이브러리 호출 방식을 **Static Import(정적 임포트)**에서 **Dynamic Import(동적 임포트)**로 변경하여, 브라우저 환경임이 보장된 시점에만 라이브러리를 로드하도록 수정함.

```typescript
// shared/lib/pdf.ts
'use client';

// ✅ 해결: 타입(Type)만 가져옴. 타입은 컴파일 시점에 사라지므로 런타임 에러를 유발하지 않음.
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { RenderParameters } from 'pdfjs-dist/types/src/display/api';

export async function pdfToWebpConverter(file: File): Promise<Blob[]> {
  // 1. 방어 코드: 서버 환경일 경우 실행 중단
  if (typeof window === 'undefined') {
    return [];
  }

  // 2. Dynamic Import: 함수가 실행되는 시점(Client)에 라이브러리를 로드함
  const pdfjsLib = await import('pdfjs-dist');

  // 3. Worker 설정 (로드 후 설정)
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  // ... 이후 로직은 동일 ...
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // ... 생략 ...
}
```

## 📊 가정한 문제 원인

1. **Browser API 의존성 (`DOMMatrix`)**
   - `pdfjs-dist` 라이브러리는 브라우저 환경을 전제로 만들어짐. 내부 코드(`canvas.js`)에서 `new DOMMatrix()`와 같은 브라우저 전용 API를 전역 스코프에서 즉시 호출함.
   - Next.js는 초기 렌더링을 위해 Node.js 환경에서 코드를 실행(SSR)하는데, Node.js에는 `DOMMatrix`가 존재하지 않아 `ReferenceError` 발생.

2. **Top-level Import와 실행 시점**
   - `import * as pdfjsLib ...`을 파일 최상단에 작성하면, 해당 파일이 로드되는 순간 라이브러리 내부 코드가 평가(Evaluation)됨.
   - 'use client' 지시어가 있어도, 서버가 클라이언트 컴포넌트 트리를 구성하기 위해 해당 파일을 읽는 과정에서 라이브러리 코드가 실행되어버림.

3. **Barrel File (`index.ts`)의 부작용**
   - `shared/lib/index.ts`에서 `export * from './pdf'`와 같이 내보내기를 하고 있었음.
   - 다른 컴포넌트가 `pdf` 기능이 아닌 다른 함수(예: `useDialog`)를 `index.ts`에서 가져다 쓰더라도, 번들러/런타임이 `index.ts`에 연결된 모든 파일을 평가하면서 `pdf.ts`도 같이 실행되어 에러가 전파됨.

## 📝 고려한 대안

1. **`client.ts`와 `server.ts` 파일 분리**
   - 파일 구조를 물리적으로 분리하여 서버가 클라이언트 전용 코드를 아예 읽지 못하게 하는 방법.
   - 효과적이나 파일 관리 포인트가 늘어나고, 이번 케이스처럼 특정 라이브러리만 문제인 경우 과한 조치라 판단.

2. **Next.js Config 설정 (transpilePackages 등)**
   - `next.config.js`에서 특정 패키지의 로딩 방식을 제어하려 했으나, `DOMMatrix` 같은 근본적인 브라우저 API 부재 문제는 해결하기 어려움.

3. **Dynamic Import (await import) 채택 (선택함)**
   - 가장 표준적이고(ES Modules), Next.js 공식 문서에서도 권장하는 "Lazy Loading External Libraries" 패턴.
   - 타입 안전성(`import type`)은 유지하면서 런타임 에러만 완벽하게 회피 가능.

## 📚 참고자료

- [Next.js Docs - Lazy Loading External Libraries](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#importing-external-libraries)
- [MDN Web Docs - import()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/import)
- [GitHub Issue: Next.js App Router & PDF.js](https://github.com/vercel/next.js/issues/58313)
