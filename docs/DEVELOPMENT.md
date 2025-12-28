# GREGORI 개발 가이드

## 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트 구조](#프로젝트-구조)
3. [코딩 컨벤션](#코딩-컨벤션)
4. [새로운 기능 추가하기](#새로운-기능-추가하기)
5. [테스트 작성 가이드](#테스트-작성-가이드)
6. [데이터베이스 작업](#데이터베이스-작업)
7. [디버깅 및 문제 해결](#디버깅-및-문제-해결)

## 개발 환경 설정

### 필수 요구사항

- **JDK**: 17 이상
- **IDE**: IntelliJ IDEA (권장) 또는 Eclipse
- **빌드 도구**: Gradle (Wrapper 포함)
- **데이터베이스**: H2 (개발용) 또는 MySQL (운영용)

### IDE 설정

#### IntelliJ IDEA

1. 프로젝트 열기: `File > Open` → 프로젝트 루트 디렉토리 선택
2. Gradle 프로젝트로 인식 확인
3. JDK 17 설정: `File > Project Structure > Project > SDK`
4. Lombok 플러그인 설치 및 활성화
5. 코드 스타일 설정: `File > Settings > Editor > Code Style > Java`

#### Lombok 설정

- Annotation Processing 활성화: `File > Settings > Build > Compiler > Annotation Processors`
- Lombok 플러그인 설치 (IntelliJ Marketplace)

### 환경 변수 설정

프로젝트 루트에 `application-env.properties` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```properties
# 데이터베이스 설정 (MySQL 사용 시)
DB_IP=localhost
DB_PORT=3306
DB_NAME=gregori
DB_USERNAME=root
DB_PASSWORD=password

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 프로젝트 구조

```
src/
├── main/
│   ├── java/
│   │   └── com/gregori/
│   │       ├── auth/          # 인증 관련
│   │       ├── category/      # 카테고리
│   │       ├── common/        # 공통 유틸리티
│   │       ├── config/        # 설정 클래스
│   │       ├── member/        # 회원
│   │       ├── order/         # 주문
│   │       ├── product/       # 상품
│   │       └── seller/        # 셀러
│   └── resources/
│       ├── mapper/            # MyBatis XML 매퍼
│       ├── static/            # 정적 리소스
│       ├── application.properties
│       ├── schema.sql         # 테이블 생성 스크립트
│       └── data.sql           # 초기 데이터
└── test/
    └── java/                  # 테스트 코드
```

### 패키지 구조 규칙

각 도메인별로 다음 구조를 따릅니다:

```
{domain}/
├── controller/    # REST API 컨트롤러
├── service/       # 비즈니스 로직
├── mapper/        # 데이터 접근 인터페이스
├── domain/        # 도메인 엔티티
└── dto/           # 데이터 전송 객체
```

## 코딩 컨벤션

### 네이밍 규칙

#### 클래스명

- **PascalCase** 사용
- 컨트롤러: `{Domain}Controller` (예: `MemberController`)
- 서비스: `{Domain}Service` (예: `MemberService`)
- 매퍼: `{Domain}Mapper` (예: `MemberMapper`)
- DTO: `{Domain}{Purpose}Dto` (예: `MemberRegisterDto`)

#### 메서드명

- **camelCase** 사용
- 동사로 시작 (예: `getMember`, `createOrder`)
- boolean 반환: `is`, `has`, `can` 접두사 (예: `isDeleted`)

#### 변수명

- **camelCase** 사용
- 의미 있는 이름 사용
- 약어 지양 (예: `memberId` O, `mId` X)

### 코드 스타일

#### 들여쓰기

- **4 spaces** 사용 (탭 사용 금지)

#### 중괄호

- K&R 스타일 사용

```java
if (condition) {
    // code
}
```

#### 임포트

- 와일드카드(`*`) 사용 금지
- 정적 임포트는 최소화

#### 어노테이션 순서

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {
    // ...
}
```

### DTO 작성 규칙

#### Request DTO

- `@Valid` 또는 `@Validated` 사용
- Bean Validation 어노테이션 활용
- `toEntity()` 메서드로 도메인 객체 변환

```java
@Getter
@NoArgsConstructor
public class MemberRegisterDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;

    public Member toEntity(String encodedPassword) {
        return Member.builder()
            .email(this.email)
            .password(encodedPassword)
            .build();
    }
}
```

#### Response DTO

- 필요한 필드만 포함
- `toEntity()` 메서드로 DTO 생성

```java
@Getter
public class MemberResponseDto {
    private Long id;
    private String name;
    private String email;
    private Authority authority;

    public MemberResponseDto toEntity(Member member) {
        this.id = member.getId();
        this.name = member.getName();
        this.email = member.getEmail();
        this.authority = member.getAuthority();
        return this;
    }
}
```

### 예외 처리

#### 커스텀 예외 사용

```java
// 리소스 없음
throw new NotFoundException("상품을 찾을 수 없습니다.");

// 중복 리소스
throw new DuplicateException();

// 비즈니스 규칙 위반
throw new BusinessRuleViolationException("진행 중인 주문이 있습니다.");
```

#### 예외 클래스 작성

```java
@ResponseStatus(code = NOT_FOUND)
public class NotFoundException extends RuntimeException {
    public NotFoundException() {
        super("요청한 값을 찾을 수 없습니다.");
    }

    public NotFoundException(String message) {
        super(message);
    }
}
```

## 새로운 기능 추가하기

### 1. 도메인 추가 예시

새로운 도메인(예: `Review`)을 추가하는 경우:

#### Step 1: 도메인 엔티티 생성

```java
// src/main/java/com/gregori/review/domain/Review.java
@Getter
@NoArgsConstructor
public class Review extends AbstractEntity {
    private Long id;
    private Long memberId;
    private Long productId;
    private String content;
    private Integer rating;

    @Builder
    public Review(Long memberId, Long productId, String content, Integer rating) {
        this.memberId = memberId;
        this.productId = productId;
        this.content = content;
        this.rating = rating;
    }
}
```

#### Step 2: Mapper 인터페이스 생성

```java
// src/main/java/com/gregori/review/mapper/ReviewMapper.java
@Mapper
public interface ReviewMapper {
    void insert(Review review);
    Optional<Review> findById(Long id);
    List<Review> findByProductId(Long productId);
    void update(Review review);
    void delete(Long id);
}
```

#### Step 3: Mapper XML 생성

```xml
<!-- src/main/resources/mapper/ReviewMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.gregori.review.mapper.ReviewMapper">
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO reviews (member_id, product_id, content, rating)
        VALUES (#{memberId}, #{productId}, #{content}, #{rating})
    </insert>

    <select id="findById" resultType="com.gregori.review.domain.Review">
        SELECT * FROM reviews WHERE id = #{id}
    </select>
</mapper>
```

#### Step 4: DTO 생성

```java
// Request DTO
@Getter
@NoArgsConstructor
public class ReviewCreateDto {
    @NotNull
    private Long productId;

    @NotBlank
    private String content;

    @Min(1) @Max(5)
    private Integer rating;
}

// Response DTO
@Getter
public class ReviewResponseDto {
    private Long id;
    private Long memberId;
    private String content;
    private Integer rating;
}
```

#### Step 5: Service 생성

```java
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewMapper reviewMapper;

    @Transactional
    public Long createReview(ReviewCreateDto dto, Long memberId) {
        Review review = Review.builder()
            .memberId(memberId)
            .productId(dto.getProductId())
            .content(dto.getContent())
            .rating(dto.getRating())
            .build();
        reviewMapper.insert(review);
        return review.getId();
    }
}
```

#### Step 6: Controller 생성

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {
    private final ReviewService reviewService;

    @LoginCheck
    @PostMapping
    public ResponseEntity<Void> createReview(
        @CurrentMember SessionMember sessionMember,
        @RequestBody @Valid ReviewCreateDto dto) {
        Long reviewId = reviewService.createReview(dto, sessionMember.getId());
        URI location = URI.create("/review/" + reviewId);
        return ResponseEntity.created(location).build();
    }
}
```

#### Step 7: 데이터베이스 스키마 추가

```sql
-- src/main/resources/schema.sql에 추가
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_member_id FOREIGN KEY (member_id) REFERENCES members(id),
    CONSTRAINT fk_reviews_product_id FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 테스트 작성 가이드

### 테스트 구조

```
src/test/java/com/gregori/
├── {domain}/
│   ├── controller/{Domain}ControllerTest.java
│   ├── service/{Domain}ServiceTest.java
│   ├── mapper/{Domain}MapperTest.java
│   └── domain/{Domain}Test.java
```

### 단위 테스트 예시

#### Controller 테스트

```java
@SpringBootTest
@AutoConfigureMockMvc
class MemberControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void 회원_가입_성공() throws Exception {
        // given
        MemberRegisterDto dto = new MemberRegisterDto();
        dto.setName("홍길동");
        dto.setEmail("test@example.com");
        dto.setPassword("password123");

        // when & then
        mockMvc.perform(post("/member/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated());
    }
}
```

#### Service 테스트

```java
@SpringBootTest
@Transactional
class MemberServiceTest {
    @Autowired
    private MemberService memberService;

    @Test
    void 회원_가입_성공() {
        // given
        MemberRegisterDto dto = new MemberRegisterDto();
        dto.setEmail("test@example.com");
        dto.setPassword("password123");

        // when
        Long memberId = memberService.register(dto);

        // then
        assertThat(memberId).isNotNull();
    }
}
```

#### Mapper 테스트

```java
@MybatisTest
class MemberMapperTest {
    @Autowired
    private MemberMapper memberMapper;

    @Test
    void 회원_저장_성공() {
        // given
        Member member = Member.builder()
            .email("test@example.com")
            .password("encoded")
            .build();

        // when
        memberMapper.insert(member);

        // then
        assertThat(member.getId()).isNotNull();
    }
}
```

### 테스트 실행

```bash
# 전체 테스트 실행
./gradlew test

# 특정 테스트 클래스 실행
./gradlew test --tests MemberServiceTest

# 커버리지 리포트 확인
open build/reports/jacoco/test/html/index.html
```

## 데이터베이스 작업

### 스키마 변경

1. `src/main/resources/schema.sql` 수정
2. 테스트 실행하여 스키마 검증
3. 마이그레이션 스크립트 작성 (운영 환경용)

### MyBatis 매퍼 작성

#### 기본 CRUD 예시

```xml
<!-- 조회 -->
<select id="findById" resultType="com.gregori.member.domain.Member">
    SELECT * FROM members WHERE id = #{id}
</select>

<!-- 삽입 -->
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO members (name, email, password)
    VALUES (#{name}, #{email}, #{password})
</insert>

<!-- 수정 -->
<update id="updateName">
    UPDATE members SET name = #{name} WHERE id = #{id}
</update>

<!-- 삭제 -->
<delete id="delete">
    DELETE FROM members WHERE id = #{id}
</delete>
```

#### 동적 쿼리 예시

```xml
<select id="findByCondition" resultType="com.gregori.product.domain.Product">
    SELECT * FROM products
    <where>
        <if test="categoryId != null">
            AND category_id = #{categoryId}
        </if>
        <if test="keyword != null and keyword != ''">
            AND name LIKE CONCAT('%', #{keyword}, '%')
        </if>
    </where>
    ORDER BY created_at DESC
    LIMIT #{limit} OFFSET #{offset}
</select>
```

### 데이터베이스 접속

#### H2 콘솔

- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (빈 값)

## 디버깅 및 문제 해결

### 일반적인 문제

#### 1. Lombok 어노테이션 인식 안 됨

- **해결**: Annotation Processing 활성화 확인
- IntelliJ: `File > Settings > Build > Compiler > Annotation Processors`

#### 2. MyBatis 매퍼 인식 안 됨

- **해결**:
  - `application.properties`에서 `mybatis.mapper-locations` 확인
  - XML 파일의 `namespace`가 인터페이스 패키지와 일치하는지 확인

#### 3. 세션 인증 실패

- **해결**:
  - 쿠키가 제대로 설정되었는지 확인
  - CORS 설정 확인 (`WebConfig`)
  - `@LoginCheck` 어노테이션 위치 확인

#### 4. 트랜잭션 롤백 안 됨

- **해결**:
  - `@Transactional` 어노테이션 확인
  - 예외가 RuntimeException을 상속하는지 확인
  - 트랜잭션 전파 설정 확인

### 로깅

#### 로그 레벨 설정

```properties
# application.properties
logging.level.com.gregori=DEBUG
logging.level.org.springframework.web=INFO
logging.level.org.mybatis=DEBUG
```

#### 로그 사용 예시

```java
@Slf4j
@Service
public class MemberService {
    public void someMethod() {
        log.debug("디버그 메시지");
        log.info("정보 메시지");
        log.warn("경고 메시지");
        log.error("에러 메시지", exception);
    }
}
```

### 성능 최적화

#### 1. N+1 문제 해결

- JOIN 쿼리 사용
- `@OneToMany` 관계에서 `fetch` 전략 설정

#### 2. 쿼리 최적화

- 인덱스 활용
- 불필요한 SELECT 제거
- 페이징 처리

#### 3. 캐싱 고려

- 자주 조회되는 데이터는 캐싱 고려
- Redis 등 외부 캐시 도입 검토

## 배포

### 빌드

```bash
# 프로덕션 빌드
./gradlew clean build -x test

# JAR 파일 생성
./gradlew bootJar
```

### 환경 설정

- 운영 환경에서는 `application-env.properties`에 실제 DB 정보 설정
- 환경 변수로 민감한 정보 관리

## 참고 자료

- [아키텍처 문서](./ARCHITECTURE.md)
- [API 설계 문서](./API_DESIGN.md)
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [MyBatis 공식 문서](https://mybatis.org/mybatis-3/)
