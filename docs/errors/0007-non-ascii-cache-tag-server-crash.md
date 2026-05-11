# Error-0007: 비(非) ASCII 동적 라우트 파라미터로 인한 서버 크래시 (#431)

## 📣 해결 여부

**해결됨 (임시 조치)** - 2026-05-11

## ✅ 해결 방법

**Next.js 버전을 16.2.6에서 16.1.1로 롤백.**

프레임워크 단의 캐시 태그 인코딩 버그가 해결된 패치 버전(16.2.7 예상)이 배포될 때까지 안정성이 검증된 하위 버전으로 회귀하여 서비스 가용성 확보.

---

## 📋 에러 정보

### 에러 로그

```
TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["x-next-cache-tags"]
```

- **환경**: Production (Vercel)
- **URL**: `/news/gallery/[한글제목-id]`, `/news/events/[한글제목-id]` 등 한글 슬러그가 포함된 모든 동적 라우트
- **재현 패턴**: 한글 또는 공백이 포함된 URL로 직접 접속하거나 해당 경로로 클라이언트 사이드 나비게이션 시 발생
- **Node.js 버전**: v24.14.1 (Strict HTTP Header validation 적용 버전)

### 영향 범위

- App Router를 사용하는 프로젝트 내 모든 동적 라우팅 페이지.
- 특히 SEO를 위해 URL Path에 한글 제목(Slug)을 포함하는 게시판형 서비스 전체에 치명적임.

---

## 🔍 원인 분석: Next.js 암묵적 캐시 태깅(Implicit Tagging) 버그

### 발생 기전

1. **Next.js 16.2.x의 변화**: App Router 엔진이 ISR(Incremental Static Regeneration) 최적화를 위해 동적 라우트 파라미터(`[id]`) 값을 `x-next-cache-tags` 헤더에 자동으로 삽입하는 로직을 강화함.
2. **인코딩 누락**: 파라미터에 한글(Non-ASCII)이나 공백이 포함된 경우, 이를 `encodeURIComponent` 등으로 안전하게 변환하여 헤더에 넣어야 하나, Next.js 내부 로직에서 이를 누락함 (GitHub Issue #93142).
3. **Node.js의 거부**: HTTP 표준(RFC 7230)에 따라 헤더 값에는 ASCII 문자만 허용됨. 최신 Node.js 런타임은 비표준 문자가 포함된 헤더 전송 시 `ERR_INVALID_CHAR` 예외를 던지며 프로세스를 즉시 종료함.

### 왜 16.1.1에서는 정상이었는가?

- 해당 버전에서는 동적 파라미터를 응답 헤더에 강제로 주입하는 로직이 없었거나, 헤더 검증 단계 이전에 필터링되어 Node.js의 엄격한 검사망을 피할 수 있었음.

---

## 📊 테스트 및 검증 과정

### 테스트 A: URL 캐릭터 셋 테스트

| 조건                                        | 결과    | 비고                        |
| :------------------------------------------ | :------ | :-------------------------- |
| `/news/gallery/test-1234` (순수 ASCII)      | ✅ 성공 | 헤더에 안전한 문자만 포함됨 |
| `/news/gallery/가을-1234` (한글 포함)       | ❌ 실패 | 서버 크래시 발생            |
| `/news/gallery/spring%20trip-1234` (인코딩) | ✅ 성공 | `%`는 ASCII 문자로 취급됨   |

### 테스트 B: Next.js 버전별 동작 확인

- **16.2.6**: 한글 파라미터 유입 시 `x-next-cache-tags` 헤더에 디코딩된 한글이 그대로 실림 → **실패**.
- **16.1.1**: 동일한 한글 파라미터 유입 시 서버 크래시 없이 정상 렌더링 → **성공**.

---

## 📝 교훈 및 권장 패턴

### 1. 프레임워크의 '자동화 기능'에 대한 경계

- Next.js가 개발자 모르게 주입하는 HTTP 헤더(`x-next-cache-tags`) 등은 인프라 환경(Node.js 버전, CDN 규격)에 따라 예기치 못한 사이드 이펙트를 발생시킬 수 있음.

### 2. 동적 파라미터의 Sanitize 필요성

- 프레임워크가 고쳐지더라도, 가급적 내부 식별자로 사용되는 값(tags 등)은 `encodeURIComponent`를 거치거나 순수 ASCII(ID값)만 추출하여 사용하는 방어적 코딩 패턴이 권장됨.

### 3. 기술적 근거에 기반한 롤백 결정

- 단순히 "안 된다"가 아니라, 업스트림의 버그 리포트(Next.js PR #93601)를 확인하고 기술적 한계를 명확히 인지한 상태에서 롤백을 결정함으로써 팀 내 기술적 부채에 대한 커뮤니케이션 비용을 최소화함.

---

## 📚 관련 자료 및 링크

- **Next.js 공식 버그 리포트**: [GitHub Issue #93142](https://github.com/vercel/next.js/issues/93142)
- **수정 커밋**: [PR #93601 - encode cache tags for non-ASCII paths](https://github.com/vercel/next.js/pull/93601)
- **환경 정보**: Frontend Developer Kim Dong-hyun (SSAFY 11th, Shinsegae Spharos 6th)
