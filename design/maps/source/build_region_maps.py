"""
NABI Explore 시·도별 상세 지도 SVG 생성 스크립트 (Python 3 표준 라이브러리만 사용)

경기도(gyeonggi-cities.svg)를 제외한 15개 시·도의 하위 행정구역 지도를 만든다.
병합·단순화·라벨 기준점 계산은 build_maps.py 의 함수를 그대로 사용해 경기도 지도와 같은 규칙을 따른다.

- 특별시·광역시: 자치구·군 단위
- 도·특별자치도: 시·군 단위 (일반구가 있는 시는 시 단위로 병합, 코드 = 시 코드)
- 전남광주통합특별시: 시·군 + 자치구(옛 광주광역시 5개 구)
- 세종특별자치시: 하위 시·군·구가 없는 단층제 → 읍·면·동 단위
- 제주특별자치도: 행정시(제주시·서귀포시) 단위
- 본토와 같은 축척으로 담으면 지도가 지나치게 작아지는 원거리 섬(울릉도·독도, 서해5도 등)은
  비율을 유지한 확대도(inset)로 지도 가장자리 빈 곳에 배치
- 작은 지역 라벨은 겹치지 않도록 지역 내부에서 위치를 옮기거나 크기를 줄임(최소 8px)

사용법: python build_region_maps.py <HangJeongDong.geojson> <출력 폴더>
"""
import json
import math
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
LIB_END = "# " + "-" * 64 + " main"     # build_maps.py 에서 공통 함수가 끝나는 지점

# build_maps.py 의 공통 함수(dissolve, simplify_shared, path_d, label_point 등)만 불러온다.
_src = open(os.path.join(HERE, "build_maps.py"), encoding="utf-8").read()
_lib = {"__name__": "build_maps_lib"}
exec(_src.split(LIB_END)[0], _lib)
dissolve = _lib["dissolve"]
simplify_shared = _lib["simplify_shared"]
path_d = _lib["path_d"]
label_point = _lib["label_point"]
signed_area = _lib["signed_area"]
mercator = _lib["mercator"]
proj = _lib["proj"]
WIDTH, PAD = _lib["WIDTH"], _lib["PAD"]
BASE_FILL, SELECTED_FILL, LABEL_COLOR, FONT = (
    _lib["BASE_FILL"], _lib["SELECTED_FILL"], _lib["LABEL_COLOR"], _lib["FONT"])
ATTR = _lib["ATTR"]

SRC, OUT = sys.argv[1], sys.argv[2]

MIN_AREA = 0.1          # 이보다 작은 섬(px²)은 생략 (경기도와 동일)
INSET_FRAME = "#B7D4EE"

