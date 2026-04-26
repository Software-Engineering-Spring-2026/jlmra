import React, { useMemo, useState } from 'react';
import { Badge, Panel } from './ui';
import { type PortfolioCard, type Project, type Role } from '../mockData';

type DiscoveryHubProps = {
  role: Role;
  projects: Project[];
  portfolios: PortfolioCard[];
  favoriteProjectIds?: string[];
  favoritePortfolioIds?: string[];
  onToggleProjectFavorite?: (projectId: string) => void;
  onTogglePortfolioFavorite?: (portfolioId: string) => void;
};

type InstructorDirectoryItem = {
  id: string;
  name: string;
  email: string;
  education: string;
  interests: string[];
  courses: string[];
  bio: string;
};

const instructorDirectory: InstructorDirectoryItem[] = [
  {
    id: 'instructor-directory-1',
    name: 'Dr. Maya El-Adl',
    email: 'maya.eladl@guc.edu.eg',
    education: 'PhD in Human Computer Interaction',
    interests: ['HCI', 'Product Thinking', 'Critique Frameworks'],
    courses: ['Bachelor Project', 'CSEN 704'],
    bio: 'Guides student product teams through critiques, portfolio positioning, and interface clarity.',
  },
  {
    id: 'instructor-directory-2',
    name: 'Dr. Salma Nabil',
    email: 'salma.nabil@guc.edu.eg',
    education: 'PhD in Software Architecture',
    interests: ['Frontend Engineering', 'Architecture', 'Design Systems'],
    courses: ['CSEN 703', 'CSEN 801'],
    bio: 'Focuses on turning strong prototypes into maintainable engineering systems.',
  },
  {
    id: 'instructor-directory-3',
    name: 'Dr. Hany Shaker',
    email: 'hany.shaker@guc.edu.eg',
    education: 'PhD in Product Discovery',
    interests: ['Research', 'User Journeys', 'Product Discovery'],
    courses: ['CSEN 702', 'MGMT 401'],
    bio: 'Helps teams structure research-backed project narratives and benchmark competitors.',
  },
];

