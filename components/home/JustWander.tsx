import { ArrowRightIcon, ButterflyIcon, SparkleIcon } from "@/components/common/Icons";
import styles from "./Home.module.css";

// 랜덤 추천 기능은 다음 단계. 현재는 UI만 구현.
export default function JustWander() {
  return (
    <section className={styles.wander}>
      <h2 className={styles.wanderTitle}>
        Just Wander
        <SparkleIcon size={13} className={styles.wanderSparkle} />
      </h2>
      <p className={styles.wanderText}>
        어디 갈지 고민된다면,
        <br />
        NABI가 한 곳을 추천해드릴게요.
      </p>
      <button type="button" className={styles.wanderButton}>
        <ButterflyIcon size={17} className={styles.wanderButtonIcon} />
        지금, 나비와 떠나보기
        <ArrowRightIcon size={16} />
      </button>

      <svg className={styles.wanderPath} width="110" height="70" viewBox="0 0 110 70" aria-hidden>
        <path
          d="M4 66c14-8 22-24 36-30 14-6 22 10 38 8 14-2 20-18 26-30"
          fill="none"
          stroke="#5db5e6"
          strokeWidth="1.6"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
      </svg>
      <ButterflyIcon size={16} className={styles.wanderButterfly} />
    </section>
  );
}
