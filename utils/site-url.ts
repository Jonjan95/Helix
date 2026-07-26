const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function getSiteUrl(): URL | null {
  if (!siteUrl) {
    return null;
  }

  try {
    const url = new URL(siteUrl);

    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      return null;
    }

    url.pathname = "/";
    url.search = "";
    url.hash = "";

    return url;
  } catch {
    return null;
  }
}
