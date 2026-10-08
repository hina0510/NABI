import { formatDistance } from "@/lib/mockRoutes";
import { LandmarkIcon } from "@/components/common/Icons";
import styles from "./RouteDetail.module.css";

// 지도에 표시할 장소 (방문 순서대로)
export interface RouteMapStop {
  id: string;
  name: string;
}

interface RouteMapProps {
  stops: RouteMapStop[];
  label?: string; // 카드 eyebrow (예: HERITAGE)
  areaName?: string; // 카드 제목 (예: Jongno Route)
  totalDistanceM: number;
}

// SVG 좌표계 (CSS에서 같은 비율로 표시)
const WIDTH = 358;
const HEIGHT = 256;

type Point = { x: number; y: number };

// 실제 좌표 대신 장소 순서만으로 타원 위에 마커를 배치한다. (mock)
// 실제 Map API로 교체할 때는 이 컴포넌트만 바꾸면 된다. (props: 장소 순서 + 이름)
function getMockPoints(count: number): Point[] {
  if (count === 1) return [{ x: 150, y: 128 }];
  const wobble = [0, 0.08, -0.06, 0.1, -0.04]; // 반지름에 약간의 변화를 줘서 자연스럽게
  return Array.from({ length: count }, (_, i) => {
    const angle = ((-100 + (i * 360) / count) * Math.PI) / 180;
    const scale = 1 + wobble[i % wobble.length];
    return { x: 150 + 92 * scale * Math.cos(angle), y: 128 + 74 * scale * Math.sin(angle) };
  });
}

// 점들을 부드럽게 지나는 곡선 (Catmull-Rom → Bezier)
function getCurvePath(points: Point[]): string {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function RouteMap({ stops, label, areaName, totalDistanceM }: RouteMapProps) {
  const points = getMockPoints(stops.length);

  return (
    <div className={styles.map}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.mapSvg} role="img" aria-label={`Route map with ${stops.length} places`}>
        {/* 지도 배경 — 강/도로 느낌의 장식 */}
        <rect width={WIDTH} height={HEIGHT} fill="#dce8fb" />
        <path d="M-10 40 C 60 10, 120 70, 200 38 S 330 20, 370 44" stroke="#eaf1fd" strokeWidth="26" fill="none" />
        <path d="M-10 128 C 70 100, 150 150, 240 116 S 330 110, 370 132" stroke="#e6eefc" strokeWidth="18" fill="none" />
        <path d="M-10 214 C 80 190, 160 236, 250 206 S 340 196, 370 216" stroke="#eaf1fd" strokeWidth="24" fill="none" />
        <path d="M146 0 V 256" stroke="#ffffff" strokeWidth="3" strokeDasharray="2 5" strokeLinecap="round" opacity="0.9" />

        {points.length > 1 && (
          <path
            d={getCurvePath(points)}
            stroke="#1f5f8f"
            strokeWidth="3"
            strokeDasharray="7 5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {points.map((point, index) => (
          <g key={stops[index].id}>
            <circle cx={point.x} cy={point.y} r="11" fill="#4aa8e0" stroke="#fff" strokeWidth="2.5" />
            <text x={point.x} y={point.y} className={styles.mapMarkerText} textAnchor="middle" dominantBaseline="central">
              {index + 1}
            </text>
          </g>
        ))}
      </svg>

      {stops.length === 0 && <p className={styles.mapEmpty}>No places on this day</p>}

      {areaName && (
        <div className={styles.mapCard}>
          <span className={styles.mapCardThumb}>
            <LandmarkIcon size={20} />
          </span>
          <span className={styles.mapCardText}>
            {label && <span className={styles.mapCardLabel}>{label}</span>}
            <span className={styles.mapCardTitle}>{areaName}</span>
          </span>
        </div>
      )}

      {totalDistanceM > 0 && (
        <span className={styles.mapTotal}>
          <span className={styles.mapTotalDot} />
          {formatDistance(totalDistanceM)} Total
        </span>
      )}
    </div>
  );
}
