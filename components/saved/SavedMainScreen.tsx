"use client";

import { useEffect } from "react";
import Image from "next/image";
import { SAVED_REGIONS } from "@/lib/mockSaved";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeIcon,
  HeartIcon,
  MapIcon,
  PlusIcon,
  UserIcon,
} from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import type { Route, RouteFilter } from "@/types/route";
import homeStyles from "@/components/home/Home.module.css";
import RouteMain from "./RouteMain";
import styles from "./Saved.module.css";

interface SavedMainScreenProps {
  selectedRegionId: string; // Selected 배지를 표시할 지역
  onSelectRegion: (regionId: string) => void;
  // Saved / Route 탭, Route 필터, 스크롤 위치는 부모(page.tsx)가 기억한다 → Route Detail에서 돌아와도 유지됨
  tab: SavedTab;
  onTabChange: (tab: SavedTab) => void;
  routeFilter: RouteFilter;
  onRouteFilterChange: (filter: RouteFilter) => void;
  initialScrollY: number;
  selectedRouteId?: string; // 마지막으로 연 Route (선택 테두리 표시)
  onSelectRoute: (route: Route) => void;
  onNavigate?: (key: NavKey) => void;
}

export type SavedTab = "saved" | "route";

export default function SavedMainScreen({
  selectedRegionId,
  onSelectRegion,
  tab,
  onTabChange,
  routeFilter,
  onRouteFilterChange,
  initialScrollY,
  selectedRouteId,
  onSelectRoute,
  onNavigate,
}: SavedMainScreenProps) {
  // 처음 진입 시 맨 위, Route Detail에서 돌아왔을 때는 이전 스크롤 위치로 이동
  useEffect(() => {
    window.scrollTo(0, initialScrollY);
    // 화면이 처음 그려질 때 한 번만 실행한다.
  }, []);

  const selectedRegion = SAVED_REGIONS.find((region) => region.id === selectedRegionId) ?? SAVED_REGIONS[0];

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

      <main className={styles.body}>
        <p className={styles.eyebrow}>NABI TRAVEL</p>
        <h1 className={styles.pageTitle}>{tab === "saved" ? "Saved" : "Route"}</h1>

        <div className={styles.segment} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "saved"}
            className={`${styles.segmentItem} ${tab === "saved" ? styles.segmentActive : ""}`}
            onClick={() => onTabChange("saved")}
          >
            <HeartIcon size={17} className={styles.filledIcon} />
            Saved
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "route"}
            className={`${styles.segmentItem} ${tab === "route" ? styles.segmentActive : ""}`}
            onClick={() => onTabChange("route")}
          >
            <MapIcon size={17} />
            Route
          </button>
        </div>

        {tab === "saved" ? (
          <>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Saved by Destination</h2>
              <span className={styles.countBadge}>{SAVED_REGIONS.length} Regions</span>
            </div>

            <div className={styles.regionList}>
              {SAVED_REGIONS.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  className={styles.regionCard}
                  onClick={() => onSelectRegion(region.id)}
                >
                  <PlaceImage src={region.imageUrl} alt={region.name} sizes="430px" className={styles.regionImage} />
                  {region.id === selectedRegion.id && (
                    <span className={styles.selectedBadge}>
                      <CheckIcon size={13} />
                      Selected
                    </span>
                  )}
                  <span className={styles.regionOverlay}>
                    <span className={styles.regionText}>
                      <span className={styles.regionName}>{region.name}</span>
                      <span className={styles.regionCount}>{region.places.length} saved places</span>
                    </span>
                    <span className={styles.regionArrow}>
                      <ChevronRightIcon size={16} />
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Route 생성은 다음 단계 (현재 UI only) */}
            <button type="button" className={styles.planButton}>
              <PlusIcon size={18} />
              Plan a Trip with {selectedRegion.name} Places
            </button>
          </>
        ) : (
          <RouteMain
            selectedRouteId={selectedRouteId}
            onSelectRoute={onSelectRoute}
            filter={routeFilter}
            onFilterChange={onRouteFilterChange}
          />
        )}
      </main>

      <BottomNav active="saved" onNavigate={onNavigate} />
    </div>
  );
}
