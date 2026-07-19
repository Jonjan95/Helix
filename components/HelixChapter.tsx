import {
  HelixScene,
  type HelixNodeName,
} from "@/components/HelixScene";
import type { HelixChapterData } from "@/data/helix-chapters";
import styles from "@/styles/HelixChapter.module.css";

type HelixChapterProps = {
  activeNode: HelixNodeName;
  content: HelixChapterData;
};

export function HelixChapter({ activeNode, content }: HelixChapterProps) {
  return (
    <div
      className={styles.chapter}
      id={content.anchorId}
      data-helix-chapter={content.chapter}
      data-testid="engineering-helix-chapter"
    >
      <HelixScene activeNode={activeNode} />

      <span
        className={styles.connector}
        data-motion="engineering-connector"
        aria-hidden="true"
      />

      <div
        className={styles.content}
        data-motion="engineering-content"
        data-testid="engineering-content"
      >
        <p className={styles.eyebrow}>
          <span aria-hidden="true">{content.index}</span>
          {content.label}
        </p>
        <h2 id={content.headingId}>{content.heading}</h2>
        <p className={styles.introduction}>{content.introduction}</p>
        <ul className={styles.principles}>
          {content.principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </div>

      <div
        className={styles.continuation}
        data-motion="helix-continuation"
        aria-hidden="true"
      >
        <span />
        <p>PATH CONTINUES / SELECTED WORK</p>
      </div>
    </div>
  );
}
