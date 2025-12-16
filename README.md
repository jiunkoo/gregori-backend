![coverage](.github/badges/jacoco.svg)
![branches coverage](.github/badges/branches.svg)

## GREGORI란?

GREGORI는 종합 쇼핑몰 이커머스 서비스입니다.  
백엔드는 Spring Boot 기반으로 구축되었으며, Rest API 방식으로 프론트와 통신합니다.

## 📌 DB ERD

아래 링크에서 ERD를 확인할 수 있습니다.

🔗 https://dbdiagram.io/d/Gregori-2nd-sprint-657450e256d8064ca0b20e2f

## 🎨 화면 설계(Figma)

프로젝트 화면 흐름 및 UI 설계는 아래 링크에서 확인 가능합니다.

🔗 https://www.figma.com/file/okTRiqAQU7jd13yAeypoZA/Gregori-2nd-sprint

## 🚀 빠르게 실행해보기

### 1) 필수 요구사항

- JDK 17 이상
- Git
- Gradle Wrapper 프로젝트에 포함 → 별도 설치 불필요  
  (모든 명령은 `./gradlew` 사용)

### 2) 프로젝트 클론

```bash
git clone https://github.com/OWNER/gregori-backend.git
cd gregori-backend
```

### 3) 의존성 설치 및 테스트 실행

**✔ 전체 빌드(테스트 포함)**

```bash
./gradlew clean build
```

**✔ 테스트만 실행**

```bash
./gradlew test
```

테스트 결과 및 JaCoCo 커버리지 리포트는  
`build/reports/jacoco/test/html/index.html` 에서 확인할 수 있습니다.

### 4) 애플리케이션 실행

```bash
./gradlew bootRun
```

기본 설정:

- 서버 포트: 8080
- 기본 DB: H2 인메모리 데이터베이스
- 설정 파일: `src/main/resources/application.properties`

### ✔ H2 콘솔 접속 (옵션)

애플리케이션 실행 후 아래 주소로 접속 가능합니다:

👉 http://localhost:8080/h2-console

기본 정보

- JDBC URL: `jdbc:h2:mem:testdb`
- User: sa
- Password: (빈 값)

### 📚 API 문서 (Springdoc OpenAPI)

애플리케이션 실행 후 아래 주소로 접속하여 API 명세서를 확인할 수 있습니다:

👉 http://localhost:8080/swagger-ui.html

API 문서는 Springdoc OpenAPI를 사용하여 자동 생성되며, 모든 REST API 엔드포인트와 요청/응답 스키마를 확인할 수 있습니다.

- OpenAPI UI: `/swagger-ui.html`
- OpenAPI JSON: `/api-docs`

## 🧪 테스트 커버리지(JaCoCo)

본 프로젝트는 GitHub Actions에서 테스트 커버리지를 자동 계산하며,  
결과는 README 상단 뱃지로 표시됩니다.

- 라인 커버리지: jacoco.svg
- 브랜치 커버리지: branches.svg

## ⚙️ CI 동작 방식(GitHub Actions)

다음 이벤트 발생 시 CI가 자동 실행됩니다:

- main 브랜치에 **push**
- main 브랜치를 대상으로 **Pull Request 생성**

CI는 다음 작업을 수행합니다:

- Gradle 빌드
- 단위 테스트 실행
- JaCoCo 커버리지 측정
- 커버리지 뱃지 자동 생성 및 업데이트

워크플로우 파일 위치:

- `.github/workflows/ci.yml`
