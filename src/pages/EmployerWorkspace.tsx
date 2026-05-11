import React, { useState } from 'react';
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
  deadline: string;
  description: string;
  responsibilities: string;
  skills: string;
  programmingLanguages: string;
};

type EmployerWorkspaceProps = {
  currentPage: WorkspacePage;
  employerProfile: EmployerProfile;
  setEmployerProfile: React.Dispatch<React.SetStateAction<EmployerProfile>>;
  saveEmployerProfile: () => void;
  uploadEmployerLogo: () => void;
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

export function EmployerWorkspace({
  currentPage,
  employerProfile,
  setEmployerProfile,
  saveEmployerProfile,
  uploadEmployerLogo,
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
  messageDraft,
  setMessageDraft,
  onOpenConversation,
  onBackToConversationList,
  sendMessage,
  notifications,
  notificationsEnabled,
  onToggleNotificationsEnabled,
  onToggleNotificationRead,
}: EmployerWorkspaceProps) {
  const [selectedInternshipId, setSelectedInternshipId] = useState(
    employerInternships[0]?.id ?? ''
  );
  const [applicationSort, setApplicationSort] = useState<'contributors' | 'status'>(
    'contributors'
  );
  const selectedInternship =
    employerInternships.find((internship) => internship.id === selectedInternshipId) ??
    employerInternships[0];
  const completedStudents = employerInternships.reduce(
    (count, internship) =>
      count +
      internship.applications.filter(
        (application) => application.status === 'Completed'
      ).length,
    0
  );
  const internshipsByPostingDate = employerInternships
    .slice()
    .sort((first, second) => Date.parse(second.postedOn) - Date.parse(first.postedOn));
  const deadlineTime = (deadline: string) => Date.parse(deadline) || 0;
  const canArchive = (internship: Internship) =>
    deadlineTime(internship.deadline) < new Date('2026-05-11T12:00:00').getTime();
  const sortedApplications = (internship: Internship) =>
    internship.applications.slice().sort((first, second) =>
      applicationSort === 'contributors'
        ? second.score - first.score
        : first.status.localeCompare(second.status)
    );

  switch (currentPage) {
    case 'dashboard':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Employer dashboard"
            title={employerProfile.companyName}
            description="Hiring, applicants, and company status."
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
              value={String(
                employerInternships.filter((internship) => internship.status === 'Live')
                  .length
              )}
              helper={`${employerInternships.length} internships offered over time.`}
            />
            <StatCard
              label="Completed students"
              value={String(completedStudents)}
              helper="Students marked completed on internships offered by this company."
            />
          </div>
          <div className="content-grid">
            <Panel title="Company summary" subtitle="Profile snapshot">
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
            <Panel title="Internships offered over time" subtitle="Posting history and completed students">
              <div className="simple-list">
                {internshipsByPostingDate.map((internship) => (
                  <div key={internship.id} className="simple-list-item">
                    <strong>{internship.title}</strong>
                    <span>
                      Posted {internship.postedOn} · {internship.applications.length}{' '}
                      applicants · {internship.status}
                    </span>
                  </div>
                ))}
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
            description="Company details, map location, and documents."
            action={
              <button type="button" className="primary-button" onClick={saveEmployerProfile}>
                Save Company Profile
              </button>
            }
          />
          <div className="content-grid">
            <Panel
              title="Company details"
              subtitle="Editable employer information and company logo"
              action={
                <button type="button" className="ghost-button" onClick={uploadEmployerLogo}>
                  Upload Logo
                </button>
              }
            >
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
              subtitle={`${employerProfile.verificationStatus} · Required PDF proof from registration`}
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
            description="Create, edit, archive, and fill positions."
            action={
              <button type="button" className="ghost-button" onClick={clearInternshipDraft}>
                Clear Form
              </button>
            }
          />
          <div className="content-grid content-grid-wide">
            <Panel
              title={editingInternshipId ? 'Edit internship' : 'Create internship'}
              subtitle="Title, details, responsibilities, skills, deadline, and programming languages"
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
                <label>
                  Application deadline
                  <input
                    value={internshipDraft.deadline}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        deadline: event.target.value,
                      }))
                    }
                    placeholder="30 Apr 2026"
                  />
                </label>
                <label className="full-span">
                  Internship details
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
                <label className="full-span">
                  Responsibilities
                  <textarea
                    rows={3}
                    value={internshipDraft.responsibilities}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        responsibilities: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Skills
                  <input
                    value={internshipDraft.skills}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        skills: event.target.value,
                      }))
                    }
                    placeholder="React, Analytics"
                  />
                </label>
                <label>
                  Programming languages
                  <input
                    value={internshipDraft.programmingLanguages}
                    onChange={(event) =>
                      setInternshipDraft((current) => ({
                        ...current,
                        programmingLanguages: event.target.value,
                      }))
                    }
                    placeholder="TypeScript, Python"
                  />
                </label>
              </div>
              <div className="button-row form-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={saveInternshipDraft}
                >
                  {editingInternshipId ? 'Save Internship' : 'Create Internship'}
                </button>
              </div>
            </Panel>
            <Panel title="My internships" subtitle="Select an internship from the company list">
              <div className="stack-list">
                {employerInternships.map((internship) => (
                  <article
                    key={internship.id}
                    className={`list-card ${
                      selectedInternship?.id === internship.id ? 'active' : ''
                    }`}
                  >
                    <div className="list-card-head">
                      <div>
                        <strong>{internship.title}</strong>
                        <span>
                          {internship.location} · {internship.duration} · Deadline{' '}
                          {internship.deadline}
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
                        onClick={() => setSelectedInternshipId(internship.id)}
                      >
                        Select
                      </button>
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
                        disabled={internship.status !== 'Archived' && !canArchive(internship)}
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
                        disabled={internship.status === 'Archived'}
                      >
                        {internship.status === 'Filled'
                          ? 'Set Currently Hiring'
                          : 'Mark Position Filled'}
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
          {selectedInternship ? (
            <Panel
              title="Selected internship details"
              subtitle={`${selectedInternship.title} · ${selectedInternship.status}`}
            >
              <div className="simple-list">
                <div className="simple-list-item">
                  <strong>Responsibilities</strong>
                  <span>{selectedInternship.responsibilities}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Skills</strong>
                  <span>{selectedInternship.skills.join(', ')}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Programming languages</strong>
                  <span>{selectedInternship.programmingLanguages.join(', ')}</span>
                </div>
                <div className="simple-list-item">
                  <strong>Application deadline</strong>
                  <span>{selectedInternship.deadline}</span>
                </div>
              </div>
            </Panel>
          ) : null}
        </div>
      );
    case 'applicants':
      return (
        <div className="page-stack">
          <PageHeader
            eyebrow="Employer applicants"
            title="Applicants by internship"
            description="Review applicants and update statuses."
          />
          <Panel title="Application sorting" subtitle="Rank student applications">
            <div className="form-grid">
              <label>
                Sort applications
                <select
                  value={applicationSort}
                  onChange={(event) =>
                    setApplicationSort(event.target.value as 'contributors' | 'status')
                  }
                >
                  <option value="contributors">Top contributors</option>
                  <option value="status">Status</option>
                </select>
              </label>
            </div>
          </Panel>
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
                  {sortedApplications(internship).map((application) => (
                    <div key={application.id} className="applicant-row">
                      <div>
                        <strong>{application.student}</strong>
                        <span>
                          {application.university} · Contributor score {application.score}
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
