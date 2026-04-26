import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Check, ShieldCheck, Truck, Star, Heart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { phones, toggleWishlist, wishlist } = useStore();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const phone = phones.find(p => p.id === id);
  
  if (!phone) {
    return <div className="min-h-screen flex items-center justify-center">Phone not found</div>;
  }

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(phone.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isInWishlist = user ? wishlist.some(w => w.userId === user.id && w.phoneId === phone.id) : false;

  const uniqueColors = Array.from<string>(new Set(phone.variants.map(v => v.color)));
  const uniqueStorages = Array.from<string>(new Set(phone.variants.map(v => v.storage)));

  const handleColorSelect = (color: string) => {
    const variant = phone.variants.find(v => v.color === color && v.storage === selectedVariant.storage) 
      || phone.variants.find(v => v.color === color);
    if (variant) setSelectedVariant(variant);
  };

  const handleStorageSelect = (storage: string) => {
    const variant = phone.variants.find(v => v.storage === storage && v.color === selectedVariant.color)
      || phone.variants.find(v => v.storage === storage);
    if (variant) setSelectedVariant(variant);
  };

  const currentVariantPrice = selectedVariant.price;
  const isFlashSale = phone.badges?.includes('Flash Sale');

  const handleAddToCart = () => {
    addToCart(phone, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 aspect-square flex items-center justify-center border border-ink/5 relative overflow-hidden">
            {isFlashSale && (
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  Flash Sale
                </span>
              </div>
            )}
            <img 
              src={phone.images[activeImage]} 
              alt={phone.model} 
              className="w-full h-full object-contain mix-blend-multiply" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex justify-center gap-4">
            {phone.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-2xl bg-white p-2 border ${activeImage === idx ? 'border-ink' : 'border-ink/10'} hover:border-ink/50 transition-colors cursor-pointer`}
              >
                <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-sm font-mono text-ink/50 uppercase tracking-widest mb-2">{phone.brand}</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-4">{phone.model}</h1>
            <p className="text-xl font-light text-ink/70">{phone.shortDescription}</p>
          </div>

          <div className="flex items-center gap-2 mb-8 border-b border-ink/10 pb-8">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(phone.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-sm font-medium">{phone.rating}</span>
            <span className="text-sm text-ink/50">({phone.reviewsCount} reviews)</span>
          </div>

          <div className="mb-8 font-mono">
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold">${currentVariantPrice}</span>
              {isFlashSale && phone.originalPrice && (
                <span className="text-xl text-ink/40 line-through mb-1">${phone.originalPrice}</span>
              )}
            </div>
            {isFlashSale && (
              <p className="text-accent text-sm mt-2 font-sans font-medium">You save ${phone.originalPrice! - currentVariantPrice} today</p>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold mb-4 flex justify-between">
              <span>Color</span>
              <span className="text-ink/60 font-sans font-normal normal-case">{selectedVariant.color}</span>
            </h3>
            <div className="flex gap-4">
              {uniqueColors.map(color => {
                const v = phone.variants.find(vx => vx.color === color);
                const isSelected = selectedVariant.color === color;
                return (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isSelected ? 'border-ink scale-110' : 'border-transparent hover:border-ink/20'}`}
                  >
                    <span 
                      className="w-10 h-10 rounded-full border border-black/10" 
                      style={{ backgroundColor: v?.colorHex }}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Storage Selection */}
          <div className="mb-10">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold mb-4">Storage</h3>
            <div className="flex flex-wrap gap-4">
              {uniqueStorages.map(storage => {
                const isSelected = selectedVariant.storage === storage;
                return (
                  <button
                    key={storage}
                    onClick={() => handleStorageSelect(storage)}
                    className={`px-8 py-4 rounded-xl border font-mono transition-all
                      ${isSelected ? 'border-ink bg-ink text-white shadow-xl shadow-ink/20' : 'border-ink/20 bg-white hover:border-ink/50'}
                    `}
                  >
                    {storage}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add to Cart */}
          {(!user || user.role === 'buyer') ? (
            <div className="flex gap-4 mb-10">
              <div className="flex border border-ink/20 rounded-full items-center bg-white px-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl"
                >
                  -
                </button>
                <span className="w-12 text-center font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-xl"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className={`flex-1 rounded-full flex items-center justify-center gap-2 font-medium transition-all ${added ? 'bg-emerald-500 text-white' : 'bg-accent text-white hover:bg-accent/90'}`}
              >
                {added ? (
                  <><Check size={20} /> Added to Cart</>
                ) : (
                  'Add to Cart'
                )}
              </button>
              {user && user.role === 'buyer' && (
                <button
                  onClick={() => toggleWishlist(user.id, phone.id)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${isInWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-ink/20 hover:border-ink/50'}`}
                >
                  <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          ) : (
            <div className="mb-10 p-4 border border-ink/10 rounded-2xl bg-paper text-center">
              <p className="text-ink/60 font-medium">Buying is restricted to standard buyer accounts.</p>
            </div>
          )}

          {/* Peripherals info */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-ink/10 text-sm">
            <div className="flex items-center gap-3 text-ink/70">
              <ShieldCheck size={20} />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-ink/70">
              <Truck size={20} />
              <span>Free Delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description / Features */}
      <div className="mt-24 pt-24 border-t border-ink/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl mb-8">Features & Specifications</h2>
          <p className="text-lg leading-relaxed text-ink/80 mb-12">
            {phone.description}
          </p>
          
          <ul className="space-y-4">
            {phone.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="mt-1 bg-ink/5 p-1 rounded">
                  <Check size={16} className="text-ink" />
                </div>
                <span className="text-ink/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
