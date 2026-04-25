import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Self-Degree — Self-Directed Education Framework",
  description:
    "AI-powered, self-directed education for families who've stopped asking 'is school working?' and started asking 'what are we actually preparing our kids for?'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy-900">{children}</body>
    </html>
  );
}
