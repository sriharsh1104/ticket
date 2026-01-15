import React from 'react';
import { User, TaskPriority, TaskType } from '../types';
import { USERS, PRIORITY_COLORS, TYPE_ICONS } from '../constants';

interface BoardFiltersProps {
  selectedAssignees: string[];
  setSelectedAssignees: (ids: string[]) => void;
  selectedPriorities: TaskPriority[];
  setSelectedPriorities: (priorities: TaskPriority[]) => void;
  selectedTypes: TaskType[];
  setSelectedTypes: (types: TaskType[]) => void;
  onClear: () => void;
}

const BoardFilters: React.FC<BoardFiltersProps> = ({
  selectedAssignees,
  setSelectedAssignees,
  selectedPriorities,
  setSelectedPriorities,
  selectedTypes,
  setSelectedTypes,
  onClear,
}) => {
  const hasFilters = selectedAssignees.length > 0 || selectedPriorities.length > 0 || selectedTypes.length > 0;

  const toggleFilter = <T,>(current: T[], item: T, setter: (val: T[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  return (
    <div className="px-8 py-3 bg-white border-b border-slate-50 flex items-center justify-between shrink-0 overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-6">
        {/* Assignees Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Assignees</span>
          <div className="flex -space-x-1.5">
            {USERS.map(u => (
              <button
                key={u.id}
                onClick={() => toggleFilter(selectedAssignees, u.id, setSelectedAssignees)}
                className={`relative transition-all duration-200 ${
                  selectedAssignees.includes(u.id) 
                    ? 'ring-2 ring-indigo-500 ring-offset-1 z-10 scale-110' 
                    : 'opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
                }`}
              >
                <img src={u.avatar} className="w-7 h-7 rounded-lg border-2 border-white shadow-sm" alt={u.name} title={u.name} />
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-[1px] bg-slate-100"></div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Priority</span>
          <div className="flex items-center space-x-1.5">
            {Object.values(TaskPriority).map(p => (
              <button
                key={p}
                onClick={() => toggleFilter(selectedPriorities, p, setSelectedPriorities)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${
                  selectedPriorities.includes(p)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                <i className={`fa-solid fa-signal mr-1.5 ${PRIORITY_COLORS[p]}`}></i>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-[1px] bg-slate-100"></div>

        {/* Type Filter */}
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Type</span>
          <div className="flex items-center space-x-1.5">
            {Object.values(TaskType).map(t => (
              <button
                key={t}
                onClick={() => toggleFilter(selectedTypes, t, setSelectedTypes)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${
                  selectedTypes.includes(t)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                <i className={`${TYPE_ICONS[t]} mr-1.5`}></i>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasFilters && (
        <button 
          onClick={onClear}
          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-rose-100"
        >
          <i className="fa-solid fa-filter-circle-xmark mr-2"></i>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default BoardFilters;