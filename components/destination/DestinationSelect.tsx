"use client";

import { useState } from "react";
import type { City, Destination } from "@/types/destination";
import { COUNTRIES, POPULAR_CITY_IDS } from "@/lib/mockDestinations";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  PlaneLandingIcon,
  SearchIcon,
} from "@/components/common/Icons";
import styles from "./DestinationSelect.module.css";

interface DestinationSelectProps {
  initialDestination: Destination;
  onBack: () => void;
  onConfirm: (destination: Destination) => void;
}

const KOREA = COUNTRIES[0];
// POPULAR_CITY_IDS 순서대로 chip을 표시
const POPULAR_CITIES = POPULAR_CITY_IDS.map((id) => KOREA.cities.find((city) => city.id === id)).filter(
  (city): city is City => city !== undefined
);

export default function DestinationSelect({ initialDestination, onBack, onConfirm }: DestinationSelectProps) {
  const [query, setQuery] = useState("");
  const [activeCountryId, setActiveCountryId] = useState(initialDestination.country.id);
  const [selected, setSelected] = useState<Destination>(initialDestination);

  // 검색: 국가명 또는 도시명에 검색어가 포함된 국가만 표시
  const q = query.trim().toLowerCase();
  const matches = (text: string) => text.toLowerCase().includes(q);

  const visibleCountries =
    q === "" ? COUNTRIES : COUNTRIES.filter((c) => matches(c.name) || c.cities.some((city) => matches(city.name)));

  // 현재 active 국가가 검색 결과에 없으면 첫 번째 결과 국가를 보여준다
  const shownCountry = visibleCountries.find((c) => c.id === activeCountryId) ?? visibleCountries[0];

  const visibleCities: City[] = !shownCountry
    ? []
    : q === "" || matches(shownCountry.name)
      ? shownCountry.cities
      : shownCountry.cities.filter((city) => matches(city.name));

  const selectedLabel = selected.city.isAll
    ? selected.country.name
    : `${selected.country.name} · ${selected.city.name}`;

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="Back">
          <ArrowLeftIcon size={22} />
        </button>
        <h1 className={styles.title}>Choose Destination</h1>
      </header>

      <div className={styles.top}>
        <label className={styles.search}>
          <SearchIcon size={18} className={styles.searchIcon} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country or city (e.g. Seoul, Tokyo)"
            className={styles.searchInput}
          />
        </label>

        <div className={styles.chips}>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              className={styles.chip}
              onClick={() => {
                setActiveCountryId(KOREA.id);
                setSelected({ country: KOREA, city });
              }}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.countryCol}>
          <div className={styles.colHeader}>COUNTRY</div>
          <ul className={styles.list}>
            {visibleCountries.map((country) => {
              const isActive = country.id === shownCountry?.id;
              return (
                <li key={country.id}>
                  <button
                    type="button"
                    className={`${styles.countryItem} ${isActive ? styles.countryActive : ""}`}
                    onClick={() => setActiveCountryId(country.id)}
                  >
                    <span>{country.name}</span>
                    {isActive && <ChevronRightIcon size={14} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.cityCol}>
          <div className={styles.colHeader}>CITY</div>
          <ul className={styles.list}>
            {visibleCities.map((city) => {
              const isActive = city.id === selected.city.id;
              return (
                <li key={city.id}>
                  <button
                    type="button"
                    className={`${styles.cityItem} ${isActive ? styles.cityActive : ""}`}
                    onClick={() => shownCountry && setSelected({ country: shownCountry, city })}
                  >
                    <span>{city.name}</span>
                    {isActive && <CheckIcon size={18} className={styles.check} />}
                  </button>
                </li>
              );
            })}
          </ul>
          {visibleCities.length === 0 && <p className={styles.empty}>No results</p>}
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.selectedBox}>
          <div>
            <div className={styles.selectedLabel}>SELECTED DESTINATION</div>
            <div className={styles.selectedValue}>{selectedLabel}</div>
          </div>
          <PlaneLandingIcon size={22} className={styles.plane} />
        </div>
        <button type="button" className={styles.confirmButton} onClick={() => onConfirm(selected)}>
          Confirm Destination
          <ArrowRightIcon size={18} />
        </button>
      </footer>
    </div>
  );
}
