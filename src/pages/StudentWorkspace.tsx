import React, { useMemo, useState } from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Conversation,
  type Internship,
  type NotificationItem,
  type PortfolioCard,
  type Project,
  type Role,
  type StudentProfile,
} from '../mockData';
import { Badge, PageHeader, Panel, StatCard } from '../components/ui';
import { DiscoveryHub } from '../components/DiscoveryHub';
import { InboxPage } from './InboxPage';
import { NotificationsPage } from './NotificationsPage';

type StudentWorkspaceProps = {
  currentPage: WorkspacePage;
  role: Role;
  studentProfile: StudentProfile;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  projects: Project[];
  portfolios: PortfolioCard[];
  favoriteProjectIds: string[];
  favoritePortfolioIds: string[];
  onToggleProjectFavorite: (projectId: string) => void;
  onTogglePortfolioFavorite: (portfolioId: string) => void;
  featuredProject: Project;
  internships: Internship[];
  internshipQuery: string;
  setInternshipQuery: (value: string) => void;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  setCurrentPage: (page: WorkspacePage) => void;
  toggleProjectVisibility: (projectId: string) => void;
  setFeaturedProjectById: (projectId: string) => void;
  saveStudentProfile: () => void;
  addTaskToProject: (projectId: string) => void;
  taskDrafts: Record<string, string>;
  setTaskDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  applyToInternship: (internshipId: string) => void;
  toggleInternshipFavorite: (internshipId: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messageDraft: string;
  setMessageDraft: (value: string) => void;
  onOpenConversation: (id: string) => void;
  onBackToConversationList: () => void;
  sendMessage: () => void;
  notifications: NotificationItem[];
  notificationsEnabled: boolean;
  onToggleNotificationsEnabled: () => void;
  onToggleNotificationRead: (notificationId: string) => void;
};

export function StudentWorkspace({
  currentPage,
  role,
  studentProfile,
  setStudentProfile,
  projects,
  portfolios,
  favoriteProjectIds,
  favoritePortfolioIds,
  onToggleProjectFavorite,
  onTogglePortfolioFavorite,
  featuredProject,
  internships,
  internshipQuery,
  setInternshipQuery,
  coverLetter,
  setCoverLetter,
  setCurrentPage,
  toggleProjectVisibility,
  setFeaturedProjectById,
  saveStudentProfile,
  addTaskToProject,
  taskDrafts,
  setTaskDrafts,
  applyToInternship,
  toggleInternshipFavorite,
  conversations,
  selectedConversation,
  messageDraft,
  setMessageDraft,
  onOpenConversation,
  onBackToConversationList,
  sendMessage,
  notifications,
  notificationsEnabled,
  onToggleNotificationsEnabled,
  onToggleNotificationRead,
}: StudentWorkspaceProps) {
  const [companyFilter, setCompanyFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [internshipSort, setInternshipSort] = useState<'newest' | 'oldest'>('newest');
  const languageBreakdown = useMemo(() => {
    const total = projects.flatMap((project) => project.languages).length || 1;
    const counts = projects
      .flatMap((project) => project.languages)
      .reduce<Record<string, number>>((accumulator, language) => {
        accumulator[language] = (accumulator[language] ?? 0) + 1;
        return accumulator;
      }, {});

    return Object.entries(counts).map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
    }));
  }, [projects]);
  const topCollaborators = useMemo(() => {
    const counts = projects.flatMap((project) => project.collaborators).reduce<Record<string, number>>(
      (accumulator, collaborator) => {
        accumulator[collaborator] = (accumulator[collaborator] ?? 0) + 1;
        return accumulator;
      },
      {}
    );

    return Object.entries(counts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 3);
  }, [projects]);
  const filteredInternships = useMemo(() => {
    const items = internships.filter((internship) => {
      const matchesCompany =
        companyFilter === 'All' || internship.companyName === companyFilter;
      const matchesDuration =
        durationFilter === 'All' || internship.duration === durationFilter;

      return matchesCompany && matchesDuration;
    });

    return [...items].sort((left, right) =>
      internshipSort === 'newest'
        ? Date.parse(right.postedOn) - Date.parse(left.postedOn)
        : Date.parse(left.postedOn) - Date.parse(right.postedOn)
    );
  }, [companyFilter, durationFilter, internshipSort, internships]);
  const internshipCompanies = ['All', ...Array.from(new Set(internships.map((item) => item.companyName)))];
  const internshipDurations = ['All', ...Array.from(new Set(internships.map((item) => item.duration)))];

  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student dashboard"
            title={`Welcome back, ${studentProfile.name.split(' ')[0]}`}
            description="This version starts with only the most useful student information instead of showing everything at once."
            action={
              <button
                type="button"
                className="primary-button"
                onClick={() => setCurrentPage('projects')}
              >
                Open Projects
              </button>
            }
          />
          <div className="stats-grid">
            <StatCard
              label="Portfolio visibility"
              value={studentProfile.portfolioVisibility}
              helper="Your public profile can still be switched to private from the profile page."
            />
            <StatCard
              label="Active projects"
              value={String(projects.length)}
              helper="Projects now live on their own page with tasks and feedback kept separate."
            />
            <StatCard
              label="Applications sent"
              value={String(
                internships.filter(
                  (internship) => internship.applicationStatus !== 'Not Applied'
                ).length
              )}
              helper="Application statuses are easier to track from the internships page."
            />
          </div>
          <div className="content-grid">
            <Panel
              title="Featured project"
              subtitle={`${featuredProject.course} · ${featuredProject.status}`}
            >
              <p>{featuredProject.summary}</p>
              <div className="tag-row">
                <Badge tone="success">{featuredProject.visibility}</Badge>
                <Badge tone="accent">{featuredProject.rating.toFixed(1)}/5</Badge>
              </div>
              <div className="simple-list">
                {featuredProject.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="simple-list-item">
                    <strong>{task.title}</strong>
                    <span>
                      {task.owner} · {task.state}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Current hiring pipeline" subtitle="A lighter summary before the full internship page">
              <div className="simple-list">
                {internships
                  .filter((internship) => internship.applicationStatus !== 'Not Applied')
                  .map((internship) => (
                    <div key={internship.id} className="simple-list-item">
                      <strong>{internship.title}</strong>
                      <span>
                        {internship.companyName} · {internship.applicationStatus}
                      </span>
                    </div>
                  ))}
              </div>
            </Panel>
          </div>
          <div className="content-grid">
            <Panel title="Project statistics" subtitle="Total projects and language usage across the portfolio">
              <div className="simple-list">
                <div className="simple-list-item">
                  <strong>Total projects</strong>
                  <span>{projects.length}</span>
                </div>
                {languageBreakdown.map((item) => (
                  <div key={item.language} className="simple-list-item">
                    <strong>{item.language}</strong>
                    <span>{item.percentage}% of overall project stack usage</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Top collaborators and completed internships" subtitle="Student-level portfolio insights">
              <div className="simple-list">
                {topCollaborators.map(([name, count]) => (
                  <div key={name} className="simple-list-item">
                    <strong>{name}</strong>
                    <span>{count} shared project(s)</span>
                  </div>
                ))}
                {internships
                  .filter((internship) => internship.applicationStatus === 'Completed')
                  .map((internship) => (
                    <div key={internship.id} className="simple-list-item">
                      <strong>{internship.title}</strong>
                      <span>Completed with {internship.companyName}</span>
                    </div>
                  ))}
              </div>
            </Panel>
          </div>
          <DiscoveryHub
            role={role}
            projects={projects}
            portfolios={portfolios}
            favoriteProjectIds={favoriteProjectIds}
            favoritePortfolioIds={favoritePortfolioIds}
            onToggleProjectFavorite={onToggleProjectFavorite}
            onTogglePortfolioFavorite={onTogglePortfolioFavorite}
          />
        </div>
      );
    case 'portfolio':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student portfolio"
            title={studentProfile.name}
            description="This page now focuses only on the student identity, public portfolio basics, and featured work."
            action={
              <button type="button" className="primary-button" onClick={saveStudentProfile}>
                Save Changes
              </button>
            }
          />
          <div className="content-grid">
            <Panel title="Basic information" subtitle="Profile details shown on the student portfolio">
              <div className="form-grid">
                <label>
                  Full name
                  <input
                    value={studentProfile.name}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Major
                  <input
                    value={studentProfile.major}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        major: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Graduation
                  <input
                    value={studentProfile.graduation}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        graduation: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  LinkedIn
                  <input
                    value={studentProfile.linkedin}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        linkedin: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="full-span">
                  Bio
                  <textarea
                    rows={4}
                    value={studentProfile.bio}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        bio: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </Panel>
            <Panel title="Portfolio controls" subtitle="Visibility and featured project">
              <div className="control-stack">
                <div className="control-row">
                  <div>
                    <strong>Portfolio visibility</strong>
                    <span>Public profiles can be discovered by employers and instructors.</span>
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() =>
                      setStudentProfile((current) => ({
                        ...current,
                        portfolioVisibility:
                          current.portfolioVisibility === 'Public' ? 'Private' : 'Public',
                      }))
                    }
                  >
                    Switch to{' '}
                    {studentProfile.portfolioVisibility === 'Public'
                      ? 'Private'
                      : 'Public'}
                  </button>
                </div>
                <div className="simple-list">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      className={`list-button ${project.featured ? 'active' : ''}`}
                      onClick={() => setFeaturedProjectById(project.id)}
                    >
                      <div>
                        <strong>{project.title}</strong>
                        <span>
                          {project.visibility} · {project.status}
                        </span>
                      </div>
                      {project.featured ? <Badge tone="accent">Featured</Badge> : null}
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'projects':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student projects"
            title="Project library"
            description="Projects now have their own page, so tasks, visibility, and feedback are grouped by project instead of mixed with everything else."
          />
          <div className="stack-list">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="list-card-head">
                  <div>
                    <h3>{project.title}</h3>
                    <span>
                      {project.course} · {project.createdAt}
                    </span>
                  </div>
                  <div className="tag-row">
                    <Badge tone="success">{project.visibility}</Badge>
                    <Badge tone="accent">{project.status}</Badge>
                  </div>
                </div>
                <p>{project.summary}</p>
                <div className="button-row">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => toggleProjectVisibility(project.id)}
                  >
                    Toggle Visibility
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setFeaturedProjectById(project.id)}
                  >
                    Make Featured
                  </button>
                </div>
                <div className="content-grid">
                  <Panel title="Tasks" subtitle="Ordered list for the project owner">
                    <div className="simple-list">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="simple-list-item">
                          <strong>{task.title}</strong>
                          <span>
                            {task.owner} · {task.state}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="task-composer">
                      <input
                        value={taskDrafts[project.id] ?? ''}
                        onChange={(event) =>
                          setTaskDrafts((current) => ({
                            ...current,
                            [project.id]: event.target.value,
                          }))
                        }
                        placeholder="Add a new task"
                      />
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => addTaskToProject(project.id)}
                      >
                        Add Task
                      </button>
                    </div>
                  </Panel>
                  <Panel title="Feedback" subtitle="Instructor comments for this project">
                    <div className="simple-list">
                      {project.feedback.map((feedback) => (
                        <div key={feedback.id} className="simple-list-item">
                          <strong>{feedback.author}</strong>
                          <span>{feedback.message}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    case 'internships':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student internships"
            title="Search and apply"
            description="The internship experience is now isolated to one page with a simple search bar, cover letter area, and action buttons."
          />
          <Panel title="Search internships" subtitle="Filter by title, company, location, or duration">
            <div className="form-grid">
              <label>
                Search
                <input
                  value={internshipQuery}
                  onChange={(event) => setInternshipQuery(event.target.value)}
                  placeholder="Frontend, Cairo, Hybrid, 8 weeks"
                />
              </label>
              <label>
                Company
                <select
                  value={companyFilter}
                  onChange={(event) => setCompanyFilter(event.target.value)}
                >
                  {internshipCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Duration
                <select
                  value={durationFilter}
                  onChange={(event) => setDurationFilter(event.target.value)}
                >
                  {internshipDurations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-span">
                Cover letter
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                />
              </label>
            </div>
            <div className="button-row top-space">
              <button
                type="button"
                className={`ghost-button ${internshipSort === 'newest' ? 'active' : ''}`}
                onClick={() => setInternshipSort('newest')}
              >
                Newest first
              </button>
              <button
                type="button"
                className={`ghost-button ${internshipSort === 'oldest' ? 'active' : ''}`}
                onClick={() => setInternshipSort('oldest')}
              >
                Oldest first
              </button>
            </div>
          </Panel>
          <div className="stack-list">
            {filteredInternships.map((internship) => (
              <article key={internship.id} className="project-card">
                <div className="list-card-head">
                  <div>
                    <h3>{internship.title}</h3>
                    <span>
                      {internship.companyName} · {internship.location} · {internship.duration}
                    </span>
                  </div>
                  <Badge
                    tone={
                      internship.applicationStatus === 'Accepted' ||
                      internship.applicationStatus === 'Completed'
                        ? 'success'
                        : internship.applicationStatus === 'Rejected'
                        ? 'warn'
                        : 'accent'
                    }
                  >
                    {internship.applicationStatus}
                  </Badge>
                </div>
                <p>{internship.description}</p>
                <div className="tag-row">
                  {internship.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => applyToInternship(internship.id)}
                    disabled={internship.applicationStatus !== 'Not Applied'}
                  >
                    {internship.applicationStatus === 'Not Applied'
                      ? 'Apply'
                      : 'Already Applied'}
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => toggleInternshipFavorite(internship.id)}
                  >
                    {internship.favorite ? 'Remove Favorite' : 'Save Favorite'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    case 'inbox':
      return (
        <InboxPage
          role="student"
          conversations={conversations}
          selectedConversation={selectedConversation}
          messageDraft={messageDraft}
          setMessageDraft={setMessageDraft}
          onOpenConversation={onOpenConversation}
          onBackToConversationList={onBackToConversationList}
          onSendMessage={sendMessage}
        />
      );
    case 'notifications':
      return (
        <NotificationsPage
          role="student"
          notifications={notifications}
          enabled={notificationsEnabled}
          onToggleEnabled={onToggleNotificationsEnabled}
          onToggleRead={onToggleNotificationRead}
        />
      );
    default:
      return null;
  }
}
