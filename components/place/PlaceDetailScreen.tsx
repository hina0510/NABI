"use client";

import { useEffect } from "react";
import type { CulturePlace } from "@/types/culture";
import { getCulturePlaceDetail, getCultureTopicLabel, getNearbyCulturePlaces } from "@/lib/mockCulture";
import { ChevronRightIcon, HeartIcon, MapPinIcon, RouteIcon, StarIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import BottomNav from "@/components/common/BottomNav";
import PlaceHero from "./PlaceHero";
import PlaceAbout from "./PlaceAbout";
import PlaceTravelInfo from "./PlaceTravelInfo";
import PlaceHistoryStory from "./PlaceHistoryStory";
import PlaceNearby from "./PlaceNearby";
import styles from "./PlaceDetail.module.css";

interface PlaceDetailScreenProps {
  place: CulturePlace;
  onBack: () => void;
}

export default function PlaceDetailScreen({ place, onBack }: PlaceDetailScreenProps) {
  // Culture에서 스크롤한 위치가 남지 않도록 화면 진입 시 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Detail 데이터가 아직 없는 장소는 undefined → 기본 정보(이름/설명)만 표시
  const detail = getCulturePlaceDetail(place.id);
  const nearby = detail ? getNearbyCulturePlaces(detail) : [];
  const intro = detail?.intro ?? place.description;

  return (
    <div className={styles.screen}>
      <PlaceHero
        name={place.name}
        imageUrl={place.imageUrl}
        photoCount={detail?.photos.length ?? 0}
        onBack={onBack}
      />

      <main>
        {/* ===== Place Identity ===== */}
        <div className={styles.identity}>
          <div className={styles.chips}>
            <span className={`${styles.chip} ${styles.chipPrimary}`}>Culture</span>
            <span className={styles.chip}>{getCultureTopicLabel(place.topic)}</span>
          </div>
          <h1 className={styles.title}>{place.name}</h1>
          {place.localName && <p className={styles.localName}>{place.localName}</p>}

          {detail && (
            <div className={styles.meta}>
              <StarIcon size={15} className={styles.star} />
              <span className={styles.rating}>{detail.rating.toFixed(1)}</span>
              <span>({detail.reviewCount})</span>
              <span className={styles.metaDot}>·</span>
              <span>
                {detail.city} · {detail.district}
              </span>
            </div>
          )}

          {intro && <p className={styles.intro}>{intro}</p>}
        </div>

        {/* ===== Quick Actions (현재 UI only) ===== */}
        <div className={styles.actions}>
          <button type="button" className={styles.action}>
            <HeartIcon size={18} className={styles.actionIcon} />
            Save
          </button>
          <button type="button" className={styles.action}>
            <MapPinIcon size={18} className={styles.actionIcon} />
            Map
          </button>
          <button type="button" className={styles.action}>
            <RouteIcon size={18} className={styles.actionIcon} />
            Route
          </button>
        </div>

        {detail && (
          <>
            <PlaceAbout paragraphs={detail.about} />

            {/* ===== Photos (가로 스크롤, 갤러리 기능 없음) ===== */}
            {detail.photos.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Photos</h2>
                  {/* See all은 다음 단계 (현재 UI only) */}
                  <button type="button" className={styles.linkButton}>
                    See all
                    <ChevronRightIcon size={14} />
                  </button>
                </div>
                <div className={styles.photos}>
                  {detail.photos.map((photo) => (
                    <PlaceImage
                      key={photo.id}
                      src={photo.imageUrl}
                      alt={photo.alt}
                      sizes="112px"
                      className={styles.photo}
                    />
                  ))}
                </div>
              </section>
            )}

            <PlaceTravelInfo info={detail.travelInfo} />

            {detail.historyStory && <PlaceHistoryStory story={detail.historyStory} />}

            {nearby.length > 0 && <PlaceNearby places={nearby} />}
          </>
        )}
      </main>

      <BottomNav active="explore" />
    </div>
  );
}
