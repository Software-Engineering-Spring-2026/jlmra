export type Role = 'student' | 'employer' | 'instructor' | 'admin';

export type TaskState = 'Done' | 'In Progress' | 'Next';
export type InvitationStatus = 'Pending' | 'Accepted' | 'Rejected';
export type ProjectVisibility = 'Public' | 'Private';
export type ApplicationStatus =
  | 'Not Applied'
  | 'Applied'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Completed';
export type InternshipStatus = 'Live' | 'Filled' | 'Archived';
export type CompanyStatus = 'Pending' | 'Approved' | 'Rejected';
export type AccountStatus = 'Active' | 'Inactive';
export type AppealStatus = 'Pending Review' | 'Resolved';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  audience: Role[];
  read: boolean;
  tone: 'neutral' | 'accent' | 'warn';
};

export type MessageBubble = {
  id: string;
  author: 'me' | 'them';
  body: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  unread: number;
  messages: MessageBubble[];
};

export type ProjectTask = {
  id: string;
  title: string;
  owner: string;
  state: TaskState;
  due: string;
};

export type ProjectFeedback = {
  id: string;
  author: string;
  scope: string;
  visibility: 'Private' | 'Public';
  message: string;
};

export type ProjectInvitation = {
  id: string;
  recipient: string;
  role: 'Student' | 'Course Instructor';
  status: InvitationStatus;
};

export type Project = {
  id: string;
  title: string;
  course: string;
  type: string;
  createdAt: string;
  github: string;
  languages: string[];
  demo: string;
  summary: string;
  rating: number;
  visibility: ProjectVisibility;
  featured: boolean;
  status: 'Draft' | 'Final Draft';
  collaborators: string[];
  tags: string[];
  tasks: ProjectTask[];
  feedback: ProjectFeedback[];
  invitations: ProjectInvitation[];
};

export type StudentProfile = {
  name: string;
  major: string;
  graduation: string;
  email: string;
  phone: string;
  linkedin: string;
  bio: string;
  skills: string[];
  portfolioVisibility: 'Public' | 'Private';
};

export type InternshipApplication = {
  id: string;
  student: string;
  university: string;
  status: Exclude<ApplicationStatus, 'Not Applied'>;
  score: number;
  coverLetter: string;
};

export type Internship = {
  id: string;
  title: string;
  company: string;
  companyName: string;
  duration: string;
  location: string;
  salary: string;
  deadline: string;
  postedOn: string;
  contributors: number;
  description: string;
  tags: string[];
  favorite: boolean;
  recommended: boolean;
  status: InternshipStatus;
  applicationStatus: ApplicationStatus;
  applications: InternshipApplication[];
};

export type PortfolioCard = {
  id: string;
  name: string;
  email: string;
  major: string;
  topSkills: string[];
  projectsCount: number;
  featuredProject: string;
  rating: number;
  favorite: boolean;
};

export type EmployerProfile = {
  companyName: string;
  industry: string;
  companyEmail: string;
  contactPhone: string;
  address: string;
  mapLabel: string;
  summary: string;
  documents: string[];
  verificationStatus: CompanyStatus;
};

export type CompanyRequest = {
  id: string;
  companyName: string;
  owner: string;
  companyEmail: string;
  address: string;
  summary: string;
  documents: string[];
  status: CompanyStatus;
};

export type InstructorProfile = {
  name: string;
  email: string;
  title: string;
  bio: string;
  interests: string[];
  education: string;
  linkedCourses: string[];
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
};

export type Course = {
  code: string;
  name: string;
  instructor: string;
  linked: boolean;
};

export type Appeal = {
  id: string;
  projectTitle: string;
  raisedBy: string;
  reason: string;
  studentMessage: string;
  status: AppealStatus;
};

export const roleMeta: Record<Role, { label: string }> = {
  student: {
    label: 'Student',
  },
  employer: {
    label: 'Employer',
  },
  instructor: {
    label: 'Course Instructor',
  },
  admin: {
    label: 'Administrator',
  },
};

export const initialStudentProfile: StudentProfile = {
  name: 'Lina Hassan',
  major: 'Computer Science',
  graduation: 'Spring 2027',
  email: 'lina.hassan@student.guc.edu.eg',
  phone: '+20 109 304 1208',
  linkedin: 'linkedin.com/in/lina-hassan-ui',
  bio: 'Frontend-focused builder who enjoys turning messy workflows into clear, usable interfaces for students and recruiters.',
  skills: ['React', 'TypeScript', 'UI Systems', 'Accessibility', 'Figma'],
  portfolioVisibility: 'Public',
};

