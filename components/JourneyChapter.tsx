import type { ReactNode } from "react";
import styles from "@/styles/JourneyChapter.module.css";

export type ChapterName =
  | "orientation"
  | "engineering"
  | "selected-work"
  | "proof"
  | "future";

type JourneyChapterProps = {
  children: ReactNode;
  labelledBy: string;
  name: ChapterName;
};

export function JourneyChapter({
  children,
  labelledBy,
  name,
}: JourneyChapterProps) {
  return (
    <section
      className={styles.chapter}
      data-chapter={name}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}
