"use client";

import { useState } from "react";
import EntryScreen from "@/components/home/EntryScreen";
import HomeScreen from "@/components/home/HomeScreen";
import CultureScreen from "@/components/culture/CultureScreen";
import DestinationSelect from "@/components/destination/DestinationSelect";
import { DEFAULT_DESTINATION } from "@/lib/mockDestinations";
import type { Destination } from "@/types/destination";

type View = "entry" | "destination" | "home" | "culture";

export default function HomePage() {
  const [view, setView] = useState<View>("entry");
  const [destination, setDestination] = useState<Destination>(DEFAULT_DESTINATION);
  // Destination 화면을 연 곳(Entry 또는 Home)으로 되돌아가기 위해 기억
  const [returnView, setReturnView] = useState<View>("entry");

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

  if (view === "culture") {
    return <CultureScreen destination={destination} onBack={() => setView("home")} />;
  }

  if (view === "home") {
    return (
      <HomeScreen
        destination={destination}
        onChangeDestination={() => openDestination("home")}
        onSelectTheme={(id) => {
          // 현재는 Culture만 연결 (Nature / Food / Shopping은 UI only)
          if (id === "culture") setView("culture");
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
