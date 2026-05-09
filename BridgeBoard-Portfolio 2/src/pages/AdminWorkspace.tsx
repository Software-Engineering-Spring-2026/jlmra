import React from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Appeal,
  type CompanyRequest,
  type Conversation,
  type Course,
  type InstructorProfile,
  type NotificationItem,
  type Project,
  type UserAccount,
} from '../mockData';
import { Badge, PageHeader, Panel, StatCard } from '../components/ui';
import { InboxPage } from './InboxPage';
import { NotificationsPage } from './NotificationsPage';

type AdminWorkspaceProps = {
  currentPage: WorkspacePage;
  companyRequests: CompanyRequest[];
  updateCompanyRequest: (
    requestId: string,
    nextStatus: 'Approved' | 'Rejected'
  ) => void;
  appeals: Appeal[];
  resolveAppeal: (appealId: string) => void;
  users: UserAccount[];
  toggleUserStatus: (userId: string) => void;
  courses: Course[];
  projects: Project[];
  featuredProject: Project;
  instructorProfile: InstructorProfile;
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

export function AdminWorkspace({
  currentPage,
  companyRequests,
  updateCompanyRequest,
  appeals,
  resolveAppeal,
  users,
  toggleUserStatus,
  courses,
  projects,
  featuredProject,
  instructorProfile,
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
}: AdminWorkspaceProps) {
  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Administrator dashboard"
            title="Platform overview"
            description="The admin role now opens on a simple platform summary instead of a crowded multi-purpose screen."
            action={
              <button
                type="button"
                className="primary-button"
                onClick={() => setCurrentPage('approvals')}
              >
                Open Approvals
              </button>
            }
          />
          <div className="stats-grid">
            <StatCard
              label="Pending approvals"
              value={String(
                companyRequests.filter((request) => request.status === 'Pending').length
              )}
              helper="Employer approvals and uploaded documents have a separate page."
            />
            <StatCard
              label="Active users"
              value={String(users.filter((user) => user.status === 'Active').length)}
              helper="User controls are isolated on the users page."
            />
            <StatCard
              label="Open appeals"
              value={String(
                appeals.filter((appeal) => appeal.status === 'Pending Review').length
              )}
              helper="Appeals are easier to review because they are not mixed with other admin content."
            />
          </div>
          <div className="content-grid">
            <Panel title="Approvals waiting now" subtitle="Current top priorities">
              <div className="simple-list">
                {companyRequests
                  .filter((request) => request.status === 'Pending')
                  .map((request) => (
                    <div key={request.id} className="simple-list-item">
                      <strong>{request.companyName}</strong>
                      <span>{request.owner}</span>
                    </div>
                  ))}
              </div>
            </Panel>
            <Panel title="Recent appeals" subtitle="Flagged projects that still need attention">
              <div className="simple-list">
                {appeals.map((appeal) => (
                  <div key={appeal.id} className="simple-list-item">
                    <strong>{appeal.projectTitle}</strong>
                    <span>{appeal.status}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'approvals':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Administrator approvals"
            title="Employer approvals and appeals"
            description="This page keeps the approval flow much simpler by separating company review from everything else."
          />
          <div className="content-grid content-grid-wide">
            <Panel title="Company approvals" subtitle="Documents and decisions">
              <div className="stack-list">
                {companyRequests.map((request) => (
                  <article key={request.id} className="list-card">
                    <div className="list-card-head">
                      <div>
                        <strong>{request.companyName}</strong>
                        <span>{request.owner}</span>
                      </div>
                      <Badge
                        tone={
                          request.status === 'Approved'
                            ? 'success'
                            : request.status === 'Rejected'
                            ? 'warn'
                            : 'accent'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p>{request.summary}</p>
                    <div className="simple-list">
                      {request.documents.map((document) => (
                        <div key={document} className="simple-list-item">
                          <strong>{document}</strong>
                          <span>Uploaded PDF</span>
                        </div>
                      ))}
                    </div>
                    <div className="button-row">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => updateCompanyRequest(request.id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger"
                        onClick={() => updateCompanyRequest(request.id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
            <Panel title="Student appeals" subtitle="Flags that students responded to">
              <div className="stack-list">
                {appeals.map((appeal) => (
                  <article key={appeal.id} className="list-card">
                    <div className="list-card-head">
                      <div>
                        <strong>{appeal.projectTitle}</strong>
                        <span>{appeal.raisedBy}</span>
                      </div>
                      <Badge tone={appeal.status === 'Resolved' ? 'success' : 'warn'}>
                        {appeal.status}
                      </Badge>
                    </div>
                    <p>{appeal.reason}</p>
                    <p className="subtle-copy">{appeal.studentMessage}</p>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => resolveAppeal(appeal.id)}
                    >
                      Resolve Appeal
                    </button>
                  </article>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'users':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Administrator users"
            title="Users and courses"
            description="The users page now focuses on account activation while keeping course data in a second panel."
          />
          <div className="content-grid content-grid-wide">
            <Panel title="User directory" subtitle="Students, employers, instructors, and admins">
              <div className="stack-list">
                {users.map((user) => (
                  <article key={user.id} className="list-card">
                    <div className="list-card-head">
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <Badge tone={user.status === 'Active' ? 'success' : 'warn'}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="button-row">
                      <Badge>{user.role}</Badge>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
            <Panel title="Course directory" subtitle="Available courses in the platform">
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
                        {course.linked ? 'Linked' : 'Standalone'}
                      </Badge>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'analytics':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Administrator analytics"
            title="Platform analytics"
            description="Instead of burying analytics among other controls, this page now shows clean summary cards and progress bars."
          />
          <div className="stats-grid">
            <StatCard
              label="Total users"
              value={String(users.length)}
              helper="This includes students, employers, instructors, and administrators."
            />
            <StatCard
              label="Projects listed"
              value={String(projects.length)}
              helper="Projects that can receive feedback and appear on student portfolios."
            />
            <StatCard
              label="Top project"
              value={featuredProject.title}
              helper="The most highlighted project in the current prototype view."
            />
          </div>
          <div className="content-grid">
            <Panel title="Engagement indicators" subtitle="High-level usage bars">
              <div className="progress-list">
                <div className="progress-row">
                  <div>
                    <strong>Students with projects</strong>
                    <span>81%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill progress-fill-81" />
                  </div>
                </div>
                <div className="progress-row">
                  <div>
                    <strong>Employers with documents</strong>
                    <span>72%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill progress-fill-72" />
                  </div>
                </div>
                <div className="progress-row">
                  <div>
                    <strong>Projects receiving feedback</strong>
                    <span>67%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill progress-fill-67" />
                  </div>
                </div>
              </div>
            </Panel>
            <Panel title="Most visible records" subtitle="Simple examples for the PM walkthrough">
              <div className="simple-list">
                <div className="simple-list-item">
                  <strong>Top project</strong>
                  <span>{featuredProject.title}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Top employer</strong>
                  <span>{companyRequests[0]?.companyName ?? 'Bright Labs'}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Most active instructor</strong>
                  <span>{instructorProfile.name}</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'inbox':
      return (
        <InboxPage
          role="admin"
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
          role="admin"
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
