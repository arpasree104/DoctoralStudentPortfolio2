/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { exportStudentToExcel } from '../lib/excelExporter';
import {
  Users,
  Search,
  CheckCircle,
  MessageSquare,
  FileText,
  ChevronRight,
  Clock,
  User,
  Plus,
  Send,
  AlertCircle
} from 'lucide-react';
import {
  User as UserType,
  PortfolioRecord,
  StudentProfile,
  Dissertation,
  ResearchHour,
  CompetencyAssessment,
  AdvisorComment,
  Endorsement,
  Evidence,
  ChatMessage,
  Notification,
  StudentCertificate,
  StudentActivity
} from '../types';

import StudentDashboard from './StudentDashboard';
import StudentInformation from './StudentInformation';
import PortfolioRecordsEntry from './PortfolioRecordsEntry';
import PrintReport from './PrintReport';

interface AdvisorWorkspaceProps {
  advisorUser: UserType;
  students: UserType[];
  records: PortfolioRecord[];
  profiles: StudentProfile[];
  dissertations: Dissertation[];
  researchHours: ResearchHour[];
  competencies: CompetencyAssessment[];
  comments: AdvisorComment[];
  endorsements: Endorsement[];
  evidence: Evidence[];
  chats: ChatMessage[];
  notifications: Notification[];
  certificates: StudentCertificate[];
  activities: StudentActivity[];
  onSaveRecord: (section: number, payload: any) => void;
  onDeleteRecord: (section: number, payload: any) => void;
  onSendChat: (receiverId: string, text: string) => void;
  onSendNotify: (receiverId: string, title: string, message: string) => void;
  onSaveComment: (studentId: string, text: string, rec: string) => void;
  onSignEndorsement: (studentId: string, role: string, signature: string) => void;
  onSaveCertificate: (cert: any) => void;
  onDeleteCertificate: (id: string) => void;
  onSaveActivity: (act: any) => void;
  onDeleteActivity: (id: string) => void;
}

