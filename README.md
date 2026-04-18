# 📸 Instagram Clone – Full Stack Monorepo

본 프로젝트는 **Instagram의 핵심 기능을 직접 구현**하며,
프론트엔드와 백엔드의 역할 분리, 인증 흐름, 데이터 처리, 배포 환경까지 경험하는 것을 목표로 한
**풀스택 Instagram 클론 프로젝트**입니다.

프론트엔드(React)와 백엔드(Spring Boot)를 하나의 저장소에서 관리하는
**모노레포(Monorepo) 구조**로 구성되어 있습니다.

---

## 🧱 프로젝트 구조

```
root
 ├─ frontend/        # React 기반 클라이언트
 ├─ backend/         # Spring Boot 기반 REST API 서버
 ├─ README.md        # 공통 프로젝트 설명 (본 문서)
```

### 📱 Frontend

* 사용자 화면(UI) 및 인터랙션 처리
* 게시물, 스토리, 피드 렌더링
* 인증 상태 관리 및 API 연동

### 🖥 Backend

* 게시물 / 스토리 / 사용자 도메인 로직 처리
* 인증·인가(JWT 기반)
* DB 연동 및 데이터 무결성 관리

---

## 🛠 기술 스택

### Frontend

* React
* JavaScript (ES6+)
* Axios
* HTML5 / CSS3

### Backend

* Java 21
* Spring Boot
* Spring Security
* MyBatis

### Database & Infra

* PostgreSQL(RDS)
* AWS EC2

---

## ✨ 주요 기능

### 👤 사용자

* 회원가입 / 로그인
* JWT 기반 인증 처리
* 로그인 상태 유지

### 🖼 게시물 (Feed)

* 게시물 업로드 및 조회
* 사용자별 Feed 조회
* 게시물 상세 보기

### ⏱ 스토리 (Story)

* 스토리 업로드
* 24시간 자동 만료 처리

### ❤️ 기타

* 사용자별 마이 페이지
* 프로필 기반 데이터 조회

---

## 🔄 전체 실행 흐름

1. 사용자가 프론트엔드 페이지 접속
2. 로그인 시 JWT 발급
3. 프론트엔드에서 API 요청 시 토큰 전달
4. 백엔드에서 인증/인가 및 비즈니스 로직 처리
5. DB 처리 후 JSON 응답 반환
6. 프론트엔드에서 상태 갱신 및 화면 렌더링

---

## 🚀 실행 방법

### Frontend

```bash
cd front-end
npm install
npm start
```

### Backend

```bash
cd back-end
./gradlew bootRun
```

---

## 🌱 환경 변수 관리

### Frontend

* API 서버 주소
* 인증 관련 설정

```
.env
```

### Backend

* DB 연결 정보
* JWT 시크릿 키

```
application.properties
```

---

## 🎯 프로젝트 목표

* Instagram 핵심 기능 구현을 통한 **실무형 풀스택 경험**
* 프론트엔드와 백엔드의 책임 분리 및 API 설계 역량 강화
* 인증, 보안, 데이터 흐름에 대한 이해
* 배포 환경(AWS)까지 포함한 End-to-End 개발 경험

---
<!--
## 📄 상세 문서

* `frontend/README.md` : 프론트엔드 구조 및 트러블 슈팅
* `backend/README.md`  : 백엔드 구조 및 트러블 슈팅
-->
## 📄 Note

각 영역의 상세 구현과 문제 해결 과정은 개별 README에서 확인할 수 있습니다.
