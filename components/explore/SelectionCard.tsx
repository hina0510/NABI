import { ArrowRightIcon, PinIcon } from "@/components/common/Icons";
import styles from "./Explore.module.css";

interface SelectionCardProps {
  eyebrow: string; // SELECTED REGION / SELECTED CITY
  title: string;
  description: string;
  buttonLabel: string;
  disabled?: boolean; // 아직 다음 단계가 준비되지 않은 지역
  onClick: () => void;
}

// 지도 아래 선택 지역 카드
export default function SelectionCard({ eyebrow, title, description, buttonLabel, disabled, onClick }: SelectionCardProps) {
  return (
    <section className={styles.card} aria-live="polite">
      <div className={styles.cardHead}>
        <div className={styles.cardText}>
          <p className={styles.cardEyebrow}>{eyebrow}</p>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardDesc}>{description}</p>
        </div>
        <span className={styles.cardPin}>
          <PinIcon size={18} />
        </span>
      </div>
      <button type="button" className={styles.cardButton} onClick={onClick} disabled={disabled}>
        <span>{buttonLabel}</span>
        {!disabled && <ArrowRightIcon size={18} />}
      </button>
    </section>
  );
}
