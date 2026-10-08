import type { HomePlace } from "@/types/home";
import type { SavedFilterId, SavedPlace, SavedRegion } from "@/types/saved";
import { CULTURE_CONTENT } from "@/lib/mockCulture";
import { HOME_CONTENT, THEMES } from "@/lib/mockHome";

// 임시 mock data. 추후 Supabase favorites 데이터로 교체한다.

export const SAVED_FILTERS: { id: SavedFilterId; label: string }[] = [
  { id: "all", label: "All" },
  ...THEMES.map((theme) => ({ id: theme.id, label: theme.name })),
];

// Culture / Home mock에 아직 없는 장소만 최소 정보로 추가한다.
// (경복궁·북촌·N서울타워·명동은 기존 데이터를 id로 참조)
const EXTRA_PLACES: HomePlace[] = [
  { id: "seongsu", name: "Seongsu-dong", localName: "성수동", description: "공장 건물을 개조한 카페와 편집숍이 모인 거리" },
  { id: "ddp", name: "DDP", localName: "동대문디자인플라자", description: "곡선 건축으로 유명한 서울의 디자인 랜드마크" },
  { id: "haeundae", name: "Haeundae Beach", localName: "해운대해수욕장", description: "부산을 대표하는 도심 속 해변" },
  { id: "jagalchi", name: "Jagalchi Market", localName: "자갈치시장", description: "싱싱한 해산물을 맛볼 수 있는 부산의 수산시장" },
  { id: "seongsan", name: "Seongsan Ilchulbong", localName: "성산일출봉", description: "바다 위로 솟은 제주의 일출 명소" },
  { id: "hallasan", name: "Hallasan National Park", localName: "한라산국립공원", description: "제주 중심에 자리한 한국에서 가장 높은 산" },
];

// 저장 목록 — 장소 id만 참조한다. 화면의 장소 수는 이 목록의 길이를 사용한다.
export const SAVED_REGIONS: SavedRegion[] = [
  {
    id: "seoul",
    name: "Seoul",
    places: [
      { placeId: "gyeongbokgung", category: "culture", badge: "History", distanceKm: 0.8 },
      { placeId: "bukchon", category: "culture", badge: "History", distanceKm: 1.2 },
      { placeId: "seongsu", category: "shopping", badge: "Shopping · Cafe", distanceKm: 3.4 },
      { placeId: "namsan-tower", category: "nature", badge: "Viewpoint", distanceKm: 5.2 },
      { placeId: "myeongdong", category: "shopping", badge: "Shopping", distanceKm: 2.1 },
      { placeId: "ddp", category: "culture", badge: "Culture", distanceKm: 3.8 },
    ],
  },
  {
    id: "busan",
    name: "Busan",
    places: [
      { placeId: "haeundae", category: "nature", badge: "Beach", distanceKm: 1.4 },
      { placeId: "jagalchi", category: "food", badge: "Food · Market", distanceKm: 3.1 },
    ],
  },
  {
    id: "jeju",
    name: "Jeju",
    places: [
      { placeId: "seongsan", category: "nature", badge: "Viewpoint", distanceKm: 2.6 },
      { placeId: "hallasan", category: "nature", badge: "Nature", distanceKm: 8.9 },
    ],
  },
];

// 기존 mock 데이터에서 id로 장소를 찾는다. (Culture 장소를 먼저 찾아 topic 정보를 유지)
function findPlace(placeId: string): SavedPlace["place"] | undefined {
  const culturePlaces = Object.values(CULTURE_CONTENT).flatMap((content) => content.places);
  const homePlaces = Object.values(HOME_CONTENT).flatMap((content) => [
    ...content.todaysPicks,
    ...content.nearbyPlaces,
    ...content.firstTimePlaces,
  ]);
  return [...culturePlaces, ...homePlaces, ...EXTRA_PLACES].find((place) => place.id === placeId);
}

export function getSavedRegion(regionId: string): SavedRegion | undefined {
  return SAVED_REGIONS.find((region) => region.id === regionId);
}

// 지역의 저장 목록을 실제 장소 데이터로 바꾼다. (찾지 못한 id는 건너뜀)
export function getSavedPlaces(region: SavedRegion): SavedPlace[] {
  const result: SavedPlace[] = [];
  for (const { placeId, ...ref } of region.places) {
    const place = findPlace(placeId);
    if (place) result.push({ ...ref, place });
  }
  return result;
}

// 카테고리 필터와 검색어(영문명/현지명)를 함께 적용한다.
export function filterSavedPlaces(places: SavedPlace[], filter: SavedFilterId, query: string): SavedPlace[] {
  const keyword = query.trim().toLowerCase();
  return places.filter(({ place, category }) => {
    if (filter !== "all" && category !== filter) return false;
    if (!keyword) return true;
    return place.name.toLowerCase().includes(keyword) || (place.localName ?? "").toLowerCase().includes(keyword);
  });
}

// Detail 상단 chip 문구. Culture 장소는 기존 Detail chip을 그대로 쓰므로 undefined.
// 그 외 장소: [카테고리, 배지 단어...] (중복 제거) 예: Shopping · Cafe → ["Shopping", "Cafe"]
export function getSavedDetailLabels(saved: SavedPlace): string[] | undefined {
  if (saved.place.topic) return undefined;
  const categoryName = THEMES.find((theme) => theme.id === saved.category)?.name ?? saved.category;
  const labels = [categoryName, ...saved.badge.split(" · ")];
  return labels.filter((label, index) => labels.indexOf(label) === index);
}
