import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonathan Jansson | Software Development & Testing",
  description:
    "Portfolio of Jonathan Jansson, a software development student in Malmö focused on testing and quality.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
