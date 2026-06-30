/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Paperclip,
  Check,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Users,
  Activity,
  Heart,
  FileText
} from 'lucide-react';
import {
  PortfolioRecord,
  StudentProfile,
  Dissertation,
  ResearchHour,
  CompetencyAssessment,
  Evidence
} from '../types';
import Modal from './Modal';

interface PortfolioRecordsEntryProps {
  studentId: string;
  records: PortfolioRecord[];
  profile: StudentProfile | null;
  dissertation: Dissertation | null;
  researchHours: ResearchHour[];
  competencies: CompetencyAssessment[];
  evidence: Evidence[];
  selectedSection: number;
  setSelectedSection: (num: number) => void;
  onSaveRecord: (section: number, payload: any) => void;
  onDeleteRecord: (section: number, payload: any) => void;
}

// 16 Sections Checklist Config
const SECTIONS_CONFIG = [
  { no: 1, title: 'Section 1. Student Profile', desc: 'Personal details, Academic Background, and Goals.' },
  { no: 2, title: 'Section 2. Program of Study & Milestones', desc: 'Planned Courses, Academic Timelines, and Development plans.' },
  { no: 3, title: 'Section 3. English Language Requirement', desc: 'Test scores, English improvement activities, and reflections.' },
  { no: 4, title: 'Section 4. Coursework & Core Development', desc: 'Course grades, key takeaways, and research workshop certificates.' },
  { no: 5, title: 'Section 5. Dissertation Progress', desc: 'Thesis title, IRB ethics application details, advisor logs, and progress.' },
  { no: 6, title: 'Section 6. Research Experience (180 Hours)', desc: 'Supervised clinical trial logging and research competence reflections.' },
  { no: 7, title: 'Section 7. Scholarly Output', desc: 'Journal publications, presentations, grants, and academic awards.' },
  { no: 8, title: 'Section 8. Teaching & Mentoring', desc: 'Assisting classrooms, mentoring undergrads, and professional services.' },
  { no: 9, title: 'Section 9. Leadership & Networking', desc: 'Student associations, professional connections, and dissemination.' },
  { no: 10, title: 'Section 10. Reflective Practice', desc: 'Self-examinations of growth, scholarship identity, and transformations.' },
  { no: 11, title: 'Section 11. Evidence & Supporting Files', desc: 'Review, modify, or download all uploaded PDF credentials.' },
  { no: 12, title: 'Section 12. Self-Assessment Competencies', desc: 'Grade yourself on advanced research methodologies and academic writing.' },
  { no: 13, title: 'Section 13. Annual Review Summary', desc: 'Review period achievement logs, improvement areas, and action plans.' },
  { no: 14, title: 'Section 14. Future Career Plan', desc: 'Short/long term goals and structural preparations needed.' },
  { no: 15, title: 'Section 15. Advisor’s Comments', desc: 'Read-only progress feedback filed by your assigned major advisor.' },
  { no: 16, title: 'Section 16. Advisor / Committee Endorsement', desc: 'Verify signature clearances and review timeline signs.' }
];

