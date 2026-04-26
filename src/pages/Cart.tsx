import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, CheckCircle2, User } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder, addresses } = useStore();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const shipping = cart.length > 0 ? 15 : 0;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const userAddresses = user ? addresses.filter(a => a.userId === user.id) : [];

  // Note: Using 'cart' here as seen from actual file
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-serif text-4xl mb-4">Order Confirmed!</h1>
        <p className="text-ink/60 mb-8 max-w-md">Thank you for your purchase. We've sent the order confirmation details to your email and our fulfillment team is preparing your package.</p>
        <Link to="/profile" className="bg-ink text-white px-8 py-4 rounded-full font-medium hover:bg-ink/90 transition-colors inline-block">
          View Dashboard
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-5xl mb-6">Your Cart is Empty</h1>
        <p className="text-ink/60 mb-8">Looks like you haven't added any phones yet.</p>
        <Link 
          to="/shop" 
          className="bg-ink text-white px-8 py-4 rounded-full font-medium hover:bg-accent transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="font-serif text-5xl mb-12">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <div className="border-b border-ink/10 pb-4 mb-6 hidden md:grid grid-cols-12 gap-4 text-xs font-mono uppercase tracking-widest text-ink/50">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          <div className="space-y-8">
            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2 border border-ink/5">
                    <img src={item.phone.images[0]} alt={item.phone.model} className="object-contain w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.phone.model}</h3>
                    <p className="text-sm text-ink/60">{item.variant.color} | {item.variant.storage}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 mt-2 flex items-center gap-1 hover:underline"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                  <div className="flex border border-ink/20 rounded-full items-center bg-white px-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:text-accent"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:text-accent"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 justify-between flex md:block text-right">
                  <span className="md:hidden text-sm text-ink/50 mr-4">Price:</span>
                  <span className="font-mono">${item.variant.price}</span>
                </div>
                
                <div className="col-span-1 md:col-span-2 justify-between flex md:block text-right">
                  <span className="md:hidden text-sm text-ink/50 mr-4">Total:</span>
                  <span className="font-mono font-bold">${item.variant.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white p-8 rounded-[2rem] border border-ink/5">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-mono">${cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Shipping</span>
                <span className="font-mono">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Tax</span>
                <span className="font-mono">Included</span>
              </div>
            </div>
            
            <div className="border-t border-ink/10 pt-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-mono text-2xl font-bold">${cartTotal}</span>
              </div>
              
              {user && user.role === 'buyer' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Shipping Address</label>
                  {userAddresses.length > 0 ? (
                    <select 
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="w-full border border-ink/20 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-white"
                    >
                      <option value="" disabled>Select an address...</option>
                      {userAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>{addr.street}, {addr.city}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm bg-accent/5 text-accent p-3 rounded-xl border border-accent/10">
                      No addresses saved. <Link to="/profile" className="font-semibold underline hover:text-ink">Add one in your Dashboard</Link>.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                
                if (user.role === 'buyer' && userAddresses.length === 0) {
                  alert("Please add a shipping address in your dashboard first.");
                  return;
                }
                
                if (user.role === 'buyer' && !selectedAddressId) {
                  alert("Please select a shipping address.");
                  return;
                }

                setIsCheckingOut(true);
                const address = userAddresses.find(a => a.id === selectedAddressId);
                setTimeout(() => {
                  placeOrder(user.id, cart, total, address!);
                  setIsCheckingOut(false);
                  setOrderComplete(true);
                  clearCart();
                }, 1500);
              }}
              disabled={isCheckingOut || (user && user.role === 'buyer' && userAddresses.length > 0 && !selectedAddressId)}
              className="w-full bg-ink text-white py-4 rounded-full font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : (!user ? 'Login to Checkout' : 'Proceed to Checkout')}
              {!isCheckingOut && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-ink/50">100% secure checkout via Stripe or KHQR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
