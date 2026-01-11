
import React, { useState } from 'react';

interface MockStripeProps {
  amount: number;
  onComplete: () => void;
  onBack: () => void;
}

const MockStripe: React.FC<MockStripeProps> = ({ amount, onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gc-green mb-6">
        <i className="fa-brands fa-stripe text-4xl"></i>
        <span className="font-bold text-lg">Secure Payment</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-xs opacity-50 mb-2 uppercase tracking-widest">Card Details</label>
          <div className="space-y-4">
            <input 
              required
              type="text" 
              placeholder="Card Number" 
              defaultValue="4242 4242 4242 4242"
              className="w-full bg-white/10 border-none rounded-xl p-4 placeholder-white/30"
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                type="text" 
                placeholder="MM / YY" 
                defaultValue="12 / 25"
                className="w-full bg-white/10 border-none rounded-xl p-4 placeholder-white/30"
              />
              <input 
                required
                type="text" 
                placeholder="CVC" 
                defaultValue="123"
                className="w-full bg-white/10 border-none rounded-xl p-4 placeholder-white/30"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gc-red/10 border border-gc-red/30 rounded-xl text-xs text-center text-gc-red">
          <p className="font-bold mb-1">TEST MODE</p>
          <p>Use card: 4242 4242 4242 4242</p>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gc-green text-gc-dark py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center"
        >
          {loading ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            `PAY ${amount} THB`
          )}
        </button>
      </form>
      <button onClick={onBack} className="w-full text-center text-sm opacity-50">Back to reservation</button>
    </div>
  );
};

export default MockStripe;