export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Career Compass',
    course: 'Bachelor Project',
    type: 'Capstone',
    createdAt: '12 Apr 2026',
    github: 'github.com/linahassan/career-compass',
    languages: ['TypeScript', 'React', 'CSS'],
    demo: '2m 14s walkthrough',
    summary: 'A student-first portal that helps discover internships, compare portfolios, and manage project collaboration.',
    rating: 4.8,
    visibility: 'Public',
    featured: true,
    status: 'Final Draft',
    collaborators: ['Karim Tarek', 'Sara Youssef'],
    tags: ['Portfolio', 'Internships', 'Accessibility'],
    tasks: [
      {
        id: 'task-1',
        title: 'Ship recruiter review dashboard',
        owner: 'Lina',
        state: 'In Progress',
        due: 'Tomorrow',
      },
      {
        id: 'task-2',
        title: 'Record updated demo video',
        owner: 'Sara',
        state: 'Next',
        due: 'This week',
      },
      {
        id: 'task-3',
        title: 'Document testing checklist',
        owner: 'Karim',
        state: 'Done',
        due: 'Done',
      },
    ],
    feedback: [
      {
        id: 'feedback-1',
        author: 'Dr. Maya El-Adl',
        scope: 'General project feedback',
        visibility: 'Private',
        message: 'The user flow is strong. Tighten the internship comparison section so employers can scan it faster.',
      },
      {
        id: 'feedback-2',
        author: 'Dr. Maya El-Adl',
        scope: 'Task feedback',
        visibility: 'Private',
        message: 'Your card hierarchy works well. Add a stronger highlight for pending invitations.',
      },
    ],
    invitations: [
      {
        id: 'invite-1',
        recipient: 'Dr. Maya El-Adl',
        role: 'Course Instructor',
        status: 'Pending',
      },
      {
        id: 'invite-2',
        recipient: 'Youssef Adel',
        role: 'Student',
        status: 'Accepted',
      },
    ],
  },
  {
    id: 'project-2',
    title: 'Studio Queue',
    course: 'CSEN 704',
    type: 'Course Project',
    createdAt: '04 Apr 2026',
    github: 'github.com/linahassan/studio-queue',
    languages: ['React', 'Node mock', 'SCSS'],
    demo: '1m 31s prototype clip',
    summary: 'A collaboration board for capstone teams to organize milestones, assign tasks, and collect instructor comments.',
    rating: 4.3,
    visibility: 'Private',
    featured: false,
    status: 'Draft',
    collaborators: ['Nour Emad'],
    tags: ['Tasks', 'Feedback', 'Collaboration'],
    tasks: [
      {
        id: 'task-4',
        title: 'Refine mobile layout',
        owner: 'Lina',
        state: 'In Progress',
        due: 'Today',
      },
      {
        id: 'task-5',
        title: 'Confirm course tagging',
        owner: 'Nour',
        state: 'Next',
        due: 'Tomorrow',
      },
    ],
    feedback: [
      {
        id: 'feedback-3',
        author: 'Dr. Salma Nabil',
        scope: 'Task feedback',
        visibility: 'Private',
        message: 'Move the task sorting control closer to the list so the action feels more direct.',
      },
    ],
    invitations: [
      {
        id: 'invite-3',
        recipient: 'Dr. Salma Nabil',
        role: 'Course Instructor',
        status: 'Accepted',
      },
    ],
  },
  {
    id: 'project-3',
    title: 'Campus Bazaar',
    course: 'CSEN 703',
    type: 'Course Project',
    createdAt: '24 Mar 2026',
    github: 'github.com/linahassan/campus-bazaar',
    languages: ['React', 'Framer mock', 'Chart UI'],
    demo: '3m 02s pitch deck',
    summary: 'A marketplace concept for students to showcase projects and freelance work while collecting portfolio analytics.',
    rating: 4.6,
    visibility: 'Public',
    featured: false,
    status: 'Final Draft',
    collaborators: ['Mariam Tamer', 'Nadine Fares'],
    tags: ['Marketplace', 'Analytics', 'Portfolio'],
    tasks: [
      {
        id: 'task-6',
        title: 'Update persona slides',
        owner: 'Mariam',
        state: 'Done',
        due: 'Done',
      },
      {
        id: 'task-7',
        title: 'Simplify save-to-favorites flow',
        owner: 'Lina',
        state: 'Next',
        due: 'Friday',
      },
    ],
    feedback: [
      {
        id: 'feedback-4',
        author: 'Dr. Hany Shaker',
        scope: 'General project feedback',
        visibility: 'Public',
        message: 'Excellent concept. Consider exposing the project visibility setting more clearly in the portfolio view.',
      },
    ],
    invitations: [
      {
        id: 'invite-4',
        recipient: 'Mariam Tamer',
        role: 'Student',
        status: 'Accepted',
      },
    ],
  },
];

