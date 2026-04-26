import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';

export default function Shop() {
  const { phones } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const brandFilter = searchParams.get('brand');
  const saleFilter = searchParams.get('sale');
  const conditionFilter = searchParams.get('condition');

  let filteredPhones = phones;
  if (brandFilter) {
    filteredPhones = filteredPhones.filter(p => p.brand === brandFilter);
  }
  if (saleFilter === 'true') {
    filteredPhones = filteredPhones.filter(p => p.badges?.includes('Flash Sale'));
  }
  if (conditionFilter) {
    filteredPhones = filteredPhones.filter(p => p.condition === conditionFilter);
  }

  const brands = Array.from<string>(new Set(phones.map(p => p.brand)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-ink/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink/50 mb-4">
            <Link to="/" className="hover:text-ink">Home</Link>
            <ChevronRight size={12} />
            <span>Shop</span>
          </div>
          <h1 className="font-serif text-5xl">All Phones</h1>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="mt-6 md:mt-0 flex items-center gap-2 border border-ink/10 rounded-full px-4 py-2 text-sm font-medium hover:bg-paper transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-full md:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4">Brand</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSearchParams({})}
                  className={`block text-sm transition-colors ${!brandFilter && !saleFilter && !conditionFilter ? 'text-accent font-semibold' : 'text-ink/70 hover:text-ink'}`}
                >
                  All Brands
                </button>
                {brands.map(brand => (
                  <button 
                    key={brand}
                    onClick={() => setSearchParams({ brand })}
                    className={`block text-sm transition-colors ${brandFilter === brand ? 'text-accent font-semibold' : 'text-ink/70 hover:text-ink'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4">Special</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSearchParams({ sale: 'true' })}
                  className={`block text-sm transition-colors ${saleFilter === 'true' ? 'text-accent font-semibold' : 'text-ink/70 hover:text-ink'}`}
                >
                  Flash Sales
                </button>
                <button 
                  onClick={() => setSearchParams({ condition: 'Like New' })}
                  className={`block text-sm transition-colors ${conditionFilter === 'Like New' ? 'text-accent font-semibold' : 'text-ink/70 hover:text-ink'}`}
                >
                  Refurbished / Like New
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {filteredPhones.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="text-xl font-medium mb-2">No phones found</h2>
              <p className="text-ink/60">Try adjusting your filters.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-6 text-accent font-semibold text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredPhones.map(phone => (
                <Link to={`/product/${phone.id}`} key={phone.id} className="group">
                  <div className="bg-white rounded-3xl p-8 aspect-[3/4] mb-6 relative overflow-hidden flex items-center justify-center border border-ink/5">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {phone.badges?.map(badge => (
                        <span key={badge} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${badge === 'Flash Sale' ? 'bg-accent text-white' : 'bg-ink/5 text-ink'}`}>
                          {badge}
                        </span>
                      ))}
                      {phone.condition !== 'New' && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                          {phone.condition}
                        </span>
                      )}
                    </div>
                    
                    <img 
                      src={phone.images[0]} 
                      alt={phone.model} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-ink/50 font-mono uppercase tracking-widest">{phone.brand}</p>
                        <h3 className="font-semibold text-lg">{phone.model}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono mt-1">
                      <span className="font-bold text-lg">${phone.price}</span>
                      {phone.originalPrice && (
                        <span className="text-ink/40 line-through text-sm">${phone.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
