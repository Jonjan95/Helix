"use client";

import styles from "@/styles/lab/ArrivalDirector.module.css";

export function ArrivalDirector() {
  return (
    <main className={styles.director} data-arrival-director="">
      <header className={styles.header}>
        <p>ISOLATED TOOL / PR 32</p>
        <h1>Arrival Director</h1>
        <p>
          Define, compare, and export machine poses without changing the
          production Arrival sequence.
        </p>
      </header>
    </main>
  );
}
