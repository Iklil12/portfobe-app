import React from 'react';

export default function CancelOrPauseSubscription() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Not actively looking for work right now? You don't have to delete your entire portfolio.</p>
            <p>You can "Pause" your subscription from the Billing settings. When paused, your live site will revert to a generic "Coming Soon" screen, but all your projects, custom themes, and high-res assets will remain safely stored on our servers for up to 12 months.</p>
            <div className="p-6 bg-white/5 border border-white/10 mt-8">
                <p className="m-0 text-base">When you are ready to freelance again, simply unpause your subscription and your site will be live instantly, exactly as you left it.</p>
            </div>
        </div>
    );
}
