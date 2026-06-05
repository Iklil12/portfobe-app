import React from 'react';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';

export function LayeredMonolithWidgetsBlock({ data }: any) {
    return (
        <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col overflow-y-auto" >
            <div className="noise mix-blend-overlay opacity-10"></div>
            <div className="w-full max-w-6xl mx-auto relative z-10 pb-20">
                <GithubStats userId={data?.userId || data?.user?.id || data?.id || ""} variant="layered-monolith" />
                <CanvaShowcase userId={data?.userId || data?.user?.id || data?.id || ""} variant="layered-monolith" />
                <PenpotShowcase userId={data?.userId || data?.user?.id || data?.id || ""} variant="layered-monolith" />
            </div>
        </section>
    );
}
