import type { Metadata, Viewport } from "next";
import { Kalam, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Home hero "Hello, Seoul!" 손글씨 폰트 (CSS에서 var(--font-script)로 사용)
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "NABI",
  description: "Where do you want to go?",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fd",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={kalam.variable}>
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
