import type { ThemeId } from "@/types/home";

// Explore 테마 선택 화면에서 사용하는 타입

// 지역별로 다르게 보여줄 카드 정보 (없으면 비워 둔다)
export interface ExploreThemeCardContent {
  description?: string; // 카드 설명 (줄바꿈은 \n)
  imageUrl?: string; // 없으면 placeholder 표시
}

// 지역별 테마 화면 콘텐츠 (lib/exploreThemes.ts)
export interface ExploreThemeContent {
  subtitle?: string; // 제목 아래 설명
  cards: Partial<Record<ThemeId, ExploreThemeCardContent>>;
}

// 화면에 그릴 카드 하나
export interface ExploreThemeCard extends ExploreThemeCardContent {
  id: ThemeId;
  number: string; // 01
  name: string; // Culture
}
