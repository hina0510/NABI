import { CULTURE_CATEGORIES } from "@/lib/mockCulture";
import type { CultureCategoryId } from "@/types/culture";
import styles from "./Culture.module.css";

interface CultureTabsProps {
  active: CultureCategoryId;
  onChange: (id: CultureCategoryId) => void;
}

export default function CultureTabs({ active, onChange }: CultureTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Culture categories">
      {CULTURE_CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={category.id === active}
          className={`${styles.tab} ${category.id === active ? styles.tabActive : ""}`}
          onClick={() => onChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
