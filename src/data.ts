/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Setting,
  PortfolioRecord,
  StudentProfile,
  Dissertation,
  ResearchHour,
  CompetencyAssessment,
  AdvisorComment,
  Endorsement,
  Evidence,
  Notification,
  ChatMessage,
  ActivityLog
} from './types';

import { db, isFirebaseEnabled } from './lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// Helper to generate IDs
export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// Standard Setting List
export const getInitialSettings = (): Setting[] => [
  {
    SettingKey: 'APP_NAME',
    SettingValue: 'Doctoral Student Portfolio',
    Description: 'Application display name',
    Example: 'Doctoral Student Portfolio',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'UNIVERSITY_NAME',
    SettingValue: 'Thammasat University',
    Description: 'Host University name',
    Example: 'Thammasat University',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'FACULTY_NAME',
    SettingValue: 'Faculty of Nursing',
    Description: 'Host Faculty name',
    Example: 'Faculty of Nursing',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'PROGRAM_NAME',
    SettingValue: 'Doctor of Philosophy Program in Nursing Science',
    Description: 'Doctoral program name',
    Example: 'Doctor of Philosophy Program in Nursing Science',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'THEME_PRIMARY',
    SettingValue: '#F9C94A',
    Description: 'Primary yellow gold brand color',
    Example: '#F9C94A',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'THEME_SECONDARY',
    SettingValue: '#B91C1C',
    Description: 'Secondary dark crimson color',
    Example: '#B91C1C',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'ENABLE_CHAT',
    SettingValue: 'TRUE',
    Description: 'Enable real-time-like communication module',
    Example: 'TRUE',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'ENABLE_NOTIFY',
    SettingValue: 'TRUE',
    Description: 'Enable advisor broadcast announcements',
    Example: 'TRUE',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'REQUIRE_180_RESEARCH_HOURS',
    SettingValue: 'TRUE',
    Description: 'Require doctoral students to log 180 research development hours',
    Example: 'TRUE',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'DEFAULT_LANGUAGE',
    SettingValue: 'en',
    Description: 'Default interface locale',
    Example: 'en',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'ALLOW_ADVISOR_EDIT',
    SettingValue: 'TRUE',
    Description: 'Allows advisor role to edit certain student portfolio records',
    Example: 'TRUE',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'MAX_UPLOAD_MB',
    SettingValue: '10',
    Description: 'Maximum allowed attachment size in MB',
    Example: '10',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'EVIDENCE_FOLDER_NAME',
    SettingValue: 'Portfolio Evidence',
    Description: 'Default Google Drive folder name for storing proof materials',
    Example: 'Portfolio Evidence',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'PRINT_HEADER_TEXT',
    SettingValue: 'Doctoral Student Portfolio - Faculty of Nursing, Thammasat University',
    Description: 'Text displayed on top of print pages',
    Example: 'Doctoral Student Portfolio',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  },
  {
    SettingKey: 'SAMPLE_DATA_CREATED',
    SettingValue: 'TRUE',
    Description: 'Flag indicates mock database has been set up',
    Example: 'TRUE',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM'
  }
];

// Initial Users
export const getInitialUsers = (): User[] => [
  {
    UserID: 'U_ADMIN',
    Email: 'admin@example.com',
    Password: '1234',
    Role: 'Admin',
    Prefix: 'Mr.',
    FirstName: 'Sarayut',
    LastName: 'Pornrat',
    FullName: 'Mr. Sarayut Pornrat',
    Position: 'Database Administrator',
    Affiliation: 'Faculty of Nursing, Thammasat University',
    Phone: '025644444',
    LineID: 'tu_nursing_admin',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    UserID: 'U_ADVISOR',
    Email: 'advisor@example.com',
    Password: '1234',
    Role: 'Advisor',
    Prefix: 'Asst. Prof. Dr.',
    FirstName: 'Anchalee',
    LastName: 'Jedsadaphan',
    FullName: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    Position: 'Major Advisor / Thesis Chairperson',
    Affiliation: 'Faculty of Nursing, Thammasat University',
    Phone: '0815556677',
    LineID: 'dr.anchalee',
    ResearchInterests: 'Geriatric Care, Cardiovascular Tele-nursing, Chronic Disease Management, Quantitative Synthesis',
    ORCID: '0000-0002-3456-7890',
    PhotoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    UserID: 'U_COADVISOR',
    Email: 'coadvisor@example.com',
    Password: '1234',
    Role: 'CoAdvisor',
    Prefix: 'Assoc. Prof. Dr.',
    FirstName: 'Somchai',
    LastName: 'Prasert',
    FullName: 'Assoc. Prof. Dr. Somchai Prasert',
    Position: 'Thesis Co-advisor',
    Affiliation: 'Faculty of Medicine, Mahidol University',
    Phone: '0891112233',
    LineID: 'somchai_m',
    ResearchInterests: 'Digital Health Interventions, Cardiology, Patient Outcome Studies',
    ORCID: '0000-0003-8877-6655',
    PhotoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    UserID: 'U_SUPER_ADVISOR',
    Email: 'superadvisor@example.com',
    Password: '1234',
    Role: 'SuperAdvisor',
    Prefix: 'Prof. Dr.',
    FirstName: 'Chaiwat',
    LastName: 'Rattanakul',
    FullName: 'Prof. Dr. Chaiwat Rattanakul',
    Position: 'Dean of Graduate Studies / SuperAdvisor',
    Affiliation: 'Faculty of Nursing, Thammasat University',
    Phone: '0819998877',
    LineID: 'chaiwat_super',
    ResearchInterests: 'Nursing Education Standards, Advanced Nursing Practice Policy',
    ORCID: '0000-0001-9876-5432',
    PhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    UserID: 'U_STUDENT_1',
    Email: 'student@example.com',
    Password: '1234',
    Role: 'Student',
    Prefix: 'Mr.',
    FirstName: 'Kittisak',
    LastName: 'Meeprasert',
    FullName: 'Mr. Kittisak Meeprasert',
    StudentID: '6814320001', // kept as string plain text always
    Program: 'Doctor of Philosophy Program in Nursing Science (International)',
    Faculty: 'Faculty of Nursing',
    University: 'Thammasat University',
    AdmissionYear: 2026,
    ExpectedGraduationYear: 2029,
    MajorAdvisorID: 'U_ADVISOR',
    CoAdvisorIDs: 'U_COADVISOR',
    Phone: '0812345678', // plain text, zero leading preserved
    LineID: 'kittisak.m',
    ResearchInterests: 'Gerontological Nursing, Digital Self-care Systems, Cardiovascular Patient Monitoring',
    ORCID: '0000-0001-9876-5432',
    PhotoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    UserID: 'U_STUDENT_2',
    Email: 'pirunnapa.ben@example.com',
    Password: '1234',
    Role: 'Student',
    Prefix: 'Ms.',
    FirstName: 'Pirunnapa',
    LastName: 'Benchaphan',
    FullName: 'Ms. Pirunnapa Benchaphan',
    StudentID: '6814320039', // plain text string
    Program: 'Doctor of Philosophy Program in Nursing Science (Thai Program)',
    Faculty: 'Faculty of Nursing',
    University: 'Thammasat University',
    AdmissionYear: 2026,
    ExpectedGraduationYear: 2029,
    MajorAdvisorID: 'U_ADVISOR',
    CoAdvisorIDs: 'U_COADVISOR',
    Phone: '0890001234', // plain text string
    LineID: 'pirunnapa_b',
    ResearchInterests: 'Pediatric Cardiac Rehabilitation, Mindfulness-Based Therapy, Clinical Safety Indicators',
    ORCID: '0000-0002-4545-6767',
    PhotoURL: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  }
];