export const initialInternships: Internship[] = [
  {
    id: 'internship-1',
    title: 'Frontend Product Intern',
    company: 'Bright Labs',
    companyName: 'Bright Labs',
    duration: '3 months',
    location: 'New Cairo',
    salary: 'Paid',
    deadline: '28 Apr 2026',
    postedOn: '14 Apr 2026',
    contributors: 8,
    description: 'Work with a lean product team to ship a student-facing dashboard for internship tracking and discovery.',
    tags: ['React', 'Design Systems', 'Analytics'],
    favorite: true,
    recommended: true,
    status: 'Live',
    applicationStatus: 'Applied',
    applications: [
      {
        id: 'application-1',
        student: 'Lina Hassan',
        university: 'GUC',
        status: 'Applied',
        score: 92,
        coverLetter: 'I care deeply about turning complex flows into calm, understandable interfaces and would love to contribute to your dashboard.',
      },
      {
        id: 'application-2',
        student: 'Salma Adel',
        university: 'GUC',
        status: 'Shortlisted',
        score: 88,
        coverLetter: 'My capstone work focused on analytics-heavy interfaces, which aligns well with this internship.',
      },
    ],
  },
  {
    id: 'internship-2',
    title: 'UI Engineer Intern',
    company: 'Pulse Systems',
    companyName: 'Pulse Systems',
    duration: '2 months',
    location: 'Hybrid',
    salary: 'Paid',
    deadline: '22 Apr 2026',
    postedOn: '10 Apr 2026',
    contributors: 5,
    description: 'Partner with product designers to translate polished concepts into reusable frontend components.',
    tags: ['UI Engineering', 'Component Libraries', 'Prototyping'],
    favorite: false,
    recommended: true,
    status: 'Live',
    applicationStatus: 'Shortlisted',
    applications: [
      {
        id: 'application-3',
        student: 'Lina Hassan',
        university: 'GUC',
        status: 'Shortlisted',
        score: 95,
        coverLetter: 'I have shipped reusable component libraries in both coursework and freelance projects and enjoy maintaining UI consistency.',
      },
    ],
  },
  {
    id: 'internship-3',
    title: 'Product Design Intern',
    company: 'Nile Mobility',
    companyName: 'Nile Mobility',
    duration: '6 weeks',
    location: 'Smart Village',
    salary: 'Paid',
    deadline: '29 Apr 2026',
    postedOn: '16 Apr 2026',
    contributors: 12,
    description: 'Prototype trip-planning experiences, support user testing, and document interface decisions for a mobility product.',
    tags: ['Research', 'Figma', 'Journey Mapping'],
    favorite: true,
    recommended: false,
    status: 'Live',
    applicationStatus: 'Not Applied',
    applications: [],
  },
  {
    id: 'internship-4',
    title: 'Data Visualization Intern',
    company: 'Orbit Analytics',
    companyName: 'Orbit Analytics',
    duration: '10 weeks',
    location: 'Remote',
    salary: 'Paid',
    deadline: '11 Apr 2026',
    postedOn: '26 Mar 2026',
    contributors: 4,
    description: 'Help transform recruiting and portfolio data into explainable dashboards for administrators and employers.',
    tags: ['Data Viz', 'Dashboards', 'Frontend'],
    favorite: false,
    recommended: true,
    status: 'Filled',
    applicationStatus: 'Completed',
    applications: [
      {
        id: 'application-4',
        student: 'Lina Hassan',
        university: 'GUC',
        status: 'Accepted',
        score: 90,
        coverLetter: 'I enjoy pairing visual hierarchy with evidence-backed storytelling, especially when surfacing trends for stakeholders.',
      },
    ],
  },
];

