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