// Initial Portfolio Records for Student 1 (Covering section 1 to 16)
export const getInitialPortfolioRecords = (): PortfolioRecord[] => {
  const records: PortfolioRecord[] = [];
  const students = ['U_STUDENT_1', 'U_STUDENT_2'];

  students.forEach((std) => {
    // 1.2 Academic Background (Section 1.2)
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 1,
      SectionTitle: 'Student Profile',
      SubsectionNo: '1.2',
      SubsectionTitle: 'Academic Background',
      RecordType: 'table_row',
      Field1: 'Master of Science in Nursing',
      Field2: 'Adult and Gerontological Nursing',
      Field3: 'Thammasat University',
      Field4: '2025',
      Field5: 'GPA 3.85',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 1,
      SectionTitle: 'Student Profile',
      SubsectionNo: '1.2',
      SubsectionTitle: 'Academic Background',
      RecordType: 'table_row',
      Field1: 'Bachelor of Science in Nursing',
      Field2: 'Nursing Science',
      Field3: 'Mahidol University',
      Field4: '2020',
      Field5: 'GPA 3.62',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 1.3 Professional Background
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 1,
      SectionTitle: 'Student Profile',
      SubsectionNo: '1.3',
      SubsectionTitle: 'Professional Background',
      RecordType: 'table_row',
      Field1: '2021 - 2025',
      Field2: 'Registered Nurse (Cardio-Vascular Ward)',
      Field3: 'Thammasat University Hospital',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 2.1 Planned Program of Study
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 2,
      SectionTitle: 'Program of Study and Academic Milestones',
      SubsectionNo: '2.1',
      SubsectionTitle: 'Planned Program of Study',
      RecordType: 'table_row',
      Field1: 'Semester 1 / 2026',
      Field2: 'NS 801',
      Field3: 'Philosophical Foundations in Nursing Science',
      Field4: '3',
      Field5: 'Completed (Grade A)',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 2,
      SectionTitle: 'Program of Study and Academic Milestones',
      SubsectionNo: '2.1',
      SubsectionTitle: 'Planned Program of Study',
      RecordType: 'table_row',
      Field1: 'Semester 1 / 2026',
      Field2: 'NS 802',
      Field3: 'Advanced Nursing Research Methodology',
      Field4: '3',
      Field5: 'Completed (Grade A)',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 2.2 Doctoral Milestones
    const milestones = [
      { name: 'Coursework completion', plan: '2026-10-30', act: '2026-10-25', rem: 'All core subjects completed successfully' },
      { name: 'Meeting the English language requirement', plan: '2026-12-15', act: '2026-11-20', rem: 'Achieved TOEFL ITP 555' },
      { name: 'Completion of 180 research experience hours', plan: '2027-10-01', act: '', rem: 'In progress (110 hours logged)' },
      { name: 'Qualifying examination', plan: '2027-02-10', act: '', rem: 'Scheduled' },
      { name: 'Dissertation proposal development', plan: '2027-05-15', act: '', rem: 'Drafting' },
      { name: 'Proposal defense', plan: '2027-08-30', act: '', rem: '' }
    ];

    milestones.forEach((m) => {
      records.push({
        RecordID: generateId('R'),
        StudentUserID: std,
        SectionNo: 2,
        SectionTitle: 'Program of Study and Academic Milestones',
        SubsectionNo: '2.2',
        SubsectionTitle: 'Doctoral Milestones and Timeline',
        RecordType: 'table_row',
        Field1: m.name,
        Field2: m.plan,
        Field3: m.act,
        Field4: m.rem,
        Status: 'Approved',
        CreatedBy: 'SYSTEM_SAMPLE',
        CreatedAt: new Date().toISOString(),
        UpdatedBy: 'SYSTEM_SAMPLE',
        UpdatedAt: new Date().toISOString()
      });
    });

    // 3.1 English Language Test
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 3,
      SectionTitle: 'English Language Proficiency Requirement',
      SubsectionNo: '3.1',
      SubsectionTitle: 'Record of English Language Test',
      RecordType: 'table_row',
      Field1: 'TOEFL ITP',
      Field2: '2026-05-18',
      Field3: '555',
      Field4: '500',
      Field5: 'Pass',
      Field6: 'Yes',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 3.2 English Development Activities
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 3,
      SectionTitle: 'English Language Proficiency Requirement',
      SubsectionNo: '3.2',
      SubsectionTitle: 'English Development Activities',
      RecordType: 'table_row',
      Field1: '2026-04-10',
      Field2: 'Academic Writing Course',
      Field3: 'TU Language Institute',
      Field4: '16 hours intensive writing practice',
      Field5: 'Certificate available',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 4.1 Courses Completed
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 4,
      SectionTitle: 'Coursework and Academic Development',
      SubsectionNo: '4.1',
      SubsectionTitle: 'Courses Completed',
      RecordType: 'table_row',
      Field1: 'NS 801',
      Field2: 'Philosophical Foundations in Nursing Science',
      Field3: '1/2026',
      Field4: '3',
      Field5: 'A',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 4.2 Key Learning from Coursework
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 4,
      SectionTitle: 'Coursework and Academic Development',
      SubsectionNo: '4.2',
      SubsectionTitle: 'Key Learning from Coursework',
      RecordType: 'table_row',
      Field1: 'NS 802 Advanced Methods',
      Field2: 'Deep understanding of mixed-methods designs and meta-analysis techniques.',
      Field3: 'Applied directly to drafting Chapter 3 of the dissertation proposal.',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 4.3 Workshops, Training, and Short Courses
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 4,
      SectionTitle: 'Coursework and Academic Development',
      SubsectionNo: '4.3',
      SubsectionTitle: 'Workshops, Training, and Short Courses',
      RecordType: 'table_row',
      Field1: '2026-06-12',
      Field2: 'Research Ethics Training (CITI Program)',
      Field3: 'Thammasat Human Research Ethics Committee',
      Field4: 'Participant',
      Field5: 'Acquired certification for Human Subjects Protection',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 4.4 Certifications
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 4,
      SectionTitle: 'Coursework and Academic Development',
      SubsectionNo: '4.4',
      SubsectionTitle: 'Certifications',
      RecordType: 'table_row',
      Field1: 'Human Subjects Protection (Social & Behavioral)',
      Field2: 'CITI Program',
      Field3: '2026-06-12',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 5.3 Dissertation Progress Record
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 5,
      SectionTitle: 'Research Development and Dissertation Progress',
      SubsectionNo: '5.3',
      SubsectionTitle: 'Dissertation Progress Record',
      RecordType: 'table_row',
      Field1: 'Chapter 1: Introduction and Scope',
      Field2: '2026-03-01 to 2026-05-30',
      Field3: 'Approved draft with advisor revisions implemented',
      Field4: 'Evidence Draft PDF attached',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 5.4 Meetings with Advisor / Committee
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 5,
      SectionTitle: 'Research Development and Dissertation Progress',
      SubsectionNo: '5.4',
      SubsectionTitle: 'Meetings with Advisor / Committee',
      RecordType: 'table_row',
      Field1: '2026-06-15',
      Field2: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
      Field3: 'Refinement of theoretical framework and target variables of tele-nursing care',
      Field4: 'Incorporate self-efficacy theories into the primary model and update proposal draft',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 7.1 Conference Presentations
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 7,
      SectionTitle: 'Scholarly Output',
      SubsectionNo: '7.1',
      SubsectionTitle: 'Conference Presentations',
      RecordType: 'table_row',
      Field1: '2026-05-24',
      Field2: 'Digital Solutions for Chronic Cardiac Illness: A Systematic Review',
      Field3: 'International Conference on Nursing Innovation',
      Field4: 'Oral Presentation',
      Field5: 'Bangkok, Thailand - Published in proceedings',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 7.2 Publications
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 7,
      SectionTitle: 'Scholarly Output',
      SubsectionNo: '7.2',
      SubsectionTitle: 'Publications',
      RecordType: 'table_row',
      Field1: '2026',
      Field2: 'Development of Cardiac Tele-nursing Models: A Meta-synthesis',
      Field3: 'Journal of Thai Nursing Science',
      Field4: 'Published',
      Field5: 'DOI: 10.1234/jtns.2026.012',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 7.3 Manuscripts in Preparation
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 7,
      SectionTitle: 'Scholarly Output',
      SubsectionNo: '7.3',
      SubsectionTitle: 'Manuscripts in Preparation',
      RecordType: 'table_row',
      Field1: 'Applying Mobile App Integration in Cardiovascular Post-discharge Cohorts',
      Field2: 'Journal of Cardiovascular Nursing',
      Field3: 'Writing Introduction & Methods',
      Field4: 'Planned Submission: Dec 2026',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 7.4 Research Grants and Funding
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 7,
      SectionTitle: 'Scholarly Output',
      SubsectionNo: '7.4',
      SubsectionTitle: 'Research Grants and Funding',
      RecordType: 'table_row',
      Field1: 'TU PhD Graduate Research Grant',
      Field2: 'Thammasat University Graduate School',
      Field3: 'Principal Investigator',
      Field4: '150,000 THB',
      Field5: '2026 - 2028',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 7.5 Awards and Recognition
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 7,
      SectionTitle: 'Scholarly Output',
      SubsectionNo: '7.5',
      SubsectionTitle: 'Awards and Recognition',
      RecordType: 'table_row',
      Field1: '2026-05-25',
      Field2: 'Outstanding Student Oral Presenter Award',
      Field3: 'International Conference on Nursing Innovation',
      Field4: 'Award plaque and certificate',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 8.1 Teaching Experience During the PhD Program
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 8,
      SectionTitle: 'Teaching, Mentoring, and Academic Service',
      SubsectionNo: '8.1',
      SubsectionTitle: 'Teaching Experience During the PhD Program',
      RecordType: 'table_row',
      Field1: 'Semester 1/2026',
      Field2: 'Basic Health Assessment (Laboratory)',
      Field3: 'Co-instructor / Facilitator',
      Field4: 'Sophomore Bachelor Students (120 students)',
      Field5: 'Delivered cardiopulmonary auscultation sessions',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 8.2 Student Supervision or Mentoring
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 8,
      SectionTitle: 'Teaching, Mentoring, and Academic Service',
      SubsectionNo: '8.2',
      SubsectionTitle: 'Student Supervision or Mentoring',
      RecordType: 'table_row',
      Field1: '2026-03 to 2026-06',
      Field2: 'Mentoring 3 senior nursing students in thesis projects',
      Field3: 'Undergraduate level',
      Field4: 'Faciliated basic SPSS analyses and research write-up guidance',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 8.3 Academic and Professional Service
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 8,
      SectionTitle: 'Teaching, Mentoring, and Academic Service',
      SubsectionNo: '8.3',
      SubsectionTitle: 'Academic and Professional Service',
      RecordType: 'table_row',
      Field1: '2026-06',
      Field2: 'Volunteered health screening and counselling caravan',
      Field3: 'Medical Service Staff',
      Field4: 'Thammasat Outpatient Welfare Program',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 9.1 Leadership Experiences
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 9,
      SectionTitle: 'Professional Development and Leadership',
      SubsectionNo: '9.1',
      SubsectionTitle: 'Leadership Experiences',
      RecordType: 'table_row',
      Field1: '2026',
      Field2: 'President of Doctoral Nursing Student Committee',
      Field3: 'Graduate Student Body, TU Faculty of Nursing',
      Field4: 'Organized academic peer support clubs and clinical journal discussions',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });

    // 13.3 Action Plan for Next Review
    records.push({
      RecordID: generateId('R'),
      StudentUserID: std,
      SectionNo: 13,
      SectionTitle: 'Annual Review Summary',
      SubsectionNo: '13.3',
      SubsectionTitle: 'Action Plan for the Next Review Period',
      RecordType: 'table_row',
      Field1: 'Submit proposal to Ethics Committee',
      Field2: 'Finish drafts and obtain signatures',
      Field3: 'Sept 2026',
      Field4: 'Weekly meetings with major advisor',
      Status: 'Approved',
      CreatedBy: 'SYSTEM_SAMPLE',
      CreatedAt: new Date().toISOString(),
      UpdatedBy: 'SYSTEM_SAMPLE',
      UpdatedAt: new Date().toISOString()
    });
  });

  return records;
};

