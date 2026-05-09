import React from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Conversation,
  type Course,
  type InstructorProfile,
  type NotificationItem,
  type Project,
} from '../mockData';
import { Badge, PageHeader, Panel, StatCard } from '../components/ui';
import { InboxPage } from './InboxPage';
import { NotificationsPage } from './NotificationsPage';

type InstructorWorkspaceProps = {
  currentPage: WorkspacePage;
  instructorProfile: InstructorProfile;
  setInstructorProfile: React.Dispatch<React.SetStateAction<InstructorProfile>>;
  saveInstructorProfile: () => void;
  courses: Course[];
  toggleCourseLink: (code: string) => void;
  projects: Project[];
  reviewDrafts: Record<string, string>;
  setReviewDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  addReviewComment: (projectId: string) => void;
  rateProject: (projectId: string, rating: number) => void;
  flagProject: (projectId: string) => void;
  pendingInvitations: number;
  setCurrentPage: (page: WorkspacePage) => void;
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

export function InstructorWorkspace({
  currentPage,
  instructorProfile,
  setInstructorProfile,
  saveInstructorProfile,
  courses,
  toggleCourseLink,
  projects,
  reviewDrafts,
  setReviewDrafts,
  addReviewComment,
  rateProject,
  flagProject,
  pendingInvitations,
  setCurrentPage,
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
}: InstructorWorkspaceProps) {
  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Instructor dashboard"
            title={instructorProfile.name}
            description="Courses, reviews, and invitations."
            action={
              <button
                type="button"
                className="primary-button"
                onClick={() => setCurrentPage('reviews')}
              >
                Review Projects
              </button>
            }
          />
          <div className="stats-grid">
            <StatCard
              label="Linked courses"
              value={String(instructorProfile.linkedCourses.length)}
              helper="Bachelor Project stays linked by default."
            />
            <StatCard
              label="Pending invitations"
              value={String(pendingInvitations)}
              helper="Project invitation decisions are visible from your review workflow."
            />
            <StatCard
              label="Reviewed projects"
              value={String(projects.length)}
              helper="Ratings and comments are grouped on the reviews page."
            />
          </div>
          <div className="content-grid">
            <Panel title="Teaching profile" subtitle={instructorProfile.education}>
              <p>{instructorProfile.bio}</p>
              <div className="tag-row">
                {instructorProfile.interests.map((interest) => (
                  <Badge key={interest}>{interest}</Badge>
                ))}
              </div>
            </Panel>
            <Panel title="Invitation queue" subtitle="Course instructor requests waiting for action">
              <div className="simple-list">
                {projects.flatMap((project) =>
                  project.invitations
                    .filter((invitation) => invitation.role === 'Course Instructor')
                    .map((invitation) => (
                      <div key={invitation.id} className="simple-list-item">
                        <strong>{project.title}</strong>
                        <span>{invitation.status}</span>
                      </div>
                    ))
                )}
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'profile':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Instructor profile"
            title={instructorProfile.name}
            description="Biography, education, and research interests."
            action={
              <button
                type="button"
                className="primary-button"
                onClick={saveInstructorProfile}
              >
                Save Profile
              </button>
            }
          />
          <div className="content-grid">
            <Panel title="Public details" subtitle="Bio, interests, and background">
              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={instructorProfile.name}
                    onChange={(event) =>
                      setInstructorProfile((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Email
                  <input
                    value={instructorProfile.email}
                    onChange={(event) =>
                      setInstructorProfile((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="full-span">
                  Bio
                  <textarea
                    rows={4}
                    value={instructorProfile.bio}
                    onChange={(event) =>
                      setInstructorProfile((current) => ({
                        ...current,
                        bio: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="full-span">
                  Education
                  <input
                    value={instructorProfile.education}
                    onChange={(event) =>
                      setInstructorProfile((current) => ({
                        ...current,
                        education: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </Panel>
            <Panel title="Interests and linked courses" subtitle="What students can quickly understand">
              <div className="tag-row">
                {instructorProfile.interests.map((interest) => (
                  <Badge key={interest}>{interest}</Badge>
                ))}
              </div>
              <div className="simple-list top-space">
                {instructorProfile.linkedCourses.map((course) => (
                  <div key={course} className="simple-list-item">
                    <strong>{course}</strong>
                    <span>Currently linked</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'courses':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Instructor courses"
            title="Course links"
            description="Link and unlink teaching courses."
          />
          <div className="stack-list">
            {courses.map((course) => (
              <article key={course.code} className="list-card">
                <div className="list-card-head">
                  <div>
                    <strong>
                      {course.code} · {course.name}
                    </strong>
                    <span>{course.instructor}</span>
                  </div>
                  <Badge tone={course.linked ? 'success' : 'neutral'}>
                    {course.linked ? 'Linked' : 'Not linked'}
                  </Badge>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="ghost-button"
                    disabled={course.code === 'BP401'}
                    onClick={() => toggleCourseLink(course.code)}
                  >
                    {course.linked ? 'Unlink' : 'Link'}
                  </button>
                  {course.code === 'BP401' ? (
                    <Badge tone="accent">Auto-linked Bachelor Project</Badge>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    case 'reviews':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Instructor reviews"
            title="Project review workspace"
            description="Comments, ratings, and flags."
          />
          <div className="stack-list">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="list-card-head">
                  <div>
                    <h3>{project.title}</h3>
                    <span>
                      {project.course} · {project.status}
                    </span>
                  </div>
                  <Badge tone="accent">{project.rating.toFixed(1)}/5</Badge>
                </div>
                <div className="rating-row">
                  <div className="star-rating" aria-label={`Rate ${project.title}`}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={`star-button ${
                          rating <= Math.round(project.rating) ? 'active' : ''
                        }`}
                        onClick={() => rateProject(project.id, rating)}
                        aria-label={`Rate ${rating} out of 5`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => rateProject(project.id, 0)}
                  >
                    Clear to 0
                  </button>
                  <button
                    type="button"
                    className="ghost-button danger"
                    onClick={() => flagProject(project.id)}
                  >
                    Flag
                  </button>
                </div>
                <div className="composer">
                  <textarea
                    rows={3}
                    value={reviewDrafts[project.id] ?? ''}
                    onChange={(event) =>
                      setReviewDrafts((current) => ({
                        ...current,
                        [project.id]: event.target.value,
                      }))
                    }
                    placeholder="Add a project review comment"
                  />
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => addReviewComment(project.id)}
                  >
                    Add Comment
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
          role="instructor"
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
          role="instructor"
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
