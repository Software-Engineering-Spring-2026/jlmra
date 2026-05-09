import React, { useState } from 'react';
import {
  type Course,
  type InstructorProfile,
  type PortfolioCard,
  type Project,
  type Role,
  roleMeta,
} from '../mockData';
import { Badge, PageHeader, Panel } from '../components/ui';

type DirectoryPageProps = {
  role: Role;
  courses: Course[];
  instructorProfile: InstructorProfile;
  portfolios: PortfolioCard[];
  projects: Project[];
};

type InstructorCard = {
  name: string;
  email: string;
  bio: string;
  education: string;
  courses: string[];
};

const getProjectInstructor = (project: Project, courses: Course[]) =>
  courses.find((course) => course.name === project.course || course.code === project.course)
    ?.instructor ?? 'Jana Hassan';

export function DirectoryPage({
  role,
  courses,
  instructorProfile,
  portfolios,
  projects,
}: DirectoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [portfolioMajor, setPortfolioMajor] = useState('All');
  const [projectSort, setProjectSort] = useState<'rating' | 'date'>('rating');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(portfolios[0]?.id ?? '');
  const [selectedInstructorName, setSelectedInstructorName] = useState(
    instructorProfile.name
  );
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(
    projects.filter((project) => project.featured).map((project) => project.id)
  );
  const [favoritePortfolioIds, setFavoritePortfolioIds] = useState<string[]>(
    portfolios.filter((portfolio) => portfolio.favorite).map((portfolio) => portfolio.id)
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const projectCourseOptions = ['All', ...Array.from(new Set(projects.map((project) => project.course)))];
  const portfolioMajorOptions = [
    'All',
    ...Array.from(new Set(portfolios.map((portfolio) => portfolio.major))),
  ];

  const instructors: InstructorCard[] = Array.from(
    new Set([instructorProfile.name, ...courses.map((course) => course.instructor)])
  ).map((name) => {
    const linkedCourses = courses
      .filter((course) => course.instructor === name || name === instructorProfile.name)
      .map((course) => `${course.code} · ${course.name}`);
    const emailSlug = name.toLowerCase().replace(/^dr\.\s*/, '').split(' ').join('.');

    return {
      name,
      email:
        name === instructorProfile.name
          ? instructorProfile.email
          : `${emailSlug}@guc.edu.eg`,
      bio:
        name === instructorProfile.name
          ? instructorProfile.bio
          : 'Course instructor profile with linked courses and review responsibilities.',
      education:
        name === instructorProfile.name
          ? instructorProfile.education
          : 'GUC course instructor',
      courses: linkedCourses.length > 0 ? linkedCourses : ['BP401 · Bachelor Project'],
    };
  });

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch = [instructor.name, instructor.email, instructor.courses.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesCourse =
      courseFilter === 'All' ||
      instructor.courses.some((course) => course.toLowerCase().includes(courseFilter.toLowerCase()));

    return matchesSearch && matchesCourse;
  });

  const filteredProjects = projects
    .filter((project) => {
      const instructor = getProjectInstructor(project, courses);
      const matchesSearch = [project.title, project.course, instructor, project.languages.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesCourse = courseFilter === 'All' || project.course === courseFilter;

      return matchesSearch && matchesCourse;
    })
    .sort((first, second) =>
      projectSort === 'rating'
        ? second.rating - first.rating
        : Date.parse(second.createdAt) - Date.parse(first.createdAt)
    );

  const filteredPortfolios = portfolios
    .filter((portfolio) => {
      const matchesSearch = [
        portfolio.name,
        portfolio.email,
        portfolio.major,
        portfolio.topSkills.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesMajor = portfolioMajor === 'All' || portfolio.major === portfolioMajor;

      return matchesSearch && matchesMajor;
    })
    .sort((first, second) => second.projectsCount - first.projectsCount);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0];
  const selectedPortfolio =
    portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ??
    filteredPortfolios[0];
  const selectedInstructor =
    instructors.find((instructor) => instructor.name === selectedInstructorName) ??
    filteredInstructors[0];
  const recommendedProjects = projects.filter(
    (project) => project.featured || project.rating >= 4.5
  );
  const favoriteProjects = projects.filter((project) =>
    favoriteProjectIds.includes(project.id)
  );
  const favoritePortfolios = portfolios.filter((portfolio) =>
    favoritePortfolioIds.includes(portfolio.id)
  );

  const toggleFavoriteProject = (projectId: string) => {
    setFavoriteProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  };

  const toggleFavoritePortfolio = (portfolioId: string) => {
    setFavoritePortfolioIds((current) =>
      current.includes(portfolioId)
        ? current.filter((id) => id !== portfolioId)
        : [...current, portfolioId]
    );
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={roleMeta[role].label}
        title="Directory"
        description="Search projects, portfolios, and instructors."
      />

      <Panel title="Search and filters" subtitle="Grouped controls">
        <div className="form-grid">
          <label className="full-span">
            Search
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Project title, student email, instructor, skill"
            />
          </label>
          <label>
            Course
            <select
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
            >
              {projectCourseOptions.map((course) => (
                <option key={course}>{course}</option>
              ))}
            </select>
          </label>
          <label>
            Project sort
            <select
              value={projectSort}
              onChange={(event) => setProjectSort(event.target.value as 'rating' | 'date')}
            >
              <option value="rating">Rating</option>
              <option value="date">Creation date</option>
            </select>
          </label>
          <label>
            Portfolio major
            <select
              value={portfolioMajor}
              onChange={(event) => setPortfolioMajor(event.target.value)}
            >
              {portfolioMajorOptions.map((major) => (
                <option key={major}>{major}</option>
              ))}
            </select>
          </label>
        </div>
      </Panel>

      <div className="content-grid content-grid-wide">
        <Panel title="Course instructors" subtitle="Search by name or course">
          <div className="stack-list">
            {filteredInstructors.map((instructor) => (
              <article key={instructor.email} className="list-card">
                <div className="list-card-head">
                  <div>
                    <strong>{instructor.name}</strong>
                    <span>{instructor.email}</span>
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setSelectedInstructorName(instructor.name)}
                  >
                    View Profile
                  </button>
                </div>
                <div className="tag-row">
                  {instructor.courses.slice(0, 3).map((course) => (
                    <Badge key={course}>{course}</Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Instructor profile" subtitle="Selected details">
          {selectedInstructor ? (
            <div className="simple-list">
              <div className="simple-list-item">
                <strong>{selectedInstructor.name}</strong>
                <span>{selectedInstructor.email}</span>
              </div>
              <div className="simple-list-item">
                <strong>Education</strong>
                <span>{selectedInstructor.education}</span>
              </div>
              <div className="simple-list-item">
                <strong>Biography</strong>
                <span>{selectedInstructor.bio}</span>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="content-grid content-grid-wide">
        <Panel title="Project results" subtitle="Search, filter, sort, view, favorite">
          <div className="stack-list">
            {filteredProjects.map((project) => (
              <article key={project.id} className="list-card">
                <div className="list-card-head">
                  <div>
                    <strong>{project.title}</strong>
                    <span>
                      {project.course} · {getProjectInstructor(project, courses)} ·{' '}
                      {project.createdAt}
                    </span>
                  </div>
                  <Badge tone="accent">{project.rating.toFixed(1)}/5</Badge>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    View Project
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => toggleFavoriteProject(project.id)}
                  >
                    {favoriteProjectIds.includes(project.id) ? '⭐ Saved' : '⭐ Favorite'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Selected project" subtitle="Project details">
          {selectedProject ? (
            <div className="simple-list">
              <div className="simple-list-item">
                <strong>{selectedProject.title}</strong>
                <span>
                  {selectedProject.course} · {selectedProject.visibility} ·{' '}
                  {selectedProject.status}
                </span>
              </div>
              <div className="simple-list-item">
                <strong>GitHub</strong>
                <span>{selectedProject.github}</span>
              </div>
              <div className="simple-list-item">
                <strong>Languages</strong>
                <span>{selectedProject.languages.join(', ')}</span>
              </div>
              <div className="simple-list-item">
                <strong>Demo video</strong>
                <span>{selectedProject.demoVideoUrl}</span>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="content-grid content-grid-wide">
        <Panel title="Portfolio results" subtitle="Search, filter, sort, view, favorite">
          <div className="stack-list">
            {filteredPortfolios.map((portfolio) => (
              <article key={portfolio.id} className="list-card">
                <div className="list-card-head">
                  <div>
                    <strong>{portfolio.name}</strong>
                    <span>
                      {portfolio.email} · {portfolio.major} · {portfolio.projectsCount}{' '}
                      projects
                    </span>
                  </div>
                  <Badge tone="success">{portfolio.rating.toFixed(1)}/5</Badge>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setSelectedPortfolioId(portfolio.id)}
                  >
                    View Portfolio
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => toggleFavoritePortfolio(portfolio.id)}
                  >
                    {favoritePortfolioIds.includes(portfolio.id)
                      ? '⭐ Saved'
                      : '⭐ Favorite'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Selected portfolio" subtitle="Portfolio details">
          {selectedPortfolio ? (
            <div className="simple-list">
              <div className="simple-list-item">
                <strong>{selectedPortfolio.name}</strong>
                <span>{selectedPortfolio.email}</span>
              </div>
              <div className="simple-list-item">
                <strong>Major</strong>
                <span>{selectedPortfolio.major}</span>
              </div>
              <div className="simple-list-item">
                <strong>Skills</strong>
                <span>{selectedPortfolio.topSkills.join(', ')}</span>
              </div>
              <div className="simple-list-item">
                <strong>Featured project</strong>
                <span>{selectedPortfolio.featuredProject}</span>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>

      <Panel title="Recommended projects" subtitle="High-rated and featured">
        <div className="simple-list">
          {recommendedProjects.map((project) => (
            <div key={project.id} className="simple-list-item">
              <strong>{project.title}</strong>
              <span>
                {project.course} · {project.rating.toFixed(1)}/5
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Favorites" subtitle="Saved projects and portfolios">
        <div className="content-grid">
          <div className="simple-list">
            {favoriteProjects.map((project) => (
              <div key={project.id} className="simple-list-item">
                <strong>⭐ {project.title}</strong>
                <span>{project.course}</span>
              </div>
            ))}
          </div>
          <div className="simple-list">
            {favoritePortfolios.map((portfolio) => (
              <div key={portfolio.id} className="simple-list-item">
                <strong>⭐ {portfolio.name}</strong>
                <span>{portfolio.major}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
