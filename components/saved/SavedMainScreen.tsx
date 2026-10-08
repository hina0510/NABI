"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SAVED_REGIONS } from "@/lib/mockSaved";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeIcon,
  HeartIcon,
  PlusIcon,
  RouteIcon,
  UserIcon,
} from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import homeStyles from "@/components/home/Home.module.css";
import styles from "./Saved.module.css";

interface SavedMainScreenProps {
  selectedRegionId: string; // Selected 배지를 표시할 지역
  onSelectRegion: (regionId: string) => void;
  onNavigate?: (key: NavKey) => void;
}

type SavedTab = "saved" | "route";

export default function SavedMainScreen({ selectedRegionId, onSelectRegion, onNavigate }: SavedMainScreenProps) {
  // Route 탭은 아직 준비 중 → 이 화면 안에서만 탭 상태를 관리한다.
  const [tab, setTab] = useState<SavedTab>("saved");

  useEffect(() => {
    window.scrollTo(0, 0);
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
        <h1 className={styles.pageTitle}>Saved</h1>

        <div className={styles.segment} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "saved"}
            className={`${styles.segmentItem} ${tab === "saved" ? styles.segmentActive : ""}`}
            onClick={() => setTab("saved")}
          >
            <HeartIcon size={17} className={styles.filledIcon} />
            Saved
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "route"}
            className={`${styles.segmentItem} ${tab === "route" ? styles.segmentActive : ""}`}
            onClick={() => setTab("route")}
          >
            <RouteIcon size={17} />
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
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <RouteIcon size={28} />
            </span>
            <p className={styles.emptyTitle}>Routes are coming soon</p>
            <p className={styles.emptyText}>저장한 장소로 여행 경로를 만드는 기능을 준비하고 있어요.</p>
          </div>
        )}
      </main>

      <BottomNav active="saved" onNavigate={onNavigate} />
    </div>
  );
}
