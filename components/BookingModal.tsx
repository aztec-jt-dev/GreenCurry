
import React, { useState, useMemo } from 'react';
import { Room, Booking } from '../types';
import { COUNTRY_CODES } from '../constants';
import MockStripe from './MockStripe';
import { getTotalBookingPrice } from '../utils/pricing';
import { sendMockConfirmationEmail } from '../utils/email';

interface BookingModalProps {
  room: Room;
  bookings: Booking[];
  onClose: () => void;
  onComplete: (booking: Booking) => void;
  totalRooms: number;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, bookings, onClose, onComplete, totalRooms }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [finalBooking, setFinalBooking] = useState<Booking | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+66',
    phone: '',
    checkIn: '',
    checkOut: ''
  });

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    bookings
      .filter(b => b.roomId === room.id && b.status === 'confirmed')
      .forEach(b => {
        let current = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        while (current <= end) {
          dates.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      });
    return dates;
  }, [bookings, room.id]);

  const totalPrice = useMemo(() => {
    return getTotalBookingPrice(room, formData.checkIn, formData.checkOut, bookings, totalRooms);
  }, [room, formData.checkIn, formData.checkOut, bookings, totalRooms]);

  const daysDiff = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [formData.checkIn, formData.checkOut]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.checkIn || !formData.checkOut) {
        alert("Please complete guest details and travel dates.");
        return;
      }
      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        alert("Check-out must be after check-in.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePaymentComplete = async () => {
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      roomId: room.id,
      guestName: formData.name,
      guestEmail: formData.email,
      guestPhone: `${formData.countryCode} ${formData.phone}`,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: 'confirmed',
      notes: '',
      pricePaid: totalPrice
    };
    
    setFinalBooking(newBooking);
    setStep(4);
    setIsSendingEmail(true);
    
    // Simulate email sending
    await sendMockConfirmationEmail(newBooking, room);
    setIsSendingEmail(false);
  };

  const renderCalendar = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const isBooked = bookedDates.has(iso);
      
      days.push(
        <div 
          key={iso}
          className={`aspect-square flex items-center justify-center border text-[10px] font-bold transition-colors ${isBooked ? 'bg-gc-red/20 border-gc-red/40 text-gc-red red-cross' : 'bg-white/5 border-white/10 hover:bg-gc-green/20'}`}
        >
          {d.getDate()}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-7 gap-1 mt-3">
        {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-[9px] font-black opacity-30 uppercase">{d}</div>)}
        {days}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gc-dark/90 backdrop-blur-xl" onClick={step === 4 ? () => onComplete(finalBooking!) : onClose} />
      
      <div className="bg-gc-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative border border-white/10">
        <div className={`p-8 ${step === 4 ? 'bg-gc-green text-gc-dark' : 'bg-white/5 text-white'} flex justify-between items-center transition-colors duration-500`}>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              {step === 4 ? 'Confirmed!' : `Book ${room.name.split(' ')[0]}`}
            </h2>
          </div>
          {step !== 4 && (
            <button onClick={onClose} className="text-4xl leading-none font-bold hover:scale-125 transition-transform">&times;</button>
          )}
        </div>

        <div className="p-10 max-h-[75vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-30">Guest Details</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Legal Name" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-gc-green outline-none font-bold"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-gc-green outline-none font-bold"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </section>

              <section>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-30">Timeline & Inventory</label>
                {renderCalendar()}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest ml-2">Check-in</span>
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono" 
                      value={formData.checkIn}
                      onChange={e => setFormData({...formData, checkIn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest ml-2">Check-out</span>
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono" 
                      value={formData.checkOut}
                      onChange={e => setFormData({...formData, checkOut: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <button 
                onClick={handleNext}
                className="w-full bg-gc-green text-gc-dark py-5 rounded-[2rem] font-black text-lg hover:scale-[1.02] transition-all shadow-[0_20px_40px_rgba(142,198,63,0.3)] active:scale-95"
              >
                PROCEED TO QUOTE
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-10 py-6 animate-in zoom-in duration-500">
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-inner">
                <i className="fa-solid fa-receipt text-5xl text-gc-orange mb-6"></i>
                <h3 className="text-xl font-black italic uppercase tracking-widest mb-4">Pricing Breakdown</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm opacity-50 font-bold uppercase tracking-widest">
                     <span>Base Nightly Rate</span>
                     <span>{room.basePrice} THB</span>
                   </div>
                   <div className="flex justify-between items-center text-sm opacity-50 font-bold uppercase tracking-widest">
                     <span>Total Duration</span>
                     <span>{daysDiff} Night(s)</span>
                   </div>
                   <div className="h-px bg-white/10"></div>
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase opacity-30 italic">Total Payable</span>
                      <span className="text-4xl font-black text-white">{totalPrice} <span className="text-xs opacity-20">THB</span></span>
                   </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleNext}
                  className="w-full bg-gc-green text-gc-dark py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-[1.02] transition-all"
                >
                  SECURE RESERVATION
                </button>
                <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity">Adjust Dates</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <MockStripe 
              amount={totalPrice} 
              onComplete={handlePaymentComplete} 
              onBack={() => setStep(2)} 
            />
          )}

          {step === 4 && finalBooking && (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-gc-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(142,198,63,0.4)]">
                <i className="fa-solid fa-check text-4xl text-gc-dark"></i>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">You're going to Chiang Mai!</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-8 text-left">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Confirmation ID</span>
                  <span className="text-sm font-mono font-bold text-gc-green">{finalBooking.id}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Room:</strong> {room.name}</p>
                  <p className="text-sm"><strong>Dates:</strong> {finalBooking.checkIn} to {finalBooking.checkOut}</p>
                </div>
              </div>

              {isSendingEmail ? (
                <div className="flex items-center justify-center space-x-3 text-gc-orange mb-10">
                  <i className="fa-solid fa-paper-plane animate-bounce"></i>
                  <span className="text-xs font-black uppercase tracking-widest">Sending confirmation email...</span>
                </div>
              ) : (
                <div className="bg-gc-green/10 border border-gc-green/20 rounded-2xl p-4 mb-10 flex items-center space-x-4 animate-in slide-in-from-bottom-2">
                  <i className="fa-solid fa-envelope-circle-check text-2xl text-gc-green"></i>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gc-green">Inbox Check</p>
                    <p className="text-xs opacity-60">Confirmation sent to <strong>{formData.email}</strong></p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => onComplete(finalBooking)}
                className="w-full bg-white text-gc-dark py-5 rounded-[2rem] font-black text-lg hover:bg-gc-green transition-all shadow-2xl"
              >
                CLOSE & VIEW DASHBOARD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
