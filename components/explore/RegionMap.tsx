"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { MapBox, SvgMapData } from "@/types/explore";
import styles from "./Explore.module.css";

interface RegionMapProps {
  map: SvgMapData;
  selectedId: string;
  onSelect: (id: string) => void;
  // 스크린리더용 지역 이름 (영문)
  getRegionName: (id: string) => string;
  ariaLabel: string;
}

// 확대 상태: scale = 배율, x / y = 이동 거리 (SVG 좌표 단위)
interface Transform {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
// 이 거리(px) 이상 움직이면 탭이 아니라 드래그로 판단 → 지역 선택하지 않음
const TAP_SLOP = 8;
// 가장자리 경계선이 잘리지 않도록 지도 주변에 두는 여백 (SVG 좌표 단위)
const PAD = 2;
const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

interface Point {
  x: number;
  y: number;
}

// 한 번의 터치/클릭 동작 정보
interface Gesture {
  startX: number;
  startY: number;
  regionId: string | null; // 처음 누른 지역
  moved: boolean; // 드래그했는지
  multi: boolean; // 두 손가락을 사용했는지
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// 지도가 화면 밖으로 과도하게 나가지 않도록 이동 범위를 제한한다.
// 확대된 지도의 가장자리가 지도 영역 안쪽으로 들어오지 않게 하는 방식 (1배일 때는 이동 불가)
function clampTransform(t: Transform, box: MapBox): Transform {
  const scale = clamp(t.scale, MIN_SCALE, MAX_SCALE);
  const k = 1 - scale; // 0 이하
  return {
    scale,
    x: clamp(t.x, k * (box.x + box.width), k * box.x),
    y: clamp(t.y, k * (box.y + box.height), k * box.y),
  };
}

// 기준점(p)을 중심으로 확대/축소
function zoomAt(t: Transform, p: Point, factor: number): Transform {
  const scale = clamp(t.scale * factor, MIN_SCALE, MAX_SCALE);
  const ratio = scale / t.scale;
  return { scale, x: p.x - (p.x - t.x) * ratio, y: p.y - (p.y - t.y) * ratio };
}

export default function RegionMap({ map, selectedId, onSelect, getRegionName, ariaLabel }: RegionMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>(IDENTITY);
  // 제스처 계산은 렌더링을 기다리지 않도록 ref에도 최신 값을 둔다.
  const transformRef = useRef<Transform>(IDENTITY);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);

  // 실제로 보여줄 영역 = 경계가 있는 영역 + 약간의 여백
  const box: MapBox = useMemo(
    () => ({
      x: map.contentBox.x - PAD,
      y: map.contentBox.y - PAD,
      width: map.contentBox.width + PAD * 2,
      height: map.contentBox.height + PAD * 2,
    }),
    [map],
  );

  function update(next: Transform) {
    const clamped = clampTransform(next, box);
    transformRef.current = clamped;
    setTransform(clamped);
  }

