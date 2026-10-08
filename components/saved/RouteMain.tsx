"use client";

import { useEffect, useState } from "react";
import type { Route, RouteFilter } from "@/types/route";
import { MOCK_ROUTES, ROUTE_FILTERS, filterRoutes } from "@/lib/mockRoutes";
import { PlusIcon, RouteIcon } from "@/components/common/Icons";
import RouteCard from "./RouteCard";
import savedStyles from "./Saved.module.css";
import styles from "./Route.module.css";

interface RouteMainProps {
  selectedRouteId?: string;
  onSelectRoute: (route: Route) => void;
  // 필터는 부모(page.tsx)가 기억한다 → Route Detail에서 돌아와도 유지됨
  filter: RouteFilter;
  onFilterChange: (filter: RouteFilter) => void;
}

// Saved Main의 Route 탭 내용 (필터 + Route 목록 + Create CTA)
export default function RouteMain({ selectedRouteId, onSelectRoute, filter, onFilterChange }: RouteMainProps) {
  // 준비 중 기능 안내 (Create는 다음 단계)
  const [notice, setNotice] = useState<string | null>(null);

  // 안내 문구는 잠시 보여준 뒤 자동으로 숨긴다.
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const routes = filterRoutes(MOCK_ROUTES, filter);

  return (
    <>
      <div className={styles.filters}>
        {ROUTE_FILTERS.map((item) => (
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

      {routes.length > 0 ? (
        <div className={styles.list}>
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              selected={route.id === selectedRouteId}
              onSelect={() => onSelectRoute(route)}
            />
          ))}
        </div>
      ) : (
        <div className={savedStyles.empty}>
          <span className={savedStyles.emptyIcon}>
            <RouteIcon size={28} />
          </span>
          <p className={savedStyles.emptyTitle}>No routes yet</p>
          <p className={savedStyles.emptyText}>이 필터에 해당하는 여행 경로가 없어요.</p>
        </div>
      )}

      {/* Route 생성은 다음 단계 (현재 UI only) */}
      <button type="button" className={styles.createCta} onClick={() => setNotice("Route 만들기 기능은 준비 중이에요.")}>
        <span className={styles.createIcon}>
          <PlusIcon size={24} />
        </span>
        <span className={styles.createTitle}>Create a Route</span>
        <span className={styles.createText}>Plan a new trip from your saved places</span>
      </button>

      {notice && (
        <div className={styles.toast} role="status">
          {notice}
        </div>
      )}
    </>
  );
}
