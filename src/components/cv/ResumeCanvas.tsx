"use client";

import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function ResumeCanvas({ 
  profile, 
  customTexts, 
  isMobileView 
}: { 
  profile: any, 
  customTexts: any, 
  isMobileView: boolean 
}) {
  const [resumeData, setResumeData] = useState<any>({
    name: profile?.fullName || "Your Name",
    profession: profile?.profession || "Profession",
    bio: profile?.bio || "A brief professional summary about yourself.",
    email: profile?.user?.email || "email@example.com",
    phone: "+62 812 3456 7890",
    location: profile?.location || "City, Country",
    website: profile?.subdomain ? `${profile.subdomain}.portfo.be` : "portfo.be/username",
    experience: [
      {
        id: "exp-1",
        title: "Senior Product Designer",
        company: "Tech Corp",
        date: "2021 - Present",
        description: "Led the design of enterprise SaaS products, resulting in a 40% increase in user retention."
      },
      {
        id: "exp-2",
        title: "UI/UX Designer",
        company: "Creative Studio",
        date: "2018 - 2021",
        description: "Designed responsive websites and mobile applications for various clients."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "Bachelor of Arts in Design",
        school: "State University",
        date: "2014 - 2018"
      }
    ],
    skills: ["UI/UX Design", "Figma", "Prototyping", "User Research", "HTML/CSS"]
  });

  // Sync data from parent if updated
  useEffect(() => {
    if (profile && !resumeData.isInitialized) {
      // Parse saved resume data if it exists
      let savedData = null;
      if (profile.resumeData) {
        try {
          savedData = JSON.parse(profile.resumeData);
        } catch (e) {}
      }

      if (savedData) {
        setResumeData({ ...savedData, isInitialized: true });
      } else {
        setResumeData((prev: any) => ({
          ...prev,
          name: profile.fullName || prev.name,
          profession: profile.profession || prev.profession,
          bio: profile.bio || prev.bio,
          location: profile.location || prev.location,
          isInitialized: true
        }));
      }
    }
  }, [profile, resumeData.isInitialized]);

  // Sync template from parent if changed externally
  useEffect(() => {
    if (profile?.resumeData) {
      let parentTemplate = null;
      if (typeof profile.resumeData === 'string') {
        try {
          parentTemplate = JSON.parse(profile.resumeData).template;
        } catch(e) {}
      } else {
        parentTemplate = profile.resumeData.template;
      }

      if (parentTemplate && parentTemplate !== resumeData.template) {
        setResumeData((prev: any) => ({ ...prev, template: parentTemplate }));
      }
    }
  }, [profile?.resumeData, resumeData.template]);

  // Post data to parent whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ 
        type: 'RESUME_DATA_UPDATE', 
        data: resumeData 
      }, window.location.origin);
    }
  }, [resumeData]);

  const handleEdit = (field: string, value: string) => {
    setResumeData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (arrayName: string, index: number, field: string, value: string) => {
    setResumeData((prev: any) => {
      const newArray = [...prev[arrayName]];
      if (arrayName === 'skills') {
        newArray[index] = value;
      } else {
        newArray[index] = { ...newArray[index], [field]: value };
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const ContentEditable = ({ value, field, onChange, className }: { value: string, field?: string, onChange?: (val: string) => void, className?: string }) => (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const val = e.currentTarget.textContent || "";
        if (onChange) onChange(val);
        else if (field) handleEdit(field, val);
      }}
      className={`outline-none hover:bg-black/5 focus:bg-black/5 focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1 transition-colors ${className || ''}`}
    >
      {value}
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body, html { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
          }
          .print-wrapper { 
            background: white !important; 
            padding: 0 !important; 
            display: block !important; 
            overflow: visible !important; 
            min-height: 0 !important; 
          }
          .print-canvas {
            width: 100% !important;
            min-height: 100vh !important;
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
      <div className={`print-wrapper w-full min-h-screen bg-zinc-900 flex items-center justify-center py-10 overflow-auto ${isMobileView ? 'p-2' : 'p-8'}`}>
        
        {/* A4 Paper Canvas */}
        <div 
          className="print-canvas bg-white shadow-2xl relative overflow-hidden"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            transform: isMobileView ? 'scale(0.4)' : 'scale(1)',
            transformOrigin: 'top center'
          }}
        >
        {resumeData.template === 'creative' ? (
          <div className="flex h-full font-sans">
            <div className="w-1/3 bg-zinc-900 text-white p-6 h-full flex flex-col gap-6 rounded-l-2xl">
              <div>
                <ContentEditable value={resumeData.name} field="name" className="text-3xl font-black mb-1 leading-tight" />
                <ContentEditable value={resumeData.profession} field="profession" className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-4" />
              </div>
              <div className="flex flex-col gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.email} field="email" /></div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.phone} field="phone" /></div>
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.location} field="location" /></div>
                <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-emerald-400" /> <ContentEditable value={resumeData.website} field="website" /></div>
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
                <ContentEditable value={resumeData.bio} field="bio" className="text-sm text-zinc-800 leading-relaxed font-medium" />
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
        ) : resumeData.template === 'minimalist' ? (
          <div className="p-8 font-sans bg-white h-full flex flex-col">
            <div className="flex flex-col items-center text-center mb-10">
              <ContentEditable value={resumeData.name} field="name" className="text-4xl font-light text-zinc-900 tracking-tight mb-2" />
              <ContentEditable value={resumeData.profession} field="profession" className="text-sm text-zinc-500 tracking-widest uppercase mb-4" />
              <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
                <span><ContentEditable value={resumeData.email} field="email" /></span>
                <span>•</span>
                <span><ContentEditable value={resumeData.phone} field="phone" /></span>
                <span>•</span>
                <span><ContentEditable value={resumeData.location} field="location" /></span>
                <span>•</span>
                <span><ContentEditable value={resumeData.website} field="website" /></span>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-8 flex-1">
              <div className="col-span-4 flex flex-col gap-8">
                <div>
                  <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3">Profile</h2>
                  <ContentEditable value={resumeData.bio} field="bio" className="text-sm text-zinc-600 leading-relaxed" />
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
        ) : (
          <div className="p-8 font-serif">
            {/* Header (Harvard ATS) */}
            <div className="border-b-2 border-black pb-6 mb-6 text-center">
              <ContentEditable value={resumeData.name} field="name" className="text-4xl font-bold text-black uppercase tracking-widest mb-2" />
              <ContentEditable value={resumeData.profession} field="profession" className="text-lg font-medium text-zinc-600 uppercase tracking-widest mb-4" />
              
              <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.email} field="email" /></div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.phone} field="phone" /></div>
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.location} field="location" /></div>
                <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> <ContentEditable value={resumeData.website} field="website" /></div>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-zinc-300 pb-2 mb-3">Professional Summary</h2>
              <ContentEditable value={resumeData.bio} field="bio" className="text-sm text-zinc-800 leading-relaxed" />
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
        )}
      </div>
    </div>
    </>
  );
}
