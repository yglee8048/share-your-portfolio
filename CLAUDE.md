# Share Your Portfolio

부부가 함께 전체 자산 현황을 확인하고 투자 의사결정을 기록·추적하는 웹 서비스.

## 개발 역할 분담

| 영역 | 담당 |
|------|------|
| `api-server/` (백엔드) | 사용자가 직접 개발 — Claude는 보조 역할만 |
| `frontend/` (프론트엔드) | Claude가 전담 개발 |

백엔드 코드 작업 시에는 요청받은 내용만 수행하고, 프론트엔드는 UI/UX 포함 자율적으로 판단하여 구현.

## 모노레포 구조

```
share-your-portfolio/
├── api-server/     ← Spring Boot (Kotlin), Railway 배포
├── frontend/       ← Next.js (TypeScript), Vercel 배포
├── docs/           ← 상세 문서
└── PLAN.md         ← 기획 및 스프린트 로드맵
```

## 핵심 인프라 결정사항

| 역할 | 서비스 |
|------|--------|
| API 서버 배포 | Railway (`api-server/` 디렉토리) |
| 프론트엔드 배포 | Vercel (`frontend/` 디렉토리) |
| 데이터베이스 | Supabase PostgreSQL |
| 인증 | Supabase Auth (이메일/비밀번호, JWT) |

## 인증 구조 (중요)

Supabase Auth가 JWT를 발급. Spring Boot 서버는 JWT를 직접 발급하지 않고 **검증만** 함.
- 클라이언트 → Supabase Auth로 로그인 → JWT 수신
- 클라이언트 → `Authorization: Bearer <jwt>` 헤더로 API 호출
- Spring Boot → Supabase JWKS 공개키로 JWT 검증

## 상세 문서

- [인프라 설정](docs/infrastructure.md) — Railway, Vercel, Supabase 환경변수 및 배포
- [인증 연동](docs/auth.md) — Supabase Auth + Spring Boot JWT 검증 상세
- [데이터베이스](docs/database.md) — Supabase PostgreSQL 접속, 스키마 전략, 마이그레이션