export const initialPortfolios: PortfolioCard[] = [
  {
    id: 'portfolio-1',
    name: 'Lina Hassan',
    email: 'lina.hassan@student.guc.edu.eg',
    major: 'Computer Science',
    topSkills: ['React', 'TypeScript', 'Accessibility'],
    projectsCount: 3,
    featuredProject: 'Career Compass',
    rating: 4.8,
    favorite: true,
  },
  {
    id: 'portfolio-2',
    name: 'Mariam Tamer',
    email: 'mariam.tamer@student.guc.edu.eg',
    major: 'Media Engineering',
    topSkills: ['Motion Design', 'Design Systems', 'Figma'],
    projectsCount: 5,
    featuredProject: 'Campus Bazaar',
    rating: 4.7,
    favorite: false,
  },
  {
    id: 'portfolio-3',
    name: 'Youssef Adel',
    email: 'youssef.adel@student.guc.edu.eg',
    major: 'Computer Engineering',
    topSkills: ['Testing', 'APIs', 'Dev Tools'],
    projectsCount: 4,
    featuredProject: 'Build Monitor',
    rating: 4.4,
    favorite: true,
  },
  {
    id: 'portfolio-4',
    name: 'Nadine Fares',
    email: 'nadine.fares@student.guc.edu.eg',
    major: 'Business Informatics',
    topSkills: ['Product Strategy', 'Research', 'Presentation'],
    projectsCount: 2,
    featuredProject: 'Talent Grid',
    rating: 4.5,
    favorite: false,
  },
];

export const initialEmployerProfile: EmployerProfile = {
  companyName: 'Bright Labs',
  industry: 'Product Consultancy',
  companyEmail: 'talent@brightlabs.io',
  contactPhone: '+20 122 440 9920',
  address: '5A Innovation District, New Cairo',
  mapLabel: 'Google Maps pin synced to New Cairo HQ',
  summary: 'Bright Labs builds product operations software for education and early-career hiring teams.',
  documents: ['Tax Certificate.pdf', 'Commercial Register.pdf', 'Brand Guidelines.pdf'],
  verificationStatus: 'Pending',
};

export const initialCompanyRequests: CompanyRequest[] = [
  {
    id: 'company-1',
    companyName: 'Bright Labs',
    owner: 'Mariam Saad',
    companyEmail: 'talent@brightlabs.io',
    address: '5A Innovation District, New Cairo',
    summary: 'Product consultancy hiring interns for frontend, research, and analytics roles.',
    documents: ['Tax Certificate.pdf', 'Commercial Register.pdf'],
    status: 'Pending',
  },
  {
    id: 'company-2',
    companyName: 'Nile Mobility',
    owner: 'Hassan Omar',
    companyEmail: 'careers@nilemobility.com',
    address: 'Smart Village, Building 12',
    summary: 'Mobility startup focused on route planning and rider operations.',
    documents: ['Tax Certificate.pdf', 'Commercial Register.pdf'],
    status: 'Approved',
  },
  {
    id: 'company-3',
    companyName: 'Orbit Analytics',
    owner: 'Sara Tarek',
    companyEmail: 'hello@orbitanalytics.io',
    address: 'Maadi Technology Park',
    summary: 'Data analytics firm supporting recruiting and business intelligence teams.',
    documents: ['Tax Certificate.pdf'],
    status: 'Rejected',
  },
];

export const initialInstructorProfile: InstructorProfile = {
  name: 'Dr. Maya El-Adl',
  email: 'maya.eladl@guc.edu.eg',
  title: 'Course Instructor',
  bio: 'I work with students on end-to-end digital products, with a soft spot for clear interaction design and persuasive storytelling.',
  interests: ['HCI', 'Product Thinking', 'Critique Frameworks'],
  education: 'PhD in Human Computer Interaction',
  linkedCourses: ['Bachelor Project', 'CSEN 704'],
};

