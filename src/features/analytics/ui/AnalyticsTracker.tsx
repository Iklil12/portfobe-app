"use client";

import { useEffect, useRef } from 'react';

export function AnalyticsTracker({ subdomain }: { subdomain: string }) {
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // ── IDLE TRACKER: Catat kapan terakhir user beraktivitas ──
    const updateActivity = () => { (window as any)._pfLastActivity = Date.now(); };
    (window as any)._pfLastActivity = Date.now();

    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('scroll', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('click', updateActivity, { passive: true });
    window.addEventListener('touchstart', updateActivity, { passive: true });

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if ((heartbeatRef as any)._cleanup) (heartbeatRef as any)._cleanup();

      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, []);

  useEffect(() => {
    if (!subdomain || hasTrackedView.current) return;
    hasTrackedView.current = true;

    const trackAnalytics = async () => {
      let sessionId = '';
      if (typeof window !== 'undefined') {
        sessionId = sessionStorage.getItem('_pfSessionId') || '';
        if (!sessionId) {
          sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2) + Date.now().toString(36);
          sessionStorage.setItem('_pfSessionId', sessionId);
        }
      }

      try {
        const trackRes = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subdomain: subdomain,
            type: 'VIEW',
            pagePath: window.location.pathname,
            url: window.location.href,
            sessionId: sessionId,
            referrer: document.referrer
          })
        });

        if (trackRes.ok) {
          const trackData = await trackRes.json();
          const analyticsId = trackData.id;
          if (analyticsId) {
            sessionStorage.setItem('_pfAnalyticsId', analyticsId);

            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            heartbeatRef.current = setInterval(() => {
              const lastActivity = (window as any)._pfLastActivity || Date.now();
              const isIdle = Date.now() - lastActivity > 5 * 60 * 1000; 
              
              if (document.visibilityState === 'visible' && document.hasFocus() && !isIdle) {
                fetch('/api/analytics/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'HEARTBEAT', analyticsId })
                }).catch(() => null);
              }
            }, 15000); 

            const flushDuration = () => {
              const id = sessionStorage.getItem('_pfAnalyticsId');
              if (!id) return;
              const blob = new Blob(
                [JSON.stringify({ type: 'HEARTBEAT', analyticsId: id })],
                { type: 'application/json' }
              );
              navigator.sendBeacon('/api/analytics/track', blob);
            };

            const handleVisibility = () => {
              if (document.visibilityState === 'hidden') flushDuration();
            };

            document.addEventListener('visibilitychange', handleVisibility);
            window.addEventListener('pagehide', flushDuration);

            (heartbeatRef as any)._cleanup = () => {
              document.removeEventListener('visibilitychange', handleVisibility);
              window.removeEventListener('pagehide', flushDuration);
              sessionStorage.removeItem('_pfAnalyticsId');
            };
          }
        }
      } catch (err) {
        console.error("Failed to track analytics:", err);
      }
    };

    trackAnalytics();
  }, [subdomain]);

  return null; // Komponen ini hanya berjalan di background, tidak merender UI apa pun.
}
