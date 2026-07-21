import { HelixChapter } from "@/components/HelixChapter";
import { HelixPath } from "@/components/HelixPath";
import { JourneyChapter } from "@/components/JourneyChapter";
import { helixChapters } from "@/data/helix-chapters";
import styles from "@/styles/HelixJourney.module.css";

export function HelixJourney() {
  return (
    <div
      className={styles.journey}
      data-active-chapter="static"
      data-helix-journey=""
      data-journey-phase="static"
      data-testid="helix-journey"
    >
      <div className={styles.entryMarker} aria-hidden="true">
        <span>WORKSPACE / JOURNEY 01–05</span>
        <span>NATIVE SCROLL / PATH ACTIVE</span>
      </div>

      <HelixPath />

      {helixChapters.map((chapter) => (
        <JourneyChapter
          key={chapter.chapter}
          name={chapter.narrativeChapter}
          labelledBy={chapter.headingId}
        >
          <HelixChapter chapter={chapter} />
        </JourneyChapter>
      ))}

      <div
        className={styles.continuation}
        data-motion="journey-continuation"
        data-path-continuation=""
        data-testid="journey-continuation"
        aria-hidden="true"
      >
        <span />
        <p>PATH CONTINUES / OPEN DIRECTION</p>
      </div>
    </div>
  );
}
