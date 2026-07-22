import type { ContactRoute } from "@/data/contact";
import styles from "@/styles/HelixChapterContent.module.css";

type ContactRoutesProps = {
  closing: string;
  direction: string;
  directionLabel: string;
  routes: readonly ContactRoute[];
};

export function ContactRoutes({
  closing,
  direction,
  directionLabel,
  routes,
}: ContactRoutesProps) {
  return (
    <div className={styles.contactDestination}>
      <p className={styles.contactDirection}>
        <span>{directionLabel}</span>
        {direction}
      </p>

      <ul className={styles.contactRoutes} aria-label="Contact routes">
        {routes.map((route) => (
          <li
            key={route.id}
            data-contact-route={route.id}
            data-contact-type={route.type}
            data-contact-primary={route.primary}
          >
            <a href={route.href} aria-label={route.accessibleLabel}>
              <span className={styles.contactRouteLabel}>{route.label}</span>
              <span className={styles.contactRouteDescription}>
                {route.description}
              </span>
              <span className={styles.contactRouteAction}>
                {route.action}
                <span aria-hidden="true">{route.external ? "↗" : "→"}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className={styles.contactClosing}>{closing}</p>
    </div>
  );
}
