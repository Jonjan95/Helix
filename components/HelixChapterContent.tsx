import { ContactRoutes } from "@/components/ContactRoutes";
import { ExperienceTracks } from "@/components/ExperienceTracks";
import type { HelixChapterData } from "@/data/helix-chapters";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import styles from "@/styles/HelixChapterContent.module.css";

type HelixChapterContentProps = {
  chapter: HelixChapterData;
};

function ChapterHeader({ chapter }: HelixChapterContentProps) {
  return (
    <header>
      <p className={styles.eyebrow}>
        <span aria-hidden="true">{chapter.index}</span>
        {chapter.label}
      </p>
      <h2 id={chapter.headingId}>{chapter.heading}</h2>
      <p className={styles.introduction}>{chapter.introduction}</p>
    </header>
  );
}

export function HelixChapterContent({ chapter }: HelixChapterContentProps) {
  if (chapter.chapter === "environment") {
    return (
      <div
        className={styles.content}
        data-motion="digital-workspace"
        data-testid="digital-workspace"
      >
        <ChapterHeader chapter={chapter} />
        <p className={styles.detail}>{chapter.detail}</p>
        <p className={styles.systemNote} aria-hidden="true">
          ENTRY LAYER / PATH ESTABLISHED
        </p>
      </div>
    );
  }

  if (chapter.chapter === "engineering") {
    return (
      <div className={styles.content} data-testid="engineering-content">
        <ChapterHeader chapter={chapter} />
        <ul className={styles.principles}>
          {chapter.principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (chapter.chapter === "projects") {
    return (
      <div className={`${styles.content} ${styles.projectsContent}`}>
        <ChapterHeader chapter={chapter} />
        <ProjectShowcase projects={chapter.projects} />
      </div>
    );
  }

  if (chapter.chapter === "experience") {
    return (
      <div className={`${styles.content} ${styles.experienceContent}`}>
        <ChapterHeader chapter={chapter} />
        <ExperienceTracks tracks={chapter.tracks} />
      </div>
    );
  }

  return (
    <div className={`${styles.content} ${styles.contactContent}`}>
      <ChapterHeader chapter={chapter} />
      <ContactRoutes
        closing={chapter.closing}
        direction={chapter.direction}
        directionLabel={chapter.directionLabel}
        routes={chapter.routes}
      />
    </div>
  );
}
