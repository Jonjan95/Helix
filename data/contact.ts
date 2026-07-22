export type ContactRouteId = "github" | "linkedin" | "email";

export type ContactRoute = {
  accessibleLabel: string;
  action: string;
  description: string;
  external: boolean;
  href: string;
  id: ContactRouteId;
  label: string;
  primary: boolean;
  type: "external" | "email";
};

export const contactRoutes = [
  {
    accessibleLabel:
      "Explore Jonathan Jansson's public repositories on GitHub",
    action: "Explore GitHub",
    description: "Public repositories, current projects, and technical experiments.",
    external: true,
    href: "https://github.com/Jonjan95",
    id: "github",
    label: "GitHub",
    primary: true,
    type: "external",
  },
  {
    accessibleLabel:
      "View Jonathan Jansson's professional profile on LinkedIn",
    action: "View LinkedIn",
    description: "Professional background, studies, and industry connections.",
    external: true,
    href: "https://se.linkedin.com/in/jonathan-jansson-b94783270",
    id: "linkedin",
    label: "LinkedIn",
    primary: false,
    type: "external",
  },
  {
    accessibleLabel:
      "Email Jonathan Jansson about LIA, junior opportunities, or technical collaboration",
    action: "Send email",
    description:
      "Direct contact for LIA, junior opportunities, and relevant technical conversations.",
    external: false,
    href: "mailto:jonis.jansson@hotmail.com",
    id: "email",
    label: "Email",
    primary: false,
    type: "email",
  },
] as const satisfies readonly ContactRoute[];
