// Culture 화면 UI용 타입 (현재는 mock data 전용)
import type { HomePlace } from "./home";

// 실제 장소가 속하는 카테고리
export type CultureTopicId = "history" | "museum-art" | "k-culture";

// 탭으로 선택할 수 있는 카테고리 ("all" = 전체)
export type CultureCategoryId = "all" | CultureTopicId;

export interface CultureCategory {
  id: CultureCategoryId;
  label: string; // 탭에 표시할 이름
}

// Home의 장소 타입을 그대로 쓰고, 카테고리만 추가한다.
export interface CulturePlace extends HomePlace {
  topic: CultureTopicId;
}

// 카테고리별로 바뀌는 화면 문구
export interface CultureSection {
  eyebrow: string; // HISTORY
  title: string; // Hero 제목 (\n 으로 줄바꿈)
  subtitle: string;
  heroImageUrl?: string;
  resultTitle: string; // 서울의 역사 명소
  placeCount: number; // UI용 mock 값
  routeTitle: string; // History Route
  routeText: string;
}

// 도시별 Culture 콘텐츠
export interface CultureContent {
  sections: Record<CultureCategoryId, CultureSection>;
  places: CulturePlace[];
}

// ===== Place Detail =====
// 이름/설명/이미지는 CulturePlace에 있고, Detail 화면에서만 필요한 정보만 따로 둔다.
// CulturePlace.id 로 연결한다. (현재는 mock data 전용)

export interface PlacePhoto {
  id: string;
  alt: string;
  imageUrl?: string; // 없으면 placeholder 표시
}

// Travel Info 한 칸 (예: 09:00 – 18:00 / Closed on Tuesdays)
export interface PlaceInfoItem {
  value: string;
  note?: string;
  highlight?: boolean; // 강조 색상 (예: Free Entry)
}

export interface PlaceTravelInfo {
  openingHours: PlaceInfoItem;
  recommendedVisit: PlaceInfoItem;
  bestTime: PlaceInfoItem;
  admission?: PlaceInfoItem;
  address: string;
}

export interface PlaceStoryPoint {
  label: string; // 1395 / Meaning / Look for
  text: string;
}

export interface PlaceHistoryStory {
  lead: string;
  points: PlaceStoryPoint[];
}

// 주변 장소는 다른 CulturePlace의 id + 거리만 저장한다.
export interface NearbyPlaceRef {
  placeId: string;
  distanceKm: number; // mock 거리 (GPS 미사용)
}

export interface CulturePlaceDetail {
  rating: number; // mock 값
  reviewCount: string; // 1.2k
  city: string; // Seoul
  district: string; // Jongno-gu
  intro: string; // 1~2줄 소개 (\n 으로 줄바꿈)
  about: string[]; // 문단 목록
  photos: PlacePhoto[];
  travelInfo: PlaceTravelInfo;
  historyStory?: PlaceHistoryStory; // 없으면 Section 자체를 숨김
  nearby: NearbyPlaceRef[];
}
