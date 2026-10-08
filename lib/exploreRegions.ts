import type { ExploreArea } from "@/types/explore";
import { PROVINCE_MAPS } from "@/lib/maps/provinceMaps";

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

export const DEFAULT_PROVINCE_ID = "gyeonggi";

export function findArea(areas: ExploreArea[], id: string): ExploreArea {
  return areas.find((area) => area.id === id) ?? areas[0];
}

// 상세 지도(2단계)가 있는 시·도인지 — 16개 시·도 모두 lib/maps/provinceMaps.ts에 있다.
export function hasDetailMap(provinceId: string): boolean {
  return provinceId in PROVINCE_MAPS;
}

// ===== 하위 행정구역 (시·군·구 / 읍·면·동) =====
// 이름과 id는 SVG의 data-name / id를 그대로 사용하고, 영문 표기만 행정구역 단위에 맞춰 붙인다.

interface Unit {
  suffix: string; // 영문 접미사 (예: Suwon-si)
  singular: string; // 안내 문구 (예: a city)
  plural: string; // 안내 문구 (예: cities)
}

// 한글 이름의 마지막 글자 → 행정구역 단위
const UNITS: Record<string, Unit> = {
  시: { suffix: "si", singular: "city", plural: "cities" },
  군: { suffix: "gun", singular: "county", plural: "counties" },
  구: { suffix: "gu", singular: "district", plural: "districts" },
  읍: { suffix: "eup", singular: "town", plural: "towns" },
  면: { suffix: "myeon", singular: "town", plural: "towns" },
  동: { suffix: "dong", singular: "neighborhood", plural: "neighborhoods" },
};

// 중구·동구처럼 이름이 한 글자인 구는 버튼에도 전체 이름을 쓴다. (Explore Jung → Explore Jung-gu)
const SHORT_IDS = ["jung", "dong", "seo", "nam", "buk"];

function unitOf(nameKo: string): Unit {
  return UNITS[nameKo.slice(-1)] ?? UNITS["시"];
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// 시·도별 하위 행정구역 목록 (한 번 만든 목록은 재사용)
const subAreaCache = new Map<string, ExploreArea[]>();

export function getSubAreas(provinceId: string): ExploreArea[] {
  const cached = subAreaCache.get(provinceId);
  if (cached) return cached;
  const areas = (PROVINCE_MAPS[provinceId]?.regions ?? []).map((region) => {
    const base = capitalize(region.id);
    const name = `${base}-${unitOf(region.nameKo).suffix}`;
    return { id: region.id, name, shortName: SHORT_IDS.includes(region.id) ? name : base };
  });
  subAreaCache.set(provinceId, areas);
  return areas;
}

// 기본 선택 = SVG의 첫 번째 지역 (코드순 첫 번째 — 경기도는 수원시)
export function getDefaultSubAreaId(provinceId: string): string {
  return PROVINCE_MAPS[provinceId]?.regions[0]?.id ?? "";
}

// 지도에 있는 행정구역 단위 (처음 나오는 순서대로, 중복 제거)
function unitsOf(provinceId: string): Unit[] {
  const units: Unit[] = [];
  for (const region of PROVINCE_MAPS[provinceId]?.regions ?? []) {
    const unit = unitOf(region.nameKo);
    if (!units.some((u) => u.singular === unit.singular)) units.push(unit);
  }
  return units;
}

// ["a", "b", "c"] → "a, b or c"
function joinWords(words: string[], conjunction: string) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} ${conjunction} ${words[words.length - 1]}`;
}

export interface ProvinceTexts {
  countryDescription: string; // 대한민국 지도 카드 (예: Explore cities and counties.)
  subtitle: string; // 상세 지도 안내 (예: Choose a city or county to explore.)
  eyebrow: string; // 상세 지도 카드 (예: SELECTED CITY)
}

export function getProvinceTexts(provinceId: string): ProvinceTexts {
  const units = unitsOf(provinceId);
  const first = units[0] ?? UNITS["시"];
  return {
    countryDescription: `Explore ${joinWords(units.map((u) => u.plural), "and")}.`,
    subtitle: `Choose a ${joinWords(units.map((u) => u.singular), "or")} to explore.`,
    eyebrow: `SELECTED ${first.singular.toUpperCase()}`,
  };
}
