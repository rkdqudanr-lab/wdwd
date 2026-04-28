import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WDWD - 뭐 마실래?",
  description: "링크 하나로 음료 주문을 모아보세요. 카페, 편의점, 슈퍼 어디든 간편하게.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-cream text-brand-brown flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-white shadow-xl overflow-x-hidden flex flex-col relative">
          {children}
        </div>
      </body>
    </html>
  );
}
