import type { Metadata } from "next";
import { LenisProvider } from "@/components/layout/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nué Solène",
  description: "A scroll-cinematic fragrance landing page for Solène Eau de Parfum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