// Initial Student Profiles (Rich-text elements matching Section 1.4, 2.3, 3.3, 6.2, 9.2, 9.3, 10.1-10.4, 13.1, 13.2, 14.1-14.3)
export const getInitialStudentProfiles = (): StudentProfile[] => [
  {
    ProfileID: 'SP_1',
    StudentUserID: 'U_STUDENT_1',
    FullName: 'Mr. Kittisak Meeprasert',
    ContactInformation: 'Email: student@example.com | Tel: 0812345678',
    CurrentPositionAffiliation: 'Research Fellow & Nurse specialist, Thammasat Hospital',
    ResearchInterests: 'Gerontological Tele-nursing, self-care interventions, cardiology and stroke rehab pathways',
    ORCID: '0000-0001-9876-5432',
    GoalsForDoctoralStudy: 'I am committed to developing highly efficacious, mobile-supported nursing intervention models that enhance self-care capacity in rural Thai older adults recovering from ischemic events. I strive to grow as an independent nurse scholar and leader in digital clinical workflows.',
    DevelopmentPlan: 'Key Focus Areas for this review block:\n- Advance quantitative research designs.\n- Master heart failure self-efficacy assessment scales.\n- Enhance academic publication speed.',
    EnglishReflection: 'The academic writing workshop drastically boosted my confidence in compiling research introductions and structuring abstract proposals. Continuous English reading has expanded my medical informatics vocabulary.',
    ResearchExperienceReflection: 'Participating as a research assistant under Dr. Anchalee exposed me to real-world clinical trial protocols, data ethics reviews, and the complexity of patient consent processes on busy hospital wards.',
    NetworkingReflection: 'Engaging with scholars during the International Nursing Innovation conference helped identify potential collaborative targets at overseas institutions.',
    CommunicationReflection: 'Presenting research orally in English refined my presentation mechanics, slide designing, and strategies for handling tough scholarly Q&A panels.',
    AcademicGrowthReflection: 'Transitioning from clinical nursing practice to doctoral investigation shifted my worldview. I now scrutinize practice models through philosophical paradigms.',
    ResearchIdentityReflection: 'Developing a distinct voice as a nurse scholar focused on cardiac technology integration. I aim to merge theory with user-centered mobile design.',
    ChallengesReflection: 'Balancing full-time clinical research assistant responsibilities with doctoral coursework was taxing. I successfully overcame this using structured time-blocking.',
    TransformationReflection: 'I have evolved from following pre-established protocols to actively interrogating care delivery mechanisms, striving to innovate nursing practice through evidence.',
    ShortTermCareerGoals: 'Successfully pass the proposal defense, submit ethics application, and complete the preliminary pilot validation of the tele-nursing app within 12 months.',
    LongTermCareerAspirations: 'Become a full-time university lecturer and principal investigator running a fully funded clinical research lab for elderly care technologies.',
    PreparationNeeded: 'Submitting post-doctoral scholarship proposals and forging deep international research alliances.',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM_SAMPLE'
  },
  {
    ProfileID: 'SP_2',
    StudentUserID: 'U_STUDENT_2',
    FullName: 'Ms. Pirunnapa Benchaphan',
    ContactInformation: 'Email: pirunnapa.ben@example.com | Tel: 0890001234',
    CurrentPositionAffiliation: 'Pediatric Cardiac Clinic Specialist',
    ResearchInterests: 'Pediatric Cardiac Rehabilitation, Mindfulness-Based Therapy, Clinical Safety Indicators',
    ORCID: '0000-0002-4545-6767',
    GoalsForDoctoralStudy: 'To pioneer patient-centered cardiac rehabilitation programs for young children in Thailand by combining mindfulness with state-of-the-art diagnostic indicators. I expect this research to transform clinical practices and bolster quality-of-life parameters for pediatric survivors.',
    DevelopmentPlan: 'Focus on qualitative methodology validation, IRB approval requirements, and collaborative study with community health centers.',
    EnglishReflection: 'Working closely with international publications has strengthened my reading comprehension. Next, I will aim for advanced verbal debate training.',
    ResearchExperienceReflection: 'My engagement in clinical trials has solidified my grasp of data gathering precision and protocol conformity.',
    NetworkingReflection: 'Forged ties with peer researchers working on child development in domestic medical hubs.',
    CommunicationReflection: 'Sharing research outcomes in regional health symposia bolstered my storytelling and public communication abilities.',
    AcademicGrowthReflection: 'Coursework enabled deep critical reading and clinical paradigm analyses, moving my clinical insights to formal theories.',
    ResearchIdentityReflection: 'Establishing a clear academic focus around children\'s mental and physical health integration.',
    ChallengesReflection: 'Accessing child participants and securing ethical approval were major tasks. I designed localized communication briefs that facilitated quick parent alignment.',
    TransformationReflection: 'Growing into an authoritative resource on pediatric clinical methods, showing solid leadership and academic resilience.',
    ShortTermCareerGoals: 'Conclude literature reviews, complete quantitative methodology assessments, and defend the dissertation proposal by early next year.',
    LongTermCareerAspirations: 'Serve as a senior health consultant, dean, or clinical nursing development director at national hospitals.',
    PreparationNeeded: 'Engaging in advanced clinical fellowships and medical technology governance workshops.',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM_SAMPLE'
  }
];

