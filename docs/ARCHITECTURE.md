# GREGORI 백엔드 아키텍처 문서

## 목차

1. [개요](#개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [계층 구조](#계층-구조)
4. [도메인 모델](#도메인-모델)
5. [인증 및 보안](#인증-및-보안)
6. [데이터베이스 설계](#데이터베이스-설계)
7. [기술 스택](#기술-스택)

## 개요

GREGORI는 Spring Boot 기반의 RESTful API 서버로, 종합 쇼핑몰 이커머스 서비스를 제공합니다.
계층형 아키텍처(Layered Architecture) 패턴을 따르며, 각 계층의 책임을 명확히 분리하여 유지보수성과 확장성을 확보했습니다.

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Frontend)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────▼────────────────────────────────────┐
│              Spring Boot Application                      │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Controller Layer                        │ │
│  │  (Member, Seller, Product, Category, Order, Auth)   │ │
│  └──────────────────┬───────────────────────────────────┘ │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────────┐ │
│  │              Service Layer                            │ │
│  │  (Business Logic, Transaction Management)             │ │
│  └──────────────────┬───────────────────────────────────┘ │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────────┐ │
│  │              Mapper Layer (MyBatis)                  │ │
│  │  (Data Access, SQL Mapping)                          │ │
│  └──────────────────┬───────────────────────────────────┘ │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────────┐ │
│  │              Domain Layer                             │ │
│  │  (Entity, Value Object, Domain Logic)                 │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Database (H2 / MySQL)                       │
└─────────────────────────────────────────────────────────┘
```

## 계층 구조

### 1. Controller Layer (컨트롤러 계층)

**책임:**

- HTTP 요청/응답 처리
- 요청 데이터 검증 (Bean Validation)
- 인증/인가 체크
- 서비스 계층 호출 및 결과 반환

**구조:**

```
com.gregori
├── auth/controller/AuthController.java      # 인증 관련 API
├── member/controller/MemberController.java   # 회원 관리 API
├── seller/controller/SellerController.java  # 셀러 관리 API
├── product/controller/ProductController.java # 상품 관리 API
├── category/controller/CategoryController.java # 카테고리 관리 API
└── order/controller/OrderController.java    # 주문 관리 API
```

**특징:**

- RESTful API 설계 원칙 준수
- `@RestController` 사용
- `@LoginCheck` 커스텀 어노테이션으로 인증 체크
- `@CurrentMember` 어노테이션으로 현재 로그인 사용자 주입

### 2. Service Layer (서비스 계층)

**책임:**

- 비즈니스 로직 구현
- 트랜잭션 관리 (`@Transactional`)
- 도메인 객체 간 협력 조율
- 예외 처리 및 검증

**구조:**

```
com.gregori
├── auth/service/AuthService.java
├── member/service/MemberService.java
├── seller/service/SellerService.java
├── product/service/ProductService.java
├── category/service/CategoryService.java
└── order/service/OrderService.java
```

**특징:**

- `@Service` 어노테이션으로 Spring Bean 등록
- `@Transactional`로 트랜잭션 경계 설정
- Mapper 계층을 통한 데이터 접근
- 커스텀 예외를 통한 에러 처리

### 3. Mapper Layer (매퍼 계층)

**책임:**

- 데이터베이스 접근 로직
- SQL 쿼리 실행
- 도메인 객체와 DB 레코드 매핑

**구조:**

```
com.gregori
├── member/mapper/MemberMapper.java
├── seller/mapper/SellerMapper.java
├── product/mapper/ProductMapper.java
├── category/mapper/CategoryMapper.java
├── order/mapper/OrderMapper.java
└── order/mapper/OrderDetailMapper.java
```

**특징:**

- MyBatis를 사용한 SQL 매핑
- XML 기반 SQL 쿼리 (`src/main/resources/mapper/*.xml`)
- 인터페이스 기반 매퍼 정의
- `@Mapper` 어노테이션 사용

### 4. Domain Layer (도메인 계층)

**책임:**

- 도메인 모델 정의
- 도메인 비즈니스 규칙 구현
- 엔티티의 불변성 보장

**구조:**

```
com.gregori
├── common/AbstractEntity.java          # 공통 엔티티 추상 클래스
├── member/domain/Member.java
├── seller/domain/Seller.java
├── product/domain/Product.java
├── category/domain/Category.java
├── order/domain/Order.java
└── order/domain/OrderDetail.java
```

**특징:**

- Rich Domain Model 패턴 적용
- 도메인 로직을 엔티티 내부에 캡슐화
- `AbstractEntity`를 통한 공통 필드 관리 (createdAt, updatedAt)
- Enum을 통한 상태 관리 (Status, Authority 등)

## 도메인 모델

### 핵심 엔티티

#### 1. Member (회원)

- **역할**: 시스템 사용자
- **속성**: id, name, email, password, authority, isDeleted
- **권한**: GENERAL_MEMBER, SELLING_MEMBER, ADMIN_MEMBER

#### 2. Seller (셀러)

- **역할**: 판매자 정보
- **속성**: id, memberId, businessNumber, businessName, isDeleted
- **관계**: Member와 1:N 관계

#### 3. Category (카테고리)

- **역할**: 상품 분류
- **속성**: id, name

#### 4. Product (상품)

- **역할**: 판매 상품
- **속성**: id, sellerId, categoryId, name, price, inventory, imageUrl, status, isDeleted
- **상태**: PRE_SALE, ON_SALE, END_OF_SALE

#### 5. Order (주문)

- **역할**: 주문 정보
- **속성**: id, memberId, orderNumber, paymentMethod, paymentAmount, deliveryCost, status
- **상태**: ORDER_CANCELED, ORDER_PROCESSING, ORDER_COMPLETED

#### 6. OrderDetail (주문 상세)

- **역할**: 주문 상세 항목
- **속성**: id, orderId, productId, productSellerId, productName, productPrice, productCount, status
- **관계**: Order와 1:N 관계

### 엔티티 관계도

```
Member (1) ────< (N) Seller
Member (1) ────< (N) Order
Order (1) ────< (N) OrderDetail
Seller (1) ────< (N) Product
Category (1) ────< (N) Product
Product (1) ────< (N) OrderDetail
```

## 인증 및 보안

### 인증 방식

- **세션 기반 인증**: HttpSession을 사용한 서버 측 세션 관리
- **쿠키 기반 세션 ID 전달**: `CookieGenerator`를 통한 쿠키 생성/관리

### 보안 구성 요소

#### 1. AuthInterceptor

- **위치**: `com.gregori.config.security.AuthIntercepter`
- **역할**: 요청 전 인증 상태 확인
- **동작**: `@LoginCheck` 어노테이션이 있는 엔드포인트에 대해 세션 검증

#### 2. AuthArgumentResolver

- **위치**: `com.gregori.config.security.AuthArgumentResolver`
- **역할**: `@CurrentMember` 파라미터 자동 주입
- **동작**: 세션에서 현재 로그인 사용자 정보 추출

#### 3. BCryptConfig

- **위치**: `com.gregori.config.security.BCryptConfig`
- **역할**: 비밀번호 암호화
- **사용**: Spring Security의 BCryptPasswordEncoder

#### 4. SessionMemberManager

- **위치**: `com.gregori.config.security.SessionMemberManager`
- **역할**: 세션에 저장된 회원 정보 관리

### 권한 체계

```java
public enum Authority {
    GENERAL_MEMBER,    // 일반 회원
    SELLING_MEMBER,    // 판매 회원
    ADMIN_MEMBER       // 관리자
}
```

### 인증 흐름

```
1. 클라이언트 → POST /auth/sign-in
2. AuthService → 이메일/비밀번호 검증
3. 세션 생성 및 SessionMember 저장
4. 쿠키 생성 및 응답
5. 이후 요청 → AuthInterceptor가 세션 검증
6. @CurrentMember로 현재 사용자 주입
```

## 데이터베이스 설계

### 데이터베이스 선택

- **개발 환경**: H2 인메모리 데이터베이스
- **운영 환경**: MySQL (환경 변수로 설정 가능)

### 스키마 초기화

- `schema.sql`: 테이블 생성 스크립트
- `data.sql`: 초기 데이터 삽입

### 주요 테이블

1. **members**: 회원 정보
2. **sellers**: 셀러 정보
3. **categories**: 카테고리 정보
4. **products**: 상품 정보
5. **orders**: 주문 정보
6. **order_details**: 주문 상세 정보

### 데이터베이스 설정

- **MyBatis**: ORM 프레임워크
- **Mapper XML**: `src/main/resources/mapper/*.xml`
- **설정 파일**: `mybatis-config.xml`

## 기술 스택

### 프레임워크 및 라이브러리

| 카테고리         | 기술                   | 버전    |
| ---------------- | ---------------------- | ------- |
| **프레임워크**   | Spring Boot            | 3.1.5   |
| **언어**         | Java                   | 17      |
| **빌드 도구**    | Gradle                 | -       |
| **ORM**          | MyBatis                | 3.0.2   |
| **데이터베이스** | H2 / MySQL             | -       |
| **보안**         | Spring Security Crypto | -       |
| **검증**         | Bean Validation        | -       |
| **문서화**       | Springdoc OpenAPI      | 2.2.0   |
| **유틸리티**     | Apache Commons Lang3   | 3.14.0  |
| **개발 도구**    | Lombok                 | 1.18.30 |

### 개발 도구

- **테스트**: JUnit 5, Spring Boot Test
- **커버리지**: JaCoCo
- **API 문서**: Swagger UI, ReDoc

## 아키텍처 패턴 및 설계 원칙

### 1. 계층형 아키텍처 (Layered Architecture)

- 각 계층의 책임 명확히 분리
- 의존성 방향: Controller → Service → Mapper → Domain

### 2. 도메인 주도 설계 (DDD) 요소

- Rich Domain Model: 비즈니스 로직을 도메인 객체에 캡슐화
- Value Object: IsDeleted, Authority 등
- Aggregate: Order와 OrderDetail

### 3. 관심사의 분리 (Separation of Concerns)

- 각 계층은 자신의 책임만 수행
- 공통 기능은 별도 모듈로 분리 (common 패키지)

### 4. 예외 처리 전략

- 커스텀 예외 클래스 정의
- 계층별 적절한 예외 처리
- 일관된 에러 응답 형식

### 5. 트랜잭션 관리

- `@Transactional`을 통한 선언적 트랜잭션 관리
- 서비스 계층에서 트랜잭션 경계 설정

## 확장성 고려사항

### 현재 구조의 장점

1. **명확한 계층 분리**: 각 계층의 역할이 명확하여 유지보수 용이
2. **도메인 중심 설계**: 비즈니스 로직이 도메인에 집중
3. **유연한 데이터 접근**: MyBatis를 통한 SQL 제어 가능

### 향후 개선 가능 영역

1. **캐싱 전략**: Redis 등을 활용한 캐시 레이어 추가
2. **비동기 처리**: 주문 처리 등에 대한 비동기 처리 고려
3. **이벤트 기반 아키텍처**: 도메인 이벤트 발행/구독 패턴 도입
4. **마이크로서비스 전환**: 서비스별 독립 배포 가능한 구조로 전환

## 참고 자료

- [DB ERD](https://dbdiagram.io/d/Gregori-2nd-sprint-657450e256d8064ca0b20e2f)
- [화면 설계 (Figma)](https://www.figma.com/file/okTRiqAQU7jd13yAeypoZA/Gregori-2nd-sprint)
- [API 문서](./API_DESIGN.md)
- [개발 가이드](./DEVELOPMENT.md)
