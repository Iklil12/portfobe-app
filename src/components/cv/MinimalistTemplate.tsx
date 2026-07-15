import React from 'react';
import { ContentEditable } from './ContentEditable';

export function MinimalistTemplate({
  resumeData,
  onFieldEdit,
  updateArrayField
}: {
  resumeData: any;
  onFieldEdit: (field: string, val: string) => void;
  updateArrayField: (arrayName: string, index: number, field: string, value: string) => void;
}) {
  return (
    <div className="p-8 font-sans bg-white h-full flex flex-col">
      <div className="flex flex-col items-center text-center mb-10">
        <ContentEditable value={resumeData.name} field="name" onFieldEdit={onFieldEdit} className="text-4xl font-light text-zinc-900 tracking-tight mb-2" />
        <ContentEditable value={resumeData.profession} field="profession" onFieldEdit={onFieldEdit} className="text-sm text-zinc-500 tracking-widest uppercase mb-4" />
        <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
          <span><ContentEditable value={resumeData.email} field="email" onFieldEdit={onFieldEdit} /></span>
          <span>•</span>
          <span><ContentEditable value={resumeData.phone} field="phone" onFieldEdit={onFieldEdit} /></span>
          <span>•</span>
          <span><ContentEditable value={resumeData.location} field="location" onFieldEdit={onFieldEdit} /></span>
          <span>•</span>
          <span><ContentEditable value={resumeData.website} field="website" onFieldEdit={onFieldEdit} /></span>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-8 flex-1">
        <div className="col-span-4 flex flex-col gap-8">
          <div>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3">Profile</h2>
            <ContentEditable value={resumeData.bio} field="bio" onFieldEdit={onFieldEdit} className="text-sm text-zinc-600 leading-relaxed" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3">Skills</h2>
            <div className="flex flex-col gap-1.5 text-sm text-zinc-600">
              {resumeData.skills.map((skill: string, i: number) => (
                <ContentEditable key={i} value={skill} onChange={(val) => updateArrayField('skills', i, '', val)} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-8 flex flex-col gap-8">
          <div>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Experience</h2>
            <div className="flex flex-col gap-6">
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <ContentEditable value={exp.title} onChange={(val) => updateArrayField('experience', index, 'title', val)} className="font-semibold text-zinc-900 text-sm" />
                    <ContentEditable value={exp.date} onChange={(val) => updateArrayField('experience', index, 'date', val)} className="text-xs text-zinc-400" />
                  </div>
                  <ContentEditable value={exp.company} onChange={(val) => updateArrayField('experience', index, 'company', val)} className="text-sm text-zinc-500 mb-2" />
                  <ContentEditable value={exp.description} onChange={(val) => updateArrayField('experience', index, 'description', val)} className="text-sm text-zinc-600 leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Education</h2>
            <div className="flex flex-col gap-4">
              {resumeData.education.map((edu: any, index: number) => (
                <div key={edu.id}>
                  <ContentEditable value={edu.degree} onChange={(val) => updateArrayField('education', index, 'degree', val)} className="font-semibold text-zinc-900 text-sm" />
                  <ContentEditable value={edu.school} onChange={(val) => updateArrayField('education', index, 'school', val)} className="text-sm text-zinc-500" />
                  <ContentEditable value={edu.date} onChange={(val) => updateArrayField('education', index, 'date', val)} className="text-xs text-zinc-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