// Initial Dissertation Projects
export const getInitialDissertations = (): Dissertation[] => [
  {
    DissertationID: 'D_1',
    StudentUserID: 'U_STUDENT_1',
    TopicDevelopment: 'Refined through three rounds of major advisor consultations. Focused on elderly cardiovascular cohorts post-discharge.',
    Title: 'The Development of a Tele-Nursing Support Program for Elderly Patients with Chronic Heart Failure in Thailand',
    BackgroundSignificance: 'Heart failure remains a chief cause of rehospitalization. Tailored digital support bridges critical nursing follow-ups in rural areas.',
    ResearchProblem: 'Poor self-care adherence post-discharge triggers critical decompensations. Tele-nursing platforms provide required guidance but require sound theoretical designs.',
    Objectives: '1. Build a self-efficacy based tele-nursing app.\n2. Evaluate its effect on 30-day readmission and cardiac symptom control.',
    ResearchQuestionsHypotheses: 'H1: Patients using the Tele-Nursing support program will exhibit significantly higher self-care behaviors than control counterparts.',
    ConceptualFramework: 'Integrating Bandura\'s Self-Efficacy Theory with Cox\'s Interaction Model of Client Health Behavior.',
    MethodologyOverview: 'A randomized controlled clinical trial (RCT) involving 120 heart failure participants across two medical centers in Central Thailand.',
    EthicsApplicationDate: '2026-08-15',
    EthicsApprovalDate: '',
    ApprovalNumber: '',
    Amendments: 'None',
    DataManagementNotes: 'All participant logs will be encrypted and stored on secure cloud databases. Identifiers will be anonymized.',
    ChallengesSolutions: 'Challenge: Tech literacy in older participants. Solution: Designed highly visual user interfaces with oversized voice-assisted navigation guides.',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM_SAMPLE'
  },
  {
    DissertationID: 'D_2',
    StudentUserID: 'U_STUDENT_2',
    TopicDevelopment: 'Synthesized nursing care concepts with neuro-mindfulness to treat early childhood recovery pathways.',
    Title: 'A Mindfulness-Integrated Pediatric Cardiac Rehabilitation Program: A Mixed-Methods Study',
    BackgroundSignificance: 'Recovery is mentally taxing for children. Early mindfulness intervention strengthens neurological resilience and cardiovascular outcomes.',
    ResearchProblem: 'Traditional pediatric rehab models overlook emotional healing. Integrating physical rehab with pediatric mindfulness satisfies holistic needs.',
    Objectives: '1. Establish rehabilitation guidelines for pediatric heart patients.\n2. Assess physical recovery and clinical stress parameters.',
    ResearchQuestionsHypotheses: 'H1: The intervention group will show superior cardiac stroke volumes and diminished stress markers compared to standard protocols.',
    ConceptualFramework: 'Adaptation of Roy\'s Adaptation Model alongside contemporary mindfulness neurobiology.',
    MethodologyOverview: 'A parallel explanatory mixed-methods approach with clinical outcome trackers and qualitative focus groups.',
    EthicsApplicationDate: '2026-09-01',
    EthicsApprovalDate: '',
    ApprovalNumber: '',
    Amendments: 'None',
    DataManagementNotes: 'Participant files are highly protected under strict pediatric research compliance frameworks.',
    ChallengesSolutions: 'Overcoming communication barriers with very young subjects. Handled by creating specialized animated feedback cards and game mechanics.',
    UpdatedAt: new Date().toISOString(),
    UpdatedBy: 'SYSTEM_SAMPLE'
  }
];

