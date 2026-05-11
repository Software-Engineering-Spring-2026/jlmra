export type Role = 'student' | 'employer' | 'instructor' | 'admin';

export type TaskState = 'pending' | 'postponed' | 'completed';
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
  description: string;
  owner: string;
  state: TaskState;
  due: string;
  order: number;
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
  demoVideoUrl: string;
  reportUrl: string;
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
  isFlagged: boolean;
  isActive: boolean;
  flagReason?: string;
};

export type ThesisDraft = {
  id: string;
  title: string;
  fileUrl: string;
  uploadedAt: string;
  isFinal: boolean;
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
  profilePicture: string;
  thesisDrafts: ThesisDraft[];
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
  responsibilities: string;
  skills: string[];
  programmingLanguages: string[];
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
  profilePicture: string;
};

export type EmployerProfile = {
  companyName: string;
  industry: string;
  companyEmail: string;
  contactPhone: string;
  address: string;
  mapLocation: { lat: number; lng: number } | null;
  summary: string;
  documents: string[];
  verificationStatus: CompanyStatus;
  logo: string;
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
  profilePicture: string;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  password: string;
  otp: string;
  profilePicture: string;
};

export type Course = {
  code: string;
  name: string;
  instructor: string;
  linked: boolean;
  linkRequestStatus?: 'Pending' | 'Approved' | 'Rejected';
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
  name: 'Ahmed Hossam',
  major: 'Computer Science',
  graduation: 'Spring 2027',
  email: 'ahmed.hossam@student.guc.edu.eg',
  phone: '+20 109 304 1208',
  linkedin: 'linkedin.com/in/ahmed-hossam',
  bio: 'Full-stack developer focused on building scalable web applications and user-friendly interfaces.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  portfolioVisibility: 'Public',
  profilePicture: '',
  thesisDrafts: [
    {
      id: 'thesis-1',
      title: 'Bachelor Thesis Draft 1.pdf',
      fileUrl: '#',
      uploadedAt: '18 Apr 2026',
      isFinal: false,
    },
    {
      id: 'thesis-2',
      title: 'Bachelor Thesis Final Draft.pdf',
      fileUrl: '#',
      uploadedAt: '02 May 2026',
      isFinal: true,
    },
  ],
};

