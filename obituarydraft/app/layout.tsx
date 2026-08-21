import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ObituaryDraft — Dignified obituaries in minutes",
  description:
    "A gentle tool for funeral home directors: turn a short intake into a dignified obituary draft and a funeral program version.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
