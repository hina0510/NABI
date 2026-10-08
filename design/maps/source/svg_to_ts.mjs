// design/maps/*.svg → lib/maps/*.ts 변환 스크립트 (Node 표준 라이브러리만 사용)
// SVG의 path 좌표(d)와 라벨 위치는 수정하지 않고 그대로 옮긴다.
// 실행: node design/maps/source/svg_to_ts.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

// 대한민국 시·도 지도 (Explore 첫 화면 — 항상 필요하므로 그대로 import)
const COUNTRY_MAP = { svg: "design/maps/korea-provinces.svg", out: "lib/maps/koreaProvinces.ts", name: "KOREA_PROVINCES_MAP" };

// 시·도별 상세 지도 — provinceId는 korea-provinces.svg의 path id와 같다.
// 상세 지도는 화면에 들어갈 때 필요한 지역만 불러온다. (lib/maps/provinceMaps.ts 참고)
const PROVINCE_MAPS = [
  { provinceId: "seoul", svg: "seoul-districts.svg", module: "seoulDistricts", name: "SEOUL_DISTRICTS_MAP" },
  { provinceId: "busan", svg: "busan-districts.svg", module: "busanDistricts", name: "BUSAN_DISTRICTS_MAP" },
  { provinceId: "daegu", svg: "daegu-districts.svg", module: "daeguDistricts", name: "DAEGU_DISTRICTS_MAP" },
  { provinceId: "incheon", svg: "incheon-districts.svg", module: "incheonDistricts", name: "INCHEON_DISTRICTS_MAP" },
  { provinceId: "daejeon", svg: "daejeon-districts.svg", module: "daejeonDistricts", name: "DAEJEON_DISTRICTS_MAP" },
  { provinceId: "ulsan", svg: "ulsan-districts.svg", module: "ulsanDistricts", name: "ULSAN_DISTRICTS_MAP" },
  { provinceId: "sejong", svg: "sejong-towns.svg", module: "sejongTowns", name: "SEJONG_TOWNS_MAP" },
  { provinceId: "gyeonggi", svg: "gyeonggi-cities.svg", module: "gyeonggiCities", name: "GYEONGGI_CITIES_MAP" },
  { provinceId: "gangwon", svg: "gangwon-cities.svg", module: "gangwonCities", name: "GANGWON_CITIES_MAP" },
  { provinceId: "chungbuk", svg: "chungbuk-cities.svg", module: "chungbukCities", name: "CHUNGBUK_CITIES_MAP" },
  { provinceId: "chungnam", svg: "chungnam-cities.svg", module: "chungnamCities", name: "CHUNGNAM_CITIES_MAP" },
  { provinceId: "jeonbuk", svg: "jeonbuk-cities.svg", module: "jeonbukCities", name: "JEONBUK_CITIES_MAP" },
  { provinceId: "jeonnam-gwangju", svg: "jeonnam-gwangju-cities.svg", module: "jeonnamGwangjuCities", name: "JEONNAM_GWANGJU_CITIES_MAP" },
  { provinceId: "gyeongbuk", svg: "gyeongbuk-cities.svg", module: "gyeongbukCities", name: "GYEONGBUK_CITIES_MAP" },
  { provinceId: "gyeongnam", svg: "gyeongnam-cities.svg", module: "gyeongnamCities", name: "GYEONGNAM_CITIES_MAP" },
  { provinceId: "jeju", svg: "jeju-cities.svg", module: "jejuCities", name: "JEJU_CITIES_MAP" },
];

const HEADER = (svgPath) =>
  `// 자동 생성 파일 — 직접 수정하지 마세요.\n` +
  `// 원본: ${svgPath} (design/maps/SOURCES.md 참고)\n` +
  `// 재생성: node design/maps/source/svg_to_ts.mjs\n\n`;

function attr(tag, key) {
  const match = tag.match(new RegExp(`\\s${key}="([^"]*)"`));
  return match ? match[1] : undefined;
}

// <g id="...">...</g> 안쪽 내용 (그룹이 없으면 빈 문자열)
function group(svg, id) {
  const match = svg.match(new RegExp(`<g\\s[^>]*id="${id}"[^>]*>([\\s\\S]*?)</g>`));
  return match ? match[1] : "";
}

function readText(tag, text) {
  return {
    x: Number(attr(tag, "x")),
    y: Number(attr(tag, "y")),
    fontSize: Number(attr(tag, "font-size")),
    text,
  };
}

