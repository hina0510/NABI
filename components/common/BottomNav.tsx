import { CompassIcon, HeartIcon, HomeIcon, UserIcon } from "@/components/common/Icons";
import styles from "./BottomNav.module.css";

export type NavKey = "home" | "explore" | "saved" | "my";

interface BottomNavProps {
  active: NavKey;
  // 메뉴를 눌렀을 때 부모(page.tsx)에 알린다. 연결되지 않은 메뉴는 부모에서 무시한다.
  onNavigate?: (key: NavKey) => void;
}

const ITEMS: { key: NavKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "explore", label: "Explore", Icon: CompassIcon },
  { key: "saved", label: "Saved", Icon: HeartIcon },
  { key: "my", label: "My", Icon: UserIcon },
];

// 현재는 Home / Explore / Saved 연결 (My 페이지 연결은 다음 단계)
export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      {ITEMS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`${styles.item} ${key === active ? styles.active : ""}`}
          aria-current={key === active ? "page" : undefined}
          onClick={() => onNavigate?.(key)}
        >
          {/* Saved 하트: 선택 안 됨 = 테두리, 선택됨 = 채움 */}
          <Icon size={24} className={key === "saved" && key === active ? styles.filled : undefined} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
