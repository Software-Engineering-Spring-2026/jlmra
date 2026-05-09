import React, { useState } from 'react';
import {
  type Course,
  type InstructorProfile,
  type PortfolioCard,
  type Project,
  type Role,
  roleMeta,
} from '../mockData';
import { Icon } from '../components/icons';
import { Badge, PageHeader, Panel } from '../components/ui';

type DirectoryPageProps = {
  role: Role;
  courses: Course[];
  instructorProfile: InstructorProfile;
  portfolios: PortfolioCard[];
  projects: Project[];
};

type DirectoryTab = 'instructors' | 'projects' | 'portfolios' | 'recommended' | 'favorites';

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

const roleTabs: Record<Role, DirectoryTab[]> = {
  student: ['projects', 'portfolios', 'instructors', 'recommended', 'favorites'],
  employer: ['portfolios', 'projects', 'instructors', 'recommended', 'favorites'],
  instructor: ['projects', 'portfolios', 'instructors', 'recommended'],
  admin: ['projects', 'portfolios', 'instructors'],
};

const tabLabels: Record<DirectoryTab, string> = {
  instructors: 'Instructors',
  projects: 'Projects',
  portfolios: 'Portfolios',
  recommended: 'Recommended',
  favorites: 'Favorites',
};

const directoryTitles: Record<Role, { title: string; description: string }> = {
  student: {
    title: 'Explore',
    description: 'Find projects, student portfolios, instructors, and favorites.',
  },
  employer: {
    title: 'Talent',
    description: 'Find student portfolios, strong projects, and instructors.',
  },
  instructor: {
    title: 'Browse',
    description: 'Find projects, portfolios, and linked course instructors.',
  },
  admin: {
    title: 'Records',
    description: 'Search platform projects, student portfolios, and instructors.',
  },
};

