import { ButterflyIcon, ChevronDownIcon, PinIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import styles from "./Home.module.css";

interface HomeHeroProps {
  cityName: string;
  localCityName: string;
  locationLabel: string;
  heroImageUrl?: string;
  onChangeDestination: () => void;
}

export default function HomeHero({
  cityName,
  localCityName,
  locationLabel,
  heroImageUrl,
  onChangeDestination,
}: HomeHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroTop}>
        <h1 className={styles.greeting}>Hello, {cityName}!</h1>
        <p className={styles.heroSub}>{localCityName}에서 어디로 떠나볼까요?</p>
        <button type="button" className={styles.locationPill} onClick={onChangeDestination}>
          <PinIcon size={16} className={styles.locationPin} />
          <span>{locationLabel}</span>
          <ChevronDownIcon size={14} className={styles.locationChevron} />
        </button>

        <svg className={styles.heroPath} width="110" height="100" viewBox="0 0 110 100" aria-hidden>
          <path
            d="M4 96c22-2 44-6 50-18 5-11-6-19-2-32 4-12 22-12 34-24"
            fill="none"
            stroke="#5db5e6"
            strokeWidth="2"
            strokeDasharray="3 5"
            strokeLinecap="round"
          />
        </svg>
        <ButterflyIcon size={20} className={styles.heroButterfly} />
      </div>
      <PlaceImage src={heroImageUrl} alt={`${cityName} view`} sizes="430px" className={styles.heroImage} />
    </section>
  );
}
