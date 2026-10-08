"use client";

import { useState } from "react";
import EntryScreen from "@/components/home/EntryScreen";
import HomeScreen from "@/components/home/HomeScreen";
import CultureScreen from "@/components/culture/CultureScreen";
import DestinationSelect from "@/components/destination/DestinationSelect";
import PlaceDetailScreen from "@/components/place/PlaceDetailScreen";
import SavedMainScreen from "@/components/saved/SavedMainScreen";
import SavedListScreen from "@/components/saved/SavedListScreen";
import type { NavKey } from "@/components/common/BottomNav";
import { DEFAULT_DESTINATION } from "@/lib/mockDestinations";
import { getSavedDetailLabels } from "@/lib/mockSaved";
import type { Destination } from "@/types/destination";
import type { CultureCategoryId } from "@/types/culture";
import type { SavedFilterId, SavedPlace } from "@/types/saved";

type View = "entry" | "destination" | "home" | "culture" | "place-detail" | "saved" | "saved-list";

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

  function openDestination(from: View) {
    setReturnView(from);
    setView("destination");
  }

  // BottomNav — 현재는 Home / Saved만 연결 (Explore / My는 다음 단계)
  function handleNavigate(key: NavKey) {
    if (key === "home") setView("home");
    if (key === "saved") setView("saved");
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
          setView("saved-list");
        }}
        onNavigate={handleNavigate}
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
