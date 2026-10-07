import { BookmarkIcon, CompassIcon, HomeIcon, UserIcon } from "@/components/common/Icons";
import styles from "./BottomNav.module.css";

type NavKey = "home" | "explore" | "saved" | "my";

interface BottomNavProps {
  active: NavKey;
}

const ITEMS: { key: NavKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "explore", label: "Explore", Icon: CompassIcon },
  { key: "saved", label: "Saved", Icon: BookmarkIcon },
  { key: "my", label: "My", Icon: UserIcon },
];

// 현재는 UI만 구현 (Explore / Saved / My 페이지 연결은 다음 단계)
export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      {ITEMS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`${styles.item} ${key === active ? styles.active : ""}`}
          aria-current={key === active ? "page" : undefined}
        >
          <Icon size={24} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
