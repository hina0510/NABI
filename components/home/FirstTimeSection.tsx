import type { HomePlace } from "@/types/home";
import { HeartIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import SectionHeader from "./SectionHeader";
import styles from "./Home.module.css";

interface FirstTimeSectionProps {
  cityName: string;
  places: HomePlace[];
}

export default function FirstTimeSection({ cityName, places }: FirstTimeSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={`First Time in ${cityName}?`} subtitle="처음이라면 놓치지 말아야 할 곳" />
      <div className={styles.scroller}>
        {places.map((place) => (
          <article key={place.id} className={`${styles.placeCard} ${styles.firstCard}`}>
            <PlaceImage src={place.imageUrl} alt={place.name} sizes="200px" className={styles.placeImage} />
            <div className={styles.placeBody}>
              <div className={styles.placeRow}>
                <h3 className={styles.placeName}>{place.localName ?? place.name}</h3>
                <button type="button" className={styles.heart} aria-label="Save">
                  <HeartIcon size={17} />
                </button>
              </div>
              {place.description && <p className={styles.placeDesc}>{place.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
