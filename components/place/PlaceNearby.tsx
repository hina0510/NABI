import { HeartIcon, MapPinIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import type { CulturePlace } from "@/types/culture";
import styles from "./PlaceDetail.module.css";

interface PlaceNearbyProps {
  places: { place: CulturePlace; distanceKm: number }[];
}

// 시안(design/detail.png) 기준 세로 리스트 카드. 거리는 mock 값 (GPS 미사용)
export default function PlaceNearby({ places }: PlaceNearbyProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Nearby Places</h2>
      </div>
      <div className={styles.nearbyList}>
        {places.map(({ place, distanceKm }) => (
          <article key={place.id} className={styles.nearbyCard}>
            <PlaceImage src={place.imageUrl} alt={place.name} sizes="64px" className={styles.nearbyImage} />
            <div className={styles.nearbyBody}>
              <h3 className={styles.nearbyName}>{place.localName ?? place.name}</h3>
              <span className={styles.nearbyDistance}>
                <MapPinIcon size={14} className={styles.nearbyPin} />
                {distanceKm.toFixed(1)} km
              </span>
            </div>
            {/* 저장 기능은 다음 단계 (현재 UI only) */}
            <button type="button" className={styles.nearbyHeart} aria-label={`Save ${place.name}`}>
              <HeartIcon size={21} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
