"use client";

import { useEffect } from "react";
import type { Destination } from "@/types/destination";
import type { CultureCategoryId, CulturePlace } from "@/types/culture";
import { CULTURE_CONTENT, getCulturePlaces } from "@/lib/mockCulture";
import { ChevronDownIcon, ChevronLeftIcon, HeartIcon, LandmarkIcon } from "@/components/common/Icons";
import BottomNav from "@/components/common/BottomNav";
import CultureHero from "./CultureHero";
import CultureTabs from "./CultureTabs";
import CulturePlaceCard from "./CulturePlaceCard";
import CultureRouteCta from "./CultureRouteCta";
import styles from "./Culture.module.css";

interface CultureScreenProps {
  destination: Destination;
  onBack: () => void;
  // 선택한 탭은 부모(page.tsx)가 기억한다 → Detail에서 돌아와도 탭이 유지됨
  category: CultureCategoryId;
  onCategoryChange: (category: CultureCategoryId) => void;
  onSelectPlace: (place: CulturePlace) => void;
}

export default function CultureScreen({
  destination,
  onBack,
  category,
  onCategoryChange,
  onSelectPlace,
}: CultureScreenProps) {
  // Home에서 스크롤한 위치가 남지 않도록 화면 진입 시 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { country, city } = destination;
  const cityName = city.isAll ? country.name : city.name;
  const content = CULTURE_CONTENT[city.id]; // mock 콘텐츠가 없는 도시는 undefined

  const section = content?.sections[category];
  const places = content ? getCulturePlaces(content.places, category) : [];

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button type="button" className={styles.headerButton} onClick={onBack} aria-label="Back to Home">
          <ChevronLeftIcon size={24} />
        </button>
        <div className={styles.headerTitle}>
          <span className={styles.headerBadge}>
            <LandmarkIcon size={17} />
          </span>
          <span>Culture</span>
        </div>
        {/* 찜 기능은 다음 단계 (현재 UI only) */}
        <button type="button" className={styles.headerButton} aria-label="Saved culture places">
          <HeartIcon size={23} />
        </button>
      </header>

      {content && section ? (
        <main>
          <CultureHero section={section} />
          <CultureTabs active={category} onChange={onCategoryChange} />

          <div className={styles.results}>
            <div className={styles.resultsHead}>
              <h2 className={styles.resultsTitle}>
                {section.resultTitle}
                <span className={styles.resultsCount}>{section.placeCount} places</span>
              </h2>
              {/* 정렬 기능은 다음 단계 (현재 UI only) */}
              <button type="button" className={styles.sortButton}>
                추천순
                <ChevronDownIcon size={12} />
              </button>
            </div>

            <div className={styles.list}>
              {places.map((place, index) => (
                <CulturePlaceCard
                  key={place.id}
                  place={place}
                  index={index}
                  onSelect={() => onSelectPlace(place)}
                />
              ))}
            </div>

            <CultureRouteCta section={section} thumbnailUrl={places[0]?.imageUrl} />
          </div>
        </main>
      ) : (
        <main className={styles.empty}>
          <span className={styles.emptyIcon}>
            <LandmarkIcon size={30} />
          </span>
          <h1 className={styles.emptyTitle}>Culture in {cityName}</h1>
          <p className={styles.emptyText}>We&apos;re preparing culture places for this city.</p>
        </main>
      )}

      <BottomNav active="explore" />
    </div>
  );
}
