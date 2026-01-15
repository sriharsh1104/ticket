import React, { useState } from 'react';
import { Organization, Project } from '../types';

interface OrgSetupProps {
  onComplete: (org: Organization) => void;
}

export const OrgSetup: React.FC<OrgSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60"></div>

      <div className="max-w-xl w-full z-10 bg-white p-12 rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.05)] border border-slate-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100 mb-10">P</div>
        <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Step 1 of 2</h2>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Create your workspace</h1>
        <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">PlaneClone helps teams ship faster. Start by naming your shared digital workspace.</p>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workspace name</label>
            <input 
              type="text" 
              placeholder="e.g. Acme Corp"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workspace URL</label>
            <div className="flex items-center group">
              <input 
                type="text" 
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 border-r-0 rounded-l-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 text-right"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <span className="px-5 py-4 bg-slate-100 border border-l-0 border-slate-100 rounded-r-2xl text-slate-500 text-sm font-black lowercase tracking-tight">.planeclone.io</span>
            </div>
          </div>

          <button 
            disabled={!name}
            onClick={() => onComplete({ id: 'org-1', name, slug })}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 active:scale-[0.98]"
          >
            Continue to setup
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProjectSetupProps {
  onComplete: (project: Project) => void;
}

export const ProjectSetup: React.FC<ProjectSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60"></div>

      <div className="max-w-xl w-full z-10 bg-white p-12 rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.05)] border border-slate-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100 mb-10">P</div>
        <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Step 2 of 2</h2>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Launch your first project</h1>
        <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">Projects group related tasks together. You can always create more later.</p>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project name</label>
            <input 
              type="text" 
              placeholder="e.g. Q3 Roadmap"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.length > 0) {
                   const words = e.target.value.trim().split(/\s+/);
                   const k = words.length > 1 ? words.map(w => w[0]).join('').toUpperCase() : e.target.value.substring(0, 3).toUpperCase();
                   setKey(k);
                }
              }}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Key prefix</label>
            <input 
              type="text" 
              className="w-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-black text-slate-900 uppercase tracking-widest text-center"
              value={key}
              maxLength={5}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
            />
            <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tighter italic">This will be prefixed to every issue (e.g. {key}-1)</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
             {[
               { id: 'Software', icon: 'fa-code' }, 
               { id: 'Service Desk', icon: 'fa-headset' }, 
               { id: 'Business', icon: 'fa-briefcase' }
             ].map(type => (
               <div key={type.id} className="border-2 border-slate-50 p-6 rounded-2xl text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group active:scale-95 shadow-sm">
                 <i className={`fa-solid ${type.icon} text-slate-400 group-hover:text-indigo-600 mb-3 block text-xl transition-colors`}></i>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{type.id}</span>
               </div>
             ))}
          </div>

          <button 
            disabled={!name || !key}
            onClick={() => onComplete({ id: 'p-1', name, key, description: '', type: 'Software', leadId: 'u1' })}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 active:scale-[0.98]"
          >
            Create Project & Explore
          </button>
        </div>
      </div>
    </div>
  );
};