/**
 * Client-side tracker utility for Portfo.be analytics events.
 */
export async function trackProjectClick(subdomain: string, projectId: string, projectTitle?: string) {
  try {
    if (!subdomain || !projectId) return;

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

    const payload = {
      subdomain,
      type: 'PROJECT_CLICK',
      pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
      url: typeof window !== 'undefined' ? window.location.href : '',
      sessionId,
      targetId: projectId,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      metadata: projectTitle ? { title: projectTitle } : undefined
    };

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    console.error('Failed to track project click:', error);
  }
}

export async function trackCustomEvent(subdomain: string, eventType: string, targetId?: string, metadata?: any) {
  try {
    if (!subdomain || !eventType) return;

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

    const payload = {
      subdomain,
      type: eventType,
      pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
      url: typeof window !== 'undefined' ? window.location.href : '',
      sessionId,
      targetId,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      metadata: metadata || undefined
    };

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    console.error('Failed to track custom event:', error);
  }
}
