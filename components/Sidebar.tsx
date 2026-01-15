import React from 'react';

interface SidebarProps {
  onSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSettings }) => {
  const NavItem = ({ icon, label, active = false, comingSoon = false }: { icon: string, label: string, active?: boolean, comingSoon?: boolean }) => (
    <div className={`flex items-center justify-between group px-2 py-1.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      <div className="flex items-center space-x-2.5">
        <i className={`fa-solid ${icon} w-4 text-center text-sm`}></i>
        <span className="text-sm font-semibold tracking-tight">{label}</span>
      </div>
      {comingSoon && <span className="coming-soon-badge opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>}
    </div>
  );

  return (
    <div className="w-[240px] bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-20 shrink-0">
      {/* Workspace Switcher */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent active:border-slate-100 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-indigo-100 shadow-lg group-hover:scale-110 transition-transform">P</div>
          <div className="flex-1 overflow-hidden">
            <h2 className="font-bold text-sm text-slate-900 truncate leading-none mb-1">PlaneClone</h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none">Workspace</p>
          </div>
          <i className="fa-solid fa-chevron-down text-[10px] text-slate-300 group-hover:text-slate-500 transition-colors"></i>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8 custom-scrollbar">
        {/* Main Nav */}
        <div className="space-y-0.5">
          <NavItem icon="fa-house-chimney" label="Home" />
          <NavItem icon="fa-rectangle-list" label="My Issues" />
          <NavItem icon="fa-compass" label="Explore" comingSoon />
        </div>

        {/* Current Project */}
        <div>
          <div className="px-2 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Project</span>
          </div>
          <div className="space-y-0.5">
            <NavItem icon="fa-circle-dot" label="Product Dev" active />
          </div>
          <div className="mt-3 pl-2 space-y-0.5 border-l border-slate-100 ml-4">
            <NavItem icon="fa-arrows-spin" label="Cycles" comingSoon />
            <NavItem icon="fa-cubes" label="Modules" comingSoon />
            <NavItem icon="fa-eye" label="Views" comingSoon />
            <NavItem icon="fa-user-group" label="Team" />
          </div>
        </div>

        {/* Shortcuts */}
        <div>
          <div className="px-2 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shortcuts</span>
          </div>
          <div className="space-y-0.5 text-slate-400">
             <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm font-medium">
               <i className="fa-regular fa-star text-xs"></i>
               <span>Favorites</span>
             </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-3">
        <button 
          onClick={onSettings}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 transition-all group border border-transparent hover:border-slate-100 hover:shadow-sm"
        >
          <i className="fa-solid fa-sliders text-sm group-hover:rotate-12 transition-transform"></i>
          <span className="text-sm font-bold tracking-tight">Settings</span>
        </button>
        <div className="px-3 flex items-center justify-between">
           <span className="text-[10px] font-bold text-slate-400">v1.2.4-BETA</span>
           <div className="flex space-x-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;