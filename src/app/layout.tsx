import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DARK — Сетевая инфраструктура Dark Web",
  description:
    "DARK — образовательная платформа для изучения сетевой инфраструктуры Dark/Deep Web: Tor, SOCKS5, I2P, Onion-сервисы. Интерактивные симуляторы, конфигураторы и теоретические материалы.",
  keywords: [
    "DARK",
    "Tor",
    "SOCKS5",
    "I2P",
    "Onion",
    "Dark Web",
    "Deep Web",
    "сетевая инфраструктура",
    "анонимность",
    "луковичная маршрутизация",
  ],
  authors: [{ name: "DARK Project" }],
  icons: {
    icon: "/favicon.svg",
  },
};

// Remove Vercel toolbar from DOM
function VercelToolbarRemover() {
  if (typeof window !== "undefined") {
    const observer = new MutationObserver(() => {
      const selectors = [
        "[data-vercel-toolbar]",
        "[data-vercel-banner]",
        ".vc-toolbar",
        ".vc-feedback-trigger",
        ".__vercel-toolbar",
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var observer = new MutationObserver(function() {
                  document.querySelectorAll('[data-vercel-toolbar],[data-vercel-banner],.vc-toolbar,.vc-feedback-trigger,.__vercel-toolbar').forEach(function(el) { el.remove(); });
                });
                if (document.body) observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
