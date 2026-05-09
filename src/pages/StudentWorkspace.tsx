import React from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Conversation,
  type Internship,
  type NotificationItem,
  type Project,
  type StudentProfile,
} from '../mockData';
import { Badge, PageHeader, Panel, StatCard } from '../components/ui';
import { InboxPage } from './InboxPage';
import { NotificationsPage } from './NotificationsPage';

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
  addTaskToProject: (projectId: string) => void;
  createStudentProject: () => void;
  updateProjectTitle: (projectId: string, title: string) => void;
  deleteProject: (projectId: string) => void;
  markProjectFinalDraft: (projectId: string) => void;
  updateInvitationStatus: (
    projectId: string,
    invitationId: string,
    status: Project['invitations'][number]['status']
  ) => void;
  removeCollaborator: (projectId: string, collaborator: string) => void;
  moveTaskToTop: (projectId: string, taskId: string) => void;
  uploadThesisDraft: () => void;
  setFinalThesisDraft: (draftId: string) => void;
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
  addTaskToProject,
  createStudentProject,
  updateProjectTitle,
  deleteProject,
  markProjectFinalDraft,
  updateInvitationStatus,
  removeCollaborator,
  moveTaskToTop,
  uploadThesisDraft,
  setFinalThesisDraft,
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
  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student dashboard"
            title={`Welcome back, ${studentProfile.name.split(' ')[0]}`}
            description="Projects, internships, and alerts."
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
              helper="Projects, tasks, and feedback are grouped clearly."
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
            <Panel title="Current hiring pipeline" subtitle="Active applications">
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
    case 'portfolio':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student portfolio"
            title={studentProfile.name}
            description="Public profile and featured work."
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
            description="Projects, tasks, invitations, and feedback."
            action={
              <button type="button" className="primary-button" onClick={createStudentProject}>
                Create Project
              </button>
            }
          />
          <Panel
            title="Bachelor thesis drafts"
            subtitle="Only the final draft is public"
            action={
              <button type="button" className="ghost-button" onClick={uploadThesisDraft}>
                Upload Draft
              </button>
            }
          >
            <div className="simple-list">
              {studentProfile.thesisDrafts.map((draft) => (
                <div key={draft.id} className="simple-list-item">
                  <strong>{draft.title}</strong>
                  <span>
                    {draft.uploadedAt} · {draft.isFinal ? 'Final public draft' : 'Private draft'}
                  </span>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setFinalThesisDraft(draft.id)}
                  >
                    Set Final Draft
                  </button>
                </div>
              ))}
              {studentProfile.thesisDrafts.length === 0 ? (
                <div className="simple-list-item">
                  <strong>No thesis drafts yet</strong>
                  <span>Upload is required for Bachelor Project.</span>
                </div>
              ) : null}
            </div>
          </Panel>
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
                <div className="form-grid">
                  <label className="full-span">
                    Project title
                    <input
                      value={project.title}
                      onChange={(event) =>
                        updateProjectTitle(project.id, event.target.value)
                      }
                    />
                  </label>
                </div>
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
                  {project.course === 'Bachelor Project' ? (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => markProjectFinalDraft(project.id)}
                    >
                      Set Final Draft
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="ghost-button danger"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="content-grid">
                  <Panel title="Project details" subtitle="Course, links, and languages">
                    <div className="simple-list">
                      <div className="simple-list-item">
                        <strong>Course</strong>
                        <span>{project.course}</span>
                      </div>
                      <div className="simple-list-item">
                        <strong>GitHub</strong>
                        <span>{project.github}</span>
                      </div>
                      <div className="simple-list-item">
                        <strong>Languages</strong>
                        <span>{project.languages.join(', ')}</span>
                      </div>
                      <div className="simple-list-item">
                        <strong>Demo video</strong>
                        <span>{project.demoVideoUrl}</span>
                      </div>
                    </div>
                  </Panel>
                  <Panel title="Tasks" subtitle="Ordered list for the project owner">
                    <div className="simple-list">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="simple-list-item">
                          <strong>{task.title}</strong>
                          <span>
                            {task.owner} · {task.state}
                          </span>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => moveTaskToTop(project.id, task.id)}
                          >
                            Move Top
                          </button>
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
                  <Panel title="Invitations" subtitle="Send, cancel, accept, or reject">
                    <div className="simple-list">
                      {project.invitations.map((invitation) => (
                        <div key={invitation.id} className="simple-list-item">
                          <strong>{invitation.recipient}</strong>
                          <span>
                            {invitation.role} · {invitation.status}
                          </span>
                          <div className="button-row">
                            <button
                              type="button"
                              className="ghost-button"
                              onClick={() =>
                                updateInvitationStatus(project.id, invitation.id, 'Pending')
                              }
                            >
                              Send
                            </button>
                            <button
                              type="button"
                              className="ghost-button"
                              onClick={() =>
                                updateInvitationStatus(project.id, invitation.id, 'Accepted')
                              }
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="ghost-button danger"
                              onClick={() =>
                                updateInvitationStatus(project.id, invitation.id, 'Rejected')
                              }
                            >
                              Reject / Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                  <Panel title="Collaborators" subtitle="Project creator controls">
                    <div className="simple-list">
                      {project.collaborators.map((collaborator) => (
                        <div key={collaborator} className="simple-list-item">
                          <strong>{collaborator}</strong>
                          <span>Active collaborator</span>
                          <button
                            type="button"
                            className="ghost-button danger"
                            onClick={() => removeCollaborator(project.id, collaborator)}
                          >
                            Remove
                          </button>
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
            description="Search, filter, apply, and save favorites."
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
                    {internship.favorite ? '⭐ Remove Favorite' : '⭐ Favorite'}
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