function convert(svgPath) {
  const svg = readFileSync(join(root, svgPath), "utf8");
  const [vx, vy, vw, vh] = attr(svg.match(/<svg[^>]*>/)[0], "viewBox").split(/\s+/).map(Number);

  // 지역 라벨 (label-<지역 id>)
  const labels = {};
  for (const m of group(svg, "labels").matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    const id = attr(m[1], "id").replace(/^label-/, "");
    labels[id] = readText(m[1], m[2]);
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  function extend(x, y) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // 지역 경계 (확대도 안의 섬도 해당 지역 path에 포함되어 있다)
  const regions = [];
  for (const m of group(svg, "regions").matchAll(/<path\b([^>]*)\/>/g)) {
    const d = attr(m[1], "d");
    for (const p of d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) extend(Number(p[1]), Number(p[2]));
    const id = attr(m[1], "id");
    regions.push({
      id,
      nameKo: attr(m[1], "data-name"),
      code: attr(m[1], "data-code"),
      strokeWidth: Number(attr(m[1], "stroke-width")),
      label: labels[id] ?? null,
      d,
    });
  }

  // 원거리 섬 확대도 테두리 (선택 대상 아님)
  const insets = [];
  for (const m of group(svg, "insets").matchAll(/<rect\b([^>]*)\/>/g)) {
    const inset = {
      id: attr(m[1], "id"),
      nameKo: attr(m[1], "data-name"),
      x: Number(attr(m[1], "x")),
      y: Number(attr(m[1], "y")),
      width: Number(attr(m[1], "width")),
      height: Number(attr(m[1], "height")),
      rx: Number(attr(m[1], "rx") ?? 0),
    };
    extend(inset.x, inset.y);
    extend(inset.x + inset.width, inset.y + inset.height);
    insets.push(inset);
  }

  // 확대도 캡션 (선택 대상 아님)
  const notes = [];
  for (const m of group(svg, "notes").matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    notes.push({ id: attr(m[1], "id"), ...readText(m[1], m[2]) });
  }

  const round = (n) => Math.round(n * 100) / 100;
  const data = {
    viewBox: { x: vx, y: vy, width: vw, height: vh },
    // 실제 경계(+ 확대도 테두리)가 있는 영역 (지도를 화면에 맞출 때 사용)
    contentBox: { x: round(minX), y: round(minY), width: round(maxX - minX), height: round(maxY - minY) },
    regions,
  };
  // 확대도가 없는 지도는 기존과 같은 형식을 유지한다.
  if (insets.length > 0) data.insets = insets;
  if (notes.length > 0) data.notes = notes;
  return data;
}

function write(out, source) {
  mkdirSync(dirname(join(root, out)), { recursive: true });
  writeFileSync(join(root, out), source, "utf8");
}

// 1) 대한민국 시·도 지도
{
  const data = convert(COUNTRY_MAP.svg);
  write(
    COUNTRY_MAP.out,
    HEADER(COUNTRY_MAP.svg) +
      `import type { SvgMapData } from "@/types/explore";\n\n` +
      `export const ${COUNTRY_MAP.name}: SvgMapData = ${JSON.stringify(data, null, 2)};\n`,
  );
  console.log(`${COUNTRY_MAP.out}: ${data.regions.length} regions`);
}

// 2) 시·도별 상세 지도 + 목록(provinceMaps.ts)
const index = [];
for (const map of PROVINCE_MAPS) {
  const svgPath = `design/maps/${map.svg}`;
  const out = `lib/maps/${map.module}.ts`;
  const data = convert(svgPath);
  write(
    out,
    HEADER(svgPath) +
      `import type { SvgMapData } from "@/types/explore";\n\n` +
      `export const ${map.name}: SvgMapData = ${JSON.stringify(data, null, 2)};\n`,
  );
  console.log(`${out}: ${data.regions.length} regions, ${data.insets?.length ?? 0} insets, contentBox`, data.contentBox);

  // 목록에는 path 좌표를 넣지 않는다. (선택 카드·안내 문구에 필요한 가벼운 정보만)
  index.push(
    `  ${JSON.stringify(map.provinceId)}: {\n` +
      `    contentBox: ${JSON.stringify(data.contentBox)},\n` +
      `    regions: [\n` +
      data.regions.map((r) => `      ${JSON.stringify({ id: r.id, nameKo: r.nameKo, code: r.code })},\n`).join("") +
      `    ],\n` +
      `    load: () => import("./${map.module}").then((m) => m.${map.name}),\n` +
      `  },\n`,
  );
}

write(
  "lib/maps/provinceMaps.ts",
  `// 자동 생성 파일 — 직접 수정하지 마세요.\n` +
    `// 원본: design/maps/*-districts.svg, *-cities.svg, sejong-towns.svg (design/maps/SOURCES.md 참고)\n` +
    `// 재생성: node design/maps/source/svg_to_ts.mjs\n\n` +
    `import type { ProvinceMapEntry } from "@/types/explore";\n\n` +
    `// 시·도 id → 상세 지도 (path 좌표가 들어 있는 지도 데이터는 load()로 필요할 때만 불러온다)\n` +
    `export const PROVINCE_MAPS: Record<string, ProvinceMapEntry> = {\n` +
    index.join("") +
    `};\n`,
);
console.log(`lib/maps/provinceMaps.ts: ${index.length} provinces`);
