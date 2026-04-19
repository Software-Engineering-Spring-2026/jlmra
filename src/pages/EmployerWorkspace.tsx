import React from 'react';
import { type WorkspacePage } from '../appConfig';
import {
  type Conversation,
  type EmployerProfile,
  type Internship,
  type NotificationItem,
  type PortfolioCard,
} from '../mockData';
import { Badge, PageHeader, Panel, StatCard } from '../components/ui';
import { InboxPage } from './InboxPage';
import { NotificationsPage } from './NotificationsPage';

type InternshipDraft = {
  title: string;
  location: string;
  duration: string;
  description: string;
};

type EmployerWorkspaceProps = {
  currentPage: WorkspacePage;
  employerProfile: EmployerProfile;
  setEmployerProfile: React.Dispatch<React.SetStateAction<EmployerProfile>>;
  saveEmployerProfile: () => void;
  uploadEmployerDocument: () => void;
  employerInternships: Internship[];
  internshipDraft: InternshipDraft;
  setInternshipDraft: React.Dispatch<React.SetStateAction<InternshipDraft>>;
  editingInternshipId: string | null;
  clearInternshipDraft: () => void;
  saveInternshipDraft: () => void;
  startEditingInternship: (internshipId: string) => void;
  toggleInternshipStatus: (
    internshipId: string,
    nextStatus: Internship['status']
  ) => void;
  deleteInternship: (internshipId: string) => void;
  portfolios: PortfolioCard[];
  setCurrentPage: (page: WorkspacePage) => void;
  updateApplicantStatus: (
    internshipId: string,
    applicationId: string,
    nextStatus: 'Shortlisted' | 'Accepted' | 'Rejected'
  ) => void;
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

export function EmployerWorkspace({
  currentPage,
  employerProfile,
  setEmployerProfile,
  saveEmployerProfile,
  uploadEmployerDocument,
  employerInternships,
  internshipDraft,
  setInternshipDraft,
  editingInternshipId,
  clearInternshipDraft,
  saveInternshipDraft,
  startEditingInternship,
  toggleInternshipStatus,
  deleteInternship,
  portfolios,
  setCurrentPage,
  updateApplicantStatus,
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
}: EmployerWorkspaceProps) {
  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Employer dashboard"
            title={employerProfile.companyName}
            description="This dashboard now summarizes the hiring story before you move into more detailed pages."
            action={
              <button
                type="button"
                className="primary-button"
                onClick={() => setCurrentPage('internships')}
              >
                Manage Internships
              </button>
            }
          />
          <div className="stats-grid">
            <StatCard
              label="Verification status"
              value={employerProfile.verificationStatus}
              helper="Company verification is now kept on the company profile page."
            />
            <StatCard
              label="Open internships"
              value={String(employerInternships.length)}
              helper="Internship management has its own focused page."
            />
            <StatCard
              label="Applicants"
              value={String(
                employerInternships.reduce(
                  (count, internship) => count + internship.applications.length,
                  0
                )
              )}
              helper="Applicants are grouped by internship on the applicants page."
            />
          </div>
          <div className="content-grid">
            <Panel title="Company summary" subtitle="A quick overview before deeper pages">
              <p>{employerProfile.summary}</p>
              <div className="simple-list">
                <div className="simple-list-item">
                  <strong>Address</strong>
                  <span>{employerProfile.address}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Contact</strong>
                  <span>{employerProfile.companyEmail}</span>
                </div>
              </div>
            </Panel>
            <Panel title="Recommended student portfolios" subtitle="Based on saved employer interests">
              <div className="simple-list">
                {portfolios.slice(0, 3).map((portfolio) => (
                  <div key={portfolio.id} className="simple-list-item">
                    <strong>{portfolio.name}</strong>
                    <span>
                      {portfolio.major} · {portfolio.projectsCount} projects
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
            eyebrow="Company profile"
            title={employerProfile.companyName}
            description="The company page is now dedicated to profile data, uploaded documents, and verification details."
            action={
              <button type="button" className="primary-button" onClick={saveEmployerProfile}>
                Save Company Profile
              </button>
            }
          />
          <div className="content-grid">
            <Panel title="Company details" subtitle="Editable employer information">
              <div className="form-grid">
                <label>
                  Company email
                  <input
                    value={employerProfile.companyEmail}
                    onChange={(event) =>
                      setEmployerProfile((current) => ({
                        ...current,
                        companyEmail: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Contact phone
                  <input
                    value={employerProfile.contactPhone}
                    onChange={(event) =>
                      setEmployerProfile((current) => ({
                        ...current,
                        contactPhone: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="full-span">
                  Address
                  <input
                    value={employerProfile.address}
                    onChange={(event) =>
                      setEmployerProfile((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="full-span">
                  Company biography
                  <textarea
                    rows={4}
                    value={employerProfile.summary}
                    onChange={(event) =>
                      setEmployerProfile((current) => ({
                        ...current,
                        summary: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </Panel>
            <Panel
              title="Verification documents"
              subtitle={`${employerProfile.verificationStatus} · ${employerProfile.mapLabel}`}
              action={
                <button
                  type="button"
                  className="ghost-button"
                  onClick={uploadEmployerDocument}
                >
                  Upload PDF
                </button>
              }
            >
              <div className="simple-list">
                {employerProfile.documents.map((document) => (
                  <div key={document} className="simple-list-item">
                    <strong>{document}</strong>
                    <span>Ready for admin review</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    case 'internships':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Employer internships"
            title="Openings"
            description="Internship creation and editing now live on their own page instead of being buried inside a larger dashboard."
            action={
              <button type="button" className="ghost-button" onClick={clearInternshipDraft}>
                Clear Form
              </button>
            }
          />
          <div className="content-grid content-grid-wide">
            <Panel
              title={editingInternshipId ? 'Edit internship' : 'Create internship'}
              subtitle="A simple form for employer internship CRUD"
            >
              <div className="form-grid">
                <label>
                  Title
                  <input
                    value={internshipDraft.title}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Location
                  <input
                    value={internshipDraft.location}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Duration
                  <input
                    value={internshipDraft.duration}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        duration: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="full-span">
                  Description
                  <textarea
                    rows={4}
                    value={internshipDraft.description}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={saveInternshipDraft}
                >
                  {editingInternshipId ? 'Save Internship' : 'Create Internship'}
                </button>
              </div>
            </Panel>
            <Panel title="Current postings" subtitle="Focused list of employer openings">
              <div className="stack-list">
                {employerInternships.map((internship) => (
                  <article key={internship.id} className="list-card">
                    <div className="list-card-head">
                      <div>
                        <strong>{internship.title}</strong>
                        <span>
                          {internship.location} · {internship.duration}
                        </span>
                      </div>
                      <Badge tone={internship.status === 'Live' ? 'success' : 'accent'}>
                        {internship.status}
                      </Badge>
                    </div>
                    <p>{internship.description}</p>
                    <div className="button-row">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => startEditingInternship(internship.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          toggleInternshipStatus(
                            internship.id,
                            internship.status === 'Archived' ? 'Live' : 'Archived'
                          )
                        }
                      >
                        {internship.status === 'Archived' ? 'Unarchive' : 'Archive'}
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          toggleInternshipStatus(
                            internship.id,
                            internship.status === 'Filled' ? 'Live' : 'Filled'
                          )
                        }
                      >
                        {internship.status === 'Filled' ? 'Mark Live' : 'Mark Filled'}
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger"
                        onClick={() => deleteInternship(internship.id)}
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
    case 'applicants':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Employer applicants"
            title="Applicants by internship"
            description="This page is intentionally separate so reviewing students feels like a focused hiring task."
          />
          <div className="stack-list">
            {employerInternships.map((internship) => (
              <article key={internship.id} className="project-card">
                <div className="list-card-head">
                  <div>
                    <h3>{internship.title}</h3>
                    <span>{internship.applications.length} applicants</span>
                  </div>
                  <Badge tone="accent">{internship.status}</Badge>
                </div>
                <div className="simple-list">
                  {internship.applications.map((application) => (
                    <div key={application.id} className="applicant-row">
                      <div>
                        <strong>{application.student}</strong>
                        <span>
                          {application.university} · Score {application.score}
                        </span>
                        <p>{application.coverLetter}</p>
                      </div>
                      <div className="button-row">
                        <Badge tone="neutral">{application.status}</Badge>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() =>
                            updateApplicantStatus(
                              internship.id,
                              application.id,
                              'Shortlisted'
                            )
                          }
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() =>
                            updateApplicantStatus(
                              internship.id,
                              application.id,
                              'Accepted'
                            )
                          }
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="ghost-button danger"
                          onClick={() =>
                            updateApplicantStatus(
                              internship.id,
                              application.id,
                              'Rejected'
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    case 'inbox':
      return (
        <InboxPage
          role="employer"
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
          role="employer"
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
