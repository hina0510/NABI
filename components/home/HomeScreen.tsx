import Image from "next/image";
import type { Destination } from "@/types/destination";
import type { ThemeId } from "@/types/home";
import { HOME_CONTENT } from "@/lib/mockHome";
import { ChevronDownIcon, GlobeIcon, UserIcon } from "@/components/common/Icons";
import BottomNav from "@/components/common/BottomNav";
import HomeHero from "./HomeHero";
import TodaysPick from "./TodaysPick";
import JustWander from "./JustWander";
import ThemeExplore from "./ThemeExplore";
import NearbyPlaces from "./NearbyPlaces";
import FirstTimeSection from "./FirstTimeSection";
import styles from "./Home.module.css";

interface HomeScreenProps {
  destination: Destination;
  onChangeDestination: () => void;
  onSelectTheme?: (id: ThemeId) => void;
}

export default function HomeScreen({ destination, onChangeDestination, onSelectTheme }: HomeScreenProps) {
  const { country, city } = destination;

  // 선택한 Destination에서 화면에 표시할 이름을 한 번만 계산해 하위 컴포넌트로 전달한다.
  const cityName = city.isAll ? country.name : city.name;
  const locationLabel = city.isAll ? country.name : `${city.name}, ${country.name}`;
  const content = HOME_CONTENT[city.id]; // mock 콘텐츠가 없는 도시는 undefined
  const localCityName = content?.localCityName ?? cityName;

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <Image src="/images/nabi_logo.png" alt="NABI" width={1338} height={646} sizes="76px" className={styles.headerLogo} />
        <div className={styles.headerActions}>
          <button type="button" className={styles.langButton} aria-label="Language: English">
            <GlobeIcon size={15} className={styles.langGlobe} />
            <span>EN</span>
            <ChevronDownIcon size={12} />
          </button>
          <button type="button" className={styles.profileButton} aria-label="Profile">
            <UserIcon size={19} />
          </button>
        </div>
      </header>

      <main>
        <HomeHero
          cityName={cityName}
          localCityName={localCityName}
          locationLabel={locationLabel}
          heroImageUrl={content?.heroImageUrl}
          onChangeDestination={onChangeDestination}
        />
        {content && <TodaysPick places={content.todaysPicks} />}
        <JustWander />
        <ThemeExplore onSelectTheme={onSelectTheme} />
        {content && (
          <>
            <NearbyPlaces localCityName={localCityName} places={content.nearbyPlaces} />
            <FirstTimeSection cityName={cityName} places={content.firstTimePlaces} />
          </>
        )}
      </main>

      <BottomNav active="home" />
    </div>
  );
}
