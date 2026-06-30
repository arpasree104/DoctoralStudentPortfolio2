/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  Shield,
  Users,
  Bell,
  MessageSquare,
  FileText,
  LogOut,
  Sliders,
  ChevronDown,
  LayoutDashboard,
  User,
  Layers,
  BookOpen,
  ArrowRight,
  Database,
  UserPlus,
  ArrowLeft,
  CloudLightning
} from 'lucide-react';

import { LocalDatabaseStore } from './data';
import { exportStudentToExcel } from './lib/excelExporter';
import { isFirebaseEnabled } from './lib/firebase';
import {
  initGoogleAuth,
  signInWithGoogle,
  logoutGoogle,
  getGoogleAccessToken,
  getGoogleUser
} from './lib/googleDrive';
import {
  User as UserType,
  UserRole,
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
  ActivityLog,
  StudentCertificate,
  StudentActivity
} from './types';

// Page components
import StudentDashboard from './components/StudentDashboard';
import StudentInformation from './components/StudentInformation';
import PortfolioRecordsEntry from './components/PortfolioRecordsEntry';
import PrintReport from './components/PrintReport';
import AdvisorWorkspace from './components/AdvisorWorkspace';
import AdminPanel from './components/AdminPanel';
import NotificationsPane from './components/NotificationsPane';
import StudentChat from './components/StudentChat';

