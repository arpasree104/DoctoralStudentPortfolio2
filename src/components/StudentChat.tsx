/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare, Send, User, AlertCircle, Sparkles } from 'lucide-react';
import { User as UserType, ChatMessage } from '../types';

interface StudentChatProps {
  currentUser: UserType;
  advisors: UserType[];
  chats: ChatMessage[];
  onSendChat: (receiverId: string, text: string) => void;
}

export default function StudentChat({
  currentUser,
  advisors,
  chats,
  onSendChat
}: StudentChatProps) {
  const [selectedAdvisorId, setSelectedAdvisorId] = React.useState(advisors[0]?.UserID || '');
  const [chatInput, setChatInput] = React.useState('');

  const activeAdvisor = advisors.find(a => a.UserID === selectedAdvisorId);

  // Filter messages exchanged specifically between this student and the selected advisor
  const threadMessages = chats
    .filter(
      c =>
        c.StudentUserID === currentUser.UserID &&
        ((c.SenderUserID === currentUser.UserID && c.ReceiverUserID === selectedAdvisorId) ||
          (c.SenderUserID === selectedAdvisorId && c.ReceiverUserID === currentUser.UserID))
    )
    .sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime());

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && selectedAdvisorId) {
      onSendChat(selectedAdvisorId, chatInput.trim());
      setChatInput('');
    }
  };

  return (
    <div className="bg-white border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm max-w-3xl mx-auto font-sans text-xs md:text-sm space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3.5 border-b border-gray-200/60">
        <div>
          <h2 className="font-bold text-[#1A1A1A] text-base">Direct Graduate Advising Chat</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">Instant secure messaging line with your thesis advisor and panel committee.</p>
        </div>

        {/* Advisor selection dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">Advisor Line:</span>
          <select
            value={selectedAdvisorId}
            onChange={e => setSelectedAdvisorId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:outline-hidden text-gray-800"
          >
            {advisors.length === 0 ? (
              <option value="">No Advisors Assigned</option>
            ) : (
              advisors.map(a => (
                <option key={a.UserID} value={a.UserID}>
                  {a.FullName} ({a.Role})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {activeAdvisor ? (
        <div className="space-y-4">
          {/* Thread chat list */}
          <div className="h-96 overflow-y-auto p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-4">
            {threadMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-gray-400 italic">
                <MessageSquare className="w-8 h-8 text-gray-300 mb-1 opacity-60" />
                No messages logged in this advising thread yet.
                <p className="text-[10px] text-gray-400 not-italic mt-1">Start a supportive conversation below.</p>
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isMe = msg.SenderUserID === currentUser.UserID;
                return (
                  <div key={msg.MessageID} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 shadow-xs text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#B91C1C] text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                      }`}
                    >
                      <p className="font-bold text-[9px] opacity-75 mb-1">{isMe ? 'You (Advisee)' : activeAdvisor.FullName}</p>
                      <p className="font-medium whitespace-pre-wrap">{msg.MessageText}</p>
                      <span className="block text-[8px] text-right mt-1 opacity-60 font-mono">
                        {new Date(msg.CreatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Typing Form box */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder={`Type supportive message or question to ${activeAdvisor.FullName}...`}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-[#B91C1C] focus:outline-hidden text-gray-800 font-medium"
              required
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 italic font-medium">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          Assign an advisor first via the Admin dashboard settings to enable messaging channels.
        </div>
      )}
    </div>
  );
}
