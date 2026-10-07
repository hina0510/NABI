import type { PlaceHistoryStory as HistoryStory } from "@/types/culture";
import styles from "./PlaceDetail.module.css";

interface PlaceHistoryStoryProps {
  story: HistoryStory;
}

export default function PlaceHistoryStory({ story }: PlaceHistoryStoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>History &amp; Story</h2>
      </div>
      <div className={styles.card}>
        <p className={styles.storyLead}>{story.lead}</p>
        <ol className={styles.storyList}>
          {story.points.map((point) => (
            <li key={point.label} className={styles.storyItem}>
              <span className={styles.storyLabel}>{point.label}</span>
              <span className={styles.storyText}>{point.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
