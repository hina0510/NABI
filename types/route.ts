// Route 화면 UI용 타입 (현재는 mock data 전용)

// 날짜가 정해지지 않은 Route는 "unscheduled" (All 필터에서만 표시)
export type RouteStatus = "upcoming" | "completed" | "unscheduled";

// 필터 탭 ("all" = 전체)
export type RouteFilter = "all" | Exclude<RouteStatus, "unscheduled">;

// 장소 사이 이동 수단
export type TransportMode = "walking" | "bus" | "subway" | "car";

// 한 장소에서 다음 장소까지의 이동 정보 (mock 값, 실제 길찾기 계산 아님)
export interface RouteTransport {
  mode: TransportMode;
  durationMin: number; // 소요 시간(분)
  distanceM: number; // 거리(m) — 화면에서 m / km로 변환
}

// 하루 일정 안의 장소 하나
export interface RouteStop {
  id: string; // Day 안에서 고유한 id (같은 장소를 두 번 방문할 수도 있으므로 placeId와 분리)
  placeId: string; // 기존 장소 id 참조 (lib/mockSaved.ts, lib/mockRoutes.ts)
  startTime?: string; // "09:00", 미정이면 없음
  endTime?: string;
  // 다음 장소까지의 이동 정보. 마지막 장소에는 넣지 않는다 → 장소 N개 = 이동 구간 N-1개
  transportToNext?: RouteTransport;
}

export interface RouteDay {
  day: number; // 1부터 시작
  label?: string; // 지도 카드 eyebrow (예: HERITAGE)
  areaName?: string; // 지도 카드 제목 (예: Jongno Route)
  stops: RouteStop[]; // 방문 순서대로
}

export interface Route {
  id: string;
  title: string; // Seoul Trip
  regionId: string; // SavedRegion id (lib/mockSaved.ts) — 지역 정보는 복사하지 않고 id로 참조
  imageUrl?: string; // 없으면 placeholder 표시
  startDate?: string; // YYYY-MM-DD, 날짜 미정이면 없음
  endDate?: string;
  placeCount: number;
  days: number;
  status: RouteStatus;
  schedule?: RouteDay[]; // 날짜별 일정, 아직 없으면 없음
}