# 하위 행정구역 로마자 id (국립국어원 로마자 표기, 행정구역 단위 접미사 생략 — 경기도와 동일 규칙)
IDS = {
    "11": {"종로구": "jongno", "중구": "jung", "용산구": "yongsan", "성동구": "seongdong",
           "광진구": "gwangjin", "동대문구": "dongdaemun", "중랑구": "jungnang", "성북구": "seongbuk",
           "강북구": "gangbuk", "도봉구": "dobong", "노원구": "nowon", "은평구": "eunpyeong",
           "서대문구": "seodaemun", "마포구": "mapo", "양천구": "yangcheon", "강서구": "gangseo",
           "구로구": "guro", "금천구": "geumcheon", "영등포구": "yeongdeungpo", "동작구": "dongjak",
           "관악구": "gwanak", "서초구": "seocho", "강남구": "gangnam", "송파구": "songpa",
           "강동구": "gangdong"},
    "26": {"중구": "jung", "서구": "seo", "동구": "dong", "영도구": "yeongdo", "부산진구": "busanjin",
           "동래구": "dongnae", "남구": "nam", "북구": "buk", "해운대구": "haeundae", "사하구": "saha",
           "금정구": "geumjeong", "강서구": "gangseo", "연제구": "yeonje", "수영구": "suyeong",
           "사상구": "sasang", "기장군": "gijang"},
    "27": {"중구": "jung", "동구": "dong", "서구": "seo", "남구": "nam", "북구": "buk",
           "수성구": "suseong", "달서구": "dalseo", "달성군": "dalseong", "군위군": "gunwi"},
    "28": {"제물포구": "jemulpo", "영종구": "yeongjong", "미추홀구": "michuhol", "연수구": "yeonsu",
           "남동구": "namdong", "부평구": "bupyeong", "계양구": "gyeyang", "서해구": "seohae",
           "검단구": "geomdan", "강화군": "ganghwa", "옹진군": "ongjin"},
    "30": {"동구": "dong", "중구": "jung", "서구": "seo", "유성구": "yuseong", "대덕구": "daedeok"},
    "31": {"중구": "jung", "남구": "nam", "동구": "dong", "북구": "buk", "울주군": "ulju"},
    "36": {"조치원읍": "jochiwon", "연기면": "yeongi", "연동면": "yeondong", "부강면": "bugang",
           "금남면": "geumnam", "장군면": "janggun", "연서면": "yeonseo", "전의면": "jeonui",
           "전동면": "jeondong", "소정면": "sojeong", "한솔동": "hansol", "새롬동": "saerom",
           "나성동": "naseong", "도담동": "dodam", "어진동": "eojin", "해밀동": "haemil",
           "아름동": "areum", "종촌동": "jongchon", "고운동": "goun", "소담동": "sodam",
           "보람동": "boram", "대평동": "daepyeong", "반곡동": "bangok", "다정동": "dajeong"},
    "51": {"춘천시": "chuncheon", "원주시": "wonju", "강릉시": "gangneung", "동해시": "donghae",
           "태백시": "taebaek", "속초시": "sokcho", "삼척시": "samcheok", "홍천군": "hongcheon",
           "횡성군": "hoengseong", "영월군": "yeongwol", "평창군": "pyeongchang", "정선군": "jeongseon",
           "철원군": "cheorwon", "화천군": "hwacheon", "양구군": "yanggu", "인제군": "inje",
           "고성군": "goseong", "양양군": "yangyang"},
    "43": {"청주시": "cheongju", "충주시": "chungju", "제천시": "jecheon", "보은군": "boeun",
           "옥천군": "okcheon", "영동군": "yeongdong", "증평군": "jeungpyeong", "진천군": "jincheon",
           "괴산군": "goesan", "음성군": "eumseong", "단양군": "danyang"},
    "44": {"천안시": "cheonan", "공주시": "gongju", "보령시": "boryeong", "아산시": "asan",
           "서산시": "seosan", "논산시": "nonsan", "계룡시": "gyeryong", "당진시": "dangjin",
           "금산군": "geumsan", "부여군": "buyeo", "서천군": "seocheon", "청양군": "cheongyang",
           "홍성군": "hongseong", "예산군": "yesan", "태안군": "taean"},
    "52": {"전주시": "jeonju", "군산시": "gunsan", "익산시": "iksan", "정읍시": "jeongeup",
           "남원시": "namwon", "김제시": "gimje", "완주군": "wanju", "진안군": "jinan",
           "무주군": "muju", "장수군": "jangsu", "임실군": "imsil", "순창군": "sunchang",
           "고창군": "gochang", "부안군": "buan"},
    "12": {"목포시": "mokpo", "여수시": "yeosu", "순천시": "suncheon", "나주시": "naju",
           "광양시": "gwangyang", "동구": "dong", "서구": "seo", "남구": "nam", "북구": "buk",
           "광산구": "gwangsan", "담양군": "damyang", "곡성군": "gokseong", "구례군": "gurye",
           "고흥군": "goheung", "보성군": "boseong", "화순군": "hwasun", "장흥군": "jangheung",
           "강진군": "gangjin", "해남군": "haenam", "영암군": "yeongam", "무안군": "muan",
           "함평군": "hampyeong", "영광군": "yeonggwang", "장성군": "jangseong", "완도군": "wando",
           "진도군": "jindo", "신안군": "sinan"},
    "47": {"포항시": "pohang", "경주시": "gyeongju", "김천시": "gimcheon", "안동시": "andong",
           "구미시": "gumi", "영주시": "yeongju", "영천시": "yeongcheon", "상주시": "sangju",
           "문경시": "mungyeong", "경산시": "gyeongsan", "의성군": "uiseong", "청송군": "cheongsong",
           "영양군": "yeongyang", "영덕군": "yeongdeok", "청도군": "cheongdo", "고령군": "goryeong",
           "성주군": "seongju", "칠곡군": "chilgok", "예천군": "yecheon", "봉화군": "bonghwa",
           "울진군": "uljin", "울릉군": "ulleung"},
    "48": {"창원시": "changwon", "진주시": "jinju", "통영시": "tongyeong", "사천시": "sacheon",
           "김해시": "gimhae", "밀양시": "miryang", "거제시": "geoje", "양산시": "yangsan",
           "의령군": "uiryeong", "함안군": "haman", "창녕군": "changnyeong", "고성군": "goseong",
           "남해군": "namhae", "하동군": "hadong", "산청군": "sancheong", "함양군": "hamyang",
           "거창군": "geochang", "합천군": "hapcheon"},
    "50": {"제주시": "jeju", "서귀포시": "seogwipo"},
}

