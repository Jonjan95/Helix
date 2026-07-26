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
    accessibleLabel: "View Jonathan Jansson on GitHub",
    action: "Explore GitHub",
    description: "Projects, source code, and ongoing technical experiments.",
    external: true,
    href: "https://github.com/Jonjan95",
    id: "github",
    label: "GitHub",
    primary: true,
    type: "external",
  },
  {
    accessibleLabel: "View Jonathan Jansson on LinkedIn",
    action: "View LinkedIn",
    description: "Studies, experience, and professional background.",
    external: true,
    href: "https://se.linkedin.com/in/jonathan-jansson-b94783270",
    id: "linkedin",
    label: "LinkedIn",
    primary: false,
    type: "external",
  },
  {
    accessibleLabel: "Email Jonathan Jansson",
    action: "Send email",
    description:
      "Direct contact about LIA, junior roles, or technical collaboration.",
    external: false,
    href: "mailto:jonis.jansson@hotmail.com",
    id: "email",
    label: "Email",
    primary: false,
    type: "email",
  },
] as const satisfies readonly ContactRoute[];
