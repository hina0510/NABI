import { MapPinIcon } from "@/components/common/Icons";
import type { PlaceInfoItem, PlaceTravelInfo as TravelInfo } from "@/types/culture";
import styles from "./PlaceDetail.module.css";

interface PlaceTravelInfoProps {
  info: TravelInfo;
}

// 현재 mock data — 실시간 운영 정보가 아니므로 "Open now" 같은 표현은 쓰지 않는다.
export default function PlaceTravelInfo({ info }: PlaceTravelInfoProps) {
  const items: { label: string; item: PlaceInfoItem }[] = [
    { label: "Opening Hours", item: info.openingHours },
    { label: "Recommended", item: info.recommendedVisit },
    { label: "Best Time", item: info.bestTime },
  ];
  if (info.admission) items.push({ label: "Admission", item: info.admission });

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Travel Info</h2>
      </div>
      <div className={styles.card}>
        <div className={styles.infoGrid}>
          {items.map(({ label, item }) => (
            <div key={label}>
              <span className={styles.infoLabel}>{label}</span>
              <span className={`${styles.infoValue} ${item.highlight ? styles.infoValueHighlight : ""}`}>
                {item.value}
              </span>
              {item.note && <span className={styles.infoNote}>{item.note}</span>}
            </div>
          ))}
        </div>

        <div className={styles.infoAddress}>
          <MapPinIcon size={16} className={styles.infoAddressIcon} />
          <div>
            <span className={styles.infoLabel}>Address</span>
            <span className={styles.infoValue}>{info.address}</span>
          </div>
        </div>

        <p className={styles.infoDisclaimer}>Information may change. Please check before visiting.</p>
      </div>
    </section>
  );
}
