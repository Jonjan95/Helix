import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/utils/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const metadataBase = siteUrl ?? new URL("http://localhost:3000");
const title = "Jonathan Jansson | Software Development & Testing";
const description =
  "Portfolio of Jonathan Jansson, a software development student in Malmö focused on testing and quality.";

export const metadata: Metadata = {
  ...(siteUrl
    ? {
        alternates: { canonical: siteUrl },
      }
    : {}),
  applicationName: "Helix",
  authors: [{ name: "Jonathan Jansson" }],
  creator: "Jonathan Jansson",
  description,
  metadataBase,
  openGraph: {
    description,
    locale: "en",
    siteName: "Helix",
    title,
    type: "website",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
