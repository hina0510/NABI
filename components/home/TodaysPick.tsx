"use client";

import { useRef, useState } from "react";
import type { HomePlace } from "@/types/home";
import { ArrowRightIcon } from "@/components/common/Icons";
import PlaceImage from "@/components/common/PlaceImage";
import styles from "./Home.module.css";

interface TodaysPickProps {
  places: HomePlace[];
}

const DRAG_THRESHOLD = 50; // 마우스 드래그 시 다음/이전 카드로 넘어가는 최소 이동 거리(px)

export default function TodaysPick({ places }: TodaysPickProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0, startIndex: 0 });

  // 가로 스크롤 위치로 현재 카드 index를 계산해 dot 표시에 사용 (터치/트랙패드/드래그 공통)
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(Math.max(index, 0), places.length - 1));
  }

  // 데스크톱 마우스 드래그 지원. 터치는 브라우저 기본 스크롤 + scroll-snap이 처리한다.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      startIndex: Math.round(el.scrollLeft / el.clientWidth),
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    const el = e.currentTarget;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none"; // 드래그 중에는 snap을 끄고 손을 놓을 때 정렬
    }
    if (d.moved) el.scrollLeft = d.startScroll - dx;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;

    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - d.startX;
    let target = d.startIndex;
    if (dx <= -DRAG_THRESHOLD) target += 1;
    else if (dx >= DRAG_THRESHOLD) target -= 1;
    target = Math.min(Math.max(target, 0), places.length - 1);

    el.style.scrollSnapType = "";
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  }

  // 드래그로 넘긴 직후에는 카드 안 버튼 click이 실행되지 않도록 막는다
  function handleClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <section className={styles.pick}>
      <div
        ref={trackRef}
        className={styles.pickTrack}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
      >
        {places.map((place) => (
          <div key={place.id} className={styles.pickSlide}>
            <article className={styles.pickCard}>
              <div className={styles.pickText}>
                <p className={styles.pickLabel}>TODAY&apos;S PICK</p>
                <h2 className={styles.pickName}>{place.name}</h2>
                {place.localName && <p className={styles.pickLocal}>{place.localName}</p>}
                {place.description && <p className={styles.pickDesc}>{place.description}</p>}
              </div>
              <div className={styles.pickImageWrap}>
                <PlaceImage src={place.imageUrl} alt={place.name} sizes="100px" className={styles.pickImage} />
                {/* 상세 페이지 연결은 다음 단계 */}
                <button type="button" className={styles.pickArrow} aria-label={`${place.name} details`}>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>

      {places.length > 1 && (
        <div className={styles.dots}>
          {places.map((place, i) => (
            <span key={place.id} className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`} />
          ))}
        </div>
      )}
    </section>
  );
}
