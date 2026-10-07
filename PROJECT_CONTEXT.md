# Technology & Development Environment

## 1. Core Stack

이 프로젝트는 처음부터 다음 기술 스택을 기준으로 개발한다.

### Frontend
- Next.js
- React
- TypeScript
- HTML / JSX / TSX
- CSS

### Backend / Database
- Supabase
  - PostgreSQL Database
  - Authentication
  - Storage
  - Row Level Security (RLS)

### Deployment
- Vercel

### Version Control
- Git
- GitHub

---

## 2. Technology Policy

기존 HTML/CSS/JavaScript 프로젝트를 만든 뒤 React로 변환하지 않는다.

처음부터 다음 구조로 개발한다.

Next.js
→ React
→ TypeScript
→ CSS
→ Supabase

JavaScript 대신 가능한 한 TypeScript를 사용한다.

React Component는 `.tsx`를 사용한다.

일반 TypeScript 로직은 `.ts`를 사용한다.

CSS는 처음에는 기본 CSS 또는 CSS Modules를 우선 사용한다.

Tailwind CSS 등 추가 스타일링 라이브러리는 특별한 이유가 없는 한 임의로 도입하지 않는다.

불필요한 외부 라이브러리 사용을 최소화한다.

---

## 3. Next.js

Next.js의 App Router를 사용한다.

기본 구조 예시:

app/
components/
lib/
types/
locales/
public/

페이지는 Next.js Routing을 사용한다.

예:

/
→ Home

/explore
→ 관광지 탐색

/places/[slug]
→ 관광지 상세

/saved
→ 저장한 관광지

/admin
→ 관리자 Dashboard

/admin/places
→ 관광지 관리

/admin/regions
→ 지역 관리

/admin/translations
→ 번역 관리

/admin/analytics
→ 통계

불필요하게 복잡한 Route 구조는 만들지 않는다.

---

## 4. React

React의 기본적인 기능을 우선 사용한다.

주요 학습 및 사용 대상:

- Component
- Props
- State
- Event
- Conditional Rendering
- List Rendering
- Form
- useState
- useEffect
- 필요한 경우 Context

과도한 상태관리 라이브러리는 초기 단계에서 사용하지 않는다.

Redux, Zustand 등의 상태관리 라이브러리는 실제 필요성이 생기기 전에는 추가하지 않는다.

React에서 DOM을 직접 조작하는 방식은 가능한 한 피하고 State 기반으로 UI를 관리한다.

예:

saved === true
→ 저장된 UI 표시

saved === false
→ 저장되지 않은 UI 표시

DB의 실제 데이터와 React의 화면 상태를 구분해서 관리한다.

---

## 5. TypeScript

프로젝트는 TypeScript 기반으로 개발한다.

주요 데이터에는 명확한 Type 또는 Interface를 정의한다.

예:

User
Place
Region
Translation
Favorite
Event
Analytics

가능한 한 `any` 사용을 피한다.

단, 초보 개발자가 이해하기 어려울 정도로 복잡한 TypeScript 패턴이나 Generic 구조는 사용하지 않는다.

타입 안정성과 코드 가독성 사이의 균형을 우선한다.

---

## 6. Supabase

Supabase는 다음 용도로 사용한다.

### Database
- 지역
- 관광지
- 번역
- 사용자
- 저장
- 사용자 행동 이벤트
- 향후 제휴/스탬프 데이터

### Authentication
- 회원가입
- 로그인
- 로그아웃
- 사용자 인증
- 관리자 권한 확인

### Storage
- 관광지 이미지
- 지역 이미지
- 향후 사용자 이미지

### Security
- Row Level Security 적용
- 사용자 개인 데이터 접근 제한
- 관리자 데이터 수정 권한 제한

Service Role Key 등의 민감한 키를 Client 코드에 노출하지 않는다.

환경변수를 사용한다.

---

## 7. Multilingual Architecture

지원 언어:

- Korean: ko
- Simplified Chinese: zh-CN
- Japanese: jp
- English: en

관광지의 공통 데이터와 번역 데이터를 분리한다.

예:

places
→ 위치
→ 좌표
→ 이미지
→ 지역
→ 카테고리

place_translations
→ language
→ name
→ summary
→ history
→ travel_tip

새로운 언어가 추가되어도 places 테이블 구조를 수정하지 않는 구조를 유지한다.

UI 문구는 locale 파일로 분리한다.

단순 직역보다는 향후 국가별 Localization이 가능하도록 설계한다.

---

