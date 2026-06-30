/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Check, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsPaneProps {
  notifications: Notification[];
  onMarkRead: (notificationId: string) => void;
  onClearAll: () => void;
}

export default function NotificationsPane({
  notifications,
  onMarkRead,
  onClearAll
}: NotificationsPaneProps) {
  const unreadCount = notifications.filter(n => !n.IsRead).length;

  return (
    <div className="bg-white border border-black/5 rounded-2xl p-5 md:p-6 shadow-sm max-w-3xl mx-auto font-sans text-xs md:text-sm">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200/60 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FFF8E7] text-[#B91C1C] rounded-lg border border-[#F9C94A]/20">
            <Bell className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div>
            <h2 className="font-bold text-[#1A1A1A] text-base">Graduate Advising Broadcast Inbox</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Direct instructions and timeline guidelines dispatched by your advising team.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 bg-[#FFF8E7] hover:bg-[#F9C94A]/25 text-[#1A1A1A] border border-[#F9C94A]/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic font-medium">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            Your advisory notification inbox is clean.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.NotificationID}
              className={`p-4 rounded-xl border transition-all relative ${
                notif.IsRead
                  ? 'bg-slate-50/50 border-gray-100 opacity-75'
                  : 'bg-gradient-to-r from-[#FFF8E7] to-white border-l-4 border-[#F9C94A] border-y border-r border-black/5 shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    notif.IsRead
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-[#B91C1C] text-white'
                  }`}>
                    {notif.IsRead ? 'Read' : 'New Advisory Notice'}
                  </span>
                  <h4 className="font-bold text-[#1A1A1A] text-xs md:text-sm">{notif.Title}</h4>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium pt-1">{notif.Message}</p>
                  
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 pt-1.5">
                    <Calendar className="w-3 h-3" />
                    Sent on {new Date(notif.CreatedAt).toLocaleDateString()} at {new Date(notif.CreatedAt).toLocaleTimeString()}
                  </span>
                </div>

                {!notif.IsRead && (
                  <button
                    onClick={() => onMarkRead(notif.NotificationID)}
                    className="p-1.5 bg-white text-gray-400 hover:text-[#B91C1C] border border-gray-200 rounded-lg transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
