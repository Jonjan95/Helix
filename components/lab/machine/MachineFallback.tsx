import styles from "@/styles/lab/MachineLab.module.css";

type MachineFallbackProps = {
  reason?: "model" | "webgl";
};

export function MachineFallback({ reason = "webgl" }: MachineFallbackProps) {
  return (
    <section
      className={styles.fallback}
      data-machine-fallback=""
      data-fallback-reason={reason}
      aria-labelledby="machine-fallback-title"
    >
      <p className={styles.fallbackLabel}>STATIC FALLBACK</p>
      <h2 id="machine-fallback-title">Jonathan Jansson</h2>
      <p className={styles.fallbackDirection}>
        Software development / testing / quality
      </p>
      <p>
        The interactive 3D preview is unavailable. The concept remains a laptop
        opening into Jonathan&apos;s portfolio, with the identity kept as readable
        HTML rather than canvas content.
      </p>
      {/* The lab intentionally avoids production-route prefetching. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/">Return to the production portfolio</a>
    </section>
  );
}