  // 화면 좌표(px) → SVG 좌표
  function toSvgPoint(clientX: number, clientY: number): Point {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: clientX, y: clientY };
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y };
  }

  // 마우스 휠 확대·축소 — React의 onWheel은 preventDefault가 안 되므로 직접 등록
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function handleWheel(event: WheelEvent) {
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      // 이미 1배인데 더 축소하려는 경우에는 페이지 스크롤을 막지 않는다.
      if (delta > 0 && transformRef.current.scale <= MIN_SCALE) return;
      event.preventDefault();
      const point = toSvgPoint(event.clientX, event.clientY);
      update(zoomAt(transformRef.current, point, Math.exp(-delta * 0.0015)));
    }
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
    // box는 map이 바뀔 때만 바뀐다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box]);

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 1) {
      const target = (event.target as Element).closest("[data-region-id]");
      gesture.current = {
        startX: event.clientX,
        startY: event.clientY,
        regionId: target?.getAttribute("data-region-id") ?? null,
        moved: false,
        multi: false,
      };
    } else if (gesture.current) {
      gesture.current.multi = true;
    }
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const prev = pointers.current.get(event.pointerId);
    if (!prev || !gesture.current) return;
    const current = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, current);

    if (pointers.current.size === 1) {
      // 한 손가락(마우스) 드래그 → 이동
      const g = gesture.current;
      if (!g.moved && Math.hypot(current.x - g.startX, current.y - g.startY) > TAP_SLOP) g.moved = true;
      if (!g.moved) return;
      const a = toSvgPoint(prev.x, prev.y);
      const b = toSvgPoint(current.x, current.y);
      const t = transformRef.current;
      update({ ...t, x: t.x + (b.x - a.x), y: t.y + (b.y - a.y) });
      return;
    }

    // 두 손가락 → 확대·축소 + 이동
    const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1];
    if (!other) return;
    const prevDist = Math.hypot(prev.x - other.x, prev.y - other.y);
    const nextDist = Math.hypot(current.x - other.x, current.y - other.y);
    if (prevDist < 1) return;
    const prevMid = toSvgPoint((prev.x + other.x) / 2, (prev.y + other.y) / 2);
    const nextMid = toSvgPoint((current.x + other.x) / 2, (current.y + other.y) / 2);
    const zoomed = zoomAt(transformRef.current, prevMid, nextDist / prevDist);
    update({ ...zoomed, x: zoomed.x + (nextMid.x - prevMid.x), y: zoomed.y + (nextMid.y - prevMid.y) });
  }

  function handlePointerEnd(event: PointerEvent<SVGSVGElement>) {
    if (!pointers.current.delete(event.pointerId)) return;
    if (pointers.current.size > 0) return;

    // 모든 손가락을 뗐을 때: 움직이지 않은 한 손가락 탭이면 지역 선택
    const g = gesture.current;
    gesture.current = null;
    if (event.type === "pointerup" && g && !g.moved && !g.multi && g.regionId) {
      onSelect(g.regionId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  }

  // 지역(path)은 선택이 바뀔 때만 다시 만든다. (확대·이동 중에는 그대로 재사용)
  const regionPaths = useMemo(
    () =>
      map.regions.map((region) => {
        const selected = region.id === selectedId;
        return (
          <path
            key={region.id}
            data-region-id={region.id}
            d={region.d}
            strokeWidth={region.strokeWidth}
            vectorEffect="non-scaling-stroke"
            className={`${styles.region} ${selected ? styles.regionSelected : ""}`}
            role="button"
            tabIndex={0}
            aria-label={getRegionName(region.id)}
            aria-pressed={selected}
            onKeyDown={(event) => handleKeyDown(event, region.id)}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, selectedId],
  );

  const { scale, x, y } = transform;
  const zoomed = scale > 1.001;

  return (
    <div className={styles.mapArea} style={{ aspectRatio: `${box.width} / ${box.height}` }}>
      <svg
        ref={svgRef}
        className={styles.mapSvg}
        viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label={ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <g transform={`translate(${x} ${y}) scale(${scale})`}>
          <g>{regionPaths}</g>
          {/* 라벨은 확대해도 화면에서 같은 크기로 보이도록 글자 크기를 배율로 나눈다 */}
          <g className={styles.labels} aria-hidden>
            {map.regions.map((region) =>
              region.label ? (
                <text
                  key={region.id}
                  x={region.label.x}
                  y={region.label.y}
                  fontSize={region.label.fontSize / scale}
                  className={`${styles.label} ${region.id === selectedId ? styles.labelSelected : ""}`}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {region.label.text}
                </text>
              ) : null,
            )}
          </g>
        </g>
      </svg>

      {zoomed && (
        <button type="button" className={styles.resetButton} onClick={() => update(IDENTITY)} aria-label="Reset map zoom">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 4v6h6" />
            <path d="M5.5 15a7.5 7.5 0 101.8-7.8L4 10" />
          </svg>
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
