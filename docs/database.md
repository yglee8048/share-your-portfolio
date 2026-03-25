# 데이터베이스 (Supabase PostgreSQL)

## 접속 방식

Supabase는 두 가지 접속 엔드포인트 제공:

| 방식 | 용도 | 포트 |
|------|------|------|
| Direct Connection | 마이그레이션, 관리 작업 | 5432 |
| Connection Pooler (Supavisor) | 애플리케이션 런타임 | 6543 |

**Spring Boot (api-server)는 Connection Pooler 사용 권장.**

```properties
# Transaction mode (Spring Data JDBC에 적합)
spring.datasource.url=jdbc:postgresql://<project-ref>.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 스키마 전략

Supabase는 `auth` 스키마를 자체 관리. 앱은 `public` 스키마만 사용.

```
auth.users          ← Supabase Auth 관리 (직접 수정 X)
public.profiles     ← 앱 사용자 프로필 (auth.users.id FK)
public.accounts     ← 계좌
public.holdings     ← 보유 종목
public.exchange_rates
public.invitations
```

---

## DB 스키마 (Sprint 1)

### public.profiles
`auth.users`의 UUID를 기본키로 사용 (password_hash 없음 — Auth 책임).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | auth.users.id와 동일 |
| name | VARCHAR | 표시 이름 |
| created_at | TIMESTAMP | |

### public.accounts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → profiles | |
| institution_name | VARCHAR | 금융사명 |
| account_number | VARCHAR | 마스킹 처리 |
| account_type | VARCHAR | ISA/IRP/DC/CMA/BROKERAGE/DEPOSIT/SAVINGS/OTHER |
| currency | VARCHAR | KRW, USD, JPY 등 |
| memo | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### public.holdings
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| account_id | UUID FK → accounts | |
| name | VARCHAR | 종목명 |
| ticker | VARCHAR NULL | 티커 |
| asset_type | VARCHAR | DOMESTIC_STOCK/US_STOCK/FOREIGN_STOCK/DOMESTIC_ETF/FOREIGN_ETF/BOND/DEPOSIT/SAVINGS/CASH/GOLD/COMMODITY/REAL_ESTATE/OTHER |
| currency | VARCHAR | |
| average_buy_price | NUMERIC | 매수 평균가 |
| quantity | NUMERIC | 수량 |
| current_price | NUMERIC NULL | 현재가 (수동 입력) |
| tags | TEXT[] | 커스텀 태그 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### public.exchange_rates
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → profiles | |
| currency | VARCHAR | USD, JPY 등 |
| rate_to_krw | NUMERIC | 1단위 → KRW |
| updated_at | TIMESTAMP | |

### public.invitations
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| owner_id | UUID FK → profiles | |
| code | VARCHAR(8) UNIQUE | 초대 코드 |
| used | BOOLEAN | |
| used_by_id | UUID FK NULL → profiles | |
| created_at | TIMESTAMP | |
| expires_at | TIMESTAMP | |

---

## 마이그레이션

- **Supabase Dashboard** > SQL Editor: 초기 스키마 생성에 사용
- **Supabase CLI**: `supabase db push` / `supabase migration` (팀 협업 시 권장)
- Spring Boot Flyway는 선택적으로 추가 가능 (Connection Pooler의 Transaction mode와 충돌 주의 → Session mode 사용 필요)

---

## Row Level Security (RLS)

Supabase는 기본적으로 RLS 활성화. `public.profiles` 등 테이블에 정책 설정 필요.
Spring Boot에서 service role key 사용 시 RLS 우회 가능 (서버 사이드 전용).
