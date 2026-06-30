/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Student' | 'Advisor' | 'CoAdvisor' | 'SuperAdvisor';

export interface User {
  UserID: string;
  Email: string;
  Password?: string;
  Role: UserRole;
  Prefix?: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  StudentID?: string; // stored as plain text string
  Program?: string;
  Faculty?: string;
  University?: string;
  AdmissionYear?: number;
  ExpectedGraduationYear?: number;
  MajorAdvisorID?: string;
  CoAdvisorIDs?: string; // comma-separated user IDs
  Position?: string;
  Affiliation?: string;
  Phone?: string; // stored as plain text string
  LineID?: string;
  ResearchInterests?: string;
  ORCID?: string;
  PhotoURL?: string;
  Status: 'Active' | 'Inactive';
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Setting {
  SettingKey: string;
  SettingValue: string;
  Description: string;
  Example: string;
  Options?: string;
  UpdatedAt: string;
  UpdatedBy: string;
}

export interface PortfolioRecord {
  RecordID: string;
  StudentUserID: string;
  SectionNo: number;
  SectionTitle: string;
  SubsectionNo: string;
  SubsectionTitle: string;
  RecordType: string; // 'table_row' or 'rich_text'
  Field1?: string;
  Field2?: string;
  Field3?: string;
  Field4?: string;
  Field5?: string;
  Field6?: string;
  Field7?: string;
  LongText?: string;
  Status: string; // 'Draft' | 'Submitted' | 'Approved'
  EvidenceIDs?: string; // comma-separated Evidence IDs
  CreatedBy: string;
  CreatedAt: string;
  UpdatedBy: string;
  UpdatedAt: string;
}

export interface StudentProfile {
  ProfileID: string;
  StudentUserID: string;
  FullName: string;
  ContactInformation?: string;
  CurrentPositionAffiliation?: string;
  ResearchInterests?: string;
  ORCID?: string;
  GoalsForDoctoralStudy?: string;
  DevelopmentPlan?: string;
  EnglishReflection?: string;
  ResearchExperienceReflection?: string;
  NetworkingReflection?: string;
  CommunicationReflection?: string;
  AcademicGrowthReflection?: string;
  ResearchIdentityReflection?: string;
  ChallengesReflection?: string;
  TransformationReflection?: string;
  ShortTermCareerGoals?: string;
  LongTermCareerAspirations?: string;
  PreparationNeeded?: string;
  UpdatedAt: string;
  UpdatedBy: string;
}

export interface Dissertation {
  DissertationID: string;
  StudentUserID: string;
  TopicDevelopment?: string;
  Title?: string;
  BackgroundSignificance?: string;
  ResearchProblem?: string;
  Objectives?: string;
  ResearchQuestionsHypotheses?: string;
  ConceptualFramework?: string;
  MethodologyOverview?: string;
  EthicsApplicationDate?: string;
  EthicsApprovalDate?: string;
  ApprovalNumber?: string;
  Amendments?: string;
  DataManagementNotes?: string;
  ChallengesSolutions?: string;
  UpdatedAt: string;
  UpdatedBy: string;
}

export interface ResearchHour {
  HourID: string;
  StudentUserID: string;
  Date: string;
  ResearchActivity: string;
  WorkDescription: string;
  Hours: number;
  SupervisorAdvisor: string;
  EvidenceIDs?: string;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CompetencyAssessment {
  AssessmentID: string;
  StudentUserID: string;
  Competency: string;
  Level: 'Beginning' | 'Developing' | 'Competent' | 'Proficient';
  EvidenceRemarks?: string;
  ReviewYear: number;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AdvisorComment {
  CommentID: string;
  StudentUserID: string;
  AdvisorUserID: string;
  ReviewYear: number;
  CommentText: string;
  Recommendation: string;
  Status: string; // 'Draft' | 'Signed'
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Endorsement {
  EndorsementID: string;
  StudentUserID: string;
  Role: 'Major Advisor' | 'Co-Advisor / Committee Member' | 'Committee Member';
  AdvisorUserID: string;
  AdvisorName: string;
  SignatureText: string;
  SignatureDate: string;
  Status: 'Active' | 'Revoked';
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Evidence {
  EvidenceID: string;
  StudentUserID: string;
  RelatedRecordID?: string;
  RelatedSection?: string;
  FileName: string;
  FileURL: string;
  FileID?: string;
  MimeType?: string;
  UploadedBy: string;
  UploadedAt: string;
  Description?: string;
}

export interface Notification {
  NotificationID: string;
  SenderUserID: string;
  ReceiverUserID: string;
  Title: string;
  Message: string;
  FileName?: string;
  FileURL?: string;
  IsRead: boolean;
  CreatedAt: string;
  ReadAt?: string;
}

export interface ChatMessage {
  MessageID: string;
  ThreadID: string; // StudentUserID + AdvisorUserID
  SenderUserID: string;
  ReceiverUserID: string;
  StudentUserID: string;
  MessageText: string;
  FileName?: string;
  FileURL?: string;
  IsRead: boolean;
  CreatedAt: string;
}

export interface ActivityLog {
  LogID: string;
  UserID: string;
  Action: string;
  Detail: string;
  CreatedAt: string;
}

export interface StudentCertificate {
  CertificateID: string;
  StudentUserID: string;
  Title: string;
  Issuer: string;
  DateString: string;
  ImageURL: string; // Base64 or Web URL
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StudentActivity {
  ActivityID: string;
  StudentUserID: string;
  MonthYear: string; // e.g. "October 2025"
  Title: string;
  BulletPoints: string[]; // List of activity descriptions
  Images: string[]; // List of Base64 or Web URLs
  CreatedAt: string;
  UpdatedAt: string;
}

