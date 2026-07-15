"use client";

import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { HarvardTemplate } from './HarvardTemplate';

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
          <CreativeTemplate resumeData={resumeData} onFieldEdit={handleEdit} updateArrayField={updateArrayField} />
        ) : resumeData.template === 'minimalist' ? (
          <MinimalistTemplate resumeData={resumeData} onFieldEdit={handleEdit} updateArrayField={updateArrayField} />
        ) : (
          <HarvardTemplate resumeData={resumeData} onFieldEdit={handleEdit} updateArrayField={updateArrayField} />
        )}
      </div>
    </div>
    </>
  );
}
