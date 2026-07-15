import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { ContentEditable } from './ContentEditable';

export function CreativeTemplate({
  resumeData,
  onFieldEdit,
  updateArrayField
}: {
  resumeData: any;
  onFieldEdit: (field: string, val: string) => void;
  updateArrayField: (arrayName: string, index: number, field: string, value: string) => void;
}) {
  return (
    <div className="flex h-full font-sans">
      <div className="w-1/3 bg-zinc-900 text-white p-6 h-full flex flex-col gap-6 rounded-l-2xl">
        <div>
          <ContentEditable value={resumeData.name} field="name" onFieldEdit={onFieldEdit} className="text-3xl font-black mb-1 leading-tight" />
          <ContentEditable value={resumeData.profession} field="profession" onFieldEdit={onFieldEdit} className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-4" />
        </div>
        <div className="flex flex-col gap-3 text-xs text-zinc-300">
          <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.email} field="email" onFieldEdit={onFieldEdit} /></div>
          <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.phone} field="phone" onFieldEdit={onFieldEdit} /></div>
          <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.location} field="location" onFieldEdit={onFieldEdit} /></div>
          <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.website} field="website" onFieldEdit={onFieldEdit} /></div>
        </div>
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Skills</h2>
          <div className="flex flex-col gap-2 text-sm">
            {resumeData.skills.map((skill: string, i: number) => (
              <ContentEditable key={i} value={skill} onChange={(val) => updateArrayField('skills', i, '', val)} className="bg-white/10 px-2 py-1 rounded text-xs inline-block w-fit" />
            ))}
          </div>
        </div>
      </div>
      <div className="w-2/3 p-8 bg-zinc-50 flex flex-col gap-8 rounded-r-2xl">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">About Me</h2>
          <ContentEditable value={resumeData.bio} field="bio" onFieldEdit={onFieldEdit} className="text-sm text-zinc-800 leading-relaxed font-medium" />
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Experience</h2>
          <div className="flex flex-col gap-5">
            {resumeData.experience.map((exp: any, index: number) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-emerald-400">
                <ContentEditable value={exp.title} onChange={(val) => updateArrayField('experience', index, 'title', val)} className="font-bold text-zinc-900 text-sm" />
                <div className="text-xs font-semibold text-zinc-500 mb-1 flex items-center gap-1">
                  <ContentEditable value={exp.company} onChange={(val) => updateArrayField('experience', index, 'company', val)} /> • 
                  <ContentEditable value={exp.date} onChange={(val) => updateArrayField('experience', index, 'date', val)} />
                </div>
                <ContentEditable value={exp.description} onChange={(val) => updateArrayField('experience', index, 'description', val)} className="text-sm text-zinc-600 leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Education</h2>
          <div className="flex flex-col gap-4">
            {resumeData.education.map((edu: any, index: number) => (
              <div key={edu.id} className="relative pl-4 border-l-2 border-emerald-400">
                <ContentEditable value={edu.degree} onChange={(val) => updateArrayField('education', index, 'degree', val)} className="font-bold text-zinc-900 text-sm" />
                <ContentEditable value={edu.school} onChange={(val) => updateArrayField('education', index, 'school', val)} className="text-xs font-semibold text-zinc-500 mb-1" />
                <ContentEditable value={edu.date} onChange={(val) => updateArrayField('education', index, 'date', val)} className="text-xs text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