export default function AdvisorWorkspace({
  advisorUser,
  students,
  records,
  profiles,
  dissertations,
  researchHours,
  competencies,
  comments,
  endorsements,
  evidence,
  chats,
  notifications,
  certificates,
  activities,
  onSaveRecord,
  onDeleteRecord,
  onSendChat,
  onSendNotify,
  onSaveComment,
  onSignEndorsement,
  onSaveCertificate,
  onDeleteCertificate,
  onSaveActivity,
  onDeleteActivity
}: AdvisorWorkspaceProps) {

  const [selectedStudentId, setSelectedStudentId] = React.useState<string>(students[0]?.UserID || '');
  const [activeTab, setActiveTab] = React.useState<'overview' | 'info' | 'portfolio' | 'chat' | 'notify' | 'comments' | 'endorsements' | 'report'>('overview');
  const [innerSelectedSection, setInnerSelectedSection] = React.useState(1);

  // Chat message typing
  const [chatInput, setChatInput] = React.useState('');

  // Announcement typing
  const [notifyTitle, setNotifyTitle] = React.useState('');
  const [notifyMsg, setNotifyMsg] = React.useState('');

  // Comment typing
  const [commentText, setCommentText] = React.useState('');
  const [commentRec, setCommentRec] = React.useState('');

  // Endorsement typing
  const [sigRole, setSigRole] = React.useState<'Major Advisor' | 'Co-Advisor / Committee Member' | 'Committee Member'>('Major Advisor');
  const [sigName, setSigName] = React.useState('');

  const activeStudent = students.find(s => s.UserID === selectedStudentId);

  React.useEffect(() => {
    if (activeStudent) {
      const studentComment = comments.find(c => c.StudentUserID === activeStudent.UserID);
      setCommentText(studentComment?.CommentText || '');
      setCommentRec(studentComment?.Recommendation || '');
    }
  }, [selectedStudentId, comments]);

  if (!activeStudent) {
    return (
      <div className="p-8 text-center bg-[#FFFDF9] border border-amber-200 rounded-xl font-sans">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-700">No Associated Students</h3>
        <p className="text-sm text-gray-500 mt-1">There are currently no students linked to your advisor profile in the database settings.</p>
      </div>
    );
  }

  // Filter Student Data specifically
  const studentRecords = records.filter(r => r.StudentUserID === activeStudent.UserID);
  const studentProfile = profiles.find(p => p.StudentUserID === activeStudent.UserID) || null;
  const studentDissertation = dissertations.find(d => d.StudentUserID === activeStudent.UserID) || null;
  const studentHours = researchHours.filter(h => h.StudentUserID === activeStudent.UserID);
  const studentCompetencies = competencies.filter(c => c.StudentUserID === activeStudent.UserID);
  const studentEvidence = evidence.filter(e => e.StudentUserID === activeStudent.UserID);
  const studentChats = chats.filter(
    c => c.StudentUserID === activeStudent.UserID && (c.SenderUserID === advisorUser.UserID || c.ReceiverUserID === advisorUser.UserID)
  ).sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime());

  // Hours progress metric
  const loggedHrs = studentHours.reduce((sum, h) => sum + h.Hours, 0);

  // Unread chat indicator
  const unreadCount = chats.filter(c => c.StudentUserID === activeStudent.UserID && c.ReceiverUserID === advisorUser.UserID && !c.IsRead).length;

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendChat(activeStudent.UserID, chatInput.trim());
      setChatInput('');
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyTitle.trim() && notifyMsg.trim()) {
      onSendNotify(activeStudent.UserID, notifyTitle.trim(), notifyMsg.trim());
      setNotifyTitle('');
      setNotifyMsg('');
      alert('Announcement sent to student!');
    }
  };

  const handleSaveCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveComment(activeStudent.UserID, commentText.trim(), commentRec.trim());
    alert('Evaluation Comments Saved Successfully!');
  };

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sigName.trim()) {
      onSignEndorsement(activeStudent.UserID, sigRole, sigName.trim());
      setSigName('');
      alert(`Successfully signed as ${sigRole}!`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Welcome Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-black/5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Advisor Workspace Portal</h1>
          <p className="text-xs text-gray-500 mt-1">Manage, evaluate, and direct thesis developments for your assigned PhD students.</p>
        </div>
        <div className={`flex items-center gap-2 border px-3.5 py-1.5 rounded-lg text-xs font-bold ${
          advisorUser.Role === 'SuperAdvisor'
            ? 'bg-purple-50 text-purple-700 border-purple-200'
            : 'bg-[#FFF8E7] text-[#B91C1C] border-[#F9C94A]/20'
        }`}>
          <CheckCircle className={`w-4 h-4 ${advisorUser.Role === 'SuperAdvisor' ? 'text-purple-700' : 'text-[#B91C1C]'}`} />
          <span>{advisorUser.Role === 'SuperAdvisor' ? 'SuperAdvisor' : advisorUser.Role === 'CoAdvisor' ? 'Co-Advisor' : 'Advisor'}: {advisorUser.FullName}</span>
        </div>
      </div>

      {/* Main Multi-Column Master-Detail container */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Overseen Student Selector Sidebar list */}
        <div className="w-full lg:w-1/4 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">{advisorUser.Role === 'SuperAdvisor' ? 'All PhD Students' : 'My Advisees'}</h3>
          <div className="space-y-2.5">
            {students.map((std) => {
              const stdHours = researchHours.filter(h => h.StudentUserID === std.UserID).reduce((sum, h) => sum + h.Hours, 0);
              const progress = Math.min(100, Math.round((stdHours / 180) * 100));
              const isSelected = std.UserID === selectedStudentId;

              return (
                <button
                  key={std.UserID}
                  onClick={() => {
                    setSelectedStudentId(std.UserID);
                    setActiveTab('overview');
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                      : 'bg-white hover:bg-[#FFF8E7]/30 border-gray-200'
                  }`}
                >
                  {std.PhotoURL ? (
                    <img
                      src={std.PhotoURL}
                      alt={std.FullName}
                      referrerPolicy="no-referrer"
                      className={`w-11 h-11 rounded-lg object-cover border-2 ${isSelected ? 'border-[#F9C94A]' : 'border-gray-200'}`}
                    />
                  ) : (
                    <div className="w-11 h-11 bg-red-100 text-[#B91C1C] rounded-lg flex items-center justify-center font-bold text-sm">
                      ST
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold truncate">{std.FullName}</h4>
                    <p className={`text-[10px] font-mono ${isSelected ? 'text-red-200' : 'text-gray-400'}`}>ID: {std.StudentID}</p>
                    {/* Tiny progress visual */}
                    <div className="pt-1 space-y-0.5">
                      <div className="flex justify-between text-[8px] font-bold">
                        <span>Research hours</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isSelected ? 'bg-[#F9C94A]' : 'bg-[#B91C1C]'}`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Unread message bubble notification */}
                  {chats.filter(c => c.StudentUserID === std.UserID && c.ReceiverUserID === advisorUser.UserID && !c.IsRead).length > 0 && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-[#F9C94A] text-[#1A1A1A] rounded-full flex items-center justify-center text-[8px] font-extrabold animate-bounce">
                      {chats.filter(c => c.StudentUserID === std.UserID && c.ReceiverUserID === advisorUser.UserID && !c.IsRead).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Overseen Student Active Tabs Workstation */}
        <div className="flex-1 bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Workstation Top Tabs controller */}
          <div className="bg-[#FFF8E7]/40 border-b border-gray-200 flex flex-wrap gap-1 p-2">
            {[
              { id: 'overview', title: 'Overview' },
              { id: 'info', title: 'Information' },
              { id: 'portfolio', title: 'Portfolio Sections' },
              { id: 'chat', title: 'Chat' },
              { id: 'notify', title: 'Announcements' },
              { id: 'comments', title: 'Comments Evaluation' },
              { id: 'endorsements', title: 'Endorsements Sign' },
              { id: 'report', title: 'Full Report Cover' }
            ].map((tb) => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tb.id
                    ? 'bg-[#B91C1C] text-white font-bold shadow-sm'
                    : 'text-gray-600 hover:bg-[#FFF8E7] hover:text-gray-900'
                }`}
              >
                {tb.title}
              </button>
            ))}
          </div>

          {/* Tab Workstation body panel */}
          <div className="p-5 md:p-6 bg-white">
            
            {activeTab === 'overview' && (
              <StudentDashboard
                user={activeStudent}
                records={studentRecords}
                researchHours={studentHours}
                evidence={studentEvidence}
                notifications={notifications.filter(n => n.ReceiverUserID === activeStudent.UserID)}
                unreadChatCount={unreadCount}
                navigate={(page) => {
                  if (page === 'information') setActiveTab('info');
                  if (page === 'report') setActiveTab('report');
                  if (page === 'chat') setActiveTab('chat');
                  if (page === 'notify') setActiveTab('notify');
                }}
                setSelectedSection={(num) => {
                  setInnerSelectedSection(num);
                  setActiveTab('portfolio');
                }}
              />
            )}

            {activeTab === 'info' && (
              <StudentInformation
                student={activeStudent}
                advisor={advisorUser}
                coadvisor={null} // placeholder co-advisor lookup or just null
                onSaveProfile={(payload) => onSaveRecord(1, { type: 'profile', payload })}
                currentUser={advisorUser}
                certificates={certificates}
                activities={activities}
                onSaveCertificate={onSaveCertificate}
                onDeleteCertificate={onDeleteCertificate}
                onSaveActivity={onSaveActivity}
                onDeleteActivity={onDeleteActivity}
              />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioRecordsEntry
                studentId={activeStudent.UserID}
                records={studentRecords}
                profile={studentProfile}
                dissertation={studentDissertation}
                researchHours={studentHours}
                competencies={studentCompetencies}
                evidence={studentEvidence}
                selectedSection={innerSelectedSection}
                setSelectedSection={setInnerSelectedSection}
                onSaveRecord={onSaveRecord}
                onDeleteRecord={onDeleteRecord}
              />
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <h3 className="font-bold text-sm text-red-950">Direct Advisor Chat Channel</h3>
                  <span className="text-[10px] bg-green-100 text-green-900 font-bold px-2 py-0.5 rounded-full border border-green-200">Online advisee: {activeStudent.FullName}</span>
                </div>

                <div className="h-96 overflow-y-auto p-4 bg-slate-50 rounded-xl space-y-4 border border-gray-200">
                  {studentChats.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-gray-400 italic">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                      No chat logs logged. Start conversation below.
                    </div>
                  ) : (
                    studentChats.map((msg) => {
                      const isMe = msg.SenderUserID === advisorUser.UserID;
                      return (
                        <div key={msg.MessageID} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl p-3.5 shadow-xs text-xs leading-relaxed ${
                            isMe
                              ? 'bg-red-800 text-white rounded-tr-none'
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                          }`}>
                            <p className="font-bold text-[10px] opacity-75 mb-1">{isMe ? 'Advisor (You)' : activeStudent.FullName}</p>
                            <p className="font-medium">{msg.MessageText}</p>
                            <span className="block text-[8px] text-right mt-1.5 opacity-60 font-mono">
                              {new Date(msg.CreatedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type supportive message to advisor chat..."
                    className="flex-1 px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-red-800 focus:outline-hidden"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-800 hover:bg-red-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notify' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-red-950">Broadcast Advisor Alert Notification</h3>
                <p className="text-xs text-gray-500">Sends a direct notification alerts card to this student\'s homepage board.</p>

                <form onSubmit={handleNotifySubmit} className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Alert Title</label>
                    <input
                      type="text"
                      value={notifyTitle}
                      onChange={(e) => setNotifyTitle(e.target.value)}
                      placeholder="e.g. Schedule for Pre-Defense draft upload"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Alert Message Body</label>
                    <textarea
                      rows={4}
                      value={notifyMsg}
                      onChange={(e) => setNotifyMsg(e.target.value)}
                      placeholder="Write message instruction guidelines..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-800 hover:bg-red-950 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Dispatch Alert Card
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-5">
                <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl">
                  <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-4 h-4 text-red-800" />
                    Section 15. Advisor’s Annual Review Comments
                  </h3>
                  <p className="text-xs text-gray-500">Provide qualitative assessments, evaluation comments, and action guidelines for the advisee.</p>
                </div>

                <form onSubmit={handleSaveCommentSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Advisor Evaluation Comments (Section 15.1)</label>
                    <textarea
                      rows={5}
                      value={commentText}
                      onChange={(e) => setCommentCommentText(e.target.value)}
                      placeholder="e.g. Kittisak exhibits strong critical analysis and course grades are outstanding. Recommending IRB submissions..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Official Advisor Recommendations</label>
                    <input
                      type="text"
                      value={commentRec}
                      onChange={(e) => setCommentRec(e.target.value)}
                      placeholder="e.g. Proceed to Proposal Pre-Defense stage"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-800 hover:bg-red-950 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                  >
                    Save & Sign Comments Block
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'endorsements' && (
              <div className="space-y-5">
                <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl">
                  <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="w-4 h-4 text-red-800" />
                    Section 16. Structural Committee Endorsements
                  </h3>
                  <p className="text-xs text-gray-500">E-Sign the official clearances confirming complete evaluation of the portfolio log sheets.</p>
                </div>

                <form onSubmit={handleSignSubmit} className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Signatory Committee Role</label>
                      <select
                        value={sigRole}
                        onChange={(e) => setSigRole(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-hidden font-semibold"
                      >
                        <option value="Major Advisor">Major Advisor / Thesis Chair</option>
                        <option value="Co-Advisor / Committee Member">Thesis Co-advisor</option>
                        <option value="Committee Member">Secondary Committee Member</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Electronic Signature Text</label>
                      <input
                        type="text"
                        value={sigName}
                        onChange={(e) => setSigName(e.target.value)}
                        placeholder="e.g. Dr. Anchalee Jedsadaphan"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-serif italic font-bold focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-800 hover:bg-red-950 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                  >
                    E-Sign Clearance Stamp
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'report' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#FFFDF9] border border-amber-200/30 p-4 rounded-xl">
                  <div>
                    <h3 className="font-bold text-red-950">Export Official Student Portfolio</h3>
                    <p className="text-xs text-gray-500">Print standard A4 documents or export the student's complete portfolio dataset as an Excel spreadsheet.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportStudentToExcel({
                        student: activeStudent,
                        advisor: advisorUser,
                        coadvisor: null,
                        records: studentRecords,
                        profile: studentProfile,
                        dissertation: studentDissertation,
                        researchHours: studentHours,
                        competencies: studentCompetencies,
                        certificates: certificates.filter(c => c.StudentUserID === activeStudent.UserID),
                        activities: activities.filter(a => a.StudentUserID === activeStudent.UserID)
                      })}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      Export Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      Print / Save PDF
                    </button>
                  </div>
                </div>
                <PrintReport
                  student={activeStudent}
                  advisor={advisorUser}
                  coadvisor={null}
                  records={studentRecords}
                  profile={studentProfile}
                  dissertation={studentDissertation}
                  researchHours={studentHours}
                  competencies={studentCompetencies}
                  comments={comments}
                  endorsements={endorsements}
                  evidence={studentEvidence}
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );

  // Helper set comment text state safely
  function setCommentCommentText(val: string) {
    setCommentText(val);
  }
}
