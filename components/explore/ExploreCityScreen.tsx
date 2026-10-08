"use client";

import { useEffect, useState } from "react";
import { ArrowLeftIcon, MoreVerticalIcon } from "@/components/common/Icons";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import savedStyles from "@/components/saved/Saved.module.css";
import { PROVINCE_MAPS } from "@/lib/maps/provinceMaps";
import { PROVINCES, findArea, getProvinceTexts, getSubAreas } from "@/lib/exploreRegions";
import type { SvgMapData } from "@/types/explore";
import RegionMap from "./RegionMap";
import SelectionCard from "./SelectionCard";
import styles from "./Explore.module.css";

interface ExploreCityScreenProps {
  provinceId: string; // 대한민국 지도에서 선택한 시·도
  selectedId: string; // 이 시·도에서 선택한 하위 행정구역
  onSelect: (id: string) => void;
  onBack: () => void;
  onExplore: (cityId: string) => void;
  onNavigate?: (key: NavKey) => void;
}

// 한 번 불러온 상세 지도는 다시 들어올 때 바로 보여준다.
const loadedMaps = new Map<string, SvgMapData>();

// 시·도 상세 지도 (16개 시·도 공통) — 시·군·구 / 읍·면·동 선택
export default function ExploreCityScreen({ provinceId, selectedId, onSelect, onBack, onExplore, onNavigate }: ExploreCityScreenProps) {
  const province = findArea(PROVINCES, provinceId);
  const entry = PROVINCE_MAPS[province.id];
  const areas = getSubAreas(province.id);
  const area = findArea(areas, selectedId);
  const texts = getProvinceTexts(province.id);
  const [map, setMap] = useState<SvgMapData | null>(() => loadedMaps.get(province.id) ?? null);

  // 이전 화면의 스크롤 위치가 남지 않도록 맨 위에서 시작
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 지도 데이터(path 좌표)는 이 화면에서 필요한 시·도만 불러온다.
  useEffect(() => {
    const cached = loadedMaps.get(province.id);
    if (cached) {
      setMap(cached);
      return;
    }
    let cancelled = false;
    setMap(null);
    entry.load().then((data) => {
      loadedMaps.set(province.id, data);
      if (!cancelled) setMap(data);
    });
    return () => {
      cancelled = true;
    };
  }, [province.id, entry]);

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
          <h1 className={styles.title}>Discover {province.name}</h1>
          <p className={styles.subtitle}>{texts.subtitle}</p>
        </div>

        {map ? (
          <RegionMap
            // 시·도가 바뀌면 확대 상태를 새로 시작
            key={province.id}
            map={map}
            selectedId={area.id}
            onSelect={onSelect}
            getRegionName={(id) => findArea(areas, id).name}
            ariaLabel={`Map of ${province.name}`}
          />
        ) : (
          // 지도를 불러오는 동안 같은 크기의 빈 영역을 둬서 아래 카드가 움직이지 않게 한다. (+4 = RegionMap의 여백 PAD × 2)
          <div
            className={styles.mapArea}
            style={{ aspectRatio: `${entry.contentBox.width + 4} / ${entry.contentBox.height + 4}` }}
            aria-busy
          />
        )}

        <SelectionCard
          eyebrow={texts.eyebrow}
          title={area.name}
          description={`${province.name}, South Korea.`}
          buttonLabel={`Explore ${area.shortName}`}
          onClick={() => onExplore(area.id)}
        />
      </main>

      <BottomNav active="explore" onNavigate={onNavigate} />
    </div>
  );
}
