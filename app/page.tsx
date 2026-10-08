"use client";

import { useState } from "react";
import EntryScreen from "@/components/home/EntryScreen";
import HomeScreen from "@/components/home/HomeScreen";
import CultureScreen from "@/components/culture/CultureScreen";
import DestinationSelect from "@/components/destination/DestinationSelect";
import PlaceDetailScreen from "@/components/place/PlaceDetailScreen";
import SavedMainScreen, { type SavedTab } from "@/components/saved/SavedMainScreen";
import SavedListScreen from "@/components/saved/SavedListScreen";
import RouteDetailScreen from "@/components/route/RouteDetailScreen";
import ExploreCountryScreen from "@/components/explore/ExploreCountryScreen";
import ExploreCityScreen from "@/components/explore/ExploreCityScreen";
import type { NavKey } from "@/components/common/BottomNav";
import { DEFAULT_PROVINCE_ID, getDefaultSubAreaId, hasDetailMap } from "@/lib/exploreRegions";
import { DEFAULT_DESTINATION } from "@/lib/mockDestinations";
import { getSavedDetailLabels } from "@/lib/mockSaved";
import { getRoute } from "@/lib/mockRoutes";
import type { Destination } from "@/types/destination";
import type { CultureCategoryId } from "@/types/culture";
import type { SavedFilterId, SavedPlace } from "@/types/saved";
import type { RouteFilter } from "@/types/route";

type View =
  | "entry"
  | "destination"
  | "home"
  | "culture"
  | "place-detail"
  | "saved"
  | "saved-list"
  | "route-detail"
  | "explore-country"
  | "explore-city";

// Detail 화면에 보여줄 장소 + Detail을 연 곳 (Back을 누르면 그 화면으로 돌아간다)
type DetailState =
  | { from: "culture"; place: SavedPlace["place"] }
  | { from: "saved"; place: SavedPlace["place"]; labels?: string[] };

