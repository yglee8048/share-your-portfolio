# 자산 포트폴리오 공유 서비스 기획안

## Context
부부가 함께 전체 자산 현황을 확인하고 투자 의사결정을 기록·추적하는 웹 서비스.
- Phase 1: 2인(본인 + 아내) 프라이빗 서비스
- Phase 2: 공개 SaaS 서비스

개발 환경: 혼자 / Sprint 1은 주 20h+, 이후 주 5~10h / 웹앱 (모바일 반응형)
기술 스택: Kotlin Spring Boot (Backend) + Next.js TypeScript (Frontend) + PostgreSQL

---

## 기능 명세 (Feature Spec)

### 1. 사용자 인증 / 권한
- 이메일 + 비밀번호 로그인 (Supabase Auth, JWT)
- 초대 방식 회원가입 (초기: 초대 코드 or 이메일 초대)
- 역할: 초기에는 단일 권한 (초대된 사용자는 모든 기능 동일하게 사용 가능)
- Sprint 4에서 Owner / Viewer 권한 분리 예정

### 2. 계좌 관리

**계좌 정보**
- 금융사명, 계좌번호(마스킹), 계좌 유형(ISA / IRP / DC / CMA / 일반주식 / 예금 / 적금 / 기타)
- 계좌 기준 통화(KRW, USD, JPY 등), 메모

**보유 종목**
- 종목명, 티커(선택)
- 자산 유형: 국내주식 / 미국주식 / 기타해외주식 / 국내ETF / 해외ETF / 채권 / 예금 / 적금 / 현금 / 금 / 원자재 / 부동산 / 기타
- 매수 평균가, 수량 → 원금 자동 계산
- 현재가 (수동 입력 → Sprint 6에서 API 자동화)
- 현재 가치, 수익률 자동 계산
- 보유 통화

**연금 계좌 특별 처리**
- 세제 혜택 유형 표시 (세액공제형 / 비과세형)
- 출금 시 예상 세율 (기타소득세 16.5% / 연금소득세 3.3~5.5%)
- 세후 출금 가능 금액 계산

### 3. 포트폴리오 대시보드
- 전체 자산 총액 (기준 통화: KRW)
- 환 노출 비율 차트 (KRW / USD / JPY / 기타)
- 자산군 배분 차트 (주식 / 채권 / 예적금 / 현금 / 금 / 원자재 / 부동산)
  - 주식 세부: 국내 / 미국 / 기타해외
- 연금성 자산 vs 일반 자산 비율
- **커스텀 태그**: 종목에 자유 태그 부여 → 태그별 집계 가능
- 환율: 수동 입력 (Sprint 6에서 API 자동화)

### 4. 포트폴리오 공유
- 이메일 초대로 특정 사용자에게 내 포트폴리오 공유
- 공유 대상도 동일한 권한 (읽기/쓰기 모두 가능) — 권한 분리는 Sprint 4에서 구현
- 공유 범위 설정: Sprint 4에서 구현 (전체 공개 or 특정 계좌 제외)

### 5. 투자 판단 일지
- 날짜/시간, 종목, 매수/매도, 수량, 가격, 판단 이유 (마크다운 지원)
- 시장 상황 메모 (옵션)
- 추적: 판단 시점 대비 현재 수익률 자동 계산
- 회고: 결과에 대한 코멘트 추가

### 6. 연간 성과 트래킹
- 연도별 수익률 기록
  - 실질 수익률 = (연말 자산 - 연초 자산 - 순입금) / 연초 자산
- 벤치마크 설정: 코스피 / S&P 500 / 나스닥 / 커스텀 (수동 입력 → 추후 API)
- 벤치마크 대비 알파 수익률 표시
- 연도별 성과 차트

---

## 로드맵 / 스프린트

### Sprint 1 — Foundation & MVP Core (1주, 20h+)
**목표**: 실제로 쓸 수 있는 최소 버전. 아내와 함께 자산 입력 시작 가능한 수준.

