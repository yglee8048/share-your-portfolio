# Sprint 1 명세

## 목표

혼자 자산을 입력하고 확인할 수 있는 최소 버전.

**이번 스프린트 제외**: 로그인, 회원가입, 초대, 인증(userId), 대시보드

---

## 화면 목록

| 경로                                         | 화면명   | 주요 기능                 |
|--------------------------------------------|-------|-----------------------|
| `/accounts`                                | 계좌 목록 | 계좌 목록 조회, 신규 계좌 등록 진입 |
| `/accounts/new`                            | 계좌 등록 | 계좌 생성 폼               |
| `/accounts/[id]`                           | 계좌 상세 | 종목 목록 + 수익률, 종목 추가 진입 |
| `/accounts/[id]/edit`                      | 계좌 수정 | 계좌 정보 수정 폼            |
| `/accounts/[id]/holdings/new`              | 종목 등록 | 종목 추가 폼               |
| `/accounts/[id]/holdings/[holdingId]/edit` | 종목 수정 | 종목 정보 수정 폼            |
| `/settings`                                | 설정    | 환율 수동 입력              |

---

## API 명세

### 공통

- Base URL: `/api`
- Content-Type: `application/json`
- 에러 응답: `{ "error": "메시지" }` + HTTP 상태코드

---

### 계좌

#### `GET /api/accounts` — 계좌 목록

**Response 200**

```json
[
  {
    "id": "uuid",
    "institutionName": "미래에셋증권",
    "accountNumber": "123-456-789",
    "accountType": "BROKERAGE",
    "currency": "KRW",
    "nickName": "별칭",
    "createdAt": "2026-03-28T00:00:00Z",
    "updatedAt": "2026-03-28T00:00:00Z"
  }
]
```

---

#### `POST /api/accounts` — 계좌 생성

**Request Body**

```json
{
  "institutionName": "미래에셋증권",
  "accountNumber": "123-456-789",
  "accountType": "BROKERAGE",
  "currency": "KRW",
  "nickName": "별칭"
}
```

| 필드              | 필수 | 설명                                                                    |
|-----------------|----|-----------------------------------------------------------------------|
| institutionName | ✓  | 금융사명 (자유 텍스트, 드롭다운에서 선택)                                              |
| accountNumber   | ✓  | 계좌번호                                                                  |
| accountType     | ✓  | `ISA \| IRP \| DC \| CMA \| BROKERAGE \| DEPOSIT \| SAVINGS \| OTHER` |
| currency        | ✓  | `KRW \| USD \| JPY \| EUR \| GBP \| CNY \| HKD`                       |
| nickName        | -  | 별칭                                                                    |

**Response 201**: 생성된 계좌 객체

---

#### `GET /api/accounts/{id}` — 계좌 상세

**Response 200**: 계좌 객체
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

#### `PUT /api/accounts/{id}` — 계좌 수정

전송한 필드만 업데이트 (partial update).

**Request Body** (모든 필드 optional)

```json
{
  "institutionName": "삼성증권",
  "accountNumber": "987-654-321",
  "accountType": "ISA",
  "currency": "USD",
  "nickName": "수정된 별칭"
}
```

**Response 200**: 수정된 계좌 객체
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

#### `DELETE /api/accounts/{id}` — 계좌 삭제

하위 종목이 남아있으면 삭제 불가.

**Response 204**
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

### 종목

#### `GET /api/accounts/{accountId}/holdings` — 종목 목록

**Response 200**

```json
[
  {
    "id": "uuid",
    "accountId": "uuid",
    "name": "삼성전자",
    "ticker": "005930",
    "assetType": "DOMESTIC_STOCK",
    "currency": "KRW",
    "averageBuyPrice": "75000",
    "quantity": "10",
    "currentPrice": "80000",
    "principal": "750000",
    "currentValue": "800000",
    "profitRate": 6.67,
    "createdAt": "2026-03-28T00:00:00Z",
    "updatedAt": "2026-03-28T00:00:00Z"
  }
]
```

> `principal`, `currentValue`, `profitRate`는 백엔드에서 계산하여 반환.
> `currentPrice`가 null이면 `currentValue == principal`, `profitRate == 0`.

**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

#### `POST /api/accounts/{accountId}/holdings` — 종목 추가

**Request Body**

```json
{
  "name": "삼성전자",
  "ticker": "005930",
  "assetType": "DOMESTIC_STOCK",
  "currency": "KRW",
  "averageBuyPrice": 75000,
  "quantity": 10,
  "currentPrice": 80000
}
```

| 필드              | 필수 | 설명                                                                                                                                                                    |
|-----------------|----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name            | ✓  | 종목명                                                                                                                                                                   |
| assetType       | ✓  | `DOMESTIC_STOCK \| US_STOCK \| OTHER_FOREIGN_STOCK \| DOMESTIC_ETF \| FOREIGN_ETF \| BOND \| DEPOSIT \| SAVINGS \| CASH \| GOLD \| COMMODITY \| REAL_ESTATE \| OTHER` |
| currency        | ✓  | 보유 통화                                                                                                                                                                 |
| averageBuyPrice | ✓  | 매수 평균가                                                                                                                                                                |
| quantity        | ✓  | 수량                                                                                                                                                                    |
| ticker          | -  | 티커                                                                                                                                                                    |
| currentPrice    | -  | 현재가 (null이면 수익률 계산 불가)                                                                                                                                                |

**Response 201**: 생성된 종목 객체 (계산 필드 포함)
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

#### `PUT /api/accounts/{accountId}/holdings/{id}` — 종목 수정

전송한 필드만 업데이트 (partial update).

**Request Body** (모든 필드 optional)

```json
{
  "name": "삼성전자",
  "ticker": "005930",
  "assetType": "DOMESTIC_STOCK",
  "currency": "KRW",
  "averageBuyPrice": 76000,
  "quantity": 15,
  "currentPrice": 82000
}
```

**Response 200**: 수정된 종목 객체 (계산 필드 포함)
**Response 404**: 계좌 또는 종목 없음

---

#### `DELETE /api/accounts/{accountId}/holdings/{id}` — 종목 삭제

**Response 204**
**Response 404**: 계좌 또는 종목 없음

---

### 환율

#### `GET /api/exchange-rates` — 환율 목록

**Response 200**

```json
[
  {
    "currency": "USD",
    "rateToKrw": 1350.50,
    "updatedAt": "2026-03-28T00:00:00Z"
  },
  {
    "currency": "JPY",
    "rateToKrw": 9.12,
    "updatedAt": "2026-03-28T00:00:00Z"
  }
]
```

---

#### `PUT /api/exchange-rates/{currency}` — 환율 입력/수정 (upsert)

path param `currency`: `USD | JPY | EUR | GBP | CNY | HKD`

**Request Body**

```json
{
  "rateToKrw": 1350.50
}
```

**Response 200**: 저장된 환율 객체
**Response 400**: `{ "error": "rateToKrw는 양수여야 합니다." }`

---

## 완료 기준

- [ ] 계좌 생성/수정/삭제/목록/상세 UI 동작
- [ ] 종목 생성/수정/삭제/목록 UI 동작
- [ ] 환율 입력/조회 UI 동작 (settings 페이지)
