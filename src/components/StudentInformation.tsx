/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Edit3, User, Mail, Phone, Calendar, Search, BookOpen, Link2 } from 'lucide-react';
import { User as UserType } from '../types';
import Modal from './Modal';

interface StudentInformationProps {
  student: UserType;
  advisor: UserType | null;
  coadvisor: UserType | null;
  onSaveProfile: (updatedProfile: Partial<UserType>) => void;
}

export default function StudentInformation({
  student,
  advisor,
  coadvisor,
  onSaveProfile
}: StudentInformationProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Edit form state
  const [phone, setPhone] = React.useState(student.Phone || '');
  const [lineID, setLineID] = React.useState(student.LineID || '');
  const [orcid, setOrcid] = React.useState(student.ORCID || '');
  const [interests, setInterests] = React.useState(student.ResearchInterests || '');
  const [expectedGrad, setExpectedGrad] = React.useState(student.ExpectedGraduationYear || 2029);

  React.useEffect(() => {
    setPhone(student.Phone || '');
    setLineID(student.LineID || '');
    setOrcid(student.ORCID || '');
    setInterests(student.ResearchInterests || '');
    setExpectedGrad(student.ExpectedGraduationYear || 2029);
  }, [student]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Maintain phone and StudentID as text-friendly strings (guarantees leading zero preservation)
    onSaveProfile({
      Phone: String(phone).trim(),
      LineID: lineID.trim(),
      ORCID: orcid.trim(),
      ResearchInterests: interests.trim(),
      ExpectedGraduationYear: Number(expectedGrad)
    });
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Upper Grid: Student Demographic Card & Advisors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Main Demographic Profile */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 p-5 md:p-6 shadow-sm relative">
          <button
            onClick={() => setIsEditOpen(true)}
            className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1.5 bg-[#FFF8E7] hover:bg-[#F9C94A]/25 text-[#1A1A1A] border border-[#F9C94A]/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>

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

          {/* Academic program details */}
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

        {/* Advisors Sidebar Info */}
        <div className="space-y-6">
          {/* Major Advisor Card */}
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

          {/* Co-advisor Card */}
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

      {/* Profile Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Demographic Information">
        <form onSubmit={handleSave} className="space-y-4">
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
