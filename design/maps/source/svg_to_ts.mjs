// design/maps/*.svg → lib/maps/*.ts 변환 스크립트 (Node 표준 라이브러리만 사용)
// SVG의 path 좌표(d)와 라벨 위치는 수정하지 않고 그대로 옮긴다.
// 실행: node design/maps/source/svg_to_ts.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const MAPS = [
  { svg: "design/maps/korea-provinces.svg", out: "lib/maps/koreaProvinces.ts", name: "KOREA_PROVINCES_MAP" },
  { svg: "design/maps/gyeonggi-cities.svg", out: "lib/maps/gyeonggiCities.ts", name: "GYEONGGI_CITIES_MAP" },
];

function attr(tag, key) {
  const match = tag.match(new RegExp(`\\s${key}="([^"]*)"`));
  return match ? match[1] : undefined;
}

for (const map of MAPS) {
  const svg = readFileSync(join(root, map.svg), "utf8");
  const [vx, vy, vw, vh] = attr(svg.match(/<svg[^>]*>/)[0], "viewBox").split(/\s+/).map(Number);

  const labels = {};
  for (const m of svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    const id = attr(m[1], "id").replace(/^label-/, "");
    labels[id] = {
      x: Number(attr(m[1], "x")),
      y: Number(attr(m[1], "y")),
      fontSize: Number(attr(m[1], "font-size")),
      text: m[2],
    };
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const regions = [];
  for (const m of svg.matchAll(/<path\b([^>]*)\/>/g)) {
    const d = attr(m[1], "d");
    for (const p of d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) {
      const x = Number(p[1]);
      const y = Number(p[2]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
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

  const round = (n) => Math.round(n * 100) / 100;
  const data = {
    viewBox: { x: vx, y: vy, width: vw, height: vh },
    // 실제 경계가 있는 영역 (지도를 화면에 맞출 때 사용)
    contentBox: { x: round(minX), y: round(minY), width: round(maxX - minX), height: round(maxY - minY) },
    regions,
  };

  const source =
    `// 자동 생성 파일 — 직접 수정하지 마세요.\n` +
    `// 원본: ${map.svg} (design/maps/SOURCES.md 참고)\n` +
    `// 재생성: node design/maps/source/svg_to_ts.mjs\n\n` +
    `import type { SvgMapData } from "@/types/explore";\n\n` +
    `export const ${map.name}: SvgMapData = ${JSON.stringify(data, null, 2)};\n`;

  mkdirSync(dirname(join(root, map.out)), { recursive: true });
  writeFileSync(join(root, map.out), source, "utf8");
  console.log(`${map.out}: ${regions.length} regions, contentBox`, data.contentBox);
}
