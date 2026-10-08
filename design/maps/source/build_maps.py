"""
NABI Explore 지도 SVG 생성 스크립트 (Python 3 표준 라이브러리만 사용)

입력: admdongkor 행정동 경계 GeoJSON (통계청 SGIS 원자료, WGS84)
출력: korea-provinces.svg, gyeonggi-cities.svg

처리 순서
1. 행정동 폴리곤을 시·도 / 시·군 단위로 묶음
2. 공유 경계(양방향으로 두 번 등장하는 엣지)를 제거해 병합 (원본 좌표 그대로, 근사 없음)
3. Mercator 투영 -> 390px 폭 viewBox 로 스케일
4. 인접 지역이 같은 결과를 얻도록 경계를 arc 단위로 나눠 Douglas-Peucker 단순화
5. 지역별 <path> + 별도 라벨 레이어(<text>)로 SVG 작성

사용법: python build_maps.py <HangJeongDong.geojson> <출력 폴더>
"""
import json
import math
import os
import re
import sys
from collections import defaultdict

SRC, OUT = sys.argv[1], sys.argv[2]

WIDTH = 390          # 모바일 기준 폭(px)
PAD = 12             # 여백(px)
BASE_FILL = "#D5ECFF"
SELECTED_FILL = "#123A6A"
LABEL_COLOR = "#123A6A"
FONT = "Noto Sans KR"

# 시·도: (sido 코드, id, 정식 명칭, 라벨)
PROVINCES = {
    "11": ("seoul", "서울특별시", "서울"),
    "26": ("busan", "부산광역시", "부산"),
    "27": ("daegu", "대구광역시", "대구"),
    "28": ("incheon", "인천광역시", "인천"),
    "30": ("daejeon", "대전광역시", "대전"),
    "31": ("ulsan", "울산광역시", "울산"),
    "36": ("sejong", "세종특별자치시", "세종"),
    "41": ("gyeonggi", "경기도", "경기"),
    "51": ("gangwon", "강원특별자치도", "강원"),
    "43": ("chungbuk", "충청북도", "충북"),
    "44": ("chungnam", "충청남도", "충남"),
    "52": ("jeonbuk", "전북특별자치도", "전북"),
    # 2026-07-01 광주광역시 + 전라남도 통합
    "12": ("jeonnam-gwangju", "전남광주통합특별시", "전남광주"),
    "47": ("gyeongbuk", "경상북도", "경북"),
    "48": ("gyeongnam", "경상남도", "경남"),
    "50": ("jeju", "제주특별자치도", "제주"),
}

# 경기도 시·군 로마자 id (국립국어원 로마자 표기 기준)
GG_IDS = {
    "수원시": "suwon", "성남시": "seongnam", "의정부시": "uijeongbu", "안양시": "anyang",
    "부천시": "bucheon", "광명시": "gwangmyeong", "평택시": "pyeongtaek", "동두천시": "dongducheon",
    "안산시": "ansan", "고양시": "goyang", "과천시": "gwacheon", "구리시": "guri",
    "남양주시": "namyangju", "오산시": "osan", "시흥시": "siheung", "군포시": "gunpo",
    "의왕시": "uiwang", "하남시": "hanam", "용인시": "yongin", "파주시": "paju",
    "이천시": "icheon", "안성시": "anseong", "김포시": "gimpo", "화성시": "hwaseong",
    "광주시": "gwangju", "양주시": "yangju", "포천시": "pocheon", "여주시": "yeoju",
    "연천군": "yeoncheon", "가평군": "gapyeong", "양평군": "yangpyeong",
}


# ---------------------------------------------------------------- geometry utils
def polygons(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]


def signed_area(ring):
    s = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        s += x1 * y2 - x2 * y1
    return s / 2