# 시·도별 설정
#   file: 출력 파일명, unit: "sgg"(시·군·구) | "emd"(읍·면·동), title: SVG 제목
#   insets: 원거리 섬 확대도 — id, name, box(서경, 남위, 동경, 북위: 이 범위에 중심이 있는 섬을 이동),
#           scale(본토 축척 대비 배율), caption(확대도 상단 지명, 선택)
#   keep_tiny: 면적이 작아도 생략하지 않을 지역 (독도를 포함하는 울릉군)
REGIONS = [
    {"sido": "11", "file": "seoul-districts.svg", "unit": "sgg", "title": "서울특별시 자치구 지도"},
    {"sido": "26", "file": "busan-districts.svg", "unit": "sgg", "title": "부산광역시 구·군 지도"},
    {"sido": "27", "file": "daegu-districts.svg", "unit": "sgg", "title": "대구광역시 구·군 지도"},
    {"sido": "28", "file": "incheon-districts.svg", "unit": "sgg", "title": "인천광역시 구·군 지도",
     "insets": [
         {"id": "baengnyeong", "name": "백령도·대청도", "box": (124.5, 37.6, 125.0, 38.1),
          "scale": 0.5, "caption": "백령·대청"},
         {"id": "yeonpyeong", "name": "연평도", "box": (125.5, 37.5, 125.85, 37.8),
          "scale": 1.0, "caption": "연평도"},
     ]},
    {"sido": "30", "file": "daejeon-districts.svg", "unit": "sgg", "title": "대전광역시 자치구 지도"},
    {"sido": "31", "file": "ulsan-districts.svg", "unit": "sgg", "title": "울산광역시 구·군 지도"},
    {"sido": "36", "file": "sejong-towns.svg", "unit": "emd", "title": "세종특별자치시 읍·면·동 지도",
     "min_label": 7},
    {"sido": "51", "file": "gangwon-cities.svg", "unit": "sgg", "title": "강원특별자치도 시·군 지도"},
    {"sido": "43", "file": "chungbuk-cities.svg", "unit": "sgg", "title": "충청북도 시·군 지도"},
    {"sido": "44", "file": "chungnam-cities.svg", "unit": "sgg", "title": "충청남도 시·군 지도",
     "insets": [
         {"id": "gyeongnyeolbiyeol", "name": "격렬비열도", "box": (125.4, 36.55, 125.9, 36.7),
          "scale": 1.0, "caption": "격렬비열도"},
     ]},
    {"sido": "52", "file": "jeonbuk-cities.svg", "unit": "sgg", "title": "전북특별자치도 시·군 지도",
     "insets": [
         {"id": "eocheong", "name": "어청도", "box": (125.9, 36.05, 126.05, 36.2),
          "scale": 1.5, "caption": "어청도"},
     ]},
    {"sido": "12", "file": "jeonnam-gwangju-cities.svg", "unit": "sgg",
     "title": "전남광주통합특별시 시·군·구 지도",
     "insets": [
         {"id": "heuksan", "name": "흑산도·홍도", "box": (125.0, 34.55, 125.6, 34.8),
          "scale": 1.0, "caption": "흑산도·홍도"},
         {"id": "gageo", "name": "가거도·태도·만재도", "box": (125.0, 34.0, 125.6, 34.55),
          "scale": 0.8, "caption": "가거도·태도"},
     ]},
    {"sido": "47", "file": "gyeongbuk-cities.svg", "unit": "sgg", "title": "경상북도 시·군 지도",
     "keep_tiny": ("울릉군",),
     "insets": [
         {"id": "ulleungdo", "name": "울릉도", "box": (130.5, 37.3, 131.2, 37.7), "scale": 2.2},
         {"id": "dokdo", "name": "독도", "box": (131.5, 37.0, 132.2, 37.5),
          "scale": 12, "caption": "독도"},
     ]},
    {"sido": "48", "file": "gyeongnam-cities.svg", "unit": "sgg", "title": "경상남도 시·군 지도"},
    {"sido": "50", "file": "jeju-cities.svg", "unit": "sgg", "title": "제주특별자치도 행정시 지도",
     "insets": [
         {"id": "chuja", "name": "추자도", "box": (126.1, 33.85, 126.5, 34.1),
          "scale": 1.0, "caption": "추자도"},
     ]},
]


# ---------------------------------------------------------------- grouping
def group_units(features, sido, unit):
    """하위 행정구역 단위로 행정동을 묶는다. -> {key: (name, code, [features])}"""
    groups = {}
    for f in features:
        p = f["properties"]
        if p["sido"] != sido:
            continue
        if unit == "emd":
            name = p["adm_nm"].split()[-1]
            key = code = p["adm_cd2"]
        else:
            # 일반구가 있는 시(예: 청주시상당구)는 시 단위로 병합 -> 시 코드 = 앞 4자리 + "0"
            m = re.match(r"^(.+?시)(.+구)$", p["sggnm"].replace(" ", ""))
            name = m.group(1) if m else p["sggnm"]
            key = p["sgg"][:4] if m else p["sgg"]
            code = key + "0" if m else p["sgg"]
        g = groups.setdefault(key, (name, code, []))
        assert g[0] == name and g[1] == code, (key, name, code, g[:2])
        g[2].append(f)
    return groups


def label_text(name, unit):
    # 시·군은 접미사 생략(경기도와 동일), 구·읍·면·동은 전체 이름
    if unit == "sgg" and name[-1] in "시군" and len(name) > 2:
        return name[:-1]
    return name


# ---------------------------------------------------------------- layout
def ring_centroid(r):
    return sum(p[0] for p in r) / len(r), sum(p[1] for p in r) / len(r)


def in_box(pt, box):
    return box[0] <= pt[0] <= box[2] and box[1] <= pt[1] <= box[3]


def bbox(points):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return min(xs), min(ys), max(xs), max(ys)


def point_in_rings(x, y, rings):
    c = False
    for r in rings:
        for (x1, y1), (x2, y2) in zip(r, r[1:]):
            if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
                c = not c
    return c


CELL = 2               # 확대도 배치용 점유 격자 크기(px)


def frange(a, b, step):
    v = a
    while v <= b + 1e-9:
        yield v
        v += step


class occupancy:
    """본토 링(경계·내부)과 기존 확대도가 차지한 칸을 표시한 격자 + 2차원 누적합"""

    def __init__(self, rings, height, rects):
        self.nx, self.ny = math.ceil(WIDTH / CELL) + 1, math.ceil(height / CELL) + 1
        grid = [[0] * self.nx for _ in range(self.ny)]
        edges = [(a, b) for r in rings for a, b in zip(r, r[1:])]
        for (x1, y1), (x2, y2) in edges:              # 경계선 (짧은 간격으로 표본)
            n = int(max(abs(x2 - x1), abs(y2 - y1)) / CELL) + 1
            for t in range(n + 1):
                x = x1 + (x2 - x1) * t / n
                y = y1 + (y2 - y1) * t / n
                grid[min(self.ny - 1, int(y / CELL))][min(self.nx - 1, int(x / CELL))] = 1
        for row in range(self.ny):                     # 내부 (scanline, even-odd)
            y = (row + 0.5) * CELL
            xs = sorted(x1 + (y - y1) * (x2 - x1) / (y2 - y1)
                        for (x1, y1), (x2, y2) in edges if (y1 > y) != (y2 > y))
            for a, b in zip(xs[::2], xs[1::2]):
                for col in range(max(0, int(a / CELL)), min(self.nx, int(b / CELL) + 1)):
                    grid[row][col] = 1
        for x, y, w, h in rects:
            for row in range(max(0, int(y / CELL)), min(self.ny, int((y + h) / CELL) + 1)):
                for col in range(max(0, int(x / CELL)), min(self.nx, int((x + w) / CELL) + 1)):
                    grid[row][col] = 1
        self.sum = [[0] * (self.nx + 1) for _ in range(self.ny + 1)]
        for r in range(self.ny):
            acc = 0
            for c in range(self.nx):
                acc += grid[r][c]
                self.sum[r + 1][c + 1] = self.sum[r][c + 1] + acc

    def hits(self, x, y, w, h):
        c0, r0 = max(0, int(x / CELL)), max(0, int(y / CELL))
        c1, r1 = min(self.nx, int((x + w) / CELL) + 1), min(self.ny, int((y + h) / CELL) + 1)
        S = self.sum
        return S[r1][c1] - S[r0][c1] - S[r1][c0] + S[r0][c0] > 0


def layout(rings_by_key, insets, keep_tiny):
    """lon/lat 링을 px 좌표로 투영해 proj 사전을 채운다.
    본토: WIDTH 폭에 맞춤. 확대도: 본토 축척 대비 배율(scale)로 그린 뒤 본토와 겹치지 않는 가장자리 빈 곳에 자동 배치
    (빈 곳이 없으면 아래쪽으로 캔버스를 늘림).
    반환: (height, 확대도 프레임 목록, {(key, ring index): inset index | None})"""
    merc = {}
    for rings in rings_by_key.values():
        for r in rings:
            for p in r:
                if p not in merc:
                    merc[p] = mercator(*p)

    part = {}
    for k, rings in rings_by_key.items():
        for i, r in enumerate(rings):
            c = ring_centroid(r)
            part[(k, i)] = next((j for j, ins in enumerate(insets) if in_box(c, ins["box"])), None)

    def ring_merc_area(r):
        return abs(signed_area([merc[p] for p in r]))

    # 본토 범위: 1차 맞춤 후 생략될 작은 섬은 범위 계산에서 제외 (여백 낭비 방지)
    main = [(k, i) for (k, i), j in part.items() if j is None]
    largest = {}
    for k, i in main:
        a = ring_merc_area(rings_by_key[k][i])
        if a > largest.get(k, (0, None))[0]:
            largest[k] = (a, i)
    kept = main
    s = None
    for _ in range(3):
        if s is not None:
            kept = [(k, i) for k, i in main
                    if k in keep_tiny or largest[k][1] == i
                    or ring_merc_area(rings_by_key[k][i]) * s * s >= MIN_AREA]
        pts = [merc[p] for k, i in kept for p in rings_by_key[k][i]]
        minx, miny, maxx, maxy = bbox(pts)
        s = (WIDTH - 2 * PAD) / (maxx - minx)
    height = math.ceil((maxy - miny) * s + 2 * PAD)

    proj.clear()
    owner = {}                                  # 점 -> 소속(본토 None / 확대도 번호)
    for k, i in main:
        for p in rings_by_key[k][i]:
            x, y = merc[p]
            proj[p] = ((x - minx) * s + PAD, (y - miny) * s + PAD)
            owner[p] = None
    main_rings = [[proj[p] for p in rings_by_key[k][i]] for k, i in kept]

    frames = []
    for j, ins in enumerate(insets):
        members = [(k, i) for (k, i), jj in part.items() if jj == j]
        assert members, ins["id"]
        ipts = [merc[p] for k, i in members for p in rings_by_key[k][i]]
        x0, y0, x1, y1 = bbox(ipts)
        inner = 7
        top = 17 if ins.get("caption") else inner      # 캡션 자리
        si = s * ins["scale"]                     # 본토 축척 대비 배율
        cw = len(ins.get("caption") or "") * 8 * 0.95 + 12
        w = max((x1 - x0) * si + 2 * inner, cw)
        ox = (w - (x1 - x0) * si) / 2             # 캡션이 더 넓으면 섬을 가운데로
        h = (y1 - y0) * si + inner + top

        # 후보 위치: 본토·다른 확대도와 겹치지 않는 곳 중 캔버스 가장자리에 가까운 곳
        occ = occupancy(main_rings, height, [(f["x"], f["y"], f["w"], f["h"]) for f in frames])
        placed = None
        best = None
        for fy in frange(PAD, height - PAD - h, CELL):
            for fx in frange(PAD, WIDTH - PAD - w, CELL):
                if occ.hits(fx - 4, fy - 4, w + 8, h + 8):
                    continue
                edge = min(fx - PAD, WIDTH - PAD - w - fx) + min(fy - PAD, height - PAD - h - fy)
                if best is None or edge < best:
                    best, placed = edge, (fx, fy)
        if placed is None:
            # 빈 곳이 없으면 캔버스를 아래로 늘려 오른쪽 아래에 배치
            placed = (WIDTH - PAD - w, height - PAD + 8)
            height = math.ceil(placed[1] + h + PAD)
        fx, fy = placed
        for k, i in members:
            for p in rings_by_key[k][i]:
                # 같은 점이 본토나 다른 확대도에도 있으면 경계가 끊어지므로 중단
                assert owner.setdefault(p, j) == j, ("확대도 범위가 이어진 땅을 가름", ins["id"])
                x, y = merc[p]
                proj[p] = ((x - x0) * si + fx + ox, (y - y0) * si + fy + top)
        frames.append({"id": ins["id"], "name": ins["name"], "caption": ins.get("caption"),
                       "x": fx, "y": fy, "w": w, "h": h})
    return height, frames, part


# ---------------------------------------------------------------- labels
def text_box(x, y, size, text):
    """라벨 박스 근사 (Noto Sans KR 한글 글자폭 ≈ 0.95em)"""
    w = len(text) * size * 0.95
    h = size * 1.15
    return x - w / 2, y - h / 2, w, h


def overlap(a, b):
    dx = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
    dy = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
    return dx * dy if dx > 0 and dy > 0 else 0.0


def seg_dist(x, y, edges):
    best = 1e18
    for (x1, y1), (x2, y2) in edges:
        dx, dy = x2 - x1, y2 - y1
        L = dx * dx + dy * dy
        t = 0 if L == 0 else max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / L))
        best = min(best, (x - x1 - t * dx) ** 2 + (y - y1 - t * dy) ** 2)
    return math.sqrt(best)


