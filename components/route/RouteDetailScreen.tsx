"use client";

import { useEffect, useState } from "react";
import type { Route } from "@/types/route";
import { formatRouteDates, getRouteDay, getRoutePlace, getTotalDistance } from "@/lib/mockRoutes";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ListEditIcon,
  MapPinPlusIcon,
  MoreVerticalIcon,
  OptimizeIcon,
  RouteIcon,
} from "@/components/common/Icons";
import savedStyles from "@/components/saved/Saved.module.css";
import RouteMap from "./RouteMap";
import RouteTimeline from "./RouteTimeline";
import styles from "./RouteDetail.module.css";

interface RouteDetailScreenProps {
  route?: Route; // 없는 Route id면 undefined
  onBack: () => void;
}

export default function RouteDetailScreen({ route, onBack }: RouteDetailScreenProps) {
  // 선택한 Day (기본 Day 1)
  const [selectedDay, setSelectedDay] = useState(1);
  // 준비 중 기능 안내 (Add Place / Optimize Route는 다음 단계)
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

  const topBar = (
    <header className={savedStyles.topBar}>
      <button type="button" className={savedStyles.topBarButton} onClick={onBack} aria-label="Back to Route">
        <ArrowLeftIcon size={22} />
      </button>
      <span className={savedStyles.topBarTitle}>Route</span>
      {/* 더보기 메뉴는 다음 단계 (현재 UI only) */}
      <button type="button" className={savedStyles.topBarButton} aria-label="More options">
        <MoreVerticalIcon size={22} />
      </button>
    </header>
  );

  if (!route) {
    return (
      <div className={styles.screen}>
        {topBar}
        <div className={savedStyles.empty}>
          <span className={savedStyles.emptyIcon}>
            <RouteIcon size={28} />
          </span>
          <p className={savedStyles.emptyTitle}>Route not found</p>
          <p className={savedStyles.emptyText}>삭제되었거나 존재하지 않는 경로예요.</p>
        </div>
      </div>
    );
  }

  // Day 탭은 route.days 개수만큼 만든다. (일정 데이터가 없어도 탭은 표시)
  const dayNumbers = Array.from({ length: Math.max(route.days, 1) }, (_, i) => i + 1);
  const day = getRouteDay(route, selectedDay);
  const stops = day?.stops ?? [];
  const mapStops = stops.map((stop) => ({ id: stop.id, name: getRoutePlace(stop.placeId)?.name ?? "Unknown place" }));

  return (
    <div className={styles.screen}>
      {topBar}

      <main className={styles.body}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{route.title}</h1>
          {/* 편집 / 더보기는 다음 단계 (현재 UI only) */}
          <button type="button" className={styles.iconButton} aria-label="Edit route">
            <ListEditIcon size={20} />
          </button>
          <button type="button" className={styles.iconButton} aria-label="Route options">
            <MoreVerticalIcon size={18} className={styles.moreHorizontal} />
          </button>
        </div>

        <p className={styles.meta}>
          <CalendarIcon size={15} className={styles.metaIcon} />
          <span className={route.startDate ? "" : styles.metaUnset}>{formatRouteDates(route)}</span>
          <span className={styles.metaDot}>•</span>
          <span className={styles.metaMuted}>
            {route.days} {route.days === 1 ? "Day" : "Days"}
          </span>
          <span className={styles.metaDot}>•</span>
          <span className={styles.metaPlaces}>{route.placeCount} places</span>
        </p>

        <RouteMap stops={mapStops} label={day?.label} areaName={day?.areaName} totalDistanceM={getTotalDistance(stops)} />

        <div className={styles.dayTabs} role="tablist" aria-label="Route days">
          {dayNumbers.map((dayNumber) => (
            <button
              key={dayNumber}
              type="button"
              role="tab"
              aria-selected={dayNumber === selectedDay}
              className={`${styles.dayTab} ${dayNumber === selectedDay ? styles.dayTabActive : ""}`}
              onClick={() => setSelectedDay(dayNumber)}
            >
              Day {dayNumber}
            </button>
          ))}
        </div>

        {stops.length > 0 ? (
          <RouteTimeline stops={stops} />
        ) : (
          <div className={styles.dayEmpty}>
            <p className={styles.dayEmptyTitle}>No places for Day {selectedDay}</p>
            <p className={styles.dayEmptyText}>저장한 장소를 추가해 이 날의 일정을 만들어 보세요.</p>
          </div>
        )}
      </main>

      {/* 하단 CTA — 현재 UI only */}
      <div className={styles.ctaBar}>
        <button type="button" className={styles.ctaSecondary} onClick={() => setNotice("장소 추가 기능은 준비 중이에요.")}>
          <MapPinPlusIcon size={19} />
          Add Place
        </button>
        <button type="button" className={styles.ctaPrimary} onClick={() => setNotice("경로 최적화 기능은 준비 중이에요.")}>
          <OptimizeIcon size={19} />
          Optimize Route
        </button>
      </div>

      {notice && (
        <div className={styles.toast} role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
