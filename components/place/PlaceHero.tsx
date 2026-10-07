import { ArrowLeftIcon, HeartIcon, ShareIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import styles from "./PlaceDetail.module.css";

interface PlaceHeroProps {
  name: string;
  imageUrl?: string;
  photoCount: number; // 0이면 1 / N 표시를 숨김
  onBack: () => void;
}

export default function PlaceHero({ name, imageUrl, photoCount, onBack }: PlaceHeroProps) {
  return (
    <div className={styles.hero}>
      <PlaceImage src={imageUrl} alt={name} sizes="430px" className={styles.heroImage} />

      <div className={styles.heroBar}>
        <button type="button" className={styles.heroButton} onClick={onBack} aria-label="Back to Culture">
          <ArrowLeftIcon size={21} />
        </button>
        {/* Save / Share는 다음 단계 (현재 UI only) */}
        <button type="button" className={styles.heroButton} aria-label={`Save ${name}`}>
          <HeartIcon size={21} />
        </button>
        <button type="button" className={styles.heroButton} aria-label={`Share ${name}`}>
          <ShareIcon size={19} />
        </button>
      </div>

      {/* 갤러리 기능 없음 — 이미지 개수 UI only */}
      {photoCount > 0 && <span className={styles.heroCount}>1 / {photoCount}</span>}
    </div>
  );
}
