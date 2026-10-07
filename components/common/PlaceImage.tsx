import Image from "next/image";
import { ImageIcon } from "@/components/common/Icons";
import styles from "./PlaceImage.module.css";

interface PlaceImageProps {
  src?: string;
  alt: string;
  className?: string; // 크기/모서리는 부모에서 지정
  sizes?: string;
}

// 이미지가 있으면 표시하고, 아직 asset이 없으면 placeholder를 표시한다.
export default function PlaceImage({ src, alt, className, sizes = "200px" }: PlaceImageProps) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.img} />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <ImageIcon size={26} />
        </div>
      )}
    </div>
  );
}
