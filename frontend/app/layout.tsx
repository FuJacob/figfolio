import type { Metadata } from "next";
import { Sour_Gummy } from "next/font/google";
import "./globals.css";

const sourGummy = Sour_Gummy({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sour-gummy",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jacob Fu",
  description: "Figfolio canvas portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourGummy.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
