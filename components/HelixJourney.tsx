import { DigitalWorkspace } from "@/components/DigitalWorkspace";
import { HelixChapter } from "@/components/HelixChapter";
import { JourneyChapter } from "@/components/JourneyChapter";
import { engineeringChapter } from "@/data/helix-chapters";
import styles from "@/styles/HelixJourney.module.css";

export function HelixJourney() {
  return (
    <div
      className={styles.journey}
      data-helix-journey=""
      data-testid="helix-journey"
    >
      <JourneyChapter name="orientation" labelledBy="about-heading">
        <DigitalWorkspace />
      </JourneyChapter>

      <JourneyChapter
        name="engineering"
        labelledBy={engineeringChapter.headingId}
      >
        <HelixChapter activeNode="engineering" content={engineeringChapter} />
      </JourneyChapter>
    </div>
  );
}
