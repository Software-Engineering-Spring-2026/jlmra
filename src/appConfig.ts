import { type Role } from './mockData';

export type WorkspacePage =
  | 'dashboard'
  | 'profile'
  | 'portfolio'
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

// Demo login data:
// Student: Ahmed Hossam | ahmed.hossam@student.guc.edu.eg | Student123 | OTP: 482190
// Employer: Lara Ahmed | lara.ahmed@brightlabs.io | Employer123 | OTP: 913572
// Instructor: Jana Hassan | jana.hassan@guc.edu.eg | Instructor123 | OTP: 640218
// Admin: Malak Ebraheem | malak.ebraheem@guc.edu.eg | Admin123 | OTP: 225790
// Extra Student: Rawan Elshamy | rawan.elshamy@student.guc.edu.eg | Student123 | OTP: 573829

export const demoAccounts: DemoAccount[] = [
  {
    id: 'demo-student',
    role: 'student',
    name: 'Ahmed Hossam',
    email: 'ahmed.hossam@student.guc.edu.eg',
    password: 'Student123',
    otp: '482190',
    landingPage: 'dashboard',
  },
  {
    id: 'demo-employer',
    role: 'employer',
    name: 'Lara Ahmed',
    email: 'lara.ahmed@brightlabs.io',
    password: 'Employer123',
    otp: '913572',
    landingPage: 'dashboard',
  },
  {
    id: 'demo-instructor',
    role: 'instructor',
    name: 'Jana Hassan',
    email: 'jana.hassan@guc.edu.eg',
    password: 'Instructor123',
    otp: '640218',
    landingPage: 'dashboard',
  },
  {
    id: 'demo-admin',
    role: 'admin',
    name: 'Malak Ebraheem',
    email: 'malak.ebraheem@guc.edu.eg',
    password: 'Admin123',
    otp: '225790',
    landingPage: 'dashboard',
  },
  {
    id: 'demo-student-2',
    role: 'student',
    name: 'Rawan Elshamy',
    email: 'rawan.elshamy@student.guc.edu.eg',
    password: 'Student123',
    otp: '573829',
    landingPage: 'dashboard',
  },
];

export const pagesByRole: Record<Role, PageMeta[]> = {
  student: [
    { id: 'dashboard', label: 'Dashboard', description: 'Home' },
    { id: 'portfolio', label: 'Portfolio', description: 'Your profile' },
    { id: 'projects', label: 'Projects', description: 'Manage projects' },
    { id: 'internships', label: 'Internships', description: 'Find opportunities' },
    { id: 'inbox', label: 'Messages', description: 'Chat' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts' },
  ],
  employer: [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview' },
    { id: 'profile', label: 'Company', description: 'Profile' },
    { id: 'internships', label: 'Internships', description: 'Postings' },
    { id: 'applicants', label: 'Applicants', description: 'Candidates' },
    { id: 'inbox', label: 'Messages', description: 'Chat' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts' },
  ],
  instructor: [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview' },
    { id: 'profile', label: 'Profile', description: 'Your info' },
    { id: 'courses', label: 'Courses', description: 'Teaching' },
    { id: 'reviews', label: 'Reviews', description: 'Grade projects' },
    { id: 'inbox', label: 'Messages', description: 'Chat' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview' },
    { id: 'approvals', label: 'Approvals', description: 'Verify' },
    { id: 'users', label: 'Users', description: 'Manage' },
    { id: 'analytics', label: 'Analytics', description: 'Stats' },
    { id: 'inbox', label: 'Messages', description: 'Chat' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts' },
  ],
};
