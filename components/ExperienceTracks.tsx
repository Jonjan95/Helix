import type { ExperienceTrack } from "@/data/experience";
import styles from "@/styles/HelixChapterContent.module.css";

type ExperienceTracksProps = {
  tracks: readonly ExperienceTrack[];
};

function ExperienceTrackArticle({ track }: { track: ExperienceTrack }) {
  const evidenceHeadingId = `${track.id}-evidence`;

  return (
    <article
      className={styles.experienceTrack}
      data-experience-track={track.id}
      data-experience-current={track.current ? "true" : "false"}
    >
      <header className={styles.experienceTrackHeader}>
        <p className={styles.experienceIdentity}>
          <span aria-hidden="true">{track.index}</span>
          <span data-experience-category={track.category}>{track.category}</span>
        </p>
        <p className={styles.experienceTimeframe}>{track.timeframe}</p>
      </header>

      <h3>{track.title}</h3>
      <p className={styles.experienceSummary}>{track.summary}</p>

      <section
        className={styles.experienceEvidence}
        aria-labelledby={evidenceHeadingId}
      >
        <h4 id={evidenceHeadingId}>Evidence in practice</h4>
        <ul>
          {track.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <ul
        className={styles.experienceEnvironments}
        aria-label={`${track.title} technologies and environments`}
      >
        {track.environments.map((environment) => (
          <li key={environment}>{environment}</li>
        ))}
      </ul>

      <p className={styles.experiencePerspective}>
        <span>What it contributes now</span>
        {track.perspective}
      </p>
    </article>
  );
}

export function ExperienceTracks({ tracks }: ExperienceTracksProps) {
  return (
    <div className={styles.experienceTracks} data-testid="experience-tracks">
      {tracks.map((track) => (
        <ExperienceTrackArticle key={track.id} track={track} />
      ))}
    </div>
  );
}
