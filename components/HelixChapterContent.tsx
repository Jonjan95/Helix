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
      <div className={styles.content}>
        <ChapterHeader chapter={chapter} />
        <ul className={styles.experienceList}>
          {chapter.areas.map((area, index) => (
            <li key={area}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {area}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <ChapterHeader chapter={chapter} />
      <ul className={styles.contactList} aria-label="Contact options">
        {chapter.options.map((option) => (
          <li key={option.label}>
            {option.href ? (
              <a
                href={option.href}
                aria-label="View Jonjan95’s public GitHub profile"
              >
                <span>{option.label}</span>
                <small>{option.note}</small>
              </a>
            ) : (
              <div>
                <span>{option.label}</span>
                <small>{option.note}</small>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