def dissolve(features):
    """같은 그룹의 폴리곤들을 공유 엣지 제거 방식으로 병합해 링 목록을 돌려준다."""
    edges = {}
    for f in features:
        for poly in polygons(f["geometry"]):
            for i, ring in enumerate(poly):
                r = [tuple(p) for p in ring]
                if r[0] != r[-1]:
                    r.append(r[0])
                # 외곽 링은 반시계, 구멍은 시계 방향으로 통일
                ccw = signed_area(r) > 0
                if (i == 0) != ccw:
                    r.reverse()
                for a, b in zip(r, r[1:]):
                    if a == b:
                        continue
                    if (b, a) in edges:          # 이웃 폴리곤과 공유하는 경계 -> 제거
                        edges[(b, a)] -= 1
                        if edges[(b, a)] == 0:
                            del edges[(b, a)]
                    else:
                        edges[(a, b)] = edges.get((a, b), 0) + 1
    nxt = defaultdict(list)
    for (a, b), n in edges.items():
        for _ in range(n):
            nxt[a].append(b)
    rings = []
    while nxt:
        start = next(iter(nxt))
        ring = [start]
        cur = start
        while True:
            b = nxt[cur].pop()
            if not nxt[cur]:
                del nxt[cur]
            ring.append(b)
            cur = b
            if cur == start:
                break
            if cur not in nxt:      # 비정상 열린 체인 방어
                break
        if len(ring) >= 4 and ring[0] == ring[-1]:
            rings.append(ring)
    return rings


def mercator(lon, lat):
    return math.radians(lon), -math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def dp(points, tol):
    """Douglas-Peucker (반복 구현)"""
    n = len(points)
    if n < 3:
        return points
    keep = [False] * n
    keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    t2 = tol * tol
    while stack:
        s, e = stack.pop()
        (x1, y1), (x2, y2) = points[s], points[e]
        dx, dy = x2 - x1, y2 - y1
        L = dx * dx + dy * dy
        best, idx = -1.0, -1
        for i in range(s + 1, e):
            px, py = points[i]
            if L == 0:
                d = (px - x1) ** 2 + (py - y1) ** 2
            else:
                t = max(0, min(1, ((px - x1) * dx + (py - y1) * dy) / L))
                d = (px - x1 - t * dx) ** 2 + (py - y1 - t * dy) ** 2
            if d > best:
                best, idx = d, i
        if best > t2:
            keep[idx] = True
            stack.append((s, idx))
            stack.append((idx, e))
    return [p for p, k in zip(points, keep) if k]


def simplify_shared(groups, tol):
    """groups: {key: [ring(lon/lat tuple 목록)]}
    모든 링의 엣지 그래프에서 분기점(차수 != 2)을 고정점으로 두고 arc 별로 단순화.
    같은 arc 는 방향과 관계없이 동일한 결과가 나오므로 인접 지역 경계가 어긋나지 않는다."""
    nbr = defaultdict(set)
    for rings in groups.values():
        for r in rings:
            for a, b in zip(r, r[1:]):
                nbr[a].add(b)
                nbr[b].add(a)
    fixed = {p for p, s in nbr.items() if len(s) != 2}
    cache = {}

    def simp_arc(arc):
        fwd, rev = tuple(arc), tuple(reversed(arc))
        key = min(fwd, rev)
        if key not in cache:
            cache[key] = dp([proj[p] for p in key], tol)
        res = cache[key]
        return res if key == fwd else list(reversed(res))

    out = {}
    for k, rings in groups.items():
        res = []
        for r in rings:
            pts = r[:-1]
            idxs = [i for i, p in enumerate(pts) if p in fixed]
            if not idxs:
                # 분기점 없는 링(섬, 고립 영역)은 사전순 최소점을 고정점으로
                m = min(range(len(pts)), key=lambda i: pts[i])
                idxs = [m]
            pts = pts[idxs[0]:] + pts[:idxs[0]]
            idxs = [i - idxs[0] for i in idxs] + [len(pts)]
            pts = pts + [pts[0]]
            new = []
            for s, e in zip(idxs, idxs[1:]):
                seg = simp_arc(pts[s:e + 1])
                new.extend(seg[:-1])
            if len(new) < 3:
                # 단순화로 형태가 사라진 작은 링(독도 등)은 원래 점 유지
                new = [proj[p] for p in pts[:-1]]
            new.append(new[0])
            res.append(new)
        out[k] = res
    return out