export function DiscoveryHub({
  role,
  projects,
  portfolios,
  favoriteProjectIds = [],
  favoritePortfolioIds = [],
  onToggleProjectFavorite,
  onTogglePortfolioFavorite,
}: DiscoveryHubProps) {
  const [instructorQuery, setInstructorQuery] = useState('');
  const [projectQuery, setProjectQuery] = useState('');
  const [projectCourseFilter, setProjectCourseFilter] = useState('All');
  const [projectSort, setProjectSort] = useState<'rating' | 'createdAt'>('rating');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '');
  const [portfolioQuery, setPortfolioQuery] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [portfolioSort, setPortfolioSort] = useState<'projects' | 'rating'>('projects');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(
    portfolios[0]?.id ?? ''
  );

  const filteredInstructors = instructorDirectory.filter((instructor) =>
    [instructor.name, instructor.email, instructor.courses.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(instructorQuery.trim().toLowerCase())
  );

  const filteredProjects = useMemo(() => {
    const items = projects.filter((project) => {
      const matchesQuery = project.title
        .toLowerCase()
        .includes(projectQuery.trim().toLowerCase());
      const matchesCourse =
        projectCourseFilter === 'All' || project.course === projectCourseFilter;

      return matchesQuery && matchesCourse;
    });

    return [...items].sort((left, right) => {
      if (projectSort === 'rating') {
        return right.rating - left.rating;
      }

      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    });
  }, [projectCourseFilter, projectQuery, projectSort, projects]);

  const filteredPortfolios = useMemo(() => {
    const items = portfolios.filter((portfolio) => {
      const matchesQuery = [portfolio.name, portfolio.email]
        .join(' ')
        .toLowerCase()
        .includes(portfolioQuery.trim().toLowerCase());
      const matchesFilter =
        portfolioFilter === 'All' ||
        portfolio.major === portfolioFilter ||
        portfolio.topSkills.some((skill) => skill === portfolioFilter);

      return matchesQuery && matchesFilter;
    });

    return [...items].sort((left, right) => {
      if (portfolioSort === 'projects') {
        return right.projectsCount - left.projectsCount;
      }

      return right.rating - left.rating;
    });
  }, [portfolioFilter, portfolioQuery, portfolioSort, portfolios]);

  const selectedProject =
    filteredProjects.find((project) => project.id === selectedProjectId) ??
    filteredProjects[0] ??
    null;
  const selectedPortfolio =
    filteredPortfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ??
    filteredPortfolios[0] ??
    null;
  const recommendedProjects = [...projects]
    .filter((project) => project.visibility === 'Public')
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 3);
  const canFavorite = role === 'student' || role === 'employer';
  const uniqueProjectCourses = [
    'All',
    ...Array.from(new Set(projects.map((project) => project.course))),
  ];
  const uniquePortfolioFilters = [
    'All',
    ...Array.from(
      new Set(
        portfolios.flatMap((portfolio) => [portfolio.major, ...portfolio.topSkills])
      )
    ),
  ];

  return (
    <div className="page-stack">
      <div className="content-grid content-grid-wide">
        <Panel
          title="Course instructors"
          subtitle="Search by name, course, or email and open the full profile card"
        >
          <div className="form-grid">
            <label className="full-span">
              Search
              <input
                value={instructorQuery}
                onChange={(event) => setInstructorQuery(event.target.value)}
                placeholder="Search by first name, last name, email, or course"
              />
            </label>
          </div>
          <div className="stack-list top-space">
            {filteredInstructors.map((instructor) => (
              <article key={instructor.id} className="list-card">
                <div className="list-card-head">
                  <div>
                    <strong>{instructor.name}</strong>
                    <span>{instructor.email}</span>
                  </div>
                  <Badge tone="accent">{instructor.courses.length} courses</Badge>
                </div>
                <p>{instructor.bio}</p>
                <div className="tag-row">
                  {instructor.courses.map((course) => (
                    <Badge key={course} tone="neutral">
                      {course}
                    </Badge>
                  ))}
                </div>
                <div className="simple-list top-space">
                  <div className="simple-list-item">
                    <strong>Education</strong>
                    <span>{instructor.education}</span>
                  </div>
                  <div className="simple-list-item">
                    <strong>Research interests</strong>
                    <span>{instructor.interests.join(', ')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Recommended projects"
          subtitle="Public work surfaced for quick exploration and PM walkthroughs"
        >
          <div className="stack-list">
            {recommendedProjects.map((project) => (
              <article key={project.id} className="list-card">
                <div className="list-card-head">
                  <div>
                    <strong>{project.title}</strong>
                    <span>
                      {project.course} · {project.createdAt}
                    </span>
                  </div>
                  <Badge tone="accent">{project.rating.toFixed(1)}/5</Badge>
                </div>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <div className="content-grid content-grid-wide">
        <Panel
          title="Project discovery"
          subtitle="Search, filter, sort, and select public project entries"
        >
          <div className="form-grid">
            <label>
              Project title
              <input
                value={projectQuery}
                onChange={(event) => setProjectQuery(event.target.value)}
                placeholder="Search project title"
              />
            </label>
            <label>
              Course
              <select
                value={projectCourseFilter}
                onChange={(event) => setProjectCourseFilter(event.target.value)}
              >
                {uniqueProjectCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="button-row top-space">
            <button
              type="button"
              className={`ghost-button ${projectSort === 'rating' ? 'active' : ''}`}
              onClick={() => setProjectSort('rating')}
            >
              Sort by rating
            </button>
            <button
              type="button"
              className={`ghost-button ${projectSort === 'createdAt' ? 'active' : ''}`}
              onClick={() => setProjectSort('createdAt')}
            >
              Sort by creation date
            </button>
          </div>
          <div className="stack-list top-space">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`list-button ${selectedProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProjectId(project.id)}
              >
                <div>
                  <strong>{project.title}</strong>
                  <span>
                    {project.course} · {project.createdAt}
                  </span>
                </div>
                <Badge tone="accent">{project.rating.toFixed(1)}</Badge>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          title={selectedProject ? selectedProject.title : 'Project details'}
          subtitle="Selected project details"
        >
          {selectedProject ? (
            <div className="stack-list">
              <div className="simple-list">
                <div className="simple-list-item">
                  <strong>Course</strong>
                  <span>{selectedProject.course}</span>
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
                  <strong>Demo</strong>
                  <span>{selectedProject.demo}</span>
                </div>
              </div>
              <p>{selectedProject.summary}</p>
              <div className="tag-row">
                <Badge tone="success">{selectedProject.visibility}</Badge>
                <Badge tone="accent">{selectedProject.rating.toFixed(1)}/5</Badge>
              </div>
              {canFavorite && onToggleProjectFavorite ? (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => onToggleProjectFavorite(selectedProject.id)}
                >
                  {favoriteProjectIds.includes(selectedProject.id)
                    ? 'Remove from favorites'
                    : 'Save to favorites'}
                </button>
              ) : null}
            </div>
          ) : (
            <p className="subtle-copy">No projects matched this filter.</p>
          )}
        </Panel>
      </div>

      <div className="content-grid content-grid-wide">
        <Panel
          title="Portfolio discovery"
          subtitle="Search by student name/email and filter by major or skills"
        >
          <div className="form-grid">
            <label>
              Portfolio search
              <input
                value={portfolioQuery}
                onChange={(event) => setPortfolioQuery(event.target.value)}
                placeholder="Search by student name or email"
              />
            </label>
            <label>
              Major or skill
              <select
                value={portfolioFilter}
                onChange={(event) => setPortfolioFilter(event.target.value)}
              >
                {uniquePortfolioFilters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="button-row top-space">
            <button
              type="button"
              className={`ghost-button ${portfolioSort === 'projects' ? 'active' : ''}`}
              onClick={() => setPortfolioSort('projects')}
            >
              Sort by project count
            </button>
            <button
              type="button"
              className={`ghost-button ${portfolioSort === 'rating' ? 'active' : ''}`}
              onClick={() => setPortfolioSort('rating')}
            >
              Sort by rating
            </button>
          </div>
          <div className="stack-list top-space">
            {filteredPortfolios.map((portfolio) => (
              <button
                key={portfolio.id}
                type="button"
                className={`list-button ${
                  selectedPortfolio?.id === portfolio.id ? 'active' : ''
                }`}
                onClick={() => setSelectedPortfolioId(portfolio.id)}
              >
                <div>
                  <strong>{portfolio.name}</strong>
                  <span>
                    {portfolio.major} · {portfolio.projectsCount} projects
                  </span>
                </div>
                <Badge tone="accent">{portfolio.rating.toFixed(1)}</Badge>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          title={selectedPortfolio ? selectedPortfolio.name : 'Portfolio details'}
          subtitle="Selected portfolio details"
        >
          {selectedPortfolio ? (
            <div className="stack-list">
              <div className="simple-list">
                <div className="simple-list-item">
                  <strong>Email</strong>
                  <span>{selectedPortfolio.email}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Featured project</strong>
                  <span>{selectedPortfolio.featuredProject}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Top skills</strong>
                  <span>{selectedPortfolio.topSkills.join(', ')}</span>
                </div>
              </div>
              <div className="tag-row">
                <Badge tone="success">{selectedPortfolio.projectsCount} projects</Badge>
                <Badge tone="accent">{selectedPortfolio.rating.toFixed(1)}/5</Badge>
              </div>
              {canFavorite && onTogglePortfolioFavorite ? (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => onTogglePortfolioFavorite(selectedPortfolio.id)}
                >
                  {favoritePortfolioIds.includes(selectedPortfolio.id)
                    ? 'Remove from favorites'
                    : 'Save to favorites'}
                </button>
              ) : null}
            </div>
          ) : (
            <p className="subtle-copy">No portfolios matched this filter.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