기능:
- 프로젝트 셋업 (모노레포 or 분리 레포)
- DB 스키마 설계 (users, accounts, holdings, exchange_rates)
- Kotlin Spring Boot 프로젝트: JWT 인증, 계좌/종목 CRUD API
- Next.js 프로젝트: 로그인, 계좌 CRUD UI, 기본 대시보드
- 환율 수동 입력
- 총 자산 합산 계산 (환율 반영)
- 초대제 회원가입 (간단한 초대 코드 방식)

화면:
- `/login` - 로그인
- `/` - 대시보드 (총 자산, 계좌별 요약)
- `/accounts` - 계좌 목록
- `/accounts/[id]` - 계좌 상세 (종목 목록, 수익률)
- `/settings` - 환율 입력, 초대 코드 관리

---

### Sprint 2 — Portfolio Visualization (3주, 5~10h/week)
**목표**: 자산 구성을 시각적으로 파악 가능.

기능:
- 자산군 배분 차트 (도넛 차트)
- 환 노출 비율 차트
- 연금성 자산 비율
- 커스텀 태그 기능
- 모바일 반응형 완성도

화면:
- `/portfolio` - 포트폴리오 개요 (차트 + 요약 카드)

---

### Sprint 3 — Investment Journal (3주)
**목표**: 투자 판단 기록 및 결과 추적.

기능:
- 투자 일지 CRUD (마크다운 지원)
- 판단 시점 수익률 추적
- 회고 코멘트 기능

화면:
- `/journal` - 투자 일지 목록
- `/journal/[id]` - 일지 상세 + 수익률 추적

---

### Sprint 4 — Portfolio Sharing (2주)
**목표**: 아내와 포트폴리오 공유 완성.

기능:
- 이메일 초대 공유
- **권한 분리 구현**: Owner(수정 가능) / Viewer(읽기 전용) 역할 도입
- 공유 범위 설정 (계좌 단위 제외 기능)

화면:
- `/settings/sharing` - 공유 관리
- `/shared/[userId]` - 공유된 포트폴리오 열람

---

### Sprint 5 — Annual Performance (3주)
**목표**: 연간 수익률 vs 벤치마크 비교.

기능:
- 연도별 자산 스냅샷 (연말 기록)
- 실질 수익률 계산 (입출금 반영)
- 벤치마크 수동 입력 + 비교 차트

화면:
- `/performance` - 연간 성과 페이지

---

### Sprint 6 — API Integration (4주+)
**목표**: 자산 가격/환율 자동 조회.

기능:
- 국내 주식 시세 (한국투자증권 Open API or KRX)
- 해외 주식 시세 (Yahoo Finance / Polygon.io)
- 환율 자동 조회 (한국수출입은행 API)
- 가격 자동 업데이트 스케줄러

---

### Sprint 7+ — Public Launch Prep
**목표**: 공개 서비스 전환.

기능:
- 멀티테넌트 강화 (데이터 격리)
- 자산 정보 암호화 (DB 레벨)
- 온보딩 플로우
- 배포 인프라 구성 (Vercel + Railway, 모노레포 기반)
- 사용성 개선 (실사용 피드백 반영)
- 비즈니스 모델 결정 (무료 / 프리미엄)

---

### Sprint 8 — 거장 포트폴리오 & 벤치마킹
**목표**: 유명 투자자의 포트폴리오를 참고하고 내 포트폴리오에 적용.

기능:
- **거장 포트폴리오 DB**: 워런 버핏, 레이 달리오, 피터 린치 등 주요 투자자 포트폴리오
  - 출처: 13F 공시(미국 주식), 운용사 공개 정보
  - 주요 종목 비중, 자산군 배분 전략 요약
- 거장 포트폴리오 상세 뷰: 철학, 전략, 현재 주요 포지션
- **채택 기능**: 거장의 배분 비율을 내 목표 포트폴리오로 복사 → 리밸런싱 기준으로 활용

