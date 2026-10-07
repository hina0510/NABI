import type { HomeContent, Theme } from "@/types/home";

// 임시 mock data. 추후 Supabase 데이터로 교체한다.

export const THEMES: Theme[] = [
  { id: "culture", name: "Culture", localName: "문화" },
  { id: "nature", name: "Nature", localName: "자연" },
  { id: "food", name: "Food", localName: "맛집" },
  { id: "shopping", name: "Shopping", localName: "쇼핑" },
];

// key: City id (lib/mockDestinations.ts)
export const HOME_CONTENT: Record<string, HomeContent> = {
  seoul: {
    localCityName: "서울",
    todaysPicks: [
      {
        id: "bukchon",
        name: "Bukchon Hanok Village",
        localName: "북촌한옥마을",
        description: "전통과 일상이 공존하는\n서울의 특별한 골목",
      },
      {
        id: "gyeongbokgung",
        name: "Gyeongbokgung Palace",
        localName: "경복궁",
        description: "조선 왕조의 역사가 살아 있는\n서울의 대표 궁궐",
      },
      {
        id: "ikseon",
        name: "Ikseon-dong",
        localName: "익선동",
        description: "한옥 골목 속\n감각적인 카페와 식당",
      },
      {
        id: "namsan-tower",
        name: "N Seoul Tower",
        localName: "N서울타워",
        description: "서울을 한눈에 내려다보는\n대표 전망 명소",
      },
    ],
    nearbyPlaces: [
      { id: "gyeongbokgung", name: "Gyeongbokgung Palace", localName: "경복궁", distanceKm: 2.1 },
      { id: "ikseon", name: "Ikseon-dong", localName: "익선동", distanceKm: 1.8 },
      { id: "hangang", name: "Hangang Park", localName: "한강공원", distanceKm: 4.3 },
      { id: "bukchon", name: "Bukchon Hanok Village", localName: "북촌한옥마을", distanceKm: 1.2 },
    ],
    firstTimePlaces: [
      { id: "namsan-tower", name: "N Seoul Tower", localName: "N서울타워", description: "서울의 대표 전망 명소" },
      { id: "myeongdong", name: "Myeongdong Street", localName: "명동거리", description: "쇼핑과 음식이 가득한 거리" },
      { id: "gyeongbokgung", name: "Gyeongbokgung Palace", localName: "경복궁", description: "서울 여행의 첫걸음, 조선의 궁궐" },
    ],
  },
};
