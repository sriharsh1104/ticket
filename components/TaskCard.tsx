import React from 'react';
import { Task, TaskPriority, TaskType, TaskStatus } from '../types';
import { PRIORITY_COLORS, TYPE_ICONS } from '../constants';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const StatusIcon = () => {
    switch (task.status) {
      case TaskStatus.DONE: return <i className="fa-solid fa-circle-check text-emerald-500"></i>;
      case TaskStatus.IN_PROGRESS: return <i className="fa-solid fa-circle-half-stroke text-amber-500"></i>;
      default: return <i className="fa-regular fa-circle text-slate-300"></i>;
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEdit(task)}
      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer transition-all duration-300 active:scale-[0.98] group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-xs shrink-0">
            <StatusIcon />
          </div>
          <div className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug">
            {task.title}
          </div>
        </div>
        {task.storyPoints !== undefined && (
          <div className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-500 border border-slate-200 shrink-0">
            {task.storyPoints}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-3">
          <div className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center space-x-1.5">
             <i className={`${TYPE_ICONS[task.type]} text-[10px]`}></i>
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-tight">{task.key}</span>
          </div>
          <div className={`${PRIORITY_COLORS[task.priority]} text-[10px] transition-colors`}>
            <i className="fa-solid fa-signal"></i>
          </div>
        </div>

        <div className="flex items-center -space-x-1">
          {task.assignee ? (
            <img 
              src={task.assignee.avatar} 
              alt={task.assignee.name}
              className="w-6 h-6 rounded-xl border-2 border-white ring-1 ring-slate-100 shadow-sm"
              title={task.assignee.name}
            />
          ) : (
            <div className="w-6 h-6 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 hover:bg-slate-50 transition-colors">
              <i className="fa-solid fa-user-plus"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;