def label_candidates(rings, n=24):
    """지역 내부 격자점 후보 [(경계까지 거리, x, y)] — 경계에서 먼 순"""
    edges = [(a, b) for r in rings for a, b in zip(r, r[1:])]
    cands = []
    for r in rings:
        x0, y0, x1, y1 = bbox(r)
        if (x1 - x0) * (y1 - y0) < 4:
            continue
        for i in range(1, n):
            for j in range(1, n):
                x = x0 + (x1 - x0) * i / n
                y = y0 + (y1 - y0) * j / n
                if point_in_rings(x, y, rings):
                    cands.append((seg_dist(x, y, edges), x, y))
    cands.sort(reverse=True)
    return cands[:150]


def place_labels(items, width, height, obstacles, min_size=8):
    """items: [{id, rings(px), text, size(기본 크기), area, prefer(x, y)}]
    작은 지역부터 배치하면서 다른 라벨·캡션과 겹치지 않고 지역 안에 들어가는 위치와 크기를 고른다.
    반환: {id: (x, y, size)}"""
    placed = {}
    boxes = list(obstacles)
    for it in sorted(items, key=lambda t: t["area"]):
        rings = it["rings"]
        px, py = it["prefer"]
        cands = [(0.0, px, py)] + label_candidates(rings)
        best = None
        for size in range(it["size"], min_size - 1, -1):
            for _, x, y in cands:
                b = text_box(x, y, size, it["text"])
                ov = sum(overlap(b, o) for o in boxes)
                out = (max(0, -b[0]) + max(0, b[0] + b[2] - width)
                       + max(0, -b[1]) + max(0, b[1] + b[3] - height))
                probes = [(b[0] + b[2] * u, b[1] + b[3] * v)
                          for u in (0.05, 0.5, 0.95) for v in (0.15, 0.5, 0.85)]
                inside = sum(point_in_rings(qx, qy, rings) for qx, qy in probes) / len(probes)
                score = (ov * 50 + out * 50 + (1 - inside) * 40 + (it["size"] - size) * 6
                         + math.hypot(x - px, y - py) * 0.08)
                if best is None or score < best[0]:
                    best = (score, x, y, size, b)
            if best[3] == size and best[0] < (it["size"] - size) * 6 + 4:
                break                           # 이 크기에서 겹침 없이 지역 안에 들어감
        _, x, y, size, b = best
        placed[it["id"]] = (x, y, size)
        boxes.append(b)
    return placed


# ---------------------------------------------------------------- svg
def write_svg(path, title, height, regions, labels, frames, notes):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{height}" '
        f'viewBox="0 0 {WIDTH} {height}">',
        f"  <title>{title}</title>",
        f"  <desc>{ATTR}</desc>",
    ]
    if frames:
        # 확대도 테두리 — path 가 아닌 rect 로 그려 지역 목록과 섞이지 않게 함
        lines.append(f'  <g id="insets" fill="none" stroke="{INSET_FRAME}" stroke-width="1" '
                     f'stroke-dasharray="3 2">')
        for fr in frames:
            lines.append(f'    <rect id="inset-{fr["id"]}" data-name="{fr["name"]}" '
                         f'x="{fr["x"]:.1f}" y="{fr["y"]:.1f}" width="{fr["w"]:.1f}" '
                         f'height="{fr["h"]:.1f}" rx="6"/>')
        lines.append("  </g>")
    lines.append('  <g id="regions">')
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
    if notes:
        # 확대도 캡션 등 지역 선택과 무관한 지명 표기. path 와 짝이 없으므로 labels 와 분리
        lines.append('  <g id="notes">')
        for nt in notes:
            lines.append(
                f'    <text id="note-{nt["id"]}" x="{nt["x"]:.1f}" y="{nt["y"]:.1f}" '
                f'font-family="{FONT}" font-size="{nt["size"]}" font-weight="500" '
                f'fill="{LABEL_COLOR}" text-anchor="middle" dominant-baseline="central">{nt["text"]}</text>'
            )
        lines.append("  </g>")
    lines.append("</svg>")
    with open(path, "w", encoding="utf-8", newline="\n") as fp:
        fp.write("\n".join(lines) + "\n")


