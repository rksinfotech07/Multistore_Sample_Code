
import React, { useState } from 'react';
import { ShopCategory } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2,
  Info,
  ShieldCheck,
  Building2,
  CalendarDays
} from 'lucide-react';

interface ShopRegistrationProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const ShopRegistration: React.FC<ShopRegistrationProps> = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    password: '',
    category: ShopCategory.FOOD,
    contact: '',
    address: '',
    openTime: '09:00',
    closeTime: '21:00'
  });

  const totalSteps = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
    } else {
      onSubmit(formData);
    }
  };

  const renderProgress = () => (
    <div className="mb-10">
      <div className="flex justify-between mb-3 px-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
            step >= i ? 'text-indigo-600' : 'text-slate-400'
          }`}>
            {i === 1 ? 'Shop Info' : i === 2 ? 'Account' : i === 3 ? 'Operations' : 'Confirm'}
          </span>
        ))}
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-6 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Login
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Branding */}
            <div className="bg-slate-900 md:w-72 p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-8">N</div>
                <h2 className="text-3xl font-black leading-tight tracking-tight">Begin Your Journey.</h2>
                <p className="text-slate-400 mt-4 text-sm font-medium leading-relaxed">
                  Join 1,000+ local businesses scaling their reach with Nexus.
                </p>
              </div>
              
              <div className="mt-12 space-y-6 relative z-10">
                <div className="flex items-center gap-4 group">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${step >= 1 ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700'}`}>
                    <Building2 size={14} className={step >= 1 ? 'text-indigo-400' : 'text-slate-600'} />
                  </div>
                  <span className={`text-xs font-bold transition-colors ${step >= 1 ? 'text-white' : 'text-slate-600'}`}>Business Profile</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${step >= 2 ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700'}`}>
                    <ShieldCheck size={14} className={step >= 2 ? 'text-indigo-400' : 'text-slate-600'} />
                  </div>
                  <span className={`text-xs font-bold transition-colors ${step >= 2 ? 'text-white' : 'text-slate-600'}`}>Secure Account</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${step >= 3 ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700'}`}>
                    <CalendarDays size={14} className={step >= 3 ? 'text-indigo-400' : 'text-slate-600'} />
                  </div>
                  <span className={`text-xs font-bold transition-colors ${step >= 3 ? 'text-white' : 'text-slate-600'}`}>Operations</span>
                </div>
              </div>
            </div>

            {/* Main Form Content */}
            <div className="flex-1 p-8 md:p-12">
              {renderProgress()}

              <form onSubmit={handleSubmit} className="space-y-8 min-h-[400px] flex flex-col justify-between">
                <div className="transition-all duration-300 transform">
                  {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                      <header>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tell us about your shop</h3>
                        <p className="text-slate-500 text-sm mt-1">This information will be visible to your future customers.</p>
                      </header>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Shop Name</label>
                          <div className="relative group">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                              type="text" required value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                              placeholder="e.g. Urban Grocers"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                          <div className="relative">
                            <select 
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value as ShopCategory})}
                              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none cursor-pointer font-medium appearance-none"
                            >
                              {Object.values(ShopCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <ArrowRight size={16} className="rotate-90" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Contact</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                              type="tel" required value={formData.contact}
                              onChange={(e) => setFormData({...formData, contact: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                      <header>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security & Ownership</h3>
                        <p className="text-slate-500 text-sm mt-1">Set up the personal account used to manage your business.</p>
                      </header>

                      <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                              type="text" required value={formData.ownerName}
                              onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                              placeholder="e.g. Sarah Jenkins"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                              type="email" required value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                              placeholder="sarah@urban-grocers.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                              type="password" required value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                              placeholder="••••••••••••"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                      <header>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Location & Hours</h3>
                        <p className="text-slate-500 text-sm mt-1">Help us direct customers and delivery partners to your door.</p>
                      </header>

                      <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Physical Address</label>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                              type="text" required value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                              placeholder="123 Market Square, Downtown"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Opens At</label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                type="time" required value={formData.openTime}
                                onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Closes At</label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                type="time" required value={formData.closeTime}
                                onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
                      <header className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Everything looks great!</h3>
                        <p className="text-slate-500 text-sm mt-1">Review your shop card preview before submitting for approval.</p>
                      </header>

                      {/* Shop Card Preview */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden group max-w-sm mx-auto">
                        <div className="absolute top-0 right-0 p-3">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black rounded-full uppercase tracking-widest">Reviewing</span>
                        </div>
                        <div className="w-full h-32 bg-slate-100 rounded-2xl mb-4 flex items-center justify-center text-slate-300">
                          <Store size={48} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900">{formData.name || 'Your Shop Name'}</h4>
                        <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-tighter">{formData.category}</p>
                        <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                          <MapPin size={12} />
                          <span className="truncate">{formData.address || 'Address not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Clock size={12} />
                          <span>{formData.openTime} - {formData.closeTime}</span>
                        </div>
                      </div>

                      <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex gap-4">
                        <div className="text-indigo-600 shrink-0 mt-1">
                          <Info size={18} />
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          Our team usually reviews new shop applications within <strong className="text-indigo-700">24-48 hours</strong>. You will receive an email notification as soon as your shop is ready to go live.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-100">
                  {step > 1 && (
                    <button 
                      type="button" onClick={prevStep}
                      className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                  )}
                  
                  <button 
                    type="submit"
                    className={`flex-1 py-4 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 group ${
                      step === totalSteps 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    }`}
                  >
                    {step === totalSteps ? (
                      <>Finish & Submit Application <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      <>Continue to {step === 1 ? 'Account' : step === 2 ? 'Operations' : 'Review'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
          Powered by Nexus Secure Marketplace Protocol
        </p>
      </div>
    </div>
  );
};

export default ShopRegistration;
