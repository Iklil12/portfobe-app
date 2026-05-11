"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  type: 'PushEvent' | 'CreateEvent';
  repo: string;
  description: string;
  commitMessage?: string;
  createdAt: string;
  link: string;
}

interface GithubActivityFeedProps {
  userId: string;
  themeColor?: string;
}

// Fungsi helper untuk waktu relatif
function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function GithubActivityFeed({ userId, themeColor }: GithubActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/github/activity?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (e) {
        console.error('Failed to fetch activity');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchActivity();
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-slate-200 mt-1.5"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-3/4"></div>
              <div className="h-2 bg-slate-50 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="mt-10 py-6 border-t border-dashed border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">
          No recent public activity
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h5 
        className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-50"
        style={{ color: themeColor }}
      >
        Recent Activity
      </h5>
      
      <div className="space-y-6 relative before:absolute before:left-[3.5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-5 group relative"
          >
            {/* Dot / Icon Container */}
            <div className="relative z-10 mt-1.5">
              <div 
                className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150"
                style={{ 
                  backgroundColor: activity.type === 'PushEvent' ? (themeColor || '#10b981') : '#3b82f6',
                  boxShadow: `0 0 10px ${activity.type === 'PushEvent' ? (themeColor || '#10b981') : '#3b82f6'}44`
                }}
              ></div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col @sm:flex-row @sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="opacity-70">{activity.description}</span>{' '}
                    <a 
                      href={activity.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-900 dark:text-slate-200 font-bold hover:underline decoration-slate-400 underline-offset-2"
                    >
                      {activity.repo}
                    </a>
                  </p>
                  {activity.commitMessage && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic truncate max-w-full">
                      "{activity.commitMessage}"
                    </p>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mt-1">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