proj = {}


def fit(groups):
    """lon/lat 링을 Mercator 투영 후 WIDTH 폭에 맞춰 px 좌표로 변환할 사전(proj) 생성"""
    pts = {p for rings in groups.values() for r in rings for p in r}
    m = {p: mercator(*p) for p in pts}
    xs = [v[0] for v in m.values()]
    ys = [v[1] for v in m.values()]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    s = (WIDTH - 2 * PAD) / (maxx - minx)
    height = math.ceil((maxy - miny) * s + 2 * PAD)
    proj.clear()
    for p, (x, y) in m.items():
        proj[p] = ((x - minx) * s + PAD, (y - miny) * s + PAD)
    return height


def path_d(rings, min_area):
    parts = []
    for r in rings:
        pts = []
        for x, y in r:
            q = (round(x, 2), round(y, 2))
            if not pts or pts[-1] != q:
                pts.append(q)
        if len(pts) < 4 or abs(signed_area(pts)) < min_area:
            continue
        pts = pts[:-1]
        parts.append("M" + " ".join(f"{x:g},{y:g}" for x, y in pts) + "Z")
    return "".join(parts)


def label_point(rings):
    """가장 큰 외곽 링 내부에서 경계로부터 가장 먼 점(근사 pole of inaccessibility)"""
    outer = max(rings, key=lambda r: abs(signed_area(r)))
    # 가장 큰 외곽 링 + 반대 방향 링(구멍: 경기도 안의 서울 등)만 사용
    sign = signed_area(outer) > 0
    rings = [outer] + [r for r in rings if (signed_area(r) > 0) != sign]
    all_edges = [(a, b) for r in rings for a, b in zip(r, r[1:])]

    def inside(x, y):
        c = False
        for r in rings:
            for (x1, y1), (x2, y2) in zip(r, r[1:]):
                if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
                    c = not c
        return c

    def dist(x, y):
        best = 1e18
        for (x1, y1), (x2, y2) in all_edges:
            dx, dy = x2 - x1, y2 - y1
            L = dx * dx + dy * dy
            t = 0 if L == 0 else max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / L))
            d = (x - x1 - t * dx) ** 2 + (y - y1 - t * dy) ** 2
            best = min(best, d)
        return math.sqrt(best)

    xs = [p[0] for p in outer]
    ys = [p[1] for p in outer]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best = (-1, (sum(xs) / len(xs), sum(ys) / len(ys)))
    step = max(x1 - x0, y1 - y0) / 24
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    span = max(x1 - x0, y1 - y0) / 2
    for _ in range(4):
        n = 24
        for i in range(n + 1):
            for j in range(n + 1):
                x = cx - span + 2 * span * i / n
                y = cy - span + 2 * span * j / n
                if inside(x, y):
                    d = dist(x, y)
                    if d > best[0]:
                        best = (d, (x, y))
        cx, cy = best[1]
        span /= 4
    return best[1], best[0]


def write_svg(path, title, desc, height, regions, labels):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{height}" '
        f'viewBox="0 0 {WIDTH} {height}">',
        f"  <title>{title}</title>",
        f"  <desc>{desc}</desc>",
        '  <g id="regions">',
    ]
    for r in regions:
        lines.append(
            f'    <path id="{r["id"]}" data-name="{r["name"]}" data-code="{r["code"]}" '
            f'fill="{r["fill"]}" stroke="#FFFFFF" stroke-width="{r["sw"]}" '
            f'stroke-linejoin="round" d="{r["d"]}"/>'
        )
    lines.append("  </g>")
    lines.append('  <g id="labels">')
    for lb in labels:
        lines.append(
            f'    <text id="label-{lb["id"]}" x="{lb["x"]:.1f}" y="{lb["y"]:.1f}" '
            f'font-family="{FONT}" font-size="{lb["size"]}" font-weight="{lb["weight"]}" '
            f'fill="{lb["fill"]}" text-anchor="middle" dominant-baseline="central">{lb["text"]}</text>'
        )
    lines.append("  </g>")
    lines.append("</svg>")
    with open(path, "w", encoding="utf-8", newline="\n") as fp:
        fp.write("\n".join(lines) + "\n")


