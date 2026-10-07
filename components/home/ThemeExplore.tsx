import type { ThemeId } from "@/types/home";
import { THEMES } from "@/lib/mockHome";
import { BagIcon, LandmarkIcon, MountainIcon, UtensilsIcon } from "@/components/common/Icons";
import SectionHeader from "./SectionHeader";
import styles from "./Home.module.css";

const THEME_ICONS: Record<ThemeId, typeof LandmarkIcon> = {
  culture: LandmarkIcon,
  nature: MountainIcon,
  food: UtensilsIcon,
  shopping: BagIcon,
};

interface ThemeExploreProps {
  onSelectTheme?: (id: ThemeId) => void; // 목록 페이지 연결 시 사용 (현재는 미연결)
}

export default function ThemeExplore({ onSelectTheme }: ThemeExploreProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Explore by Theme" />
      <div className={styles.themes}>
        {THEMES.map((theme) => {
          const Icon = THEME_ICONS[theme.id];
          return (
            <button
              key={theme.id}
              type="button"
              className={styles.themeItem}
              onClick={() => onSelectTheme?.(theme.id)}
            >
              <span className={`${styles.themeIcon} ${styles[`theme_${theme.id}`]}`}>
                <Icon size={26} />
              </span>
              <span className={styles.themeName}>{theme.name}</span>
              <span className={styles.themeLocal}>{theme.localName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
