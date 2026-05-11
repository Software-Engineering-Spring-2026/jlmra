import React, { useState } from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Conversation,
  type Internship,
  type NotificationItem,
  type Project,
  type StudentProfile,
} from '../mockData';
import { Icon } from '../components/icons';
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
  uploadStudentProfilePicture: () => void;
  addTaskToProject: (projectId: string) => void;
  createStudentProject: () => void;
  updateProjectTitle: (projectId: string, title: string) => void;
  updateProjectTask: (
    projectId: string,
    taskId: string,
    changes: Partial<Project['tasks'][number]>
  ) => void;
  deleteProjectTask: (projectId: string, taskId: string) => void;
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
  sendProjectAppeal: (projectId: string, message: string) => void;
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
  uploadStudentProfilePicture,
  addTaskToProject,
  createStudentProject,
  updateProjectTitle,
  updateProjectTask,
  deleteProjectTask,
  deleteProject,
  markProjectFinalDraft,
  updateInvitationStatus,
  removeCollaborator,
  moveTaskToTop,
  uploadThesisDraft,
  setFinalThesisDraft,
  sendProjectAppeal,
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
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '');
  const [appealDrafts, setAppealDrafts] = useState<Record<string, string>>({});
  const [durationFilter, setDurationFilter] = useState('All');
  const [internshipSort, setInternshipSort] = useState<'posted' | 'company'>('posted');
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const durationOptions = [
    'All',
    ...Array.from(new Set(internships.map((internship) => internship.duration))),
  ];
  const postedTime = (value: string) =>
    value === 'Today' ? Date.now() : Date.parse(value) || 0;
  const displayedInternships = internships
    .filter(
      (internship) => durationFilter === 'All' || internship.duration === durationFilter
    )
    .sort((first, second) =>
      internshipSort === 'posted'
        ? postedTime(second.postedOn) - postedTime(first.postedOn)
        : first.companyName.localeCompare(second.companyName)
    );
  const completedInternships = internships.filter(
    (internship) => internship.applicationStatus === 'Completed'
  );

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
            <Panel
              title="Basic information"
              subtitle="Major, skills, LinkedIn, and profile picture"
              action={
                <button
                  type="button"
                  className="ghost-button"
                  onClick={uploadStudentProfilePicture}
                >
                  Upload Picture
                </button>
              }
            >
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
                  Skills
                  <input
                    value={studentProfile.skills.join(', ')}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        skills: event.target.value
                          .split(',')
                          .map((skill) => skill.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="React, TypeScript, UI Design"
                  />
                </label>
              </div>
            </Panel>
            <Panel title="Profile visibility" subtitle="This controls the whole portfolio">
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
              </div>
            </Panel>
            <Panel title="Visible projects" subtitle="Choose which projects appear on the portfolio">
              <div className="simple-list">
                {projects.map((project) => (
                  <div key={project.id} className="simple-list-item">
                    <strong>{project.title}</strong>
                    <span>
                      {project.visibility} on portfolio
                      {project.featured ? ' - Featured' : ''}
                    </span>
                    <div className="button-row">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => toggleProjectVisibility(project.id)}
                      >
                        {project.visibility === 'Public' ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        disabled={project.featured}
                        onClick={() => setFeaturedProjectById(project.id)}
                      >
                        {project.featured ? 'Featured' : 'Make Featured'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Completed internships" subtitle="Automatically added to the portfolio">
              <div className="simple-list">
                {completedInternships.map((internship) => (
                  <div key={internship.id} className="simple-list-item">
                    <strong>{internship.title}</strong>
                    <span>
                      {internship.companyName} - {internship.duration}
                    </span>
                  </div>
                ))}
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
            description="Select one project, then manage its details."
            action={
              <button type="button" className="primary-button" onClick={createStudentProject}>
                Create Project
              </button>
            }
          />
          {selectedProject ? (
            <>
              <div className="directory-layout">
                <Panel title="My projects" subtitle="Choose one project to manage">
                  <div className="stack-list">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        className={`directory-result ${
                          selectedProject.id === project.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        <strong>{project.title}</strong>
                        <span>
                          {project.course} - {project.visibility} - {project.status}
                          {project.featured ? ' - Featured' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </Panel>
                <Panel title="Project details" subtitle="Title, links, visibility, and featured status">
                  <div className="form-grid">
                    <label className="full-span">
                      Project title
                      <input
                        value={selectedProject.title}
                        onChange={(event) =>
                          updateProjectTitle(selectedProject.id, event.target.value)
                        }
                      />
                    </label>
                  </div>
                  <div className="simple-list top-space">
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
                      <strong>Demo video</strong>
                      <span>{selectedProject.demoVideoUrl}</span>
                    </div>
                  </div>
                  {selectedProject.isFlagged ? (
                    <div className="notice-banner top-space">
                      Flag reason: {selectedProject.flagReason ?? 'Project flagged for review.'}
                    </div>
                  ) : null}
                  {selectedProject.isFlagged ? (
                    <div className="composer">
                      <textarea
                        rows={3}
                        value={appealDrafts[selectedProject.id] ?? ''}
                        onChange={(event) =>
                          setAppealDrafts((current) => ({
                            ...current,
                            [selectedProject.id]: event.target.value,
                          }))
                        }
                        placeholder="Explain why this project should be unflagged"
                      />
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          sendProjectAppeal(
                            selectedProject.id,
                            appealDrafts[selectedProject.id] ?? ''
                          )
                        }
                      >
                        Send Appeal
                      </button>
                    </div>
                  ) : null}
                  <div className="button-row top-space">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => toggleProjectVisibility(selectedProject.id)}
                    >
                      {selectedProject.visibility === 'Public'
                        ? 'Hide from Portfolio'
                        : 'Show on Portfolio'}
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      disabled={selectedProject.featured}
                      onClick={() => setFeaturedProjectById(selectedProject.id)}
                    >
                      {selectedProject.featured ? 'Featured' : 'Make Featured'}
                    </button>
                    {selectedProject.course === 'Bachelor Project' ? (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => markProjectFinalDraft(selectedProject.id)}
                      >
                        Set Final Draft
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="ghost-button danger"
                      onClick={() => deleteProject(selectedProject.id)}
                    >
                      Delete Project
                    </button>
                  </div>
                </Panel>
              </div>

              <div className="content-grid">
                <Panel title="Tasks" subtitle="Edit status, owner, deadline, and order">
                  <div className="stack-list">
                    {selectedProject.tasks.map((task) => (
                      <article key={task.id} className="list-card">
                        <div className="form-grid">
                          <label>
                            Task
                            <input
                              value={task.title}
                              onChange={(event) =>
                                updateProjectTask(selectedProject.id, task.id, {
                                  title: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label>
                            Assigned to
                            <input
                              value={task.owner}
                              onChange={(event) =>
                                updateProjectTask(selectedProject.id, task.id, {
                                  owner: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label>
                            Status
                            <select
                              value={task.state}
                              onChange={(event) =>
                                updateProjectTask(selectedProject.id, task.id, {
                                  state: event.target.value as Project['tasks'][number]['state'],
                                })
                              }
                            >
                              <option value="pending">pending</option>
                              <option value="postponed">post-poned</option>
                              <option value="completed">completed</option>
                            </select>
                          </label>
                          <label>
                            Deadline
                            <input
                              value={task.due}
                              onChange={(event) =>
                                updateProjectTask(selectedProject.id, task.id, {
                                  due: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="full-span">
                            Short description
                            <input
                              value={task.description}
                              onChange={(event) =>
                                updateProjectTask(selectedProject.id, task.id, {
                                  description: event.target.value,
                                })
                              }
                            />
                          </label>
                        </div>
                        <div className="button-row">
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => moveTaskToTop(selectedProject.id, task.id)}
                          >
                            Move Top
                          </button>
                          <button
                            type="button"
                            className="ghost-button danger"
                            onClick={() => deleteProjectTask(selectedProject.id, task.id)}
                          >
                            Delete Task
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="task-composer">
                    <input
                      value={taskDrafts[selectedProject.id] ?? ''}
                      onChange={(event) =>
                        setTaskDrafts((current) => ({
                          ...current,
                          [selectedProject.id]: event.target.value,
                        }))
                      }
                      placeholder="Add a new task"
                    />
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => addTaskToProject(selectedProject.id)}
                    >
                      Add Task
                    </button>
                  </div>
                </Panel>

                <Panel title="Invitations" subtitle="Collaborator and instructor invitation status">
                  <div className="simple-list">
                    {selectedProject.invitations.map((invitation) => (
                      <div key={invitation.id} className="simple-list-item">
                        <strong>{invitation.recipient}</strong>
                        <span>
                          {invitation.role} - {invitation.status}
                        </span>
                        {invitation.status === 'Pending' ? (
                          <button
                            type="button"
                            className="ghost-button danger"
                            onClick={() =>
                              updateInvitationStatus(
                                selectedProject.id,
                                invitation.id,
                                'Rejected'
                              )
                            }
                          >
                            Cancel Invitation
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Collaborators" subtitle="Project creator controls">
                  <div className="simple-list">
                    {selectedProject.collaborators.map((collaborator) => (
                      <div key={collaborator} className="simple-list-item">
                        <strong>{collaborator}</strong>
                        <span>Active collaborator</span>
                        <button
                          type="button"
                          className="ghost-button danger"
                          onClick={() => removeCollaborator(selectedProject.id, collaborator)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </Panel>

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
                          {draft.uploadedAt} -{' '}
                          {draft.isFinal ? 'Final public draft' : 'Private draft'}
                        </span>
                        <button
                          type="button"
                          className="ghost-button"
                          disabled={draft.isFinal}
                          onClick={() => setFinalThesisDraft(draft.id)}
                        >
                          {draft.isFinal ? 'Final Draft' : 'Set Final Draft'}
                        </button>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </>
          ) : null}
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
              <label>
                Duration
                <select
                  value={durationFilter}
                  onChange={(event) => setDurationFilter(event.target.value)}
                >
                  {durationOptions.map((duration) => (
                    <option key={duration}>{duration}</option>
                  ))}
                </select>
              </label>
              <label>
                Sort
                <select
                  value={internshipSort}
                  onChange={(event) =>
                    setInternshipSort(event.target.value as 'posted' | 'company')
                  }
                >
                  <option value="posted">Posting date</option>
                  <option value="company">Company name</option>
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
          </Panel>
          <div className="stack-list">
            {displayedInternships.map((internship) => (
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
                    className="ghost-button favorite-button"
                    onClick={() => toggleInternshipFavorite(internship.id)}
                  >
                    <Icon name="star" />
                    {internship.favorite ? 'Remove Favorite' : 'Favorite'}
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
