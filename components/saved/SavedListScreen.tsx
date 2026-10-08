"use client";

import { useEffect } from "react";
import type { SavedFilterId, SavedPlace } from "@/types/saved";
import { SAVED_FILTERS, filterSavedPlaces, getSavedPlaces, getSavedRegion } from "@/lib/mockSaved";
import { ArrowLeftIcon, MoreVerticalIcon, SearchIcon } from "@/components/common/Icons";
import BottomNav, { type NavKey } from "@/components/common/BottomNav";
import SavedPlaceCard from "./SavedPlaceCard";
import styles from "./Saved.module.css";

interface SavedListScreenProps {
  regionId: string;
  // 검색어·필터·스크롤 위치는 부모(page.tsx)가 기억한다 → Detail에서 돌아와도 유지됨
  query: string;
  onQueryChange: (query: string) => void;
  filter: SavedFilterId;
  onFilterChange: (filter: SavedFilterId) => void;
  initialScrollY: number;
  onBack: () => void;
  onSelectPlace: (saved: SavedPlace) => void;
  onNavigate?: (key: NavKey) => void;
}

export default function SavedListScreen({
  regionId,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  initialScrollY,
  onBack,
  onSelectPlace,
  onNavigate,
}: SavedListScreenProps) {
  // 처음 진입 시 맨 위, Detail에서 돌아왔을 때는 이전 스크롤 위치로 이동
  useEffect(() => {
    window.scrollTo(0, initialScrollY);
    // 화면이 처음 그려질 때 한 번만 실행한다.
  }, []);

  const region = getSavedRegion(regionId);
  const allPlaces = region ? getSavedPlaces(region) : [];
  const places = filterSavedPlaces(allPlaces, filter, query);

  return (
    <div className={styles.screen}>
      <header className={styles.topBar}>
        <button type="button" className={styles.topBarButton} onClick={onBack} aria-label="Back to Saved">
          <ArrowLeftIcon size={22} />
        </button>
        <span className={styles.topBarTitle}>Saved</span>
        {/* 더보기 메뉴는 다음 단계 (현재 UI only) */}
        <button type="button" className={styles.topBarButton} aria-label="More options">
          <MoreVerticalIcon size={22} />
        </button>
      </header>

      <main className={styles.body}>
        <p className={styles.eyebrow}>NABI TRAVEL</p>
        <h1 className={styles.listTitle}>
          {region?.name ?? "Saved"}
          <span className={styles.listCount}>
            <span className={styles.listDot}>•</span>
            {allPlaces.length} Places
          </span>
        </h1>

        <label className={styles.search}>
          <SearchIcon size={18} className={styles.searchIcon} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="저장한 장소 검색하기"
            className={styles.searchInput}
          />
        </label>

        <div className={styles.filters}>
          {SAVED_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.filter} ${item.id === filter ? styles.filterActive : ""}`}
              aria-pressed={item.id === filter}
              onClick={() => onFilterChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {places.length > 0 ? (
          <div className={styles.placeList}>
            {places.map((saved) => (
              <SavedPlaceCard key={saved.place.id} saved={saved} onSelect={() => onSelectPlace(saved)} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <SearchIcon size={26} />
            </span>
            <p className={styles.emptyTitle}>No saved places found</p>
            <p className={styles.emptyText}>다른 검색어나 카테고리를 선택해 보세요.</p>
          </div>
        )}
      </main>

      <BottomNav active="saved" onNavigate={onNavigate} />
    </div>
  );
}
