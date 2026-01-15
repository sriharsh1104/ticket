import React, { useRef, useEffect } from 'react';
import { User } from '../types';

interface ProfileDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSettings: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isOpen, onClose, onLogout, onSettings }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-slate-100"
    >
      {/* User Section */}
      <div className="px-6 py-6 border-b border-slate-50 bg-slate-50/30">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Your Identity</div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-110 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-900 truncate">{user.name}</span>
            <span className="text-xs text-slate-500 truncate font-medium">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="py-3 px-2">
        <button 
          onClick={() => { onSettings(); onClose(); }}
          className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 flex items-center group transition-all rounded-2xl"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center mr-3 group-hover:bg-indigo-100 transition-colors">
            <i className="fa-solid fa-sliders text-indigo-600 text-xs"></i>
          </div>
          <span className="flex-1 font-bold">Preferences</span>
        </button>

        <button className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-400 flex items-center group transition-all rounded-2xl cursor-not-allowed opacity-60">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center mr-3">
            <i className="fa-solid fa-user text-slate-400 text-xs"></i>
          </div>
          <span className="flex-1 font-bold">Public Profile</span>
          <span className="coming-soon-badge">SOON</span>
        </button>
      </div>

      {/* Footer Section */}
      <div className="border-t border-slate-50 py-3 px-2 bg-slate-50/50">
        <button 
          onClick={onLogout}
          className="w-full text-left px-4 py-3 hover:bg-rose-50 text-sm text-rose-600 font-black flex items-center group transition-all rounded-2xl"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100/50 flex items-center justify-center mr-3 group-hover:bg-rose-100 transition-colors">
            <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
          </div>
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;