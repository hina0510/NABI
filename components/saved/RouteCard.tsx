import type { Route } from "@/types/route";
import { formatRouteDates } from "@/lib/mockRoutes";
import { getSavedRegion } from "@/lib/mockSaved";
import { CalendarIcon, ChevronRightIcon, ClockIcon, MapPinIcon, MoreVerticalIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import styles from "./Route.module.css";

interface RouteCardProps {
  route: Route;
  selected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ route, selected, onSelect }: RouteCardProps) {
  // 대표 이미지: Route 이미지 → 지역 이미지 → placeholder
  const imageUrl = route.imageUrl ?? getSavedRegion(route.regionId)?.imageUrl;

  return (
    // 카드 안에 More 버튼이 있어 button 중첩을 피하려고 div + role="button" 사용
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      className={`${styles.card} ${selected ? styles.cardSelected : ""}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <PlaceImage src={imageUrl} alt={route.title} sizes="96px" className={styles.cardImage} />

      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{route.title}</p>
        <p className={`${styles.cardDate} ${route.startDate ? "" : styles.cardDateUnset}`}>
          <CalendarIcon size={14} className={styles.cardDateIcon} />
          {formatRouteDates(route)}
        </p>
        <div className={styles.cardMeta}>
          <span className={styles.metaChip}>
            <MapPinIcon size={12} />
            {route.placeCount} places
          </span>
          <span className={styles.metaChip}>
            <ClockIcon size={12} />
            {route.days} {route.days === 1 ? "Day" : "Days"}
          </span>
        </div>
      </div>

      {/* 편집/삭제 메뉴는 다음 단계 (현재 UI only) — 카드 클릭으로 전파되지 않게 막는다 */}
      <button
        type="button"
        className={styles.moreButton}
        aria-label={`${route.title} options`}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreVerticalIcon size={18} className={styles.moreIcon} />
      </button>
      <ChevronRightIcon size={14} className={styles.cardArrow} />
    </div>
  );
}
