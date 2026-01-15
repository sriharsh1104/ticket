import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import ProfileDropdown from './components/ProfileDropdown';
import SettingsUI from './components/SettingsUI';
import BoardFilters from './components/BoardFilters';
import { AuthUI } from './components/AuthUI';
import { OrgSetup, ProjectSetup } from './components/OnboardingUI';
import { 
  Task, 
  TaskStatus, 
  TaskPriority, 
  TaskType, 
  AppView, 
  AuthSubView, 
  User, 
  Organization, 
  Project 
} from './types';
import { INITIAL_TASKS, USERS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('AUTH');
  const [authSubView, setAuthSubView] = useState<AuthSubView>('LOGIN');
  
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [initialStatusForNewTask, setInitialStatusForNewTask] = useState<TaskStatus | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (project && user && tasks.length === 0) {
      const seeded = INITIAL_TASKS.map(t => ({
        ...t,
        projectId: project.id,
        key: `${project.key}-${t.id.replace('t', '')}`,
        reporter: user
      }));
      setTasks(seeded);
    }
  }, [project, user, tasks.length]);

  const handleAuthSuccess = useCallback((email: string) => {
    const name = email ? email.split('@')[0].toUpperCase() : 'USER';
    setUser({
      id: 'u-current',
      name,
      email: email || 'user@example.com',
      avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true`
    });
    setView('ORG_SETUP');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setOrg(null);
    setProject(null);
    setTasks([]);
    setIsProfileOpen(false);
    setView('AUTH');
    setAuthSubView('LOGIN');
  }, []);

  const handleOrgSetup = useCallback((newOrg: Organization) => {
    if (newOrg) {
      setOrg(newOrg);
      setView('PROJECT_SETUP');
    }
  }, []);

  const handleProjectSetup = useCallback((newProject: Project) => {
    if (newProject) {
      setProject(newProject);
      setView('BOARD');
    }
  }, []);

  const columns = useMemo(() => [
    { id: TaskStatus.TODO, title: 'Backlog', icon: 'fa-regular fa-circle text-slate-300' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', icon: 'fa-solid fa-circle-half-stroke text-amber-500' },
    { id: TaskStatus.DONE, title: 'Done', icon: 'fa-solid fa-circle-check text-emerald-500' },
  ], []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search term filter
      const term = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        task.title?.toLowerCase().includes(term) ||
        task.key?.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term) ||
        task.assignee?.name.toLowerCase().includes(term);

      // Assignee filter
      const matchesAssignee = selectedAssignees.length === 0 || 
        (task.assignee && selectedAssignees.includes(task.assignee.id));

      // Priority filter
      const matchesPriority = selectedPriorities.length === 0 || 
        selectedPriorities.includes(task.priority);

      // Type filter
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.includes(task.type);

      return matchesSearch && matchesAssignee && matchesPriority && matchesType;
    });
  }, [tasks, searchTerm, selectedAssignees, selectedPriorities, selectedTypes]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedAssignees([]);
    setSelectedPriorities([]);
    setSelectedTypes([]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
    ));
  }, []);

  const openCreateModal = useCallback((initialStatus?: TaskStatus) => {
    setSelectedTask(null);
    setInitialStatusForNewTask(initialStatus);
    setIsModalOpen(true);
  }, []);

  const saveTask = useCallback((taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, ...taskData, updatedAt: new Date().toISOString() } as Task : t
      ));
    } else {
      if (!user) return;
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        key: `${project?.key || 'PL'}-${tasks.length + 1}`,
        projectId: project?.id || 'p-default',
        title: taskData.title || 'New Issue',
        description: taskData.description || '',
        status: taskData.status || initialStatusForNewTask || TaskStatus.TODO,
        priority: taskData.priority || TaskPriority.MEDIUM,
        type: taskData.type || TaskType.TASK,
        assignee: taskData.assignee || null,
        reporter: user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        acceptanceCriteria: taskData.acceptanceCriteria,
        stepsToReproduce: taskData.stepsToReproduce,
        storyPoints: taskData.storyPoints,
      };
      setTasks(prev => [...prev, newTask]);
    }
    setIsModalOpen(false);
  }, [selectedTask, tasks.length, project, user, initialStatusForNewTask]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setIsModalOpen(false);
  }, []);

  if (view === 'AUTH') return <AuthUI view={authSubView} setView={setAuthSubView} onSuccess={handleAuthSuccess} />;
  if (view === 'ORG_SETUP') return <OrgSetup onComplete={handleOrgSetup} />;
  if (view === 'PROJECT_SETUP') return <ProjectSetup onComplete={handleProjectSetup} />;

  if (!user || !project) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar onSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Navigation Bar */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 shadow-sm shadow-slate-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
               <span className="hover:text-indigo-600 cursor-pointer transition-colors">{org?.name}</span>
               <i className="fa-solid fa-chevron-right text-[8px]"></i>
               <span className="text-slate-900">{project.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative group hidden md:block">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="Filter board..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:bg-white rounded-xl outline-none text-xs w-48 transition-all focus:w-80 placeholder:text-slate-400 font-medium"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             
             <button 
                onClick={() => openCreateModal()}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all flex items-center space-x-2 shadow-lg shadow-indigo-100 active:scale-95"
              >
                <i className="fa-solid fa-plus"></i>
                <span>NEW ISSUE</span>
              </button>
              
              <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>

              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-100 transition-all shadow-sm active:scale-95"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <ProfileDropdown 
                  user={user}
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onLogout={handleLogout}
                  onSettings={() => setIsSettingsOpen(true)}
                />
              </div>
          </div>
        </header>

        {/* Board Meta / View Switcher */}
        <div className="px-8 pt-4 pb-0 flex items-center justify-between bg-white border-b border-slate-50 shrink-0">
           <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 border-b-2 border-indigo-600 pb-3 cursor-pointer transition-colors group">
                 <i className="fa-solid fa-columns-vertical text-sm text-indigo-600"></i>
                 <span className="text-sm font-black text-slate-900">Kanban Board</span>
              </div>
              <div className="flex items-center space-x-2 pb-3 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors font-semibold group">
                 <i className="fa-solid fa-list-check text-sm group-hover:text-indigo-500"></i>
                 <span className="text-sm">Issues List</span>
              </div>
              <div className="flex items-center space-x-2 pb-3 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors font-semibold group">
                 <i className="fa-solid fa-calendar-day text-sm group-hover:text-indigo-500"></i>
                 <span className="text-sm">Timeline</span>
              </div>
           </div>
           
           <div className="flex items-center space-x-4 pb-3">
              <div className="flex -space-x-2 group">
                {USERS.map(u => (
                  <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-xl border-2 border-white shadow-sm hover:z-10 hover:-translate-y-1 transition-all cursor-pointer ring-1 ring-slate-100" title={u.name} alt={u.name} />
                ))}
                <div className="w-8 h-8 rounded-xl bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 ring-1 ring-slate-100">+2</div>
              </div>
              <button className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all active:scale-95"><i className="fa-solid fa-ellipsis"></i></button>
           </div>
        </div>

        {/* NEW: Filter Bar */}
        <BoardFilters 
          selectedAssignees={selectedAssignees}
          setSelectedAssignees={setSelectedAssignees}
          selectedPriorities={selectedPriorities}
          setSelectedPriorities={setSelectedPriorities}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          onClear={clearFilters}
        />

        {/* The Board Canvas */}
        <div className="flex-1 overflow-x-auto p-8 flex space-x-8 bg-[#F8FAFC] custom-scrollbar">
          {columns.map(column => (
            <div 
              key={column.id}
              className="flex-shrink-0 w-[320px] flex flex-col h-full group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-6 px-3 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <i className={`${column.icon} text-sm`}></i>
                  <h3 className="text-sm font-black text-slate-700 tracking-tight">{column.title}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/50 text-slate-500 text-[10px] font-black">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                   <button 
                     onClick={() => openCreateModal(column.id)}
                     className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                     title={`Add issue to ${column.title}`}
                   >
                     <i className="fa-solid fa-plus text-[10px]"></i>
                   </button>
                </div>
              </div>

              {/* Task Stack */}
              <div className="flex-1 overflow-y-auto space-y-4 px-1.5 custom-scrollbar pb-10">
                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onEdit={(t) => { setSelectedTask(t); setIsModalOpen(true); }} 
                    />
                  ))
                }
                
                {/* Empty State / Add Task Placeholder */}
                <button 
                  onClick={() => openCreateModal(column.id)}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center space-y-2 group/add active:scale-[0.99]"
                >
                  <i className="fa-solid fa-plus text-xs group-hover/add:scale-125 transition-transform"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Issue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Overlays */}
      {isSettingsOpen && org && (
        <SettingsUI 
          user={user} 
          project={project} 
          org={org} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      <TaskModal 
        isOpen={isModalOpen}
        task={selectedTask}
        projectKey={project.key}
        currentUser={user}
        onClose={() => setIsModalOpen(false)}
        onSave={saveTask}
        onDelete={deleteTask}
      />
    </div>
  );
};

export default App;