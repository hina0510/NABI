import PlaceImage from "@/components/common/PlaceImage";
import type { CultureSection } from "@/types/culture";
import styles from "./Culture.module.css";

interface CultureHeroProps {
  section: CultureSection;
}

export default function CultureHero({ section }: CultureHeroProps) {
  return (
    <section className={styles.hero}>
      <PlaceImage src={section.heroImageUrl} alt={section.eyebrow} sizes="430px" className={styles.heroImage} />
      <div className={styles.heroText}>
        <span className={styles.heroEyebrow}>{section.eyebrow}</span>
        <h1 className={styles.heroTitle}>{section.title}</h1>
        <p className={styles.heroSub}>{section.subtitle}</p>
      </div>
    </section>
  );
}
