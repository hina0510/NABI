import { ChevronRightIcon } from "@/components/common/Icons";
import styles from "./Home.module.css";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

// Home 섹션 공통 제목 + See all (See all 연결은 다음 단계)
export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className={styles.sectionHead}>
      <div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
      </div>
      <button type="button" className={styles.seeAll}>
        See all
        <ChevronRightIcon size={13} />
      </button>
    </div>
  );
}
