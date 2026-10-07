// 디자인에 사용되는 간단한 SVG 아이콘 모음 (외부 아이콘 라이브러리 미사용)

interface IconProps {
  size?: number;
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function GlobeIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19" />
      <path d="M12 2.5c2.6 2.7 3.9 5.8 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.8-3.9-9.5S9.4 5.2 12 2.5z" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.6} className={className} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...base}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...base}>
      <path d="M15 5.5L8.5 12l6.5 6.5" />
    </svg>
  );
}

export function UserIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5v-1c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5v1z" />
    </svg>
  );
}

export function NavigationIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <path d="M20.5 3.5L3.5 10.6l7.2 2.7 2.7 7.2z" />
    </svg>
  );
}

export function ArrowDownRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...base}>
      <path d="M6 6l12 12" />
      <path d="M18 9v9H9" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...base}>
      <path d="M4.5 12h15" />
      <path d="M13 5.5l6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...base}>
      <path d="M19.5 12h-15" />
      <path d="M11 5.5L4.5 12l6.5 6.5" />
    </svg>
  );
}

export function SearchIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.6} className={className} {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5l5 5" />
    </svg>
  );
}

export function CheckIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.6} className={className} {...base}>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function PlaneLandingIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M2.5 19h19v2h-19zM9.17 14.84l4.34 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 3.6v8.28L5.15 10.55l-.93-2.32-1.45-.39v5.17l1.6.43 4.8 1.4z"
      />
    </svg>
  );
}

export function PinIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.5c-3.9 0-7 3.1-7 7 0 5.1 6.1 11.4 6.4 11.7.3.3.9.3 1.2 0 .3-.3 6.4-6.6 6.4-11.7 0-3.9-3.1-7-7-7zm0 9.6a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2z"
      />
    </svg>
  );
}

export function HeartIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...base}>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

export function SparkleIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" />
    </svg>
  );
}

export function ButterflyIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M11.3 12.5C10.2 7.6 7 3.6 3.8 4 1.4 4.3 1.6 7.8 3.4 10.4c1.8 2.5 4.6 3.2 7.9 2.1z" />
      <path fill="currentColor" d="M11.3 13.6c-3.2-.2-6 1.4-6 4 0 2.1 2.5 2.7 4.1 1.1 1.1-1.1 1.7-3 1.9-5.1z" />
      <path fill="currentColor" opacity=".75" d="M12.7 12.5c1.1-4.9 4.3-8.9 7.5-8.5 2.4.3 2.2 3.8.4 6.4-1.8 2.5-4.6 3.2-7.9 2.1z" />
      <path fill="currentColor" opacity=".75" d="M12.7 13.6c3.2-.2 6 1.4 6 4 0 2.1-2.5 2.7-4.1 1.1-1.1-1.1-1.7-3-1.9-5.1z" />
    </svg>
  );
}

export function LandmarkIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <path d="M3 9.5L12 4l9 5.5z" />
      <path d="M5 10v7.5M9.7 10v7.5M14.3 10v7.5M19 10v7.5" />
      <path d="M3 20.5h18" />
    </svg>
  );
}

export function MountainIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <path d="M2.5 19L9 8.5l4 6 2.5-3.5 6 8z" />
    </svg>
  );
}

export function UtensilsIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <path d="M6 3v6.5a2.5 2.5 0 005 0V3M8.5 3v18" />
      <path d="M17.5 21V3c-2 1.3-3 4-3 7.5 0 1.8 1.2 3 3 3" />
    </svg>
  );
}

export function BagIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}>
      <path d="M4.5 8h15l-1.2 12.5H5.7z" />
      <path d="M8.5 10.5V7a3.5 3.5 0 017 0v3.5" />
    </svg>
  );
}

export function HomeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M11.3 2.8a1 1 0 011.4 0l9 8.5c.6.6.2 1.7-.7 1.7H19v7.5a1 1 0 01-1 1h-3.5v-6h-5v6H6a1 1 0 01-1-1V13H3c-.9 0-1.3-1.1-.7-1.7z" />
    </svg>
  );
}

export function CompassIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...base}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.8 8.2l-2 5.6-5.6 2 2-5.6z" />
    </svg>
  );
}

export function BookmarkIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...base}>
      <path d="M6 3.5h12v17.5l-6-4.5-6 4.5z" />
    </svg>
  );
}

export function ImageIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.6} className={className} {...base}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.8" />
      <path d="M21 16l-5-5-8.5 8.5" />
    </svg>
  );
}
