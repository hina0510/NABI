import type { CultureCategory, CultureCategoryId, CultureContent, CulturePlace } from "@/types/culture";

// 임시 mock data. 추후 Supabase 데이터로 교체한다.

export const CULTURE_CATEGORIES: CultureCategory[] = [
  { id: "all", label: "All" },
  { id: "history", label: "History" },
  { id: "museum-art", label: "Museum & Art" },
  { id: "k-culture", label: "K-Culture Spots" },
];

// key: City id (lib/mockDestinations.ts) — 현재는 Seoul만 존재
export const CULTURE_CONTENT: Record<string, CultureContent> = {
  seoul: {
    sections: {
      all: {
        eyebrow: "CULTURE",
        title: "서울의 문화를\n한 걸음씩",
        subtitle: "Discover history, art and K-culture spots across Seoul.",
        resultTitle: "서울의 문화 명소",
        placeCount: 71,
        routeTitle: "NABI Route",
        routeText: "마음에 드는 문화 명소를 모아 나만의 여행 코스를 만들어보세요.",
      },
      history: {
        eyebrow: "HISTORY",
        title: "서울의 시간을\n만나는 여행",
        subtitle: "Discover places where Seoul's history and traditions remain.",
        resultTitle: "서울의 역사 명소",
        placeCount: 28,
        routeTitle: "History Route",
        routeText: "역사 명소를 따라가는 추천 여행 코스를 만들어보세요.",
      },
      "museum-art": {
        eyebrow: "MUSEUM & ART",
        title: "예술이 있는\n도시를 걷다",
        subtitle: "Discover museums, galleries and spaces where art becomes part of the city.",
        resultTitle: "Museum & Art in Seoul",
        placeCount: 19,
        routeTitle: "Art Journey",
        routeText: "전시와 미술관을 연결해 하루 여행을 만들어보세요.",
      },
      "k-culture": {
        eyebrow: "K-CULTURE SPOTS",
        title: "드라마 속 그곳,\n지금 이곳에서",
        subtitle: "Discover places connected to Korean films, dramas, K-pop and celebrities.",
        resultTitle: "K-Culture Spots in Seoul",
        placeCount: 24,
        routeTitle: "K-Culture Route",
        routeText: "저장한 K-Culture 장소를 모아 여행 경로를 만들어보세요.",
      },
    },
    places: [
      {
        id: "gyeongbokgung",
        topic: "history",
        name: "Gyeongbokgung Palace",
        localName: "경복궁",
        distanceKm: 0.8,
        description: "조선 왕조의 중심이었던 서울의 대표 궁궐",
      },
      {
        id: "bukchon",
        topic: "history",
        name: "Bukchon Hanok Village",
        localName: "북촌한옥마을",
        distanceKm: 1.2,
        description: "전통 한옥과 골목을 따라 걷는 서울의 오래된 풍경",
      },
      {
        id: "changdeokgung",
        topic: "history",
        name: "Changdeokgung Palace",
        localName: "창덕궁",
        distanceKm: 2.1,
        description: "자연과 건축이 조화를 이루는 조선의 궁궐",
      },
      {
        id: "mmca-seoul",
        topic: "museum-art",
        name: "MMCA Seoul",
        localName: "국립현대미술관 서울",
        distanceKm: 0.9,
        description: "경복궁 옆에서 만나는 한국 현대미술의 현재",
      },
      {
        id: "leeum",
        topic: "museum-art",
        name: "Leeum Museum of Art",
        localName: "리움미술관",
        distanceKm: 4.8,
        description: "고미술과 현대미술을 한 공간에서 만나는 미술관",
      },
      {
        id: "national-museum",
        topic: "museum-art",
        name: "National Museum of Korea",
        localName: "국립중앙박물관",
        distanceKm: 5.4,
        description: "한국의 역사와 문화를 한눈에 담은 대표 박물관",
      },
      {
        id: "deoksugung-stonewall",
        topic: "k-culture",
        name: "Deoksugung Stonewall Road",
        localName: "덕수궁 돌담길",
        distanceKm: 1.5,
        description: "수많은 드라마 속 연인들이 걸었던 낭만적인 길",
      },
      {
        id: "hybe-yongsan",
        topic: "k-culture",
        name: "HYBE Yongsan",
        localName: "하이브 용산 사옥",
        distanceKm: 4.6,
        description: "전 세계 K-POP 팬들이 찾아오는 용산의 명소",
      },
      {
        id: "starfield-library",
        topic: "k-culture",
        name: "Starfield Library",
        localName: "별마당 도서관",
        distanceKm: 9.6,
        description: "예능과 광고 속에 등장한 거대한 책의 공간",
      },
    ],
  },
};

// 선택한 카테고리의 장소 목록을 반환한다.
// All은 각 카테고리의 장소를 번갈아 섞어서 보여준다. (역사 → 예술 → K-Culture → 역사 ...)
export function getCulturePlaces(places: CulturePlace[], category: CultureCategoryId): CulturePlace[] {
  if (category !== "all") {
    return places.filter((place) => place.topic === category);
  }

  const groups = [
    places.filter((place) => place.topic === "history"),
    places.filter((place) => place.topic === "museum-art"),
    places.filter((place) => place.topic === "k-culture"),
  ];
  const longest = Math.max(...groups.map((group) => group.length));
  const mixed: CulturePlace[] = [];

  for (let i = 0; i < longest; i++) {
    for (const group of groups) {
      if (group[i]) mixed.push(group[i]);
    }
  }
  return mixed;
}
