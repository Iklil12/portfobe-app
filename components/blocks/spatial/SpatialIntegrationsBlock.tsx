"use client";

import React from 'react';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';

export function SpatialIntegrationsBlock({ data }: any) {
  if (!data?.id) return null;

  return (
    <div className="w-full mt-10 px-8">
        <PenpotShowcase userId={data.id} variant="spatial" />
        <CanvaShowcase userId={data.id} variant="spatial" />
    </div>
  );
}
