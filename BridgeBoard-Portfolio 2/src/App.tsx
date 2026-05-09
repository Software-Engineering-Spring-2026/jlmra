import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { demoAccounts, pagesByRole, type WorkspacePage } from './appConfig';
import { Badge } from './components/ui';
import { LoginScreen } from './pages/LoginScreen';
import { StudentWorkspace } from './pages/StudentWorkspace';
import { EmployerWorkspace } from './pages/EmployerWorkspace';
import { InstructorWorkspace } from './pages/InstructorWorkspace';
import { AdminWorkspace } from './pages/AdminWorkspace';
import {
  type Appeal,
  type CompanyRequest,
  type Conversation,
  type Course,
  type EmployerProfile,
  type Internship,
  type InstructorProfile,
  type NotificationItem,
  type PortfolioCard,
  type Project,
  type Role,
  type StudentProfile,
  type UserAccount,
  initialAppeals,
  initialCompanyRequests,
  initialConversationsByRole,
  initialCourses,
  initialEmployerProfile,
  initialInternships,
  initialNotifications,
  initialPortfolios,
  initialProjects,
  initialStudentProfile,
  initialUsers,
  initialInstructorProfile,
  roleMeta,
} from './mockData';

type InternshipDraft = {
  title: string;
  location: string;
  duration: string;
  description: string;
};

type FontScale = 'small' | 'medium' | 'large';

const emptyInternshipDraft: InternshipDraft = {
  title: '',
  location: 'Hybrid',
  duration: '8 weeks',
  description: '',
};

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const defaultNotificationPreferences: Record<Role, boolean> = {
  student: true,
  employer: true,
  instructor: true,
  admin: true,
};

const fontSizeByScale: Record<FontScale, string> = {
  small: '15px',
  medium: '16px',
  large: '18px',
};

const allPages = new Set<WorkspacePage>(
  Object.values(pagesByRole).flatMap((pages) => pages.map((page) => page.id))
);

