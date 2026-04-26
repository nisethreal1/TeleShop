import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { ShieldAlert, Users, Package, Trash2, Shield, UserX, Store, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { phones, deletePhone, users, deleteUser, orders } = useStore();
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'overview'>('overview');

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 flex items-center justify-center gap-2"><ShieldAlert /> Access Denied. Admin privileges required.</div>;
  }

  const platformRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="min-h-screen bg-paper pb-20">
      <div className="bg-ink text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-accent" size={28} />
            <h1 className="font-serif text-4xl">Admin Control Center</h1>
          </div>
          <p className="font-mono text-white/70">Manage platform users, roles, and global product catalog.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-ink/10 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-ink text-white' : 'hover:bg-ink/5'}`}
          >
            <BarChart3 size={18} /> Platform Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-ink text-white' : 'hover:bg-ink/5'}`}
          >
            <Users size={18} /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-ink text-white' : 'hover:bg-ink/5'}`}
          >
            <Package size={18} /> Moderate Products
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl border border-ink/5 p-6 md:p-8">
          
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">System Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-paper p-6 rounded-3xl border border-ink/5">
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/50 mb-1">Total Users</p>
                  <p className="text-3xl font-semibold">{users.length}</p>
                </div>
                <div className="bg-paper p-6 rounded-3xl border border-ink/5">
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/50 mb-1">Listed Products</p>
                  <p className="text-3xl font-semibold">{phones.length}</p>
                </div>
                <div className="bg-paper p-6 rounded-3xl border border-ink/5">
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/50 mb-1">Total Orders</p>
                  <p className="text-3xl font-semibold">{orders.length}</p>
                </div>
                <div className="bg-paper p-6 rounded-3xl border border-ink/5">
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/50 mb-1">Platform Revenue</p>
                  <p className="text-3xl font-semibold text-emerald-600">${platformRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Registered Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 font-mono text-xs uppercase tracking-widest text-ink/50">
                      <th className="pb-4 font-semibold">User</th>
                      <th className="pb-4 font-semibold">Username</th>
                      <th className="pb-4 font-semibold">Role</th>
                      <th className="pb-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-paper/50 transition-colors">
                        <td className="py-4 font-medium">{u.name}</td>
                        <td className="py-4 text-ink/70">@{u.username || 'unknown'}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-500/10 text-red-600' :
                            u.role === 'seller' ? 'bg-accent/10 text-accent' :
                            'bg-ink/5 text-ink/70'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                             {/* Cannot delete oneself for safety in standard apps, handling gracefully here */}
                             {u.id !== user.id && (
                               <button 
                                 onClick={() => deleteUser(u.id)}
                                 className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-full transition-colors font-medium border border-red-100"
                               >
                                 <UserX size={14} /> Ban
                               </button>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Global Product Catalog</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 font-mono text-xs uppercase tracking-widest text-ink/50">
                      <th className="pb-4 font-semibold">Product</th>
                      <th className="pb-4 font-semibold">Lister Status</th>
                      <th className="pb-4 font-semibold">Price</th>
                      <th className="pb-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {phones.map(phone => (
                      <tr key={phone.id} className="hover:bg-paper/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-paper rounded p-1 shrink-0">
                               <img src={phone.images[0]} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                            </div>
                            <span className="font-semibold text-ink">{phone.brand} {phone.model}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-flex font-medium border border-emerald-100">
                             <Store size={12} /> Approved
                          </span>
                        </td>
                        <td className="py-4 font-mono">${phone.price}</td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => deletePhone(phone.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
