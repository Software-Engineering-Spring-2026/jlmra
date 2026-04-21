import { type Role } from './mockData';

export type WorkspacePage =
  | 'dashboard'
  | 'profile'
  | 'projects'
  | 'internships'
  | 'applicants'
  | 'courses'
  | 'reviews'
  | 'approvals'
  | 'users'
  | 'analytics'
  | 'inbox'
  | 'notifications';

export type DemoAccount = {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string;
  otp: string;
  landingPage: WorkspacePage;
};

export type PageMeta = {
  id: WorkspacePage;
  label: string;
  description: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    id: 'demo-student',
    role: 'student',
    name: 'Lina Hassan',
    email: 'lina.hassan@student.guc.edu.eg',
    password: 'Student123',
    otp: '482190',
    landingPage: 'profile',
  },
  {
    id: 'demo-employer',
    role: 'employer',
    name: 'Mariam Saad',
    email: 'talent@brightlabs.io',
    password: 'Employer123',
    otp: '482190',
    landingPage: 'profile',
  },
  {
    id: 'demo-instructor',
    role: 'instructor',
    name: 'Dr. Maya El-Adl',
    email: 'maya.eladl@guc.edu.eg',
    password: 'Instructor123',
    otp: '482190',
    landingPage: 'profile',
  },
  {
    id: 'demo-admin',
    role: 'admin',
    name: 'Nor Mohamed',
    email: 'nor.mohamed@guc.edu.eg',
    password: 'Admin123',
    otp: '482190',
    landingPage: 'dashboard',
  },
];

export const pagesByRole: Record<Role, PageMeta[]> = {
  student: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Your student home page with the most important project and internship updates.',
    },
    {
      id: 'profile',
      label: 'My Profile',
      description: 'Your public-facing portfolio profile and visibility settings.',
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'Focused project cards with tasks, feedback, and collaboration details.',
    },
    {
      id: 'internships',
      label: 'Internships',
      description: 'Search, save, and apply to internships without leaving the student workspace.',
    },
    {
      id: 'inbox',
      label: 'Messages',
      description: 'Private conversations with employers, instructors, and collaborators.',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Unread alerts, read states, and notification preferences.',
    },
  ],
  employer: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'A clean hiring snapshot with verification status, openings, and candidate activity.',
    },
    {
      id: 'profile',
      label: 'Company Profile',
      description: 'Your company details, uploaded documents, and verification information.',
    },
    {
      id: 'internships',
      label: 'Internships',
      description: 'Create, edit, archive, and review your internship postings.',
    },
    {
      id: 'applicants',
      label: 'Applicants',
      description: 'Review students by internship and move them through the pipeline.',
    },
    {
      id: 'inbox',
      label: 'Messages',
      description: 'Private messages with students and instructors.',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Hiring and verification alerts for the employer account.',
    },
  ],
  instructor: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'A teaching overview with course links, pending invitations, and review workload.',
    },
    {
      id: 'profile',
      label: 'My Profile',
      description: 'Your public instructor profile, biography, interests, and education.',
    },
    {
      id: 'courses',
      label: 'Courses',
      description: 'All available courses, including linked courses and Bachelor Project.',
    },
    {
      id: 'reviews',
      label: 'Reviews',
      description: 'Project comments, ratings, and flagging actions in one review page.',
    },
    {
      id: 'inbox',
      label: 'Messages',
      description: 'Private communication with students and the admin team.',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Project invitation, review, and course-link alert management.',
    },
  ],
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Platform-level status for approvals, users, appeals, and overall activity.',
    },
    {
      id: 'approvals',
      label: 'Approvals',
      description: 'Employer approvals, documents, and student appeals in one page.',
    },
    {
      id: 'users',
      label: 'Users',
      description: 'Activate or deactivate users and review course administration data.',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Platform summary cards and simple usage indicators for the PM demo.',
    },
    {
      id: 'inbox',
      label: 'Messages',
      description: 'Internal communication and private messages for the admin role.',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Unread administrative alerts and approval-related notifications.',
    },
  ],
};