const parseHash = (
  hash: string
): {
  role: Role | null;
  page: WorkspacePage | null;
  conversationId: string | null;
} => {
  const [rolePart, pagePart, conversationPart] = hash.replace(/^#\/?/, '').split('/');
  const role = rolePart && rolePart in roleMeta ? (rolePart as Role) : null;
  const page =
    pagePart && allPages.has(pagePart as WorkspacePage)
      ? (pagePart as WorkspacePage)
      : null;

  return {
    role,
    page,
    conversationId: conversationPart ?? null,
  };
};

const buildHash = (
  role: Role,
  page: WorkspacePage,
  conversationId?: string | null
) =>
  `#/${role}/${page}${
    page === 'inbox' && conversationId ? `/${conversationId}` : ''
  }`;

function App() {
  const [session, setSession] = useState<(typeof demoAccounts)[number] | null>(
    demoAccounts[0]
  );
  const [currentPage, setCurrentPage] = useState<WorkspacePage>(
    demoAccounts[0].landingPage
  );
  const [selectedAccountId, setSelectedAccountId] = useState(demoAccounts[0].id);
  const [loginForm, setLoginForm] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
    otp: demoAccounts[0].otp,
  });
  const [loginError, setLoginError] = useState('');

  const [studentProfile, setStudentProfile] =
    useState<StudentProfile>(initialStudentProfile);
  const [employerProfile, setEmployerProfile] =
    useState<EmployerProfile>(initialEmployerProfile);
  const [instructorProfile, setInstructorProfile] =
    useState<InstructorProfile>(initialInstructorProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [internships, setInternships] = useState<Internship[]>(initialInternships);
  const [portfolios] = useState<PortfolioCard[]>(initialPortfolios);
  const [companyRequests, setCompanyRequests] =
    useState<CompanyRequest[]>(initialCompanyRequests);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [appeals, setAppeals] = useState<Appeal[]>(initialAppeals);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [conversationsByRole, setConversationsByRole] = useState<
    Record<Role, Conversation[]>
  >(initialConversationsByRole);
  const [notificationPreferences, setNotificationPreferences] = useState<
    Record<Role, boolean>
  >(defaultNotificationPreferences);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null
  );
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  const [studentInternshipQuery, setStudentInternshipQuery] = useState('');
  const [coverLetter, setCoverLetter] = useState(
    'I would love to contribute to a team building a clear, useful student-facing experience.'
  );
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});
  const [taskDrafts, setTaskDrafts] = useState<Record<string, string>>({});
  const [internshipDraft, setInternshipDraft] =
    useState<InternshipDraft>(emptyInternshipDraft);
  const [editingInternshipId, setEditingInternshipId] = useState<string | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>('medium');

  const selectedAccount =
    demoAccounts.find((account) => account.id === selectedAccountId) ??
    demoAccounts[0];

  useEffect(() => {
    setLoginForm({
      email: selectedAccount.email,
      password: selectedAccount.password,
      otp: selectedAccount.otp,
    });
    setLoginError('');
  }, [selectedAccount]);

  const activeRole = session?.role ?? 'student';
  const activePages = session ? pagesByRole[session.role] : [];
  const activePageMeta = session
    ? activePages.find((page) => page.id === currentPage) ?? activePages[0]
    : null;

  const activeNotifications = session
    ? notifications.filter((item) => item.audience.includes(session.role))
    : [];
  const unreadCount = activeNotifications.filter((item) => !item.read).length;
  const activeConversations = session ? conversationsByRole[session.role] : [];
  const selectedConversation =
    activeConversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) ?? null;
  const activeMessageDraft = selectedConversationId
    ? messageDrafts[selectedConversationId] ?? ''
    : '';

  const featuredProject =
    projects.find((project) => project.featured) ?? projects[0];
  const studentInternships = internships.filter((internship) =>
    [internship.title, internship.companyName, internship.location, internship.duration]
      .join(' ')
      .toLowerCase()
      .includes(studentInternshipQuery.trim().toLowerCase())
  );
  const employerInternships = internships.filter(
    (internship) => internship.companyName === initialEmployerProfile.companyName
  );
  const pendingInvitations = projects.reduce(
    (count, project) =>
      count +
      project.invitations.filter(
        (invitation) =>
          invitation.role === 'Course Instructor' && invitation.status === 'Pending'
      ).length,
    0
  );
  const appFontSize = fontSizeByScale[fontScale];

  const navigateToPage = useCallback(
    (page: WorkspacePage, conversationId: string | null = null) => {
      if (!session) {
        return;
      }

      setCurrentPage(page);
      setSelectedConversationId(page === 'inbox' ? conversationId : null);
      setIsSidebarOpen(false);
      setIsSettingsOpen(false);

      const nextHash = buildHash(
        session.role,
        page,
        page === 'inbox' ? conversationId : null
      );

      if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
      }
    },
    [session]
  );

  useEffect(() => {
    if (!session) {
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
      return;
    }

    const allowedPages = pagesByRole[session.role].map((page) => page.id);

    const syncFromHash = () => {
      const parsed = parseHash(window.location.hash);

      if (parsed.role !== session.role || !parsed.page || !allowedPages.includes(parsed.page)) {
        navigateToPage(session.landingPage);
        return;
      }

      setCurrentPage(parsed.page);

      if (parsed.page !== 'inbox') {
        setSelectedConversationId(null);
        return;
      }

      const conversationExists = parsed.conversationId
        ? conversationsByRole[session.role].some(
            (conversation) => conversation.id === parsed.conversationId
          )
        : false;

      setSelectedConversationId(conversationExists ? parsed.conversationId : null);
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [conversationsByRole, navigateToPage, session]);

  const addNotification = ({
    title,
    message,
    audience,
    tone = 'accent',
  }: {
    title: string;
    message: string;
    audience: Role[];
    tone?: NotificationItem['tone'];
  }) => {
    setNotifications((current) => [
      {
        id: createId('note'),
        title,
        message,
        time: 'Just now',
        audience,
        read: false,
        tone,
      },
      ...current,
    ]);
  };

  const handleLogin = () => {
    const matchedAccount = demoAccounts.find(
      (account) => account.email.toLowerCase() === loginForm.email.trim().toLowerCase()
    );

    if (!matchedAccount) {
      setLoginError('Choose one of the demo users shown on the page.');
      return;
    }

    if (matchedAccount.password !== loginForm.password.trim()) {
      setLoginError('The demo password does not match this account.');
      return;
    }

    if (matchedAccount.otp !== loginForm.otp.trim()) {
      setLoginError('Use the demo OTP shown for the selected account.');
      return;
    }

    setSession(matchedAccount);
    setCurrentPage(matchedAccount.landingPage);
    setSelectedConversationId(null);
    setIsSidebarOpen(false);
    setIsSettingsOpen(false);
    setLoginError('');
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentPage('dashboard');
    setSelectedConversationId(null);
    setIsSidebarOpen(false);
    setIsSettingsOpen(false);
    if (window.location.hash !== '#/login') {
      window.location.hash = '#/login';
    }
  };

  const toggleNotificationRead = (notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };

  const toggleProjectVisibility = (projectId: string) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              visibility: project.visibility === 'Public' ? 'Private' : 'Public',
            }
          : project
      )
    );
  };

  const setFeaturedProjectById = (projectId: string) => {
    setProjects((current) =>
      current.map((project) => ({
        ...project,
        featured: project.id === projectId,
      }))
    );
    addNotification({
      title: 'Featured project changed',
      message: 'The selected project is now highlighted on the student profile.',
      audience: ['student'],
    });
  };

  const addTaskToProject = (projectId: string) => {
    const nextTaskTitle = taskDrafts[projectId]?.trim();

    if (!nextTaskTitle) {
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                {
                  id: createId('task'),
                  title: nextTaskTitle,
                  owner: studentProfile.name.split(' ')[0],
                  state: 'Next',
                  due: 'This week',
                },
              ],
            }
          : project
      )
    );
    setTaskDrafts((current) => ({
      ...current,
      [projectId]: '',
    }));
    addNotification({
      title: 'New task added',
      message: `${nextTaskTitle} was added to the project task list.`,
      audience: ['student', 'instructor'],
    });
  };

  const applyToInternship = (internshipId: string) => {
    const targetInternship = internships.find(
      (internship) => internship.id === internshipId
    );

    if (!targetInternship || targetInternship.applicationStatus !== 'Not Applied') {
      return;
    }

    setInternships((current) =>
      current.map((internship) =>
        internship.id === internshipId
          ? {
              ...internship,
              applicationStatus: 'Applied',
              applications: [
                {
                  id: createId('application'),
                  student: studentProfile.name,
                  university: 'GUC',
                  status: 'Applied',
                  score: 91,
                  coverLetter: coverLetter.trim(),
                },
                ...internship.applications,
              ],
            }
          : internship
      )
    );

    addNotification({
      title: 'Internship application sent',
      message: `Your application for ${targetInternship.title} was added to the pipeline.`,
      audience: ['student', 'employer'],
    });
  };

  const toggleInternshipFavorite = (internshipId: string) => {
    setInternships((current) =>
      current.map((internship) =>
        internship.id === internshipId
          ? { ...internship, favorite: !internship.favorite }
          : internship
      )
    );
  };

  const saveStudentProfile = () => {
    addNotification({
      title: 'Student profile updated',
      message: 'The student profile details were refreshed for the prototype.',
      audience: ['student'],
    });
  };

  const saveEmployerProfile = () => {
    addNotification({
      title: 'Company profile updated',
      message: 'Company details were updated and are ready for the demo.',
      audience: ['employer'],
    });
  };

  const saveInstructorProfile = () => {
    addNotification({
      title: 'Instructor profile updated',
      message: 'Instructor biography and interests were updated.',
      audience: ['instructor'],
    });
  };

  const uploadEmployerDocument = () => {
    const nextDocument = `Verification Pack ${
      employerProfile.documents.length + 1
    }.pdf`;

    setEmployerProfile((current) => ({
      ...current,
      documents: [...current.documents, nextDocument],
    }));

    addNotification({
      title: 'Verification document uploaded',
      message: `${nextDocument} is now waiting for administrator review.`,
      audience: ['employer', 'admin'],
      tone: 'warn',
    });
  };

  const startEditingInternship = (internshipId: string) => {
    const target = internships.find((internship) => internship.id === internshipId);
    if (!target) {
      return;
    }

    setEditingInternshipId(internshipId);
    setInternshipDraft({
      title: target.title,
      location: target.location,
      duration: target.duration,
      description: target.description,
    });
  };

  const clearInternshipDraft = () => {
    setEditingInternshipId(null);
    setInternshipDraft(emptyInternshipDraft);
  };

  const saveInternshipDraft = () => {
    if (!internshipDraft.title.trim() || !internshipDraft.description.trim()) {
      return;
    }

    if (editingInternshipId) {
      setInternships((current) =>
        current.map((internship) =>
          internship.id === editingInternshipId
            ? {
                ...internship,
                title: internshipDraft.title.trim(),
                location: internshipDraft.location,
                duration: internshipDraft.duration,
                description: internshipDraft.description.trim(),
              }
            : internship
        )
      );
      addNotification({
        title: 'Internship updated',
        message: `${internshipDraft.title.trim()} was updated.`,
        audience: ['employer'],
      });
    } else {
      setInternships((current) => [
        {
          id: createId('internship'),
          title: internshipDraft.title.trim(),
          company: initialEmployerProfile.companyName,
          companyName: initialEmployerProfile.companyName,
          duration: internshipDraft.duration,
          location: internshipDraft.location,
          salary: 'Paid',
          deadline: '30 Apr 2026',
          postedOn: 'Today',
          contributors: 4,
          description: internshipDraft.description.trim(),
          tags: ['Frontend', 'Prototype'],
          favorite: false,
          recommended: false,
          status: 'Live',
          applicationStatus: 'Not Applied',
          applications: [],
        },
        ...current,
      ]);
      addNotification({
        title: 'Internship created',
        message: `${internshipDraft.title.trim()} was added to the employer workspace.`,
        audience: ['employer', 'student'],
      });
    }

    clearInternshipDraft();
  };

  const toggleInternshipStatus = (
    internshipId: string,
    nextStatus: Internship['status']
  ) => {
    setInternships((current) =>
      current.map((internship) =>
        internship.id === internshipId
          ? { ...internship, status: nextStatus }
          : internship
      )
    );
  };

  const deleteInternship = (internshipId: string) => {
    setInternships((current) =>
      current.filter((internship) => internship.id !== internshipId)
    );
  };

  const updateApplicantStatus = (
    internshipId: string,
    applicationId: string,
    nextStatus: 'Shortlisted' | 'Accepted' | 'Rejected'
  ) => {
    setInternships((current) =>
      current.map((internship) => {
        if (internship.id !== internshipId) {
          return internship;
        }

        const applications = internship.applications.map((application) =>
          application.id === applicationId
            ? { ...application, status: nextStatus }
            : application
        );
        const studentApplication = applications.find(
          (application) => application.student === studentProfile.name
        );

        return {
          ...internship,
          applications,
          applicationStatus: studentApplication
            ? studentApplication.status
            : internship.applicationStatus,
        };
      })
    );

    addNotification({
      title: 'Application status changed',
      message: `An applicant was moved to ${nextStatus.toLowerCase()}.`,
      audience: ['student', 'employer'],
      tone: nextStatus === 'Rejected' ? 'warn' : 'accent',
    });
  };

  const toggleCourseLink = (code: string) => {
    if (code === 'BP401') {
      return;
    }

    const targetCourse = courses.find((course) => course.code === code);
    if (!targetCourse) {
      return;
    }

    const nextLinked = !targetCourse.linked;
    setCourses((current) =>
      current.map((course) =>
        course.code === code ? { ...course, linked: nextLinked } : course
      )
    );
    setInstructorProfile((current) => ({
      ...current,
      linkedCourses: nextLinked
        ? [...current.linkedCourses, targetCourse.name]
        : current.linkedCourses.filter((courseName) => courseName !== targetCourse.name),
    }));

    addNotification({
      title: nextLinked ? 'Course linked' : 'Course unlinked',
      message: `${targetCourse.name} was ${nextLinked ? 'linked' : 'unlinked'} successfully.`,
      audience: ['instructor', 'admin'],
    });
  };

  const addReviewComment = (projectId: string) => {
    const draft =
      reviewDrafts[projectId]?.trim() ||
      'The project direction is strong. Keep simplifying dense screens for the final demo.';

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              feedback: [
                {
                  id: createId('feedback'),
                  author: instructorProfile.name,
                  scope: 'General project feedback',
                  visibility: 'Private',
                  message: draft,
                },
                ...project.feedback,
              ],
            }
          : project
      )
    );
    setReviewDrafts((current) => ({ ...current, [projectId]: '' }));

    addNotification({
      title: 'Review comment added',
      message: 'A new instructor comment was attached to a project.',
      audience: ['student', 'instructor'],
    });
  };

  const rateProject = (projectId: string, rating: number) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, rating: Math.max(0, Math.min(5, rating)) }
          : project
      )
    );
  };

  const flagProject = (projectId: string) => {
    const targetProject = projects.find((project) => project.id === projectId);
    if (!targetProject) {
      return;
    }

    setAppeals((current) => [
      {
        id: createId('appeal'),
        projectTitle: targetProject.title,
        raisedBy: studentProfile.name,
        reason: 'Project flagged for a manual plagiarism check.',
        studentMessage:
          'This is original work by the team, and all reused references are cited.',
        status: 'Pending Review',
      },
      ...current,
    ]);

    addNotification({
      title: 'Project flagged',
      message: `${targetProject.title} was flagged and is now visible in the appeals queue.`,
      audience: ['student', 'instructor', 'admin'],
      tone: 'warn',
    });
  };

  const updateCompanyRequest = (
    requestId: string,
    nextStatus: 'Approved' | 'Rejected'
  ) => {
    const target = companyRequests.find((request) => request.id === requestId);
    if (!target) {
      return;
    }

    setCompanyRequests((current) =>
      current.map((request) =>
        request.id === requestId ? { ...request, status: nextStatus } : request
      )
    );

    if (target.companyName === initialEmployerProfile.companyName) {
      setEmployerProfile((current) => ({
        ...current,
        verificationStatus: nextStatus,
      }));
    }

    addNotification({
      title: `Company ${nextStatus.toLowerCase()}`,
      message: `${target.companyName} was ${nextStatus.toLowerCase()} by the administrator.`,
      audience: ['admin', 'employer'],
      tone: nextStatus === 'Rejected' ? 'warn' : 'accent',
    });
  };

  const resolveAppeal = (appealId: string) => {
    setAppeals((current) =>
      current.map((appeal) =>
        appeal.id === appealId ? { ...appeal, status: 'Resolved' } : appeal
      )
    );
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'Active' ? 'Inactive' : 'Active',
            }
          : user
      )
    );
  };

  const openConversation = (conversationId: string) => {
    navigateToPage('inbox', conversationId);
  };

  const returnToConversationList = () => {
    navigateToPage('inbox');
  };

  const setActiveMessageDraft = (value: string) => {
    if (!selectedConversationId) {
      return;
    }

    setMessageDrafts((current) => ({
      ...current,
      [selectedConversationId]: value,
    }));
  };

  const sendMessage = () => {
    if (!session || !selectedConversationId || !activeMessageDraft.trim()) {
      return;
    }

    setConversationsByRole((current) => ({
      ...current,
      [session.role]: current[session.role].map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              unread: 0,
              messages: [
                ...conversation.messages,
                {
                  id: createId('message'),
                  author: 'me',
                  body: activeMessageDraft.trim(),
                  time: 'Just now',
                },
              ],
            }
          : conversation
      ),
    }));
    setMessageDrafts((current) => ({
      ...current,
      [selectedConversationId]: '',
    }));
  };

  const toggleNotificationsEnabled = () => {
    if (!session) {
      return;
    }

    setNotificationPreferences((current) => ({
      ...current,
      [session.role]: !current[session.role],
    }));
  };

  const sharedMessageProps = session
    ? {
        conversations: activeConversations,
        selectedConversation,
        messageDraft: activeMessageDraft,
        setMessageDraft: setActiveMessageDraft,
        onOpenConversation: openConversation,
        onBackToConversationList: returnToConversationList,
        sendMessage,
      }
    : null;

  const sharedNotificationProps = session
    ? {
        notifications: activeNotifications,
        notificationsEnabled: notificationPreferences[session.role],
        onToggleNotificationsEnabled: toggleNotificationsEnabled,
        onToggleNotificationRead: toggleNotificationRead,
      }
    : null;

  const renderWorkspace = () => {
    if (!session || !sharedMessageProps || !sharedNotificationProps) {
      return null;
    }

    switch (session.role) {
      case 'student':
        return (
          <StudentWorkspace
            currentPage={currentPage}
            studentProfile={studentProfile}
            setStudentProfile={setStudentProfile}
            projects={projects}
            featuredProject={featuredProject}
            internships={studentInternships}
            internshipQuery={studentInternshipQuery}
            setInternshipQuery={setStudentInternshipQuery}
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            setCurrentPage={navigateToPage}
            toggleProjectVisibility={toggleProjectVisibility}
            setFeaturedProjectById={setFeaturedProjectById}
            saveStudentProfile={saveStudentProfile}
            addTaskToProject={addTaskToProject}
            taskDrafts={taskDrafts}
            setTaskDrafts={setTaskDrafts}
            applyToInternship={applyToInternship}
            toggleInternshipFavorite={toggleInternshipFavorite}
            {...sharedMessageProps}
            notifications={sharedNotificationProps.notifications}
            notificationsEnabled={sharedNotificationProps.notificationsEnabled}
            onToggleNotificationsEnabled={
              sharedNotificationProps.onToggleNotificationsEnabled
            }
            onToggleNotificationRead={sharedNotificationProps.onToggleNotificationRead}
          />
        );
      case 'employer':
        return (
          <EmployerWorkspace
            currentPage={currentPage}
            employerProfile={employerProfile}
            setEmployerProfile={setEmployerProfile}
            saveEmployerProfile={saveEmployerProfile}
            uploadEmployerDocument={uploadEmployerDocument}
            employerInternships={employerInternships}
            internshipDraft={internshipDraft}
            setInternshipDraft={setInternshipDraft}
            editingInternshipId={editingInternshipId}
            clearInternshipDraft={clearInternshipDraft}
            saveInternshipDraft={saveInternshipDraft}
            startEditingInternship={startEditingInternship}
            toggleInternshipStatus={toggleInternshipStatus}
            deleteInternship={deleteInternship}
            portfolios={portfolios}
            setCurrentPage={navigateToPage}
            updateApplicantStatus={updateApplicantStatus}
            {...sharedMessageProps}
            notifications={sharedNotificationProps.notifications}
            notificationsEnabled={sharedNotificationProps.notificationsEnabled}
            onToggleNotificationsEnabled={
              sharedNotificationProps.onToggleNotificationsEnabled
            }
            onToggleNotificationRead={sharedNotificationProps.onToggleNotificationRead}
          />
        );
      case 'instructor':
        return (
          <InstructorWorkspace
            currentPage={currentPage}
            instructorProfile={instructorProfile}
            setInstructorProfile={setInstructorProfile}
            saveInstructorProfile={saveInstructorProfile}
            courses={courses}
            toggleCourseLink={toggleCourseLink}
            projects={projects}
            reviewDrafts={reviewDrafts}
            setReviewDrafts={setReviewDrafts}
            addReviewComment={addReviewComment}
            rateProject={rateProject}
            flagProject={flagProject}
            pendingInvitations={pendingInvitations}
            setCurrentPage={navigateToPage}
            {...sharedMessageProps}
            notifications={sharedNotificationProps.notifications}
            notificationsEnabled={sharedNotificationProps.notificationsEnabled}
            onToggleNotificationsEnabled={
              sharedNotificationProps.onToggleNotificationsEnabled
            }
            onToggleNotificationRead={sharedNotificationProps.onToggleNotificationRead}
          />
        );
      case 'admin':
        return (
          <AdminWorkspace
            currentPage={currentPage}
            companyRequests={companyRequests}
            updateCompanyRequest={updateCompanyRequest}
            appeals={appeals}
            resolveAppeal={resolveAppeal}
            users={users}
            toggleUserStatus={toggleUserStatus}
            courses={courses}
            projects={projects}
            featuredProject={featuredProject}
            instructorProfile={instructorProfile}
            setCurrentPage={navigateToPage}
            {...sharedMessageProps}
            notifications={sharedNotificationProps.notifications}
            notificationsEnabled={sharedNotificationProps.notificationsEnabled}
            onToggleNotificationsEnabled={
              sharedNotificationProps.onToggleNotificationsEnabled
            }
            onToggleNotificationRead={sharedNotificationProps.onToggleNotificationRead}
          />
        );
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <div
        className={`app-root ${darkMode ? 'theme-dark' : ''}`}
        style={{ fontSize: appFontSize }}
      >
        <LoginScreen
          accounts={demoAccounts}
          selectedAccount={selectedAccount}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          loginError={loginError}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div
      className={`app-root ${darkMode ? 'theme-dark' : ''}`}
      style={{ fontSize: appFontSize }}
    >
      <div className={`workspace-shell role-${activeRole}`}>
        <div
          className={`workspace-overlay ${isSidebarOpen ? 'visible' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside className={`workspace-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-head">
            <div className="brand-block">
              <p>BridgeBoard</p>
              <h1>Portfolio</h1>
            </div>
            <button
              type="button"
              className="ghost-button icon-button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <div className="session-card">
            <div className="session-avatar">{session.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <strong>{session.name}</strong>
              <span>{roleMeta[session.role].label}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {activePages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={`nav-link ${page.id === currentPage ? 'active' : ''}`}
                onClick={() => navigateToPage(page.id)}
              >
                <div>
                  <strong>{page.label}</strong>
                  <span>{page.description}</span>
                </div>
                {page.id === 'notifications' && unreadCount > 0 ? (
                  <Badge tone="accent">{unreadCount}</Badge>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <main className="workspace-main">
          <header className="workspace-topbar">
            <div className="topbar-left">
              <button
                type="button"
                className="ghost-button icon-button"
                onClick={() => {
                  setIsSidebarOpen((current) => !current);
                  setIsSettingsOpen(false);
                }}
                aria-label="Open menu"
              >
                ☰
              </button>
              <div className="topbar-copy">
                <p>{roleMeta[session.role].label}</p>
                <strong>{activePageMeta?.label}</strong>
              </div>
            </div>

            <div className="topbar-right">
              <Badge tone="accent">{unreadCount} unread</Badge>
              <div className="settings-wrap">
                <button
                  type="button"
                  className={`ghost-button ${isSettingsOpen ? 'active' : ''}`}
                  onClick={() => {
                    setIsSettingsOpen((current) => !current);
                    setIsSidebarOpen(false);
                  }}
                >
                  Settings
                </button>
                {isSettingsOpen ? (
                  <div className="settings-panel">
                    <div className="settings-block">
                      <span className="settings-label">Text size</span>
                      <div className="settings-segment">
                        {(['small', 'medium', 'large'] as FontScale[]).map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`settings-chip ${
                              fontScale === size ? 'active' : ''
                            }`}
                            onClick={() => setFontScale(size)}
                          >
                            {size === 'small'
                              ? 'Smaller'
                              : size === 'large'
                              ? 'Bigger'
                              : 'Default'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="settings-row">
                      <div>
                        <strong>Theme</strong>
                        <span>{darkMode ? 'Dark mode on' : 'Light mode on'}</span>
                      </div>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => setDarkMode((current) => !current)}
                      >
                        {darkMode ? 'Light mode' : 'Dark mode'}
                      </button>
                    </div>

                    <div className="settings-row">
                      <div>
                        <strong>Account</strong>
                        <span>{session.name}</span>
                      </div>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <button type="button" className="primary-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          {renderWorkspace()}
        </main>
      </div>
    </div>
  );
}

export default App;
