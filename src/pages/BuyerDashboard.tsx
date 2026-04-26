import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Package, Clock, Heart, Settings, MapPin, Trash2 } from 'lucide-react';
import { Address } from '../types';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { orders, addresses, addAddress, deleteAddress, wishlist, toggleWishlist, phones } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'saved' | 'addresses' | 'settings'>('orders');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  if (!user) {
    return <div className="p-8 text-center text-ink/60">Please login to view your dashboard.</div>;
  }

  const userOrders = orders.filter(o => o.userId === user.id);
  const userAddresses = addresses.filter(a => a.userId === user.id);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      id: 'addr_' + Math.random().toString(36).substring(7),
      userId: user.id,
      ...newAddress
    };
    addAddress(address);
    setShowAddAddress(false);
    setNewAddress({ fullName: '', phone: '', street: '', city: '', state: '', zip: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-end mb-12 border-b border-ink/10 pb-8">
        <div className="w-24 h-24 rounded-full bg-ink/10 overflow-hidden flex items-center justify-center shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-3xl font-serif text-ink">{user.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 className="font-serif text-4xl mb-2">Welcome back, {user.name}</h1>
          <p className="text-ink/60 font-mono">Role: {user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="col-span-1 space-y-2 font-medium">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-white border border-ink/10 text-accent shadow-sm' : 'hover:bg-paper text-ink/70 hover:text-ink'}`}
          >
            <Package size={18} /> My Orders
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'saved' ? 'bg-white border border-ink/10 text-accent shadow-sm' : 'hover:bg-paper text-ink/70 hover:text-ink'}`}
          >
            <Heart size={18} /> Saved Items
          </button>
          <button 
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'addresses' ? 'bg-white border border-ink/10 text-accent shadow-sm' : 'hover:bg-paper text-ink/70 hover:text-ink'}`}
          >
            <MapPin size={18} /> Addresses
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-white border border-ink/10 text-accent shadow-sm' : 'hover:bg-paper text-ink/70 hover:text-ink'}`}
          >
            <Settings size={18} /> Account Settings
          </button>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 space-y-8">
          {activeTab === 'orders' && (
          <section>
            <h2 className="text-xl font-bold mb-4 font-mono uppercase tracking-widest text-xs">Recent Orders</h2>
            
            {userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-white border border-ink/10 rounded-3xl p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-ink/60 mb-1">Order {order.id}</p>
                        <p className="text-xs text-ink/50">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-paper rounded-xl p-2 shrink-0">
                            <img src={item.phone.images[0]} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm sm:text-base">{item.phone.brand} {item.phone.model}</h4>
                            <p className="text-xs text-ink/60">Qty: {item.quantity} • {item.variant.color} • {item.variant.storage}</p>
                          </div>
                          <div className="font-mono font-medium">${item.variant.price * item.quantity}</div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-ink/5 mt-6 pt-4 flex justify-between items-center">
                      <span className="font-medium font-mono">Total: ${order.total.toFixed(2)}</span>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 text-sm border border-ink/10 rounded-full hover:bg-paper transition-colors">View Invoice</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-ink/10 rounded-3xl p-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock size={40} className="text-ink/20 mb-4" />
                  <h3 className="font-semibold mb-2">No recent orders</h3>
                  <p className="text-sm text-ink/60">When you buy a phone, you can track it here.</p>
                </div>
              </div>
            )}
          </section>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4 font-mono uppercase tracking-widest text-xs">Saved Items</h2>
              {wishlist.filter(w => w.userId === user.id).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.filter(w => w.userId === user.id).map(w => {
                    const phone = phones.find(p => p.id === w.phoneId);
                    if (!phone) return null;
                    return (
                      <div key={phone.id} className="relative group border border-ink/10 rounded-3xl p-5 bg-white flex flex-col hover:border-ink/20 transition-colors">
                        <Link to={`/product/${phone.id}`} className="aspect-[3/4] mb-4 relative overflow-hidden bg-paper rounded-2xl">
                          <img 
                            src={phone.images[0]} 
                            alt={phone.model} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(user.id, phone.id);
                          }}
                          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg text-red-500 hover:scale-110 transition-transform z-10"
                        >
                          <Heart size={18} fill="currentColor" />
                        </button>
                        <div className="flex flex-col flex-1">
                          <h3 className="font-semibold text-lg">{phone.brand} {phone.model}</h3>
                          <div className="flex items-center gap-3 mt-1 font-mono mt-auto pt-2">
                            <span className="font-bold text-accent">${phone.price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-ink/10 rounded-3xl p-12 text-center flex flex-col items-center">
                  <Heart size={48} className="text-ink/20 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No saved items</h3>
                  <p className="text-ink/60 mb-6">Items you heart will appear here.</p>
                  <Link to="/" className="px-6 py-3 bg-ink text-white rounded-full font-medium hover:bg-ink/90 transition-colors">Start Shopping</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white border border-ink/10 rounded-3xl p-6">
                <div>
                  <h3 className="font-semibold text-lg">Saved Addresses</h3>
                  <p className="text-sm text-ink/60">Manage your shipping and billing addresses.</p>
                </div>
                <button 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-5 py-2.5 bg-ink text-white rounded-full font-medium hover:bg-ink/90 transition-colors text-sm"
                >
                  {showAddAddress ? 'Cancel' : 'Add Address'}
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="bg-white border border-ink/10 rounded-3xl p-6 lg:p-8 animate-in fade-in slide-in-from-top-4">
                  <h4 className="font-semibold mb-6">Add New Shipping Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 mb-1">Full Name</label>
                      <input type="text" required value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 mb-1">Phone Number</label>
                      <input type="tel" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 mb-1">Street Address</label>
                      <input type="text" required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 mb-1">City</label>
                      <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 mb-1">State / Prov</label>
                        <input type="text" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 mb-1">Postal Code</label>
                        <input type="text" required value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors">
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {userAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAddresses.map(address => (
                    <div key={address.id} className="p-5 border border-ink/10 bg-white rounded-2xl relative group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                          <MapPin size={18} className="text-ink/60" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{address.fullName}</p>
                          <p className="text-sm text-ink/70 mt-1">{address.street}, {address.city}, {address.state} {address.zip}</p>
                          <p className="text-sm font-mono text-ink/50 mt-2">{address.phone}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteAddress(address.id)}
                        className="absolute top-4 right-4 p-2 text-ink/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : !showAddAddress && (
                <div className="bg-white border border-ink/10 rounded-3xl p-12 text-center">
                  <MapPin size={48} className="text-ink/20 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No saved addresses</h3>
                  <p className="text-ink/60">Add a shipping address for faster checkout.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-ink/10 rounded-3xl p-8">
              <h3 className="font-semibold text-lg mb-6 border-b border-ink/10 pb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-mono text-ink/50 mb-2">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-3 bg-paper rounded-xl border border-ink/10" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-mono text-ink/50 mb-2">Email</label>
                  <input type="email" defaultValue={user.email || ''} className="w-full px-4 py-3 bg-paper rounded-xl border border-ink/10" />
                </div>
              </div>
              <div className="mt-8">
                <button className="px-6 py-3 bg-ink text-white rounded-full font-medium hover:bg-ink/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
