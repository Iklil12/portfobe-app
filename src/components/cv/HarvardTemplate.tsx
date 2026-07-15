import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { ContentEditable } from './ContentEditable';

export function HarvardTemplate({
  resumeData,
  onFieldEdit,
  updateArrayField
}: {
  resumeData: any;
  onFieldEdit: (field: string, val: string) => void;
  updateArrayField: (arrayName: string, index: number, field: string, value: string) => void;
}) {
  return (
    <div className="p-8 font-serif">
      {/* Header (Harvard ATS) */}
      <div className="border-b-2 border-black pb-6 mb-6 text-center">
        <ContentEditable value={resumeData.name} field="name" onFieldEdit={onFieldEdit} className="text-4xl font-bold text-black uppercase tracking-widest mb-2" />
        <ContentEditable value={resumeData.profession} field="profession" onFieldEdit={onFieldEdit} className="text-lg font-medium text-zinc-600 uppercase tracking-widest mb-4" />
        
        <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.email} field="email" onFieldEdit={onFieldEdit} /></div>
          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.phone} field="phone" onFieldEdit={onFieldEdit} /></div>
          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.location} field="location" onFieldEdit={onFieldEdit} /></div>
          <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.website} field="website" onFieldEdit={onFieldEdit} /></div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-zinc-300 pb-2 mb-3">Professional Summary</h2>
        <ContentEditable value={resumeData.bio} field="bio" onFieldEdit={onFieldEdit} className="text-sm text-zinc-800 leading-relaxed" />
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-zinc-300 pb-2 mb-4">Experience</h2>
        <div className="flex flex-col gap-5">
          {resumeData.experience.map((exp: any, index: number) => (
            <div key={exp.id} className="relative group">
              <div className="flex justify-between items-baseline mb-1">
                <ContentEditable value={exp.title} onChange={(val) => updateArrayField('experience', index, 'title', val)} className="font-bold text-black text-sm" />
                <ContentEditable value={exp.date} onChange={(val) => updateArrayField('experience', index, 'date', val)} className="text-xs font-semibold text-zinc-500" />
              </div>
              <ContentEditable value={exp.company} onChange={(val) => updateArrayField('experience', index, 'company', val)} className="text-sm font-medium text-zinc-700 italic mb-2" />
              <ContentEditable value={exp.description} onChange={(val) => updateArrayField('experience', index, 'description', val)} className="text-sm text-zinc-800 leading-relaxed" />
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-zinc-300 pb-2 mb-4">Education</h2>
        <div className="flex flex-col gap-4">
          {resumeData.education.map((edu: any, index: number) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline mb-1">
                <ContentEditable value={edu.degree} onChange={(val) => updateArrayField('education', index, 'degree', val)} className="font-bold text-black text-sm" />
                <ContentEditable value={edu.date} onChange={(val) => updateArrayField('education', index, 'date', val)} className="text-xs font-semibold text-zinc-500" />
              </div>
              <ContentEditable value={edu.school} onChange={(val) => updateArrayField('education', index, 'school', val)} className="text-sm text-zinc-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-zinc-300 pb-2 mb-4">Core Competencies</h2>
        <div className="flex flex-wrap gap-1 text-sm text-zinc-800 font-medium items-center">
          {resumeData.skills.map((skill: string, i: number) => (
            <React.Fragment key={i}>
              <ContentEditable value={skill} onChange={(val) => updateArrayField('skills', i, '', val)} className="inline-block" />
              {i < resumeData.skills.length - 1 && <span className="mx-1">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
