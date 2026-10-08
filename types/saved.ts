// Saved 화면 UI용 타입 (현재는 mock data 전용)
import type { HomePlace, ThemeId } from "./home";
import type { CultureTopicId } from "./culture";

// 필터 탭 ("all" = 전체). 카테고리는 Home의 Theme(Culture/Nature/Food/Shopping)을 그대로 사용한다.
export type SavedFilterId = "all" | ThemeId;

// 저장 목록은 장소 데이터를 복사하지 않고 장소 id만 참조한다.
export interface SavedPlaceRef {
  placeId: string;
  category: ThemeId;
  badge: string; // 카드에 표시할 배지 (예: History, Shopping · Cafe)
  distanceKm: number; // mock 거리 (GPS 미사용)
}

export interface SavedRegion {
  id: string; // City id (lib/mockDestinations.ts)
  name: string; // Seoul
  imageUrl?: string; // 없으면 placeholder 표시
  places: SavedPlaceRef[];
}

// 화면에 그릴 때 id를 실제 장소 데이터로 바꾼 결과
// Culture 장소는 topic이 있고, 그 외 장소는 없다.
export interface SavedPlace extends Omit<SavedPlaceRef, "placeId"> {
  place: HomePlace & { topic?: CultureTopicId };
}
