/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Edit3, User, Mail, Phone, Calendar, BookOpen, Link2, 
  Award, Camera, Plus, Trash2, PlusCircle, X, Check, Eye,
  CloudLightning
} from 'lucide-react';
import { User as UserType, StudentCertificate, StudentActivity } from '../types';
import Modal from './Modal';
import { 
  getGoogleAccessToken, 
  signInWithGoogle, 
  uploadFileToBirdFolder 
} from '../lib/googleDrive';

interface StudentInformationProps {
  student: UserType;
  advisor: UserType | null;
  coadvisor: UserType | null;
  onSaveProfile: (updatedProfile: Partial<UserType>) => void;
  currentUser: UserType | null;
  certificates: StudentCertificate[];
  activities: StudentActivity[];
  onSaveCertificate: (cert: Partial<StudentCertificate> & { StudentUserID: string }) => void;
  onDeleteCertificate: (certId: string) => void;
  onSaveActivity: (act: Partial<StudentActivity> & { StudentUserID: string }) => void;
  onDeleteActivity: (actId: string) => void;
}

export default function StudentInformation({
  student,
  advisor,
  coadvisor,
  onSaveProfile,
  currentUser,
  certificates = [],
  activities = [],
  onSaveCertificate,
  onDeleteCertificate,
  onSaveActivity,
  onDeleteActivity
}: StudentInformationProps) {
  // Navigation tabs state
  const [activeTab, setActiveTab] = React.useState<'demographics' | 'certificates' | 'activities'>('demographics');

  // Demographic edit form state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [phone, setPhone] = React.useState(student.Phone || '');
  const [lineID, setLineID] = React.useState(student.LineID || '');
  const [orcid, setOrcid] = React.useState(student.ORCID || '');
  const [interests, setInterests] = React.useState(student.ResearchInterests || '');
  const [expectedGrad, setExpectedGrad] = React.useState(student.ExpectedGraduationYear || 2029);
  const [photoURL, setPhotoURL] = React.useState(student.PhotoURL || '');

  // Google Drive and image upload status
  const [googleToken, setGoogleToken] = React.useState<string | null>(getGoogleAccessToken());
  const [uploadProgress, setUploadProgress] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // Certificates state
  const [isCertModalOpen, setIsCertModalOpen] = React.useState(false);
  const [certTitle, setCertTitle] = React.useState('');
  const [certIssuer, setCertIssuer] = React.useState('');
  const [certDate, setCertDate] = React.useState('');
  const [certImage, setCertImage] = React.useState('');
  const [selectedLightboxImage, setSelectedLightboxImage] = React.useState<string | null>(null);

  // Activities state
  const [isActModalOpen, setIsActModalOpen] = React.useState(false);
  const [actMonthYear, setActMonthYear] = React.useState('');
  const [actTitle, setActTitle] = React.useState('');
  const [actBullet, setActBullet] = React.useState('');
  const [actBullets, setActBullets] = React.useState<string[]>([]);
  const [actImages, setActImages] = React.useState<string[]>([]);

  // Check if viewing user is the student themselves (gives edit permissions)
  const canEdit = currentUser?.UserID === student.UserID && currentUser?.Role === 'Student';

  React.useEffect(() => {
    setPhone(student.Phone || '');
    setLineID(student.LineID || '');
    setOrcid(student.ORCID || '');
    setInterests(student.ResearchInterests || '');
    setExpectedGrad(student.ExpectedGraduationYear || 2029);
    setPhotoURL(student.PhotoURL || '');
  }, [student]);

  const handleSaveDemographics = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      Phone: String(phone).trim(),
      LineID: lineID.trim(),
      ORCID: orcid.trim(),
      ResearchInterests: interests.trim(),
      ExpectedGraduationYear: Number(expectedGrad),
      PhotoURL: photoURL.trim() || undefined
    });
    setIsEditOpen(false);
  };

  // Google Drive Upload Handlers
  const handleUploadToGoogleDrive = async (file: File): Promise<string | null> => {
    let token = googleToken || getGoogleAccessToken();
    if (!token) {
      try {
        setUploadProgress('Connecting to Google Drive...');
        const loginRes = await signInWithGoogle();
        if (loginRes) {
          token = loginRes.accessToken;
          setGoogleToken(token);
        } else {
          setUploadProgress(null);
          alert('Google Drive connection was not completed.');
          return null;
        }
      } catch (err) {
        console.error(err);
        setUploadProgress(null);
        alert('Failed to connect to Google Drive. Please make sure Google Drive is enabled.');
        return null;
      }
    }

    try {
      setIsUploading(true);
      setUploadProgress('Uploading image to your Google Drive "Bird" folder...');
      const result = await uploadFileToBirdFolder(token!, file, `Bird_${Date.now()}_${file.name}`);
      setUploadProgress('Successfully uploaded!');
      setTimeout(() => setUploadProgress(null), 3000);
      return result.url;
    } catch (err: any) {
      console.error(err);
      setUploadProgress(`Upload failed: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUploadsToGoogleDrive = async (files: FileList) => {
    let token = googleToken || getGoogleAccessToken();
    if (!token) {
      try {
        setUploadProgress('Connecting to Google Drive...');
        const loginRes = await signInWithGoogle();
        if (loginRes) {
          token = loginRes.accessToken;
          setGoogleToken(token);
        } else {
          setUploadProgress(null);
          alert('Google Drive connection was not completed.');
          return;
        }
      } catch (err) {
        console.error(err);
        setUploadProgress(null);
        alert('Failed to connect to Google Drive.');
        return;
      }
    }

    setIsUploading(true);
    const urls: string[] = [];
    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(`Uploading photo ${i + 1} of ${fileArray.length} to Google Drive...`);
      try {
        const result = await uploadFileToBirdFolder(token!, file, `Bird_Activity_${Date.now()}_${file.name}`);
        urls.push(result.url);
      } catch (err) {
        console.error(`Failed to upload ${file.name}`, err);
      }
    }

    setActImages([...actImages, ...urls]);
    setUploadProgress('All photos uploaded successfully!');
    setTimeout(() => setUploadProgress(null), 3000);
    setIsUploading(false);
  };

  // Base64 file converter
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Base64 file converter for multiple files
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64Array: string[]) => void) => {
    const files = e.target.files;
    if (files) {
      const promises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file as Blob);
        });
      });
      Promise.all(promises).then(base64s => {
        callback(base64s);
      });
    }
  };

  const handleSaveCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    onSaveCertificate({
      StudentUserID: student.UserID,
      Title: certTitle.trim(),
      Issuer: certIssuer.trim(),
      DateString: certDate.trim(),
      ImageURL: certImage.trim() || 'https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?auto=format&fit=crop&q=80&w=800'
    });

    // Reset Form
    setCertTitle('');
    setCertIssuer('');
    setCertDate('');
    setCertImage('');
    setIsCertModalOpen(false);
  };

  const handleAddActBullet = () => {
    if (actBullet.trim()) {
      setActBullets([...actBullets, actBullet.trim()]);
      setActBullet('');
    }
  };

  const handleRemoveActBullet = (index: number) => {
    setActBullets(actBullets.filter((_, i) => i !== index));
  };

  const handleSaveActSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actMonthYear.trim() || !actTitle.trim() || actBullets.length === 0) {
      alert('Please fill out Month/Year, Title, and add at least 1 progress bullet point.');
      return;
    }

    onSaveActivity({
      StudentUserID: student.UserID,
      MonthYear: actMonthYear.trim(),
      Title: actTitle.trim(),
      BulletPoints: actBullets,
      Images: actImages.length > 0 ? actImages : ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600']
    });

    // Reset Form
    setActMonthYear('');
    setActTitle('');
    setActBullets([]);
    setActImages([]);
    setIsActModalOpen(false);
  };

  // Filter lists specifically for the active student profile being inspected
  const studentCertificates = certificates.filter(c => c.StudentUserID === student.UserID);
  const studentActivities = activities.filter(a => a.StudentUserID === student.UserID);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sub-Navigation Tabs within Student Information Page */}
      <div className="flex border-b border-gray-200 gap-1 p-1 bg-gray-50 rounded-xl">
        <button
          onClick={() => setActiveTab('demographics')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'demographics'
              ? 'bg-white text-[#B91C1C] shadow-sm border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Demographics & Reflections
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'certificates'
              ? 'bg-white text-[#B91C1C] shadow-sm border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Certificates 💐
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'activities'
              ? 'bg-white text-[#B91C1C] shadow-sm border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Activity Progress & Pictures 📸
        </button>
      </div>

      {/* VIEW 1: DEMOGRAPHICS & ADVISORS */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Demographic main card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 p-5 md:p-6 shadow-sm relative">
              {canEdit && (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1.5 bg-[#FFF8E7] hover:bg-[#F9C94A]/25 text-[#1A1A1A] border border-[#F9C94A]/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                <div className="relative">
                  {student.PhotoURL ? (
                    <img
                      src={student.PhotoURL}
                      alt={student.FullName}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-[#B91C1C] shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-[#B91C1C] font-bold">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FFF8E7] text-[#B91C1C] border border-[#B91C1C]/10 rounded-md">
                    PhD Student Profile
                  </span>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">{student.FullName}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 font-medium">
                    <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <span className="text-gray-400 font-bold">Student ID:</span>
                      <span className="font-mono text-gray-900 font-semibold">{student.StudentID || '-'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <span className="text-gray-400 font-bold">Admission:</span>
                      <span className="font-mono text-gray-900">{student.AdmissionYear}</span>
                    </p>
                    <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <span className="text-gray-400 font-bold">Expected Grad:</span>
                      <span className="font-mono text-gray-900">{student.ExpectedGraduationYear || '-'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <span className="text-gray-400 font-bold">Line ID:</span>
                      <span className="text-gray-900">{student.LineID || '-'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-5 border-gray-200/60" />

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registered Doctoral Program</h4>
                  <p className="text-sm font-semibold text-[#1A1A1A] mt-1">{student.Program || 'Doctor of Philosophy Program in Nursing Science'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Faculty of Nursing, Thammasat University</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-[#FFF8E7]/40 border border-gray-200/60 rounded-xl">
                    <h5 className="text-[11px] font-bold text-[#B91C1C] uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      Contact Telephone
                    </h5>
                    <p className="text-sm font-bold text-gray-900 mt-1 font-mono">{student.Phone || 'Not entered'}</p>
                  </div>
                  <div className="p-3 bg-[#FFF8E7]/40 border border-gray-200/60 rounded-xl">
                    <h5 className="text-[11px] font-bold text-[#B91C1C] uppercase tracking-wider flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      Official Email
                    </h5>
                    <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{student.Email}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Primary Research Interests & Areas
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed italic bg-[#FFF8E7] p-3.5 rounded-xl border border-[#F9C94A]/20">
                    “{student.ResearchInterests || 'No research focus registered yet. Click edit profile to save.'}”
                  </p>
                </div>

                {student.ORCID && (
                  <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-[#B91C1C]">
                    <Link2 className="w-4 h-4" />
                    <span>ORCID Profile:</span>
                    <a href={`https://orcid.org/${student.ORCID}`} target="_blank" rel="noopener noreferrer" className="underline font-mono">
                      {student.ORCID}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Advisors card */}
            <div className="space-y-6">
              <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm border-l-4 border-[#F9C94A]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Major Advisor</h3>
                {advisor ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {advisor.PhotoURL ? (
                        <img
                          src={advisor.PhotoURL}
                          alt={advisor.FullName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-[#F9C94A]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-red-50 text-[#B91C1C] rounded-xl flex items-center justify-center font-bold text-sm">
                          AD
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">{advisor.FullName}</h4>
                        <p className="text-xs text-gray-500">{advisor.Position || 'Major Advisor'}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-600 font-medium pt-1.5 border-t border-gray-100">
                      <p className="truncate flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {advisor.Email}</p>
                      <p className="truncate flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {advisor.Phone || '-'}</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed italic mt-1.5">
                        <strong>Focus:</strong> {advisor.ResearchInterests || '-'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No major advisor assigned.</p>
                )}
              </div>

              <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm border-l-4 border-[#F9C94A]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Co-Advisor</h3>
                {coadvisor ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {coadvisor.PhotoURL ? (
                        <img
                          src={coadvisor.PhotoURL}
                          alt={coadvisor.FullName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-[#F9C94A]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-amber-50 text-amber-950 rounded-xl flex items-center justify-center font-bold text-sm">
                          CO
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">{coadvisor.FullName}</h4>
                        <p className="text-xs text-gray-500">{coadvisor.Position || 'Co-advisor'}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-600 font-medium pt-1.5 border-t border-gray-100">
                      <p className="truncate flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {coadvisor.Email}</p>
                      <p className="truncate flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {coadvisor.Phone || '-'}</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed italic mt-1.5">
                        <strong>Institution:</strong> {coadvisor.Affiliation || '-'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No co-advisor assigned.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#FFF8E7] p-4 rounded-xl border border-[#F9C94A]/25">
            <div>
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B91C1C]" />
                Student Certificates & Honors 💐
              </h3>
              <p className="text-xs text-gray-500 mt-1">Credentials of conference presentations, trainings, and excellence awards.</p>
            </div>
            {canEdit && (
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Certificate
              </button>
            )}
          </div>

          {studentCertificates.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No certificates registered yet.</p>
              {canEdit && <p className="text-xs mt-1">Click the add button above to store your first doctoral credential certificate.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentCertificates.map((cert) => (
                <div key={cert.CertificateID} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs flex flex-col group relative">
                  
                  {/* Image banner display */}
                  <div className="h-48 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                    <img 
                      src={cert.ImageURL} 
                      alt={cert.Title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Zoom icon action */}
                    <button
                      onClick={() => setSelectedLightboxImage(cert.ImageURL)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-bold cursor-zoom-in"
                    >
                      <Eye className="w-4 h-4" />
                      Zoom Certificate
                    </button>
                  </div>

                  {/* Body text information */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-[#1A1A1A] text-sm leading-snug">{cert.Title}</h4>
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{cert.Issuer}</p>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">Event Date: {cert.DateString || '-'}</p>
                    </div>

                    {canEdit && (
                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this certificate?')) {
                              onDeleteCertificate(cert.CertificateID);
                            }
                          }}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 text-[11px] font-bold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: MONTHLY ACTIVITY PROGRESS LOGS */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#FFF8E7] p-4 rounded-xl border border-[#F9C94A]/25">
            <div>
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#B91C1C]" />
                Monthly Activity Log & Pictures 📸
              </h3>
              <p className="text-xs text-gray-500 mt-1">Structured chronological logs of consultations, reviews, and progress milestones with advising faculty.</p>
            </div>
            {canEdit && (
              <button
                onClick={() => setIsActModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Monthly Log
              </button>
            )}
          </div>

          {studentActivities.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-gray-400">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No monthly activities logged yet.</p>
              {canEdit && <p className="text-xs mt-1">Click the add button above to write your first monthly thesis advisement log.</p>}
            </div>
          ) : (
            <div className="space-y-10">
              {studentActivities.map((act) => (
                <div key={act.ActivityID} className="bg-white border border-gray-200/60 rounded-2xl p-5 md:p-6 shadow-xs relative hover:border-amber-200 transition-all">
                  
                  {/* Delete button positioned top-right */}
                  {canEdit && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this monthly activity log?')) {
                          onDeleteActivity(act.ActivityID);
                        }
                      }}
                      className="absolute top-6 right-6 text-red-600 hover:text-red-800 text-[11px] font-bold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md cursor-pointer border border-red-100"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Log
                    </button>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Progress details */}
                    <div className="lg:col-span-7 space-y-3">
                      <div>
                        <span className="text-xs font-black uppercase text-[#B91C1C] bg-[#FFF8E7] px-2.5 py-1 rounded-md border border-[#B91C1C]/10 inline-block font-mono">
                          {act.MonthYear}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 mt-2 leading-snug">{act.Title}</h4>
                      </div>

                      <div className="pt-2">
                        <ul className="space-y-2">
                          {act.BulletPoints.map((bp, i) => (
                            <li key={i} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C] shrink-0 mt-1.5" />
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Visual photo grid collage */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                      <div className={`grid ${act.Images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                        {act.Images.map((imgUrl, idx) => (
                          <div key={idx} className="relative group overflow-hidden rounded-xl bg-slate-100 border border-gray-100 h-36">
                            <img 
                              src={imgUrl} 
                              alt={`${act.Title} screenshot ${idx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {/* Hover overlay to expand */}
                            <button
                              onClick={() => setSelectedLightboxImage(imgUrl)}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold cursor-zoom-in"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View Photo
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIGHTBOX / ZOOM OVERLAY */}
      {selectedLightboxImage && (
        <div 
          className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <button 
            onClick={() => setSelectedLightboxImage(null)} 
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full cursor-pointer transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <img 
            src={selectedLightboxImage} 
            alt="Credential zoom lightbox" 
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl border border-white/10"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing lightbox
          />
        </div>
      )}

      {/* MODAL 1: ADD CERTIFICATE */}
      <Modal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} title="Add Doctoral Certificate 💐">
        <form onSubmit={handleSaveCertSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Certificate Title / Honor Heading</label>
            <input
              type="text"
              placeholder="e.g. Certificate of Participation (6th International Nursing Conference)"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Issuing Faculty / Organization</label>
            <input
              type="text"
              placeholder="e.g. Faculty of Nursing, Prince of Songkla University"
              value={certIssuer}
              onChange={(e) => setCertIssuer(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Date of Conference / Issue Date</label>
            <input
              type="text"
              placeholder="e.g. May 27-29, 2026"
              value={certDate}
              onChange={(e) => setCertDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
            />
          </div>

          {/* Certificate Image File Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Certificate Document Image File (Uploads directly to your Google Drive 'Bird' folder)</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const uploadedUrl = await handleUploadToGoogleDrive(file);
                    if (uploadedUrl) {
                      setCertImage(uploadedUrl);
                    }
                  }
                }}
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#B91C1C] hover:file:bg-amber-100 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 font-bold">OR</span>
              <input
                type="text"
                placeholder="Paste Certificate Image Web URL"
                value={certImage.startsWith('data:') ? '' : certImage}
                onChange={(e) => setCertImage(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
              />
            </div>

            {uploadProgress && (
              <div className="text-xs font-bold text-[#B91C1C] bg-amber-50 border border-[#B91C1C]/15 p-2 rounded-lg flex items-center gap-1.5 mt-1.5">
                <CloudLightning className="w-3.5 h-3.5 animate-pulse" />
                <span>{uploadProgress}</span>
              </div>
            )}
            
            {certImage && (
              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-lg relative inline-block">
                <img 
                  src={certImage} 
                  alt="Uploader preview" 
                  className="h-20 rounded-md object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setCertImage('')}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white p-0.5 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsCertModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Save Certificate
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD MONTHLY ACTIVITY LOG */}
      <Modal isOpen={isActModalOpen} onClose={() => setIsActModalOpen(false)} title="Add Monthly Activity Log & Pictures 📸">
        <form onSubmit={handleSaveActSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block">Advising Month & Year</label>
              <input
                type="text"
                placeholder="e.g. October 2025"
                value={actMonthYear}
                onChange={(e) => setActMonthYear(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block">Activity Title / Subject Heading</label>
              <input
                type="text"
                placeholder="e.g. Consultation on Research Methodology"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          {/* Activity Progress Bullet Point List Builders */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Progress Bullet Points (At least 1 required)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a thesis progress/consultation milestone..."
                value={actBullet}
                onChange={(e) => setActBullet(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddActBullet(); } }}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden font-medium"
              />
              <button
                type="button"
                onClick={handleAddActBullet}
                className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Bullet
              </button>
            </div>

            {actBullets.length > 0 && (
              <ul className="mt-2 p-3 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                {actBullets.map((bp, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-100 shadow-3xs">
                    <span className="leading-relaxed flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                      {bp}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActBullet(i)}
                      className="text-red-500 hover:text-red-700 font-bold p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity Pictures Grid Uploads */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Upload Collage Pictures (Directly to your Google Drive 'Bird' folder)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  await handleMultipleUploadsToGoogleDrive(files);
                }
              }}
              className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#B91C1C] hover:file:bg-amber-100 cursor-pointer w-full"
            />
            <p className="text-[10px] text-gray-400 mt-1">Select one or more photos representing Zoom classes, presentations, or documents.</p>

            {uploadProgress && (
              <div className="text-xs font-bold text-[#B91C1C] bg-amber-50 border border-[#B91C1C]/15 p-2 rounded-lg flex items-center gap-1.5 mt-1.5">
                <CloudLightning className="w-3.5 h-3.5 animate-pulse" />
                <span>{uploadProgress}</span>
              </div>
            )}

            {actImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                {actImages.map((imgBase64, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 h-16">
                    <img src={imgBase64} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => setActImages(actImages.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsActModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Save Activity Log
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile Edit Modal (Existing Demographic Form) */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Demographic Information">
        <form onSubmit={handleSaveDemographics} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Contact Phone Number (Leading Zero Preserved)</label>
            <input
              type="text"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0812345678"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block">Line ID</label>
              <input
                type="text"
                value={lineID}
                onChange={(e) => setLineID(e.target.value)}
                placeholder="e.g. name.m"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block">Expected Graduation Year</label>
              <input
                type="number"
                min="2026"
                max="2040"
                value={expectedGrad}
                onChange={(e) => setExpectedGrad(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">ORCID ID iD</label>
            <input
              type="text"
              value={orcid}
              onChange={(e) => setOrcid(e.target.value)}
              placeholder="e.g. 0000-0001-9876-5432"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Research Interests (Comma-separated keywords)</label>
            <textarea
              rows={3}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Gerontological Care, Tele-nursing, self-care interventions"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 block">Profile Photo (Directly to your Google Drive 'Bird' folder)</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const uploadedUrl = await handleUploadToGoogleDrive(file);
                    if (uploadedUrl) {
                      setPhotoURL(uploadedUrl);
                    }
                  }
                }}
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#B91C1C] hover:file:bg-amber-100 cursor-pointer"
              />
            </div>
            {photoURL && (
              <div className="flex items-center gap-2 mt-1.5 p-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                <img src={photoURL} className="w-10 h-10 rounded-md object-cover border" referrerPolicy="no-referrer" />
                <span className="text-[10px] text-gray-400 truncate max-w-xs">{photoURL}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
