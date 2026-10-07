import type { HomePlace } from "@/types/home";
import { HeartIcon, PinIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import SectionHeader from "./SectionHeader";
import styles from "./Home.module.css";

interface NearbyPlacesProps {
  localCityName: string;
  places: HomePlace[];
}

// 거리는 mock 값 (GPS 미사용)
export default function NearbyPlaces({ localCityName, places }: NearbyPlacesProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Nearby Places" subtitle={`지금, 가까운 ${localCityName} 여행지`} />
      <div className={styles.scroller}>
        {places.map((place) => (
          <article key={place.id} className={`${styles.placeCard} ${styles.nearbyCard}`}>
            <PlaceImage src={place.imageUrl} alt={place.name} sizes="150px" className={styles.placeImage} />
            <div className={styles.placeBody}>
              <h3 className={styles.placeName}>{place.localName ?? place.name}</h3>
              <div className={styles.placeMeta}>
                {place.distanceKm !== undefined && (
                  <span className={styles.distance}>
                    <PinIcon size={12} className={styles.distancePin} />
                    {place.distanceKm.toFixed(1)} km
                  </span>
                )}
                <button type="button" className={styles.heart} aria-label="Save">
                  <HeartIcon size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
