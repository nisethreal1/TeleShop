import React from 'react';
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center">
                <Phone size={18} />
              </div>
              <span className="font-serif font-semibold text-xl tracking-tight">TeleShop</span>
            </div>
            <p className="text-sm font-sans mb-6">
              The premier destination for the latest smartphones. We deliver technology that keeps you connected, with premium service and unbeatable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest font-mono">Shop</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/shop?brand=Apple" className="hover:text-white transition-colors">Apple iPhones</Link></li>
              <li><Link to="/shop?brand=Samsung" className="hover:text-white transition-colors">Samsung Galaxy</Link></li>
              <li><Link to="/shop?brand=Google" className="hover:text-white transition-colors">Google Pixel</Link></li>
              <li><Link to="/shop?condition=Like New" className="hover:text-white transition-colors">Refurbished Phones</Link></li>
              <li><Link to="/shop?sale=true" className="hover:text-active transition-colors text-accent">Flash Sales</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest font-mono">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Installment Plans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Phone Recommender</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest font-mono">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>123 Innovation Drive, Tech District, Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>+855 23 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>support@teleshop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} TeleShop. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-mono">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
