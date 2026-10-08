"use client";

import { useEffect } from "react";
import { ArrowLeftIcon, MoreVerticalIcon } from "@/components/common/Icons";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import savedStyles from "@/components/saved/Saved.module.css";
import { GYEONGGI_CITIES_MAP } from "@/lib/maps/gyeonggiCities";
import { GYEONGGI_CITIES, findArea } from "@/lib/exploreRegions";
import RegionMap from "./RegionMap";
import SelectionCard from "./SelectionCard";
import styles from "./Explore.module.css";

interface ExploreCityScreenProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onExplore: (cityId: string) => void;
  onNavigate?: (key: NavKey) => void;
}

// 경기도 시·군 선택 (현재 상세 지도가 준비된 시·도는 경기도뿐)
export default function ExploreCityScreen({ selectedId, onSelect, onBack, onExplore, onNavigate }: ExploreCityScreenProps) {
  const city = findArea(GYEONGGI_CITIES, selectedId);

  // 이전 화면의 스크롤 위치가 남지 않도록 맨 위에서 시작
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.screen}>
      {/* 상단 바는 Saved 목록 화면과 같은 스타일을 재사용 */}
      <header className={savedStyles.topBar}>
        <button type="button" className={savedStyles.topBarButton} onClick={onBack} aria-label="Back to Explore">
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
          <h1 className={styles.title}>Discover Gyeonggi-do</h1>
          <p className={styles.subtitle}>Choose a city or county to explore.</p>
        </div>

        <RegionMap
          map={GYEONGGI_CITIES_MAP}
          selectedId={city.id}
          onSelect={onSelect}
          getRegionName={(id) => findArea(GYEONGGI_CITIES, id).name}
          ariaLabel="Map of Gyeonggi-do"
        />

        <SelectionCard
          eyebrow="SELECTED CITY"
          title={city.name}
          description="Gyeonggi-do, South Korea."
          buttonLabel={`Explore ${city.shortName}`}
          onClick={() => onExplore(city.id)}
        />
      </main>

      <BottomNav active="explore" onNavigate={onNavigate} />
    </div>
  );
}
