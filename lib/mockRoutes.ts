import type { HomePlace } from "@/types/home";
import type { Route, RouteDay, RouteFilter, RouteStop } from "@/types/route";
import { findPlace } from "@/lib/mockSaved";

// 임시 mock data (UI용 날짜, 실제 예약 정보 아님). 추후 Supabase 데이터로 교체한다.
// status는 현재 날짜로 계산하지 않고 직접 지정한다.
// 일정의 시간·이동 수단·거리는 UI 확인용 mock 값이며 실제 계산값이 아니다.

export const ROUTE_FILTERS: { id: RouteFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

// 기존 mock(Culture / Home / Saved)에 없는 장소만 Route 일정용으로 최소 정보만 추가한다.
// Saved 목록에는 추가하지 않는다.
const ROUTE_EXTRA_PLACES: HomePlace[] = [
  { id: "samcheong", name: "Samcheong-dong", localName: "삼청동" },
  { id: "insadong", name: "Insadong", localName: "인사동" },
  { id: "cheonggyecheon", name: "Cheonggyecheon", localName: "청계천" },
  { id: "changgyeonggung", name: "Changgyeonggung Palace", localName: "창경궁" },
  { id: "dongbaek", name: "Dongbaekseom Island", localName: "동백섬" },
  { id: "gwangalli", name: "Gwangalli Beach", localName: "광안리해수욕장" },
  { id: "gamcheon", name: "Gamcheon Culture Village", localName: "감천문화마을" },
  { id: "manjanggul", name: "Manjanggul Cave", localName: "만장굴" },
  { id: "woljeongri", name: "Woljeong-ri Beach", localName: "월정리해변" },
  { id: "cheonjiyeon", name: "Cheonjiyeon Falls", localName: "천지연폭포" },
  { id: "olle-market", name: "Seogwipo Olle Market", localName: "서귀포매일올레시장" },
  { id: "hyeopjae", name: "Hyeopjae Beach", localName: "협재해수욕장" },
  { id: "osulloc", name: "O'sulloc Tea Museum", localName: "오설록 티뮤지엄" },
  { id: "songaksan", name: "Songaksan Mountain", localName: "송악산" },
];

// placeCount / days는 아래 schedule과 같은 값으로 맞춘다. (Route Main 카드와 Detail이 일치해야 함)
export const MOCK_ROUTES: Route[] = [
  {
    id: "seoul-trip",
    title: "Seoul Trip",
    regionId: "seoul",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    placeCount: 12,
    days: 3,
    status: "upcoming",
    schedule: [
      {
        day: 1,
        label: "HERITAGE",
        areaName: "Jongno Route",
        stops: [
          { id: "d1-1", placeId: "gyeongbokgung", startTime: "09:00", endTime: "11:00", transportToNext: { mode: "walking", durationMin: 8, distanceM: 600 } },
          { id: "d1-2", placeId: "bukchon", startTime: "11:30", endTime: "13:00", transportToNext: { mode: "bus", durationMin: 15, distanceM: 1200 } },
          { id: "d1-3", placeId: "samcheong", startTime: "13:20", endTime: "15:00", transportToNext: { mode: "walking", durationMin: 10, distanceM: 800 } },
          { id: "d1-4", placeId: "insadong", startTime: "15:10", endTime: "16:30", transportToNext: { mode: "walking", durationMin: 12, distanceM: 1000 } },
          { id: "d1-5", placeId: "cheonggyecheon", startTime: "16:40", endTime: "18:00" },
        ],
      },
      {
        day: 2,
        label: "MUSEUM & ART",
        areaName: "Yongsan Route",
        stops: [
          { id: "d2-1", placeId: "national-museum", startTime: "10:00", endTime: "12:00", transportToNext: { mode: "subway", durationMin: 12, distanceM: 3400 } },
          { id: "d2-2", placeId: "leeum", startTime: "13:00", endTime: "14:30", transportToNext: { mode: "walking", durationMin: 15, distanceM: 1100 } },
          { id: "d2-3", placeId: "hybe-yongsan", startTime: "15:00", endTime: "15:40", transportToNext: { mode: "subway", durationMin: 25, distanceM: 6800 } },
          { id: "d2-4", placeId: "starfield-library", startTime: "16:30", endTime: "18:00" },
        ],
      },
      {
        day: 3,
        label: "CITY",
        areaName: "Seongsu & Namsan",
        stops: [
          { id: "d3-1", placeId: "seongsu", startTime: "10:00", endTime: "12:30", transportToNext: { mode: "subway", durationMin: 30, distanceM: 7500 } },
          { id: "d3-2", placeId: "myeongdong", startTime: "13:30", endTime: "15:00", transportToNext: { mode: "car", durationMin: 12, distanceM: 2600 } },
          { id: "d3-3", placeId: "namsan-tower", startTime: "15:30", endTime: "17:30" },
        ],
      },
    ],
  },
  {
    id: "busan-weekend",
    title: "Busan Weekend",
    regionId: "busan",
    startDate: "2026-11-02",
    endDate: "2026-11-03",
    placeCount: 5,
    days: 2,
    status: "upcoming",
    schedule: [
      {
        day: 1,
        label: "COAST",
        areaName: "Haeundae Route",
        stops: [
          { id: "d1-1", placeId: "haeundae", startTime: "10:00", endTime: "12:00", transportToNext: { mode: "walking", durationMin: 15, distanceM: 1100 } },
          { id: "d1-2", placeId: "dongbaek", startTime: "12:15", endTime: "13:30", transportToNext: { mode: "car", durationMin: 18, distanceM: 7200 } },
          { id: "d1-3", placeId: "gwangalli", startTime: "17:00", endTime: "20:00" },
        ],
      },
      {
        day: 2,
        label: "OLD TOWN",
        areaName: "Nampo Route",
        stops: [
          { id: "d2-1", placeId: "gamcheon", startTime: "10:00", endTime: "12:00", transportToNext: { mode: "bus", durationMin: 25, distanceM: 5600 } },
          { id: "d2-2", placeId: "jagalchi", startTime: "12:40", endTime: "14:00" },
        ],
      },
    ],
  },
  {
    // 날짜 미정 Route — 일부 장소는 방문 시간도 미정, Day 4는 아직 장소 없음
    id: "jeju-healing",
    title: "Jeju Healing",
    regionId: "jeju",
    placeCount: 9,
    days: 4,
    status: "unscheduled",
    schedule: [
      {
        day: 1,
        label: "EAST",
        areaName: "Seongsan Route",
        stops: [
          { id: "d1-1", placeId: "seongsan", startTime: "06:30", endTime: "08:30", transportToNext: { mode: "car", durationMin: 25, distanceM: 18000 } },
          { id: "d1-2", placeId: "manjanggul", transportToNext: { mode: "car", durationMin: 20, distanceM: 14000 } },
          { id: "d1-3", placeId: "woljeongri" },
        ],
      },
      {
        day: 2,
        label: "SOUTH",
        areaName: "Seogwipo Route",
        stops: [
          { id: "d2-1", placeId: "hallasan", transportToNext: { mode: "car", durationMin: 40, distanceM: 32000 } },
          { id: "d2-2", placeId: "cheonjiyeon", transportToNext: { mode: "walking", durationMin: 10, distanceM: 700 } },
          { id: "d2-3", placeId: "olle-market" },
        ],
      },
      {
        day: 3,
        label: "WEST",
        areaName: "Hallim Route",
        stops: [
          { id: "d3-1", placeId: "hyeopjae", transportToNext: { mode: "car", durationMin: 15, distanceM: 9000 } },
          { id: "d3-2", placeId: "osulloc", transportToNext: { mode: "car", durationMin: 20, distanceM: 13000 } },
          { id: "d3-3", placeId: "songaksan" },
        ],
      },
      { day: 4, stops: [] },
    ],
  },
  {
    id: "seoul-palace-day",
    title: "Seoul Palace Day",
    regionId: "seoul",
    startDate: "2026-05-03",
    endDate: "2026-05-03",
    placeCount: 4,
    days: 1,
    status: "completed",
    schedule: [
      {
        day: 1,
        label: "HERITAGE",
        areaName: "Palace Route",
        stops: [
          { id: "d1-1", placeId: "gyeongbokgung", startTime: "09:30", endTime: "11:30", transportToNext: { mode: "walking", durationMin: 20, distanceM: 1500 } },
          { id: "d1-2", placeId: "changdeokgung", startTime: "12:30", endTime: "14:30", transportToNext: { mode: "walking", durationMin: 12, distanceM: 900 } },
          { id: "d1-3", placeId: "changgyeonggung", startTime: "14:45", endTime: "16:00", transportToNext: { mode: "subway", durationMin: 18, distanceM: 3600 } },
          { id: "d1-4", placeId: "deoksugung-stonewall", startTime: "16:40", endTime: "17:30" },
        ],
      },
    ],
  },
];

// "all"은 전체(날짜 미정 포함), 나머지는 같은 status만 표시
export function filterRoutes(routes: Route[], filter: RouteFilter): Route[] {
  if (filter === "all") return routes;
  return routes.filter((route) => route.status === filter);
}

// 2026-10-12 ~ 2026-10-14 → "2026.10.12 – 10.14" (연도가 다르면 끝 날짜에도 연도 표시)
export function formatRouteDates(route: Route): string {
  if (!route.startDate) return "Date not set";
  const [startY, startM, startD] = route.startDate.split("-");
  const start = `${startY}.${startM}.${startD}`;
  if (!route.endDate || route.endDate === route.startDate) return start;
  const [endY, endM, endD] = route.endDate.split("-");
  return endY === startY ? `${start} – ${endM}.${endD}` : `${start} – ${endY}.${endM}.${endD}`;
}

// ===== Route Detail =====

// 없는 id면 undefined → 화면에서 "Route not found" 표시
export function getRoute(routeId: string | undefined): Route | undefined {
  return MOCK_ROUTES.find((route) => route.id === routeId);
}

// 해당 Day 일정. 일정이 없거나 그 Day가 없으면 undefined
export function getRouteDay(route: Route, day: number): RouteDay | undefined {
  return route.schedule?.find((item) => item.day === day);
}

// 기존 장소 데이터 → Route 전용 장소 순서로 찾는다.
export function getRoutePlace(placeId: string): HomePlace | undefined {
  return findPlace(placeId) ?? ROUTE_EXTRA_PLACES.find((place) => place.id === placeId);
}

// 600 → "600 m", 1200 → "1.2 km"
export function formatDistance(distanceM: number): string {
  if (distanceM < 1000) return `${distanceM} m`;
  return `${(distanceM / 1000).toFixed(1)} km`;
}

// 하루 이동 거리 합계 (mock 값의 단순 합)
export function getTotalDistance(stops: RouteStop[]): number {
  return stops.reduce((sum, stop, index) => {
    // 마지막 장소의 이동 정보는 무시한다.
    if (index === stops.length - 1 || !stop.transportToNext) return sum;
    return sum + stop.transportToNext.distanceM;
  }, 0);
}
