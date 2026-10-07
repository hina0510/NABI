# NABI Database Schema

## 1. Overview

NABI는 다국어 여행지 탐색 웹앱이다.

Database:
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)

지원 언어:
- `ko` — 한국어
- `en` — English
- `jp` — 日本語
- `zh-CN` — 简体中文

### 기본 설계 원칙

- 지역/여행지의 공통 데이터와 번역 데이터를 분리한다.
- 언어별 컬럼(`name_ko`, `name_en` 등)을 만들지 않는다.
- 번역은 별도 translation table에서 관리한다.
- UUID를 기본 PK로 사용한다.
- 날짜/시간은 `timestamptz`를 사용한다.
- 사용자 개인정보는 필요한 만큼만 저장한다.
- 관리자 기능을 제외한 공개 여행정보는 로그인 없이 조회할 수 있다.
- 즐겨찾기는 로그인 사용자만 사용할 수 있다.
- 향후 언어 및 국가 추가가 가능하도록 설계한다.

---

# 2. Tables

## regions

여행 지역의 언어 비종속 정보를 저장한다.

예:
서울 / 부산 / 제주 등

| Column | Type | Description |
|---|---|---|
| id | uuid PK | 지역 ID |
| slug | text UNIQUE | URL용 식별자 |
| image_url | text | 대표 이미지 |
| latitude | numeric | 대표 위도 |
| longitude | numeric | 대표 경도 |
| display_order | integer | 노출 순서 |
| is_active | boolean | 공개 여부 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

Example slug:

`seoul`

`busan`

`jeju`

---

## region_translations

지역의 언어별 콘텐츠를 저장한다.

| Column | Type | Description |
|---|---|---|
| id | uuid PK | 번역 ID |
| region_id | uuid FK | regions.id |
| language | text | 언어 코드 |
| name | text | 지역명 |
| description | text | 지역 소개 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

Constraint:

`UNIQUE(region_id, language)`

Example:

| region | language | name |
|---|---|---|
| seoul | ko | 서울 |
| seoul | en | Seoul |
| seoul | jp | ソウル |
| seoul | zh-CN | 首尔 |

---

# 3. Places

## places

여행지의 언어 비종속 정보를 저장한다.

| Column | Type | Description |
|---|---|---|
| id | uuid PK | 여행지 ID |
| region_id | uuid FK | regions.id |
| slug | text UNIQUE | URL용 식별자 |
| category | text | 여행지 카테고리 |
| image_url | text | 대표 이미지 |
| latitude | numeric | 위도 |
| longitude | numeric | 경도 |
| address | text | 지도/위치용 기본 주소 |
| official_url | text nullable | 공식 홈페이지 |
| status | text | 콘텐츠 상태 |
| is_featured | boolean | 추천 여행지 여부 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

### category 예시

- attraction
- culture
- history
- nature
- food
- shopping
- activity

초기에는 별도 category table을 만들지 않고 문자열로 관리한다.

카테고리가 복잡해질 경우 추후 별도 테이블로 분리할 수 있다.

### status

- `draft`
- `published`
- `hidden`

일반 사용자는 `published` 콘텐츠만 볼 수 있다.

---

## place_translations

여행지의 언어별 콘텐츠를 저장한다.

| Column | Type | Description |
|---|---|---|
| id | uuid PK | 번역 ID |
| place_id | uuid FK | places.id |
| language | text | 언어 코드 |
| name | text | 여행지명 |
| summary | text | 짧은 소개 |
| history | text nullable | 역사/배경 설명 |
| travel_tip | text nullable | 여행 팁 |
| address_display | text nullable | 사용자에게 표시할 현지화 주소 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

Constraint:

`UNIQUE(place_id, language)`

---

# 4. Users

## profiles

Supabase Auth의 `auth.users`와 연결되는 사용자 프로필이다.

비밀번호는 이 테이블에 저장하지 않는다.

| Column | Type | Description |
|---|---|---|
| id | uuid PK/FK | auth.users.id |
| nickname | text nullable | 사용자 닉네임 |
| language | text | 기본 언어 |
| country | text nullable | 국가 코드 |
| role | text | 사용자 권한 |
| created_at | timestamptz | 가입일 |
| updated_at | timestamptz | 수정일 |

### role

- `user`
- `admin`

Default:

`user`

---

# 5. Favorites

## favorites

사용자가 저장한 여행지를 관리한다.

| Column | Type | Description |
|---|---|---|
| id | uuid PK | 즐겨찾기 ID |
| user_id | uuid FK | profiles.id |
| place_id | uuid FK | places.id |
| created_at | timestamptz | 저장일 |

Constraint:

`UNIQUE(user_id, place_id)`

### Saved 상태

현재 사용자와 여행지에 해당하는 row가 존재하면:

`saved = true`

존재하지 않으면:

`saved = false`

저장 버튼 클릭:

`INSERT favorites`

저장 취소:

`DELETE favorites`

React State는 현재 화면의 저장 상태를 관리하고,
Supabase의 favorites table은 실제 저장 데이터를 관리한다.

---

# 6. Analytics

## events

NABI 내부의 주요 사용자 행동을 기록한다.