ATTR = ("Source: Statistics Korea SGIS administrative boundaries (KOGL Type 1), "
        "processed by vuski/admdongkor ver20260701 (CC BY 4.0).")

# ---------------------------------------------------------------- main
data = json.load(open(SRC, encoding="utf-8"))
features = data["features"]
os.makedirs(OUT, exist_ok=True)

# ===== 1. 대한민국 시·도 =====
by_sido = defaultdict(list)
for f in features:
    by_sido[f["properties"]["sido"]].append(f)
assert set(by_sido) == set(PROVINCES), set(by_sido) ^ set(PROVINCES)

groups = {code: dissolve(fs) for code, fs in by_sido.items()}
height = fit(groups)
simp = simplify_shared(groups, tol=0.18)

regions, labels = [], []
for code, (rid, name, short) in PROVINCES.items():
    rings = simp[code]
    # 독도 등 아주 작은 섬도 경북·울릉 영역은 유지
    min_area = 0.0 if code == "47" else 0.15
    regions.append({"id": rid, "name": name, "code": code, "fill": BASE_FILL,
                    "sw": 0.8, "d": path_d(rings, min_area)})
    (x, y), r = label_point([ring for ring in rings if abs(signed_area(ring)) > 0.15])
    size = 11 if r > 14 else 9
    labels.append({"id": rid, "x": x, "y": y, "size": size, "weight": 500,
                   "fill": LABEL_COLOR, "text": short})

write_svg(os.path.join(OUT, "korea-provinces.svg"),
          "대한민국 시·도 지도", ATTR, height, regions, labels)
print("korea-provinces.svg", len(regions), "regions, height", height)

# ===== 2. 경기도 시·군 =====
by_city = defaultdict(list)
city_name = {}
for f in features:
    p = f["properties"]
    if p["sido"] != "41":
        continue
    key = p["sgg"][:4]                                     # 일반구는 앞 4자리가 같은 시
    m = re.match(r"^(.+?시)(.+구)$", p["sggnm"].replace(" ", ""))
    nm = m.group(1) if m else p["sggnm"]
    assert city_name.setdefault(key, nm) == nm, (key, nm, city_name[key])
    by_city[key].append(f)
assert len(by_city) == 31 and set(city_name.values()) == set(GG_IDS), sorted(city_name.values())

groups = {k: dissolve(fs) for k, fs in by_city.items()}
height = fit(groups)
simp = simplify_shared(groups, tol=0.15)

SMALL_LABEL = 9
regions, labels = [], []
for key in sorted(by_city):
    nm = city_name[key]
    rid = GG_IDS[nm]
    selected = rid == "suwon"
    rings = simp[key]
    code = key + "0"
    regions.append({"id": rid, "name": nm, "code": code,
                    "fill": SELECTED_FILL if selected else BASE_FILL,
                    "sw": 1, "d": path_d(rings, 0.1)})
    (x, y), r = label_point([ring for ring in rings if abs(signed_area(ring)) > 0.1])
    short = nm[:-1]
    size = 11 if r > 16 else (10 if r > 10 else SMALL_LABEL)
    labels.append({"id": rid, "x": x, "y": y, "size": size,
                   "weight": 700 if selected else 500,
                   "fill": "#FFFFFF" if selected else LABEL_COLOR, "text": short})

write_svg(os.path.join(OUT, "gyeonggi-cities.svg"),
          "경기도 시·군 지도 (수원시 선택)", ATTR, height, regions, labels)
print("gyeonggi-cities.svg", len(regions), "regions, height", height)
