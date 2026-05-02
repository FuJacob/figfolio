import type { Metadata, Viewport } from "next";
import { Sour_Gummy } from "next/font/google";
import "./globals.css";

const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  variable: "--font-sour-gummy",
});

export const metadata: Metadata = {
  title: "Jacob Fu | Figfolio",
  description: "A mobile-first personal portfolio with a Figma-inspired canvas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourGummy.variable} h-full antialiased`}>
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}