export const initialUsers: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Lina Hassan',
    email: 'lina.hassan@student.guc.edu.eg',
    role: 'student',
    status: 'Active',
  },
  {
    id: 'user-2',
    name: 'Mariam Saad',
    email: 'talent@brightlabs.io',
    role: 'employer',
    status: 'Active',
  },
  {
    id: 'user-3',
    name: 'Dr. Maya El-Adl',
    email: 'maya.eladl@guc.edu.eg',
    role: 'instructor',
    status: 'Active',
  },
  {
    id: 'user-4',
    name: 'Nor Mohamed',
    email: 'nor.mohamed@guc.edu.eg',
    role: 'admin',
    status: 'Active',
  },
  {
    id: 'user-5',
    name: 'Sara Tarek',
    email: 'hello@orbitanalytics.io',
    role: 'employer',
    status: 'Inactive',
  },
];

export const initialCourses: Course[] = [
  {
    code: 'BP401',
    name: 'Bachelor Project',
    instructor: 'Dr. Maya El-Adl',
    linked: true,
  },
  {
    code: 'CSEN 704',
    name: 'Interaction Design Studio',
    instructor: 'Dr. Maya El-Adl',
    linked: true,
  },
  {
    code: 'CSEN 703',
    name: 'Frontend Product Engineering',
    instructor: 'Dr. Salma Nabil',
    linked: false,
  },
  {
    code: 'CSEN 702',
    name: 'Product Discovery',
    instructor: 'Dr. Hany Shaker',
    linked: false,
  },
];

export const initialAppeals: Appeal[] = [
  {
    id: 'appeal-1',
    projectTitle: 'Career Compass',
    raisedBy: 'Lina Hassan',
    reason: 'A project section was flagged for possible uncredited assets.',
    studentMessage: 'The animations are licensed from our team kit. I have now attached attribution in the project notes.',
    status: 'Pending Review',
  },
  {
    id: 'appeal-2',
    projectTitle: 'Talent Grid',
    raisedBy: 'Nadine Fares',
    reason: 'A plagiarism flag was raised on presentation slides.',
    studentMessage: 'The deck structure is original to our team. Similarity came from the provided course template.',
    status: 'Resolved',
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'note-1',
    title: 'Course instructor invitation sent',
    message: 'Dr. Maya El-Adl was invited to collaborate on Career Compass.',
    time: '5 min ago',
    audience: ['student'],
    read: false,
    tone: 'accent',
  },
  {
    id: 'note-2',
    title: 'New project invitation received',
    message: 'Career Compass invited you to review the latest final draft.',
    time: '12 min ago',
    audience: ['instructor'],
    read: false,
    tone: 'accent',
  },
  {
    id: 'note-3',
    title: 'Verification documents uploaded',
    message: 'Bright Labs uploaded two company documents for admin review.',
    time: '27 min ago',
    audience: ['admin', 'employer'],
    read: false,
    tone: 'warn',
  },
  {
    id: 'note-4',
    title: 'New shortlisted candidate',
    message: 'Lina Hassan moved to shortlisted for UI Engineer Intern.',
    time: '1 hr ago',
    audience: ['student', 'employer'],
    read: true,
    tone: 'accent',
  },
  {
    id: 'note-5',
    title: 'Weekly recommendations ready',
    message: 'Three new projects and two portfolios match your search filters.',
    time: '3 hrs ago',
    audience: ['student', 'employer', 'instructor', 'admin'],
    read: true,
    tone: 'neutral',
  },
  {
    id: 'note-6',
    title: 'Appeal requires review',
    message: 'Career Compass submitted an appeal for a project flag.',
    time: 'Today',
    audience: ['admin'],
    read: false,
    tone: 'warn',
  },
];