// Global database store instance
const dbStore = new LocalDatabaseStore();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [activePage, setActivePage] = React.useState<string>('dashboard');

  // Google Drive Connection State
  const [googleDriveUser, setGoogleDriveUser] = React.useState<any>(null);
  const [googleDriveToken, setGoogleDriveToken] = React.useState<string | null>(null);

  // Directory variables mapped into local React state
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [records, setRecords] = React.useState<PortfolioRecord[]>([]);
  const [profiles, setProfiles] = React.useState<StudentProfile[]>([]);
  const [dissertations, setDissertations] = React.useState<Dissertation[]>([]);
  const [researchHours, setResearchHours] = React.useState<ResearchHour[]>([]);
  const [competencies, setCompetencies] = React.useState<CompetencyAssessment[]>([]);
  const [comments, setComments] = React.useState<AdvisorComment[]>([]);
  const [endorsements, setEndorsements] = React.useState<Endorsement[]>([]);
  const [evidence, setEvidence] = React.useState<Evidence[]>([]);
  const [chats, setChats] = React.useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [logs, setLogs] = React.useState<ActivityLog[]>([]);
  const [certificates, setCertificates] = React.useState<StudentCertificate[]>([]);
  const [activities, setActivities] = React.useState<StudentActivity[]>([]);

  // Selected portfolio section (for student or active workspace)
  const [selectedSection, setSelectedSection] = React.useState<number>(1);

  // Login Form states
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');

  // Registration States
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [regRole, setRegRole] = React.useState<UserRole>('Student');
  const [regPrefix, setRegPrefix] = React.useState('Mr.');
  const [regFirstName, setRegFirstName] = React.useState('');
  const [regLastName, setRegLastName] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');
  const [regConfirmPassword, setRegConfirmPassword] = React.useState('');
  
  // Student specific
  const [regStudentID, setRegStudentID] = React.useState('');
  const [regProgram, setRegProgram] = React.useState('Doctor of Philosophy Program in Nursing Science');
  const [regAdmissionYear, setRegAdmissionYear] = React.useState(new Date().getFullYear());
  
  // Advisor specific
  const [regPosition, setRegPosition] = React.useState('Asst. Prof. Dr.');
  const [regAffiliation, setRegAffiliation] = React.useState('Faculty of Nursing, Thammasat University');
  
  const [regError, setRegError] = React.useState('');

  // Hidden backdoor / settings to show sandbox shortcuts
  const [logoClickCount, setLogoClickCount] = React.useState(0);
  const [showSandboxShortcut, setShowSandboxShortcut] = React.useState(() => {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  });

  const handleLogoClick = () => {
    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowSandboxShortcut(true);
      }
      return next;
    });
  };

  // Helper function to sync React state with LocalDatabaseStore
  const refreshFromStore = () => {
    setUsers(dbStore.getUsers());
    setRecords(dbStore.getPortfolioRecords());
    setProfiles(dbStore.getStudentProfiles());
    setDissertations(dbStore.getDissertations());
    setResearchHours(dbStore.getResearchHours());
    setCompetencies(dbStore.getCompetencies());
    setComments(dbStore.getComments());
    setEndorsements(dbStore.getEndorsements());
    setEvidence(dbStore.getEvidence());
    setChats(dbStore.getChats());
    setNotifications(dbStore.getNotifications());
    setLogs(dbStore.getLogs());
    setCertificates(dbStore.getCertificates());
    setActivities(dbStore.getActivities());
  };

  // Initialize initial state on mount and subscribe to Firebase
  React.useEffect(() => {
    refreshFromStore();

    const unsubscribe = dbStore.subscribeToFirebase(() => {
      refreshFromStore();
    });

    const unsubGoogle = initGoogleAuth(
      (user, token) => {
        setGoogleDriveUser(user);
        setGoogleDriveToken(token);
      },
      () => {
        setGoogleDriveUser(null);
        setGoogleDriveToken(null);
      }
    );

    return () => {
      unsubscribe();
      unsubGoogle();
    };
  }, []);

  const handleQuickLogin = (emailStr: string) => {
    const user = dbStore.getUsers().find(u => u.Email === emailStr);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      dbStore.addLog('LOGIN', user.UserID, `Successfully logged in via quick login switcher: ${user.FullName}`);
      
      // Route appropriately
      if (user.Role === 'Student') {
        setActivePage('dashboard');
      } else if (user.Role === 'Advisor' || user.Role === 'CoAdvisor' || user.Role === 'SuperAdvisor') {
        setActivePage('workspace');
      } else if (user.Role === 'Admin') {
        setActivePage('admin');
      }
      setLoginError('');
    }
  };

  const handleNormalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = dbStore.getUsers().find(u => u.Email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (user) {
      if (user.Password && user.Password !== loginPassword) {
        setLoginError('Incorrect password. Please try again.');
        return;
      }
      setCurrentUser(user);
      setIsLoggedIn(true);
      dbStore.addLog('LOGIN', user.UserID, `Logged in: ${user.FullName}`);
      if (user.Role === 'Student') {
        setActivePage('dashboard');
      } else if (user.Role === 'Advisor' || user.Role === 'CoAdvisor' || user.Role === 'SuperAdvisor') {
        setActivePage('workspace');
      } else if (user.Role === 'Admin') {
        setActivePage('admin');
      }
      setLoginError('');
    } else {
      setLoginError('Invalid Email Address or Access Code. Try using Quick Login shortcuts below.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    const emailClean = regEmail.trim().toLowerCase();
    const userExists = dbStore.getUsers().some(u => u.Email.toLowerCase() === emailClean);
    if (userExists) {
      setRegError('An account with this email already exists.');
      return;
    }

    const newUserId = `USER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const fullName = `${regPrefix} ${regFirstName.trim()} ${regLastName.trim()}`;

    const newUserPayload: any = {
      UserID: newUserId,
      Email: emailClean,
      Password: regPassword,
      Role: regRole,
      Prefix: regPrefix,
      FirstName: regFirstName.trim(),
      LastName: regLastName.trim(),
      FullName: fullName,
      Status: 'Active',
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    if (regRole === 'Student') {
      newUserPayload.StudentID = regStudentID.trim();
      newUserPayload.Program = regProgram;
      newUserPayload.Faculty = 'Faculty of Nursing';
      newUserPayload.University = 'Thammasat University';
      newUserPayload.AdmissionYear = Number(regAdmissionYear);
      newUserPayload.ExpectedGraduationYear = Number(regAdmissionYear) + 4;
    } else {
      newUserPayload.Position = regPosition;
      newUserPayload.Affiliation = regAffiliation;
    }

    // Save user
    dbStore.saveUser(newUserPayload);
    dbStore.addLog('REGISTER', newUserId, `New user registered: ${fullName} (${regRole})`);
    
    // Clear registration fields
    setRegFirstName('');
    setRegLastName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegStudentID('');
    
    // Auto login
    setCurrentUser(newUserPayload);
    setIsLoggedIn(true);
    setIsRegistering(false);

    if (regRole === 'Student') {
      setActivePage('dashboard');
    } else {
      setActivePage('workspace');
    }
  };

  const handleSignOut = () => {
    if (currentUser) {
      dbStore.addLog('LOGOUT', currentUser.UserID, `${currentUser.FullName} signed out.`);
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  const handleSaveCertificate = (payload: any) => {
    dbStore.saveCertificate(payload);
    refreshFromStore();
    if (currentUser) {
      dbStore.addLog('SAVE_CERTIFICATE', currentUser.UserID, `Saved certificate: ${payload.Title}`);
    }
  };

  const handleDeleteCertificate = (id: string) => {
    dbStore.deleteCertificate(id);
    refreshFromStore();
    if (currentUser) {
      dbStore.addLog('DELETE_CERTIFICATE', currentUser.UserID, `Deleted certificate ID: ${id}`);
    }
  };

  const handleSaveActivity = (payload: any) => {
    dbStore.saveActivity(payload);
    refreshFromStore();
    if (currentUser) {
      dbStore.addLog('SAVE_ACTIVITY', currentUser.UserID, `Saved monthly activity: ${payload.Title}`);
    }
  };

  const handleDeleteActivity = (id: string) => {
    dbStore.deleteActivity(id);
    refreshFromStore();
    if (currentUser) {
      dbStore.addLog('DELETE_ACTIVITY', currentUser.UserID, `Deleted activity ID: ${id}`);
    }
  };

  // Mutator triggers
  const handleSaveRecord = (sectionNo: number, actionPayload: any) => {
    if (!currentUser) return;
    const { type, payload } = actionPayload;

    if (type === 'portfolio') {
      dbStore.savePortfolioRecord(payload);
    } else if (type === 'profile') {
      dbStore.saveStudentProfile(currentUser.UserID, sectionNo, payload);
    } else if (type === 'dissertation') {
      dbStore.saveDissertation(currentUser.UserID, payload);
    } else if (type === 'hour') {
      dbStore.saveResearchHour(payload);
    } else if (type === 'competency') {
      dbStore.saveCompetency(payload);
    }

    dbStore.addLog('SAVE_RECORD', currentUser.UserID, `Saved Section ${sectionNo} entry under ${type}`);
    refreshFromStore();
  };

  const handleDeleteRecord = (sectionNo: number, payload: any) => {
    if (!currentUser) return;
    if (payload.type === 'hour') {
      dbStore.deleteResearchHour(payload.id);
    } else {
      dbStore.deletePortfolioRecord(payload.id);
    }
    dbStore.addLog('DELETE_RECORD', currentUser.UserID, `Deleted record ID: ${payload.id} in Section ${sectionNo}`);
    refreshFromStore();
  };

  const handleSendChat = (receiverId: string, text: string) => {
    if (!currentUser) return;
    // Determine student ID
    const studentId = currentUser.Role === 'Student' ? currentUser.UserID : receiverId;
    dbStore.sendChatMessage(currentUser.UserID, studentId, receiverId, text);
    refreshFromStore();
  };

  const handleSendNotify = (receiverId: string, title: string, text: string) => {
    if (!currentUser) return;
    dbStore.sendNotification(currentUser.UserID, receiverId, title, text);
    refreshFromStore();
  };

  const handleSaveComment = (studentId: string, text: string, rec: string) => {
    if (!currentUser) return;
    dbStore.saveComment(currentUser.UserID, studentId, text, rec);
    refreshFromStore();
  };

  const handleSignEndorsement = (studentId: string, role: string, sigName: string) => {
    if (!currentUser) return;
    dbStore.signEndorsement(currentUser.UserID, studentId, role, sigName);
    refreshFromStore();
  };

  const handleSaveUser = (payload: any) => {
    if (!currentUser) return;
    dbStore.saveUser(payload);
    dbStore.addLog('SAVE_USER', currentUser.UserID, `Created/Modified user: ${payload.FullName}`);
    refreshFromStore();
  };

  const handleDeleteUser = (userId: string) => {
    if (!currentUser) return;
    dbStore.deleteUser(userId);
    dbStore.addLog('DELETE_USER', currentUser.UserID, `Deleted user ID: ${userId}`);
    refreshFromStore();
  };

  const handleAssignAdvisor = (studentId: string, advisorId: string, role: 'Major' | 'Co') => {
    if (!currentUser) return;
    dbStore.assignAdvisor(studentId, advisorId, role);
    dbStore.addLog('ASSIGN_ADVISOR', currentUser.UserID, `Mapped Student ID ${studentId} with advisor ${advisorId} as ${role}`);
    refreshFromStore();
  };

  const handleTriggerSync = () => {
    if (!currentUser) return;
    dbStore.addLog('SYNC', currentUser.UserID, 'Manually forced database sync from Google Sheets.');
    refreshFromStore();
    alert('Synchronized fully with database registers!');
  };

  // Helper arrays for current user context
  const currentStudentAdvisor = currentUser && currentUser.Role === 'Student'
    ? dbStore.getUsers().find(u => u.Role === 'Advisor') || null
    : null;

  const currentStudentCoadvisor = currentUser && currentUser.Role === 'Student'
    ? dbStore.getUsers().find(u => u.Role === 'CoAdvisor') || null
    : null;

  const currentStudentRecords = currentUser ? records.filter(r => r.StudentUserID === currentUser.UserID) : [];
  const currentStudentProfile = currentUser ? profiles.find(p => p.StudentUserID === currentUser.UserID) || null : null;
  const currentStudentDissertation = currentUser ? dissertations.find(d => d.StudentUserID === currentUser.UserID) || null : null;
  const currentStudentHours = currentUser ? researchHours.filter(h => h.StudentUserID === currentUser.UserID) : [];
  const currentStudentCompetencies = currentUser ? competencies.filter(c => c.StudentUserID === currentUser.UserID) : [];
  const currentStudentEvidence = currentUser ? evidence.filter(e => e.StudentUserID === currentUser.UserID) : [];
  const currentStudentNotifications = currentUser ? notifications.filter(n => n.ReceiverUserID === currentUser.UserID) : [];
  const currentStudentChats = currentUser ? chats.filter(c => c.StudentUserID === currentUser.UserID) : [];

  const unreadNotifCount = currentStudentNotifications.filter(n => !n.IsRead).length;
  const unreadChatCount = currentStudentChats.filter(c => c.ReceiverUserID === currentUser?.UserID && !c.IsRead).length;

  // Render Login state if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center p-4 font-sans text-xs md:text-sm text-[#1A1A1A] selection:bg-[#F9C94A]">
        
        {isRegistering ? (
          /* REGISTRATION / SIGN UP FORM UI */
          <div className="w-full max-w-lg bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden p-6 md:p-8 space-y-6 relative">
            
            {/* Tu Nursing Logo styling */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#B91C1C] rounded-2xl mx-auto flex items-center justify-center text-white border-2 border-[#F9C94A] shadow-xs">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#B91C1C] tracking-wider uppercase block">Faculty of Nursing</span>
                <h1 className="text-lg font-extrabold text-[#1A1A1A] leading-tight">Create PhD Portfolio Account</h1>
                <p className="text-[10px] text-gray-500">Register as a doctoral student or advisor to access the portfolio system</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 block">Registration Role</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRegRole('Student')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      regRole === 'Student'
                        ? 'bg-white shadow-xs text-[#B91C1C] border border-slate-200'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('Advisor')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      regRole === 'Advisor'
                        ? 'bg-white shadow-xs text-[#B91C1C] border border-slate-200'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🔬 Advisor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('SuperAdvisor')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      regRole === 'SuperAdvisor'
                        ? 'bg-white shadow-xs text-purple-700 border border-slate-200'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🛡️ SuperAdvisor
                  </button>
                </div>
              </div>

              {/* Prefix & Name Row */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">Prefix</label>
                  <select
                    value={regPrefix}
                    onChange={e => setRegPrefix(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                  >
                    {regRole === 'Student' ? (
                      <>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                      </>
                    ) : (
                      <>
                        <option value="Dr.">Dr.</option>
                        <option value="Lecturer Dr.">Lecturer Dr.</option>
                        <option value="Asst. Prof. Dr.">Asst. Prof. Dr.</option>
                        <option value="Assoc. Prof. Dr.">Assoc. Prof. Dr.</option>
                        <option value="Prof. Dr.">Prof. Dr.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">First Name</label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={e => setRegFirstName(e.target.value)}
                    placeholder="First Name (EN)"
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                    required
                  />
                </div>
                <div className="col-span-5 space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">Last Name</label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={e => setRegLastName(e.target.value)}
                    placeholder="Last Name (EN)"
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Section: STUDENT FIELDS */}
              {regRole === 'Student' && (
                <div className="p-3.5 bg-red-50/40 rounded-xl border border-[#B91C1C]/10 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-red-900 block">Student ID Number</label>
                      <input
                        type="text"
                        value={regStudentID}
                        onChange={e => setRegStudentID(e.target.value)}
                        placeholder="e.g. 6609912040"
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-semibold"
                        required={regRole === 'Student'}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-red-900 block">Admission Year (AD)</label>
                      <input
                        type="number"
                        value={regAdmissionYear}
                        onChange={e => setRegAdmissionYear(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-semibold"
                        required={regRole === 'Student'}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-red-900 block">Doctoral Program Course</label>
                    <select
                      value={regProgram}
                      onChange={e => setRegProgram(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden text-xs font-medium"
                    >
                      <option value="Doctor of Philosophy Program in Nursing Science">Doctor of Philosophy Program in Nursing Science (TU)</option>
                      <option value="Joint Doctoral Program in Nursing (International Course)">Joint Doctoral Program in Nursing (International Course)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Dynamic Section: ADVISOR FIELDS */}
              {(regRole === 'Advisor' || regRole === 'SuperAdvisor') && (
                <div className="p-3.5 bg-[#FFF8E7]/60 rounded-xl border border-[#F9C94A]/40 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-amber-900 block">Academic Position & Title</label>
                    <input
                      type="text"
                      value={regPosition}
                      onChange={e => setRegPosition(e.target.value)}
                      placeholder="e.g. Assistant Professor Dr."
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                      required={regRole === 'Advisor' || regRole === 'SuperAdvisor'}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-amber-900 block">Affiliated Institution / Department</label>
                    <input
                      type="text"
                      value={regAffiliation}
                      onChange={e => setRegAffiliation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                      required={regRole === 'Advisor' || regRole === 'SuperAdvisor'}
                    />
                  </div>
                </div>
              )}

              {/* Contact Credentials */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 block">Thammasat Official Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="e.g. yourname@tu.ac.th"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                  required
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">Verify Password</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {regError && (
                <p className="text-[11px] text-[#B91C1C] font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">{regError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl font-bold tracking-wide transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Register & Initialize Portfolio <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setRegError('');
                }}
                className="text-xs font-bold text-[#B91C1C] hover:underline flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Already have a student or advisor account? Sign In
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD LOGIN FORM */
          <div className="w-full max-w-md bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden p-6 md:p-8 space-y-6 relative">
            
            {/* Tu Nursing Logo styling */}
            <div className="text-center space-y-2.5">
              <div 
                onClick={handleLogoClick}
                title="Click 5 times to reveal test shortcuts"
                className="w-16 h-16 bg-[#B91C1C] rounded-2xl mx-auto flex items-center justify-center text-white border-2 border-[#F9C94A] shadow-xs cursor-pointer select-none active:scale-95 transition-all"
              >
                <GraduationCap className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#B91C1C] tracking-wider uppercase block">Faculty of Nursing</span>
                <h1 className="text-lg md:text-xl font-extrabold text-[#1A1A1A] leading-tight">Thammasat University</h1>
                <p className="text-[10px] text-[#B91C1C] font-bold uppercase tracking-widest">Doctoral Portfolio Management System</p>
              </div>
            </div>

            <form onSubmit={handleNormalLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 block">Tu Official Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="e.g. student@tu.ac.th"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 block">Personal Access Code / Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
                />
              </div>

              {loginError && (
                <p className="text-[11px] text-[#B91C1C] font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl font-bold tracking-wide transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Log In to Portfolio <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Link to trigger registration */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setLoginError('');
                }}
                className="text-xs font-bold text-[#B91C1C] hover:underline flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Don't have an account? Sign Up / Register
              </button>
            </div>

            {/* Quick Sandbox Login buttons for Grading Ease */}
            {showSandboxShortcut && (
              <div className="space-y-2.5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#B91C1C]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Sandbox Testing Login Shortcuts (1-Click)</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student@example.com')}
                    className="p-2 bg-red-50 hover:bg-red-100 text-[#B91C1C] border border-[#B91C1C]/10 rounded-xl text-center text-[9px] font-extrabold cursor-pointer transition-all hover:scale-102"
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('advisor@example.com')}
                    className="p-2 bg-[#FFF8E7] hover:bg-[#F9C94A]/25 text-[#1A1A1A] border border-[#F9C94A]/40 rounded-xl text-center text-[9px] font-extrabold cursor-pointer transition-all hover:scale-102"
                  >
                    🔬 Advisor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('superadvisor@example.com')}
                    className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-center text-[9px] font-extrabold cursor-pointer transition-all hover:scale-102"
                  >
                    🛡️ Super
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@example.com')}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-950 border border-slate-200 rounded-xl text-center text-[9px] font-extrabold cursor-pointer transition-all hover:scale-102"
                  >
                    ⚙️ Admin
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer brand credits */}
        <p className="text-[10px] text-gray-400 mt-6 font-medium text-center">Doctoral Student Portfolio Management System • Faculty of Nursing • Thammasat University</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col font-sans text-xs md:text-sm text-[#1A1A1A] selection:bg-[#F9C94A]">
      {/* Upper Navigation Header */}
      <header className="bg-white text-[#1A1A1A] shadow-xs sticky top-0 z-40 px-4 md:px-6 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#B91C1C] rounded-xl flex items-center justify-center text-white border border-[#F9C94A] shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[8px] font-extrabold text-[#B91C1C] tracking-wider block uppercase">Thammasat University</span>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-[#1A1A1A] tracking-tight">Nursing PhD Portfolio</h1>
                
                {/* Compact Database Connection Indicator */}
                <div className="relative group flex items-center justify-center">
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-help ${
                      isFirebaseEnabled 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Database className="w-3 h-3" />
                    {isFirebaseEnabled && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    )}
                  </div>
                  
                  {/* Absolute CSS Tooltip with hover trigger */}
                  <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 bg-slate-900 text-white text-[10px] p-2.5 rounded-lg shadow-lg z-50 font-normal leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5 mb-1 text-white">
                      <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseEnabled ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      {isFirebaseEnabled ? 'Google Cloud Firebase (Online)' : 'Local Offline Storage'}
                    </p>
                    <p className="text-gray-300">
                      {isFirebaseEnabled 
                        ? 'Real-time bidirectional synchronization is active. All doctoral data is securely persisted in the cloud database.'
                        : 'Using browser local-first database. To link a permanent cloud database, configure VITE_FIREBASE_API_KEY in your cloud environment settings.'}
                    </p>
                    {/* Tooltip arrow pointer */}
                    <div className="absolute top-0 left-2.5 -translate-y-1 border-4 border-transparent border-b-slate-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links based on Role */}
          <nav className="hidden md:flex items-center gap-1">
            {currentUser?.Role === 'Student' && (
              <>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activePage === 'dashboard' ? 'bg-[#F9C94A] text-[#1A1A1A]' : 'text-gray-600 hover:bg-[#B91C1C]/10 hover:text-[#B91C1C]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActivePage('information')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activePage === 'information' ? 'bg-[#F9C94A] text-[#1A1A1A]' : 'text-gray-600 hover:bg-[#B91C1C]/10 hover:text-[#B91C1C]'
                  }`}
                >
                  My Information
                </button>
                <button
                  onClick={() => {
                    setSelectedSection(1);
                    setActivePage('portfolio');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activePage === 'portfolio' ? 'bg-[#F9C94A] text-[#1A1A1A]' : 'text-gray-600 hover:bg-[#B91C1C]/10 hover:text-[#B91C1C]'
                  }`}
                >
                  Edit Portfolio
                </button>
                <button
                  onClick={() => setActivePage('report')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activePage === 'report' ? 'bg-[#F9C94A] text-[#1A1A1A]' : 'text-gray-600 hover:bg-[#B91C1C]/10 hover:text-[#B91C1C]'
                  }`}
                >
                  Print Report
                </button>
              </>
            )}

            {currentUser?.Role === 'Admin' && (
              <button
                onClick={() => setActivePage('admin')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F9C94A] text-[#1A1A1A]"
              >
                Administrative Controls
              </button>
            )}

            {(currentUser?.Role === 'Advisor' || currentUser?.Role === 'CoAdvisor' || currentUser?.Role === 'Co-advisor' || currentUser?.Role === 'SuperAdvisor') && (
              <button
                onClick={() => setActivePage('workspace')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F9C94A] text-[#1A1A1A]"
              >
                Advisor workspace
              </button>
            )}
          </nav>

          {/* Right Header Panel: Profile dropdown / Quick Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Direct Icons */}
            {currentUser?.Role === 'Student' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePage('notify')}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#B91C1C] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActivePage('chat')}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 relative cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadChatCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#B91C1C] rounded-full" />
                  )}
                </button>
              </div>
            )}

            {/* Quick Toggle Sandbox Widget */}
            {showSandboxShortcut && (
              <div className="hidden lg:flex items-center gap-1 bg-[#FFF8E7] px-2.5 py-1 rounded-lg border border-[#B91C1C]/15 text-[10px] font-bold text-[#1A1A1A]">
                <span className="text-[#B91C1C]">Evaluate:</span>
                <button onClick={() => handleQuickLogin('student@example.com')} className="hover:underline text-[#B91C1C] ml-1">Student</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => handleQuickLogin('advisor@example.com')} className="hover:underline text-[#B91C1C]">Advisor</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => handleQuickLogin('superadvisor@example.com')} className="hover:underline text-purple-700">Super</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => handleQuickLogin('admin@example.com')} className="hover:underline text-[#B91C1C]">Admin</button>
              </div>
            )}

            {/* Google Drive Connection Button */}
            {isLoggedIn && (
              <div className="flex items-center gap-1">
                {googleDriveToken ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-semibold">
                    <CloudLightning className="w-3.5 h-3.5 animate-pulse" />
                    <span className="hidden md:inline">Drive Connected</span>
                    <button 
                      onClick={async () => {
                        await logoutGoogle();
                        setGoogleDriveUser(null);
                        setGoogleDriveToken(null);
                      }}
                      className="ml-1 text-[10px] underline hover:text-emerald-950 cursor-pointer font-bold"
                      title="Disconnect Google Drive"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const res = await signInWithGoogle();
                        if (res) {
                          setGoogleDriveUser(res.user);
                          setGoogleDriveToken(res.accessToken);
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-[#B91C1C] border border-[#B91C1C]/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    title="Connect Google Drive to save Firebase space"
                  >
                    <CloudLightning className="w-3.5 h-3.5" />
                    <span>Connect Drive</span>
                  </button>
                )}
              </div>
            )}

            {/* User Profile display card */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold truncate max-w-32 text-[#1A1A1A]">{currentUser?.FullName}</p>
                <span className="text-[9px] text-[#B91C1C] uppercase font-bold">{currentUser?.Role}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg transition-colors cursor-pointer border border-[#F9C94A]/25"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main content viewport space */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-20">
        
        {/* Firebase Sync Status Banner removed per user request for space optimization (moved to top header icon status) */}

        {/* Dynamic page route component mount */}
        {activePage === 'dashboard' && currentUser?.Role === 'Student' && (
          <StudentDashboard
            user={currentUser}
            records={currentStudentRecords}
            researchHours={currentStudentHours}
            evidence={currentStudentEvidence}
            notifications={currentStudentNotifications}
            unreadChatCount={unreadChatCount}
            navigate={setActivePage}
            setSelectedSection={setSelectedSection}
          />
        )}

        {activePage === 'information' && currentUser?.Role === 'Student' && (
          <StudentInformation
            student={currentUser}
            advisor={currentStudentAdvisor}
            coadvisor={currentStudentCoadvisor}
            onSaveProfile={(payload) => handleSaveRecord(1, { type: 'profile', payload })}
            currentUser={currentUser}
            certificates={certificates}
            activities={activities}
            onSaveCertificate={handleSaveCertificate}
            onDeleteCertificate={handleDeleteCertificate}
            onSaveActivity={handleSaveActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {activePage === 'portfolio' && currentUser?.Role === 'Student' && (
          <PortfolioRecordsEntry
            studentId={currentUser.UserID}
            records={currentStudentRecords}
            profile={currentStudentProfile}
            dissertation={currentStudentDissertation}
            researchHours={currentStudentHours}
            competencies={currentStudentCompetencies}
            evidence={currentStudentEvidence}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {activePage === 'report' && currentUser?.Role === 'Student' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#FFFDF9] border border-amber-200/30 p-4 rounded-xl">
              <div>
                <h3 className="font-bold text-red-950">Export Official Portfolio Template</h3>
                <p className="text-xs text-gray-500">Print or save standard A4 documents with complete tables (Section 1-16) for PhD faculty review committees.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportStudentToExcel({
                    student: currentUser,
                    advisor: currentStudentAdvisor,
                    coadvisor: currentStudentCoadvisor,
                    records: currentStudentRecords,
                    profile: currentStudentProfile,
                    dissertation: currentStudentDissertation,
                    researchHours: currentStudentHours,
                    competencies: currentStudentCompetencies,
                    certificates: certificates.filter(c => c.StudentUserID === currentUser.UserID),
                    activities: activities.filter(a => a.StudentUserID === currentUser.UserID)
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
              student={currentUser}
              advisor={currentStudentAdvisor}
              coadvisor={currentStudentCoadvisor}
              records={currentStudentRecords}
              profile={currentStudentProfile}
              dissertation={currentStudentDissertation}
              researchHours={currentStudentHours}
              competencies={currentStudentCompetencies}
              comments={comments}
              endorsements={endorsements}
              evidence={currentStudentEvidence}
            />
          </div>
        )}

        {activePage === 'notify' && currentUser?.Role === 'Student' && (
          <NotificationsPane
            notifications={currentStudentNotifications}
            onMarkRead={(id) => {
              dbStore.markNotificationRead(id);
              refreshFromStore();
            }}
            onClearAll={() => {
              currentStudentNotifications.forEach(n => dbStore.markNotificationRead(n.NotificationID));
              refreshFromStore();
            }}
          />
        )}

        {activePage === 'chat' && currentUser?.Role === 'Student' && (
          <StudentChat
            currentUser={currentUser}
            advisors={users.filter(u => u.Role === 'Advisor' || u.Role === 'Co-advisor')}
            chats={chats}
            onSendChat={handleSendChat}
          />
        )}

        {/* Advisor active tab workspace views */}
        {activePage === 'workspace' && (currentUser?.Role === 'Advisor' || currentUser?.Role === 'CoAdvisor' || currentUser?.Role === 'Co-advisor' || currentUser?.Role === 'SuperAdvisor') && (
          <AdvisorWorkspace
            advisorUser={currentUser}
            students={users.filter(u => {
              if (u.Role !== 'Student') return false;
              if (currentUser.Role === 'SuperAdvisor') return true;
              const isMajor = u.MajorAdvisorID === currentUser.UserID;
              const isCo = u.CoAdvisorIDs ? u.CoAdvisorIDs.split(',').map(id => id.trim()).includes(currentUser.UserID) : false;
              return isMajor || isCo;
            })}
            records={records}
            profiles={profiles}
            dissertations={dissertations}
            researchHours={researchHours}
            competencies={competencies}
            comments={comments}
            endorsements={endorsements}
            evidence={evidence}
            chats={chats}
            notifications={notifications}
            certificates={certificates}
            activities={activities}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
            onSendChat={handleSendChat}
            onSendNotify={handleSendNotify}
            onSaveComment={handleSaveComment}
            onSignEndorsement={handleSignEndorsement}
            onSaveCertificate={handleSaveCertificate}
            onDeleteCertificate={handleDeleteCertificate}
            onSaveActivity={handleSaveActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {/* Admin portal views */}
        {activePage === 'admin' && currentUser?.Role === 'Admin' && (
          <AdminPanel
            users={users}
            logs={logs}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
            onAssignAdvisor={handleAssignAdvisor}
            onTriggerSync={handleTriggerSync}
          />
        )}

      </main>

      {/* Floating Role Navigation Bar on mobile screens */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2.5 px-4 flex justify-around shadow-lg">
        {currentUser?.Role === 'Student' && (
          <>
            <button onClick={() => setActivePage('dashboard')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activePage === 'dashboard' ? 'text-red-800' : 'text-gray-400'}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button onClick={() => setActivePage('information')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activePage === 'information' ? 'text-red-800' : 'text-gray-400'}`}>
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button onClick={() => { setSelectedSection(1); setActivePage('portfolio'); }} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activePage === 'portfolio' ? 'text-red-800' : 'text-gray-400'}`}>
              <Layers className="w-4 h-4" />
              <span>Sections</span>
            </button>
            <button onClick={() => setActivePage('report')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activePage === 'report' ? 'text-red-800' : 'text-gray-400'}`}>
              <FileText className="w-4 h-4" />
              <span>Report</span>
            </button>
          </>
        )}

        {(currentUser?.Role === 'Advisor' || currentUser?.Role === 'CoAdvisor' || currentUser?.Role === 'Co-advisor' || currentUser?.Role === 'SuperAdvisor') && (
          <button onClick={() => setActivePage('workspace')} className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-red-800">
            <Users className="w-4 h-4" />
            <span>Advisees Workspace</span>
          </button>
        )}

        {currentUser?.Role === 'Admin' && (
          <button onClick={() => setActivePage('admin')} className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-red-800">
            <Shield className="w-4 h-4" />
            <span>Admin Control Panel</span>
          </button>
        )}
      </footer>
    </div>
  );
}