화면:
- `/explore` — 거장 포트폴리오 갤러리
- `/explore/[name]` — 거장 포트폴리오 상세 + 내 포트폴리오 비교

---

### Sprint 9 — 포트폴리오 평가 & 리스크 분석
**목표**: 내 포트폴리오 구성을 다양한 기준으로 평가.

기능:
- **포트폴리오 점수화**: 분산도, 변동성, 환 노출, 유동성 등 항목별 평가
- **리스크 분석**: 특정 자산군/국가/섹터 집중도 경고
- **목표 배분 설정**: 이상적인 포트폴리오 비율 직접 설정
- 현재 vs 목표 배분 비교 시각화

화면:
- `/portfolio/analysis` — 포트폴리오 평가 리포트

---

### Sprint 10 — 리밸런싱 & 분할매수 플래너
**목표**: 목표 포트폴리오에 도달하기 위한 실행 계획 수립.

기능:
- **리밸런싱 시뮬레이터**:
  - 현재 배분 vs 목표 배분 비교
  - 목표에 맞추려면 어떤 종목을 얼마나 사고 팔아야 하는지 계산
  - 세금/거래비용 고려 옵션
- **분할매수 플래너**:
  - 특정 종목의 매수 계획 수립 (기간, 총 금액, 분할 횟수)
  - 예정 분할매수 일정 관리 (캘린더 뷰)
  - 실제 매수 체결 시 투자 일지와 자동 연동
- 추가 입금 시 목표 배분 기준 최적 매수 종목 제안

화면:
- `/portfolio/rebalance` — 리밸런싱 시뮬레이터
- `/portfolio/dca` — 분할매수 플래너

---

## 네비게이션 구조

```
사이드바 (데스크탑) / 하단 탭 (모바일)
├── 대시보드           (Sprint 1)
├── 계좌               (Sprint 1)
├── 포트폴리오          (Sprint 2)
│   ├── 개요
│   ├── 평가/리스크     (Sprint 9)
│   ├── 리밸런싱        (Sprint 10)
│   └── 분할매수        (Sprint 10)
├── 투자 일지           (Sprint 3)
├── 성과               (Sprint 5)
└── 거장 포트폴리오     (Sprint 8)
```

---

## DB 스키마 (Sprint 1)

### public.profiles
Supabase Auth가 `auth.users` 테이블을 관리. 앱은 `public.profiles`로 확장 정보만 저장.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | auth.users.id와 동일 |
| name | VARCHAR | 표시 이름 |
| created_at | TIMESTAMP | |

### accounts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → users | |
| institution_name | VARCHAR | 금융사명 |
| account_number | VARCHAR | 마스킹 처리 |
| account_type | ENUM | ISA/IRP/DC/CMA/BROKERAGE/DEPOSIT/SAVINGS/OTHER |
| currency | VARCHAR | KRW, USD, JPY 등 |
| memo | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### holdings
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| account_id | UUID FK → accounts | |
| name | VARCHAR | 종목명 |
| ticker | VARCHAR NULL | 티커 |
| asset_type | ENUM | DOMESTIC_STOCK/US_STOCK/... |
| currency | VARCHAR | |
| average_buy_price | NUMERIC | 매수 평균가 |
| quantity | NUMERIC | 수량 |
| current_price | NUMERIC NULL | 현재가 (수동 입력) |
| tags | TEXT[] | 커스텀 태그 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### exchange_rates
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → users | |
| currency | VARCHAR | USD, JPY 등 |
| rate_to_krw | NUMERIC | 1 단위 → KRW |
| updated_at | TIMESTAMP | |

### invitations
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| owner_id | UUID FK → users | |
| code | VARCHAR(8) UNIQUE | 초대 코드 |
| used | BOOLEAN | |
| used_by_id | UUID FK NULL | |
| created_at | TIMESTAMP | |
| expires_at | TIMESTAMP | |

