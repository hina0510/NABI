import type {
  CultureCategory,
  CultureCategoryId,
  CultureContent,
  CulturePlace,
  CulturePlaceDetail,
  CultureTopicId,
} from "@/types/culture";

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

// ===== Place Detail (mock) =====
// key: CulturePlace.id — 이름/설명은 위 places 목록을 그대로 사용한다.
// 운영시간·평점 등은 UI 확인용 mock 값이며 실제 정보가 아니다.
export const CULTURE_PLACE_DETAILS: Record<string, CulturePlaceDetail> = {
  gyeongbokgung: {
    rating: 4.8,
    reviewCount: "2.4k",
    city: "Seoul",
    district: "Jongno-gu",
    intro: "조선 왕조의 중심이었던 서울의 대표 궁궐.\n도심 한가운데에서 한국의 역사와 건축을 만날 수 있습니다.",
    about: [
      "1395년에 지어진 조선의 첫 번째 법궁으로, 북악산을 배경으로 넓은 궁궐이 펼쳐집니다. 광화문을 지나 근정전까지 걷는 길은 서울 여행의 가장 상징적인 장면 중 하나입니다.",
      "한복을 입고 방문하면 무료로 입장할 수 있어, 전통 의상을 입고 궁궐을 산책하는 여행자들을 쉽게 만날 수 있습니다.",
      "국립고궁박물관과 국립민속박물관이 궁 안에 있어 하루 일정으로 둘러보기 좋습니다.",
    ],
    photos: [
      { id: "gbg-1", alt: "Geunjeongjeon Hall" },
      { id: "gbg-2", alt: "Gwanghwamun Gate" },
      { id: "gbg-3", alt: "Gyeonghoeru Pavilion" },
      { id: "gbg-4", alt: "Hyangwonjeong Pavilion" },
      { id: "gbg-5", alt: "Royal guard ceremony" },
    ],
    travelInfo: {
      openingHours: { value: "09:00 – 18:00", note: "Closed on Tuesdays" },
      recommendedVisit: { value: "1.5 – 2 Hours", note: "Palace walk" },
      bestTime: { value: "Morning", note: "Guard ceremony at 10:00" },
      admission: { value: "₩3,000", note: "Free in hanbok" },
      address: "161 Sajik-ro, Jongno-gu, Seoul",
    },
    historyStory: {
      lead: "600년 전, 새로운 왕조는 산과 물이 감싸는 이 자리에 나라의 중심을 세웠습니다.",
      points: [
        {
          label: "1395",
          text: "조선을 세운 태조가 한양으로 도읍을 옮기며 가장 먼저 지은 궁궐입니다.",
        },
        {
          label: "Meaning",
          text: "‘큰 복을 누리라’는 뜻의 이름처럼, 왕의 즉위식과 나라의 큰 행사가 열리던 무대였습니다.",
        },
        {
          label: "Look for",
          text: "연못 위에 떠 있는 듯한 경회루 — 외국 사신을 맞이하던 연회장의 풍경을 놓치지 마세요.",
        },
      ],
    },
    nearby: [
      { placeId: "mmca-seoul", distanceKm: 0.6 },
      { placeId: "bukchon", distanceKm: 1.2 },
      { placeId: "changdeokgung", distanceKm: 2.1 },
    ],
  },
  bukchon: {
    rating: 4.8,
    reviewCount: "1.2k",
    city: "Seoul",
    district: "Jongno-gu",
    intro: "전통 한옥이 이어진 골목길을 따라\n서울의 오래된 아름다움을 느낄 수 있는 곳입니다.",
    about: [
      "600년의 역사를 간직한 한옥 마을로, 전통과 현대가 공존하는 서울의 대표적인 명소입니다. 고즈넉한 골목을 걸으며 한국의 전통 문화를 가까이에서 경험해보세요.",
      "실제 주민이 생활하는 주거 지역이므로, 방문 시간을 지키고 조용히 둘러보는 것이 좋습니다.",
    ],
    photos: [
      { id: "bc-1", alt: "Hanok alley" },
      { id: "bc-2", alt: "Stone stairs between hanok" },
      { id: "bc-3", alt: "Traditional roof details" },
      { id: "bc-4", alt: "View of the city from Bukchon" },
    ],
    travelInfo: {
      openingHours: { value: "10:00 – 17:00", note: "Quiet hours applied" },
      recommendedVisit: { value: "1 – 2 Hours", note: "Walking exploration" },
      bestTime: { value: "Early Morning", note: "Golden hour photos" },
      admission: { value: "Free Entry", note: "Open heritage village", highlight: true },
      address: "37 Gyedong-gil, Jongno-gu, Seoul",
    },
    historyStory: {
      lead: "경복궁과 창덕궁 사이, 왕실 가까이에 살던 사람들의 동네였습니다.",
      points: [
        {
          label: "Joseon",
          text: "궁궐과 가까워 양반과 관리들이 모여 살던 서울의 대표 주거지였습니다.",
        },
        {
          label: "1930s",
          text: "큰 집터가 나뉘며 지금처럼 작은 한옥이 촘촘히 모인 골목 풍경이 만들어졌습니다.",
        },
        {
          label: "Look for",
          text: "가회동 언덕 위에서 한옥 지붕 너머로 보이는 도심 풍경을 담아보세요.",
        },
      ],
    },
    nearby: [
      { placeId: "changdeokgung", distanceKm: 0.8 },
      { placeId: "mmca-seoul", distanceKm: 0.9 },
      { placeId: "gyeongbokgung", distanceKm: 1.2 },
    ],
  },
  changdeokgung: {
    rating: 4.7,
    reviewCount: "980",
    city: "Seoul",
    district: "Jongno-gu",
    intro: "자연의 지형을 그대로 살려 지은 조선의 궁궐.\n유네스코 세계유산으로 지정된 아름다운 정원을 품고 있습니다.",
    about: [
      "산의 흐름을 거스르지 않고 건물을 배치해, 가장 한국적인 궁궐로 꼽힙니다. 조선의 왕들이 가장 오래 머문 궁궐이기도 합니다.",
      "궁궐 뒤편의 후원은 정해진 시간에 해설과 함께 관람할 수 있어, 미리 일정을 확인하는 것이 좋습니다.",
    ],
    photos: [
      { id: "cdg-1", alt: "Injeongjeon Hall" },
      { id: "cdg-2", alt: "Secret Garden pond" },
      { id: "cdg-3", alt: "Donhwamun Gate" },
    ],
    travelInfo: {
      openingHours: { value: "09:00 – 18:00", note: "Closed on Mondays" },
      recommendedVisit: { value: "2 – 3 Hours", note: "Including the garden" },
      bestTime: { value: "Autumn", note: "Fall foliage in the garden" },
      admission: { value: "₩3,000", note: "Garden tour extra" },
      address: "99 Yulgok-ro, Jongno-gu, Seoul",
    },
    historyStory: {
      lead: "경복궁의 별궁으로 시작했지만, 결국 왕들이 가장 사랑한 궁궐이 되었습니다.",
      points: [
        {
          label: "1405",
          text: "태종 때 경복궁의 이궁으로 지어졌고, 이후 270여 년간 정궁 역할을 했습니다.",
        },
        {
          label: "1997",
          text: "자연과 조화를 이룬 건축으로 유네스코 세계문화유산에 등재되었습니다.",
        },
        {
          label: "Look for",
          text: "후원의 부용지 — 네모난 연못과 둥근 섬이 하늘과 땅을 표현합니다.",
        },
      ],
    },
    nearby: [
      { placeId: "bukchon", distanceKm: 0.8 },
      { placeId: "gyeongbokgung", distanceKm: 2.1 },
    ],
  },
};

// Detail 데이터가 아직 없는 장소는 undefined → 화면에서 기본 정보만 표시한다.
export function getCulturePlaceDetail(placeId: string): CulturePlaceDetail | undefined {
  return CULTURE_PLACE_DETAILS[placeId];
}

// 주변 장소 id를 실제 CulturePlace 데이터로 바꾼다. (목록에 없는 id는 건너뜀)
export function getNearbyCulturePlaces(detail: CulturePlaceDetail): { place: CulturePlace; distanceKm: number }[] {
  const allPlaces = Object.values(CULTURE_CONTENT).flatMap((content) => content.places);
  const result: { place: CulturePlace; distanceKm: number }[] = [];

  for (const ref of detail.nearby) {
    const place = allPlaces.find((item) => item.id === ref.placeId);
    if (place) result.push({ place, distanceKm: ref.distanceKm });
  }
  return result;
}

export function getCultureTopicLabel(topic: CultureTopicId): string {
  return CULTURE_CATEGORIES.find((category) => category.id === topic)?.label ?? topic;
}
