/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, Download, ChevronRight } from 'lucide-react';
import {
  User,
  PortfolioRecord,
  StudentProfile,
  Dissertation,
  ResearchHour,
  CompetencyAssessment,
  AdvisorComment,
  Endorsement,
  Evidence
} from '../types';

interface PrintReportProps {
  student: User;
  advisor: User | null;
  coadvisor: User | null;
  records: PortfolioRecord[];
  profile: StudentProfile | null;
  dissertation: Dissertation | null;
  researchHours: ResearchHour[];
  competencies: CompetencyAssessment[];
  comments: AdvisorComment[];
  endorsements: Endorsement[];
  evidence: Evidence[];
}

export default function PrintReport({
  student,
  advisor,
  coadvisor,
  records,
  profile,
  dissertation,
  researchHours,
  competencies,
  comments,
  endorsements,
  evidence
}: PrintReportProps) {

  const print = () => {
    window.print();
  };

  // Helper to filter records by subsection
  const getSubRecords = (section: number, subsection: string) => {
    return records.filter(r => r.SectionNo === section && r.SubsectionNo === subsection);
  };

  const getSectionRecords = (section: number) => {
    return records.filter(r => r.SectionNo === section);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalResearchHours = researchHours.reduce((sum, item) => sum + item.Hours, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 md:p-8">
      {/* Top action header for screen display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200/60 print:hidden">
        <div>
          <h2 className="font-sans font-bold text-2xl text-[#1A1A1A] tracking-tight">Printable Portfolio Report</h2>
          <p className="text-sm text-gray-500">Previews the exact A4 layout of the doctoral portfolio matching the university template.</p>
        </div>
        <button
          onClick={print}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Actual printable document container */}
      <div id="printable-area" className="mx-auto max-w-[800px] text-gray-900 font-serif leading-relaxed print:p-0 print:m-0">
        
        {/* CSS rules for printing */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              font-family: 'Times New Roman', 'Inter', serif;
              padding: 0 !important;
              margin: 0 !important;
            }
            #printable-area {
              max-width: 100% !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .print-page {
              page-break-after: always;
              min-height: 100vh;
              padding: 2.5cm 2cm !important;
              box-sizing: border-box;
            }
            .print-page-cover {
              page-break-after: always;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 3cm 2cm !important;
              box-sizing: border-box;
            }
            .print-no-break {
              page-break-inside: avoid;
            }
            .print-header {
              display: block !important;
            }
            .print:hidden {
              display: none !important;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
          /* Custom styles for preview screen vs printing */
          .print-page {
            border: 1px solid #f1f1f1;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
            padding: 3rem;
            background: white;
            border-radius: 4px;
          }
          .print-page-cover {
            border: 1px solid #f1f1f1;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
            padding: 3rem;
            background: white;
            border-radius: 4px;
            min-height: 1000px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        `}} />

        {/* ==================== PAGE 1: COVER PAGE ==================== */}
        <div className="print-page-cover relative flex flex-col justify-between overflow-hidden bg-white">
          {/* Yellow top decoration block */}
          <div className="bg-[#F9C94A] p-10 -m-12 mb-10 border-b-8 border-[#B91C1C] flex flex-col justify-center min-h-[220px]">
            <h1 className="text-3xl font-bold text-[#1A1A1A] font-sans tracking-tight">Faculty of Nursing</h1>
            <h2 className="text-4xl font-extrabold text-[#1A1A1A] font-sans tracking-tight mt-1">Thammasat University</h2>
            <div className="w-16 h-1.5 bg-[#B91C1C] my-4" />
            <p className="text-lg text-gray-800 font-sans font-medium">Doctor of Philosophy Program in Nursing Science</p>
          </div>

          {/* Title middle strip */}
          <div className="my-auto py-8">
            <div className="flex items-center gap-4 mb-4 border-b border-[#B91C1C] pb-4">
              {/* Simulated Thammasat Emblem circle */}
              <div className="w-16 h-16 bg-[#B91C1C] rounded-full flex items-center justify-center text-[#F9C94A] font-bold text-xs border border-amber-300 shadow-md">
                TU NURS
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1A1A] font-sans">
                Doctoral Student Portfolio
              </h1>
            </div>
            <p className="text-gray-500 italic font-sans text-sm mt-2">Faculty of Nursing, Thammasat University, Rangsit Campus</p>
          </div>

          {/* Demographic Cover Table */}
          <div className="mt-auto pt-6 border-t border-amber-100">
            <table className="w-full border border-gray-300 font-sans text-sm rounded-lg overflow-hidden shadow-xs">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="w-1/3 bg-slate-50 p-3.5 font-semibold text-gray-700">Student Name</td>
                  <td className="p-3.5 text-gray-900 font-medium">{student.FullName}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">Student ID</td>
                  <td className="p-3.5 text-gray-900 font-mono font-medium">{student.StudentID || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">PhD Program</td>
                  <td className="p-3.5 text-gray-900">{student.Program || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">Faculty / University</td>
                  <td className="p-3.5 text-gray-900">Faculty of Nursing, Thammasat University</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">Year of Admission</td>
                  <td className="p-3.5 text-gray-900 font-mono">{student.AdmissionYear || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">Expected Graduation</td>
                  <td className="p-3.5 text-gray-900 font-mono">{student.ExpectedGraduationYear || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">Major Advisor</td>
                  <td className="p-3.5 text-gray-900 font-medium">{advisor ? advisor.FullName : 'Not Assigned'}</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 p-3.5 font-semibold text-gray-700">Date of Submission</td>
                  <td className="p-3.5 text-gray-900 font-mono">{formattedDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Yellow bottom bar */}
          <div className="bg-[#F9C94A] h-8 -m-12 mt-12 border-t-4 border-red-800" />
        </div>


        {/* ==================== PAGE 2: TABLE OF CONTENTS ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-8">
            <h2 className="text-2xl font-bold font-sans text-red-900">Table of Contents</h2>
          </div>

          <div className="space-y-4 font-sans text-sm text-gray-800">
            {[
              { id: '1', title: 'Section 1. Student Profile' },
              { id: '2', title: 'Section 2. Program of Study and Academic Milestones' },
              { id: '3', title: 'Section 3. English Language Proficiency Requirement' },
              { id: '4', title: 'Section 4. Coursework and Academic Development' },
              { id: '5', title: 'Section 5. Research Development and Dissertation Progress' },
              { id: '6', title: 'Section 6. Research Experience Requirement (180 Hours)' },
              { id: '7', title: 'Section 7. Scholarly Output (Publications / Conferences)' },
              { id: '8', title: 'Section 8. Teaching, Mentoring, and Academic Service' },
              { id: '9', title: 'Section 9. Professional Development and Leadership' },
              { id: '10', title: 'Section 10. Reflective Practice' },
              { id: '11', title: 'Section 11. Evidence and Supporting Documents' },
              { id: '12', title: 'Section 12. Self-Assessment of Doctoral Competencies' },
              { id: '13', title: 'Section 13. Annual Review Summary' },
              { id: '14', title: 'Section 14. Future Career Plan' },
              { id: '15', title: 'Section 15. Advisor’s Comments' },
              { id: '16', title: 'Section 16. Advisor / Committee Endorsement' }
            ].map((sec) => (
              <div key={sec.id} className="flex justify-between items-center border-b border-dashed border-gray-300 pb-1.5">
                <span className="font-medium text-gray-900">{sec.title}</span>
                <span className="text-gray-400">................................................................................</span>
                <span className="font-mono text-gray-900 font-semibold">{sec.id}</span>
              </div>
            ))}
          </div>
        </div>


        {/* ==================== SECTION 1: PROFILE ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 1. Student Profile</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 1</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">1.1 Personal Information</h3>
          <table className="w-full border border-gray-300 font-sans text-sm mb-6">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 bg-slate-50 p-2.5 font-medium text-gray-700">Full Name</td>
                <td className="p-2.5 text-gray-900 font-semibold">{student.FullName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-medium text-gray-700">Contact Information</td>
                <td className="p-2.5 text-gray-900">Phone: {student.Phone || '-'} | Email: {student.Email}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-medium text-gray-700">Current Affiliation</td>
                <td className="p-2.5 text-gray-900">{student.Affiliation || '-'} ({student.Position || '-'})</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-medium text-gray-700">Research Interests</td>
                <td className="p-2.5 text-gray-900">{student.ResearchInterests || '-'}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 p-2.5 font-medium text-gray-700">ORCID / Profile</td>
                <td className="p-2.5 text-gray-900 font-mono text-blue-800 underline">{student.ORCID || '-'}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">1.2 Academic Background</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Degree</th>
                <th className="p-2.5 font-semibold text-gray-800">Field of Study</th>
                <th className="p-2.5 font-semibold text-gray-800">Institution</th>
                <th className="p-2.5 font-semibold text-gray-800">Year</th>
                <th className="p-2.5 font-semibold text-gray-800">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(1, '1.2').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No academic history records.</td></tr>
              ) : (
                getSubRecords(1, '1.2').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium">{r.Field1}</td>
                    <td className="p-2.5">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 font-mono">{r.Field4}</td>
                    <td className="p-2.5">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">1.3 Professional Background</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Period</th>
                <th className="p-2.5 font-semibold text-gray-800">Role / Organization</th>
                <th className="p-2.5 font-semibold text-gray-800">Remarks / Responsibilities</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(1, '1.3').length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-400 italic">No professional history records.</td></tr>
              ) : (
                getSubRecords(1, '1.3').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2 mt-6">1.4 Goals for Doctoral Study</h3>
          <p className="text-xs text-gray-500 font-sans mb-3 italic">Briefly describe why you enrolled in the PhD program, what you hope to achieve, and how the program aligns with your future career goals.</p>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic">
            {profile?.GoalsForDoctoralStudy || 'No reflection recorded.'}
          </div>
        </div>


        {/* ==================== SECTION 2: MILESTONES ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 2. Program of Study and Academic Milestones</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 2</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">2.1 Planned Program of Study</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Semester / Year</th>
                <th className="p-2.5 font-semibold text-gray-800">Course Code</th>
                <th className="p-2.5 font-semibold text-gray-800">Course Title</th>
                <th className="p-2.5 font-semibold text-gray-800">Credits</th>
                <th className="p-2.5 font-semibold text-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(2, '2.1').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No course planning records.</td></tr>
              ) : (
                getSubRecords(2, '2.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-mono font-medium text-red-950">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 font-mono">{r.Field4}</td>
                    <td className="p-2.5 font-medium">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">2.2 Doctoral Milestones and Timeline</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Milestone</th>
                <th className="p-2.5 font-semibold text-gray-800">Planned Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Actual Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(2, '2.2').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No milestone records.</td></tr>
              ) : (
                getSubRecords(2, '2.2').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium text-gray-800">{r.Field1}</td>
                    <td className="p-2.5 font-mono">{r.Field2 || '-'}</td>
                    <td className="p-2.5 font-mono text-green-800 font-semibold">{r.Field3 || 'In Progress'}</td>
                    <td className="p-2.5 text-gray-600">{r.Field4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2 mt-6">2.3 Personal Learning and Development Plan</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            {profile?.DevelopmentPlan || 'No developmental plans recorded.'}
          </div>
        </div>


        {/* ==================== SECTION 3: ENGLISH ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 3. English Language Proficiency Requirement</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 3</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">3.1 Record of English Language Test</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Test Name</th>
                <th className="p-2.5 font-semibold text-gray-800">Date Taken</th>
                <th className="p-2.5 font-semibold text-gray-800">Score Achieved</th>
                <th className="p-2.5 font-semibold text-gray-800">Required Score</th>
                <th className="p-2.5 font-semibold text-gray-800">Status</th>
                <th className="p-2.5 font-semibold text-gray-800">Evidence Attached</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(3, '3.1').length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-400 italic">No English test scores logged.</td></tr>
              ) : (
                getSubRecords(3, '3.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium">{r.Field1}</td>
                    <td className="p-2.5 font-mono">{r.Field2}</td>
                    <td className="p-2.5 font-mono font-semibold text-red-850">{r.Field3}</td>
                    <td className="p-2.5 font-mono">{r.Field4}</td>
                    <td className="p-2.5 font-semibold text-green-850">{r.Field5}</td>
                    <td className="p-2.5">{r.Field6}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">3.2 English Development Activities</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Activity / Course</th>
                <th className="p-2.5 font-semibold text-gray-800">Organizer</th>
                <th className="p-2.5 font-semibold text-gray-800">Description</th>
                <th className="p-2.5 font-semibold text-gray-800">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(3, '3.2').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No English activities logged.</td></tr>
              ) : (
                getSubRecords(3, '3.2').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5">{r.Field4}</td>
                    <td className="p-2.5">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2 mt-6">3.3 Reflection on English Development</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic">
            {profile?.EnglishReflection || 'No English developmental reflections logged.'}
          </div>
        </div>


        {/* ==================== SECTION 4: COURSEWORK ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 4. Coursework and Academic Development</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 4</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">4.1 Courses Completed</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Course Code</th>
                <th className="p-2.5 font-semibold text-gray-800">Course Title</th>
                <th className="p-2.5 font-semibold text-gray-800">Semester / Year</th>
                <th className="p-2.5 font-semibold text-gray-800">Credits</th>
                <th className="p-2.5 font-semibold text-gray-800">Grade</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(4, '4.1').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No academic courses logged.</td></tr>
              ) : (
                getSubRecords(4, '4.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono font-semibold text-red-900">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5 font-mono">{r.Field3}</td>
                    <td className="p-2.5 font-mono">{r.Field4}</td>
                    <td className="p-2.5 font-mono font-bold text-green-900">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">4.2 Key Learning from Coursework</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Course / Activity</th>
                <th className="p-2.5 font-semibold text-gray-800">Key Learning</th>
                <th className="p-2.5 font-semibold text-gray-800">Application to Research / Practice</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(4, '4.2').length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-400 italic">No coursework summaries available.</td></tr>
              ) : (
                getSubRecords(4, '4.2').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium text-gray-800">{r.Field1}</td>
                    <td className="p-2.5">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">4.3 Workshops, Training, and Short Courses</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Title of Activity</th>
                <th className="p-2.5 font-semibold text-gray-800">Organizer</th>
                <th className="p-2.5 font-semibold text-gray-800">Role</th>
                <th className="p-2.5 font-semibold text-gray-800">Key Learning</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(4, '4.3').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No workshop logs available.</td></tr>
              ) : (
                getSubRecords(4, '4.3').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5">{r.Field4}</td>
                    <td className="p-2.5">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">4.4 Certifications</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Certificate / Training</th>
                <th className="p-2.5 font-semibold text-gray-800">Issuing Organization</th>
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(4, '4.4').length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-400 italic">No certificates recorded.</td></tr>
              ) : (
                getSubRecords(4, '4.4').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium">{r.Field1}</td>
                    <td className="p-2.5">{r.Field2}</td>
                    <td className="p-2.5 font-mono">{r.Field3}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* ==================== SECTION 5: DISSERTATION ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 5. Research Development and Dissertation Progress</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 5</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2">5.1 Development of Research Topic</h3>
          <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 p-3.5 rounded-lg mb-6 italic">
            {dissertation?.TopicDevelopment || 'Under discussion and formulation.'}
          </p>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">5.2 Dissertation Information</h3>
          <table className="w-full border border-gray-300 font-sans text-xs mb-6">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/4 bg-[#FFF8E7] p-2.5 font-semibold text-gray-700">Dissertation Title</td>
                <td className="p-2.5 text-gray-950 font-bold">{dissertation?.Title || 'To be registered.'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Background Significance</td>
                <td className="p-2.5 text-gray-800 whitespace-pre-wrap">{dissertation?.BackgroundSignificance || '-'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Research Problem</td>
                <td className="p-2.5 text-gray-800 whitespace-pre-wrap">{dissertation?.ResearchProblem || '-'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Objectives</td>
                <td className="p-2.5 text-gray-800 whitespace-pre-wrap">{dissertation?.Objectives || '-'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Conceptual Framework</td>
                <td className="p-2.5 text-gray-800 whitespace-pre-wrap">{dissertation?.ConceptualFramework || '-'}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Methodology Overview</td>
                <td className="p-2.5 text-gray-800 whitespace-pre-wrap">{dissertation?.MethodologyOverview || '-'}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">5.3 Dissertation Progress Record</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Activity</th>
                <th className="p-2.5 font-semibold text-gray-800">Date / Period</th>
                <th className="p-2.5 font-semibold text-gray-800">Progress / Outcome</th>
                <th className="p-2.5 font-semibold text-gray-800">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(5, '5.3').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No progress logs recorded.</td></tr>
              ) : (
                getSubRecords(5, '5.3').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium text-gray-800">{r.Field1}</td>
                    <td className="p-2.5 font-mono">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 font-mono text-xs">{r.Field4 || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">5.4 Meetings with Advisor / Committee</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Persons Attending</th>
                <th className="p-2.5 font-semibold text-gray-800">Key Issues Discussed</th>
                <th className="p-2.5 font-semibold text-gray-800">Action Points</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(5, '5.4').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No advisor meeting logs available.</td></tr>
              ) : (
                getSubRecords(5, '5.4').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 text-red-950">{r.Field4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">5.5 Ethics and Research Governance</h3>
          <table className="w-full border border-gray-300 font-sans text-xs mb-6">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 bg-slate-50 p-2.5 font-semibold text-gray-700">Date of Ethics Application</td>
                <td className="p-2.5 font-mono">{dissertation?.EthicsApplicationDate || 'Drafting'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Date of Ethics Approval</td>
                <td className="p-2.5 font-mono">{dissertation?.EthicsApprovalDate || 'Pending Committee Review'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Approval Number</td>
                <td className="p-2.5 font-mono font-bold">{dissertation?.ApprovalNumber || '-'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Amendments / Status</td>
                <td className="p-2.5">{dissertation?.Amendments || 'None'}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 p-2.5 font-semibold text-gray-700">Data Management & Confidentiality</td>
                <td className="p-2.5 text-gray-600 whitespace-pre-wrap">{dissertation?.DataManagementNotes || '-'}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2 mt-6">5.6 Challenges Encountered and Solutions</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic">
            {dissertation?.ChallengesSolutions || 'No critical bottlenecks identified.'}
          </div>
        </div>


        {/* ==================== SECTION 6: RESEARCH HOURS ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 6. Research Experience Requirement</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 6</span>
          </div>
          <p className="text-xs font-sans text-gray-500 mb-4 italic">All PhD students are required to complete at least 180 hours of research experience during the doctoral program.</p>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">6.1 Record of Research Experience Hours</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Research Activity</th>
                <th className="p-2.5 font-semibold text-gray-800">Description of Work</th>
                <th className="p-2.5 font-semibold text-gray-800 text-right">Hours</th>
                <th className="p-2.5 font-semibold text-gray-800">Supervisor</th>
              </tr>
            </thead>
            <tbody>
              {researchHours.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No research hours logged.</td></tr>
              ) : (
                researchHours.map((h) => (
                  <tr key={h.HourID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{h.Date}</td>
                    <td className="p-2.5 font-medium text-gray-800">{h.ResearchActivity}</td>
                    <td className="p-2.5 text-gray-600">{h.WorkDescription}</td>
                    <td className="p-2.5 font-mono text-right font-semibold text-red-900">{h.Hours}</td>
                    <td className="p-2.5">{h.SupervisorAdvisor}</td>
                  </tr>
                ))
              )}
              <tr className="bg-slate-50 font-bold border-t border-gray-300">
                <td colSpan={3} className="p-2.5 text-right font-sans text-gray-700">Total Logged Hours</td>
                <td className="p-2.5 font-mono text-right text-red-900 text-sm">{totalResearchHours} / 180 hrs</td>
                <td className="p-2.5 font-sans text-xs text-gray-500">
                  ({Math.min(100, Math.round((totalResearchHours / 180) * 100))}% Completed)
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2 mt-6">6.2 Reflection on Research Experience</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic">
            {profile?.ResearchExperienceReflection || 'No reflections logged.'}
          </div>
        </div>


        {/* ==================== SECTION 7: SCHOLARLY OUTPUTS ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 7. Scholarly Output</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 7</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">7.1 Conference Presentations</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Title</th>
                <th className="p-2.5 font-semibold text-gray-800">Conference / Seminar</th>
                <th className="p-2.5 font-semibold text-gray-800">Type</th>
                <th className="p-2.5 font-semibold text-gray-800">Venue / Status</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(7, '7.1').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No presentations logged.</td></tr>
              ) : (
                getSubRecords(7, '7.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 font-medium">{r.Field4}</td>
                    <td className="p-2.5">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">7.2 Publications</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Year</th>
                <th className="p-2.5 font-semibold text-gray-800">Title</th>
                <th className="p-2.5 font-semibold text-gray-800">Journal / Book / Proceedings</th>
                <th className="p-2.5 font-semibold text-gray-800">Status</th>
                <th className="p-2.5 font-semibold text-gray-800">DOI / Reference</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(7, '7.2').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No publications logged.</td></tr>
              ) : (
                getSubRecords(7, '7.2').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono font-medium">{r.Field1}</td>
                    <td className="p-2.5 font-semibold text-gray-900">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 font-medium text-red-900">{r.Field4}</td>
                    <td className="p-2.5 font-mono text-xs">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">7.3 Manuscripts in Preparation</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Title</th>
                <th className="p-2.5 font-semibold text-gray-800">Target Journal</th>
                <th className="p-2.5 font-semibold text-gray-800">Current Stage</th>
                <th className="p-2.5 font-semibold text-gray-800">Planned Submission</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(7, '7.3').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No manuscripts in prep logged.</td></tr>
              ) : (
                getSubRecords(7, '7.3').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium">{r.Field1}</td>
                    <td className="p-2.5">{r.Field2}</td>
                    <td className="p-2.5 font-medium">{r.Field3}</td>
                    <td className="p-2.5 font-mono">{r.Field4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">7.4 Research Grants and Funding</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Project Title</th>
                <th className="p-2.5 font-semibold text-gray-800">Funding Source</th>
                <th className="p-2.5 font-semibold text-gray-800">Role</th>
                <th className="p-2.5 font-semibold text-gray-800 text-right">Amount</th>
                <th className="p-2.5 font-semibold text-gray-800 font-mono">Period</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(7, '7.4').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No research grants logged.</td></tr>
              ) : (
                getSubRecords(7, '7.4').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium">{r.Field1}</td>
                    <td className="p-2.5">{r.Field2}</td>
                    <td className="p-2.5 font-medium">{r.Field3}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-red-950">{r.Field4}</td>
                    <td className="p-2.5 font-mono">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">7.5 Awards and Recognition</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Award / Recognition</th>
                <th className="p-2.5 font-semibold text-gray-800">Issuing Organization</th>
                <th className="p-2.5 font-semibold text-gray-800 font-mono">Description</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(7, '7.5').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No awards logged.</td></tr>
              ) : (
                getSubRecords(7, '7.5').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-semibold text-gray-900">{r.Field2}</td>
                    <td className="p-2.5 font-medium">{r.Field3}</td>
                    <td className="p-2.5">{r.Field4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* ==================== SECTION 8 & 9: SERVICE & LEADERSHIP ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 8 & 9. Service, Leadership, & Networks</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 8</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">8.1 Teaching Experience</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Semester / Year</th>
                <th className="p-2.5 font-semibold text-gray-800">Course / Topic</th>
                <th className="p-2.5 font-semibold text-gray-800">Role</th>
                <th className="p-2.5 font-semibold text-gray-800">Student Level</th>
                <th className="p-2.5 font-semibold text-gray-800">Description</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(8, '8.1').length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">No teaching experience logged.</td></tr>
              ) : (
                getSubRecords(8, '8.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-medium">{r.Field2}</td>
                    <td className="p-2.5">{r.Field3}</td>
                    <td className="p-2.5 font-mono">{r.Field4}</td>
                    <td className="p-2.5 text-gray-600">{r.Field5}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">9.1 Leadership Experiences</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Date</th>
                <th className="p-2.5 font-semibold text-gray-800">Role / Position</th>
                <th className="p-2.5 font-semibold text-gray-800">Organization / Context</th>
                <th className="p-2.5 font-semibold text-gray-800">Key Responsibilities</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(9, '9.1').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No leadership logs available.</td></tr>
              ) : (
                getSubRecords(9, '9.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-mono">{r.Field1}</td>
                    <td className="p-2.5 font-semibold">{r.Field2}</td>
                    <td className="p-2.5 font-medium">{r.Field3}</td>
                    <td className="p-2.5">{r.Field4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2 mt-6">9.2 Professional Networking and Collaboration</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic mb-4">
            {profile?.NetworkingReflection || 'No networking details logged.'}
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2">9.3 Communication and Dissemination Skills</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic">
            {profile?.CommunicationReflection || 'No communication reflection recorded.'}
          </div>
        </div>


        {/* ==================== SECTION 10 & 11: REFLECTIONS & EVIDENCE ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 10 & 11. Reflective Practice & Evidence</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 9</span>
          </div>

          <h3 className="font-sans font-bold text-sm text-red-950 uppercase mb-2">10.1 Reflection on Academic Growth</h3>
          <p className="text-sm text-gray-700 bg-[#FFFDF6] border-l-4 border-amber-400 p-3 mb-4 italic">
            {profile?.AcademicGrowthReflection || 'Pending entry...'}
          </p>

          <h3 className="font-sans font-bold text-sm text-red-950 uppercase mb-2">10.2 Reflection on Research Identity</h3>
          <p className="text-sm text-gray-700 bg-[#FFFDF6] border-l-4 border-amber-400 p-3 mb-4 italic">
            {profile?.ResearchIdentityReflection || 'Pending entry...'}
          </p>

          <h3 className="font-sans font-bold text-sm text-red-950 uppercase mb-2">10.3 Reflection on Challenges and Resilience</h3>
          <p className="text-sm text-gray-700 bg-[#FFFDF6] border-l-4 border-amber-400 p-3 mb-4 italic">
            {profile?.ChallengesReflection || 'Pending entry...'}
          </p>

          <h3 className="font-sans font-bold text-sm text-red-950 uppercase mb-2">10.4 Reflection on Professional Transformation</h3>
          <p className="text-sm text-gray-700 bg-[#FFFDF6] border-l-4 border-amber-400 p-3 mb-6 italic">
            {profile?.TransformationReflection || 'Pending entry...'}
          </p>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3 mt-6">Section 11. Evidence and Supporting Documents</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left">
            <thead>
              <tr className="bg-slate-100 border-b border-gray-300">
                <th className="p-2 font-semibold text-gray-800">File Name</th>
                <th className="p-2 font-semibold text-gray-800">Category / Related Section</th>
                <th className="p-2 font-semibold text-gray-800">Description</th>
              </tr>
            </thead>
            <tbody>
              {evidence.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-400 italic">No attachments or files uploaded.</td></tr>
              ) : (
                evidence.map((ev) => (
                  <tr key={ev.EvidenceID} className="border-b border-gray-200">
                    <td className="p-2 text-blue-900 font-medium font-mono truncate max-w-[250px]">{ev.FileName}</td>
                    <td className="p-2">{ev.RelatedSection || 'General Portfolio Proof'}</td>
                    <td className="p-2 text-gray-600">{ev.Description || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* ==================== SECTION 12: COMPETENCIES ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 12. Self-Assessment of Doctoral Competencies</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 10</span>
          </div>

          <table className="w-full border border-gray-300 font-sans text-xs text-left">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300 text-gray-900">
                <th className="p-2.5 font-bold w-1/3">Competency Element</th>
                <th className="p-2.5 font-bold text-center">Beginning</th>
                <th className="p-2.5 font-bold text-center">Developing</th>
                <th className="p-2.5 font-bold text-center">Competent</th>
                <th className="p-2.5 font-bold text-center">Proficient</th>
                <th className="p-2.5 font-bold">Evidence / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {competencies.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-400 italic">No competence tracking initialized.</td></tr>
              ) : (
                competencies.map((comp) => (
                  <tr key={comp.AssessmentID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium text-gray-850">{comp.Competency}</td>
                    <td className="p-2.5 text-center font-bold text-slate-500">{comp.Level === 'Beginning' ? '●' : ''}</td>
                    <td className="p-2.5 text-center font-bold text-amber-500">{comp.Level === 'Developing' ? '●' : ''}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-600">{comp.Level === 'Competent' ? '●' : ''}</td>
                    <td className="p-2.5 text-center font-bold text-red-700">{comp.Level === 'Proficient' ? '●' : ''}</td>
                    <td className="p-2.5 text-gray-600">{comp.EvidenceRemarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* ==================== SECTION 13 & 14: PROGRESS & FUTURE ==================== */}
        <div className="print-page bg-white">
          <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold font-sans text-red-900">Section 13 & 14. Review & Future Plans</h2>
            <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 11</span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2">13.1 Achievements During the Review Period</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic mb-4">
            {profile?.EnglishReflection || 'Reflected in coursework completion and early research publication drafts.'}
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2">13.2 Areas of Improvement</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm italic mb-4">
            {profile?.DevelopmentPlan || 'Targeting qualitative interview analysis precision.'}
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-3">13.3 Action Plan for Next Period</h3>
          <table className="w-full border border-gray-300 font-sans text-xs text-left mb-6">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-gray-300">
                <th className="p-2.5 font-semibold text-gray-800">Goal</th>
                <th className="p-2.5 font-semibold text-gray-800">Action Steps</th>
                <th className="p-2.5 font-semibold text-gray-800">Timeline</th>
                <th className="p-2.5 font-semibold text-gray-800 font-mono">Support Needed</th>
              </tr>
            </thead>
            <tbody>
              {getSubRecords(13, '13.3').length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No action plan items logged.</td></tr>
              ) : (
                getSubRecords(13, '13.3').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-200">
                    <td className="p-2.5 font-medium">{r.Field1}</td>
                    <td className="p-2.5">{r.Field2}</td>
                    <td className="p-2.5 font-mono">{r.Field3}</td>
                    <td className="p-2.5 text-red-950">{r.Field4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3 className="font-sans font-bold text-base text-gray-900 mb-2">Section 14. Future Career Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
            <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
              <h4 className="font-bold text-red-950 mb-1">14.1 Short-Term Goals</h4>
              <p className="text-gray-700 italic">{profile?.ShortTermCareerGoals || 'Defense & app launch.'}</p>
            </div>
            <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
              <h4 className="font-bold text-red-950 mb-1">14.2 Long-Term Aspirations</h4>
              <p className="text-gray-700 italic">{profile?.LongTermCareerAspirations || 'Research tenure & lecturer role.'}</p>
            </div>
            <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
              <h4 className="font-bold text-red-950 mb-1">14.3 Preparation Needed</h4>
              <p className="text-gray-700 italic">{profile?.PreparationNeeded || 'Post-doctoral programs & fellowships.'}</p>
            </div>
          </div>
        </div>


        {/* ==================== PAGE 12: COMMENTS & ENDORSEMENTS ==================== */}
        <div className="print-page bg-white flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-red-800 pb-3 mb-6 flex justify-between items-end">
              <h2 className="text-xl font-bold font-sans text-red-900">Section 15. Advisor’s Comments & Evaluation</h2>
              <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Page 12</span>
            </div>

            <div className="space-y-6 font-sans text-sm text-gray-800">
              {comments.filter(c => c.StudentUserID === student.UserID).length === 0 ? (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-400 italic">
                  No evaluation or progress comments filed by major advisor yet.
                </div>
              ) : (
                comments.filter(c => c.StudentUserID === student.UserID).map((comm) => (
                  <div key={comm.CommentID} className="p-5 bg-amber-50/40 border border-amber-200/60 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-amber-200/40">
                      <span className="font-bold text-red-950">Review Period Evaluation - Year {comm.ReviewYear}</span>
                      <span className="text-xs font-mono px-2.5 py-1 bg-green-100 text-green-900 rounded-full font-bold">Status: SIGNED</span>
                    </div>
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Comment text</h4>
                        <p className="mt-1 text-gray-900 leading-relaxed italic">“{comm.CommentText}”</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Recommendations</h4>
                        <p className="mt-1 text-red-950 font-medium">{comm.Recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="font-sans font-bold text-base text-gray-900 mb-4">Section 16. Advisor / Committee Endorsement</h3>
            <table className="w-full border border-gray-300 font-sans text-xs text-left rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-300 text-gray-700">
                  <th className="p-3 font-bold w-1/3">Role</th>
                  <th className="p-3 font-bold w-1/3">Name</th>
                  <th className="p-3 font-bold w-1/3">Signature and Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700">Major Advisor</td>
                  <td className="p-3 text-gray-900">{advisor ? advisor.FullName : 'Not Assigned'}</td>
                  <td className="p-3">
                    {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Major Advisor') ? (
                      <div className="space-y-1">
                        <p className="font-serif italic font-bold text-blue-900 text-sm">
                          {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Major Advisor')?.SignatureText}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          Date: {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Major Advisor')?.SignatureDate}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Pending signature</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700">Co-Advisor / Committee Member</td>
                  <td className="p-3 text-gray-900">{coadvisor ? coadvisor.FullName : 'Not Assigned'}</td>
                  <td className="p-3">
                    {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Co-Advisor / Committee Member') ? (
                      <div className="space-y-1">
                        <p className="font-serif italic font-bold text-blue-900 text-sm">
                          {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Co-Advisor / Committee Member')?.SignatureText}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          Date: {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Co-Advisor / Committee Member')?.SignatureDate}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Pending signature</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Committee Member</td>
                  <td className="p-3 text-gray-400 italic">Optional Secondary Co-advisor</td>
                  <td className="p-3">
                    {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Committee Member') ? (
                      <div className="space-y-1">
                        <p className="font-serif italic font-bold text-blue-900 text-sm">
                          {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Committee Member')?.SignatureText}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          Date: {endorsements.find(e => e.StudentUserID === student.UserID && e.Role === 'Committee Member')?.SignatureDate}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Pending signature</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