# ---------------------------------------------------------------- main
data = json.load(open(SRC, encoding="utf-8"))
features = data["features"]
os.makedirs(OUT, exist_ok=True)

for cfg in REGIONS:
    sido, unit = cfg["sido"], cfg["unit"]
    groups = group_units(features, sido, unit)
    names = {g[0] for g in groups.values()}
    assert names == set(IDS[sido]), (sido, names ^ set(IDS[sido]))
    ids = [IDS[sido][g[0]] for g in groups.values()]
    assert len(ids) == len(set(ids)), sido

    rings_by_key = {k: dissolve(fs) for k, (_, _, fs) in groups.items()}
    keep_tiny = {k for k, (nm, _, _) in groups.items() if nm in cfg.get("keep_tiny", ())}
    insets = cfg.get("insets", [])
    height, frames, part = layout(rings_by_key, insets, keep_tiny)
    simp = simplify_shared(rings_by_key, tol=cfg.get("tol", 0.15))

    # 확대도 캡션 (지역 선택과 무관한 지명 표기)
    notes = []
    for fr in frames:
        if fr["caption"]:
            notes.append({"id": fr["id"], "text": fr["caption"], "size": 8,
                          "x": fr["x"] + fr["w"] / 2, "y": fr["y"] + 9})
    obstacles = [text_box(nt["x"], nt["y"], nt["size"], nt["text"]) for nt in notes]

    regions, items = [], []
    keys = sorted(groups, key=lambda k: groups[k][1])
    for n, key in enumerate(keys):
        nm, code, _ = groups[key]
        rid = IDS[sido][nm]
        selected = n == 0                       # 기본 선택: 코드 순 첫 번째 (경기도의 수원시와 같은 규칙)
        rings = simp[key]
        min_area = 0.0 if key in keep_tiny else MIN_AREA
        d = path_d(rings, min_area)
        if not d:
            # 모든 링이 기준보다 작으면 가장 큰 링이라도 유지 (지역 누락 방지)
            d = path_d([max(rings, key=lambda r: abs(signed_area(r)))], 0)
        regions.append({"id": rid, "name": nm, "code": code, "selected": selected,
                        "fill": SELECTED_FILL if selected else BASE_FILL, "sw": 1, "d": d})
        # 라벨은 본토 쪽 링을 우선 사용 (확대도에만 있는 지역은 확대도 안에)
        big = [r for r in rings if abs(signed_area(r)) > MIN_AREA] or rings
        main_big = [r for i, r in enumerate(rings)
                    if part[(key, i)] is None and abs(signed_area(r)) > MIN_AREA]
        lrings = main_big or big
        (x, y), r = label_point(lrings)
        outer = max(lrings, key=lambda q: abs(signed_area(q)))
        sign = signed_area(outer) > 0
        lrings = [outer] + [q for q in lrings if (signed_area(q) > 0) != sign]
        items.append({"id": rid, "rings": lrings, "text": label_text(nm, unit), "prefer": (x, y),
                      "size": 11 if r > 16 else (10 if r > 10 else 9),
                      "area": sum(abs(signed_area(q)) for q in big)})

    pos = place_labels(items, WIDTH, height, obstacles, cfg.get("min_label", 8))
    labels = []
    for reg, it in zip(regions, items):
        x, y, size = pos[reg["id"]]
        labels.append({"id": reg["id"], "x": x, "y": y, "size": size,
                       "weight": 700 if reg["selected"] else 500,
                       "fill": "#FFFFFF" if reg["selected"] else LABEL_COLOR, "text": it["text"]})

    first = groups[keys[0]][0]
    write_svg(os.path.join(OUT, cfg["file"]), f'{cfg["title"]} ({first} 선택)', height,
              regions, labels, frames, notes)
    print(f'{cfg["file"]}: {len(regions)} regions, viewBox 0 0 {WIDTH} {height}, insets {len(frames)}')
