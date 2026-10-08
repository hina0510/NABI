import { Fragment } from "react";
import type { RouteStop, RouteTransport, TransportMode } from "@/types/route";
import { formatDistance, getRoutePlace } from "@/lib/mockRoutes";
import { BusIcon, CarIcon, ClockIcon, MoreVerticalIcon, SubwayIcon, WalkIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import styles from "./RouteDetail.module.css";

interface RouteTimelineProps {
  stops: RouteStop[];
  // 장소 카드 클릭 — 현재는 연결하지 않음 (추후 Place Detail로 이동)
  onSelectStop?: (stop: RouteStop) => void;
}

const TRANSPORT_ICONS: Record<TransportMode, typeof WalkIcon> = {
  walking: WalkIcon,
  bus: BusIcon,
  subway: SubwayIcon,
  car: CarIcon,
};

const TRANSPORT_LABELS: Record<TransportMode, string> = {
  walking: "Walking",
  bus: "Bus",
  subway: "Subway",
  car: "Car",
};

function formatTime(stop: RouteStop): string | undefined {
  if (stop.startTime && stop.endTime) return `${stop.startTime} – ${stop.endTime}`;
  return stop.startTime;
}

// 두 장소 사이의 이동 정보 한 줄
function TransportRow({ transport }: { transport: RouteTransport }) {
  const Icon = TRANSPORT_ICONS[transport.mode];
  const distance = formatDistance(transport.distanceM);
  return (
    <li className={styles.transportRow}>
      <span className={styles.rail}>
        <span className={styles.railDot} />
      </span>
      <span className={styles.transportChip}>
        <Icon size={15} className={styles.transportIcon} />
        <span className={styles.srOnly}>{TRANSPORT_LABELS[transport.mode]}</span>
        <span className={styles.transportTime}>{transport.durationMin} min</span>
        <span className={styles.transportDot} aria-hidden>
          ·
        </span>
        <span>{distance}</span>
      </span>
    </li>
  );
}

// 장소 N개 사이에 이동 정보 N-1개를 끼워 넣은 세로 타임라인
export default function RouteTimeline({ stops, onSelectStop }: RouteTimelineProps) {
  return (
    <ol className={styles.timeline}>
      {stops.map((stop, index) => {
        const place = getRoutePlace(stop.placeId);
        const name = place?.name ?? "Unknown place";
        const time = formatTime(stop);
        const isLast = index === stops.length - 1;
        // 이동 정보는 다음 장소가 있을 때만 (마지막 장소 뒤에는 표시하지 않음)
        const transport = isLast ? undefined : stop.transportToNext;

        return (
          <Fragment key={stop.id}>
            <li className={styles.stopRow}>
              {/* 번호 마커 — 세로 선은 이동 정보 줄에만 그려서 마지막 장소 뒤에 선이 남지 않는다 */}
              <span className={styles.stopNumber}>{index + 1}</span>

              {/* 카드 안에 More 버튼이 있어 button 중첩을 피하려고 div + role="button" 사용 */}
              <div
                role="button"
                tabIndex={0}
                className={styles.stopCard}
                onClick={() => onSelectStop?.(stop)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectStop?.(stop);
                  }
                }}
              >
                <div className={styles.stopBody}>
                  <p className={styles.stopName}>{name}</p>
                  {place?.localName && <p className={styles.stopLocal}>{place.localName}</p>}
                  <p className={`${styles.stopTime} ${time ? "" : styles.stopTimeUnset}`}>
                    <ClockIcon size={13} />
                    {time ?? "Time not set"}
                  </p>
                </div>
                <PlaceImage src={place?.imageUrl} alt={name} sizes="56px" className={styles.stopImage} />
                {/* 편집/삭제 메뉴는 다음 단계 (현재 UI only) — 카드 클릭으로 전파되지 않게 막는다 */}
                <button
                  type="button"
                  className={styles.stopMore}
                  aria-label={`${name} options`}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <MoreVerticalIcon size={18} />
                </button>
              </div>
            </li>
            {transport && <TransportRow transport={transport} />}
          </Fragment>
        );
      })}
    </ol>
  );
}
