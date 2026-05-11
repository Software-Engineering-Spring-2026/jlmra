import { type Role } from './mockData';
import { type IconName } from './components/icons';

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
  | 'directory'
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
  icon: IconName;
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
    { id: 'dashboard', label: 'Dashboard', description: 'Home', icon: 'dashboard' },
    {id: 'profile', label: 'Profile', description:'Your profile', icon:'user'},
    { id: 'portfolio', label: 'Portfolio', description: 'Your profile', icon: 'portfolio' },
    { id: 'projects', label: 'Projects', description: 'Manage projects', icon: 'folder' },
    { id: 'internships', label: 'Internships', description: 'Find opportunities', icon: 'briefcase' },
    { id: 'directory', label: 'Directory', description: 'Search', icon: 'search' },
    { id: 'inbox', label: 'Messages', description: 'Chat', icon: 'mail' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts', icon: 'bell' },
  ],
  employer: [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview', icon: 'dashboard' },
    { id: 'profile', label: 'Company', description: 'Profile', icon: 'building' },
    { id: 'internships', label: 'Internships', description: 'Postings', icon: 'briefcase' },
    { id: 'applicants', label: 'Applicants', description: 'Candidates', icon: 'users' },
    { id: 'directory', label: 'Directory', description: 'Search', icon: 'search' },
    { id: 'inbox', label: 'Messages', description: 'Chat', icon: 'mail' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts', icon: 'bell' },
  ],
  instructor: [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview', icon: 'dashboard' },
    { id: 'profile', label: 'Profile', description: 'Your info', icon: 'user' },
    { id: 'courses', label: 'Courses', description: 'Teaching', icon: 'portfolio' },
    { id: 'reviews', label: 'Reviews', description: 'Grade projects', icon: 'review' },
    { id: 'directory', label: 'Directory', description: 'Search', icon: 'search' },
    { id: 'inbox', label: 'Messages', description: 'Chat', icon: 'mail' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts', icon: 'bell' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview', icon: 'dashboard' },
    { id: 'approvals', label: 'Approvals', description: 'Verify', icon: 'check' },
    { id: 'users', label: 'Users', description: 'Manage', icon: 'users' },
    { id: 'analytics', label: 'Analytics', description: 'Stats', icon: 'analytics' },
    { id: 'directory', label: 'Directory', description: 'Search', icon: 'search' },
    { id: 'inbox', label: 'Messages', description: 'Chat', icon: 'mail' },
    { id: 'notifications', label: 'Notifications', description: 'Alerts', icon: 'bell' },
    { id: 'profile', label: 'Profile', description: 'Your profile', icon: 'user' },
  ],
};
