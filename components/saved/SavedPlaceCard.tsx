import type { SavedPlace } from "@/types/saved";
import { HeartIcon, MapPinIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import styles from "./Saved.module.css";

interface SavedPlaceCardProps {
  saved: SavedPlace;
  onSelect: () => void;
}

export default function SavedPlaceCard({ saved, onSelect }: SavedPlaceCardProps) {
  const { place, badge, category, distanceKm } = saved;

  return (
    <article className={styles.placeCard} onClick={onSelect}>
      <PlaceImage src={place.imageUrl} alt={place.name} sizes="80px" className={styles.placeImage} />

      <div className={styles.placeBody}>
        <h3 className={styles.placeName}>{place.name}</h3>
        {place.localName && <p className={styles.placeLocal}>{place.localName}</p>}
        <div className={styles.placeMeta}>
          <span className={`${styles.badge} ${category === "nature" ? styles.badgeSky : ""}`}>{badge}</span>
          <span className={styles.distance}>
            <MapPinIcon size={13} />
            {distanceKm} km
          </span>
        </div>
      </div>

      {/* 저장/삭제는 다음 단계 (현재 UI only). 카드 클릭(Detail 이동)이 같이 실행되지 않도록 막는다. */}
      <button
        type="button"
        className={styles.heartButton}
        aria-label={`Saved: ${place.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <HeartIcon size={24} className={styles.filledIcon} />
      </button>
    </article>
  );
}
