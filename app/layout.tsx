import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { SplashOverlay } from "@/components/splash-overlay";

// Outfit matches the QB Elite mobile app's bundled font family (see
// qb_elite_source/pubspec.yaml). Google Fonts → CSS variable consumed
// by tailwind.config.ts `fontFamily.sans`.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QB Elite",
  description: "Become Elite. Quarterback training, mechanics, mindset.",
  manifest: "/manifest.webmanifest",
  // iOS Safari uses apple-touch-icon when the user taps Share → Add to
  // Home Screen. Without it, the home-screen tile is a generic screenshot.
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  // apple-mobile-web-app-capable + apple-mobile-web-app-status-bar-style.
  // Together with `display: standalone` in the manifest, this is what
  // makes the home-screen launch hide the Safari URL bar + bottom toolbar.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QB Elite",
  },
};

export const viewport: Viewport = {
  themeColor: "#B61F26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // viewportFit: 'cover' lets the app extend under the iOS home-indicator
  // area AND populates env(safe-area-inset-*) so our pb-[calc(env(...))]
  // padding on the tab bar actually has a value to compute against.
  // Without this, iOS reports safe-area-inset-bottom as 0 and the tab
  // bar sits flush with the bottom edge under the home indicator.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
        <SplashOverlay />
      </body>
    </html>
  );
}