---

## API 명세 (Sprint 1)

### 인증
| Method | Path | 설명 |
|--------|------|------|
| POST | /api/auth/login | 로그인 → JWT 발급 |
| POST | /api/auth/register | 초대 코드로 회원가입 |

### 계좌
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/accounts | 내 계좌 목록 |
| POST | /api/accounts | 계좌 생성 |
| GET | /api/accounts/{id} | 계좌 상세 |
| PUT | /api/accounts/{id} | 계좌 수정 |
| DELETE | /api/accounts/{id} | 계좌 삭제 |

### 종목
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/accounts/{accountId}/holdings | 종목 목록 |
| POST | /api/accounts/{accountId}/holdings | 종목 추가 |
| GET | /api/accounts/{accountId}/holdings/{id} | 종목 상세 |
| PUT | /api/accounts/{accountId}/holdings/{id} | 종목 수정 |
| DELETE | /api/accounts/{accountId}/holdings/{id} | 종목 삭제 |

### 환율
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/exchange-rates | 환율 목록 |
| PUT | /api/exchange-rates/{currency} | 환율 수동 입력 |

### 대시보드
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/dashboard | 총 자산 + 계좌별 요약 |

### 초대 코드
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/invitations | 초대 코드 목록 |
| POST | /api/invitations | 코드 생성 |
| DELETE | /api/invitations/{code} | 코드 삭제 |

---

## 미결 사항

1. **초대 방식**: 초대 코드 방식(단순)으로 Sprint 1 시작 → Sprint 4에서 이메일 초대로 전환 검토
2. **세금 계산 상세도**: Sprint 1에서는 단순 % 표시, 이후 스프린트에서 세율 구간 계산 추가
3. **공개 서비스 비즈니스 모델**: Sprint 7 결정 (무료 기본 / 유료 프리미엄)
4. **연간 스냅샷 생성 방식**: Sprint 5에서 결정 (자동 스케줄러 vs 수동 저장)

---

## 기술 스택 상세

### Backend
- Kotlin 2.2.21 + Spring Boot 4.0.4 (Java 25)
- Spring Data JDBC (JPA/Hibernate 미사용)
- Spring Modulith 2.0.3 (모듈형 아키텍처)
- Spring WebMVC + REST Client
- Spring Security (JWT 검증 — Supabase Auth 발급 토큰 검증만)
- PostgreSQL (Supabase, 상세는 [docs/database.md](docs/database.md) 참고)

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Material UI (@mui/material 6.x)
- Recharts (차트)
- React Hook Form (폼 관리)
- Axios (HTTP 클라이언트)
- Supabase JS SDK (@supabase/supabase-js)

### Infrastructure
- Docker Compose (로컬 개발 — PostgreSQL만)
- Frontend 배포: Vercel (Next.js, GitHub 연동 자동 배포)
- Backend 배포: Railway (Spring Boot, Dockerfile 기반)
- Database: Supabase PostgreSQL (Connection Pooler)
- 인증: Supabase Auth (이메일/비밀번호, JWT)

상세 설정: [docs/infrastructure.md](docs/infrastructure.md), [docs/auth.md](docs/auth.md)

### 레포 구조
- **모노레포** (단일 git 레포)
- Vercel: Root Directory → `frontend/` 지정
- Railway: Root Directory → `backend/` 지정
- `frontend/vercel.json`에 ignore 커맨드 설정 → backend 변경 시 불필요한 재배포 방지

```
share-your-portfolio/       ← 단일 git 레포
├── api-server/             ← Railway 배포 (Spring Boot)
├── frontend/               ← Vercel 배포 (Next.js)
├── docs/                   ← 인프라/인증/DB 상세 문서
├── docker-compose.yml      ← 로컬 개발용 (PostgreSQL)
├── CLAUDE.md               ← Claude agent용 핵심 컨텍스트
└── PLAN.md
```
