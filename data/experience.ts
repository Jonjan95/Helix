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
    category: "Software & quality",
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
      "Built a full-stack school project around a Spring Boot REST API, relational persistence, and a separate Next.js client.",
      "Use JUnit, Mockito, MockMvc, Testcontainers, and Playwright across public quality-focused projects to check units, HTTP boundaries, database behaviour, and user flows.",
      "Develop public projects through scoped issues, pull requests, validation, and review, keeping claims and implementation boundaries explicit.",
    ],
    id: "software-quality",
    index: "01",
    perspective:
      "This work reinforces my current direction: turn requirements into observable behaviour, then validate that behaviour at the right system boundary.",
    summary:
      "I am studying systems development with a focus on QA and test automation. Coursework and public projects have given me a practical way to connect Java services, REST APIs, databases, interfaces, and automated checks.",
    timeframe: "Current studies and project work",
    title: "Software development and quality engineering",
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
      "Studied embedded software in environments where code interacted with microcontrollers, sensors, actuators, and connected devices.",
      "Worked across constrained-device programming, networking, and real-time concepts rather than treating software as an isolated layer.",
      "Practised investigating behaviour where timing, configuration, communication, and physical components could all affect the result.",
    ],
    id: "embedded-connected",
    index: "02",
    perspective:
      "That foundation keeps my software work attentive to communication, timing, physical constraints, and failures that cross more than one layer.",
    summary:
      "Previous embedded-software studies placed code next to devices, communication, and physical behaviour. They made system boundaries tangible and showed why a failure cannot always be isolated to one function or one file.",
    timeframe: "Previous technical studies",
    title: "Embedded systems and connected devices",
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
      "Responded to technical fault reports and investigated equipment when the cause was not known in advance.",
      "Verified connectivity and field-installed equipment, replaced components when appropriate, and checked function before leaving or escalating.",
      "Worked independently at installation locations and communicated findings so the next action could be based on useful evidence.",
    ],
    id: "field-troubleshooting",
    index: "03",
    perspective:
      "Field work developed a durable troubleshooting habit: start with the symptom, gather evidence, isolate the boundary, verify the outcome, and escalate with clarity when needed.",
    summary:
      "In practical technical service work, fault reports often arrived as symptoms rather than diagnoses. On-location work required methodical checks across power, connected devices, network equipment, configuration, and replaceable components.",
    timeframe: "Practical field experience",
    title: "Technical service and field troubleshooting",
  },
] as const satisfies readonly ExperienceTrack[];
