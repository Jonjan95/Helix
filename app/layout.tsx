import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonathan Jansson — Software Developer | Helix",
  description:
    "Jonathan Jansson's software developer portfolio, focused on quality, testing, usability, and reliable implementation.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
