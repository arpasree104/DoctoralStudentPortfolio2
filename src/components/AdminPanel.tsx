/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Shield,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Link,
  Activity,
  Plus,
  RefreshCw,
  Search,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { User, ActivityLog, UserRole } from '../types';
import Modal from './Modal';

interface AdminPanelProps {
  users: User[];
  logs: ActivityLog[];
  onSaveUser: (payload: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onAssignAdvisor: (studentId: string, advisorId: string, role: 'Major' | 'Co') => void;
  onTriggerSync: () => void;
}

export default function AdminPanel({
  users,
  logs,
  onSaveUser,
  onDeleteUser,
  onAssignAdvisor,
  onTriggerSync
}: AdminPanelProps) {
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [userModalTitle, setUserModalTitle] = React.useState('');
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);

  // User form states
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('Student');
  const [studentID, setStudentID] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [program, setProgram] = React.useState('Doctor of Philosophy Program in Nursing Science');

  // Advisor assignment state
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState('');
  const [selectedAdvisor, setSelectedAdvisor] = React.useState('');
  const [assignRole, setAssignRole] = React.useState<'Major' | 'Co'>('Major');

  // Search filter
  const [searchTerm, setSearchTerm] = React.useState('');

  const openUserForm = (item: User | null = null) => {
    setTargetUserId(item ? item.UserID : null);
    setUserModalTitle(item ? 'Edit User Account' : 'Register New User Account');

    if (item) {
      setEmail(item.Email);
      setFullName(item.FullName);
      setRole(item.Role);
      setStudentID(item.StudentID || '');
      setPhone(item.Phone || '');
      setProgram(item.Program || 'Doctor of Philosophy Program in Nursing Science');
    } else {
      setEmail('');
      setFullName('');
      setRole('Student');
      setStudentID('');
      setPhone('');
      setProgram('Doctor of Philosophy Program in Nursing Science');
    }
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      UserID: targetUserId || `USR-${Math.floor(Math.random() * 900000) + 100000}`,
      Email: email.trim().toLowerCase(),
      FullName: fullName.trim(),
      Role: role,
      StudentID: role === 'Student' ? studentID.trim() : undefined,
      Phone: phone.trim(),
      Program: role === 'Student' ? program : undefined,
      PhotoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
    });
    setIsUserModalOpen(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent && selectedAdvisor) {
      onAssignAdvisor(selectedStudent, selectedAdvisor, assignRole);
      setIsAssignModalOpen(false);
      alert('Advisor assignments updated on sheets!');
    }
  };

  const filteredUsers = users.filter(
    u => u.FullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentsList = users.filter(u => u.Role === 'Student');
  const advisorsList = users.filter(u => u.Role === 'Advisor' || u.Role === 'CoAdvisor');

  return (
    <div className="space-y-6 font-sans text-xs md:text-sm">
      {/* Upper system controllers */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-black/5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <Shield className="w-5 h-5 text-[#B91C1C]" /> Administrative Command Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure active university users, manage student-advisor linkages, and inspect security logs.</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-3 py-2 bg-[#F9C94A] hover:bg-[#F8BF33] text-[#1A1A1A] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Link className="w-3.5 h-3.5" /> Map Advisee Advisor
          </button>
          <button
            onClick={() => openUserForm(null)}
            className="px-3 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add User Account
          </button>
          <button
            onClick={onTriggerSync}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Database
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table list - Left */}
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
            <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-1">
              <Users className="w-4 h-4 text-[#B91C1C]" /> Program Directory
            </h3>
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden"
              />
            </div>
          </div>

          <table className="w-full text-left font-sans text-xs border border-gray-200">
            <thead className="bg-slate-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-2.5">User</th>
                <th className="p-2.5">Academic Role</th>
                <th className="p-2.5">Student ID / Contact</th>
                <th className="p-2.5 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400 italic">No users found match search scope.</td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.UserID} className="border-b border-gray-100 hover:bg-slate-50/50">
                    <td className="p-2.5 flex items-center gap-2.5">
                      {u.PhotoURL ? (
                        <img src={u.PhotoURL} alt={u.FullName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border" />
                      ) : (
                        <div className="w-8 h-8 bg-red-100 text-[#B91C1C] font-bold rounded-full flex items-center justify-center">ST</div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{u.FullName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{u.Email}</p>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          u.Role === 'Admin'
                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                            : u.Role === 'Student'
                            ? 'bg-red-50 text-[#B91C1C] border border-[#B91C1C]/10'
                            : u.Role === 'SuperAdvisor'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 font-extrabold'
                            : 'bg-[#FFF8E7] text-[#1A1A1A] border border-[#F9C94A]/30'
                        }`}
                      >
                        {u.Role}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono">
                      {u.Role === 'Student' ? (
                        <span className="font-bold text-[#B91C1C]">{u.StudentID || '-'}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                      <p className="text-[9px] text-gray-500 mt-0.5">{u.Phone || '-'}</p>
                    </td>
                    <td className="p-2.5 flex gap-1 justify-center">
                      <button onClick={() => openUserForm(u)} className="p-1 hover:text-[#B91C1C]" title="Edit details"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDeleteUser(u.UserID)} className="p-1 hover:text-[#B91C1C]" title="Delete account"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Database Security Log panel - Right */}
        <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-1 pb-3 border-b border-gray-200/60">
            <Activity className="w-4 h-4 text-[#B91C1C]" /> Database Activity Log Audits
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-8">No security transactions logged.</p>
            ) : (
              logs.map(lg => (
                <div key={lg.LogID} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] space-y-1">
                  <div className="flex justify-between font-bold text-[#1A1A1A]">
                    <span>{lg.Action}</span>
                    <span className="font-mono text-gray-400">{new Date(lg.CreatedAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-600 font-medium">By User ID: <strong className="font-mono">{lg.UserID}</strong></p>
                  <p className="text-[9px] text-gray-400 truncate">Details: {lg.Detail}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* User Account Modal */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={userModalTitle}>
        <form onSubmit={handleUserSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="font-bold text-gray-600 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Dr. Anchalee Jedsadaphan"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">Email Address (Primary Login)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">System Access Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-semibold"
              >
                <option value="Student">Student (PhD Advisee)</option>
                <option value="Advisor">Advisor (Major Faculty Chair)</option>
                <option value="CoAdvisor">Co-advisor / External Committee</option>
                <option value="SuperAdvisor">SuperAdvisor (Overarching Reviewer)</option>
                <option value="Admin">Admin (Graduate Studies Office)</option>
              </select>
            </div>
          </div>

          {role === 'Student' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Student ID (Plaintext with Leading Zeroes)</label>
                <input
                  type="text"
                  pattern="[0-9]*"
                  value={studentID}
                  onChange={e => setStudentID(e.target.value)}
                  placeholder="e.g. 02345678"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Admitted Academic Program</label>
                <input
                  type="text"
                  value={program}
                  onChange={e => setProgram(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-gray-600 block">Phone Number (Plaintext string)</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 0812345678"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg font-bold shadow-sm"
            >
              Register User
            </button>
          </div>
        </form>
      </Modal>

      {/* Advisor assignment Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Student to Advisor Team">
        <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="font-bold text-gray-600 block">Select Student</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-semibold"
              required
            >
              <option value="">-- Choose Student Advisee --</option>
              {studentsList.map(s => (
                <option key={s.UserID} value={s.UserID}>{s.FullName} ({s.StudentID})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">Select Advisor / Committee</label>
              <select
                value={selectedAdvisor}
                onChange={e => setSelectedAdvisor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-semibold"
                required
              >
                <option value="">-- Choose Faculty Advisor --</option>
                {advisorsList.map(a => (
                  <option key={a.UserID} value={a.UserID}>{a.FullName} ({a.Role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">Advisorship Role Type</label>
              <select
                value={assignRole}
                onChange={e => setAssignRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-hidden font-semibold"
              >
                <option value="Major">Major Thesis Advisor</option>
                <option value="Co">Thesis Co-Advisor / Member</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg font-bold shadow-sm"
            >
              Map Linkages
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
