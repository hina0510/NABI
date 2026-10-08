import type { ExploreArea } from "@/types/explore";

// 지도 SVG의 path id와 같은 id를 사용한다. (lib/maps/*.ts 참고)

// 대한민국 시·도 (16개)
export const PROVINCES: ExploreArea[] = [
  { id: "seoul", name: "Seoul", shortName: "Seoul" },
  { id: "busan", name: "Busan", shortName: "Busan" },
  { id: "daegu", name: "Daegu", shortName: "Daegu" },
  { id: "incheon", name: "Incheon", shortName: "Incheon" },
  { id: "daejeon", name: "Daejeon", shortName: "Daejeon" },
  { id: "ulsan", name: "Ulsan", shortName: "Ulsan" },
  { id: "sejong", name: "Sejong", shortName: "Sejong" },
  { id: "gyeonggi", name: "Gyeonggi-do", shortName: "Gyeonggi" },
  { id: "gangwon", name: "Gangwon-do", shortName: "Gangwon" },
  { id: "chungbuk", name: "Chungcheongbuk-do", shortName: "Chungbuk" },
  { id: "chungnam", name: "Chungcheongnam-do", shortName: "Chungnam" },
  { id: "jeonbuk", name: "Jeonbuk-do", shortName: "Jeonbuk" },
  { id: "jeonnam-gwangju", name: "Jeonnam-Gwangju", shortName: "Jeonnam-Gwangju" },
  { id: "gyeongbuk", name: "Gyeongsangbuk-do", shortName: "Gyeongbuk" },
  { id: "gyeongnam", name: "Gyeongsangnam-do", shortName: "Gyeongnam" },
  { id: "jeju", name: "Jeju-do", shortName: "Jeju" },
];

// 상세 지도(2단계)가 준비된 시·도 — 현재는 경기도만
export const PROVINCES_WITH_DETAIL_MAP = ["gyeonggi"];

export const DEFAULT_PROVINCE_ID = "gyeonggi";

// 경기도 시·군 (31개)
export const GYEONGGI_CITIES: ExploreArea[] = [
  { id: "suwon", name: "Suwon-si", shortName: "Suwon" },
  { id: "seongnam", name: "Seongnam-si", shortName: "Seongnam" },
  { id: "uijeongbu", name: "Uijeongbu-si", shortName: "Uijeongbu" },
  { id: "anyang", name: "Anyang-si", shortName: "Anyang" },
  { id: "bucheon", name: "Bucheon-si", shortName: "Bucheon" },
  { id: "gwangmyeong", name: "Gwangmyeong-si", shortName: "Gwangmyeong" },
  { id: "pyeongtaek", name: "Pyeongtaek-si", shortName: "Pyeongtaek" },
  { id: "dongducheon", name: "Dongducheon-si", shortName: "Dongducheon" },
  { id: "ansan", name: "Ansan-si", shortName: "Ansan" },
  { id: "goyang", name: "Goyang-si", shortName: "Goyang" },
  { id: "gwacheon", name: "Gwacheon-si", shortName: "Gwacheon" },
  { id: "guri", name: "Guri-si", shortName: "Guri" },
  { id: "namyangju", name: "Namyangju-si", shortName: "Namyangju" },
  { id: "osan", name: "Osan-si", shortName: "Osan" },
  { id: "siheung", name: "Siheung-si", shortName: "Siheung" },
  { id: "gunpo", name: "Gunpo-si", shortName: "Gunpo" },
  { id: "uiwang", name: "Uiwang-si", shortName: "Uiwang" },
  { id: "hanam", name: "Hanam-si", shortName: "Hanam" },
  { id: "yongin", name: "Yongin-si", shortName: "Yongin" },
  { id: "paju", name: "Paju-si", shortName: "Paju" },
  { id: "icheon", name: "Icheon-si", shortName: "Icheon" },
  { id: "anseong", name: "Anseong-si", shortName: "Anseong" },
  { id: "gimpo", name: "Gimpo-si", shortName: "Gimpo" },
  { id: "hwaseong", name: "Hwaseong-si", shortName: "Hwaseong" },
  { id: "gwangju", name: "Gwangju-si", shortName: "Gwangju" },
  { id: "yangju", name: "Yangju-si", shortName: "Yangju" },
  { id: "pocheon", name: "Pocheon-si", shortName: "Pocheon" },
  { id: "yeoju", name: "Yeoju-si", shortName: "Yeoju" },
  { id: "yeoncheon", name: "Yeoncheon-gun", shortName: "Yeoncheon" },
  { id: "gapyeong", name: "Gapyeong-gun", shortName: "Gapyeong" },
  { id: "yangpyeong", name: "Yangpyeong-gun", shortName: "Yangpyeong" },
];

export const DEFAULT_CITY_ID = "suwon";

export function findArea(areas: ExploreArea[], id: string): ExploreArea {
  return areas.find((area) => area.id === id) ?? areas[0];
}
