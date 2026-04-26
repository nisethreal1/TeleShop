import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, Phone, LogOut, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-ink/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center group-hover:bg-accent transition-colors">
                <Phone size={18} />
              </div>
              <span className="font-serif font-semibold text-xl tracking-tight">TeleShop</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm font-medium text-ink hover:text-accent transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-ink hover:text-accent transition-colors">Shop Phones</Link>
            <Link to="/shop?sale=true" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
              <span>Flash Sale</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-ink/70 hover:text-ink transition-colors"
            >
              {showSearch ? <X size={20} /> : <Search size={20} />}
            </button>
            
            {/* User Profile / Login */}
            <div className="relative hidden md:block">
              {user ? (
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-ink/10 hover:bg-white transition-colors"
                >
                  <span className="text-xs font-semibold pl-2 hidden sm:block">{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-ink/10 overflow-hidden flex items-center justify-center border border-ink/10">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={14} className="text-ink/60" />
                    )}
                  </div>
                </button>
              ) : (
                <Link to="/login" className="p-2 text-ink/70 hover:text-ink transition-colors flex items-center gap-2">
                  <User size={20} />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}

              {/* Dropdown */}
              {showDropdown && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-ink/5" onMouseLeave={() => setShowDropdown(false)}>
                  <div className="px-4 py-2 border-b border-ink/5 mb-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-ink/50 font-mono capitalize">@{user.username} • {user.role}</p>
                  </div>
                  {user.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setShowDropdown(false)} className="block px-4 py-2 text-sm text-ink/80 hover:bg-paper hover:text-ink transition-colors">Admin Dashboard</Link>
                  ) : user.role === 'seller' ? (
                    <Link to="/seller" onClick={() => setShowDropdown(false)} className="block px-4 py-2 text-sm text-ink/80 hover:bg-paper hover:text-ink transition-colors">Seller Dashboard</Link>
                  ) : (
                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="block px-4 py-2 text-sm text-ink/80 hover:bg-paper hover:text-ink transition-colors">Buyer Dashboard</Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 mt-2 border-t border-ink/5 pt-3"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {(!user || user.role === 'buyer') && (
              <Link to="/cart" className="p-2 text-ink hover:text-accent transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-ink/70 hover:text-ink transition-colors md:hidden"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Bar Dropdown */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-ink/10 py-4 px-4 shadow-lg animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input 
              type="text" 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for iPhones, Galaxy, Pixel..."
              className="w-full bg-paper pl-12 pr-4 py-3 rounded-full border border-ink/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono text-sm"
            />
          </form>
        </div>
      )}

      {/* Mobile Nav Overlay */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-ink/10 py-4 px-4 flex flex-col gap-4 shadow-xl">
          <Link to="/" onClick={() => setShowMobileMenu(false)} className="text-lg font-medium p-2 hover:bg-paper rounded-lg">Home</Link>
          <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="text-lg font-medium p-2 hover:bg-paper rounded-lg">Shop Phones</Link>
          <Link to="/shop?sale=true" onClick={() => setShowMobileMenu(false)} className="text-lg font-medium text-accent p-2 hover:bg-accent/5 rounded-lg">Flash Sale</Link>
          
          <div className="border-t border-ink/5 mt-2 pt-4">
            {user ? (
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3 p-2">
                   {user.avatar ? (
                      <img src={user.avatar} className="w-8 h-8 rounded-full" />
                   ) : (
                      <div className="w-8 h-8 bg-ink/10 rounded-full flex items-center justify-center"><User size={16}/></div>
                   )}
                   <span className="font-semibold">{user.name} <span className="text-xs text-ink/60 font-mono capitalize block">@{user.username} • {user.role}</span></span>
                 </div>
                 {user.role === 'admin' ? (
                   <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-paper rounded-lg text-ink/80 block">Admin Dashboard</Link>
                 ) : user.role === 'seller' ? (
                   <Link to="/seller" onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-paper rounded-lg text-ink/80 block">Seller Dashboard</Link>
                 ) : (
                   <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-paper rounded-lg text-ink/80 block">Buyer Dashboard</Link>
                 )}
                 <button onClick={() => { logout(); setShowMobileMenu(false); }} className="text-left p-2 text-red-500 hover:bg-red-50 rounded-lg w-full flex items-center gap-2">
                   <LogOut size={16} /> Sign Out
                 </button>
               </div>
            ) : (
              <Link to="/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 bg-ink text-white p-3 rounded-xl justify-center font-medium">
                <User size={18} /> Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
