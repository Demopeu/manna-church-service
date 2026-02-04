# Error-0004: Supabase ILIKE 연산자 타입 불일치 에러

## 📣 해결 여부

해결 - 2026-02-05

## 📋 Sentry 에러 로그

### 에러 정보

```
Level: Error
Message: Failed to fetch bulletins: operator does not exist: date ~~* unknown
Environment: vercel-production
URL: /bulletins?page=1&q=d
```

**Stack Trace:**

```
entities/bulletin/api/queries.ts at line 39:17
widgets/bulletin-list/ui/BulletinsList.tsx at line 24:37
shared/ui/utils/withAsyncBoundary.tsx at line 17:14
```

**HTTP Request:**

```
GET /bulletins
Query String: page=1, q=d
Host: manna-church-service.vercel.app
```

**Trace 정보:**

- Trace ID: fea736b490e74ad9b0072e39ce45dea4
- Duration: 360.83ms (HTTP server), 309.24ms (Supabase HTTP client)
- Browser: Chrome 144
- Release: 975e6d5655ee

### 에러 발생 원인

주보 목록 페이지에서 텍스트 검색 기능을 구현할 때, `published_at` 컬럼(timestamptz/date 타입)에 대해 `ilike` 연산자를 사용하려고 시도했기 때문에 발생했다.

PostgreSQL의 `ilike` 연산자는 대소문자를 구분하지 않는 패턴 매칭을 수행하는데, 이는 text 타입 컬럼에만 사용할 수 있다. date나 timestamptz 같은 날짜/시간 타입에는 사용할 수 없다.

기존 코드에서는 날짜를 텍스트로 변환하려고 `published_at::text` 형태로 타입 캐스팅을 시도했지만, Supabase의 PostgREST 클라이언트는 이런 PostgreSQL 네이티브 캐스팅 문법을 지원하지 않는다. 결과적으로 Supabase는 date 타입 컬럼에 직접 `~~*` 연산자(ilike의 내부 구현)를 적용하려고 했고, 타입 불일치로 인해 에러가 발생했다.

## 🔨 해결 방법

텍스트 검색 기능을 완전히 제거하고, 년도와 월을 선택할 수 있는 Select 컴포넌트 기반의 필터링 시스템으로 전면 변경했다.

### 변경 사항

**1. 검색 UI 변경**

- 기존의 SearchInput 컴포넌트(텍스트 입력)를 제거했다
- 년도 Select와 월 Select 두 개의 드롭다운을 제공하는 YearMonthSelect 컴포넌트를 새로 만들었다
- 각 Select에는 "전체" 옵션(value=0)을 추가하여 필터링 없이 전체 데이터를 볼 수 있게 했다

**2. URL 파라미터 구조 변경**

- 기존: `?q=검색어&page=1` 형태의 텍스트 검색 방식
- 변경: `?year=2026&month=2&page=1` 형태의 구조화된 필터링 방식
- 년도나 월을 선택하지 않으면(전체) 파라미터에 0이 전달된다

**3. 데이터베이스 쿼리 로직 변경**

- 텍스트 패턴 매칭(ilike) 방식을 완전히 제거했다
- 대신 날짜 범위 필터링(gte, lt) 방식으로 변경했다
- 특정 년도와 월이 선택되면, 해당 년월의 시작일과 종료일을 계산하여 범위 검색을 수행한다
- 년도만 선택되면 해당 년도 전체(1월 1일~12월 31일)를 범위로 검색한다
- 둘 다 "전체"(0)로 선택되면 필터링을 적용하지 않고 모든 데이터를 반환한다

**4. 날짜 처리 표준화**

- 현재 년도와 월을 가져오는 로직을 shared/lib/date.ts에 getCurrentYearMonth 함수로 분리했다
- 기존에 사용하던 new Date() 직접 호출을 제거하고, date-fns 라이브러리의 getYear, getMonth 함수를 사용하도록 통일했다
- 이를 통해 프로젝트 전체에서 날짜 처리 방식을 일관성 있게 관리할 수 있게 되었다

## 📊 기술적 원인 분석

### ILIKE 연산자와 Date 타입 불일치

PostgreSQL에서 `ilike` 연산자(내부적으로 `~~*` 연산자)는 대소문자를 구분하지 않는 텍스트 패턴 매칭을 수행한다. 이 연산자는 반드시 양쪽 피연산자가 모두 text 타입이어야 한다.

문제가 된 코드에서는 `published_at` 컬럼이 `timestamptz` 타입(PostgreSQL의 날짜/시간 타입)인데, 여기에 text 전용 연산자인 `ilike`를 사용하려고 했다.

일반적인 PostgreSQL에서는 `published_at::text`처럼 명시적으로 타입을 캐스팅하면 이 문제를 해결할 수 있지만, Supabase의 PostgREST 클라이언트 라이브러리는 이런 PostgreSQL 네이티브 타입 캐스팅 문법을 지원하지 않는다.

결과적으로 Supabase는 타입 캐스팅 없이 date 타입 컬럼에 직접 `~~*` 연산자를 적용하려고 시도했고, PostgreSQL 엔진 레벨에서 "date 타입과 unknown 타입 간에 `~~*` 연산자가 존재하지 않는다"는 타입 시스템 에러를 발생시켰다.

### PostgREST의 제약사항

Supabase PostgREST는 RESTful API를 통해 데이터베이스에 접근하는 구조이기 때문에, 모든 PostgreSQL 기능을 직접 사용할 수는 없다. 특히 다음과 같은 제약이 있다:

- SQL 함수나 표현식을 필터 조건에 직접 사용할 수 없다
- 타입 캐스팅 문법(`::type`)을 쿼리에서 사용할 수 없다
- 컬럼명과 값만을 사용한 단순한 필터링만 지원한다

이런 고급 기능이 필요한 경우 Database Function(RPC)을 만들어서 호출하거나, Database View를 생성하여 사용해야 한다.

## 🎯 핵심 개념 정리

### PostgREST 쿼리 제약사항

1. **filter()는 컬럼명만 받음**
   - SQL 함수나 표현식 사용 불가
   - `extract()`, `date_trunc()` 등 불가

2. **타입 캐스팅 제한**
   - `::text` 같은 PostgreSQL 캐스팅 지원 안 함
   - 연산자와 컬럼 타입이 반드시 일치해야 함

3. **권장 접근법**
   - 범위 쿼리 사용: `gte()`, `lt()`, `lte()`
   - 복잡한 로직은 RPC 또는 View 활용
   - 가능하면 클라이언트 로직으로 해결

### Supabase 베스트 프랙티스

```typescript
// ✅ 권장: 범위 쿼리
queryBuilder.gte('published_at', startDate).lt('published_at', endDate);

// ✅ 권장: 단순 필터
queryBuilder.eq('status', 'published');

// ❌ 비권장: SQL 함수
queryBuilder.filter('extract(month from date)', 'eq', 2);

// ❌ 비권장: 타입 캐스팅
queryBuilder.ilike('date::text', '%2026%');
```

## 📚 참고자료

- [PostgREST - Horizontal Filtering](https://postgrest.org/en/stable/references/api/tables_views.html#horizontal-filtering-rows)
- [Supabase - Database Functions](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL - Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html)
- [Supabase - Type Casting](https://github.com/supabase/postgrest-js/issues/344)