export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Career Compass',
    course: 'Bachelor Project',
    type: 'Capstone',
    createdAt: '12 Apr 2026',
    github: 'github.com/ahmedhossam/career-compass',
    languages: ['TypeScript', 'React', 'CSS'],
    demoVideoUrl: 'https://youtube.com/watch?v=demo1',
    reportUrl: '',
    summary: 'Internship discovery and project collaboration portal.',
    isFlagged: true,
    isActive: false,
    flagReason: 'Possible uncredited asset detected in the project demo.',
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
        owner: 'Ahmed',
        description: 'Build dashboard UI for recruiters',
        state: 'pending',
        due: 'Tomorrow',
        order: 1,
      },
      {
        id: 'task-2',
        title: 'Record updated demo video',
        owner: 'Sara',
        description: 'Record project demo video',
        state: 'postponed',
        due: 'This week',
        order: 2,
      },
      {
        id: 'task-3',
        title: 'Document testing checklist',
        owner: 'Karim',
        description: 'Create testing checklist',
        state: 'completed',
        due: 'Done',
        order: 3,
      },
    ],
    feedback: [
      {
        id: 'feedback-1',
        author: 'Jana Hassan',
        scope: 'General project feedback',
        visibility: 'Private',
        message: 'The user flow is strong. Tighten the internship comparison section so employers can scan it faster.',
      },
      {
        id: 'feedback-2',
        author: 'Jana Hassan',
        scope: 'Task feedback',
        visibility: 'Private',
        message: 'Your card hierarchy works well. Add a stronger highlight for pending invitations.',
      },
    ],
    invitations: [
      {
        id: 'invite-1',
        recipient: 'Jana Hassan',
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
    github: 'github.com/ahmedhossam/studio-queue',
    languages: ['React', 'Node mock', 'SCSS'],
    demoVideoUrl: 'https://youtube.com/watch?v=demo2',
    reportUrl: '',
    summary: 'A collaboration board for capstone teams to organize milestones, assign tasks, and collect instructor comments.',
    isFlagged: false,
    isActive: true,
    rating: 4.3,
    visibility: 'Private',
    featured: false,
    status: 'Draft',
    collaborators: ['Rawan Elshamy'],
    tags: ['Tasks', 'Feedback', 'Collaboration'],
    tasks: [
      {
        id: 'task-4',
        title: 'Refine mobile layout',
        owner: 'Ahmed',
        description: 'Build dashboard UI for recruiters',
        state: 'pending',
        due: 'Today',
        order: 1,
      },
      {
        id: 'task-5',
        title: 'Confirm course tagging',
        owner: 'Rawan',
        description: 'Record project demo video',
        state: 'postponed',
        due: 'Tomorrow',
        order: 2,
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
    github: 'github.com/ahmedhossam/campus-bazaar',
    languages: ['React', 'Framer mock', 'Chart UI'],
    demoVideoUrl: 'https://youtube.com/watch?v=demo3',
    reportUrl: '',
    summary: 'A marketplace concept for students to showcase projects and freelance work while collecting portfolio analytics.',
    isFlagged: false,
    isActive: true,
    rating: 4.6,
    visibility: 'Public',
    featured: false,
    status: 'Final Draft',
    collaborators: ['Rawan Elshamy', 'Nadine Fares'],
    tags: ['Marketplace', 'Analytics', 'Portfolio'],
    tasks: [
      {
        id: 'task-6',
        title: 'Update persona slides',
        owner: 'Rawan',
        description: 'Create testing checklist',
        state: 'completed',
        due: 'Done',
        order: 1,
      },
      {
        id: 'task-7',
        title: 'Simplify save-to-favorites flow',
        owner: 'Ahmed',
        description: 'Record project demo video',
        state: 'postponed',
        due: 'Friday',
        order: 2,
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
        recipient: 'Rawan Elshamy',
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
    responsibilities: 'Build React screens, fix usability issues, and document component behavior for the product team.',
    skills: ['React', 'Design Systems', 'Analytics'],
    programmingLanguages: ['TypeScript', 'JavaScript'],
    tags: ['React', 'Design Systems', 'Analytics'],
    favorite: true,
    recommended: true,
    status: 'Live',
    applicationStatus: 'Completed',
    applications: [
      {
        id: 'application-1',
        student: 'Ahmed Hossam',
        university: 'GUC',
        status: 'Completed',
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
    responsibilities: 'Convert Figma flows into reusable interface components and support design QA.',
    skills: ['UI Engineering', 'Component Libraries', 'Prototyping'],
    programmingLanguages: ['TypeScript', 'CSS'],
    tags: ['UI Engineering', 'Component Libraries', 'Prototyping'],
    favorite: false,
    recommended: true,
    status: 'Live',
    applicationStatus: 'Shortlisted',
    applications: [
      {
        id: 'application-3',
        student: 'Ahmed Hossam',
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
    responsibilities: 'Prototype trip-planning workflows, prepare user testing scripts, and summarize findings.',
    skills: ['Research', 'Figma', 'Journey Mapping'],
    programmingLanguages: ['JavaScript'],
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
    responsibilities: 'Create dashboard charts, define metrics, and validate data display with employer users.',
    skills: ['Data Viz', 'Dashboards', 'Frontend'],
    programmingLanguages: ['TypeScript', 'Python'],
    tags: ['Data Viz', 'Dashboards', 'Frontend'],
    favorite: false,
    recommended: true,
    status: 'Filled',
    applicationStatus: 'Completed',
    applications: [
      {
        id: 'application-4',
        student: 'Ahmed Hossam',
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
    name: 'Ahmed Hossam',
    email: 'ahmed.hossam@student.guc.edu.eg',
    major: 'Computer Science',
    topSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    projectsCount: 3,
    featuredProject: 'Career Compass',
    rating: 4.8,
    favorite: true,
    profilePicture: '',
  },
  {
    id: 'portfolio-2',
    name: 'Rawan Elshamy',
    email: 'rawan.elshamy@student.guc.edu.eg',
    major: 'Media Engineering',
    topSkills: ['Motion Design', 'Design Systems', 'Figma'],
    projectsCount: 5,
    featuredProject: 'Campus Bazaar',
    rating: 4.7,
    favorite: false,
    profilePicture: '',
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
    profilePicture: '',
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
    profilePicture: '',
  },
];

export const initialEmployerProfile: EmployerProfile = {
  companyName: 'Bright Labs',
  industry: 'Product Consultancy',
  companyEmail: 'lara.ahmed@brightlabs.io',
  contactPhone: '+20 122 440 9920',
  address: '5A Innovation District, New Cairo',
  mapLocation: { lat: 30.0131, lng: 31.2089 },
  summary: 'We help early-stage teams ship clearer product experiences with a focus on accessibility and performance.',
  documents: ['Tax Certificate 2025.pdf', 'Commercial Registry.pdf'],
  verificationStatus: 'Approved',
  logo: '',
};

export const initialCompanyRequests: CompanyRequest[] = [
  {
    id: 'company-1',
    companyName: 'Bright Labs',
    owner: 'Lara Ahmed',
    companyEmail: 'lara.ahmed@brightlabs.io',
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
  name: 'Jana Hassan',
  email: 'jana.hassan@guc.edu.eg',
  title: 'Course Instructor',
  bio: 'I work with students on end-to-end digital products, with a soft spot for clear interaction design and persuasive storytelling.',
  interests: ['HCI', 'Product Thinking', 'Critique Frameworks'],
  education: 'PhD in Human Computer Interaction',
  linkedCourses: ['Bachelor Project', 'CSEN 704'],
  profilePicture: '',
};

export const initialUsers: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Ahmed Hossam',
    email: 'ahmed.hossam@student.guc.edu.eg',
    role: 'student',
    status: 'Active',
    password: 'Student123',
    otp: '482190',
    profilePicture: '',
  },
  {
    id: 'user-2',
    name: 'Lara Ahmed',
    email: 'lara.ahmed@brightlabs.io',
    role: 'employer',
    status: 'Active',
    password: 'Employer123',
    otp: '913572',
    profilePicture: '',
  },
  {
    id: 'user-3',
    name: 'Jana Hassan',
    email: 'jana.hassan@guc.edu.eg',
    role: 'instructor',
    status: 'Active',
    password: 'Instructor123',
    otp: '640218',
    profilePicture: '',
  },
  {
    id: 'user-4',
    name: 'Malak Ebraheem',
    email: 'malak.ebraheem@guc.edu.eg',
    role: 'admin',
    status: 'Active',
    password: 'Admin123',
    otp: '225790',
    profilePicture: '',
  },
  {
    id: 'user-5',
    name: 'Rawan Elshamy',
    email: 'rawan.elshamy@student.guc.edu.eg',
    role: 'student',
    status: 'Active',
    password: 'Student123',
    otp: '573829',
    profilePicture: '',
  },
];

export const initialCourses: Course[] = [
  {
    code: 'BP401',
    name: 'Bachelor Project',
    instructor: 'Jana Hassan',
    linked: true,
  },
  {
    code: 'CSEN 704',
    name: 'Interaction Design Studio',
    instructor: 'Jana Hassan',
    linked: true,
  },
  {
    code: 'CSEN 703',
    name: 'Frontend Product Engineering',
    instructor: 'Dr. Salma Nabil',
    linked: false,
    linkRequestStatus: 'Pending',
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
    raisedBy: 'Ahmed Hossam',
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
    id: 'note-0',
    title: 'Project flagged',
    message: 'Career Compass was flagged: Possible uncredited asset detected in the project demo.',
    time: 'Just now',
    audience: ['student'],
    read: false,
    tone: 'warn',
  },
  {
    id: 'note-1',
    title: 'Course instructor invitation sent',
    message: 'Jana Hassan was invited to collaborate on Career Compass.',
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
    message: 'Ahmed Hossam moved to shortlisted for UI Engineer Intern.',
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
      name: 'Lara Ahmed',
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
      name: 'Jana Hassan',
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
      name: 'Ahmed Hossam',
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
      name: 'Malak Ebraheem',
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
      name: 'Jana Hassan',
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
      name: 'Ahmed Hossam',
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
      name: 'Malak Ebraheem',
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
      name: 'Lara Ahmed',
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
      name: 'Jana Hassan',
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
      name: 'Ahmed Hossam',
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