| Column | Type | Description |
|---|---|---|
| id | uuid PK | 이벤트 ID |
| user_id | uuid nullable | 로그인 사용자 |
| session_id | text nullable | 비로그인 세션 |
| event_type | text | 이벤트 종류 |
| region_id | uuid nullable | 관련 지역 |
| place_id | uuid nullable | 관련 여행지 |
| language | text | 사용 언어 |
| metadata | jsonb nullable | 추가 데이터 |
| created_at | timestamptz | 이벤트 발생 시간 |

### event_type 예시

- `page_view`
- `place_view`
- `search`
- `favorite_add`
- `favorite_remove`
- `map_click`
- `outbound_click`

검색 이벤트의 경우 metadata 예:

```json
{
  "query": "경복궁"
}
```

향후 Admin Analytics에서 다음 데이터를 계산할 수 있다.

- 인기 여행지
- 인기 지역
- 검색 키워드
- 저장 횟수
- 언어별 사용자 행동
- 페이지 조회
- 외부 링크 클릭

초기 MVP에서는 필요한 이벤트부터 단계적으로 구현한다.

---

# 7. Relationships

```text
regions
   │
   ├── region_translations
   │
   └── places
          │
          ├── place_translations
          │
          ├── favorites
          │
          └── events

auth.users
   │
   └── profiles
          │
          └── favorites
```

---

# 8. Supabase Storage

Storage bucket:

`place-images`

용도:
- 지역 대표 이미지
- 여행지 대표 이미지
- 여행지 콘텐츠 이미지

초기에는 이미지 URL을 DB에 저장한다.

향후 여러 이미지가 필요한 경우 별도의 `place_images` table을 추가할 수 있다.

예:

```text
place_images

id
place_id
image_url
alt_text
display_order
created_at
```

MVP에서는 구현하지 않는다.

---

# 9. RLS Policy Direction

모든 주요 사용자 데이터 테이블은 RLS 사용을 기본으로 한다.

## Public

로그인하지 않은 사용자도 조회 가능:

- regions
- region_translations
- published places
- place_translations

단, 비공개 또는 draft 콘텐츠는 일반 사용자에게 노출하지 않는다.

## Favorites

로그인 사용자는:

- 자신의 favorites 조회 가능
- 자신의 favorites 추가 가능
- 자신의 favorites 삭제 가능

다른 사용자의 favorites에는 접근할 수 없다.

조건:

`auth.uid() = user_id`

## Profiles

사용자는 자신의 profile만 수정할 수 있다.

관리자는 필요한 관리 기능에 한해 별도 권한을 사용한다.

## Admin

관리자는:

- regions CRUD
- region translations CRUD
- places CRUD
- place translations CRUD
- analytics 조회

관리자 권한은 클라이언트에서 단순히 숨기는 방식으로 처리하지 않는다.

실제 DB/RLS 권한을 통해 보호한다.

---

# 10. Translation Rules

지원 언어:

```text
ko
en
jp
zh-CN
```

콘텐츠 작성 기준 언어:

`ko`

기본 흐름:

한국어 원문 작성
↓
AI 번역 초안
↓
관리자 확인
↓
게시

향후 필요하면 번역 상태를 추가한다.

예:

draft

reviewed

published

MVP에서는 번역 관리가 복잡해지지 않도록 최소한으로 구현한다.

11. URL Structure

Region:

/explore/seoul
/explore/busan
/explore/jeju

Place:

/places/gyeongbokgung
/places/namsan-tower

URL에는 번역된 여행지명을 사용하지 않고 slug를 사용한다.

언어가 변경되어도 동일한 여행지 ID와 slug를 유지한다.

12. Future Expansion

현재 MVP에서는 구현하지 않지만 DB 확장 시 고려한다.

Digital Stamp

향후:

stamps
user_stamps

GPS 또는 QR 기반 방문 인증 기능을 추가할 수 있다.

Travel Collections

향후 사용자가 여행지를 묶어서 여행 계획을 만들 수 있다.

collections
collection_places

Partnerships

향후 숙박/티켓/체험 등의 외부 제휴 기능을 추가할 수 있다.

필요 시:

partners
affiliate_links

Additional Countries

NABI가 한국 외 국가로 확장될 경우:

countries
country_translations

를 추가하고,

countries
   └── regions
          └── places

구조로 확장한다.

현재 한국 서비스 MVP에서는 countries table을 만들지 않는다.

13. MVP Tables

초기 개발에서 실제로 필요한 핵심 table은 다음 7개다.

regions
region_translations

places
place_translations

profiles
favorites

events

모든 미래 기능을 처음부터 구현하지 않는다.

필요한 기능이 생길 때 schema를 확장한다.

14. AI Coding Rules

AI가 DB 관련 작업을 수행할 때:

이 문서를 먼저 확인한다.

기존 schema를 임의로 변경하지 않는다.

새로운 table/column이 필요하면 이유를 먼저 설명한다.

기존 column 이름을 임의로 변경하지 않는다.

migration이 필요한 변경은 기존 데이터 영향을 고려한다.

Supabase service role key를 client에 노출하지 않는다.

RLS를 우회하는 구현을 하지 않는다.

아직 구현하지 않은 미래 기능용 table을 임의로 생성하지 않는다.

MVP에 필요하지 않은 DB abstraction을 추가하지 않는다.

schema 변경 후 이 문서와 실제 DB 구조가 다르지 않도록 유지한다.