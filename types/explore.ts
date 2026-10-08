// Explore 지도 화면에서 사용하는 타입

export interface MapBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapLabel {
  x: number;
  y: number;
  fontSize: number;
  text: string; // 지도 위에 표시되는 한글 약칭 (예: 경기, 수원)
}

// SVG 파일에서 가져온 지역 하나 (path 좌표는 원본 그대로)
export interface SvgMapRegion {
  id: string;
  nameKo: string;
  code: string;
  strokeWidth: number;
  label: MapLabel | null;
  d: string;
}

export interface SvgMapData {
  viewBox: MapBox;
  contentBox: MapBox;
  regions: SvgMapRegion[];
}

// 선택 카드에 보여줄 영문 정보
export interface ExploreArea {
  id: string;
  name: string; // 카드 제목 (예: Gyeonggi-do, Suwon-si)
  shortName: string; // 버튼 텍스트 (예: Explore Gyeonggi)
}