export function DirectoryPage({
  role,
  courses,
  instructorProfile,
  portfolios,
  projects,
}: DirectoryPageProps) {
  const tabs = roleTabs[role];
  const [activeTab, setActiveTab] = useState<DirectoryTab>(tabs[0]);
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
  const projectCourseOptions = [
    'All',
    ...Array.from(new Set(projects.map((project) => project.course))),
  ];
  const portfolioMajorOptions = [
    'All',
    ...Array.from(new Set(portfolios.map((portfolio) => portfolio.major))),
  ];

  const instructors: InstructorCard[] = Array.from(
    new Set([instructorProfile.name, ...courses.map((course) => course.instructor)])
  ).map((name) => {
    const linkedCourses = courses
      .filter((course) => course.instructor === name || name === instructorProfile.name)
      .map((course) => `${course.code} - ${course.name}`);
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
      courses: linkedCourses.length > 0 ? linkedCourses : ['BP401 - Bachelor Project'],
    };
  });

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch = [instructor.name, instructor.email, instructor.courses.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesCourse =
      courseFilter === 'All' ||
      instructor.courses.some((course) =>
        course.toLowerCase().includes(courseFilter.toLowerCase())
      );

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
    <div className="page-stack directory-page">
      <PageHeader
        eyebrow={roleMeta[role].label}
        title={directoryTitles[role].title}
        description={directoryTitles[role].description}
      />

      <section className="directory-control-panel">
        <div className="directory-tabs" aria-label="Directory sections">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`directory-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="directory-filters">
          <label className="directory-search">
            Search
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, email, instructor, course, skill"
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
            Major
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
      </section>

      {activeTab === 'instructors' ? (
        <div className="directory-layout">
          <Panel title="Course instructors" subtitle="Search by name or course">
            <div className="stack-list">
              {filteredInstructors.map((instructor) => (
                <button
                  key={instructor.email}
                  type="button"
                  className={`directory-result ${
                    selectedInstructor?.name === instructor.name ? 'active' : ''
                  }`}
                  onClick={() => setSelectedInstructorName(instructor.name)}
                >
                  <strong>{instructor.name}</strong>
                  <span>{instructor.email}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Instructor details" subtitle="Linked courses and profile">
            {selectedInstructor ? (
              <div className="details-card">
                <strong>{selectedInstructor.name}</strong>
                <span>{selectedInstructor.email}</span>
                <p>{selectedInstructor.bio}</p>
                <div className="tag-row">
                  {selectedInstructor.courses.map((course) => (
                    <Badge key={course}>{course}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </Panel>
        </div>
      ) : null}

      {activeTab === 'projects' ? (
        <div className="directory-layout">
          <Panel title="Project results" subtitle="Search, filter, sort, and select">
            <div className="stack-list">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`directory-result ${
                    selectedProject?.id === project.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <strong>{project.title}</strong>
                  <span>
                    {project.course} - {getProjectInstructor(project, courses)} -{' '}
                    {project.rating.toFixed(1)}/5
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Project details" subtitle="Selected project">
            {selectedProject ? (
              <div className="details-card">
                <strong>{selectedProject.title}</strong>
                <span>
                  {selectedProject.course} - {selectedProject.visibility} -{' '}
                  {selectedProject.status}
                </span>
                <div className="simple-list">
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
                {role === 'student' || role === 'employer' ? (
                  <button
                    type="button"
                    className="ghost-button favorite-button"
                    onClick={() => toggleFavoriteProject(selectedProject.id)}
                  >
                    <Icon name="star" />
                    {favoriteProjectIds.includes(selectedProject.id)
                      ? 'Remove from favorites'
                      : 'Save to favorites'}
                  </button>
                ) : null}
              </div>
            ) : null}
          </Panel>
        </div>
      ) : null}

      {activeTab === 'portfolios' ? (
        <div className="directory-layout">
          <Panel title="Student portfolios" subtitle="Search by student, major, or skill">
            <div className="stack-list">
              {filteredPortfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  type="button"
                  className={`directory-result ${
                    selectedPortfolio?.id === portfolio.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedPortfolioId(portfolio.id)}
                >
                  <strong>{portfolio.name}</strong>
                  <span>
                    {portfolio.major} - {portfolio.projectsCount} projects -{' '}
                    {portfolio.rating.toFixed(1)}/5
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Portfolio details" subtitle="Selected student portfolio">
            {selectedPortfolio ? (
              <div className="details-card">
                <strong>{selectedPortfolio.name}</strong>
                <span>{selectedPortfolio.email}</span>
                <div className="simple-list">
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
                {role === 'student' || role === 'employer' ? (
                  <button
                    type="button"
                    className="ghost-button favorite-button"
                    onClick={() => toggleFavoritePortfolio(selectedPortfolio.id)}
                  >
                    <Icon name="star" />
                    {favoritePortfolioIds.includes(selectedPortfolio.id)
                      ? 'Remove from favorites'
                      : 'Save to favorites'}
                  </button>
                ) : null}
              </div>
            ) : null}
          </Panel>
        </div>
      ) : null}

      {activeTab === 'recommended' ? (
        <Panel title="Recommended projects" subtitle="High-rated and featured work">
          <div className="directory-card-grid">
            {recommendedProjects.map((project) => (
              <article key={project.id} className="directory-mini-card">
                <strong>{project.title}</strong>
                <span>
                  {project.course} - {project.rating.toFixed(1)}/5
                </span>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('projects');
                  }}
                >
                  View Project
                </button>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      {activeTab === 'favorites' ? (
        <div className="directory-layout">
          <Panel title="Favorite projects" subtitle="Saved project list">
            <div className="stack-list">
              {favoriteProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="directory-result"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('projects');
                  }}
                >
                  <strong>{project.title}</strong>
                  <span>{project.course}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Favorite portfolios" subtitle="Saved student portfolio list">
            <div className="stack-list">
              {favoritePortfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  type="button"
                  className="directory-result"
                  onClick={() => {
                    setSelectedPortfolioId(portfolio.id);
                    setActiveTab('portfolios');
                  }}
                >
                  <strong>{portfolio.name}</strong>
                  <span>{portfolio.major}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
