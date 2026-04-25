import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Self-Degree — Education for the World as It Actually Exists",
  description:
    "Self-Degree is a self-directed, AI-powered education framework for families who've stopped asking 'is school working?' and started asking 'what are we actually preparing our kids for?'",
  keywords:
    "self-directed education, AI learning, homeschool alternative, personalized education, Self-Degree",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
