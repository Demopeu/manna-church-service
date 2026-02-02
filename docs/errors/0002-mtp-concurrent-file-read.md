# Error-0002: MTP 프로토콜 동시 파일 읽기 제한

## 📣 해결 여부

해결 - 2026-02-02

## 📋 상황

갤러리 이미지 업로드 기능에서, 휴대폰을 USB로 직접 연결한 상태에서 2장 이상의 사진을 드래그 앤 드롭으로 업로드 시도 시 에러가 발생함. 로컬 파일(컴퓨터 하드디스크/SSD)에서는 10장도 문제없이 업로드되지만, 휴대폰(갤럭시 폴드2)에서 직접 선택 시 1장은 성공하나 2장 이상부터 실패.

```typescript
// features/gallery/lib/use-gallery-images.ts
'use client';

// ❌ 문제의 코드: 모든 파일을 한번에 처리 후 state 업데이트
const addFiles = (files: File[]) => {
  const validFiles = files.filter((f) => f.type.startsWith('image/'));

  const newItems: ImageItem[] = validFiles.map((file) => ({
    id: crypto.randomUUID(),
    file,
    preview: URL.createObjectURL(file), // 여러 파일 동시 처리
    isThumbnail: false,
  }));

  const nextImages = [...images, ...newItems];
  updateImages(nextImages); // React가 여러 <img>를 동시 렌더링
};
```

실행 시 다음과 같은 문제 발생:

- 1장: 정상 업로드 ✅
- 2장 이상: 일부 또는 전체 실패 ❌
- 브라우저 콘솔: "Failed to load file" 또는 타임아웃 에러

## 🔨 해결 방법

파일 처리를 **순차 방식(Sequential Processing)**으로 변경하고, MTP 안정성을 위해 파일 간 50ms 지연을 추가. 처리된 파일들은 배열에 모은 후 마지막에 한 번에 state를 업데이트하여 UI 깜빡임을 방지함.

```typescript
// features/gallery/lib/use-gallery-images.ts
'use client';

// ✅ 해결: async/await + for...of를 사용한 순차 처리 + 50ms 지연
const addFiles = async (files: File[]) => {
  if (images.length + files.length > 10) {
    toast.error('이미지는 최대 10장까지만 등록할 수 있습니다.');
    return;
  }
  const validFiles = files.filter((f) => f.type.startsWith('image/'));
  if (validFiles.length === 0) return;

  const toastId =
    validFiles.length > 1
      ? toast.loading(`이미지 ${validFiles.length}장을 순서대로 처리 중...`)
      : undefined;

  let successCount = 0;
  let failedCount = 0;
  const newItems: ImageItem[] = [];

  // 핵심 1: for...of 루프로 순차 처리
  for (const file of validFiles) {
    try {
      // 핵심 2: MTP 안정성을 위한 50ms 지연 (USB 버퍼 여유 확보)
      await new Promise((resolve) => setTimeout(resolve, 50));

      const preview = URL.createObjectURL(file);
      const hasExistingThumbnail = images.some((p) => p.isThumbnail);
      const isFirstInBatch = newItems.length === 0;

      const newItem: ImageItem = {
        id: crypto.randomUUID(),
        file,
        preview,
        isThumbnail: !hasExistingThumbnail && isFirstInBatch,
      };

      newItems.push(newItem);
      successCount++;
    } catch (error) {
      console.error(`파일 처리 실패: ${file.name}`, error);
      Sentry.captureException(error); // 에러 추적
      failedCount++;
    }
  }

  // 핵심 3: 모든 파일 처리 후 한 번에 state 업데이트 (UI 깜빡임 방지)
  if (newItems.length > 0) {
    const nextImages = [...images, ...newItems];
    updateImages(nextImages);
  }

  if (toastId) {
    toast.dismiss(toastId);
  }

  if (successCount === 0 && failedCount > 0) {
    toast.error('이미지를 불러올 수 없습니다.');
  } else if (failedCount > 0) {
    toast.warning(`${successCount}장 추가 완료 (${failedCount}장 실패)`);
  } else if (validFiles.length > 1) {
    toast.success(`이미지 ${successCount}장이 추가되었습니다.`);
  }
};
```

