import { ArrowRightIcon, SparkleIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import type { CultureSection } from "@/types/culture";
import styles from "./Culture.module.css";

interface CultureRouteCtaProps {
  section: CultureSection;
  thumbnailUrl?: string;
}

// Route 생성은 다음 단계 (Saved Collection → Route 연결 예정). 현재 UI only.
export default function CultureRouteCta({ section, thumbnailUrl }: CultureRouteCtaProps) {
  return (
    <button type="button" className={styles.route}>
      <PlaceImage src={thumbnailUrl} alt="" sizes="56px" className={styles.routeThumb} />
      <span className={styles.routeText}>
        <span className={styles.routeTitle}>
          {section.routeTitle}
          <SparkleIcon size={13} className={styles.routeSparkle} />
        </span>
        <span className={styles.routeDesc}>{section.routeText}</span>
      </span>
      <span className={styles.routeArrow}>
        <ArrowRightIcon size={17} />
      </span>
    </button>
  );
}
