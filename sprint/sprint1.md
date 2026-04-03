# Sprint 1 명세

## 목표

혼자 자산을 입력하고 확인할 수 있는 최소 버전.

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

---

## 공통 타입

### `CodeLabel`

백엔드 enum 응답 공통 형태. 프론트엔드는 `label`을 화면에 표시하고, `code`를 요청 시 전송한다.

```json
{
  "code": "DOMESTIC_STOCK",
  "label": "국내주식"
}
```

---

## API 명세

### 공통

- Base URL: `/api`
- Content-Type: `application/json`
- 에러 응답: `{ "error": "메시지" }` + HTTP 상태코드

---

## 메타 (드롭다운 목록)

### `GET /api/meta/institutions` — 금융기관 목록

**Response 200**

```json
[
  {
    "code": "NH_INVESTMENT_SECURITIES",
    "label": "NH나무증권"
  },
  {
    "code": "MIRAE_ASSET_SECURITIES",
    "label": "미래에셋증권"
  },
  {
    "code": "KOREA_INVESTMENT_SECURITIES",
    "label": "한국투자증권"
  },
  {
    "code": "MIRAE_ASSET_INSURANCE",
    "label": "미래에셋보험"
  },
  {
    "code": "KAKAO_BANK",
    "label": "카카오뱅크"
  },
  {
    "code": "NH_BANK",
    "label": "농협은행"
  },
  {
    "code": "SHINHAN_BANK",
    "label": "신한은행"
  },
  {
    "code": "NAVER_PAY",
    "label": "네이버페이"
  },
  {
    "code": "KAKAO_PAY",
    "label": "카카오페이"
  }
]
```

---

### `GET /api/meta/account-types` — 계좌 유형 목록

**Response 200**

```json
[
  {
    "code": "DEMAND_DEPOSIT",
    "label": "입출금"
  },
  {
    "code": "SUBSCRIPTION_ACCOUNT",
    "label": "청약통장"
  },
  {
    "code": "CMA",
    "label": "CMA"
  },
  {
    "code": "ISA",
    "label": "ISA"
  },
  {
    "code": "IRP",
    "label": "IRP"
  },
  {
    "code": "PENSION_FUND",
    "label": "연금저축펀드"
  },
  {
    "code": "VARIABLE_ANNUITY",
    "label": "변액연금보험"
  },
  {
    "code": "DC",
    "label": "DC"
  },
  {
    "code": "DB",
    "label": "DB"
  }
]
```

---

### `GET /api/meta/asset-types` — 자산 유형 목록

**Response 200**

```json
[
  {
    "code": "CASH",
    "label": "현금"
  },
  {
    "code": "DEPOSIT",
    "label": "예금"
  },
  {
    "code": "SAVINGS",
    "label": "적금"
  },
  {
    "code": "NOTE",
    "label": "어음"
  },
  {
    "code": "RP",
    "label": "RP"
  },
  {
    "code": "MMF",
    "label": "MMF"
  },
  {
    "code": "DOMESTIC_STOCK",
    "label": "국내주식"
  },
  {
    "code": "FOREIGN_STOCK",
    "label": "해외주식"
  },
  {
    "code": "DOMESTIC_BOND",
    "label": "국내채권"
  },
  {
    "code": "FOREIGN_BOND",
    "label": "해외채권"
  },
  {
    "code": "GOLD",
    "label": "금"
  },
  {
    "code": "COMMODITY",
    "label": "원자재"
  }
]
```

---

### `GET /api/meta/assets?q={query}` — 자산 검색 (자동완성)

종목명으로 검색하여 자산 메타 정보 목록을 반환한다. 종목 등록/수정 폼의 자동완성에 사용.

**Query Parameters**

| 파라미터 | 필수 | 설명                     |
|--------|-----|------------------------|
| q      | ✓   | 검색어 (종목명 부분 일치, 최대 10건) |

**Response 200**

```json
[
  {
    "name": "삼성전자",
    "asset_type_code": "DOMESTIC_STOCK",
    "asset_type_label": "국내주식",
    "currency_exposure": false
  },
  {
    "name": "Apple (AAPL)",
    "asset_type_code": "FOREIGN_STOCK",
    "asset_type_label": "해외주식",
    "currency_exposure": true
  }
]
```

| 필드                | 타입     | 설명                                  |
|-------------------|--------|-------------------------------------|
| name              | string | 종목명                                 |
| asset_type_code   | string | 자산 유형 코드                            |
| asset_type_label  | string | 자산 유형 표시명                           |
| currency_exposure | boolean | 환노출 여부 (true = 환노출Y, false = 환노출N) |

---

## 계좌

### 계좌 응답 객체 (`Account`)

```json
{
  "id": "uuid",
  "institution": {
    "code": "MIRAE_ASSET_SECURITIES",
    "label": "미래에셋증권"
  },
  "account_number": "****-****-1234",
  "account_type": {
    "code": "ISA",
    "label": "ISA"
  },
  "account_name": "주식 + ETF 위주",
  "holdings_count": 5,
  "current_value_krw": 10800,
  "principal_krw": 10000,
  "profit_rate": 8.0
}
```

