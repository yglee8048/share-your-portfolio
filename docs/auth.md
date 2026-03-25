# 인증 연동 (Supabase Auth + Spring Boot)

## 인증 흐름

```
[Client]
  1. Supabase Auth SDK로 이메일/비밀번호 로그인
  2. Supabase가 access_token (JWT) 반환
  3. API 호출 시 헤더에 포함: Authorization: Bearer <access_token>

[Spring Boot API Server]
  4. JWT 수신 → Supabase JWKS 공개키로 서명 검증
  5. JWT payload에서 sub (user UUID) 추출 → 요청 사용자 식별
```

Spring Boot는 JWT를 **발급하지 않음**. 검증만 담당.

---

## Spring Boot JWT 검증 설정

Supabase JWT는 HS256(secret) 또는 RS256(JWKS) 방식으로 검증.

### HS256 방식 (Supabase JWT Secret 직접 사용)

`application.properties`:
```properties
supabase.jwt.secret=${SUPABASE_JWT_SECRET}
```

Spring Security OAuth2 Resource Server 설정:
```properties
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://<project-ref>.supabase.co/auth/v1/keys
```
또는 직접 secret으로 검증하는 필터 구현.

### JWT에서 사용자 식별

JWT payload 예시:
```json
{
  "sub": "uuid-of-user",          ← public.profiles.id FK
  "email": "user@example.com",
  "role": "authenticated",
  "exp": 1234567890
}
```

`sub` 값이 Supabase `auth.users.id`와 동일 → `public.profiles.id`의 FK 기준.

---

## 초대 방식 회원가입

Supabase Auth와 초대 코드 방식 연동 전략:

1. **회원가입 흐름**:
   - 클라이언트가 초대 코드와 함께 회원가입 요청 → API 서버가 코드 유효성 검증
   - 유효하면 Supabase Auth Admin API로 사용자 생성 (서버 사이드)
   - 또는: 클라이언트가 Supabase Auth로 직접 가입 → 가입 완료 후 API 서버에 초대 코드 제출

2. **권장 방식 (Sprint 1)**: 클라이언트가 Supabase Auth로 가입 → API 서버에 초대 코드 검증 요청 → 유효 시 `public.profiles` 레코드 생성

---

## Supabase Auth 설정 (Dashboard)

- Authentication > Providers > Email: 활성화
- Authentication > Settings > Sign Up: 필요 시 비활성화 (초대 코드로만 가입 가능하게)
- JWT Expiry: 기본 3600초 (필요 시 조정)

---

## 환경변수

| 변수 | 설명 | 사용처 |
|------|------|--------|
| `SUPABASE_JWT_SECRET` | JWT 서명 검증용 secret | api-server |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | frontend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | frontend |
