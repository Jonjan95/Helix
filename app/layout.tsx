import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonathan Jansson — Software Development, Test & Quality | Helix",
  description:
    "Jonathan Jansson is a software development student in Malmö focused on testing, quality, and reliable systems.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
