import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task, TaskStatus, TaskPriority, TaskType, User } from '../types';
import { USERS } from '../constants';
import { generateTaskDetails, summarizeTask } from '../services/geminiService';

interface TaskModalProps {
  task: Task | null;
  projectKey: string;
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (id: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, projectKey, isOpen, currentUser, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    type: TaskType.TASK,
    assignee: null,
    acceptanceCriteria: '',
    stepsToReproduce: '',
    storyPoints: undefined,
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        assignee: task.assignee || null,
        description: task.description || '',
        status: task.status || TaskStatus.TODO,
        priority: task.priority || TaskPriority.MEDIUM,
        type: task.type || TaskType.TASK,
        acceptanceCriteria: task.acceptanceCriteria || '',
        stepsToReproduce: task.stepsToReproduce || '',
        storyPoints: task.storyPoints,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        type: TaskType.TASK,
        assignee: null,
        reporter: currentUser,
        acceptanceCriteria: '',
        stepsToReproduce: '',
        storyPoints: undefined,
      });
    }
    setAiSummary(null);
  }, [task, isOpen, currentUser]);

  useEffect(() => {
    const adjustHeight = () => {
      if (descriptionRef.current) {
        descriptionRef.current.style.height = 'auto';
        descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
      }
    };
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, [formData.description, isOpen]);

  const handleAiGenerate = useCallback(async () => {
    if (!formData.title) return;
    setIsAiLoading(true);
    const result = await generateTaskDetails(formData.title, formData.type || TaskType.TASK, projectKey);
    if (result) {
      setFormData(prev => ({
        ...prev,
        title: result.summary || prev.title,
        description: result.description || prev.description,
        priority: (result.priority as TaskPriority) || prev.priority,
        acceptanceCriteria: result.acceptanceCriteria || prev.acceptanceCriteria,
        stepsToReproduce: result.stepsToReproduce || prev.stepsToReproduce,
      }));
    }
    setIsAiLoading(false);
  }, [formData.title, formData.type, projectKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-10 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
              <i className={`fa-solid ${task ? 'fa-pen-nib' : 'fa-plus'} text-sm`}></i>
            </div>
            <div>
              <nav className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 flex items-center space-x-2">
                <span className="hover:text-indigo-600 transition-colors cursor-pointer">{projectKey}</span>
                <i className="fa-solid fa-chevron-right text-[8px] opacity-30"></i>
                <span className="text-slate-500">Issues</span>
                <i className="fa-solid fa-chevron-right text-[8px] opacity-30"></i>
                <span className="text-indigo-600 font-bold">{task ? task.key : 'New Issue'}</span>
              </nav>
              <h1 className="text-lg font-black text-slate-900 leading-none">
                {task ? 'Edit Issue' : 'Drafting New Issue'}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isAiLoading || !formData.title}
              className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black hover:bg-indigo-100 disabled:opacity-50 flex items-center space-x-2 text-[10px] transition-all border border-indigo-100 uppercase tracking-wider shadow-sm active:scale-95"
            >
              <i className={`fa-solid fa-wand-magic-sparkles ${isAiLoading ? 'animate-spin' : ''}`}></i>
              <span>{isAiLoading ? 'Working...' : 'Magic Edit'}</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-2"></div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all hover:rotate-90 duration-300">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8 space-y-10">
              {/* Title Section */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-transparent hover:border-slate-100 focus:border-indigo-500 focus:bg-slate-50/20 px-2 -mx-2 outline-none transition-all text-3xl font-black text-slate-900 placeholder:text-slate-200 py-2 rounded-lg"
                  placeholder="Issue title"
                />
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <i className="fa-solid fa-align-left text-xs"></i>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Description</label>
                  </div>
                  <button 
                    onClick={async () => {
                      setIsAiLoading(true);
                      const s = await summarizeTask(formData);
                      setAiSummary(s);
                      setIsAiLoading(false);
                    }}
                    className="text-[10px] text-indigo-600 font-black hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-indigo-100 uppercase tracking-tighter"
                  >
                    AI Summary
                  </button>
                </div>
                
                {aiSummary && (
                  <div className="bg-indigo-50 border border-indigo-100/50 p-5 rounded-2xl text-sm text-indigo-900 leading-relaxed shadow-sm relative animate-in slide-in-from-top-2 duration-500">
                    <i className="fa-solid fa-sparkles absolute -top-2 -right-2 text-indigo-400 text-lg bg-white rounded-full p-1 shadow-sm"></i>
                    <p className="font-medium italic">{aiSummary}</p>
                  </div>
                )}

                <textarea
                  ref={descriptionRef}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[150px] bg-transparent border-2 border-transparent hover:border-slate-50 focus:border-indigo-100 focus:bg-slate-50/30 rounded-2xl p-4 outline-none transition-all text-base leading-relaxed font-medium text-slate-700 placeholder:text-slate-300 resize-none overflow-hidden"
                  placeholder="What's this issue about?"
                />
              </div>

              {/* Collapsible/Secondary Details */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-slate-400">
                    <i className="fa-solid fa-list-check text-xs"></i>
                    <label className="text-[10px] font-black uppercase tracking-widest">Acceptance Criteria</label>
                  </div>
                  <textarea
                    value={formData.acceptanceCriteria}
                    onChange={e => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm font-medium min-h-[100px] transition-all"
                    placeholder="Success definition..."
                  />
                </div>
                <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-slate-400">
                    <i className="fa-solid fa-flask text-xs"></i>
                    <label className="text-[10px] font-black uppercase tracking-widest">Steps to Reproduce</label>
                  </div>
                  <textarea
                    value={formData.stepsToReproduce}
                    onChange={e => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm font-medium min-h-[100px] transition-all"
                    placeholder="Step-by-step guide..."
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="col-span-4">
              <div className="bg-slate-50/40 p-8 rounded-[32px] border border-slate-100 space-y-8 sticky top-0 shadow-inner ring-1 ring-white/50">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Configuration</h3>
                   <i className="fa-solid fa-circle-info text-slate-300 text-xs"></i>
                </div>
                
                <div className="space-y-6">
                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all appearance-none"
                    >
                      {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all appearance-none"
                    >
                      {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Responsible</label>
                    <div className="relative group">
                      <select
                        value={formData.assignee?.id || ''}
                        onChange={e => {
                          const userId = e.target.value;
                          const selectedUser = USERS.find(u => u.id === userId) || null;
                          setFormData(prev => ({ ...prev, assignee: selectedUser }));
                        }}
                        className="w-full px-4 py-3 pl-11 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all appearance-none"
                      >
                        <option value="">Unassigned</option>
                        {USERS.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                         {formData.assignee ? (
                           <img src={formData.assignee.avatar} className="w-5 h-5 rounded-lg border border-slate-100 shadow-sm" alt="" />
                         ) : (
                           <i className="fa-solid fa-user-plus text-slate-300"></i>
                         )}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-indigo-400 transition-colors">
                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                      </div>
                    </div>
                  </div>

                  {/* Story Points */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Story Points</label>
                    <input
                      type="number"
                      value={formData.storyPoints === undefined ? '' : formData.storyPoints}
                      onChange={e => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        setFormData({ ...formData, storyPoints: val });
                      }}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none hover:border-indigo-400 focus:border-indigo-500 hover:shadow-md transition-all"
                      placeholder="Estimate (e.g. 5)"
                      min="0"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as TaskType })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all appearance-none"
                    >
                      {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-8 border-t border-slate-200 text-[10px] text-slate-400 space-y-4 font-bold uppercase tracking-widest">
                   <div className="flex justify-between items-center group">
                     <span>Reporter</span> 
                     <span className="text-slate-900 flex items-center space-x-2 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                       <img src={formData.reporter?.avatar || currentUser.avatar} className="w-4 h-4 rounded-md" alt="" />
                       <span className="text-[9px] lowercase tracking-tight">{formData.reporter?.name || currentUser.name}</span>
                     </span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span>Created</span> 
                     <span className="text-slate-900 text-[9px] bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm lowercase tracking-tight">
                       {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'drafting now'}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div>
            {task && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="text-rose-500 hover:bg-rose-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-transparent hover:border-rose-100 active:scale-95"
              >
                Delete Issue
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 text-slate-400 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-12 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              {task ? 'Update Issue' : 'Publish Issue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;