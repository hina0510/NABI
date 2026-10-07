// Home 화면 UI용 타입 (현재는 mock data 전용, DB 연결 시 types/place.ts 등으로 정리 예정)

export type ThemeId = "culture" | "nature" | "food" | "shopping";

export interface Theme {
  id: ThemeId;
  name: string; // Culture
  localName: string; // 문화
}

export interface HomePlace {
  id: string;
  name: string; // 영문명
  localName?: string; // 현지명 (예: 북촌한옥마을)
  description?: string;
  distanceKm?: number; // mock 거리 (GPS 미사용)
  imageUrl?: string; // 없으면 placeholder 표시
}

// 도시별 Home 콘텐츠
export interface HomeContent {
  localCityName: string; // 예: 서울
  heroImageUrl?: string;
  todaysPicks: HomePlace[];
  nearbyPlaces: HomePlace[];
  firstTimePlaces: HomePlace[];
}
