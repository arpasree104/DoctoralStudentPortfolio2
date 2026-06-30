import * as XLSX from 'xlsx';
import { User, PortfolioRecord, StudentProfile, Dissertation, ResearchHour, CompetencyAssessment, StudentCertificate, StudentActivity } from '../types';

/**
 * Creates and downloads a multi-sheet Excel workbook for a student's entire PhD portfolio database.
 */
export function exportStudentToExcel({
  student,
  advisor,
  coadvisor,
  records,
  profile,
  dissertation,
  researchHours,
  competencies,
  certificates,
  activities
}: {
  student: User;
  advisor: User | null;
  coadvisor: User | null;
  records: PortfolioRecord[];
  profile: StudentProfile | null;
  dissertation: Dissertation | null;
  researchHours: ResearchHour[];
  competencies: CompetencyAssessment[];
  certificates: StudentCertificate[];
  activities: StudentActivity[];
}) {
  const wb = XLSX.utils.book_new();

  // SHEET 1: Profile & Advising Information
  const profileRows = [
    ["DOCTORAL PhD PORTFOLIO SYSTEM - EXCEL REPORT"],
    [`Generated Date: ${new Date().toLocaleDateString()}`],
    [],
    ["STUDENT DEMOGRAPHICS"],
    ["Field Name", "Value/Record Detail"],
    ["Student Name", student.FullName],
    ["Student ID", student.StudentID || "-"],
    ["Program of Study", student.Program || "-"],
    ["Faculty", student.Faculty || "Faculty of Nursing"],
    ["Institution", student.University || "Thammasat University"],
    ["Admission Year", student.AdmissionYear || "-"],
    ["Expected Graduation Year", student.ExpectedGraduationYear || "-"],
    ["Official Email Address", student.Email],
    ["Contact Phone", student.Phone || "-"],
    ["Line ID", student.LineID || "-"],
    ["ORCID iD Profile Link", student.ORCID ? `https://orcid.org/${student.ORCID}` : "-"],
    ["Research Interests Areas", student.ResearchInterests || "-"],
    [],
    ["REFLECTIONS & GOALS"],
    ["Goals For Doctoral Study", profile?.GoalsForDoctoralStudy || "-"],
    ["Individual Development Plan", profile?.DevelopmentPlan || "-"],
    ["English Proficiency Reflexion", profile?.EnglishReflection || "-"],
    ["Research Experience Reflection", profile?.ResearchExperienceReflection || "-"],
    ["International Networking Reflection", profile?.NetworkingReflection || "-"],
    ["Intellectual Transformation Reflection", profile?.TransformationReflection || "-"],
    [],
    ["THESIS / DISSERTATION OVERVIEW"],
    ["Thesis Title", dissertation?.Title || "Not yet finalized"],
    ["Topic Development Stage", dissertation?.TopicDevelopment || "-"],
    ["Background & Significance", dissertation?.BackgroundSignificance || "-"],
    ["Core Research Problem", dissertation?.ResearchProblem || "-"],
    ["Study Objectives", dissertation?.Objectives || "-"],
    ["Conceptual Framework", dissertation?.ConceptualFramework || "-"],
    ["Methodology & Design Overview", dissertation?.MethodologyOverview || "-"],
    [],
    ["ADVISORY COMMITTEE MEMBERS"],
    ["Role Type", "Full Name", "Email Address", "Phone Number", "Institution / Affiliation"],
    [
      "Major Advisor",
      advisor?.FullName || "-",
      advisor?.Email || "-",
      advisor?.Phone || "-",
      advisor?.Affiliation || "Faculty of Nursing, Thammasat University"
    ],
    [
      "Co-Advisor",
      coadvisor?.FullName || "-",
      coadvisor?.Email || "-",
      coadvisor?.Phone || "-",
      coadvisor?.Affiliation || "-"
    ]
  ];

  const wsProfile = XLSX.utils.aoa_to_sheet(profileRows);
  // Auto-fit column widths slightly for aesthetics
  wsProfile["!cols"] = [{ wch: 30 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(wb, wsProfile, "Demographics & Reflections");

  // SHEET 2: 16 Portfolio Milestones
  const milestoneHeader = [
    "Section No",
    "Section Title",
    "Subsection No",
    "Subsection Title",
    "Field 1",
    "Field 2",
    "Field 3",
    "Field 4",
    "Field 5",
    "Field 6",
    "Field 7",
    "Long Text Description",
    "Approval Status",
    "Last Updated"
  ];
  const milestoneRows = records.map((r) => [
    r.SectionNo,
    r.SectionTitle,
    r.SubsectionNo,
    r.SubsectionTitle,
    r.Field1 || "",
    r.Field2 || "",
    r.Field3 || "",
    r.Field4 || "",
    r.Field5 || "",
    r.Field6 || "",
    r.Field7 || "",
    r.LongText || "",
    r.Status || "Draft",
    r.UpdatedAt ? r.UpdatedAt.split("T")[0] : ""
  ]);

  const wsMilestones = XLSX.utils.aoa_to_sheet([milestoneHeader, ...milestoneRows]);
  wsMilestones["!cols"] = [
    { wch: 10 }, { wch: 25 }, { wch: 12 }, { wch: 25 },
    { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 50 }, { wch: 15 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(wb, wsMilestones, "16 Portfolio Milestones");

  // SHEET 3: Practicum / Research Hours
  const hoursHeader = ["Activity Log Date", "Research Activity / Role", "Detailed Work Description", "Hours Logged", "Supervisor/Advisor Name", "Date Recorded"];
  const hoursRows = researchHours.map((h) => [
    h.Date || "",
    h.ResearchActivity || "",
    h.WorkDescription || "",
    h.Hours || 0,
    h.SupervisorAdvisor || "",
    h.CreatedAt ? h.CreatedAt.split("T")[0] : ""
  ]);

  const wsHours = XLSX.utils.aoa_to_sheet([hoursHeader, ...hoursRows]);
  wsHours["!cols"] = [{ wch: 15 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsHours, "Research Hours");

  // SHEET 4: Competency Ratings
  const compHeader = ["Review Assessment Year", "Competency Category Description", "Achieved Progress Level", "Evidence References & Remarks", "Date Logged"];
  const compRows = competencies.map((c) => [
    c.ReviewYear || "",
    c.Competency || "",
    c.Level || "",
    c.EvidenceRemarks || "",
    c.CreatedAt ? c.CreatedAt.split("T")[0] : ""
  ]);

  const wsCompetencies = XLSX.utils.aoa_to_sheet([compHeader, ...compRows]);
  wsCompetencies["!cols"] = [{ wch: 15 }, { wch: 40 }, { wch: 20 }, { wch: 40 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsCompetencies, "Competencies");

  // SHEET 5: Academic Certificates
  const certHeader = ["Certificate Name / Award Title", "Issuing Organization / Faculty", "Conference/Event Date", "Stored Link / Image File URL", "Date Recorded"];
  const certRows = certificates.map((c) => [
    c.Title || "",
    c.Issuer || "",
    c.DateString || "",
    c.ImageURL || "",
    c.CreatedAt ? c.CreatedAt.split("T")[0] : ""
  ]);

  const wsCertificates = XLSX.utils.aoa_to_sheet([certHeader, ...certRows]);
  wsCertificates["!cols"] = [{ wch: 45 }, { wch: 35 }, { wch: 20 }, { wch: 40 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsCertificates, "Certificates");

  // SHEET 6: Monthly Activity Logs
  const actHeader = ["Calendar Month & Year", "Activity Subject Heading", "Progress Descriptions (Bullet Points)", "Date Recorded"];
  const actRows = activities.map((a) => [
    a.MonthYear || "",
    a.Title || "",
    Array.isArray(a.BulletPoints) ? a.BulletPoints.join("\n- ") : (a.BulletPoints || ""),
    a.CreatedAt ? a.CreatedAt.split("T")[0] : ""
  ]);

  const wsActivities = XLSX.utils.aoa_to_sheet([actHeader, ...actRows]);
  wsActivities["!cols"] = [{ wch: 20 }, { wch: 45 }, { wch: 65 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsActivities, "Activity Log Pictures");

  // Trigger write file download
  const formattedName = `${student.FullName.replace(/\s+/g, "_")}_PhD_Portfolio.xlsx`;
  XLSX.writeFile(wb, formattedName);
}
