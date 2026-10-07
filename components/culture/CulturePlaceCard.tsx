import { HeartIcon, PinIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import type { CulturePlace } from "@/types/culture";
import styles from "./Culture.module.css";

interface CulturePlaceCardProps {
  place: CulturePlace;
  index: number; // 0부터 시작 → 화면에는 01, 02 ... 로 표시
  onSelect: () => void; // 카드 클릭 → Place Detail
}

export default function CulturePlaceCard({ place, index, onSelect }: CulturePlaceCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className={`${styles.card} ${styles.cardClickable}`} onClick={onSelect}>
      <div className={styles.cardImageWrap}>
        <PlaceImage src={place.imageUrl} alt={place.name} sizes="400px" className={styles.cardImage} />
        <span className={styles.cardIndex}>{number}</span>
        {/* 저장 기능은 다음 단계 (현재 UI only) — 카드 클릭(Detail 이동)으로 전달되지 않도록 막는다 */}
        <button
          type="button"
          className={styles.cardHeart}
          aria-label={`Save ${place.name}`}
          onClick={(event) => event.stopPropagation()}
        >
          <HeartIcon size={19} />
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <h3 className={styles.cardName}>
            <span className={styles.cardLocal}>{place.localName}</span>
            <span className={styles.cardEn}>{place.name}</span>
          </h3>
          {place.distanceKm !== undefined && (
            <span className={styles.cardDistance}>
              <PinIcon size={13} />
              {place.distanceKm} km
            </span>
          )}
        </div>
        <p className={styles.cardDesc}>{place.description}</p>
      </div>
    </article>
  );
}
