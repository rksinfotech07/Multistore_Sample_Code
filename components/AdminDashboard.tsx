
import React, { useState, useMemo } from 'react';
import { Shop, Order, User, ShopStatus, OrderStatus, ShopCategory } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Power, 
  AlertCircle, 
  ShoppingBag, 
  Users, 
  DollarSign,
  MapPin,
  Clock,
  Phone,
  Mail,
  User as UserIcon,
  X,
  Building2,
  Calendar,
  Layers,
  Activity,
  ExternalLink,
  ShieldCheck,
  ClipboardCheck
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  view: string;
  shops: Shop[];
  users: User[];
  orders: Order[];
  onUpdateShopStatus: (id: string, status: ShopStatus) => void;
  onForceToggleShop: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  view, 
  shops, 
  users, 
  orders, 
  onUpdateShopStatus, 
  onForceToggleShop 
}) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const pendingShops = shops.filter(s => s.status === ShopStatus.PENDING);
  const activeShops = shops.filter(s => s.status === ShopStatus.APPROVED);
  
  const totalRevenue = orders.reduce((sum, o) => o.status === OrderStatus.COMPLETED ? sum + o.total : sum, 0);

  const stats = [
    { label: 'Platform Capacity', value: shops.length, icon: <Users className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Active Streams', value: orders.filter(o => o.status !== OrderStatus.COMPLETED).length, icon: <Activity className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Audit Queue', value: pendingShops.length, icon: <AlertCircle className="text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Net Volume', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: <DollarSign className="text-indigo-600" />, bg: 'bg-indigo-50' },
  ];

  const getOwnerDetails = (ownerId: string) => {
    return users.find(u => u.id === ownerId) || { name: 'Unknown Partner', email: 'N/A' };
  };

  const getCategoryGradient = (category: ShopCategory) => {
    switch (category) {
      case ShopCategory.FOOD: return 'from-orange-500 to-rose-500';
      case ShopCategory.GROCERY: return 'from-emerald-500 to-teal-500';
      case ShopCategory.PHARMACY: return 'from-sky-500 to-indigo-500';
      case ShopCategory.ELECTRONICS: return 'from-violet-600 to-indigo-600';
      case ShopCategory.COSMETICS: return 'from-pink-500 to-rose-400';
      default: return 'from-slate-600 to-slate-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6 group hover:-translate-y-2 transition-all duration-500">
            <div className={`${stat.bg} p-5 rounded-2xl group-hover:rotate-6 transition-transform`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <div className="w-2 h-6 bg-indigo-600 rounded-full" /> Platform Performance
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orders.map(o => ({ date: o.createdAt.split('T')[0], amount: o.total }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} 
                />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
             <div className="w-2 h-6 bg-emerald-600 rounded-full" /> Flow Feed
          </h3>
          <div className="space-y-5">
            {orders.slice(0, 6).map(order => (
              <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xs">#{order.id.slice(-3)}</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-none">{order.customerName}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Transaction</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-sm">₹{order.total.toLocaleString('en-IN')}</p>
                  <span className={`px-2.5 py-1 text-[8px] font-black rounded-full uppercase tracking-widest mt-1.5 inline-block ${
                    order.status === OrderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShops = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      {pendingShops.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-[3.5rem] p-10 shadow-xl shadow-amber-200/20">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-amber-900 text-2xl font-black tracking-tight flex items-center gap-4">
                <AlertCircle size={28} className="text-amber-500" /> Pending Registry Audit
              </h3>
              <p className="text-amber-700/60 font-bold text-xs uppercase tracking-widest mt-2">New merchant requests awaiting authorization</p>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingShops.map(shop => {
              const owner = getOwnerDetails(shop.ownerId);
              return (
                <div key={shop.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[3rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className="flex justify-between items-start mb-6 relative">
                     <div>
                       <h4 className="font-black text-slate-900 text-xl leading-tight">{shop.name}</h4>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mt-3 inline-block border border-indigo-100">{shop.category}</span>
                     </div>
                     <div className="w-14 h-14 bg-white shadow-lg rounded-2xl flex items-center justify-center text-amber-500 border border-amber-50"><Building2 size={24}/></div>
                  </div>
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><UserIcon size={14} /></div>
                       <span className="text-xs font-black text-slate-600">{owner.name}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                       <span className="text-xs font-black text-slate-600">{shop.contact}</span>
                     </div>
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-slate-50">
                     <button 
                       onClick={() => setSelectedShop(shop)}
                       className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-[10px] rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                     >
                       <Eye size={16} /> Audit Profile
                     </button>
                     <button 
                       onClick={() => onUpdateShopStatus(shop.id, ShopStatus.APPROVED)}
                       className="flex-1 py-4 bg-emerald-500 text-white font-black text-[10px] rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all uppercase tracking-widest"
                     >
                       Approve
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
            <Layers size={28} className="text-indigo-500" /> Global Shop Ecosystem
          </h3>
          <div className="px-6 py-3 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Directory • {activeShops.length} Active</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-black tracking-[0.2em]">
                <th className="px-10 py-7">Partner Identity</th>
                <th className="px-10 py-7">Registry Status</th>
                <th className="px-10 py-7">Presence</th>
                <th className="px-10 py-7">Operational Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeShops.map(shop => (
                <tr key={shop.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryGradient(shop.category)} flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-6`}>
                        {shop.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{shop.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-black tracking-widest">{shop.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest ring-4 ring-emerald-50">
                      {shop.status}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      shop.isOnline ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${shop.isOnline ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
                      {shop.isOnline ? 'Broadcasting' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSelectedShop(shop)}
                        className="p-3.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100" 
                        title="View Full Profile"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => onForceToggleShop(shop.id)} 
                        className={`p-3.5 rounded-2xl transition-all ${shop.isOnline ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-50'}`} 
                        title="Override Access"
                      >
                        <Power size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden animate-in fade-in duration-700">
      <div className="p-10 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
           <ShoppingBag size={28} className="text-emerald-500" /> Platform-Wide Transmissions
        </h3>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-emerald-50 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600">Total Volume: ₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-black tracking-[0.2em]">
              <th className="px-10 py-7">Order Hash</th>
              <th className="px-10 py-7">Target Recipient</th>
              <th className="px-10 py-7">Value (INR)</th>
              <th className="px-10 py-7">Transmission Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 transition-all">
                <td className="px-10 py-7 font-mono font-black text-xs text-indigo-400">#{order.id}</td>
                <td className="px-10 py-7 font-black text-slate-900">{order.customerName}</td>
                <td className="px-10 py-7 font-black text-slate-900 tracking-tight text-lg">₹{order.total.toLocaleString('en-IN')}</td>
                <td className="px-10 py-7">
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded-full uppercase tracking-widest ring-4 ring-indigo-50/50">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Dynamic Content Switching */}
      {view === 'dashboard' && renderDashboard()}
      {view === 'shops' && renderShops()}
      {view === 'orders' && renderOrders()}
      {view === 'settings' && <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Global Platform Configuration</div>}

      {/* FULL SHOP DETAIL AUDIT MODAL */}
      {selectedShop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header with Shop Category Branding */}
            <div className={`p-12 bg-gradient-to-br ${getCategoryGradient(selectedShop.category)} text-white relative overflow-hidden`}>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <button 
                onClick={() => setSelectedShop(null)}
                className="absolute top-10 right-10 p-4 hover:bg-white/20 rounded-2xl transition-all border border-white/20 shadow-xl"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-slate-900 shadow-2xl font-black text-6xl uppercase border-8 border-white/20 ring-1 ring-white/10 transition-transform hover:rotate-6">
                  {selectedShop.name.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      {selectedShop.category} Partner
                    </span>
                    <div className={`w-3 h-3 rounded-full ${selectedShop.isOnline ? 'bg-emerald-400 animate-ping' : 'bg-white/30'}`} />
                  </div>
                  <h3 className="text-5xl font-black tracking-tighter leading-none">{selectedShop.name}</h3>
                  <p className="text-white/60 font-black text-xs uppercase tracking-[0.3em] mt-4">Merchant Intelligence Dossier</p>
                </div>
              </div>
            </div>

            {/* Audit Content Body */}
            <div className="p-12 space-y-12 max-h-[60vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
              <section className="space-y-8">
                <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-indigo-500`} /> Partner Identity Profile
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <DetailItem icon={<UserIcon size={22}/>} label="Merchant Lead" value={getOwnerDetails(selectedShop.ownerId).name} />
                  <DetailItem icon={<Mail size={22}/>} label="Verified Email" value={getOwnerDetails(selectedShop.ownerId).email} />
                  <DetailItem icon={<Phone size={22}/>} label="Merchant Direct Line" value={selectedShop.contact} />
                  <DetailItem icon={<Calendar size={22}/>} label="Platform Onboarding" value={new Date(selectedShop.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                </div>
              </section>

              <section className="space-y-8">
                <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500`} /> Logistics & Operations
                </h5>
                <div className="grid grid-cols-1 gap-10">
                   <DetailItem icon={<MapPin size={22}/>} label="Registered Operational Address" value={selectedShop.location.address} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <DetailItem icon={<Clock size={22}/>} label="Daily Operating Window" value={`${selectedShop.timing.open} - ${selectedShop.timing.close}`} />
                      <DetailItem icon={<ShieldCheck size={22}/>} label="Internal System ID" value={selectedShop.id} />
                   </div>
                </div>
              </section>

              <section className="space-y-8">
                <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-amber-500`} /> Registry Governance
                </h5>
                <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Standing</p>
                     <div className="flex items-center gap-3">
                       <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         selectedShop.status === ShopStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 
                         selectedShop.status === ShopStatus.REJECTED ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {selectedShop.status}
                       </span>
                       <span className={`text-[11px] font-bold ${selectedShop.isOnline ? 'text-indigo-600' : 'text-slate-400'}`}>
                         {selectedShop.isOnline ? 'Currently Broadcasting' : 'Offline/Inactive'}
                       </span>
                     </div>
                   </div>
                   <ClipboardCheck size={32} className="text-slate-100" />
                </div>
              </section>

              {selectedShop.status === ShopStatus.PENDING && (
                <div className="flex gap-6 pt-10">
                   <button 
                     onClick={() => onUpdateShopStatus(selectedShop.id, ShopStatus.REJECTED)}
                     className="flex-1 py-6 bg-white border-2 border-slate-200 text-slate-400 font-black rounded-[2rem] hover:text-rose-500 hover:border-rose-200 transition-all uppercase tracking-widest text-xs"
                   >
                     Deny Access
                   </button>
                   <button 
                     onClick={() => {
                       onUpdateShopStatus(selectedShop.id, ShopStatus.APPROVED);
                       setSelectedShop(null);
                     }}
                     className="flex-[2.5] py-6 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-200 hover:shadow-indigo-400 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                   >
                     <ShieldCheck size={20} /> Authorize Merchant
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-6 group">
    <div className="p-5 bg-white rounded-2xl shadow-sm text-indigo-500 border border-slate-100 transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:border-indigo-100">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">{label}</p>
      <span className="text-[15px] font-black text-slate-800 tracking-tight leading-relaxed block break-words">{value}</span>
    </div>
  </div>
);

export default AdminDashboard;