| 필드                | 타입        | 설명                                 |
|-------------------|-----------|------------------------------------|
| id                | string    | UUID                               |
| institution       | CodeLabel | 금융기관                               |
| account_number    | string    | 저장 시 뒷자리 마스킹 처리 (`****-****-1234`) |
| account_type      | CodeLabel | 계좌 유형                              |
| account_name      | string    | 계좌 이름                              |
| holdings_count    | number    | 보유 종목 수                            |
| current_value_krw | number    | 총 평가액 (KRW 환산)                     |
| principal_krw     | number    | 투자 원금 (KRW 환산)                     |
| profitRate        | number    | 수익률 (%, 소수점 2자리)                   |

---

### `GET /api/accounts` — 계좌 목록

**Response 200**: `Account[]`

---

### `POST /api/accounts` — 계좌 생성

**Request Body**

```json
{
  "institution_code": "MIRAE_ASSET_SECURITIES",
  "account_number": "123-456-789",
  "account_type_code": "ISA",
  "account_name": "주식 + ETF 위주"
}
```

| 필드                | 필수 | 설명                           |
|-------------------|----|------------------------------|
| institution_code  | ✓  | `/api/meta/institutions` 코드  |
| account_number    | ✓  | 계좌번호 (저장 시 뒷자리 마스킹)          |
| account_type_code | ✓  | `/api/meta/account-types` 코드 |
| account_name      | ✓  | 별칭                           |

**Response 201**: 생성된 `Account` 객체

---

### `GET /api/accounts/{id}` — 계좌 상세

**Response 200**: `Account` 객체
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

### `PUT /api/accounts/{id}` — 계좌 수정

**Request Body**: `POST /api/accounts` 와 동일한 구조, 모든 필드 필수

**Response 200**: 수정된 `Account` 객체
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

### `DELETE /api/accounts/{id}` — 계좌 삭제

하위 종목도 함께 삭제.

**Response 204**
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

## 종목

### 종목 응답 객체 (`Holding`)

```json
{
  "id": "uuid",
  "account_id": "uuid",
  "asset_name": "삼성전자",
  "asset_type": {
    "code": "DOMESTIC_STOCK",
    "label": "국내주식"
  },
  "currency_exposure": false,
  "principal_value": 7200000,
  "current_value": 7850000,
  "unrealized_gain": 650000,
  "profit_rate": 9.03
}
```

| 필드                | 타입        | 설명                                                |
|-------------------|-----------|---------------------------------------------------|
| id                | string    | UUID                                              |
| account_id        | string    | 소속 계좌 UUID                                        |
| asset_name        | string    | 종목명                                               |
| asset_type        | CodeLabel | 자산 유형                                             |
| currency_exposure | boolean   | 환노출 여부 (true = 환노출Y, false = 환노출N)                |
| principal_value   | number    | 매입금액 (직접 입력)                                      |
| current_value     | number?   | 평가금액 (직접 입력, 미입력 시 null)                          |
| unrealized_gain   | number?   | 평가손익 (`current_value - principal_value`, null 가능) |
| profit_rate       | number?   | 수익률 (%, `current_value` 없으면 null)                 |

---

### `GET /api/accounts/{accountId}/holdings` — 종목 목록

**Response 200**: `Holding[]`
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

### `POST /api/accounts/{accountId}/holdings` — 종목 추가

**Request Body**

```json
{
  "name": "삼성전자",
  "asset_type_code": "DOMESTIC_STOCK",
  "currency_exposure": false,
  "principal_value": 7200000,
  "current_value": 7850000
}
```

| 필드                | 필수 | 설명                                  |
|-------------------|----|-------------------------------------|
| name              | ✓  | 종목명                                 |
| asset_type_code   | ✓  | `/api/meta/asset-types` 코드          |
| currency_exposure | ✓  | 환노출 여부 (true = 환노출Y, false = 환노출N) |
| principal_value   | ✓  | 매입금액                                |
| current_value     | -  | 평가금액 (없으면 수익률 계산 불가)               |

**Response 201**: 생성된 `Holding` 객체
**Response 404**: `{ "error": "계좌를 찾을 수 없습니다." }`

---

### `PUT /api/accounts/{accountId}/holdings/{id}` — 종목 수정

**Request Body**: `POST` 와 동일한 구조, 모든 필드 필수

**Response 200**: 수정된 `Holding` 객체 (계산 필드 포함)
**Response 404**: 계좌 또는 종목 없음

---

### `DELETE /api/accounts/{accountId}/holdings/{id}` — 종목 삭제

**Response 204**
**Response 404**: 계좌 또는 종목 없음

---

## 완료 기준

- [ ] 계좌 생성/수정/삭제/목록/상세 UI 동작
- [ ] 종목 생성/수정/삭제/목록 UI 동작
