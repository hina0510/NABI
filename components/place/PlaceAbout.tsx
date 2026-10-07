"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/common/Icons";
import styles from "./PlaceDetail.module.css";

interface PlaceAboutProps {
  paragraphs: string[];
}

// 처음에는 첫 문단만 보여주고, Read more로 나머지 문단을 펼친다.
export default function PlaceAbout({ paragraphs }: PlaceAboutProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? paragraphs : paragraphs.slice(0, 1);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>About</h2>
      </div>
      <div className={styles.about}>
        {visible.map((text) => (
          <p key={text} className={styles.aboutText}>
            {text}
          </p>
        ))}
        {paragraphs.length > 1 && (
          <button
            type="button"
            className={`${styles.linkButton} ${styles.readMore} ${expanded ? styles.readMoreOpen : ""}`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDownIcon size={13} />
          </button>
        )}
      </div>
    </section>
  );
}
