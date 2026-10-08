import type { ExploreThemeCard, ExploreThemeContent } from "@/types/exploreTheme";
import { THEMES } from "@/lib/mockHome";
import { findArea, getSubAreas } from "@/lib/exploreRegions";

// 임시 mock data. 추후 Supabase 데이터로 교체한다.
// key: 시·도 id → 하위 행정구역 id (lib/exploreRegions.ts / 지도 SVG의 id와 같음)
// 콘텐츠가 없는 지역은 제목과 카드 이름만 표시하고, 사진은 placeholder로 보여준다.
// 사진은 public/images/... 경로를 imageUrl에 추가하면 된다.
export const EXPLORE_THEME_CONTENT: Record<string, Record<string, ExploreThemeContent>> = {
  gyeonggi: {
    suwon: {
      subtitle: "수원의 다양한 매력을 테마별로 탐험해보세요.",
      cards: {
        culture: { description: "역사와 전통이 살아있는\n수원의 문화유산을 만나보세요." },
        nature: { description: "도심 속에서 만나는\n아름다운 자연을 즐겨보세요." },
        food: { description: "수원의 맛있는 음식과\n로컬 맛집을 찾아보세요." },
        shopping: { description: "수원에서만 만날 수 있는\n특별한 쇼핑 스팟을 둘러보세요." },
      },
    },
  },
};

export interface ExploreThemePage {
  title: string; // Explore Suwon
  subtitle?: string;
  cards: ExploreThemeCard[];
}

export function getExploreThemePage(provinceId: string, cityId: string): ExploreThemePage {
  const area = findArea(getSubAreas(provinceId), cityId);
  const content = EXPLORE_THEME_CONTENT[provinceId]?.[cityId];
  return {
    title: `Explore ${area?.shortName ?? ""}`.trim(),
    subtitle: content?.subtitle,
    cards: THEMES.map((theme, index) => ({
      id: theme.id,
      number: String(index + 1).padStart(2, "0"),
      name: theme.name,
      ...content?.cards[theme.id],
    })),
  };
}