export default function PortfolioRecordsEntry({
  studentId,
  records,
  profile,
  dissertation,
  researchHours,
  competencies,
  evidence,
  selectedSection,
  setSelectedSection,
  onSaveRecord,
  onSaveRecord: onSaveAction,
  onDeleteRecord
}: PortfolioRecordsEntryProps) {

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [activeSubsection, setActiveSubsection] = React.useState('');

  // Form editing references
  const [editType, setEditType] = React.useState<'portfolio' | 'profile' | 'dissertation' | 'hour' | 'competency'>('portfolio');
  const [targetId, setTargetId] = React.useState<string | null>(null);

  // Form Fields State
  const [field1, setField1] = React.useState('');
  const [field2, setField2] = React.useState('');
  const [field3, setField3] = React.useState('');
  const [field4, setField4] = React.useState('');
  const [field5, setField5] = React.useState('');
  const [field6, setField6] = React.useState('');
  const [longText, setLongText] = React.useState('');
  const [level, setLevel] = React.useState<'Beginning' | 'Developing' | 'Competent' | 'Proficient'>('Developing');

  // File Upload Helper
  const [attachmentName, setAttachmentName] = React.useState('');
  const [attachmentUrl, setAttachmentUrl] = React.useState('');

  const openFormModal = (
    type: 'portfolio' | 'profile' | 'dissertation' | 'hour' | 'competency',
    subNo: string,
    title: string,
    item: any = null
  ) => {
    setEditType(type);
    setActiveSubsection(subNo);
    setModalTitle(title);
    setTargetId(item ? (item.RecordID || item.HourID || item.AssessmentID) : null);

    setAttachmentName('');
    setAttachmentUrl('');

    if (item) {
      setField1(item.Field1 || item.ResearchActivity || item.Date || '');
      setField2(item.Field2 || item.WorkDescription || item.Level || '');
      setField3(item.Field3 || String(item.Hours || '') || '');
      setField4(item.Field4 || item.SupervisorAdvisor || '');
      setField5(item.Field5 || '');
      setField6(item.Field6 || '');
      setLongText(item.LongText || item.EvidenceRemarks || '');
      setLevel(item.Level || 'Developing');
    } else {
      setField1('');
      setField2('');
      setField3('');
      setField4('');
      setField5('');
      setField6('');
      setLongText('');
      setLevel('Developing');
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      StudentUserID: studentId,
      SectionNo: selectedSection,
      SubsectionNo: activeSubsection,
      Status: 'Approved'
    };

    if (targetId) payload.TargetID = targetId;

    // Attach simulated file details if present
    if (attachmentName) {
      payload.EvidenceName = attachmentName;
      payload.EvidenceURL = attachmentUrl || 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }

    if (editType === 'portfolio') {
      payload.Field1 = field1;
      payload.Field2 = field2;
      payload.Field3 = field3;
      payload.Field4 = field4;
      payload.Field5 = field5;
      payload.Field6 = field6;
      payload.LongText = longText;
    } else if (editType === 'profile') {
      payload.LongText = longText; // profile text reflections
    } else if (editType === 'dissertation') {
      payload.Field1 = field1; // general text attributes map dynamically
      payload.Field2 = field2;
      payload.Field3 = field3;
      payload.Field4 = field4;
      payload.Field5 = field5;
      payload.Field6 = field6;
      payload.LongText = longText;
    } else if (editType === 'hour') {
      payload.Date = field1 || new Date().toISOString().split('T')[0];
      payload.ResearchActivity = field2;
      payload.WorkDescription = longText;
      payload.Hours = Number(field3) || 0;
      payload.SupervisorAdvisor = field4;
    } else if (editType === 'competency') {
      payload.Competency = field1;
      payload.Level = level;
      payload.EvidenceRemarks = longText;
    }

    onSaveAction(selectedSection, { type: editType, payload });
    setIsModalOpen(false);
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      setAttachmentUrl('https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    }
  };

  // Section level metrics
  const getSubRecords = (subNo: string) => records.filter(r => r.SectionNo === selectedSection && r.SubsectionNo === subNo);

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans">
      {/* Left Sidebar navigation of Sections */}
      <div className="w-full lg:w-1/4 space-y-2 lg:border-r lg:border-gray-200 lg:pr-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Portfolio Directory</h3>
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 scrollbar-none">
          {SECTIONS_CONFIG.map((sec) => (
            <button
              key={sec.no}
              onClick={() => setSelectedSection(sec.no)}
              className={`flex-shrink-0 text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 border w-64 lg:w-full cursor-pointer ${
                selectedSection === sec.no
                  ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-[#FFF8E7] border-gray-200'
              }`}
            >
              <span className="truncate">{sec.no}. {sec.title.split('. ')[1]}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${selectedSection === sec.no ? 'text-[#F9C94A]' : 'text-gray-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Right Workstation Content */}
      <div className="flex-1 bg-white border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm min-h-[550px]">
        
        {/* Section Heading info */}
        <div className="border-b border-gray-200/60 pb-4 mb-6">
          <h2 className="text-lg font-bold text-[#1A1A1A]">
            {SECTIONS_CONFIG.find(s => s.no === selectedSection)?.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {SECTIONS_CONFIG.find(s => s.no === selectedSection)?.desc}
          </p>
        </div>

        {/* Dynamic section rendering logic */}

        {/* SECTION 1 */}
        {selectedSection === 1 && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FFF8E7] border border-[#F9C94A]/30 rounded-xl">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-1.5 mb-1">
                <FileText className="w-4 h-4 text-red-800" />
                1.4 Goals for Doctoral Study
              </h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Describe why you enrolled in the PhD program, what you hope to achieve, and how the program aligns with your future career goals.
              </p>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm min-h-[80px] italic">
                {profile?.GoalsForDoctoralStudy || 'Not entered yet.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '1.4', 'Update Goals for Doctoral Study', { LongText: profile?.GoalsForDoctoralStudy })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Statement
              </button>
            </div>

            {/* Academic Background sub table */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">1.2 Academic Background</h3>
                <button
                  onClick={() => openFormModal('portfolio', '1.2', 'Add Academic Degree Record')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Degree
                </button>
              </div>

              <table className="w-full border border-gray-200 font-sans text-xs text-left">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2 w-1/4">Degree</th>
                    <th className="p-2">Field</th>
                    <th className="p-2">Institution</th>
                    <th className="p-2 w-16">Year</th>
                    <th className="p-2">Remarks</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('1.2').length === 0 ? (
                    <tr><td colSpan={6} className="p-4 text-center text-gray-400 italic">No degrees logged.</td></tr>
                  ) : (
                    getSubRecords('1.2').map((r) => (
                      <tr key={r.RecordID} className="border-b border-gray-100">
                        <td className="p-2 font-medium text-gray-900">{r.Field1}</td>
                        <td className="p-2">{r.Field2}</td>
                        <td className="p-2">{r.Field3}</td>
                        <td className="p-2 font-mono">{r.Field4}</td>
                        <td className="p-2">{r.Field5}</td>
                        <td className="p-2 flex gap-1 justify-center">
                          <button onClick={() => openFormModal('portfolio', '1.2', 'Edit Academic Degree', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onDeleteRecord(1, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Professional Background */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">1.3 Professional Background</h3>
                <button
                  onClick={() => openFormModal('portfolio', '1.3', 'Add Professional Record')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              <table className="w-full border border-gray-200 font-sans text-xs text-left">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2 w-1/4">Period</th>
                    <th className="p-2">Role / Organization</th>
                    <th className="p-2">Remarks / Specialties</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('1.3').length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No job histories logged.</td></tr>
                  ) : (
                    getSubRecords('1.3').map((r) => (
                      <tr key={r.RecordID} className="border-b border-gray-100">
                        <td className="p-2 font-mono text-gray-900">{r.Field1}</td>
                        <td className="p-2 font-semibold">{r.Field2}</td>
                        <td className="p-2">{r.Field3}</td>
                        <td className="p-2 flex gap-1 justify-center">
                          <button onClick={() => openFormModal('portfolio', '1.3', 'Edit Professional Record', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onDeleteRecord(1, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2 */}
        {selectedSection === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800">2.1 Planned Program of Study</h3>
              <button
                onClick={() => openFormModal('portfolio', '2.1', 'Add Planned Course')}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course Plan
              </button>
            </div>
            <table className="w-full border border-gray-200 font-sans text-xs text-left">
              <thead className="bg-slate-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="p-2">Semester / Year</th>
                  <th className="p-2">Course Code</th>
                  <th className="p-2">Course Title</th>
                  <th className="p-2">Credits</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {getSubRecords('2.1').length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400 italic">No course plans recorded.</td></tr>
                ) : (
                  getSubRecords('2.1').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-mono text-gray-900">{r.Field1}</td>
                      <td className="p-2 font-mono font-bold text-red-900">{r.Field2}</td>
                      <td className="p-2">{r.Field3}</td>
                      <td className="p-2 font-mono">{r.Field4}</td>
                      <td className="p-2 font-semibold text-green-900">{r.Field5}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '2.1', 'Edit Course Plan', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(2, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Milestones timeline */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">2.2 Doctoral Milestones and Timeline</h3>
                <button
                  onClick={() => openFormModal('portfolio', '2.2', 'Add Milestone Objective')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
              </div>
              <table className="w-full border border-gray-200 font-sans text-xs text-left">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2">Milestone</th>
                    <th className="p-2">Planned Date</th>
                    <th className="p-2">Actual Date</th>
                    <th className="p-2">Remarks</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('2.2').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-semibold text-gray-800">{r.Field1}</td>
                      <td className="p-2 font-mono">{r.Field2 || '-'}</td>
                      <td className="p-2 font-mono text-green-800 font-bold">{r.Field3 || 'In Progress'}</td>
                      <td className="p-2">{r.Field4}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '2.2', 'Edit Milestone', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(2, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2.3 learning plan */}
            <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-xl">
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-4 h-4 text-red-800" />
                2.3 Personal Learning and Development Plan
              </h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Identify the competencies or specific research methodology domains you intend to strengthen during the next academic block.
              </p>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm italic whitespace-pre-wrap">
                {profile?.DevelopmentPlan || 'No developmental plans recorded.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '2.3', 'Update Personal Development Plan', { LongText: profile?.DevelopmentPlan })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Development Plan
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3 */}
        {selectedSection === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800">3.1 Record of English Language Test</h3>
              <button
                onClick={() => openFormModal('portfolio', '3.1', 'Add English Test Score')}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Score
              </button>
            </div>
            <table className="w-full border border-gray-200 font-sans text-xs text-left mb-6">
              <thead className="bg-slate-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="p-2">Test Name</th>
                  <th className="p-2">Date Taken</th>
                  <th className="p-2 text-right">Score</th>
                  <th className="p-2 text-right">Required</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2">Evidence Link</th>
                  <th className="p-2 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {getSubRecords('3.1').length === 0 ? (
                  <tr><td colSpan={7} className="p-4 text-center text-gray-400 italic">No English scores recorded.</td></tr>
                ) : (
                  getSubRecords('3.1').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-bold text-gray-900">{r.Field1}</td>
                      <td className="p-2 font-mono">{r.Field2}</td>
                      <td className="p-2 text-right font-mono font-semibold text-red-900">{r.Field3}</td>
                      <td className="p-2 text-right font-mono">{r.Field4}</td>
                      <td className="p-2 text-center font-bold text-green-950">{r.Field5}</td>
                      <td className="p-2 font-mono text-[10px] text-blue-800 truncate max-w-[120px]">{r.Field6 || '-'}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '3.1', 'Edit English Score', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(3, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* English development activities */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">3.2 English Development Activities</h3>
                <button
                  onClick={() => openFormModal('portfolio', '3.2', 'Add Activity Log')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Activity
                </button>
              </div>
              <table className="w-full border border-gray-200 font-sans text-xs text-left mb-6">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Activity / Course</th>
                    <th className="p-2">Organizer</th>
                    <th className="p-2">Description</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('3.2').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-mono">{r.Field1}</td>
                      <td className="p-2 font-semibold text-gray-800">{r.Field2}</td>
                      <td className="p-2">{r.Field3}</td>
                      <td className="p-2">{r.Field4}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '3.2', 'Edit Activity Log', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(3, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* English reflection */}
            <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-xl">
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-4 h-4 text-red-800" />
                3.3 Reflection on English Development
              </h3>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm italic">
                {profile?.EnglishReflection || 'No reflections logged.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '3.3', 'Update English Reflection', { LongText: profile?.EnglishReflection })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Reflection
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4 */}
        {selectedSection === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800">4.1 Courses Completed</h3>
              <button
                onClick={() => openFormModal('portfolio', '4.1', 'Add Completed Course')}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>
            <table className="w-full border border-gray-200 font-sans text-xs text-left mb-6">
              <thead className="bg-slate-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="p-2">Course Code</th>
                  <th className="p-2">Course Title</th>
                  <th className="p-2">Semester / Year</th>
                  <th className="p-2">Credits</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {getSubRecords('4.1').map((r) => (
                  <tr key={r.RecordID} className="border-b border-gray-100">
                    <td className="p-2 font-mono font-bold text-red-900">{r.Field1}</td>
                    <td className="p-2 font-semibold">{r.Field2}</td>
                    <td className="p-2 font-mono">{r.Field3}</td>
                    <td className="p-2 font-mono">{r.Field4}</td>
                    <td className="p-2 font-mono font-bold text-green-900">{r.Field5}</td>
                    <td className="p-2 flex gap-1 justify-center">
                      <button onClick={() => openFormModal('portfolio', '4.1', 'Edit Course Completed', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDeleteRecord(4, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Key learnings */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">4.2 Key Learning from Coursework</h3>
                <button
                  onClick={() => openFormModal('portfolio', '4.2', 'Add Course takeaways')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add takeaway
                </button>
              </div>
              <table className="w-full border border-gray-200 font-sans text-xs text-left">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2">Course Name</th>
                    <th className="p-2">Key Learning Summary</th>
                    <th className="p-2">Application to Dissertation</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('4.2').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-semibold text-gray-800">{r.Field1}</td>
                      <td className="p-2">{r.Field2}</td>
                      <td className="p-2 font-medium">{r.Field3}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '4.2', 'Edit Takeaways', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(4, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 5 */}
        {selectedSection === 5 && (
          <div className="space-y-6 text-xs">
            {/* Dissertation basic summary info */}
            <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl relative">
              <h3 className="text-sm font-bold text-red-950 mb-3">5.2 Dissertation Information Summary</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">Dissertation Title</span>
                  <p className="font-semibold text-red-900 mt-0.5">{dissertation?.Title || 'No registered dissertation project'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">Ethics App Date</span>
                    <p className="font-mono mt-0.5">{dissertation?.EthicsApplicationDate || 'Drafting'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">Approval Code</span>
                    <p className="font-mono mt-0.5">{dissertation?.ApprovalNumber || 'Pending Review'}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openFormModal('dissertation', '5.2', 'Update Dissertation Project Info', dissertation)}
                className="mt-3.5 px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Edit Dissertation Fields
              </button>
            </div>

            {/* Meetings Table */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">5.4 Meetings with Advisor / Committee</h3>
                <button
                  onClick={() => openFormModal('portfolio', '5.4', 'Add Meeting Log')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Meeting
                </button>
              </div>
              <table className="w-full border border-gray-200 font-sans text-xs text-left">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2 w-24">Date</th>
                    <th className="p-2">Attendees</th>
                    <th className="p-2">Discussion Details</th>
                    <th className="p-2">Action Points</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('5.4').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-mono text-gray-900">{r.Field1}</td>
                      <td className="p-2 font-semibold">{r.Field2}</td>
                      <td className="p-2 text-gray-600">{r.Field3}</td>
                      <td className="p-2 text-red-950 font-medium">{r.Field4}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '5.4', 'Edit Meeting Log', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(5, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 6 */}
        {selectedSection === 6 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800">6.1 Supervised Research Development Hours</h3>
              <button
                onClick={() => openFormModal('hour', '6.1', 'Log Research Hours')}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Log Hours
              </button>
            </div>
            <table className="w-full border border-gray-200 font-sans text-xs text-left">
              <thead className="bg-slate-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="p-2">Date</th>
                  <th className="p-2">Activity Description</th>
                  <th className="p-2">Task Details</th>
                  <th className="p-2 text-right">Hours</th>
                  <th className="p-2">Supervisor</th>
                  <th className="p-2 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {researchHours.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400 italic">No research development hours logged.</td></tr>
                ) : (
                  researchHours.map((h) => (
                    <tr key={h.HourID} className="border-b border-gray-100">
                      <td className="p-2 font-mono text-gray-900">{h.Date}</td>
                      <td className="p-2 font-semibold text-gray-850">{h.ResearchActivity}</td>
                      <td className="p-2 text-gray-600">{h.WorkDescription}</td>
                      <td className="p-2 font-mono text-right font-bold text-red-900">{h.Hours}</td>
                      <td className="p-2">{h.SupervisorAdvisor}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('hour', '6.1', 'Edit Hours Record', h)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(6, { id: h.HourID, type: 'hour' })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* reflection */}
            <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-xl">
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                <Activity className="w-4 h-4 text-red-800" />
                6.2 Reflection on Research Experience
              </h3>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm italic">
                {profile?.ResearchExperienceReflection || 'No reflections logged.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '6.2', 'Update Research Reflection', { LongText: profile?.ResearchExperienceReflection })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Reflection
              </button>
            </div>
          </div>
        )}

        {/* SECTION 7 */}
        {selectedSection === 7 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800">7.2 Peer-Reviewed Journal Publications</h3>
              <button
                onClick={() => openFormModal('portfolio', '7.2', 'Add Publication Record')}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Publication
              </button>
            </div>
            <table className="w-full border border-gray-200 font-sans text-xs text-left mb-6">
              <thead className="bg-slate-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="p-2 w-16">Year</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Journal / Proceedings</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">DOI Reference</th>
                  <th className="p-2 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {getSubRecords('7.2').length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400 italic">No publications recorded.</td></tr>
                ) : (
                  getSubRecords('7.2').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-mono text-gray-900">{r.Field1}</td>
                      <td className="p-2 font-bold text-gray-900">{r.Field2}</td>
                      <td className="p-2 font-medium">{r.Field3}</td>
                      <td className="p-2 font-semibold text-red-900">{r.Field4}</td>
                      <td className="p-2 font-mono text-[10px] text-blue-900">{r.Field5}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '7.2', 'Edit Publication', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(7, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Conference presentation info */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">7.1 Conference Presentations</h3>
                <button
                  onClick={() => openFormModal('portfolio', '7.1', 'Add Presentation Record')}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Presentation
                </button>
              </div>
              <table className="w-full border border-gray-200 font-sans text-xs text-left">
                <thead className="bg-slate-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Presentation Title</th>
                    <th className="p-2">Conference / Forum</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Venue / City</th>
                    <th className="p-2 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubRecords('7.1').map((r) => (
                    <tr key={r.RecordID} className="border-b border-gray-100">
                      <td className="p-2 font-mono text-gray-900">{r.Field1}</td>
                      <td className="p-2 font-semibold">{r.Field2}</td>
                      <td className="p-2">{r.Field3}</td>
                      <td className="p-2 font-medium">{r.Field4}</td>
                      <td className="p-2">{r.Field5}</td>
                      <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => openFormModal('portfolio', '7.1', 'Edit Presentation', r)} className="p-1 hover:text-red-800"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRecord(7, { id: r.RecordID })} className="p-1 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 10 */}
        {selectedSection === 10 && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl">
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-4 h-4 text-red-800" />
                10.1 Reflection on Academic Growth
              </h3>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm italic">
                {profile?.AcademicGrowthReflection || 'Not entered yet.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '10.1', 'Edit Academic Growth Reflection', { LongText: profile?.AcademicGrowthReflection })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Statement
              </button>
            </div>

            <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl">
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                <Users className="w-4 h-4 text-red-800" />
                10.2 Reflection on Research Identity
              </h3>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm italic">
                {profile?.ResearchIdentityReflection || 'Not entered yet.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '10.2', 'Edit Research Identity Reflection', { LongText: profile?.ResearchIdentityReflection })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Statement
              </button>
            </div>

            <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl">
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                <Activity className="w-4 h-4 text-red-800" />
                10.3 Reflection on Challenges and Resilience
              </h3>
              <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm italic">
                {profile?.ChallengesReflection || 'Not entered yet.'}
              </div>
              <button
                onClick={() => openFormModal('profile', '10.3', 'Edit Challenges Reflection', { LongText: profile?.ChallengesReflection })}
                className="mt-3 text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 cursor-pointer"
              >
                Edit Statement
              </button>
            </div>
          </div>
        )}

        {/* SECTION 12 */}
        {selectedSection === 12 && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FFF8E7] rounded-xl border border-amber-200 text-gray-800 text-xs leading-relaxed">
              <strong>Grading Reference:</strong> Grade your expertise level as one of:
              <span className="font-bold text-slate-500 ml-1">Beginning</span>,
              <span className="font-bold text-amber-500 ml-1">Developing</span>,
              <span className="font-bold text-emerald-600 ml-1">Competent</span>, or
              <span className="font-bold text-red-700 ml-1">Proficient</span>.
            </div>

            <table className="w-full border border-gray-200 font-sans text-xs text-left">
              <thead className="bg-slate-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="p-2.5">Competency Element</th>
                  <th className="p-2.5">My Grade</th>
                  <th className="p-2.5">Evidence Remarks</th>
                  <th className="p-2.5 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {competencies.map((comp) => (
                  <tr key={comp.AssessmentID} className="border-b border-gray-100">
                    <td className="p-2.5 font-semibold text-gray-800">{comp.Competency}</td>
                    <td className="p-2.5">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          comp.Level === 'Proficient'
                            ? 'bg-red-100 text-red-900 border border-red-200'
                            : comp.Level === 'Competent'
                            ? 'bg-green-100 text-green-900 border border-green-200'
                            : comp.Level === 'Developing'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {comp.Level}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-500">{comp.EvidenceRemarks || '-'}</td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => openFormModal('competency', '12', 'Update Competency assessment', comp)}
                        className="p-1 text-gray-500 hover:text-red-800 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Catch-all for basic sections */}
        {![1, 2, 3, 4, 5, 6, 7, 10, 12, 11, 15, 16].includes(selectedSection) && (
          <div className="space-y-6 text-center py-12 text-gray-400 font-medium italic">
            This section is organized under general coursework or clinical summaries.
            <div className="pt-4">
              <button
                onClick={() => openFormModal('portfolio', String(selectedSection), `Add entry to Section ${selectedSection}`)}
                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
              >
                Log Entry Record
              </button>
            </div>
          </div>
        )}

        {/* Section 15: Read-only Advisor Comments */}
        {selectedSection === 15 && (
          <div className="space-y-4">
            <div className="p-5 bg-amber-50/20 border border-amber-200/50 rounded-xl italic text-gray-500">
              No evaluation advisor comments have been recorded. If they exist, advisors sign and write them inside their Workspace panels.
            </div>
          </div>
        )}

        {/* Section 16: Read-only Endorsements */}
        {selectedSection === 16 && (
          <div className="space-y-4">
            <div className="p-5 bg-amber-50/20 border border-amber-200/50 rounded-xl italic text-gray-500">
              Assigned advisor endorsement signatures will populate here automatically upon signature completion.
            </div>
          </div>
        )}
      </div>

      {/* Editing Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <form onSubmit={handleFormSubmit} className="space-y-4 font-sans text-xs">
          {editType === 'portfolio' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Attribute Name (Column 1)</label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g. TOEFL ITP, Course Code, Degree"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Detailed Attribute (Column 2)</label>
                <input
                  type="text"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  placeholder="e.g. Core Seminar, Score Achieved"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Status / Year (Column 3)</label>
                  <input
                    type="text"
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    placeholder="e.g. 2026, Pass, Grade A"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Remarks / Notes (Column 4)</label>
                  <input
                    type="text"
                    value={field4}
                    onChange={(e) => setField4(e.target.value)}
                    placeholder="e.g. Certificate available"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          {editType === 'profile' && (
            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">Write statement reflection below:</label>
              <textarea
                rows={6}
                value={longText}
                onChange={(e) => setLongText(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-hidden font-normal"
                required
              />
            </div>
          )}

          {editType === 'dissertation' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Dissertation Project Title</label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="Insert thesis title"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Objectives & Methodology Summary</label>
                <textarea
                  rows={4}
                  value={longText}
                  onChange={(e) => setLongText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>
            </>
          )}

          {editType === 'hour' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Date of Work</label>
                <input
                  type="date"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono focus:outline-hidden"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Research Activity</label>
                  <input
                    type="text"
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    placeholder="e.g. Data Collection, Analysis"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Logged Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono focus:outline-hidden"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Work Description Detail</label>
                <textarea
                  rows={3}
                  value={longText}
                  onChange={(e) => setLongText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Supervising Advisor Name</label>
                <input
                  type="text"
                  value={field4}
                  onChange={(e) => setField4(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>
            </>
          )}

          {editType === 'competency' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Competency Area</label>
                <input
                  type="text"
                  value={field1}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Self-Assessment Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                >
                  <option value="Beginning">Beginning (Fundamental concepts)</option>
                  <option value="Developing">Developing (Active practice)</option>
                  <option value="Competent">Competent (Independent execution)</option>
                  <option value="Proficient">Proficient (Scholarly expert/instructor)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Evidence / Supporting Remarks</label>
                <textarea
                  rows={3}
                  value={longText}
                  onChange={(e) => setLongText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                />
              </div>
            </>
          )}

          {/* Evidence attachment simulated input */}
          <div className="p-3 bg-red-50/20 border border-red-100 rounded-lg space-y-1.5">
            <label className="font-bold text-red-950 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-red-800" />
              Attach Verification File (Optional Evidence)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={handleSimulatedFileUpload}
              className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-red-50 file:text-red-900 hover:file:bg-red-100 cursor-pointer"
            />
            {attachmentName && (
              <p className="text-[10px] text-green-800 font-semibold font-mono">✓ Ready: {attachmentName}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-amber-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 hover:bg-red-950 text-white rounded-lg font-bold shadow-md"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
