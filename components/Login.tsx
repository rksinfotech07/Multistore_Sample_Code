
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Mail, Lock, LogIn, Store } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check against dynamic users list
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      alert("Invalid credentials. If you just registered, login as admin@nexus.com to approve your account first.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800/50">
        <div className="p-10 bg-indigo-600 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-900/20">
            <Store className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-indigo-100 mt-2 font-medium opacity-80">Sign in to manage your Nexus portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexus.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
            >
              <LogIn size={20} />
              Sign In to Dashboard
            </button>
          </div>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button 
            type="button"
            onClick={onGoToRegister}
            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
          >
            Become a Shop Owner
          </button>
        </form>
      </div>
      
      <div className="fixed bottom-6 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
        Nexus Commerce System v2.0
      </div>
    </div>
  );
};

export default Login;
