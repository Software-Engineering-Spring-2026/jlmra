import React, { useState } from 'react';
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
  createAdminAccount: (name: string, email: string, password: string) => void;
  toggleUserStatus: (userId: string) => void;
  courses: Course[];
  createCourse: () => void;
  deleteCourse: (code: string) => void;
  reviewCourseLinkRequest: (
    code: string,
    linkRequestStatus: 'Approved' | 'Rejected'
  ) => void;
  projects: Project[];
  toggleProjectActivation: (projectId: string) => void;
  viewCompanyDocument: (companyName: string, document: string) => void;
  downloadCompanyDocument: (companyName: string, document: string) => void;
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
  createAdminAccount,
  toggleUserStatus,
  courses,
  createCourse,
  deleteCourse,
  reviewCourseLinkRequest,
  projects,
  toggleProjectActivation,
  viewCompanyDocument,
  downloadCompanyDocument,
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
  const [approvalTab, setApprovalTab] = useState<'companies' | 'appeals' | 'flagged'>(
    'companies'
  );
  const [adminDraft, setAdminDraft] = useState({
    name: '',
    email: '',
    password: '',
  });

  const submitAdminDraft = () => {
    if (!adminDraft.name.trim() || !adminDraft.email.trim() || !adminDraft.password.trim()) {
      return;
    }

    createAdminAccount(adminDraft.name, adminDraft.email, adminDraft.password);
    setAdminDraft({ name: '', email: '', password: '' });
  };

  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Administrator dashboard"
            title="Platform overview"
            description="Users, approvals, courses, and platform status."
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
            description="Company verification and project appeals."
          />
          <div className="directory-tabs" aria-label="Approval sections">
            <button
              type="button"
              className={`directory-tab ${approvalTab === 'companies' ? 'active' : ''}`}
              onClick={() => setApprovalTab('companies')}
            >
              Companies
            </button>
            <button
              type="button"
              className={`directory-tab ${approvalTab === 'appeals' ? 'active' : ''}`}
              onClick={() => setApprovalTab('appeals')}
            >
              Appeals
            </button>
            <button
              type="button"
              className={`directory-tab ${approvalTab === 'flagged' ? 'active' : ''}`}
              onClick={() => setApprovalTab('flagged')}
            >
              Flagged Projects
            </button>
          </div>
          {approvalTab === 'companies' ? (
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
                    <div className="simple-list">
                      {request.documents.map((document) => (
                        <div key={document} className="simple-list-item">
                          <strong>{document}</strong>
                          <span>Uploaded PDF</span>
                          <div className="button-row">
                            <button
                              type="button"
                              className="ghost-button"
                              onClick={() =>
                                viewCompanyDocument(request.companyName, document)
                              }
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="ghost-button"
                              onClick={() =>
                                downloadCompanyDocument(request.companyName, document)
                              }
                            >
                              Download
                            </button>
                          </div>
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
          ) : null}
          {approvalTab === 'appeals' ? (
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
          ) : null}
          {approvalTab === 'flagged' ? (
            <Panel title="Flagged projects" subtitle="Activate or deactivate">
              <div className="stack-list">
                {projects
                  .filter((project) => project.isFlagged)
                  .map((project) => (
                    <article key={project.id} className="list-card">
                      <div className="list-card-head">
                        <div>
                          <strong>{project.title}</strong>
                          <span>{project.flagReason ?? 'Flagged for review'}</span>
                        </div>
                        <Badge tone="warn">Deactivated</Badge>
                      </div>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => toggleProjectActivation(project.id)}
                      >
                        Reactivate Project
                      </button>
                    </article>
                  ))}
              </div>
            </Panel>
          ) : null}
        </div>
      );
    case 'users':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Administrator users"
            title="Users and courses"
            description="Accounts, roles, activation, and course directory."
          />
          <div className="content-grid content-grid-wide">
            <Panel title="Create administrator" subtitle="Name, email, and password">
              <div className="form-grid">
                <label>
                  Full name
                  <input
                    value={adminDraft.name}
                    onChange={(event) =>
                      setAdminDraft((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Enter admin name"
                  />
                </label>
                <label>
                  GUC email
                  <input
                    value={adminDraft.email}
                    onChange={(event) =>
                      setAdminDraft((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="admin.name@guc.edu.eg"
                  />
                </label>
                <label>
                  Password
                  <input
                    value={adminDraft.password}
                    type="password"
                    onChange={(event) =>
                      setAdminDraft((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Enter password"
                  />
                </label>
              </div>
              <button
                type="button"
                className="primary-button top-space"
                disabled={
                  !adminDraft.name.trim() ||
                  !adminDraft.email.trim() ||
                  !adminDraft.password.trim()
                }
                onClick={submitAdminDraft}
              >
                Create Administrator
              </button>
            </Panel>
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
            <Panel
              title="Course directory"
              subtitle="Create, edit, delete, and review links"
              action={
                <button type="button" className="ghost-button" onClick={createCourse}>
                  Create Course
                </button>
              }
            >
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
                    <div className="button-row">
                      {course.linkRequestStatus === 'Pending' ? (
                        <>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() =>
                              reviewCourseLinkRequest(course.code, 'Approved')
                            }
                          >
                            Accept Link
                          </button>
                          <button
                            type="button"
                            className="ghost-button danger"
                            onClick={() =>
                              reviewCourseLinkRequest(course.code, 'Rejected')
                            }
                          >
                            Reject Link
                          </button>
                        </>
                      ) : (
                        <Badge tone="neutral">
                          {course.linkRequestStatus ?? 'No request'}
                        </Badge>
                      )}
                      <button
                        type="button"
                        className="ghost-button danger"
                        disabled={course.code === 'BP401'}
                        onClick={() => deleteCourse(course.code)}
                      >
                        Delete
                      </button>
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
            description="Usage, projects, courses, and engagement."
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
              label="Total courses"
              value={String(courses.length)}
              helper={`Top project: ${featuredProject.title}.`}
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
            <Panel title="Most visible records" subtitle="Important platform records">
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
