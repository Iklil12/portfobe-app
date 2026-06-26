"use client";

import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import useSWR, { mutate } from 'swr';
import { usePathname } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profile } = useSWR('/api/profile', fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    if (!profile || profile.error) return;

    const timer = setTimeout(() => {
      const isDashboardRoot = pathname === '/dashboard';
      const isAppearanceRoot = pathname === '/dashboard/appearance';

      if (isDashboardRoot && profile.hasCompletedDashboardTour === false) {
        const startDashboardTour = () => {
          const isMobile = window.innerWidth < 768;

          const d = driver({
            popoverClass: 'portfobe-tour-theme',
            showProgress: true,
            animate: true,
            allowClose: true,
            overlayClickBehavior: () => {}, // Disable click-outside-to-close without hiding the X button
            doneBtnText: 'Done',
            nextBtnText: 'Next &rarr;',
            prevBtnText: '&larr; Back',
            onHighlightStarted: (element) => {
              if (isMobile) {
                const elId = element?.id || '';
                if (elId.includes('design-menu') || elId.includes('profile-menu')) {
                  window.dispatchEvent(new Event('tour-open-mobile-sidebar'));
                } else if (elId) {
                  window.dispatchEvent(new Event('tour-close-mobile-sidebar'));
                }
                // Force driver to recalculate position after the sidebar animation (300ms) finishes
                setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
                }, 350);
              }
            },
            steps: [
              { popover: { popoverClass: 'portfobe-tour-theme portfobe-welcome-step', title: 'Dashboard Overview', description: `<div class="minimal-welcome-art"><div class="art-grid"></div><div class="art-glow"></div><svg class="art-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div><p class="minimal-welcome-text">Welcome to your command center. Let's explore the tools and navigation that will help you build an extraordinary portfolio.</p>` } },
              { element: isMobile ? '#tour-mobile-design-menu' : '#tour-design-menu', popover: { side: 'bottom', align: 'start', title: `Your Work is the Star <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`, description: 'Expand the Design menu to manage your projects, themes, and social links.' } },
              { element: isMobile ? '#tour-mobile-profile-menu' : '#tour-profile-menu', popover: { side: 'top', align: 'start', title: `Your Profile <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`, description: 'Set up your name, profession, bio, and configure your unique portfolio subdomain here.' } },
              { element: '#tour-canvas-btn', popover: { side: 'bottom', align: 'end', title: `Canvas / Editor <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`, description: 'Time to design! Click this canvas button or press CTRL + E to enter the Appearance Editor.' } },
              { element: isMobile ? '#tour-mobile-preview-btn' : '#tour-preview-btn', popover: { side: 'bottom', align: 'end', title: `Preview / Live URL <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`, description: 'Click here anytime to preview your live portfolio.' } },
              { element: '#tour-upgrade-btn', popover: { side: 'top', align: 'end', title: `Upgrade / Free Trial <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`, description: `One last thing: your new account is eligible for a FREE Premium trial. Now, let's get to work!` } }
            ],
            onDestroyStarted: () => {
               d.destroy();
               fetch('/api/profile', { 
                 method: 'PATCH', 
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ hasCompletedDashboardTour: true }) 
               }).then(() => mutate('/api/profile'));
            }
          });
          d.drive();
        };

        if (!profile.subdomain || !sessionStorage.getItem("hasSeenWelcomePromo")) {
          const checkInterval = setInterval(() => {
            if (profile.subdomain && sessionStorage.getItem("hasSeenWelcomePromo")) {
              clearInterval(checkInterval);
              startDashboardTour();
            }
          }, 500);
          
          // Clear interval if user navigates away before completing onboarding
          // Attach to the window object or define a custom cleanup within the useEffect
          (window as any)._tourCheckInterval = checkInterval;
        } else {
          startDashboardTour();
        }
      }

      if (isAppearanceRoot && profile.hasCompletedAppearanceTour === false) {
         const d = driver({
          popoverClass: 'portfobe-tour-theme',
          showProgress: true,
          animate: true,
          allowClose: true,
          stagePadding: 0,
          stageRadius: 0,
          overlayClickBehavior: () => {}, // Disable click-outside-to-close without hiding the X button
          doneBtnText: 'Start Designing',
          nextBtnText: 'Next &rarr;',
          steps: window.innerWidth < 1024 ? [
             { 
               popover: { popoverClass: 'portfobe-tour-theme portfobe-welcome-step', title: 'Welcome to the Editor', description: `<div class="minimal-welcome-art"><div class="art-grid"></div><div class="art-glow"></div><svg class="art-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div><p class="minimal-welcome-text">This is where the magic happens. Here, you have total control to design and customize every aspect of your portfolio to match your personal brand.</p>` },
               onHighlightStarted: () => { document.body.classList.add('tour-welcome-blur-active'); },
               onDeselected: () => { document.body.classList.remove('tour-welcome-blur-active'); }
             },
             { 
               element: '#appearance-mobile-dock', 
               popover: { title: `Editor Menu <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`, description: 'Tap here to access your Themes, Colors, and Layout settings.' },
               onHighlightStarted: () => { 
                 document.body.classList.remove('tour-welcome-blur-active');
               }
             },
             { 
               element: '#appearance-preview-panel', 
               popover: { title: `Real-time Preview <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`, description: 'All design changes will be reflected here in real-time. Happy designing!' },
             }
          ] : [
             { 
               popover: { popoverClass: 'portfobe-tour-theme portfobe-welcome-step', title: 'Welcome to the Editor', description: `<div class="minimal-welcome-art"><div class="art-grid"></div><div class="art-glow"></div><svg class="art-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div><p class="minimal-welcome-text">This is where the magic happens. Here, you have total control to design and customize every aspect of your portfolio to match your personal brand.</p>` },
               onHighlightStarted: () => { document.body.classList.add('tour-welcome-blur-active'); },
               onDeselected: () => { document.body.classList.remove('tour-welcome-blur-active'); }
             },
             { 
               element: '#appearance-left-panel', 
               popover: { title: `Themes & Layout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`, description: 'Choose your design foundation. Switch between Themes and Pages to customize your core layout.' },
               onHighlightStarted: () => { 
                 document.body.classList.remove('tour-welcome-blur-active');
                 document.body.classList.add('tour-active-left'); 
               },
               onDeselected: () => { document.body.classList.remove('tour-active-left'); }
             },
             { 
               element: '#appearance-right-panel', 
               popover: { title: `Styles & Details <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`, description: 'Define primary colors, typography, card shapes, and other micro-details to match your personal brand.' },
               onHighlightStarted: () => { document.body.classList.add('tour-active-right'); },
               onDeselected: () => { document.body.classList.remove('tour-active-right'); }
             },
             { 
               element: '#appearance-preview-panel', 
               popover: { title: `Real-time Preview <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa; margin-left: 4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`, description: 'All design changes will be reflected here in real-time. Happy designing!' },
               onHighlightStarted: () => { document.body.classList.add('tour-active-preview'); },
               onDeselected: () => { document.body.classList.remove('tour-active-preview'); }
             }
          ],
          onDestroyStarted: () => {
             document.body.classList.remove('tour-welcome-blur-active', 'tour-active-left', 'tour-active-right', 'tour-active-preview');
             d.destroy();
             fetch('/api/profile', { 
               method: 'PATCH', 
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ hasCompletedAppearanceTour: true }) 
             }).then(() => mutate('/api/profile'));
          }
         });
 
         // Wait until the editor finishes loading and the target element is in the DOM
         const checkElement = setInterval(() => {
           if (document.getElementById('tour-gallery-design')) {
             clearInterval(checkElement);
             document.body.classList.add('tour-welcome-blur-active');
             d.drive();
           }
         }, 300);
         
         // Timeout after 10 seconds to prevent infinite polling
         setTimeout(() => clearInterval(checkElement), 10000);
      }
    }, 1500); // Beri waktu animasi halaman selesai loading

    return () => {
      clearTimeout(timer);
      if ((window as any)._tourCheckInterval) clearInterval((window as any)._tourCheckInterval);
    };
  }, [profile, pathname]);

  return <>{children}</>;
}
