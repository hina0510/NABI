import Image from "next/image";
import type { Destination } from "@/types/destination";
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  GlobeIcon,
  NavigationIcon,
  UserIcon,
} from "@/components/common/Icons";
import styles from "./EntryScreen.module.css";

interface EntryScreenProps {
  destination: Destination;
  onOpenDestination: () => void;
  onStart: () => void;
}

export default function EntryScreen({ destination, onOpenDestination, onStart }: EntryScreenProps) {
  const { country, city } = destination;

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button type="button" className={styles.langButton} aria-label="Language: English">
          <GlobeIcon size={18} className={styles.langGlobe} />
          <span>EN</span>
          <ChevronDownIcon size={12} />
        </button>
        <button type="button" className={styles.profileButton} aria-label="Profile">
          <UserIcon size={24} />
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <Image
            src="/images/nabi_logo.png"
            alt="NABI"
            width={1338}
            height={646}
            priority
            sizes="210px"
            className={styles.logo}
          />
          <h1 className={styles.title}>
            Where do you
            <br />
            want to go?
          </h1>
          <p className={styles.subtitle}>
            Choose your next adventure or explore
            <br />a destination
          </p>
        </div>

        <section className={styles.card}>
          <button type="button" className={styles.destination} onClick={onOpenDestination}>
            <span className={styles.destIcon}>
              <NavigationIcon size={18} />
            </span>
            <span className={styles.destText}>
              <span className={styles.destLabel}>DESTINATION</span>
              <span className={styles.destValue}>
                {city.isAll ? (
                  <span className={styles.destCity}>{country.name}</span>
                ) : (
                  <>
                    <span className={styles.destCity}>{city.name}</span>
                    <span className={styles.destCountry}>· {country.name}</span>
                  </>
                )}
              </span>
            </span>
            <span className={styles.destArrow}>
              <ArrowDownRightIcon size={15} />
            </span>
          </button>
        </section>

        <button type="button" className={styles.startButton} onClick={onStart}>
          Start Exploring
          <ArrowRightIcon size={16} />
        </button>
      </main>
    </div>
  );
}