## 8. Analytics

사용자 행동 분석을 위해 필요한 이벤트를 기록할 수 있도록 설계한다.

예:

- page_view
- place_view
- search
- favorite_add
- favorite_remove
- map_click
- outbound_click

가능한 경우 다음 정보를 함께 기록한다.

- user_id
- session_id
- language
- region_id
- place_id
- event_type
- created_at

개인정보를 불필요하게 수집하지 않는다.

관리자 Dashboard에서 집계된 통계를 확인할 수 있도록 한다.

---

## 9. Development Environment

개발 환경:

- VS Code 또는 Cursor
- Node.js
- npm
- Git
- GitHub
- Supabase
- Vercel

로컬 개발 환경:

localhost
→ Next.js Development Server

Production
→ Vercel

Database / Auth / Storage
→ Supabase

`.env.local`을 사용하여 환경변수를 관리한다.

`.env.local`은 GitHub에 업로드하지 않는다.

`.gitignore`를 반드시 확인한다.

---

## 10. Developer Skill Level

개발자는 다음 경험이 있다.

### 경험 있음
- HTML
- CSS
- JavaScript
- 반응형 웹
- Git / GitHub
- Supabase Database
- Supabase Auth
- Supabase Storage
- Supabase RLS
- 일반적인 웹 UI 구현

### 현재 학습 단계
- React
- TypeScript
- Next.js

React / TypeScript / Next.js는 이 프로젝트를 진행하면서 학습한다.

따라서 코드를 생성할 때 초보자가 이해하기 어려운 과도한 추상화나 복잡한 설계 패턴을 피한다.

기존 HTML/CSS/JavaScript 지식과 연결하여 이해할 수 있는 구조를 우선한다.

---

## 11. Learning Policy

이 프로젝트는 단순 AI 생성 프로젝트가 아니다.

실제 서비스 제작과 동시에 개발자가 React / TypeScript / Next.js를 학습하는 것을 목표로 한다.

새로운 개념이 처음 등장하면 작업 완료 후 간단하게 설명한다.

설명 예:

이번 작업에서 새롭게 사용한 개념

1. useState
현재 화면의 상태를 React에서 관리한다.

2. Props
부모 Component에서 자식 Component로 데이터를 전달한다.

3. Interface
TypeScript에서 데이터의 형태를 정의한다.

한 작업에서 설명하는 새로운 개념은 최대 3개를 원칙으로 한다.

이미 설명했던 개념은 특별한 이유가 없다면 반복해서 설명하지 않는다.

---

## 12. AI Coding Rules

AI가 프로젝트를 수정할 때 다음 규칙을 따른다.

1. 작업 전 이 PROJECT_CONTEXT.md를 확인한다.
2. 기존 프로젝트 구조를 우선 확인한다.
3. 요청받은 범위만 수정한다.
4. 관련 없는 파일을 수정하지 않는다.
5. 기존 기능을 임의로 삭제하지 않는다.
6. 새로운 라이브러리를 임의로 추가하지 않는다.
7. 필요 이상으로 구조를 리팩터링하지 않는다.
8. 전체 프로젝트 코드를 채팅에 반복 출력하지 않는다.
9. 직접 프로젝트 파일을 수정한다.
10. 에러가 발생하면 원인을 먼저 확인한 후 수정한다.
11. 임시방편보다 실제 원인을 해결한다.
12. 보안상 민감한 정보를 코드에 하드코딩하지 않는다.
13. 구현되지 않은 기능을 구현된 것처럼 보고하지 않는다.
14. 요구사항이 불명확한 경우 큰 구조를 임의로 변경하지 않는다.

---

## 13. Token Saving Rules

AI 토큰 사용량을 최소화한다.

PROJECT_CONTEXT.md에 이미 기록된 내용을 답변에서 반복하지 않는다.

작업 완료 보고는 기본적으로 다음 형식을 사용한다.

### Changed
수정/생성한 파일

### Implemented
구현한 기능

### Test
개발자가 확인할 방법

### Learn
이번 작업에서 처음 등장한 핵심 개념 최대 3개

### Issue
남아 있는 문제가 있을 경우에만 작성

전체 코드 또는 긴 코드 블록은 개발자가 요청한 경우에만 출력한다.

PROJECT_CONTEXT.md는 프로젝트 구조나 핵심 정책이 실제로 변경되었을 때만 수정한다.

단순 UI 수정이나 버그 수정마다 PROJECT_CONTEXT.md를 다시 작성하지 않는다.