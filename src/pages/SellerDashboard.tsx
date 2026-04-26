import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore, StorePhone } from '../contexts/StoreContext';
import { Plus, Edit2, Trash2, Tag, Smartphone, BarChart3, TrendingUp, Star, Package } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { phones, addPhone, updatePhone, deletePhone, orders } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = { brand: '', model: '', price: '', originalPrice: '', condition: 'New', color: 'Black', ram: '8GB', storage: '128GB', description: '', stock: '5' };
  const [newPhoneData, setNewPhoneData] = useState(initialFormState);

  if (!user || user.role !== 'seller') {
    return <div className="p-8 text-center">Access Denied. You must be a seller to view this page.</div>;
  }

  // Filter phones specific to this seller
  const sellerPhones = phones.filter(p => p.sellerId === user.id);
  
  // Calculate dynamic stats
  const sellerListedCount = sellerPhones.length;
  // In a real app we'd map orders to seller's products, here we'll mock based on overall orders
  // just for the prototype, or we could actually filter:
  const ordersWithSellerProducts = orders.filter(o => o.items.some(item => item.phone.sellerId === user.id));
  const totalRevenue = ordersWithSellerProducts.reduce((acc, order) => {
    return acc + order.items
      .filter(item => item.phone.sellerId === user.id)
      .reduce((iAcc, item) => iAcc + (item.variant.price * item.quantity), 0);
  }, 0);

  const handleEditClick = (phone: StorePhone) => {
    setEditingId(phone.id);
    setNewPhoneData({
      brand: phone.brand,
      model: phone.model,
      price: phone.price.toString(),
      originalPrice: phone.originalPrice?.toString() || '',
      condition: phone.condition,
      color: phone.variants[0]?.color || 'Black',
      ram: phone.features.find(f => f.includes('RAM'))?.split(' ')[0] || '8GB',
      storage: phone.variants[0]?.storage || '128GB',
      description: phone.description || '',
      stock: phone.variants[0]?.stock?.toString() || '5',
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingId(null);
    setNewPhoneData(initialFormState);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert originalPrice safely format, if it's less than regular price or empty, null it out
    const currentPrice = Number(newPhoneData.price) || 499;
    let oldPrice = Number(newPhoneData.originalPrice);
    if (!oldPrice || oldPrice <= currentPrice) oldPrice = 0;
    
    const badges = [];
    if (oldPrice > currentPrice) {
      badges.push('Flash Sale');
    }

    if (editingId) {
      const existingPhone = sellerPhones.find(p => p.id === editingId);
      if (existingPhone) {
        updatePhone({
          ...existingPhone,
          brand: newPhoneData.brand || 'Custom',
          model: newPhoneData.model || 'New Listed Phone',
          description: newPhoneData.description || 'A great device listed by you.',
          price: currentPrice,
          originalPrice: oldPrice > 0 ? oldPrice : undefined,
          condition: newPhoneData.condition as 'New' | 'Like New' | 'Used',
          badges: badges,
          features: [existingPhone.features[0], `${newPhoneData.ram} RAM`],
          variants: [{ 
            ...existingPhone.variants[0],
            color: newPhoneData.color || 'Black', 
            storage: newPhoneData.storage || '128GB', 
            price: currentPrice,
            stock: parseInt(newPhoneData.stock) || 5
          }],
        });
      }
    } else {
      const newPhone: StorePhone = {
        id: 'sp' + Math.random(),
        brand: newPhoneData.brand || 'Custom',
        model: newPhoneData.model || 'New Listed Phone',
        description: newPhoneData.description || 'A great device listed by you.',
        shortDescription: 'Great value.',
        price: currentPrice,
        originalPrice: oldPrice > 0 ? oldPrice : undefined,
        images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1000'],
        features: ['Listed by Seller', `${newPhoneData.ram} RAM`],
        rating: 0,
        reviewsCount: 0,
        badges: badges,
        condition: newPhoneData.condition as 'New' | 'Like New' | 'Used',
        variants: [{ 
          id: 'v1', 
          color: newPhoneData.color || 'Black', 
          colorHex: '#000', 
          storage: newPhoneData.storage || '128GB', 
          price: currentPrice, 
          stock: parseInt(newPhoneData.stock) || 5 
        }],
        reviews: [],
        sellerId: user.id
      };
      addPhone(newPhone);
    }
    
    setShowAddForm(false);
    setEditingId(null);
    setNewPhoneData(initialFormState);
  };

  return (
    <div className="min-h-screen bg-paper pb-20">
      <div className="bg-ink text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl mb-4">Seller Dashboard</h1>
          <p className="font-mono text-white/70">Manage your store, track revenue, and update listings.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp },
            { label: 'Orders This Month', value: ordersWithSellerProducts.length.toString(), icon: Package },
            { label: 'Active Listings', value: sellerListedCount.toString(), icon: Smartphone },
            { label: 'Store Rating', value: '4.8', icon: Star },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-ink/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center shrink-0">
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/50 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Products Management */}
        <div className="bg-white rounded-3xl border border-ink/5 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-serif">Your Products</h2>
            <button 
              onClick={() => {
                cancelEdit();
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-accent/90 transition-colors"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="bg-paper p-6 rounded-2xl mb-8 border border-ink/10">
              <h3 className="font-semibold mb-4 border-b border-ink/10 pb-2">{editingId ? 'Edit Product' : 'Add a Product'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Brand</label>
                  <input type="text" value={newPhoneData.brand} onChange={e => setNewPhoneData({...newPhoneData, brand: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" placeholder="e.g. Apple" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Model</label>
                  <input type="text" value={newPhoneData.model} onChange={e => setNewPhoneData({...newPhoneData, model: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" placeholder="e.g. iPhone 15" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Current Price ($)</label>
                  <input type="number" value={newPhoneData.price} onChange={e => setNewPhoneData({...newPhoneData, price: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" placeholder="999" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/80 font-bold mb-1">Old Price ($) / Discount</label>
                  <input type="number" value={newPhoneData.originalPrice} onChange={e => setNewPhoneData({...newPhoneData, originalPrice: e.target.value})} className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 placeholder:text-indigo-300" placeholder="e.g. 1199" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Condition</label>
                  <select value={newPhoneData.condition} onChange={e => setNewPhoneData({...newPhoneData, condition: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" required>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Color</label>
                  <input type="text" value={newPhoneData.color} onChange={e => setNewPhoneData({...newPhoneData, color: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" placeholder="e.g. Space Black" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">RAM</label>
                  <select value={newPhoneData.ram} onChange={e => setNewPhoneData({...newPhoneData, ram: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" required>
                    <option value="4GB">4GB</option>
                    <option value="6GB">6GB</option>
                    <option value="8GB">8GB</option>
                    <option value="12GB">12GB</option>
                    <option value="16GB">16GB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Storage</label>
                  <select value={newPhoneData.storage} onChange={e => setNewPhoneData({...newPhoneData, storage: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" required>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Stock</label>
                  <input type="number" value={newPhoneData.stock} onChange={e => setNewPhoneData({...newPhoneData, stock: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2" placeholder="e.g. 5" required />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-xs uppercase font-mono tracking-widest text-ink/60 mb-1">Description</label>
                  <textarea value={newPhoneData.description} onChange={e => setNewPhoneData({...newPhoneData, description: e.target.value})} className="w-full bg-white border border-ink/10 rounded-xl px-4 py-2 min-h-[100px]" placeholder="Key features and details..."></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={cancelEdit} className="px-5 py-2 text-sm rounded-full border border-ink/20 hover:bg-white">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm bg-ink text-white rounded-full hover:bg-ink/90">{editingId ? 'Update Listing' : 'Publish Listing'}</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 font-mono text-xs uppercase tracking-widest text-ink/50">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold">Condition</th>
                  <th className="pb-4 font-semibold">Price</th>
                  <th className="pb-4 font-semibold">Stock</th>
                  <th className="pb-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {sellerPhones.map(phone => (
                  <tr key={phone.id} className="hover:bg-paper/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-paper rounded-lg p-1 shrink-0">
                          <img src={phone.images[0]} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{phone.model}</p>
                          <p className="text-xs text-ink/60">{phone.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="bg-ink/5 px-2 py-1 rounded text-xs font-semibold">{phone.condition}</span>
                    </td>
                    <td className="py-4 font-mono">${phone.price}</td>
                    <td className="py-4">{phone.variants[0]?.stock || 0} units</td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(phone)}
                          className="p-2 text-ink/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors" 
                          title="Edit Listing"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deletePhone(phone.id)}
                          className="p-2 text-ink/50 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
      </div>
    </div>
  );
}