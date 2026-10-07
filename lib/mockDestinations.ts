import type { Country, Destination } from "@/types/destination";

// 임시 mock data. 추후 Supabase 데이터로 교체한다.
export const COUNTRIES: Country[] = [
  {
    id: "kr",
    name: "South Korea",
    cities: [
      { id: "kr-all", name: "All South Korea", isAll: true },
      { id: "seoul", name: "Seoul" },
      { id: "busan", name: "Busan" },
      { id: "jeju", name: "Jeju" },
      { id: "gyeongju", name: "Gyeongju" },
      { id: "incheon", name: "Incheon" },
      { id: "gangneung", name: "Gangneung" },
    ],
  },
  {
    id: "jp",
    name: "Japan",
    cities: [
      { id: "jp-all", name: "All Japan", isAll: true },
      { id: "tokyo", name: "Tokyo" },
      { id: "osaka", name: "Osaka" },
      { id: "kyoto", name: "Kyoto" },
      { id: "fukuoka", name: "Fukuoka" },
      { id: "sapporo", name: "Sapporo" },
    ],
  },
  {
    id: "cn",
    name: "China",
    cities: [
      { id: "cn-all", name: "All China", isAll: true },
      { id: "beijing", name: "Beijing" },
      { id: "shanghai", name: "Shanghai" },
      { id: "qingdao", name: "Qingdao" },
    ],
  },
  {
    id: "tw",
    name: "Taiwan",
    cities: [
      { id: "tw-all", name: "All Taiwan", isAll: true },
      { id: "taipei", name: "Taipei" },
      { id: "kaohsiung", name: "Kaohsiung" },
      { id: "taichung", name: "Taichung" },
    ],
  },
  {
    id: "th",
    name: "Thailand",
    cities: [
      { id: "th-all", name: "All Thailand", isAll: true },
      { id: "bangkok", name: "Bangkok" },
      { id: "chiang-mai", name: "Chiang Mai" },
      { id: "phuket", name: "Phuket" },
    ],
  },
];

// 상단 추천 chip (South Korea 도시)
export const POPULAR_CITY_IDS = ["seoul", "gyeongju", "jeju"];

export const DEFAULT_DESTINATION: Destination = {
  country: COUNTRIES[0],
  city: COUNTRIES[0].cities[1], // Seoul
};