export default function HomePage() {
  const [view, setView] = useState<View>("entry");
  const [destination, setDestination] = useState<Destination>(DEFAULT_DESTINATION);
  // Destination 화면을 연 곳(Entry 또는 Home)으로 되돌아가기 위해 기억
  const [returnView, setReturnView] = useState<View>("entry");
  // Culture에서 선택한 탭 — Detail에서 돌아왔을 때 같은 탭을 보여주기 위해 여기서 관리
  const [cultureCategory, setCultureCategory] = useState<CultureCategoryId>("all");
  // Detail 화면에 보여줄 장소 (없으면 null)
  const [detail, setDetail] = useState<DetailState | null>(null);

  // Saved — 선택한 지역 / 검색어 / 필터 / 스크롤 위치 (Detail에서 돌아와도 유지)
  const [savedRegionId, setSavedRegionId] = useState("seoul");
  const [savedQuery, setSavedQuery] = useState("");
  const [savedFilter, setSavedFilter] = useState<SavedFilterId>("all");
  const [savedScrollY, setSavedScrollY] = useState(0);
  // Saved Main — Saved / Route 탭, Route 필터, 스크롤 위치 (Route Detail에서 돌아와도 유지)
  const [savedTab, setSavedTab] = useState<SavedTab>("saved");
  const [routeFilter, setRouteFilter] = useState<RouteFilter>("all");
  const [savedMainScrollY, setSavedMainScrollY] = useState(0);
  // Route Detail에 보여줄 Route
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(undefined);
  // Explore — 지도에서 선택한 시·도 / 시·군·구 (상세 지도에서 돌아와도 유지)
  const [exploreProvinceId, setExploreProvinceId] = useState(DEFAULT_PROVINCE_ID);
  // 하위 행정구역 선택은 시·도별로 따로 기억한다. (서울에서 고른 구가 부산 지도에 적용되지 않도록)
  // 기록이 없는 시·도는 SVG의 첫 번째 지역(경기도는 수원시)을 기본 선택으로 사용
  const [exploreCityIds, setExploreCityIds] = useState<Record<string, string>>({});
  const exploreCityId = exploreCityIds[exploreProvinceId] ?? getDefaultSubAreaId(exploreProvinceId);

  function openDestination(from: View) {
    setReturnView(from);
    setView("destination");
  }

  // BottomNav — 현재는 Home / Explore / Saved 연결 (My는 다음 단계)
  function handleNavigate(key: NavKey) {
    if (key === "home") setView("home");
    if (key === "explore") {
      // 메뉴로 새로 들어올 때는 대한민국 지도 + 기본 선택(경기도 / 수원시)부터 시작
      setExploreProvinceId(DEFAULT_PROVINCE_ID);
      setExploreCityIds({});
      setView("explore-country");
    }
    if (key === "saved") {
      // 메뉴로 새로 들어올 때는 Saved 탭 맨 위부터 시작
      setSavedTab("saved");
      setRouteFilter("all");
      setSavedMainScrollY(0);
      setView("saved");
    }
  }

  if (view === "destination") {
    return (
      <DestinationSelect
        initialDestination={destination}
        onBack={() => setView(returnView)}
        onConfirm={(selected) => {
          setDestination(selected);
          setView(returnView);
        }}
      />
    );
  }

  if (view === "explore-country") {
    return (
      <ExploreCountryScreen
        selectedId={exploreProvinceId}
        onSelect={setExploreProvinceId}
        onExplore={(provinceId) => {
          // 선택한 시·도의 상세 지도로 이동 (16개 시·도 공통 화면)
          if (hasDetailMap(provinceId)) setView("explore-city");
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "explore-city") {
    return (
      <ExploreCityScreen
        provinceId={exploreProvinceId}
        selectedId={exploreCityId}
        onSelect={(cityId) => setExploreCityIds((prev) => ({ ...prev, [exploreProvinceId]: cityId }))}
        onBack={() => setView("explore-country")}
        onExplore={(cityId) => {
          // TODO: 지역별 테마 선택 화면(Culture / Nature / Food / Shopping) 구현 후 연결
          // 예: setExploreCityId(cityId); setView("explore-theme");
          void cityId;
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "place-detail" && detail) {
    return (
      <PlaceDetailScreen
        place={detail.place}
        labels={detail.from === "saved" ? detail.labels : undefined}
        activeNav={detail.from === "saved" ? "saved" : "explore"}
        onBack={() => setView(detail.from === "saved" ? "saved-list" : "culture")}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "saved") {
    return (
      <SavedMainScreen
        selectedRegionId={savedRegionId}
        onSelectRegion={(regionId) => {
          // 지역 카드에서 새로 들어올 때는 검색/필터/스크롤을 초기화
          setSavedRegionId(regionId);
          setSavedQuery("");
          setSavedFilter("all");
          setSavedScrollY(0);
          setSavedMainScrollY(0);
          setView("saved-list");
        }}
        tab={savedTab}
        onTabChange={setSavedTab}
        routeFilter={routeFilter}
        onRouteFilterChange={setRouteFilter}
        initialScrollY={savedMainScrollY}
        selectedRouteId={selectedRouteId}
        onSelectRoute={(route) => {
          setSavedMainScrollY(window.scrollY);
          setSelectedRouteId(route.id);
          setView("route-detail");
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "route-detail") {
    return (
      <RouteDetailScreen
        // Route가 바뀌면 Day 선택을 Day 1로 초기화하기 위해 key 사용
        key={selectedRouteId}
        route={getRoute(selectedRouteId)}
        onBack={() => setView("saved")}
      />
    );
  }

  if (view === "saved-list") {
    return (
      <SavedListScreen
        regionId={savedRegionId}
        query={savedQuery}
        onQueryChange={setSavedQuery}
        filter={savedFilter}
        onFilterChange={setSavedFilter}
        initialScrollY={savedScrollY}
        onBack={() => setView("saved")}
        onSelectPlace={(saved) => {
          setSavedScrollY(window.scrollY);
          setDetail({ from: "saved", place: saved.place, labels: getSavedDetailLabels(saved) });
          setView("place-detail");
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  // detail이 없는 상태로 place-detail이 되는 경우도 Culture로 처리한다.
  if (view === "culture" || view === "place-detail") {
    return (
      <CultureScreen
        destination={destination}
        onBack={() => setView("home")}
        category={cultureCategory}
        onCategoryChange={setCultureCategory}
        onSelectPlace={(place) => {
          setDetail({ from: "culture", place });
          setView("place-detail");
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "home") {
    return (
      <HomeScreen
        destination={destination}
        onChangeDestination={() => openDestination("home")}
        onSelectTheme={(id) => {
          // 현재는 Culture만 연결 (Nature / Food / Shopping은 UI only)
          // Home에서 새로 들어올 때는 항상 All 탭부터 시작
          if (id === "culture") {
            setCultureCategory("all");
            setView("culture");
          }
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <EntryScreen
      destination={destination}
      onOpenDestination={() => openDestination("entry")}
      onStart={() => setView("home")}
    />
  );
}
