import React from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Internship,
  type Project,
  type StudentProfile,
} from '../mockData';
import { Badge, PageHeader, Panel, StatCard } from '../components/ui';
import { InboxPage } from './InboxPage';
import { NotificationsPage } from './NotificationsPage';
import { type Conversation, type NotificationItem } from '../mockData';

type StudentWorkspaceProps = {
  currentPage: WorkspacePage;
  studentProfile: StudentProfile;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  projects: Project[];
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
  applyToInternship: (internshipId: string) => void;
  toggleInternshipFavorite: (internshipId: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation;
  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;
  messageDraft: string;
  setMessageDraft: (value: string) => void;
  sendMessage: () => void;
  notifications: NotificationItem[];
  notificationsEnabled: boolean;
  onToggleNotificationsEnabled: () => void;
  onToggleNotificationRead: (notificationId: string) => void;
};

export function StudentWorkspace({
  currentPage,
  studentProfile,
  setStudentProfile,
  projects,
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
  applyToInternship,
  toggleInternshipFavorite,
  conversations,
  selectedConversation,
  selectedConversationId,
  setSelectedConversationId,
  messageDraft,
  setMessageDraft,
  sendMessage,
  notifications,
  notificationsEnabled,
  onToggleNotificationsEnabled,
  onToggleNotificationRead,
}: StudentWorkspaceProps) {
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
        </div>
      );
    case 'profile':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student profile"
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
              <label className="full-span">
                Cover letter
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                />
              </label>
            </div>
          </Panel>
          <div className="stack-list">
            {internships.map((internship) => (
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
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          messageDraft={messageDraft}
          setMessageDraft={setMessageDraft}
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