## 📊 가정한 문제 원인

1. **MTP(Media Transfer Protocol)의 동기식 요청-응답 모델**
   - 휴대폰을 USB로 연결하면 일반 USB 메모리와 달리 MTP 프로토콜을 사용함.
   - MTP는 **한 번에 하나의 파일 전송**만 처리하는 동기식 구조.
   - 브라우저가 여러 파일을 동시에 읽으려 하면 MTP 명령 큐가 초과되어 타임아웃 발생.

2. **React의 동시 렌더링**
   - 기존 코드는 모든 파일을 배열에 담은 후 한번에 state를 업데이트.
   - React는 여러 `<img>` 태그를 병렬 렌더링 시도.
   - 각 `<img>`가 `src="blob:..."`를 로드할 때 동시에 MTP를 통해 파일 데이터를 요청.
   - MTP 드라이버가 동시 요청을 처리하지 못하고 `ERROR_BUSY` 반환.

3. **Windows MTP 드라이버의 제한**
   - Windows MTP 스택은 내부 명령 큐 크기가 2~4개로 매우 작음.
   - 10개 파일 동시 읽기 요청 → 큐 초과 → 나머지 즉시 실패.
   - USB 2.0의 느린 전송 속도 + 대용량 사진(5~15MB) → 각 파일 전송에 3~5초 소요.

4. **구형 디바이스의 성능 한계**
   - 갤럭시 폴드2(2020년 모델)의 MTP 구현은 최신 모델 대비 성능이 낮음.
   - 구형 USB 컨트롤러 + 느린 MTP 응답 속도 → 타임아웃 발생 확률 증가.

## 📝 고려한 대안

1. **파일 크기 제한 및 사전 검증**
   - 업로드 전 각 파일이 3MB 이하인지 체크하여 MTP 전송 시간 단축.
   - 사용자가 원본 사진을 올리지 못하게 되는 제약 발생.

2. **순차 처리만 적용 (지연 없음)**
   - `for...of` 루프로 파일을 하나씩 처리하되 지연 없이 즉시 처리.
   - 테스트 결과 구형 디바이스에서 여전히 불안정성 발생.
   - MTP 드라이버가 연속된 요청을 제대로 처리하지 못하는 경우 존재.

3. **순차 처리 + 50ms 지연 + 배치 업데이트 (선택함)**
   - `for...of` 루프로 파일을 하나씩 처리.
   - 각 파일 사이 50ms 지연으로 MTP 버퍼에 여유 확보 (USB 2.0 환경 고려).
   - 처리된 파일들을 배열에 모은 후 마지막에 한 번만 state 업데이트.
   - UI 깜빡임 방지 및 안정적인 MTP 통신 보장.
   - Sentry를 통한 에러 추적으로 실 사용 환경에서의 문제 모니터링 가능.

4. **고객에게 파일 복사 안내**
   - 휴대폰 사진을 먼저 컴퓨터 폴더로 복사 후 업로드하도록 안내.
   - 임시 해결책으로는 유효하나, 개발자가 코드로 해결하는 것이 더 나은 사용자 경험 제공.

## 📚 참고자료

- [Microsoft Docs - MTP Protocol Specification](https://learn.microsoft.com/en-us/windows/win32/windows-media-format/media-transfer-protocol)
- [MDN Web Docs - URL.createObjectURL()](https://developer.mozilla.org/ko/docs/Web/API/URL/createObjectURL_static)
- [React Docs - State Updates are Queued](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Wikipedia - Media Transfer Protocol](https://en.wikipedia.org/wiki/Media_Transfer_Protocol)
