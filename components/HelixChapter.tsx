import { HelixChapterContent } from "@/components/HelixChapterContent";
import type { HelixChapterData } from "@/data/helix-chapters";
import styles from "@/styles/HelixChapter.module.css";

type HelixChapterProps = {
  chapter: HelixChapterData;
};

export function HelixChapter({ chapter }: HelixChapterProps) {
  return (
    <div
      className={styles.stop}
      id={chapter.anchorId}
      data-helix-chapter={chapter.chapter}
      data-journey-chapter={chapter.chapter}
      data-journey-state="static"
      data-pacing={chapter.pacing}
      data-placement={chapter.placement}
      data-testid={`journey-chapter-${chapter.chapter}`}
    >
      <span
        className={styles.node}
        data-journey-node={chapter.chapter}
        data-node-state="static"
        data-motion="journey-node"
        data-testid={`journey-node-${chapter.chapter}`}
        aria-hidden="true"
      >
        <span />
      </span>

      <span
        className={styles.connector}
        data-motion="journey-connector"
        aria-hidden="true"
      />

      <div className={styles.content} data-motion="journey-content">
        <HelixChapterContent chapter={chapter} />
      </div>
    </div>
  );
}