export const initialConversationsByRole: Record<Role, Conversation[]> = {
  student: [
    {
      id: 'student-conversation-1',
      name: 'Mariam Saad',
      role: 'Employer',
      subtitle: 'Bright Labs',
      unread: 2,
      messages: [
        {
          id: 'message-1',
          author: 'them',
          body: 'Your portfolio stood out to us, especially the project visibility controls and internship analytics ideas.',
          time: '10:12',
        },
        {
          id: 'message-2',
          author: 'me',
          body: 'Thank you. I would be happy to walk you through the prototype and the thinking behind the interaction model.',
          time: '10:16',
        },
        {
          id: 'message-3',
          author: 'them',
          body: 'Please share your availability this week for a short intro call.',
          time: '10:19',
        },
      ],
    },
    {
      id: 'student-conversation-2',
      name: 'Dr. Maya El-Adl',
      role: 'Course Instructor',
      subtitle: 'Bachelor Project',
      unread: 0,
      messages: [
        {
          id: 'message-4',
          author: 'them',
          body: 'The overall direction is promising. Before the milestone review, give the notifications panel one stronger hierarchy cue.',
          time: 'Yesterday',
        },
        {
          id: 'message-5',
          author: 'me',
          body: 'I will update the layout and make unread items more prominent.',
          time: 'Yesterday',
        },
      ],
    },
    {
      id: 'student-conversation-3',
      name: 'Karim Tarek',
      role: 'Student Collaborator',
      subtitle: 'Career Compass',
      unread: 1,
      messages: [
        {
          id: 'message-6',
          author: 'them',
          body: 'I pushed the revised demo script. Could you add one more task for the updated walkthrough?',
          time: 'Today',
        },
      ],
    },
  ],
  employer: [
    {
      id: 'employer-conversation-1',
      name: 'Lina Hassan',
      role: 'Student',
      subtitle: 'Career Compass portfolio',
      unread: 1,
      messages: [
        {
          id: 'message-7',
          author: 'me',
          body: 'We liked the clarity of your featured project. Are you available for a short screening call?',
          time: '09:10',
        },
        {
          id: 'message-8',
          author: 'them',
          body: 'Yes, I am free after 2 PM tomorrow if that works for your team.',
          time: '09:18',
        },
      ],
    },
    {
      id: 'employer-conversation-2',
      name: 'Nor Mohamed',
      role: 'Administrator',
      subtitle: 'Company verification',
      unread: 0,
      messages: [
        {
          id: 'message-9',
          author: 'them',
          body: 'Your commercial register was received. Please keep one contact phone visible on the company profile.',
          time: 'Yesterday',
        },
      ],
    },
    {
      id: 'employer-conversation-3',
      name: 'Dr. Maya El-Adl',
      role: 'Course Instructor',
      subtitle: 'Internship feedback',
      unread: 0,
      messages: [
        {
          id: 'message-10',
          author: 'me',
          body: 'We would appreciate a quick recommendation on strong frontend students for the current opening.',
          time: 'Monday',
        },
      ],
    },
  ],
  instructor: [
    {
      id: 'instructor-conversation-1',
      name: 'Lina Hassan',
      role: 'Student',
      subtitle: 'Career Compass review',
      unread: 1,
      messages: [
        {
          id: 'message-11',
          author: 'them',
          body: 'I updated the project structure and made the notifications page easier to scan. Would you like me to submit the final draft now?',
          time: '11:05',
        },
      ],
    },
    {
      id: 'instructor-conversation-2',
      name: 'Nor Mohamed',
      role: 'Administrator',
      subtitle: 'Course link request',
      unread: 0,
      messages: [
        {
          id: 'message-12',
          author: 'them',
          body: 'CSEN 703 is ready to be linked to your profile after the latest admin review.',
          time: 'Yesterday',
        },
      ],
    },
    {
      id: 'instructor-conversation-3',
      name: 'Dr. Salma Nabil',
      role: 'Course Instructor',
      subtitle: 'Studio course coordination',
      unread: 0,
      messages: [
        {
          id: 'message-13',
          author: 'me',
          body: 'I will cover the next batch of portfolio reviews if you handle the first round of draft comments.',
          time: 'Sunday',
        },
      ],
    },
  ],
  admin: [
    {
      id: 'admin-conversation-1',
      name: 'Mariam Saad',
      role: 'Employer',
      subtitle: 'Bright Labs approval',
      unread: 1,
      messages: [
        {
          id: 'message-14',
          author: 'them',
          body: 'We uploaded the updated tax certificate and company logo. Please let us know if anything else is needed.',
          time: '08:40',
        },
      ],
    },
    {
      id: 'admin-conversation-2',
      name: 'Dr. Maya El-Adl',
      role: 'Course Instructor',
      subtitle: 'Flagged project review',
      unread: 0,
      messages: [
        {
          id: 'message-15',
          author: 'them',
          body: 'I left review notes on the flagged project. The student appeal looks reasonable after the citations update.',
          time: 'Yesterday',
        },
      ],
    },
    {
      id: 'admin-conversation-3',
      name: 'Lina Hassan',
      role: 'Student',
      subtitle: 'Appeal follow-up',
      unread: 0,
      messages: [
        {
          id: 'message-16',
          author: 'me',
          body: 'Your appeal is under review. We will update the project status once the instructor feedback is finalized.',
          time: 'Monday',
        },
      ],
    },
  ],
};
