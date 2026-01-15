import React, { useState } from 'react';
import { User, Project, Organization } from '../types';

interface SettingsUIProps {
  user: User;
  project: Project;
  org: Organization;
  onClose: () => void;
}

const SettingsUI: React.FC<SettingsUIProps> = ({ user, project, org, onClose }) => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', icon: 'fa-sliders' },
    { id: 'Access', icon: 'fa-shield-halved' },
    { id: 'Notifications', icon: 'fa-bell' },
    { id: 'Integrations', icon: 'fa-plug-circle-bolt' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[250] flex flex-col animate-in fade-in duration-300 backdrop-blur-md">
      <header className="h-[72px] border-b border-slate-100 px-10 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-100">P</div>
          <div>
            <nav className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Configuration</nav>
            <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">Workspace Preferences</h1>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all hover:rotate-90 duration-300"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="w-[280px] border-r border-slate-100 bg-slate-50/50 p-8 flex flex-col shrink-0 overflow-y-auto">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-6">General Settings</div>
          <div className="space-y-1.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
                <span>{tab.id}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-6">User Profile</div>
          <button className="w-full text-left px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm font-bold text-slate-500 hover:bg-white/50">
            <i className="fa-solid fa-user-circle w-5 text-center"></i>
            <span>Account Security</span>
          </button>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto p-16 bg-white custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">{activeTab} Details</h2>

            {activeTab === 'General' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Workspace Name</label>
                    <input 
                      type="text" 
                      defaultValue={org.name}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Project Key</label>
                      <input 
                        type="text" 
                        defaultValue={project.key}
                        disabled
                        className="w-full px-5 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed outline-none font-black text-sm uppercase tracking-widest"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Primary Category</label>
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900">
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Product</option>
                        <option>Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Workspace Domain</label>
                    <div className="flex items-center group">
                      <span className="px-5 py-3.5 bg-slate-100 border border-r-0 border-slate-100 rounded-l-2xl text-slate-500 text-sm font-bold">https://</span>
                      <input 
                        type="text" 
                        defaultValue={org.slug}
                        className="flex-1 px-5 py-3.5 border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white"
                      />
                      <span className="px-5 py-3.5 bg-slate-100 border border-l-0 border-slate-100 rounded-r-2xl text-slate-500 text-sm font-bold">.planeclone.app</span>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex items-center space-x-4">
                  <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                    Save Changes
                  </button>
                  <button className="px-8 py-3.5 text-slate-500 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    Discard
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'General' && (
              <div className="py-24 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <i className="fa-solid fa-puzzle-piece text-4xl text-indigo-200"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Coming Soon</h3>
                <p className="text-slate-500 max-w-sm font-medium">We're building more configuration modules to help you customize your workspace further.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsUI;