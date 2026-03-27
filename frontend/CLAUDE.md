@AGENTS.md

# Frontend Architecture Rules

## 디렉토리 구조

```
src/
  app/            ← Next.js 라우팅만. 비즈니스 로직 금지.
    (app)/        ← 인증 필요 페이지 (AppLayout 자동 적용)
    (auth)/       ← 인증 불필요 페이지 (login 등)
  features/       ← 도메인 슬라이스
    account/
      api.ts      ← axios 호출 (백엔드 API 연동)
      hooks.ts    ← useAccounts, useCreateAccount 등
      components/ ← AccountCard, HoldingsTable 등
    market/       ← 환율
    auth/         ← 세션, 초대 코드
  shared/         ← 도메인 무관 공통
    lib/          ← format.ts, api.ts (axios 인스턴스), supabase.ts
    types/        ← 도메인 타입 (index.ts)
    ui/           ← AppLayout, Sidebar, ThemeRegistry
    mock/         ← 개발용 목업 데이터 (API 연동 전 사용)
  theme/          ← MUI 테마 설정
```

## 레이어 Import 규칙 (ESLint이 강제함)

| 레이어 | 허용 import | 금지 import |
|--------|------------|------------|
| `app/` | `features/`, `shared/`, `theme/` | — |
| `features/<domain>/` | `shared/`, `theme/` | 다른 `features/<domain>/` |
| `shared/` | `shared/`, `theme/` | `features/`, `app/` |

**위반 시 `npm run lint`에서 에러가 발생한다.**

## 'use client' 규칙

`'use client'`는 아래 중 하나라도 사용할 때만 추가:
- `useState`, `useEffect`, `useReducer`
- `useRouter`, `usePathname`, `useSearchParams`
- 브라우저 API (`window`, `document`, `navigator`)
- 이벤트 핸들러 (`onClick` 등은 서버 컴포넌트에서도 가능하지만, 상태가 필요하면 client)

서버 컴포넌트에 불필요하게 `'use client'` 추가 금지.

## 스타일 규칙

- **하드코딩 hex 색상 금지** → MUI 테마 토큰 사용
  - `success.main` (초록), `error.main` (빨강)
  - `text.primary`, `text.secondary`, `text.disabled`
  - `primary.main`, `background.default`, `divider`
  - 예외: `theme/index.ts` 내부, 그라디언트 등 토큰으로 표현 불가한 경우
- **MUI import**: 배럴 import 사용 (`from '@mui/material'`), 개별 파일 경로 금지
- **import 순서**: eslint-plugin-import가 자동 정렬. 수동으로 바꾸지 말 것.

## 로직 규칙

- 10줄 이상 비JSX 함수는 컴포넌트 밖으로 추출
  - 도메인 로직 → `features/<domain>/hooks.ts`
  - 순수 변환 함수 → `shared/lib/format.ts`
- 컴포넌트 내부에 헬퍼 함수 정의 금지 (예: `formatExpiry`, `handleSave` 인라인 정의)
- API 호출은 컴포넌트/페이지에 직접 작성 금지 → `features/<domain>/api.ts`에서 관리

## 타입 규칙

- `any` 사용 금지 (ESLint 에러)
- 타입만 import할 때 `import type { Foo }` 사용 (ESLint 에러)
- 타입 단언 (`as Foo`) 최소화, 불가피한 경우 주석으로 이유 기재

## 파일 추가 전 체크리스트

| 추가할 내용 | 올바른 위치 |
|------------|------------|
| 새 도메인 타입 | `shared/types/index.ts` |
| 새 포맷터/유틸 | `shared/lib/format.ts` |
| 새 API 호출 | `features/<domain>/api.ts` |
| 새 상태 로직 | `features/<domain>/hooks.ts` |
| 새 도메인 컴포넌트 | `features/<domain>/components/` |
| 새 공통 UI 컴포넌트 | `shared/ui/` |

기존 파일을 먼저 확인하고, 없을 때만 새 파일 생성.

## API 연동 전환 방법

현재 pages는 `shared/mock`에서 데이터를 가져옴. 백엔드 API 완성 후:
1. `features/<domain>/api.ts` 함수 구현 (현재 TODO 주석 위치)
2. `features/<domain>/hooks.ts`에서 mock → api.ts 호출로 교체
3. pages는 수정 불필요 (hooks만 교체)
