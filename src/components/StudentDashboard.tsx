/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Clock,
  BookOpen,
  FileText,
  Award,
  Bell,
  MessageSquare,
  Activity,
  Plus,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import {
  User,
  PortfolioRecord,
  ResearchHour,
  Evidence,
  Notification
} from '../types';

interface StudentDashboardProps {
  user: User;
  records: PortfolioRecord[];
  researchHours: ResearchHour[];
  evidence: Evidence[];
  notifications: Notification[];
  unreadChatCount: number;
  navigate: (page: string) => void;
  setSelectedSection: (num: number) => void;
}

export default function StudentDashboard({
  user,
  records,
  researchHours,
  evidence,
  notifications,
  unreadChatCount,
  navigate,
  setSelectedSection
}: StudentDashboardProps) {
  // Stats calculations
  const totalResearchHours = researchHours.reduce((sum, item) => sum + item.Hours, 0);
  const hourProgress = Math.min(100, Math.round((totalResearchHours / 180) * 100));

  // Count distinct sections with entries
  const filledSections = new Set(records.map(r => r.SectionNo)).size;
  const sectionProgress = Math.min(100, Math.round((filledSections / 16) * 100));

  // Publications count (Section 7.2)
  const publicationCount = records.filter(
    r => r.SectionNo === 7 && r.SubsectionNo === '7.2'
  ).length;

  const unreadNotifCount = notifications.filter(n => !n.IsRead).length;

  // Render a gorgeous timeline milestones list
  const academicMilestones = [
    { title: 'Coursework Completed', completed: records.some(r => r.SubsectionNo === '4.1'), desc: 'Check completed credits and grades' },
    { title: 'English Requirement Met', completed: records.some(r => r.SubsectionNo === '3.1' && r.Field5?.toLowerCase() === 'pass'), desc: 'Official test score verified' },
    { title: '180 Research Hours Logged', completed: totalResearchHours >= 180, desc: `${totalResearchHours}/180 hours registered` },
    { title: 'Thesis Proposal Defended', completed: records.some(r => r.SubsectionNo === '2.2' && r.Field1?.toLowerCase().includes('proposal') && r.Field3), desc: 'Approved proposal status' },
    { title: 'Committee Endorsements Signed', completed: records.some(r => r.SectionNo === 16), desc: 'Major advisor & committee signatures' }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#B91C1C] via-[#991B1B] to-[#7F1D1D] rounded-2xl p-6 md:p-8 text-white shadow-sm border border-black/5">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9C94A]/25 text-[#F9C94A] text-xs font-semibold tracking-wide uppercase mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Doctoral Scholar Status: Active
            </span>
            <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-[#F9C94A]">{user.FullName}</span>
            </h1>
            <p className="text-red-100 text-sm md:text-base mt-1.5 max-w-2xl font-normal leading-relaxed">
              Tracking your academic progress, dissertation research milestones, and advisor reviews at <strong className="text-[#F9C94A]">Thammasat University</strong>.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('information')}
              className="px-4 py-2.5 bg-[#F9C94A] hover:bg-[#F8BF33] text-[#1A1A1A] rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              View Info
            </button>
            <button
              onClick={() => {
                navigate('report');
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all border border-white/20 cursor-pointer"
            >
              Export Report
            </button>
          </div>
        </div>
        {/* Subtle background graphic */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9C94A]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Research hours */}
        <div className="bg-white rounded-xl border border-black/5 border-l-4 border-[#F9C94A] p-5 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Research Hours</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#B91C1C] font-mono">{totalResearchHours}</span>
                <span className="text-xs text-gray-400 font-medium">/ 180 hrs</span>
              </div>
            </div>
            <div className="p-2 bg-[#FFF8E7] rounded-lg text-[#B91C1C] border border-[#F9C94A]/10">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-gray-500 font-medium">Completion Progress</span>
              <span className="font-bold text-[#B91C1C]">{hourProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#B91C1C] h-full rounded-full transition-all duration-500"
                style={{ width: `${hourProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Section completion */}
        <div className="bg-white rounded-xl border border-black/5 border-l-4 border-[#F9C94A] p-5 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Completed Sections</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#B91C1C] font-mono">{filledSections}</span>
                <span className="text-xs text-gray-400 font-medium">/ 16 total</span>
              </div>
            </div>
            <div className="p-2 bg-[#FFF8E7] rounded-lg text-[#B91C1C] border border-[#F9C94A]/10">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-gray-500 font-medium">Portfolio Sections Filled</span>
              <span className="font-bold text-[#B91C1C]">{sectionProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F9C94A] h-full rounded-full transition-all duration-500"
                style={{ width: `${sectionProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Publications */}
        <div className="bg-white rounded-xl border border-black/5 border-l-4 border-[#F9C94A] p-5 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Publications</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#B91C1C] font-mono">{publicationCount}</span>
                <span className="text-xs text-gray-400 font-medium">in journals</span>
              </div>
            </div>
            <div className="p-2 bg-[#FFF8E7] rounded-lg text-[#B91C1C] border border-[#F9C94A]/10">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-4 leading-relaxed font-medium">
            Section 7.2 - Scholarly Outputs requirement verified by advisor.
          </p>
        </div>

        {/* Card 4: Unread Alerts */}
        <div className="bg-white rounded-xl border border-black/5 border-l-4 border-[#F9C94A] p-5 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending Messages</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#B91C1C] font-mono">
                  {unreadNotifCount + unreadChatCount}
                </span>
                <div className="flex gap-1.5 text-[10px] font-bold text-[#B91C1C]">
                  <span className="px-1.5 py-0.5 bg-red-50 border border-red-200 rounded">
                    {unreadNotifCount} Alerts
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#FFF8E7] border border-[#F9C94A]/30 rounded text-[#1A1A1A]">
                    {unreadChatCount} Chat
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#FFF8E7] rounded-lg text-[#B91C1C] border border-[#F9C94A]/10">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={() => navigate('notify')}
              className="text-xs font-bold text-[#B91C1C] hover:text-[#991B1B] transition-colors flex items-center gap-1 cursor-pointer"
            >
              Open Notifications <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Milestones timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Milestones Tracking */}
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm">
          <h3 className="font-sans font-bold text-lg text-[#1A1A1A] mb-1">Academic Milestone Tracking</h3>
          <p className="text-xs text-gray-500 mb-5">Your registered doctoral timeline objectives in this program.</p>

          <div className="space-y-4">
            {academicMilestones.map((ms, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-1 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      ms.completed
                        ? 'bg-[#B91C1C] text-white'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {ms.completed ? '✓' : idx + 1}
                  </div>
                  {idx < academicMilestones.length - 1 && (
                    <div className="w-0.5 h-10 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <h4 className={`text-sm font-semibold ${ms.completed ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                    {ms.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{ms.desc}</p>
                </div>
                <div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ms.completed
                        ? 'bg-green-50 text-green-700 border border-green-200/50'
                        : 'bg-slate-50 text-slate-400 border border-slate-200/50'
                    }`}
                  >
                    {ms.completed ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-5">
          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="font-sans font-bold text-base text-[#1A1A1A] mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedSection(1);
                  navigate('portfolio');
                }}
                className="w-full flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 text-[#B91C1C] border border-[#B91C1C]/10 rounded-xl text-xs font-bold transition-all text-left cursor-pointer"
              >
                <span>Edit Profile & Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedSection(6);
                  navigate('portfolio');
                }}
                className="w-full flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 text-[#B91C1C] border border-[#B91C1C]/10 rounded-xl text-xs font-bold transition-all text-left cursor-pointer"
              >
                <span>Log Research Experience Hours</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedSection(7);
                  navigate('portfolio');
                }}
                className="w-full flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 text-[#B91C1C] border border-[#B91C1C]/10 rounded-xl text-xs font-bold transition-all text-left cursor-pointer"
              >
                <span>Add Publications or Awards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('chat')}
                className="w-full flex items-center justify-between p-3 bg-[#FFF8E7] hover:bg-[#F9C94A]/20 text-[#1A1A1A] border border-[#F9C94A]/20 rounded-xl text-xs font-bold transition-all text-left cursor-pointer"
              >
                <span>Chat with Advisor Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#FFF8E7] border border-[#B91C1C]/10 rounded-2xl p-5 shadow-xs">
            <h4 className="font-bold text-[#B91C1C] text-sm flex items-center gap-1.5 mb-1.5">
              <Activity className="w-4 h-4" />
              180-Hour Research Rule
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every doctoral student at Thammasat University Faculty of Nursing must log at least 180 hours of supervised academic research and data synthesis to pass evaluation blocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
