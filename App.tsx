
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Bell, 
  MapPin,
  Clock,
  Phone,
  X,
  Edit3,
  Save,
  User as UserIcon,
  Mail,
  Calendar,
  Zap,
  Lock,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { 
  User, 
  UserRole, 
  Shop, 
  ShopStatus, 
  Product, 
  Order, 
  OrderStatus,
  ShopCategory
} from './types';
import Login from './components/Login';
import ShopRegistration from './components/ShopRegistration';
import AdminDashboard from './components/AdminDashboard';
import ShopDashboard from './components/ShopDashboard';
import { initialShops, initialProducts, initialOrders } from './mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [view, setView] = useState<'login' | 'register' | 'dashboard' | 'shops' | 'products' | 'orders' | 'settings'>('login');
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [users, setUsers] = useState<User[]>([
    { id: 'admin-1', email: 'admin@nexus.com', role: UserRole.ADMIN, name: 'Admin User' },
    { id: 'user-2', email: 'owner@shop.com', role: UserRole.SHOP, name: 'suresh' }
  ]);
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Form state for editing profile
  const [editFormData, setEditFormData] = useState({
    shopName: '',
    ownerName: '',
    contact: '',
    address: '',
    openTime: '',
    closeTime: '',
    category: ShopCategory.FOOD
  });

  // Form state for changing password
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const categoryTheme = useMemo(() => {
    if (!currentUser) return { color: 'indigo', gradient: 'from-indigo-600 to-violet-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', headerText: 'text-slate-900' };
    
    if (currentUser.role === UserRole.ADMIN) {
      return { color: 'slate', gradient: 'from-slate-800 to-slate-900', light: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-200', headerText: 'text-slate-900' };
    }

    if (!currentShop) return { color: 'indigo', gradient: 'from-indigo-600 to-violet-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', headerText: 'text-white' };

    switch (currentShop.category) {
      case ShopCategory.FOOD: return { color: 'rose', gradient: 'from-orange-500 to-rose-500', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', headerText: 'text-white' };
      case ShopCategory.GROCERY: return { color: 'emerald', gradient: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', headerText: 'text-white' };
      case ShopCategory.PHARMACY: return { color: 'sky', gradient: 'from-sky-500 to-indigo-500', light: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', headerText: 'text-white' };
      case ShopCategory.ELECTRONICS: return { color: 'violet', gradient: 'from-violet-600 to-indigo-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', headerText: 'text-white' };
      case ShopCategory.COSMETICS: return { color: 'pink', gradient: 'from-pink-500 to-rose-400', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', headerText: 'text-white' };
      default: return { color: 'indigo', gradient: 'from-indigo-600 to-violet-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', headerText: 'text-white' };
    }
  }, [currentShop, currentUser]);

  useEffect(() => {
    if (showProfile && currentShop && currentUser) {
      setEditFormData({
        shopName: currentShop.name,
        ownerName: currentUser.name,
        contact: currentShop.contact,
        address: currentShop.location.address,
        openTime: currentShop.timing.open,
        closeTime: currentShop.timing.close,
        category: currentShop.category
      });
    }
  }, [showProfile, currentShop, currentUser]);

  const newOrderCount = useMemo(() => {
    if (currentUser?.role !== UserRole.SHOP || !currentShop) return 0;
    return orders.filter(o => o.shopId === currentShop.id && o.status === OrderStatus.RECEIVED).length;
  }, [orders, currentShop, currentUser]);

  const handleLogin = (user: User) => {
    if (user.role === UserRole.SHOP) {
      const shop = shops.find(s => s.ownerId === user.id);
      if (shop) {
        if (shop.status === ShopStatus.APPROVED) {
          setCurrentUser(user);
          setCurrentShop(shop);
          setView('dashboard');
        } else if (shop.status === ShopStatus.PENDING) {
          alert("Verification Pending: An admin needs to approve your shop before you can log in.");
        } else if (shop.status === ShopStatus.REJECTED) {
          alert(`Application Rejected: ${shop.rejectionReason || 'Policy Violation'}`);
        }
      } else {
        alert("Account error: No shop profile found for this owner.");
      }
    } else {
      setCurrentUser(user);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentShop(null);
    setShowProfile(false);
    setIsEditingProfile(false);
    setIsChangingPassword(false);
    setView('login');
  };

  const handleUpdateProfile = () => {
    if (!currentUser || !currentShop) return;

    // Update User
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, name: editFormData.ownerName } : u));
    setCurrentUser(prev => prev ? { ...prev, name: editFormData.ownerName } : null);

    // Update Shop
    const updatedShop = {
      ...currentShop,
      name: editFormData.shopName,
      contact: editFormData.contact,
      category: editFormData.category,
      location: { ...currentShop.location, address: editFormData.address },
      timing: { open: editFormData.openTime, close: editFormData.closeTime }
    };

    setShops(prev => prev.map(s => s.id === currentShop.id ? updatedShop : s));
    setCurrentShop(updatedShop);
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
  };

  const handleUpdatePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    // In a real app, we'd hash this. Here we just simulate success.
    alert("Password updated successfully! Next time you login, use your new security key.");
    setIsChangingPassword(false);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
  };

  const handleRegister = (newShopData: any) => {
    const newUserId = `user-${Date.now()}`;
    const newShopId = `shop-${Date.now()}`;
    
    const newShop: Shop = {
      id: newShopId,
      ownerId: newUserId,
      name: newShopData.name,
      category: newShopData.category,
      contact: newShopData.contact,
      location: { lat: 0, lng: 0, address: newShopData.address },
      timing: { open: newShopData.openTime, close: newShopData.closeTime },
      status: ShopStatus.PENDING, 
      isOnline: false,
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, { id: newUserId, email: newShopData.email, role: UserRole.SHOP, name: newShopData.ownerName }]);
    setShops(prev => [...prev, newShop]);
    
    alert("Application Submitted! An admin will review your shop details soon.");
    setView('login');
  };

  const updateShopStatus = (shopId: string, status: ShopStatus) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status } : s));
  };

  const toggleShopOnline = (shopId: string) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isOnline: !s.isOnline } : s));
    if (currentShop?.id === shopId) {
      setCurrentShop(prev => prev ? { ...prev, isOnline: !prev.isOnline } : null);
    }
  };

  const updateOrder = (orderId: string, status: OrderStatus, reason?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, rejectionReason: reason } : o));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const shopSpecificOrders = useMemo(() => {
    if (!currentShop) return [];
    return orders.filter(o => o.shopId === currentShop.id);
  }, [orders, currentShop]);

  const shopSpecificProducts = useMemo(() => {
    if (!currentShop) return [];
    return products.filter(p => p.shopId === currentShop.id);
  }, [products, currentShop]);

  if (view === 'login') return <Login users={users} onLogin={handleLogin} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <ShopRegistration onSubmit={handleRegister} onBack={() => setView('login')} />;

  const isShop = currentUser?.role === UserRole.SHOP;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {!isShop && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 shadow-2xl">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">N</div>
            <span className="text-xl font-bold tracking-tight">Nexus Admin</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavItem icon={<Store size={20}/>} label="Shops" active={view === 'shops'} onClick={() => setView('shops')} />
            <NavItem icon={<ShoppingCart size={20}/>} label="Orders" active={view === 'orders'} onClick={() => setView('orders')} />
            <NavItem icon={<Settings size={20}/>} label="Settings" active={view === 'settings'} onClick={() => setView('settings')} />
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>
      )}

      <main className={`flex-1 min-h-screen ${isShop ? 'w-full' : 'ml-64'}`}>
        <header className={`h-24 ${isShop ? `bg-gradient-to-r ${categoryTheme.gradient}` : 'bg-white/80 border-b border-slate-200'} flex items-center justify-between px-10 sticky top-0 z-40 shadow-xl backdrop-blur-md transition-all duration-500`}>
          <div className="flex items-center gap-5">
            {isShop ? (
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('dashboard')}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center font-bold text-white shadow-2xl ring-1 ring-white/30 transition-transform group-hover:rotate-12 duration-300">
                  <Zap size={22} fill="currentColor" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xl font-black text-white block leading-none tracking-tight">{currentShop?.name}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">{currentShop?.category} Merchant Portal</span>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight flex items-center gap-3">
                <div className="w-2 h-7 bg-indigo-600 rounded-full" />
                {view}
              </h2>
            )}
          </div>

          {isShop && (
            <nav className="flex items-center gap-2 bg-white/10 backdrop-blur-lg p-1.5 rounded-[1.5rem] border border-white/10 shadow-inner">
              <HeaderTab 
                active={view === 'dashboard'} 
                onClick={() => setView('dashboard')} 
                label="Overview" 
                theme={categoryTheme} 
                isShop={isShop}
              />
              <HeaderTab 
                active={view === 'orders'} 
                onClick={() => setView('orders')} 
                label="Orders" 
                theme={categoryTheme} 
                count={newOrderCount}
                isShop={isShop}
              />
              <HeaderTab 
                active={view === 'products'} 
                onClick={() => setView('products')} 
                label="Catalog" 
                theme={categoryTheme} 
                isShop={isShop}
              />
            </nav>
          )}

          <div className="flex items-center gap-6">
            {isShop && currentShop && (
              <div className="flex items-center gap-4 pr-6 border-r border-white/10">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                    Live Presence
                   </span>
                   <span className="text-[11px] font-bold text-white">{currentShop.isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <button 
                  onClick={() => toggleShopOnline(currentShop.id)} 
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-2xl ${currentShop.isOnline ? 'bg-white/30' : 'bg-black/20'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${currentShop.isOnline ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            )}
            
            <button className={`relative p-3 transition-all rounded-2xl hover:scale-110 ${isShop ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100'}`}>
              <Bell size={22} />
              {newOrderCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 ${isShop ? 'bg-white text-rose-500' : 'bg-indigo-600 text-white'} text-[9px] font-black rounded-full border-2 ${isShop ? 'border-transparent' : 'border-white'} flex items-center justify-center animate-bounce shadow-xl`}>
                  {newOrderCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-4 group"
            >
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-black leading-none transition-colors ${isShop ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'}`}>{currentUser?.name}</p>
                <p className={`text-[10px] mt-1.5 uppercase font-black tracking-[0.2em] ${isShop ? 'text-white/60' : 'text-slate-400'}`}>{currentUser?.role}</p>
              </div>
              <div className={`w-12 h-12 rounded-[1.3rem] flex items-center justify-center font-black text-xl border-2 transition-all duration-300 group-hover:scale-110 shadow-lg ${
                isShop 
                  ? 'bg-white text-indigo-600 border-white/20' 
                  : `${categoryTheme.light} ${categoryTheme.text} ${categoryTheme.border}`
              } uppercase`}>
                {currentUser?.name.charAt(0)}
              </div>
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {currentUser?.role === UserRole.ADMIN ? (
            <AdminDashboard 
              view={view} 
              shops={shops} 
              users={users}
              orders={orders} 
              onUpdateShopStatus={updateShopStatus} 
              onForceToggleShop={toggleShopOnline}
            />
          ) : (
            <ShopDashboard 
              view={view} 
              shop={currentShop!} 
              products={shopSpecificProducts}
              orders={shopSpecificOrders}
              onUpdateOrder={updateOrder}
              onDeleteOrder={deleteOrder}
              onAddProduct={(p) => setProducts(prev => [...prev, p])}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>

      {showProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className={`p-12 ${isShop ? `bg-gradient-to-br ${categoryTheme.gradient}` : 'bg-slate-900'} text-white relative overflow-hidden`}>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <button 
                onClick={() => { setShowProfile(false); setIsEditingProfile(false); setIsChangingPassword(false); }} 
                className="absolute top-8 right-8 p-4 hover:bg-white/20 rounded-2xl transition-all border border-white/20"
              >
                <X size={22} />
              </button>
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-900 shadow-2xl font-black text-4xl uppercase border-4 border-white/20">
                {currentShop?.name.charAt(0) || currentUser?.name.charAt(0)}
              </div>
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <h3 className="text-3xl font-black capitalize tracking-tight">
                    {isChangingPassword ? 'Security Key' : isEditingProfile ? 'Refine Profile' : (currentShop?.name || currentUser?.name)}
                  </h3>
                  <p className="text-white/70 font-bold text-sm uppercase tracking-widest mt-3">{currentUser?.email}</p>
                </div>
                {!isEditingProfile && !isChangingPassword && isShop && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-3 px-7 py-4 bg-white text-slate-900 hover:bg-slate-50 rounded-[1.5rem] font-black text-xs transition-all shadow-2xl active:scale-95 uppercase tracking-widest"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-12 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
              {isChangingPassword ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                    <ShieldCheck className="text-amber-600 shrink-0" />
                    <p className="text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tighter">Enter a strong new security key to protect your platform access.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">New Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                          type="password" 
                          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                          placeholder="••••••••"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Verify Password</label>
                      <div className="relative group">
                        <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                          type="password" 
                          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                          placeholder="••••••••"
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setIsChangingPassword(false)}
                      className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-3xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdatePassword}
                      className="flex-[2] py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      Update Security Key
                    </button>
                  </div>
                </div>
              ) : isEditingProfile ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Shop Branding</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                        value={editFormData.shopName}
                        onChange={e => setEditFormData({...editFormData, shopName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Merchant Name</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                        value={editFormData.ownerName}
                        onChange={e => setEditFormData({...editFormData, ownerName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Direct Contact</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                      value={editFormData.contact}
                      onChange={e => setEditFormData({...editFormData, contact: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Operational HQ</label>
                    <textarea 
                      className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none"
                      rows={2}
                      value={editFormData.address}
                      onChange={e => setEditFormData({...editFormData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Opening Window</label>
                      <input 
                        type="time" 
                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:border-indigo-500"
                        value={editFormData.openTime}
                        onChange={e => setEditFormData({...editFormData, openTime: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Closing Window</label>
                      <input 
                        type="time" 
                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-sm outline-none focus:border-indigo-500"
                        value={editFormData.closeTime}
                        onChange={e => setEditFormData({...editFormData, closeTime: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5 pt-8">
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdateProfile}
                      className={`flex-[2] py-6 bg-gradient-to-r ${categoryTheme.gradient} text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-200 hover:shadow-indigo-400 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs`}
                    >
                      <Save size={20} /> Deploy Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Permissions</p>
                      <p className="font-black text-slate-900">{currentUser?.role}</p>
                    </div>
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Registry State</p>
                      <p className={`font-black ${categoryTheme.text}`}>Active</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isShop && (
                      <div className="space-y-8 mt-4">
                        <ProfileField icon={<UserIcon size={20}/>} label="Primary Partner" value={currentUser?.name} theme={categoryTheme} />
                        <ProfileField icon={<MapPin size={20}/>} label="Warehouse Origin" value={currentShop?.location.address} theme={categoryTheme} />
                        <ProfileField icon={<Clock size={20}/>} label="Active Window" value={`${currentShop?.timing.open} - ${currentShop?.timing.close}`} theme={categoryTheme} />
                        <ProfileField icon={<Phone size={20}/>} label="Merchant Hot-line" value={currentShop?.contact} theme={categoryTheme} />
                      </div>
                    )}
                    
                    <div className="pt-4 flex flex-col gap-3">
                      <button 
                        onClick={() => setIsChangingPassword(true)}
                        className="w-full py-5 bg-slate-100 text-slate-900 font-black rounded-3xl hover:bg-slate-200 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px]"
                      >
                        <Lock size={18} /> Update Security Key
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full py-6 bg-rose-50 text-rose-600 font-black rounded-[2.5rem] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] shadow-inner"
                      >
                        <LogOut size={20}/> Terminate Session
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderTab: React.FC<{ active: boolean, onClick: () => void, label: string, theme: any, count?: number, isShop?: boolean }> = ({ active, onClick, label, theme, count, isShop }) => (
  <button 
    onClick={onClick}
    className={`px-7 py-3 rounded-[1.3rem] text-[11px] font-black transition-all duration-300 flex items-center gap-3 uppercase tracking-[0.15em] ${
      active 
        ? isShop 
          ? 'bg-white text-indigo-600 shadow-2xl scale-105' 
          : `bg-white ${theme.text} shadow-xl ring-1 ring-black/5`
        : isShop
          ? 'text-white/70 hover:text-white hover:bg-white/10'
          : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
    }`}
  >
    {label}
    {count !== undefined && count > 0 && (
      <span className={`w-5 h-5 ${isShop ? 'bg-rose-500' : `bg-gradient-to-r ${theme.gradient}`} text-white rounded-lg flex items-center justify-center text-[9px] font-black animate-pulse shadow-xl`}>
        {count}
      </span>
    )}
  </button>
);

const ProfileField: React.FC<{ icon: React.ReactNode, label: string, value: string | undefined, theme: any }> = ({ icon, label, value, theme }) => (
  <div className="flex items-center gap-6 group">
    <div className={`p-5 bg-white rounded-2xl shadow-sm ${theme.text} border border-slate-100 transition-all group-hover:scale-110 group-hover:shadow-lg`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{label}</p>
      <span className="text-sm font-black text-slate-800 tracking-tight">{value || 'Pending Setup'}</span>
    </div>
  </div>
);

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 w-full px-5 py-4 rounded-[1.3rem] transition-all duration-300 ${
      active 
        ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-12px_rgba(79,70,229,0.4)] scale-[1.02]' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    {icon}
    <span className="font-black text-xs tracking-[0.15em] uppercase">{label}</span>
  </button>
);

export default App;
