export type ExperienceTrack = {
  category: string;
  current: boolean;
  environments: readonly string[];
  evidence: readonly string[];
  id:
    | "software-quality"
    | "embedded-connected"
    | "field-troubleshooting";
  index: string;
  perspective: string;
  summary: string;
  timeframe: string;
  title: string;
};

export const experienceTracks = [
  {
    category: "Software & testing",
    current: true,
    environments: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "SQL",
      "JUnit",
      "Mockito",
      "Playwright",
      "GitHub CI",
    ],
    evidence: [
      "Built a full-stack school project with a Spring Boot REST API, relational database, and separate Next.js client.",
      "Use JUnit, Mockito, MockMvc, Testcontainers, and Playwright in public projects to test logic, endpoints, database integration, and user flows.",
      "Plan project work through issues and pull requests, then run tests, builds, and manual checks before calling a change complete.",
    ],
    id: "software-quality",
    index: "01",
    perspective:
      "It is shaping the work I want to do next: turning requirements into clear, testable behaviour and choosing the right level to check it.",
    summary:
      "I am studying systems development with a focus on QA and test automation. Coursework and public projects let me work across Java services, REST APIs, databases, interfaces, and automated tests.",
    timeframe: "Current studies and projects",
    title: "Software development and testing",
  },
  {
    category: "Embedded & connected systems",
    current: false,
    environments: [
      "C / C++",
      "Python",
      "Microcontrollers",
      "RTOS concepts",
      "Networking",
      "Sensors & actuators",
    ],
    evidence: [
      "Studied embedded software where code interacted with microcontrollers, sensors, actuators, and connected devices.",
      "Worked with constrained devices, networking, and real-time concepts rather than treating software as an isolated layer.",
      "Investigated problems where timing, configuration, communication, or a physical component could change the result.",
    ],
    id: "embedded-connected",
    index: "02",
    perspective:
      "It taught me to look beyond the code when timing, configuration, communication, or hardware can change the result.",
    summary:
      "Previous embedded-software studies placed code next to devices, communication, and physical behaviour. They showed me why a fault cannot always be traced to one function or one file.",
    timeframe: "Previous technical studies",
    title: "Embedded software and connected devices",
  },
  {
    category: "Technical service",
    current: false,
    environments: [
      "Fault diagnostics",
      "Network connectivity",
      "Connected devices",
      "Component verification",
      "Service documentation",
    ],
    evidence: [
      "Responded to fault reports when the exact cause was not known beforehand.",
      "Checked connected equipment, replaced components when appropriate, and confirmed function before leaving or escalating.",
      "Worked independently on site and passed on clear findings when another person needed to continue the work.",
    ],
    id: "field-troubleshooting",
    index: "03",
    perspective:
      "That work taught me to start with what I can observe, narrow the cause, check the outcome, and make escalation useful.",
    summary:
      "Field-service work often started with a symptom and little context. On site, I checked power, connectivity, configuration, network equipment, and replaceable components to find the likely cause.",
    timeframe: "Practical field experience",
    title: "Technical service and field troubleshooting",
  },
] as const satisfies readonly ExperienceTrack[];
