"use client";

import { useState } from "react";
import EntryScreen from "@/components/home/EntryScreen";
import HomeScreen from "@/components/home/HomeScreen";
import CultureScreen from "@/components/culture/CultureScreen";
import DestinationSelect from "@/components/destination/DestinationSelect";
import PlaceDetailScreen from "@/components/place/PlaceDetailScreen";
import { DEFAULT_DESTINATION } from "@/lib/mockDestinations";
import type { Destination } from "@/types/destination";
import type { CultureCategoryId, CulturePlace } from "@/types/culture";

type View = "entry" | "destination" | "home" | "culture" | "place-detail";

export default function HomePage() {
  const [view, setView] = useState<View>("entry");
  const [destination, setDestination] = useState<Destination>(DEFAULT_DESTINATION);
  // Destination 화면을 연 곳(Entry 또는 Home)으로 되돌아가기 위해 기억
  const [returnView, setReturnView] = useState<View>("entry");
  // Culture에서 선택한 탭 — Detail에서 돌아왔을 때 같은 탭을 보여주기 위해 여기서 관리
  const [cultureCategory, setCultureCategory] = useState<CultureCategoryId>("all");
  // Detail 화면에 보여줄 장소 (없으면 null)
  const [selectedPlace, setSelectedPlace] = useState<CulturePlace | null>(null);

  function openDestination(from: View) {
    setReturnView(from);
    setView("destination");
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

  if (view === "place-detail" && selectedPlace) {
    return <PlaceDetailScreen place={selectedPlace} onBack={() => setView("culture")} />;
  }

  // selectedPlace가 없는 상태로 place-detail이 되는 경우도 Culture로 처리한다.
  if (view === "culture" || view === "place-detail") {
    return (
      <CultureScreen
        destination={destination}
        onBack={() => setView("home")}
        category={cultureCategory}
        onCategoryChange={setCultureCategory}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          setView("place-detail");
        }}
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
