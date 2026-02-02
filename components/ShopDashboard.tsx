
import React, { useState, useMemo } from 'react';
import { Shop, Product, Order, OrderStatus, ShopCategory } from '../types';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  XCircle, 
  Plus, 
  Trash2, 
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  User,
  UtensilsCrossed,
  Truck,
  Image as ImageIcon,
  Tag,
  Hash,
  Info,
  Layers,
  Zap,
  Boxes,
  Activity,
  Calendar,
  Settings2,
  FileText,
  MousePointer2,
  Target,
  Sparkles,
  ShoppingBasket,
  Flame,
  Smartphone,
  Edit2
} from 'lucide-react';

interface ShopDashboardProps {
  view: string;
  shop: Shop;
  products: Product[];
  orders: Order[];
  onUpdateOrder: (id: string, status: OrderStatus, reason?: string) => void;
  onDeleteOrder: (id: string) => void;
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
}

const ShopDashboard: React.FC<ShopDashboardProps> = ({ 
  view, 
  shop, 
  products, 
  orders, 
  onUpdateOrder, 
  onDeleteOrder,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct 
}) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    image: '',
    mrp: 0,
    discount: 0,
    price: 0,
    stock: 0,
    isEnabled: true,
    isVeg: true,
    customizationAvailable: false,
    requiresPrescription: false,
    isReturnable: false,
    unitType: 'kg',
    preparationTime: 15,
  });

  const categoryTheme = useMemo(() => {
    switch (shop.category) {
      case ShopCategory.FOOD: return { primary: 'indigo', accent: 'rose', gradient: 'from-orange-500 to-rose-500' };
      case ShopCategory.GROCERY: return { primary: 'emerald', accent: 'teal', gradient: 'from-emerald-500 to-teal-500' };
      case ShopCategory.PHARMACY: return { primary: 'sky', accent: 'blue', gradient: 'from-sky-500 to-indigo-500' };
      case ShopCategory.ELECTRONICS: return { primary: 'violet', accent: 'purple', gradient: 'from-violet-600 to-indigo-600' };
      case ShopCategory.COSMETICS: return { primary: 'pink', accent: 'rose', gradient: 'from-pink-500 to-rose-400' };
      default: return { primary: 'slate', accent: 'slate', gradient: 'from-slate-600 to-slate-800' };
    }
  }, [shop.category]);

  const sellingPrice = useMemo(() => {
    const mrp = formData.mrp || 0;
    const discount = formData.discount || 0;
    return Math.max(0, mrp - discount);
  }, [formData.mrp, formData.discount]);

  const activeOrders = orders.filter(o => ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(o.status));
  const dailyEarnings = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Incoming Traffic", value: orders.length, icon: <ShoppingBag size={22}/>, gradient: 'from-blue-500 to-indigo-600' },
    { label: "Net Revenue", value: `₹${dailyEarnings.toLocaleString('en-IN')}`, icon: <TrendingUp size={22}/>, gradient: 'from-emerald-500 to-teal-600' },
    { label: "Active Pipeline", value: activeOrders.length, icon: <Activity size={22}/>, gradient: 'from-orange-500 to-rose-600' },
  ];

  const getOrderStatusTheme = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.RECEIVED: return { color: 'rose', icon: <Sparkles size={14}/>, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' };
      case OrderStatus.ACCEPTED: return { color: 'indigo', icon: <CheckCircle2 size={14}/>, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' };
      case OrderStatus.PREPARING: return { color: 'amber', icon: <Flame size={14}/>, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' };
      case OrderStatus.READY_FOR_PICKUP: return { color: 'sky', icon: <Truck size={14}/>, bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' };
      case OrderStatus.COMPLETED: return { color: 'emerald', icon: <CheckCircle2 size={14}/>, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' };
      default: return { color: 'slate', icon: <Clock size={14}/>, bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' };
    }
  };

  const handleDeclineOrder = (orderId: string) => {
    const confirmed = window.confirm("ATTENTION: Once declined, the order is permanently removed. Proceed?");
    if (confirmed) onDeleteOrder(orderId);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowAddProduct(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', image: '', mrp: 0, discount: 0, price: 0, stock: 0, isEnabled: true,
      isVeg: true, customizationAvailable: false, requiresPrescription: false, isReturnable: false, unitType: 'kg', preparationTime: 15,
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  if (view === 'dashboard' || view === 'orders') {
    const displayOrders = view === 'dashboard' ? activeOrders : orders;

    return (
      <div className="space-y-8 animate-in fade-in duration-1000">
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="relative group overflow-hidden bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full`} />
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`p-5 bg-gradient-to-br ${stat.gradient} text-white rounded-3xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${categoryTheme.gradient} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {view === 'dashboard' ? 'Order Stream' : 'Order Archive'}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                  Managing {displayOrders.length} live requests
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayOrders.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-white border border-slate-100 rounded-[3.5rem] shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100">
                   <PackageCheck size={48} />
                </div>
                <h4 className="font-black text-slate-900 text-xl tracking-tight">Quiet on the front</h4>
                <p className="text-xs text-slate-400 mt-2 uppercase font-black tracking-[0.4em]">Ready and waiting</p>
              </div>
            ) : (
              displayOrders.map(order => {
                const theme = getOrderStatusTheme(order.status);
                return (
                  <div key={order.id} className={`bg-white rounded-[2.5rem] border ${theme.border} shadow-sm flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl group ${theme.bg}/30`}>
                    <div className={`h-1.5 w-full bg-gradient-to-r ${order.status === OrderStatus.RECEIVED ? 'from-rose-500 to-pink-500' : categoryTheme.gradient}`} />
                    
                    <div className="p-7 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${order.status === OrderStatus.RECEIVED ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`} />
                            <p className="text-[13px] font-black text-slate-900 leading-none">{order.customerName}</p>
                          </div>
                          <p className="text-[9px] font-black text-indigo-400/70 uppercase tracking-[0.1em]">ID: #{order.id.slice(-6)}</p>
                        </div>
                        <p className="text-sm font-black text-indigo-600">₹{order.total.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="space-y-2.5 mb-6 bg-white/60 backdrop-blur-sm p-5 rounded-3xl border border-white/50 flex-1 shadow-inner">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-3">
                              <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}</span>
                              <span className="line-clamp-1">{item.name}</span>
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={14} className="text-slate-300" />
                          {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${theme.border} ${theme.bg} ${theme.text} text-[9px] font-black uppercase tracking-widest`}>
                          {theme.icon}
                          {order.status}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.status === OrderStatus.RECEIVED && (
                          <div className="flex gap-2">
                            <button onClick={() => onUpdateOrder(order.id, OrderStatus.ACCEPTED)} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-[11px] rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all uppercase tracking-[0.1em] active:scale-95">Accept Order</button>
                            <button onClick={() => handleDeclineOrder(order.id)} className="px-5 py-4 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"><XCircle size={18} /></button>
                          </div>
                        )}
                        
                        {order.status === OrderStatus.ACCEPTED && (
                          <button onClick={() => onUpdateOrder(order.id, OrderStatus.PREPARING)} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[11px] rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest hover:shadow-xl transition-all shadow-amber-100">
                            <UtensilsCrossed size={16} /> Start Preparing
                          </button>
                        )}

                        {order.status === OrderStatus.PREPARING && (
                          <button onClick={() => onUpdateOrder(order.id, OrderStatus.READY_FOR_PICKUP)} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-black text-[11px] rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest hover:shadow-xl transition-all shadow-sky-100">
                            <Truck size={16} /> Mark as Ready
                          </button>
                        )}

                        {order.status === OrderStatus.READY_FOR_PICKUP && (
                          <button onClick={() => onUpdateOrder(order.id, OrderStatus.COMPLETED)} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-[11px] rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest hover:shadow-xl transition-all shadow-emerald-100">
                            <CheckCircle2 size={16} /> Hand Over
                          </button>
                        )}

                        {order.status === OrderStatus.COMPLETED && (
                          <div className="w-full py-4 flex items-center justify-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl">
                             <CheckCircle2 size={18} className="animate-bounce" />
                             <span className="font-black text-[11px] uppercase tracking-widest">Order Handled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'products') {
    return (
      <div className="space-y-8 animate-in fade-in duration-1000">
        <div className={`relative p-8 rounded-[3rem] border border-white/20 shadow-2xl shadow-indigo-200/50 overflow-hidden bg-gradient-to-br ${categoryTheme.gradient} text-white`}>
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Boxes size={180} />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-white/20 backdrop-blur-xl rounded-[2rem] shadow-lg">
                <Boxes size={42} />
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tight">Master Catalog</h3>
                <p className="text-[11px] text-white/70 uppercase font-black tracking-[0.4em] mt-2">Active Listings: {products.length} Products</p>
              </div>
            </div>
            <button onClick={() => setShowAddProduct(true)} className="px-10 py-5 bg-white text-slate-900 font-black text-sm rounded-3xl flex items-center gap-3 shadow-2xl hover:bg-slate-50 transition-all hover:-translate-y-2 active:scale-95 uppercase tracking-widest">
              <Plus size={20} className="text-indigo-600" /> New Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden group hover:shadow-2xl hover:border-indigo-200 transition-all duration-700 flex flex-col relative">
              <div className="h-44 overflow-hidden relative">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out" alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 flex flex-col gap-2">
                  <button onClick={() => handleEditProduct(product)} className="p-3 bg-white/90 backdrop-blur-md text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-200/50 border border-white/50"><Edit2 size={16}/></button>
                  <button onClick={() => onDeleteProduct(product.id)} className="p-3 bg-white/90 backdrop-blur-md text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-200/50 border border-white/50"><Trash2 size={16}/></button>
                </div>

                {product.discount > 0 && (
                  <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${categoryTheme.gradient} text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-black/10`}>
                    -{Math.round((product.discount/product.mrp)*100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                   <h5 className="font-black text-slate-900 text-sm truncate leading-tight group-hover:text-indigo-600 transition-colors duration-300">{product.name}</h5>
                   <div className="flex items-center gap-2 mt-2">
                     <span className={`px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest`}>{product.category}</span>
                   </div>
                </div>

                <div className="flex items-end gap-2.5 mt-auto">
                   <p className="text-xl font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>
                   {product.discount > 0 && <p className="text-[11px] text-slate-300 line-through mb-1">₹{product.mrp}</p>}
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${product.isEnabled ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.stock} Units</span>
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border ${product.isEnabled ? 'border-indigo-100 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                    {product.isEnabled ? 'Live' : 'Draft'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 md:p-12 bg-slate-900/80 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl relative animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] border border-white/20 overflow-hidden">
              <div className={`p-10 border-b border-white/10 flex items-center justify-between bg-gradient-to-r ${categoryTheme.gradient} text-white`}>
                 <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[2rem] shadow-xl flex items-center justify-center border border-white/30">
                     {editingProduct ? <Edit2 size={32} /> : <Plus size={32}/>}
                   </div>
                   <div>
                     <h4 className="text-3xl font-black tracking-tight">{editingProduct ? 'Modify Listing' : 'Create Listing'}</h4>
                     <p className="text-[11px] font-black text-white/70 uppercase tracking-[0.3em] mt-2">Niche: {shop.category} Marketplace</p>
                   </div>
                 </div>
                 <button onClick={resetForm} className="p-4 text-white hover:bg-white/20 transition-all rounded-full border border-white/20">
                   <XCircle size={32}/>
                 </button>
              </div>
              
              <div className="p-12 overflow-y-auto space-y-12 flex-1 scrollbar-hide">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1 space-y-8">
                    <div className="aspect-[4/5] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:bg-slate-100 transition-all relative">
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="text-center p-8">
                          <div className={`w-20 h-20 bg-gradient-to-br ${categoryTheme.gradient} text-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-200`}><ImageIcon size={32} /></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual preview will render here</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Image Cloud Source</label>
                      <input type="text" placeholder="https://cdn..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                      <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryTheme.gradient}`} /> Profile & Narrative
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Title</label>
                          <input type="text" placeholder="e.g. Organic Avocado Toast" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-sm transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contextual Description</label>
                          <textarea rows={3} placeholder="Tell the story of this product..." className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> Financial Strategy
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100">
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Base MRP</label>
                          <div className="relative">
                             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                             <input type="number" className="w-full pl-10 pr-6 py-5 bg-white border border-slate-200 rounded-2xl font-black text-sm outline-none focus:border-indigo-500" value={formData.mrp} onChange={e => setFormData({...formData, mrp: parseFloat(e.target.value) || 0})} />
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Net Rebate</label>
                          <div className="relative">
                             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                             <input type="number" className="w-full pl-10 pr-6 py-5 bg-white border border-slate-200 rounded-2xl font-black text-sm outline-none focus:border-indigo-500" value={formData.discount} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} />
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">Net Sale Price</label>
                          <div className={`w-full px-6 py-5 bg-gradient-to-r ${categoryTheme.gradient} text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center justify-center`}>
                            ₹{sellingPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                   <div className="space-y-8">
                      <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-violet-600" /> Inventory Logic
                      </h5>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Units in Stock</label>
                            <input type="number" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
                         </div>
                         <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Public Visibility</label>
                            <button onClick={() => setFormData({...formData, isEnabled: !formData.isEnabled})} className={`w-full py-5 rounded-2xl border-2 font-black text-[11px] uppercase tracking-widest transition-all ${formData.isEnabled ? `bg-white border-indigo-600 text-indigo-600` : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {formData.isEnabled ? 'Live on Store' : 'Draft Mode'}
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <h5 className={`text-[12px] font-black uppercase tracking-[0.3em] flex items-center gap-4 text-indigo-600`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryTheme.gradient}`} /> Category Settings
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         {shop.category === ShopCategory.FOOD && (
                           <>
                             <div className="space-y-2.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kitchen Time (m)</label>
                               <input type="number" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none" value={formData.preparationTime} onChange={e => setFormData({...formData, preparationTime: parseInt(e.target.value)})} />
                             </div>
                             <div className="space-y-2.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dietary Type</label>
                               <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                                 <button onClick={() => setFormData({...formData, isVeg: true})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.isVeg ? 'bg-white text-emerald-600 shadow-lg' : 'text-slate-400'}`}>Veg</button>
                                 <button onClick={() => setFormData({...formData, isVeg: false})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!formData.isVeg ? 'bg-white text-rose-600 shadow-lg' : 'text-slate-400'}`}>Non-Veg</button>
                               </div>
                             </div>
                           </>
                         )}
                         {shop.category === ShopCategory.GROCERY && (
                           <div className="space-y-2.5 col-span-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unit Measurement</label>
                             <select className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none" value={formData.unitType} onChange={e => setFormData({...formData, unitType: e.target.value})}>
                               <option value="kg">Kilograms (kg)</option><option value="litre">Litres (L)</option><option value="piece">Unit (pcs)</option><option value="pack">Pack (pk)</option>
                             </select>
                           </div>
                         )}
                         {!shop.category && <div className="p-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 col-span-2 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">General Product Context</div>}
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/80">
                 <button onClick={resetForm} className="px-12 py-6 bg-white border-2 border-slate-200 rounded-3xl font-black text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all uppercase tracking-widest text-xs">Cancel</button>
                 <button 
                   onClick={() => {
                     if (!formData.name || !formData.mrp) return alert("Title and MRP are required.");
                     
                     const productPayload = {
                       ...formData,
                       id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
                       shopId: shop.id,
                       category: shop.category,
                       price: sellingPrice,
                       image: formData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop',
                     } as Product;

                     if (editingProduct) {
                       onUpdateProduct(productPayload);
                     } else {
                       onAddProduct(productPayload);
                     }
                     resetForm();
                   }}
                   className={`flex-1 py-6 bg-gradient-to-r ${categoryTheme.gradient} text-white font-black rounded-3xl shadow-2xl shadow-indigo-200 hover:shadow-indigo-400 transition-all active:scale-[0.98] uppercase tracking-[0.3em] text-xs`}
                 >
                   {editingProduct ? 'Update Product Details' : 'Deploy to Storefront'}
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div>Shop Section: {view}</div>;
};

export default ShopDashboard;
