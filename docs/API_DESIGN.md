# GREGORI API 설계 문서

## 목차

1. [개요](#개요)
2. [API 기본 규칙](#api-기본-규칙)
3. [인증 및 인가](#인증-및-인가)
4. [에러 처리](#에러-처리)
5. [API 엔드포인트](#api-엔드포인트)
6. [요청/응답 예시](#요청응답-예시)

## 개요

GREGORI API는 RESTful 원칙을 따르는 HTTP 기반 API입니다. 모든 응답은 JSON 형식으로 제공되며, 세션 기반 인증을 사용합니다.

### 기본 정보

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`
- **인증 방식**: 세션 기반 (쿠키 사용)
- **문서화**: Springdoc OpenAPI (Swagger UI, ReDoc)

## API 기본 규칙

### HTTP 메서드 사용 규칙

| 메서드   | 용도             | 예시                      |
| -------- | ---------------- | ------------------------- |
| `GET`    | 리소스 조회      | 상품 목록 조회, 주문 조회 |
| `POST`   | 리소스 생성      | 회원 가입, 주문 생성      |
| `PUT`    | 리소스 전체 수정 | 상품 정보 수정            |
| `PATCH`  | 리소스 부분 수정 | 주문 상태 변경            |
| `DELETE` | 리소스 삭제      | 상품 삭제, 회원 탈퇴      |

### URL 명명 규칙

- 소문자 사용
- 단어는 하이픈(`-`)으로 구분하지 않고 카멜케이스 사용
- 복수형 사용 (예: `/products`, `/orders`)
- 리소스 계층 구조 표현 (예: `/order/{orderId}`)

### 상태 코드 사용 규칙

| 상태 코드                   | 의미                  | 사용 예시             |
| --------------------------- | --------------------- | --------------------- |
| `200 OK`                    | 성공적인 조회         | GET 요청 성공         |
| `201 Created`               | 리소스 생성 성공      | POST 요청 성공        |
| `204 No Content`            | 성공 (응답 본문 없음) | PUT/PATCH/DELETE 성공 |
| `400 Bad Request`           | 잘못된 요청           | 유효성 검증 실패      |
| `401 Unauthorized`          | 인증 실패             | 로그인 필요           |
| `403 Forbidden`             | 권한 없음             | 접근 권한 부족        |
| `404 Not Found`             | 리소스 없음           | 존재하지 않는 리소스  |
| `409 Conflict`              | 충돌                  | 중복된 리소스         |
| `500 Internal Server Error` | 서버 오류             | 예상치 못한 오류      |

## 인증 및 인가

### 인증 방식

- **세션 기반 인증**: HttpSession을 사용한 서버 측 세션 관리
- **쿠키 전달**: 세션 ID를 쿠키로 전달

### 인증 흐름

1. **로그인**

   ```
   POST /auth/signin
   → 세션 생성 및 쿠키 반환
   ```

2. **인증된 요청**

   ```
   요청 헤더에 쿠키 포함
   → 서버에서 세션 검증
   → @CurrentMember로 현재 사용자 주입
   ```

3. **로그아웃**
   ```
   POST /auth/signout
   → 세션 무효화 및 쿠키 삭제
   ```

### 권한 체계

```java
GENERAL_MEMBER    // 일반 회원
SELLING_MEMBER    // 판매 회원
ADMIN_MEMBER      // 관리자
```

### 인증 어노테이션

#### `@LoginCheck`

- **용도**: 엔드포인트 인증 체크
- **사용법**:
  ```java
  @LoginCheck                                    // 모든 권한 허용
  @LoginCheck({ GENERAL_MEMBER, SELLING_MEMBER }) // 특정 권한만 허용
  ```

#### `@CurrentMember`

- **용도**: 현재 로그인 사용자 주입
- **사용법**:
  ```java
  @CurrentMember SessionMember sessionMember
  ```

## 에러 처리

### 커스텀 예외 클래스

| 예외 클래스                      | HTTP 상태 코드 | 용도               |
| -------------------------------- | -------------- | ------------------ |
| `ValidationException`            | 400            | 유효성 검증 실패   |
| `UnauthorizedException`          | 401            | 인증 실패          |
| `AccessDeniedException`          | 403            | 권한 없음          |
| `NotFoundException`              | 404            | 리소스 없음        |
| `DuplicateException`             | 409            | 중복 리소스        |
| `BusinessRuleViolationException` | 400            | 비즈니스 규칙 위반 |

### 에러 응답 형식

```json
{
  "message": "에러 메시지",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## API 엔드포인트

### 인증 (Auth)

#### 로그인

```
POST /auth/signin
```

- **인증**: 불필요
- **요청 본문**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답**: `200 OK` (쿠키 설정)

#### 로그아웃

```
POST /auth/signout
```

- **인증**: 필요
- **응답**: `204 No Content` (쿠키 삭제)

### 회원 (Member)

#### 회원 가입

```
POST /member/register
```

- **인증**: 불필요
- **요청 본문**:
  ```json
  {
    "name": "홍길동",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답**: `201 Created` (Location 헤더 포함)

#### 회원 정보 조회

```
GET /member
```

- **인증**: 필요 (모든 권한)
- **응답**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "홍길동",
    "email": "user@example.com",
    "authority": "GENERAL_MEMBER"
  }
  ```

#### 회원 이름 수정

```
POST /member/name
```

- **인증**: 필요 (모든 권한)
- **요청 본문**:
  ```json
  {
    "name": "홍길동2"
  }
  ```
- **응답**: `204 No Content`

#### 회원 비밀번호 수정

```
POST /member/password
```

- **인증**: 필요 (모든 권한)
- **요청 본문**:
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newPassword123"
  }
  ```
- **응답**: `204 No Content`

#### 회원 탈퇴

```
DELETE /member
```

- **인증**: 필요 (모든 권한)
- **응답**: `204 No Content` (쿠키 삭제)

### 셀러 (Seller)

#### 셀러 등록

```
POST /seller/register
```

- **인증**: 필요 (GENERAL_MEMBER)
- **요청 본문**:
  ```json
  {
    "businessNumber": "123-45-67890",
    "businessName": "홍길동 상회"
  }
  ```
- **응답**: `201 Created`

#### 셀러 정보 조회

```
GET /seller
```

- **인증**: 필요 (SELLING_MEMBER)
- **응답**: `200 OK`
  ```json
  {
    "id": 1,
    "memberId": 1,
    "businessNumber": "123-45-67890",
    "businessName": "홍길동 상회"
  }
  ```

#### 셀러 정보 수정

```
PUT /seller
```

- **인증**: 필요 (SELLING_MEMBER)
- **요청 본문**:
  ```json
  {
    "businessName": "홍길동 상회2"
  }
  ```
- **응답**: `204 No Content`

#### 셀러 폐업

```
DELETE /seller/{sellerId}
```

- **인증**: 필요 (SELLING_MEMBER)
- **응답**: `204 No Content`

### 상품 (Product)

#### 상품 생성

```
POST /product
```

- **인증**: 필요 (SELLING_MEMBER)
- **요청 본문**:
  ```json
  {
    "categoryId": 1,
    "name": "상품명",
    "price": 10000,
    "inventory": 100,
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **응답**: `201 Created`

#### 상품 수정

```
PUT /product
```

- **인증**: 필요 (SELLING_MEMBER)
- **요청 본문**:
  ```json
  {
    "productId": 1,
    "categoryId": 1,
    "name": "수정된 상품명",
    "price": 15000,
    "inventory": 50,
    "status": "ON_SALE"
  }
  ```
- **응답**: `204 No Content`

#### 상품 삭제

```
DELETE /product/{productId}
```

- **인증**: 필요 (SELLING_MEMBER)
- **응답**: `204 No Content`

#### 상품 조회 (단일)

```
GET /product/{productId}
```

- **인증**: 불필요
- **응답**: `200 OK`
  ```json
  {
    "id": 1,
    "sellerId": 1,
    "categoryId": 1,
    "name": "상품명",
    "price": 10000,
    "inventory": 100,
    "imageUrl": "https://example.com/image.jpg",
    "status": "ON_SALE"
  }
  ```

#### 상품 목록 조회

```
GET /product?keyword=검색어&categoryId=1&sellerId=1&page=1&sorter=CREATED_AT_DESC
```

- **인증**: 불필요
- **쿼리 파라미터**:
  - `keyword` (optional): 검색어
  - `categoryId` (optional): 카테고리 ID
  - `sellerId` (optional): 셀러 ID
  - `page` (default: 1): 페이지 번호
  - `sorter` (default: CREATED_AT_DESC): 정렬 기준
    - `CREATED_AT_DESC`: 최신순
    - `CREATED_AT_ASC`: 오래된순
    - `PRICE_DESC`: 가격 높은순
    - `PRICE_ASC`: 가격 낮은순
- **응답**: `200 OK` (배열)

### 카테고리 (Category)

#### 카테고리 생성

```
POST /category
```

- **인증**: 필요 (ADMIN_MEMBER)
- **요청 본문**:
  ```json
  {
    "name": "카테고리명"
  }
  ```
- **응답**: `201 Created`

#### 카테고리 수정

```
PUT /category/{categoryId}
```

- **인증**: 필요 (ADMIN_MEMBER)
- **요청 본문**:
  ```json
  {
    "name": "수정된 카테고리명"
  }
  ```
- **응답**: `204 No Content`

#### 카테고리 삭제

```
DELETE /category/{categoryId}
```

- **인증**: 필요 (ADMIN_MEMBER)
- **응답**: `204 No Content`

#### 카테고리 목록 조회

```
GET /category
```

- **인증**: 불필요
- **응답**: `200 OK` (배열)

### 주문 (Order)

#### 주문 생성

```
POST /order
```

- **인증**: 필요
- **요청 본문**:
  ```json
  {
    "paymentMethod": "CARD",
    "paymentAmount": 50000,
    "deliveryCost": 3000,
    "orderDetails": [
      {
        "productId": 1,
        "productCount": 2
      }
    ]
  }
  ```
- **응답**: `201 Created`

#### 주문 취소

```
PATCH /order/{orderId}
```

- **인증**: 필요
- **응답**: `204 No Content`

#### 주문 상세 상태 수정

```
PATCH /order/detail
```

- **인증**: 필요 (GENERAL_MEMBER, SELLING_MEMBER)
- **요청 본문**:
  ```json
  {
    "orderDetailId": 1,
    "status": "PAYMENT_CANCELED"
  }
  ```
- **응답**: `204 No Content`

#### 주문 조회 (단일)

```
GET /order/{orderId}
```

- **인증**: 필요
- **응답**: `200 OK`
  ```json
  {
    "id": 1,
    "memberId": 1,
    "orderNumber": "ORD_202401011200001234",
    "paymentMethod": "CARD",
    "paymentAmount": 50000,
    "deliveryCost": 3000,
    "status": "ORDER_PROCESSING",
    "orderDetails": [...]
  }
  ```

#### 주문 목록 조회

```
GET /order?page=1
```

- **인증**: 필요
- **쿼리 파라미터**:
  - `page` (default: 1): 페이지 번호
- **응답**: `200 OK` (배열)

## 요청/응답 예시

### 성공적인 요청 예시

#### 회원 가입

```http
POST /member/register HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123"
}
```

**응답:**

```http
HTTP/1.1 201 Created
Location: /member/1
```

#### 로그인

```http
POST /auth/signin HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "email": "hong@example.com",
  "password": "password123"
}
```

**응답:**

```http
HTTP/1.1 200 OK
Set-Cookie: JSESSIONID=xxx; Path=/; HttpOnly; SameSite=None; Secure
```

#### 상품 목록 조회

```http
GET /product?categoryId=1&page=1&sorter=PRICE_ASC HTTP/1.1
Host: localhost:8080
```

**응답:**

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "sellerId": 1,
    "categoryId": 1,
    "name": "상품명",
    "price": 10000,
    "inventory": 100,
    "imageUrl": "https://example.com/image.jpg",
    "status": "ON_SALE"
  }
]
```

### 에러 응답 예시

#### 유효성 검증 실패

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": "이메일 형식이 올바르지 않습니다.",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 인증 실패

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message": "로그인이 필요합니다.",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 리소스 없음

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "message": "상품을 찾을 수 없습니다.",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## API 문서 확인

애플리케이션 실행 후 다음 주소에서 상세한 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **ReDoc UI**: http://localhost:8080/redoc.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## 참고 자료

- [아키텍처 문서](./ARCHITECTURE.md)
- [개발 가이드](./DEVELOPMENT.md)
