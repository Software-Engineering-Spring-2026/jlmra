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
  taskDrafts: Record<
    string,
    {
      title: string;
      description: string;
      owner: string;
      state: Project['tasks'][number]['state'];
      due: string;
    }
  >;
  setTaskDrafts: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        {
          title: string;
          description: string;
          owner: string;
          state: Project['tasks'][number]['state'];
          due: string;
        }
      >
    >
  >;
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
  const [appealDrafts, setAppealDrafts] = useState<Record<string, string>>({});
  const [durationFilter, setDurationFilter] = useState('All');
  const [internshipSort, setInternshipSort] = useState<'posted' | 'company'>('posted');
  const durationOptions = [
    'All',
    ...Array.from(new Set(internships.map((internship) => internship.duration))),
  ];
  const postedTime = (value: string) => {
    if (value === 'Today') return Date.now();

    // Parse format like "14 Apr 2026" - create a more reliable mapping
    const monthMap: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    const parts = value.trim().split(' ');
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts;
      const day = parseInt(dayStr);
      const month = monthMap[monthStr];
      const year = parseInt(yearStr);

      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        // Create date at noon to avoid timezone issues
        const date = new Date(year, month, day, 12, 0, 0);
        return date.getTime();
      }
    }

    // Fallback to standard parsing
    return Date.parse(value) || 0;
  };
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
  const getTaskDraft = (projectId: string) =>
    taskDrafts[projectId] ?? {
      title: '',
      description: '',
      owner: '',
      state: 'pending' as Project['tasks'][number]['state'],
      due: '',
    };

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
    case 'profile':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Student profile"
            title={studentProfile.name}
            description="Profile picture, biography, contact details, and skills."
            action={
              <button type="button" className="primary-button" onClick={saveStudentProfile}>
                Save Profile
              </button>
            }
          />
          <div className="content-grid">
            <Panel
              title="Public identity"
              subtitle="Shown with your portfolio and project submissions"
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
                  Email
                  <input
                    value={studentProfile.email}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={studentProfile.phone}
                    onChange={(event) =>
                      setStudentProfile((current) => ({
                        ...current,
                        phone: event.target.value,
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
              </div>
            </Panel>
            <Panel title="Bio and skills" subtitle="Used by employers and instructors in Directory">
              <div className="form-grid">
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
            <Panel title="Portfolio controls" subtitle="Whole profile visibility is separate from project visibility and featured work">
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
                <div className="portfolio-project-controls">
                  {projects.map((project) => (
                    <article key={project.id} className="portfolio-project-row">
                      <div>
                        <strong>{project.title}</strong>
                        <span>
                          {project.visibility} · {project.status}
                        </span>
                      </div>
                      <div className="button-row">
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => toggleProjectVisibility(project.id)}
                        >
                          Make {project.visibility === 'Public' ? 'Private' : 'Public'}
                        </button>
                        <button
                          type="button"
                          className="ghost-button favorite-button"
                          onClick={() => setFeaturedProjectById(project.id)}
                        >
                          <Icon name="star" />
                          {project.featured ? 'Featured' : 'Make Featured'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
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
                    disabled={project.featured}
                    onClick={() => setFeaturedProjectById(project.id)}
                  >
                    {project.featured ? 'Featured' : 'Make Featured'}
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
                    {project.isFlagged ? (
                      <>
                        <div className="notice-banner top-space">
                          Flag reason: {project.flagReason ?? 'Project flagged for review.'}
                        </div>
                        <div className="composer compact-composer">
                          <textarea
                            rows={2}
                            maxLength={180}
                            value={appealDrafts[project.id] ?? ''}
                            onChange={(event) =>
                              setAppealDrafts((current) => ({
                                ...current,
                                [project.id]: event.target.value,
                              }))
                            }
                            placeholder="Short appeal message"
                          />
                          <span className="subtle-copy">
                            {(appealDrafts[project.id] ?? '').length}/180
                          </span>
                          <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                              sendProjectAppeal(project.id, appealDrafts[project.id] ?? '')
                            }
                          >
                            Send Appeal
                          </button>
                        </div>
                      </>
                    ) : null}
                  </Panel>
                  <Panel title="Tasks" subtitle="Create, edit, delete, assign, and track deadlines">
                    <div className="simple-list">
                      {project.tasks.map((task) => (
                        <article key={task.id} className="list-card">
                          <div className="form-grid">
                            <label>
                              Task
                              <input
                                value={task.title}
                                onChange={(event) =>
                                  updateProjectTask(project.id, task.id, {
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
                                  updateProjectTask(project.id, task.id, {
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
                                  updateProjectTask(project.id, task.id, {
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
                                  updateProjectTask(project.id, task.id, {
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
                                  updateProjectTask(project.id, task.id, {
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
                              onClick={() => moveTaskToTop(project.id, task.id)}
                            >
                              Move Top
                            </button>
                            <button
                              type="button"
                              className="ghost-button danger"
                              onClick={() => deleteProjectTask(project.id, task.id)}
                            >
                              Delete Task
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="task-composer">
                      <input
                        value={getTaskDraft(project.id).title}
                        onChange={(event) =>
                          setTaskDrafts((current) => ({
                            ...current,
                            [project.id]: {
                              ...getTaskDraft(project.id),
                              title: event.target.value,
                            },
                          }))
                        }
                        placeholder="Task title"
                      />
                      <input
                        value={getTaskDraft(project.id).description}
                        onChange={(event) =>
                          setTaskDrafts((current) => ({
                            ...current,
                            [project.id]: {
                              ...getTaskDraft(project.id),
                              description: event.target.value,
                            },
                          }))
                        }
                        placeholder="Short description"
                      />
                      <input
                        value={getTaskDraft(project.id).owner}
                        onChange={(event) =>
                          setTaskDrafts((current) => ({
                            ...current,
                            [project.id]: {
                              ...getTaskDraft(project.id),
                              owner: event.target.value,
                            },
                          }))
                        }
                        placeholder="Assigned collaborator"
                      />
                      <select
                        value={getTaskDraft(project.id).state}
                        onChange={(event) =>
                          setTaskDrafts((current) => ({
                            ...current,
                            [project.id]: {
                              ...getTaskDraft(project.id),
                              state: event.target
                                .value as Project['tasks'][number]['state'],
                            },
                          }))
                        }
                      >
                        <option value="pending">pending</option>
                        <option value="postponed">post-poned</option>
                        <option value="completed">completed</option>
                      </select>
                      <input
                        value={getTaskDraft(project.id).due}
                        onChange={(event) =>
                          setTaskDrafts((current) => ({
                            ...current,
                            [project.id]: {
                              ...getTaskDraft(project.id),
                              due: event.target.value,
                            },
                          }))
                        }
                        placeholder="Deadline"
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
                  <Panel title="Invitations" subtitle="Collaborator and instructor invitation status">
                    <div className="simple-list">
                      {project.invitations.map((invitation) => (
                        <div key={invitation.id} className="simple-list-item">
                          <strong>{invitation.recipient}</strong>
                          <span>
                            {invitation.role} · {invitation.status}
                          </span>
                          {invitation.status === 'Pending' ? (
                            <button
                              type="button"
                              className="ghost-button danger"
                              onClick={() =>
                                updateInvitationStatus(project.id, invitation.id, 'Rejected')
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
                <div className="simple-list">
                  <div className="simple-list-item">
                    <strong>Responsibilities</strong>
                    <span>{internship.responsibilities}</span>
                  </div>
                  <div className="simple-list-item">
                    <strong>Programming languages</strong>
                    <span>{internship.programmingLanguages.join(', ')}</span>
                  </div>
                </div>
                <div className="tag-row">
                  {internship.skills.map((tag) => (
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
        <div className="page-stack">
          <NotificationsPage
            role="student"
            notifications={notifications}
            enabled={notificationsEnabled}
            onToggleEnabled={onToggleNotificationsEnabled}
            onToggleRead={onToggleNotificationRead}
          />
          <Panel title="Flag appeals" subtitle="Respond to flagged project notifications">
            <div className="stack-list">
              {projects
                .filter((project) => project.isFlagged)
                .map((project) => (
                  <article key={project.id} className="list-card">
                    <div className="list-card-head">
                      <div>
                        <strong>{project.title}</strong>
                        <span>{project.flagReason ?? 'Project flagged for review.'}</span>
                      </div>
                      <Badge tone="warn">Flagged</Badge>
                    </div>
                    <div className="composer compact-composer">
                      <textarea
                        rows={2}
                        maxLength={180}
                        value={appealDrafts[project.id] ?? ''}
                        onChange={(event) =>
                          setAppealDrafts((current) => ({
                            ...current,
                            [project.id]: event.target.value,
                          }))
                        }
                        placeholder="Short appeal message"
                      />
                      <span className="subtle-copy">
                        {(appealDrafts[project.id] ?? '').length}/180
                      </span>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          sendProjectAppeal(project.id, appealDrafts[project.id] ?? '')
                        }
                      >
                        Send Appeal
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </Panel>
        </div>
      );
    default:
      return null;
  }
}
