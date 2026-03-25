# 인프라 설정

## 배포 구성 요약

| 컴포넌트 | 플랫폼 | 소스 경로 |
|----------|--------|-----------|
| API 서버 | Railway | `api-server/` |
| 프론트엔드 | Vercel | `frontend/` |
| 데이터베이스 | Supabase PostgreSQL | - |
| 인증 | Supabase Auth | - |

---

## Railway (API 서버)

- **배포 방식**: `api-server/` 내 Dockerfile 기반 빌드
- **Railway 설정**: Root Directory → `api-server/`
- **불필요한 재배포 방지**: `frontend/` 변경 시 Railway 배포 트리거 제외 설정

### 필수 환경변수

| 변수 | 설명 |
|------|------|
| `SPRING_DATASOURCE_URL` | Supabase PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB 사용자명 |
| `SPRING_DATASOURCE_PASSWORD` | DB 비밀번호 |
| `SUPABASE_JWT_SECRET` | Supabase JWT 검증용 secret (또는 JWKS URL) |
| `SUPABASE_PROJECT_URL` | Supabase 프로젝트 URL |

---

## Vercel (프론트엔드)

- **Root Directory**: `frontend/`
- **Framework**: Next.js (자동 감지)
- **불필요한 재배포 방지**: `api-server/` 변경 시 Vercel 배포 트리거 제외

### 필수 환경변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (공개 가능) |
| `NEXT_PUBLIC_API_URL` | Railway API 서버 URL |

---

## Supabase

- **DB**: PostgreSQL (Connection Pooler 사용 권장, 상세는 [database.md](database.md) 참고)
- **Auth**: 이메일/비밀번호 방식 활성화 (상세는 [auth.md](auth.md) 참고)
- **마이그레이션**: Supabase Dashboard > SQL Editor 또는 Supabase CLI

---

## 로컬 개발

로컬에서는 Docker Compose로 PostgreSQL만 실행. Supabase Auth는 로컬 에뮬레이터 또는 실제 Supabase 개발 프로젝트 사용.

```yaml
# docker-compose.yml (예시)
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: share_your_portfolio
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

로컬 `application-local.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/share_your_portfolio
spring.datasource.username=postgres
spring.datasource.password=postgres
```
