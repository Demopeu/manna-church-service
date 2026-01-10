## 📁 Naming Convention

프로젝트의 가독성과 유지보수성을 위해 파일 및 컴포넌트 명명 규칙을 엄격히 구분하여 적용합니다.

### 1. File & Folder Naming

- **PascalCase**: React 컴포넌트 파일 (`.tsx`)
  - UI를 렌더링하는 컴포넌트와 파일명을 일치시켜 시각적 인지력을 높입니다.
  - 예: `LoginForm.tsx`, `AdminInput.tsx`
- **kebab-case**: 로직, 스키마, 유틸리티, 폴더명 (`.ts`, 폴더)
  - 순수 로직과 UI 컴포넌트를 명확히 분리하고, OS 간 파일 시스템 호환성을 보장합니다.
  - 예: `login-schema.ts`, `use-auth.ts`, `auth-feature/`

### 2. 레이어별 적용 예시 (FSD 구조)

```text
src/features/auth/
├── model/
│   └── login-schema.ts   # (Logic) kebab-case
└── ui/
    └── LoginForm.tsx     # (UI) PascalCase
```

## 🛠️ Git Workflow & Convention

이 프로젝트는 빠르고 효율적인 개발을 위해 **GitHub Flow** 전략을 따릅니다.
Main 브랜치를 항상 배포 가능한 상태로 유지하며, 기능 단위로 브랜치를 관리합니다.

### 1. Branch Strategy (GitHub Flow)

- **main**: 제품으로 출시 가능한 소스 코드를 모아두는 기준 브랜치입니다.
- **feature**: 기능을 개발하는 브랜치입니다. 이슈 단위로 생성하며 작업 후 `main`에 병합(Squash & Merge)됩니다.

### 2. Branch Naming

브랜치명은 `타입/기능명-#이슈번호` 형식을 따릅니다. 이슈 추적을 위해 이슈 번호를 반드시 포함합니다.

- 예시: `feature/login-ui-#1`
- 예시: `fix/login-error-#2`

### 3. Commit Message Convention

협업과 유지보수를 위해 **Conventional Commits** 규칙을 준수합니다.

| 타입       | 설명                                           |
| ---------- | ---------------------------------------------- |
| `feat`     | 새로운 기능 추가                               |
| `fix`      | 버그 수정                                      |
| `design`   | CSS 등 사용자 UI 디자인 변경                   |
| `refactor` | 코드 리팩토링 (기능 변경 없음)                 |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음) |
| `docs`     | 문서 수정 (README 등)                          |
| `chore`    | 빌드 업무, 패키지 매니저 설정 등               |

**작성 예시:**

```text
feat: 로그인 유효성 검사 로직 구현
design: 메인 페이지 배너 스타일 수정
```

### 4. Work Process (Issue Driven Development)

모든 작업은 이슈 생성부터 시작됩니다.

1.  **Issue 생성**: 작업할 내용을 GitHub Issue로 등록합니다.
2.  **Branch 생성**: `main` 브랜치에서 새로운 기능 브랜치를 생성합니다. (`git checkout -b feature/name-#1`)
3.  **Code & Commit**: 작업을 진행하고 컨벤션에 맞춰 커밋합니다.
4.  **Pull Request**: 작업이 완료되면 PR을 생성합니다. 내용에 `Closes #이슈번호`를 기재하여 이슈를 자동으로 종료합니다.
5.  **Merge**: 코드 리뷰(Self-Review) 후 `main` 브랜치로 병합합니다.
