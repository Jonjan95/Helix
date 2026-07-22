import type { PortfolioProject } from "@/data/projects";
import styles from "@/styles/HelixChapterContent.module.css";

type ProjectShowcaseProps = {
  projects: readonly PortfolioProject[];
};

function ProjectArticle({
  index,
  project,
}: {
  index: number;
  project: PortfolioProject;
}) {
  const projectNumber = String(index + 1).padStart(2, "0");

  return (
    <article
      className={styles.project}
      data-project={project.id}
      data-project-featured={project.featured ? "true" : "false"}
    >
      <header className={styles.projectHeader}>
        <p className={styles.projectIdentity}>
          <span aria-hidden="true">{projectNumber}</span>
          {project.role}
        </p>
        <p className={styles.projectStatus}>{project.status}</p>
      </header>

      <h3>{project.name}</h3>
      <p className={styles.projectSummary}>{project.summary}</p>

      <div className={styles.projectNarrative}>
        <section aria-labelledby={`${project.id}-problem`}>
          <h4 id={`${project.id}-problem`}>Problem</h4>
          <p>{project.problem}</p>
        </section>
        <section aria-labelledby={`${project.id}-approach`}>
          <h4 id={`${project.id}-approach`}>Approach</h4>
          <p>{project.approach}</p>
        </section>
      </div>

      <div className={styles.projectEvidence}>
        <section aria-labelledby={`${project.id}-technical`}>
          <h4 id={`${project.id}-technical`}>Technical evidence</h4>
          <ul>
            {project.technicalHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby={`${project.id}-quality`}>
          <h4 id={`${project.id}-quality`}>Quality evidence</h4>
          <ul>
            {project.qualityHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      </div>

      <ul className={styles.technologyList} aria-label={`${project.name} technologies`}>
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>

      <p className={styles.projectBoundary}>
        <span>Current boundary</span>
        {project.boundary}
      </p>

      <a
        className={styles.repositoryLink}
        href={project.repository.url}
        aria-label={project.repository.accessibleLabel}
      >
        {project.repository.label}
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const featuredProject = projects.find((project) => project.featured);
  const supportingProjects = projects.filter((project) => !project.featured);

  if (!featuredProject) {
    return null;
  }

  return (
    <div className={styles.projectShowcase} data-testid="project-showcase">
      <ProjectArticle project={featuredProject} index={projects.indexOf(featuredProject)} />
      <div className={styles.supportingProjects}>
        {supportingProjects.map((project) => (
          <ProjectArticle
            key={project.id}
            project={project}
            index={projects.indexOf(project)}
          />
        ))}
      </div>
    </div>
  );
}
