"use client";

import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon, MoreVerticalIcon } from "@/components/common/Icons";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import PlaceImage from "@/components/common/PlaceImage";
import savedStyles from "@/components/saved/Saved.module.css";
import { getExploreThemePage } from "@/lib/exploreThemes";
import type { ThemeId } from "@/types/home";
import styles from "./ExploreTheme.module.css";

interface ExploreThemeScreenProps {
  provinceId: string; // 대한민국 지도에서 선택한 시·도
  cityId: string; // 시·도 지도에서 선택한 하위 행정구역
  onBack: () => void;
  // 상세 화면이 있는 테마만 처리하고 true를 돌려준다. (false면 준비 중 안내)
  onSelectTheme: (id: ThemeId) => boolean;
  onNavigate?: (key: NavKey) => void;
}

// 지역별 테마 선택 화면 (모든 지역 공통) — Culture / Nature / Food / Shopping
export default function ExploreThemeScreen({ provinceId, cityId, onBack, onSelectTheme, onNavigate }: ExploreThemeScreenProps) {
  const page = getExploreThemePage(provinceId, cityId);
  // 상세 화면이 없는 테마 안내
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 안내 문구는 잠시 보여준 뒤 자동으로 숨긴다.
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <div className={styles.screen}>
      {/* 상단 바는 시·도 지도 화면과 같은 스타일을 재사용 */}
      <header className={savedStyles.topBar}>
        <button type="button" className={savedStyles.topBarButton} onClick={onBack} aria-label="Back to map">
          <ArrowLeftIcon size={22} />
        </button>
        <span className={savedStyles.topBarTitle}>Explore</span>
        {/* 더보기 메뉴는 다음 단계 (현재 UI only) */}
        <button type="button" className={savedStyles.topBarButton} aria-label="More options">
          <MoreVerticalIcon size={22} />
        </button>
      </header>

      <main>
        <div className={styles.intro}>
          <h1 className={styles.title}>{page.title}</h1>
          {page.subtitle && <p className={styles.subtitle}>{page.subtitle}</p>}
        </div>

        <div className={styles.grid}>
          {page.cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={styles.card}
              onClick={() => {
                if (!onSelectTheme(card.id)) setNotice(`${card.name} 테마는 준비 중이에요.`);
              }}
            >
              <PlaceImage src={card.imageUrl} alt="" className={styles.cardImage} sizes="(max-width: 430px) 50vw, 200px" />
              <span className={styles.cardShade} aria-hidden />
              <span className={styles.cardNumber}>{card.number}</span>
              <span className={styles.cardArrow} aria-hidden>
                <ArrowUpRightIcon size={16} />
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardTitle}>{card.name}</span>
                {card.description && <span className={styles.cardDesc}>{card.description}</span>}
              </span>
            </button>
          ))}
        </div>
      </main>

      {notice && (
        <div className={styles.toast} role="status">
          {notice}
        </div>
      )}

      <BottomNav active="explore" onNavigate={onNavigate} />
    </div>
  );
}
