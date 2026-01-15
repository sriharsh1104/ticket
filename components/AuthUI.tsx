import React, { useState } from 'react';
import { AuthSubView } from '../types';

interface AuthUIProps {
  view: AuthSubView;
  setView: (view: AuthSubView) => void;
  onSuccess: (email: string) => void;
}

export const AuthUI: React.FC<AuthUIProps> = ({ view, setView, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSuccess(email || 'demo@user.com');
      setIsLoading(false);
    }, 1000);
  };

  const GoogleBtn = () => (
    <button 
      onClick={() => onSuccess('google-user@gmail.com')}
      className="w-full flex items-center justify-center space-x-3 border border-slate-200 py-3 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600 mt-6 shadow-sm active:scale-95"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
      <span>Continue with Google</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white px-10 py-12 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.08)] border border-slate-100">
          <div className="flex justify-center mb-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-100">P</div>
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 text-center mb-8 tracking-tight">
            {view === 'LOGIN' && 'Welcome back'}
            {view === 'SIGNUP' && 'Create your workspace'}
            {view === 'FORGOT_PASSWORD' && 'Recover account'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {view !== 'FORGOT_PASSWORD' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner animate-spin text-lg"></i>
              ) : (
                <span>{view === 'LOGIN' ? 'LOG IN' : view === 'SIGNUP' ? 'SIGN UP' : 'RECOVER'}</span>
              )}
            </button>
          </form>

          {view !== 'FORGOT_PASSWORD' && (
            <>
              <div className="relative my-10 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with</span>
              </div>
              <GoogleBtn />
            </>
          )}

          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col items-center space-y-4">
            {view === 'LOGIN' ? (
              <>
                <button onClick={() => setView('FORGOT_PASSWORD')} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Forgot password?</button>
                <div className="text-sm text-slate-500 font-medium">
                  New to PlaneClone? <button onClick={() => setView('SIGNUP')} className="font-black text-indigo-600 hover:underline underline-offset-4">Create account</button>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 font-medium">
                Already have an account? <button onClick={() => setView('LOGIN')} className="font-black text-indigo-600 hover:underline underline-offset-4">Log in</button>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-slate-400">
           <p className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-50">Secure Open Source Project Management</p>
           <div className="flex justify-center space-x-6 text-[10px] font-bold uppercase tracking-tighter">
             <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms</span>
             <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy</span>
             <span className="hover:text-slate-900 cursor-pointer transition-colors">Contact</span>
           </div>
        </footer>
      </div>
    </div>
  );
};