// Initial Research Hours (Must total at least 110 hrs to show solid progress towards 180 hrs)
export const getInitialResearchHours = (): ResearchHour[] => [
  {
    HourID: 'H_1',
    StudentUserID: 'U_STUDENT_1',
    Date: '2026-03-01',
    ResearchActivity: 'Literature Synthesis',
    WorkDescription: 'Extensive database searching (PubMed, CINAHL) on tele-nursing algorithms and digital cardiac interventions.',
    Hours: 35,
    SupervisorAdvisor: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    CreatedBy: 'SYSTEM_SAMPLE',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    HourID: 'H_2',
    StudentUserID: 'U_STUDENT_1',
    Date: '2026-04-12',
    ResearchActivity: 'Data Collection Tool Drafting',
    WorkDescription: 'Translating and cross-validating the Self-Care of Heart Failure Index (SCHFI) questionnaire into Thai.',
    Hours: 25,
    SupervisorAdvisor: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    CreatedBy: 'SYSTEM_SAMPLE',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    HourID: 'H_3',
    StudentUserID: 'U_STUDENT_1',
    Date: '2026-05-15',
    ResearchActivity: 'Research Assistant Clinical Trials',
    WorkDescription: 'Assisting in patient tracking, clinical files audit, and electronic data logging for the primary geriatric care trial.',
    Hours: 35,
    SupervisorAdvisor: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    CreatedBy: 'SYSTEM_SAMPLE',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    HourID: 'H_4',
    StudentUserID: 'U_STUDENT_1',
    Date: '2026-06-10',
    ResearchActivity: 'Data Analysis Practice',
    WorkDescription: 'Running descriptive statistics, testing normal distributions, and learning regression model workflows in SPSS.',
    Hours: 15,
    SupervisorAdvisor: 'Assoc. Prof. Dr. Somchai Prasert',
    CreatedBy: 'SYSTEM_SAMPLE',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  // Student 2 Hours
  {
    HourID: 'H_5',
    StudentUserID: 'U_STUDENT_2',
    Date: '2026-03-10',
    ResearchActivity: 'Qualitative Focus Group Pilot',
    WorkDescription: 'Conducting trial pediatric sessions, observing non-verbal coping indicators, and transcribing interviews.',
    Hours: 40,
    SupervisorAdvisor: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    CreatedBy: 'SYSTEM_SAMPLE',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    HourID: 'H_6',
    StudentUserID: 'U_STUDENT_2',
    Date: '2026-05-02',
    ResearchActivity: 'Protocol Design Review',
    WorkDescription: 'Formulating clinical screening rules and stress measurement schedules for pediatric subjects.',
    Hours: 45,
    SupervisorAdvisor: 'Assoc. Prof. Dr. Somchai Prasert',
    CreatedBy: 'SYSTEM_SAMPLE',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  }
];

// Initial Competency Assessments
export const getInitialCompetencyAssessments = (): CompetencyAssessment[] => {
  const list: CompetencyAssessment[] = [];
  const competencies = [
    'Advanced disciplinary knowledge',
    'Critical analysis and synthesis',
    'Research design and methodology',
    'Data analysis',
    'Academic writing',
    'English communication for academic purposes',
    'Scholarly presentation',
    'Teaching ability',
    'Leadership',
    'Ethical conduct in research',
    'Professionalism',
    'Collaboration and networking',
    'Lifelong learning and self-development'
  ];

  const students = ['U_STUDENT_1', 'U_STUDENT_2'];

  students.forEach((std) => {
    competencies.forEach((comp, idx) => {
      let lvl: 'Beginning' | 'Developing' | 'Competent' | 'Proficient' = 'Developing';
      if (idx % 3 === 0) lvl = 'Competent';
      if (idx % 4 === 0) lvl = 'Proficient';
      if (idx === 1) lvl = 'Beginning';

      list.push({
        AssessmentID: generateId('CA'),
        StudentUserID: std,
        Competency: comp,
        Level: lvl,
        EvidenceRemarks: 'Reflected in core seminar assessments and workshops.',
        ReviewYear: 2026,
        CreatedBy: 'SYSTEM_SAMPLE',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      });
    });
  });

  return list;
};

// Initial Advisor Comments
export const getInitialAdvisorComments = (): AdvisorComment[] => [
  {
    CommentID: 'C_1',
    StudentUserID: 'U_STUDENT_1',
    AdvisorUserID: 'U_ADVISOR',
    ReviewYear: 2026,
    CommentText: 'The student exhibits deep critical thinking skills and has made outstanding progress in formulating Chapter 1 and Chapter 3. Academic writing demonstrates noticeable growth. Recommended to speed up the pilot validation tool and submit to the IRB committee by next month.',
    Recommendation: 'Proceed to proposal defense preparation and complete ethics application submissions.',
    Status: 'Signed',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    CommentID: 'C_2',
    StudentUserID: 'U_STUDENT_2',
    AdvisorUserID: 'U_ADVISOR',
    ReviewYear: 2026,
    CommentText: 'Outstanding methodology formulation. The mixed-methods approach is sound and integrates beautifully. Ensure parental consensus materials are written in simplified, warm language to facilitate swift ethical clearance.',
    Recommendation: 'Fine-tune screening tools and prepare for formal committee registration.',
    Status: 'Signed',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  }
];

// Initial Endorsements
export const getInitialEndorsements = (): Endorsement[] => [
  {
    EndorsementID: 'E_1',
    StudentUserID: 'U_STUDENT_1',
    Role: 'Major Advisor',
    AdvisorUserID: 'U_ADVISOR',
    AdvisorName: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    SignatureText: '/s/ Anchalee Jedsadaphan',
    SignatureDate: '2026-06-18',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    EndorsementID: 'E_2',
    StudentUserID: 'U_STUDENT_1',
    Role: 'Co-Advisor / Committee Member',
    AdvisorUserID: 'U_COADVISOR',
    AdvisorName: 'Assoc. Prof. Dr. Somchai Prasert',
    SignatureText: '/s/ Somchai Prasert',
    SignatureDate: '2026-06-20',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  },
  {
    EndorsementID: 'E_3',
    StudentUserID: 'U_STUDENT_2',
    Role: 'Major Advisor',
    AdvisorUserID: 'U_ADVISOR',
    AdvisorName: 'Asst. Prof. Dr. Anchalee Jedsadaphan',
    SignatureText: '/s/ Anchalee Jedsadaphan',
    SignatureDate: '2026-06-25',
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  }
];

// Initial Evidence Records
export const getInitialEvidence = (): Evidence[] => [
  {
    EvidenceID: 'EV_1',
    StudentUserID: 'U_STUDENT_1',
    FileName: 'Thesis_Proposal_Draft_v2.pdf',
    FileURL: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    UploadedBy: 'U_STUDENT_1',
    UploadedAt: new Date().toISOString(),
    Description: 'Dissertation Chapter 1-3 comprehensive draft'
  },
  {
    EvidenceID: 'EV_2',
    StudentUserID: 'U_STUDENT_1',
    FileName: 'CITI_Ethics_Certificate.pdf',
    FileURL: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    UploadedBy: 'U_STUDENT_1',
    UploadedAt: new Date().toISOString(),
    Description: 'Research Ethics Completion Proof'
  },
  {
    EvidenceID: 'EV_3',
    StudentUserID: 'U_STUDENT_2',
    FileName: 'Methodology_Framework_2026.pdf',
    FileURL: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    UploadedBy: 'U_STUDENT_2',
    UploadedAt: new Date().toISOString(),
    Description: 'Qualitative analysis design scheme'
  }
];

// Initial Notifications
export const getInitialNotifications = (): Notification[] => [
  {
    NotificationID: 'N_1',
    SenderUserID: 'U_ADVISOR',
    ReceiverUserID: 'U_STUDENT_1',
    Title: 'Thesis Proposal Deadline Reminder',
    Message: 'Please make sure to upload your refined Chapter 3 methodology section before Friday afternoon for committee pre-clearance.',
    IsRead: false,
    CreatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    NotificationID: 'N_2',
    SenderUserID: 'U_COADVISOR',
    ReceiverUserID: 'U_STUDENT_1',
    Title: 'SPSS Analysis Feedback',
    Message: 'Reviewed your descriptive metrics. The model fit is clean, please compile and link the regression output tables.',
    IsRead: true,
    CreatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    NotificationID: 'N_3',
    SenderUserID: 'U_ADVISOR',
    ReceiverUserID: 'U_STUDENT_2',
    Title: 'Ethical Application Prepared',
    Message: 'I have signed the clinical ethics board check sheets. Please upload them alongside your full IRB portfolio packet.',
    IsRead: false,
    CreatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

// Initial Chat Messages
export const getInitialChatMessages = (): ChatMessage[] => [
  {
    MessageID: 'M_1',
    ThreadID: 'U_STUDENT_1_U_ADVISOR',
    SenderUserID: 'U_STUDENT_1',
    ReceiverUserID: 'U_ADVISOR',
    StudentUserID: 'U_STUDENT_1',
    MessageText: 'Hello Dr. Anchalee, I have updated the self-efficacy variables inside Chapter 2 as you recommended last Thursday. Could you please check if the link makes sense?',
    IsRead: true,
    CreatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    MessageID: 'M_2',
    ThreadID: 'U_STUDENT_1_U_ADVISOR',
    SenderUserID: 'U_ADVISOR',
    ReceiverUserID: 'U_STUDENT_1',
    StudentUserID: 'U_STUDENT_1',
    MessageText: 'Yes Kittisak, I looked at it briefly. The linkages are much cleaner now. Please write up a 3-paragraph transition linking this to Chapter 3.',
    IsRead: false,
    CreatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    MessageID: 'M_3',
    ThreadID: 'U_STUDENT_1_U_COADVISOR',
    SenderUserID: 'U_COADVISOR',
    ReceiverUserID: 'U_STUDENT_1',
    StudentUserID: 'U_STUDENT_1',
    MessageText: 'Hello Kittisak, let\'s catch up briefly on Zoom tomorrow at 10 AM to discuss the patient enrollment statistics. Is that fine?',
    IsRead: false,
    CreatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    MessageID: 'M_4',
    ThreadID: 'U_STUDENT_2_U_ADVISOR',
    SenderUserID: 'U_STUDENT_2',
    ReceiverUserID: 'U_ADVISOR',
    StudentUserID: 'U_STUDENT_2',
    MessageText: 'Good evening Dr. Anchalee, I just uploaded the consent guidelines draft. Thank you!',
    IsRead: true,
    CreatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    MessageID: 'M_5',
    ThreadID: 'U_STUDENT_2_U_ADVISOR',
    SenderUserID: 'U_ADVISOR',
    ReceiverUserID: 'U_STUDENT_2',
    StudentUserID: 'U_STUDENT_2',
    MessageText: 'Looks beautiful Pirunnapa. I will review it fully tomorrow morning.',
    IsRead: true,
    CreatedAt: new Date(Date.now() - 3600000 * 7).toISOString()
  }
];

// Initial Activity Logs
export const getInitialActivityLogs = (): ActivityLog[] => [
  {
    LogID: 'L_1',
    UserID: 'U_ADMIN',
    Action: 'Database Initialized',
    Detail: 'Successfully completed setupDatabase() trigger.',
    CreatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    LogID: 'L_2',
    UserID: 'U_ADMIN',
    Action: 'Mock Data Seeded',
    Detail: 'setupExampleData() executed. Formatted student records created successfully.',
    CreatedAt: new Date(Date.now() - 3600000 * 47).toISOString()
  }
];

// LocalDatabase Store Engine wrapper
export class LocalDatabaseStore {
  constructor() {
    LocalDatabaseStore.initializeAll();
  }

  static get<T>(key: string, defaultValue: T): T {
    try {
      const val = localStorage.getItem(`doctoral_portfolio_${key}`);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, data: T): void {
    localStorage.setItem(`doctoral_portfolio_${key}`, JSON.stringify(data));
  }

  static initializeAll(force = false): void {
    if (!localStorage.getItem('doctoral_portfolio_initialized') || force) {
      this.set('settings', getInitialSettings());
      this.set('users', getInitialUsers());
      this.set('records', getInitialPortfolioRecords());
      this.set('profiles', getInitialStudentProfiles());
      this.set('dissertations', getInitialDissertations());
      this.set('researchHours', getInitialResearchHours());
      this.set('competencies', getInitialCompetencyAssessments());
      this.set('comments', getInitialAdvisorComments());
      this.set('endorsements', getInitialEndorsements());
      this.set('evidence', getInitialEvidence());
      this.set('notifications', getInitialNotifications());
      this.set('chatMessages', getInitialChatMessages());
      this.set('activityLogs', getInitialActivityLogs());
      localStorage.setItem('doctoral_portfolio_initialized', 'true');
    } else {
      // Self-healing: ensure SuperAdvisor seeded user is injected into existing localStorage
      const existingUsers = this.get<any[]>('users', []);
      const hasSuperAdvisor = existingUsers.some(u => u.Role === 'SuperAdvisor');
      if (!hasSuperAdvisor && existingUsers.length > 0) {
        const initialUsers = getInitialUsers();
        const superAdvisorUser = initialUsers.find(u => u.Role === 'SuperAdvisor');
        if (superAdvisorUser) {
          existingUsers.push(superAdvisorUser);
          this.set('users', existingUsers);
        }
      }
    }
  }

  // Firebase Real-time Synchronization and Seeding
  static async syncDocToFirebase(col: string, docId: string, data: any): Promise<void> {
    if (!isFirebaseEnabled || !db) return;
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, col, docId), data);
    } catch (err) {
      console.error(`Error syncing doc ${docId} to Firebase collection ${col}:`, err);
    }
  }

  static async deleteDocFromFirebase(col: string, docId: string): Promise<void> {
    if (!isFirebaseEnabled || !db) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, col, docId));
    } catch (err) {
      console.error(`Error deleting doc ${docId} from Firebase collection ${col}:`, err);
    }
  }

  async seedFirebaseIfEmpty(): Promise<void> {
    if (!isFirebaseEnabled || !db) return;

    if (localStorage.getItem('doctoral_portfolio_firebase_seeded') === 'true') {
      return;
    }

    try {
      const { getDocs, collection, query, limit } = await import('firebase/firestore');
      const q = query(collection(db, 'users'), limit(1));
      const snap = await getDocs(q);

      if (snap.empty) {
        console.log("Firestore database is empty. Seeding with mock data...");
        const { doc, writeBatch } = await import('firebase/firestore');

        const collectionsToSeed = [
          { key: 'settings', col: 'settings', idField: 'SettingKey' },
          { key: 'users', col: 'users', idField: 'UserID' },
          { key: 'records', col: 'records', idField: 'RecordID' },
          { key: 'profiles', col: 'profiles', idField: 'ProfileID' },
          { key: 'dissertations', col: 'dissertations', idField: 'DissertationID' },
          { key: 'researchHours', col: 'researchHours', idField: 'HourID' },
          { key: 'competencies', col: 'competencies', idField: 'AssessmentID' },
          { key: 'comments', col: 'comments', idField: 'CommentID' },
          { key: 'endorsements', col: 'endorsements', idField: 'EndorsementID' },
          { key: 'evidence', col: 'evidence', idField: 'EvidenceID' },
          { key: 'chatMessages', col: 'chatMessages', idField: 'MessageID' },
          { key: 'notifications', col: 'notifications', idField: 'NotificationID' },
          { key: 'activityLogs', col: 'activityLogs', idField: 'LogID' }
        ];

        for (const item of collectionsToSeed) {
          const localData = LocalDatabaseStore.get<any[]>(item.key, []);
          if (localData.length > 0) {
            let batch = writeBatch(db);
            let count = 0;

            for (const docData of localData) {
              const docId = docData[item.idField];
              if (docId) {
                const docRef = doc(db, item.col, docId);
                batch.set(docRef, docData);
                count++;
                if (count >= 400) {
                  await batch.commit();
                  batch = writeBatch(db);
                  count = 0;
                }
              }
            }
            if (count > 0) {
              await batch.commit();
            }
            console.log(`Successfully seeded ${localData.length} records to Firebase [${item.col}]`);
          }
        }
      }
      localStorage.setItem('doctoral_portfolio_firebase_seeded', 'true');
    } catch (err) {
      console.error("Failed to seed Firebase Firestore:", err);
    }
  }

  subscribeToFirebase(onSync: () => void): () => void {
    if (!isFirebaseEnabled || !db) return () => {};

    const collectionsToSync = [
      { key: 'settings', col: 'settings' },
      { key: 'users', col: 'users' },
      { key: 'records', col: 'records' },
      { key: 'profiles', col: 'profiles' },
      { key: 'dissertations', col: 'dissertations' },
      { key: 'researchHours', col: 'researchHours' },
      { key: 'competencies', col: 'competencies' },
      { key: 'comments', col: 'comments' },
      { key: 'endorsements', col: 'endorsements' },
      { key: 'evidence', col: 'evidence' },
      { key: 'chatMessages', col: 'chatMessages' },
      { key: 'notifications', col: 'notifications' },
      { key: 'activityLogs', col: 'activityLogs' }
    ];

    const unsubscribers: (() => void)[] = [];

    collectionsToSync.forEach(({ key, col }) => {
      const unsub = onSnapshot(collection(db!, col), (snapshot) => {
        if (!snapshot.empty) {
          const items: any[] = [];
          snapshot.forEach((doc) => {
            items.push(doc.data());
          });
          LocalDatabaseStore.set(key, items);
          onSync();
        }
      }, (error) => {
        console.error(`Firebase Real-time Sync Error [${col}]:`, error);
      });
      unsubscribers.push(unsub);
    });

    // Run initial seeding in the background
    this.seedFirebaseIfEmpty();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }

  // Getters
  getUsers(): User[] {
    return LocalDatabaseStore.get<User[]>('users', []);
  }

  getPortfolioRecords(): PortfolioRecord[] {
    return LocalDatabaseStore.get<PortfolioRecord[]>('records', []);
  }

  getStudentProfiles(): StudentProfile[] {
    return LocalDatabaseStore.get<StudentProfile[]>('profiles', []);
  }

  getDissertations(): Dissertation[] {
    return LocalDatabaseStore.get<Dissertation[]>('dissertations', []);
  }

  getResearchHours(): ResearchHour[] {
    return LocalDatabaseStore.get<ResearchHour[]>('researchHours', []);
  }

  getCompetencies(): CompetencyAssessment[] {
    return LocalDatabaseStore.get<CompetencyAssessment[]>('competencies', []);
  }

  getComments(): AdvisorComment[] {
    return LocalDatabaseStore.get<AdvisorComment[]>('comments', []);
  }

  getEndorsements(): Endorsement[] {
    return LocalDatabaseStore.get<Endorsement[]>('endorsements', []);
  }

  getEvidence(): Evidence[] {
    return LocalDatabaseStore.get<Evidence[]>('evidence', []);
  }

  getChats(): ChatMessage[] {
    return LocalDatabaseStore.get<ChatMessage[]>('chatMessages', []);
  }

  getNotifications(): Notification[] {
    return LocalDatabaseStore.get<Notification[]>('notifications', []);
  }

  getLogs(): ActivityLog[] {
    return LocalDatabaseStore.get<ActivityLog[]>('activityLogs', []);
  }

  // Mutators
  addLog(action: string, userId: string, detail: string): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      LogID: generateId('L'),
      UserID: userId,
      Action: action,
      Detail: detail,
      CreatedAt: new Date().toISOString()
    };
    logs.unshift(newLog);
    LocalDatabaseStore.set('activityLogs', logs);
    LocalDatabaseStore.syncDocToFirebase('activityLogs', newLog.LogID, newLog);
  }

  savePortfolioRecord(payload: any): void {
    const records = this.getPortfolioRecords();
    if (payload.TargetID) {
      // Edit mode
      const idx = records.findIndex(r => r.RecordID === payload.TargetID);
      if (idx !== -1) {
        records[idx] = {
          ...records[idx],
          ...payload,
          UpdatedAt: new Date().toISOString()
        };
        LocalDatabaseStore.set('records', records);
        LocalDatabaseStore.syncDocToFirebase('records', payload.TargetID, records[idx]);
      }
    } else {
      // Add mode
      const newRec: PortfolioRecord = {
        RecordID: generateId('R'),
        StudentUserID: payload.StudentUserID,
        SectionNo: payload.SectionNo,
        SectionTitle: `Section ${payload.SectionNo}`,
        SubsectionNo: payload.SubsectionNo || String(payload.SectionNo),
        SubsectionTitle: `Subsection ${payload.SubsectionNo || payload.SectionNo}`,
        RecordType: 'table_row',
        Field1: payload.Field1,
        Field2: payload.Field2,
        Field3: payload.Field3,
        Field4: payload.Field4,
        Field5: payload.Field5,
        Field6: payload.Field6,
        Field7: payload.Field7,
        LongText: payload.LongText,
        Status: payload.Status || 'Approved',
        CreatedBy: payload.StudentUserID,
        CreatedAt: new Date().toISOString(),
        UpdatedBy: payload.StudentUserID,
        UpdatedAt: new Date().toISOString()
      };
      records.push(newRec);
      LocalDatabaseStore.set('records', records);
      LocalDatabaseStore.syncDocToFirebase('records', newRec.RecordID, newRec);
    }
  }

  saveStudentProfile(studentId: string, sectionNo: number, payload: any): void {
    const profiles = this.getStudentProfiles();
    let profile = profiles.find(p => p.StudentUserID === studentId);
    if (!profile) {
      profile = {
        ProfileID: generateId('SP'),
        StudentUserID: studentId,
        FullName: 'New Scholar Student',
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: studentId
      };
      profiles.push(profile);
    }

    if (payload.SubsectionNo === '1.4' || sectionNo === 1) {
      profile.GoalsForDoctoralStudy = payload.LongText;
    } else if (payload.SubsectionNo === '2.3' || sectionNo === 2) {
      profile.DevelopmentPlan = payload.LongText;
    } else if (payload.SubsectionNo === '3.3' || sectionNo === 3) {
      profile.EnglishReflection = payload.LongText;
    } else if (payload.SubsectionNo === '6.2' || sectionNo === 6) {
      profile.ResearchExperienceReflection = payload.LongText;
    } else if (payload.SubsectionNo === '10.1' || sectionNo === 10) {
      profile.AcademicGrowthReflection = payload.LongText;
    } else if (payload.SubsectionNo === '10.2') {
      profile.ResearchIdentityReflection = payload.LongText;
    } else if (payload.SubsectionNo === '10.3') {
      profile.ChallengesReflection = payload.LongText;
    }

    profile.UpdatedAt = new Date().toISOString();
    profile.UpdatedBy = studentId;

    LocalDatabaseStore.set('profiles', profiles);
    LocalDatabaseStore.syncDocToFirebase('profiles', profile.ProfileID, profile);
  }

  saveDissertation(studentId: string, payload: any): void {
    const diss = this.getDissertations();
    let item = diss.find(d => d.StudentUserID === studentId);
    if (!item) {
      item = {
        DissertationID: generateId('D'),
        StudentUserID: studentId,
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: studentId
      };
      diss.push(item);
    }

    item.Title = payload.Field1 || item.Title;
    item.MethodologyOverview = payload.LongText || item.MethodologyOverview;
    item.UpdatedAt = new Date().toISOString();
    item.UpdatedBy = studentId;

    LocalDatabaseStore.set('dissertations', diss);
    LocalDatabaseStore.syncDocToFirebase('dissertations', item.DissertationID, item);
  }

  saveResearchHour(payload: any): void {
    const hours = this.getResearchHours();
    if (payload.TargetID) {
      const idx = hours.findIndex(h => h.HourID === payload.TargetID);
      if (idx !== -1) {
        hours[idx] = {
          ...hours[idx],
          ...payload,
          UpdatedAt: new Date().toISOString()
        };
        LocalDatabaseStore.set('researchHours', hours);
        LocalDatabaseStore.syncDocToFirebase('researchHours', payload.TargetID, hours[idx]);
      }
    } else {
      const newHour: ResearchHour = {
        HourID: generateId('H'),
        StudentUserID: payload.StudentUserID,
        Date: payload.Date,
        ResearchActivity: payload.ResearchActivity,
        WorkDescription: payload.WorkDescription || '',
        Hours: payload.Hours,
        SupervisorAdvisor: payload.SupervisorAdvisor || '',
        CreatedBy: payload.StudentUserID,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      hours.push(newHour);
      LocalDatabaseStore.set('researchHours', hours);
      LocalDatabaseStore.syncDocToFirebase('researchHours', newHour.HourID, newHour);
    }
  }

  saveCompetency(payload: any): void {
    const comps = this.getCompetencies();
    if (payload.TargetID) {
      const idx = comps.findIndex(c => c.AssessmentID === payload.TargetID);
      if (idx !== -1) {
        comps[idx] = {
          ...comps[idx],
          Level: payload.Level,
          EvidenceRemarks: payload.EvidenceRemarks,
          UpdatedAt: new Date().toISOString()
        };
        LocalDatabaseStore.set('competencies', comps);
        LocalDatabaseStore.syncDocToFirebase('competencies', payload.TargetID, comps[idx]);
      }
    }
  }

  deletePortfolioRecord(recordId: string): void {
    const records = this.getPortfolioRecords().filter(r => r.RecordID !== recordId);
    LocalDatabaseStore.set('records', records);
    LocalDatabaseStore.deleteDocFromFirebase('records', recordId);
  }

  deleteResearchHour(hourId: string): void {
    const hours = this.getResearchHours().filter(h => h.HourID !== hourId);
    LocalDatabaseStore.set('researchHours', hours);
    LocalDatabaseStore.deleteDocFromFirebase('researchHours', hourId);
  }

  sendChatMessage(senderId: string, studentId: string, receiverId: string, text: string): void {
    const chats = this.getChats();
    const newChat: ChatMessage = {
      MessageID: generateId('M'),
      ThreadID: `${studentId}_U_ADVISOR`,
      SenderUserID: senderId,
      ReceiverUserID: receiverId,
      StudentUserID: studentId,
      MessageText: text,
      IsRead: false,
      CreatedAt: new Date().toISOString()
    };
    chats.push(newChat);
    LocalDatabaseStore.set('chatMessages', chats);
    LocalDatabaseStore.syncDocToFirebase('chatMessages', newChat.MessageID, newChat);
  }

  sendNotification(senderId: string, receiverId: string, title: string, text: string): void {
    const list = this.getNotifications();
    const newNotif: Notification = {
      NotificationID: generateId('N'),
      SenderUserID: senderId,
      ReceiverUserID: receiverId,
      Title: title,
      Message: text,
      IsRead: false,
      CreatedAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    LocalDatabaseStore.set('notifications', list);
    LocalDatabaseStore.syncDocToFirebase('notifications', newNotif.NotificationID, newNotif);
  }

  saveComment(advisorId: string, studentId: string, text: string, recommendation: string): void {
    const comments = this.getComments();
    let item = comments.find(c => c.StudentUserID === studentId);
    if (!item) {
      item = {
        CommentID: generateId('C'),
        StudentUserID: studentId,
        AdvisorUserID: advisorId,
        ReviewYear: 2026,
        CommentText: text,
        Recommendation: recommendation,
        Status: 'Signed',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      comments.push(item);
    } else {
      item.CommentText = text;
      item.Recommendation = recommendation;
      item.UpdatedAt = new Date().toISOString();
    }
    LocalDatabaseStore.set('comments', comments);
    LocalDatabaseStore.syncDocToFirebase('comments', item.CommentID, item);
  }

  signEndorsement(advisorId: string, studentId: string, role: string, signatureName: string): void {
    const list = this.getEndorsements();
    const newEndorsement: Endorsement = {
      EndorsementID: generateId('E'),
      StudentUserID: studentId,
      Role: role as any,
      AdvisorUserID: advisorId,
      AdvisorName: signatureName,
      SignatureText: `/s/ ${signatureName}`,
      SignatureDate: new Date().toISOString().split('T')[0],
      Status: 'Active',
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    };
    list.push(newEndorsement);
    LocalDatabaseStore.set('endorsements', list);
    LocalDatabaseStore.syncDocToFirebase('endorsements', newEndorsement.EndorsementID, newEndorsement);
  }

  saveUser(payload: any): void {
    const list = this.getUsers();
    const idx = list.findIndex(u => u.UserID === payload.UserID);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...payload,
        UpdatedAt: new Date().toISOString()
      };
      LocalDatabaseStore.set('users', list);
      LocalDatabaseStore.syncDocToFirebase('users', payload.UserID, list[idx]);
    } else {
      const newUser: User = {
        UserID: payload.UserID,
        Email: payload.Email,
        Password: payload.Password,
        Role: payload.Role,
        Prefix: payload.Prefix,
        FirstName: payload.FirstName || payload.FullName.split(' ')[1] || payload.FullName,
        LastName: payload.LastName || payload.FullName.split(' ')[2] || '',
        FullName: payload.FullName,
        StudentID: payload.StudentID,
        Phone: payload.Phone,
        Program: payload.Program,
        Faculty: payload.Faculty || 'Faculty of Nursing',
        University: payload.University || 'Thammasat University',
        AdmissionYear: payload.AdmissionYear,
        ExpectedGraduationYear: payload.ExpectedGraduationYear,
        Position: payload.Position,
        Affiliation: payload.Affiliation,
        Status: 'Active',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      list.push(newUser);
      LocalDatabaseStore.set('users', list);
      LocalDatabaseStore.syncDocToFirebase('users', newUser.UserID, newUser);
    }
  }

  deleteUser(userId: string): void {
    const list = this.getUsers().filter(u => u.UserID !== userId);
    LocalDatabaseStore.set('users', list);
    LocalDatabaseStore.deleteDocFromFirebase('users', userId);
  }

  assignAdvisor(studentId: string, advisorId: string, role: 'Major' | 'Co'): void {
    const list = this.getUsers();
    const idx = list.findIndex(u => u.UserID === studentId);
    if (idx !== -1) {
      if (role === 'Major') {
        list[idx].MajorAdvisorID = advisorId;
      } else {
        list[idx].CoAdvisorIDs = advisorId;
      }
      LocalDatabaseStore.set('users', list);
      LocalDatabaseStore.syncDocToFirebase('users', studentId, list[idx]);
    }
  }

  markNotificationRead(notificationId: string): void {
    const list = this.getNotifications();
    const idx = list.findIndex(n => n.NotificationID === notificationId);
    if (idx !== -1) {
      list[idx].IsRead = true;
      LocalDatabaseStore.set('notifications', list);
      LocalDatabaseStore.syncDocToFirebase('notifications', notificationId, list[idx]);
    }
  }
}


