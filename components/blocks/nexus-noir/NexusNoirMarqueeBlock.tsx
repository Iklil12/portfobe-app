import React from 'react';

export function NexusNoirMarqueeBlock() {
    return (
        <div className="border-y border-white/10 py-6 bg-black relative z-20 transform -rotate-1 scale-105 my-20 overflow-hidden">
            <div className="marquee-wrap">
                <div className="marquee-inner">
                    {[1, 2].map((group) => (
                        <div key={group} className="flex items-center gap-10 px-5">
                            <span className="font-nn-heading text-4xl text-transparent font-bold" style={{ WebkitTextStroke: '1px #888' }}>UI/UX DESIGN</span>
                            <span className="w-3 h-3 rounded-full bg-white"></span>
                            <span className="font-nn-heading text-4xl text-white font-bold">FRONTEND DEV</span>
                            <span className="w-3 h-3 rounded-full bg-white"></span>
                            <span className="font-nn-heading text-4xl text-transparent font-bold" style={{ WebkitTextStroke: '1px #888' }}>CREATIVE DIRECTION</span>
                            <span className="w-3 h-3 rounded-full bg-white"></span>
                            <span className="font-nn-heading text-4xl text-white font-bold">INTERACTION DESIGN</span>
                            <span className="w-3 h-3 rounded-full bg-white"></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
