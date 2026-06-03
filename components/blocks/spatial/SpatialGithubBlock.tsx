"use client";

import React from 'react';
import { GithubStats } from '@/components/themes/widgets/GithubStats';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function SpatialGithubBlock({ data, theme }: any) {
  if (!data?.id) return null;

  const rawHighlightColor = theme?.themeColor || '#6366f1';
  const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#6366f1';

  return (
    <div className="w-full">
      <GithubStats userId={data.id} variant="spatial" themeColor={highlightColor} />
    </div>
  );
}
