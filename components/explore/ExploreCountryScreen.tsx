"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronDownIcon, GlobeIcon, UserIcon } from "@/components/common/Icons";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import homeStyles from "@/components/home/Home.module.css";
import { KOREA_PROVINCES_MAP } from "@/lib/maps/koreaProvinces";
import { PROVINCES, findArea, getProvinceTexts, hasDetailMap } from "@/lib/exploreRegions";
import RegionMap from "./RegionMap";
import SelectionCard from "./SelectionCard";
import styles from "./Explore.module.css";

interface ExploreCountryScreenProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onExplore: (provinceId: string) => void; // 선택한 시·도의 상세 지도로 이동
  onNavigate?: (key: NavKey) => void;
}

export default function ExploreCountryScreen({ selectedId, onSelect, onExplore, onNavigate }: ExploreCountryScreenProps) {
  const province = findArea(PROVINCES, selectedId);
  // 16개 시·도 모두 상세 지도가 있다. (지도 데이터가 없는 경우에만 버튼 비활성)
  const detailReady = hasDetailMap(province.id);

  // 다른 화면에서 스크롤한 위치가 남지 않도록 맨 위에서 시작
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.screen}>
      {/* Header는 Home과 같은 스타일을 재사용 */}
      <header className={homeStyles.header}>
        <Image src="/images/nabi_logo.png" alt="NABI" width={1338} height={646} sizes="76px" className={homeStyles.headerLogo} />
        <div className={homeStyles.headerActions}>
          <button type="button" className={homeStyles.langButton} aria-label="Language: English">
            <GlobeIcon size={15} className={homeStyles.langGlobe} />
            <span>EN</span>
            <ChevronDownIcon size={12} />
          </button>
          <button type="button" className={homeStyles.profileButton} aria-label="Profile">
            <UserIcon size={19} />
          </button>
        </div>
      </header>

      <main>
        <div className={styles.intro}>
          <h1 className={styles.title}>Where to next?</h1>
          <p className={styles.subtitle}>Choose a region to begin your journey.</p>
        </div>

        <RegionMap
          map={KOREA_PROVINCES_MAP}
          selectedId={province.id}
          onSelect={onSelect}
          getRegionName={(id) => findArea(PROVINCES, id).name}
          ariaLabel="Map of South Korea"
        />

        <SelectionCard
          eyebrow="SELECTED REGION"
          title={province.name}
          description={getProvinceTexts(province.id).countryDescription}
          buttonLabel={`Explore ${province.shortName}`}
          disabled={!detailReady}
          onClick={() => onExplore(province.id)}
        />
      </main>

      <BottomNav active="explore" onNavigate={onNavigate} />
    </div>
  );
}
