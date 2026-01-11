
import React, { useState, useMemo } from 'react';
import { RoomType, Room, Booking } from '../types';
import BookingModal from '../components/BookingModal';
import { getNightlyPrice } from '../utils/pricing';

interface RoomTypePageProps {
  type: RoomType;
  rooms: Room[];
  bookings: Booking[];
  onBook: (booking: Booking) => void;
}

const RoomTypePage: React.FC<RoomTypePageProps> = ({ type, rooms, bookings, onBook }) => {
  const filteredRooms = rooms.filter(r => r.type === type);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Get current date price for display
  const today = new Date().toISOString().split('T')[0];
  
  const getTodayPriceForRoom = (room: Room) => {
    return getNightlyPrice(room, today, bookings, rooms.length);
  };

  const currentPrice = useMemo(() => {
    if (filteredRooms.length === 0) return 0;
    return getTodayPriceForRoom(filteredRooms[0]);
  }, [filteredRooms, bookings, rooms.length, today]);

  const images = type === RoomType.PRIVATE_WITH_TOILET 
    ? ['input_file_1.png', 'input_file_2.png']
    : ['input_file_3.png', 'input_file_0.png'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Visuals */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src={images[0]} alt="Room main" className="w-full aspect-video object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src={images[1]} alt="Room secondary" className="rounded-2xl aspect-square object-cover border border-white/5 shadow-xl" />
             <div className="bg-white/5 rounded-2xl flex flex-col items-center justify-center p-6 border border-white/10 group">
               <span className="text-4xl font-black text-gc-green mb-1 group-hover:scale-110 transition-transform">
                 {currentPrice}
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">THB / Today's Rate</span>
               {currentPrice > (filteredRooms[0]?.basePrice || 0) && (
                 <div className="mt-3 flex items-center space-x-1 text-gc-orange text-[9px] font-black uppercase tracking-tighter bg-gc-orange/10 px-2 py-0.5 rounded-full">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span>Peak Season Demand</span>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-right duration-700">
          <nav className="flex mb-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
            <a href="/" className="hover:text-gc-green transition-colors">Home</a>
            <span className="mx-3 opacity-20">/</span>
            <span>Room Catalog</span>
          </nav>
          
          <h1 className="text-5xl font-black mb-8 italic uppercase tracking-tighter leading-none">
            {type === RoomType.PRIVATE_WITH_TOILET ? (
              <span className="text-gc-green">Private <br/>Ensuite Sanctuary</span>
            ) : (
              <span className="text-gc-orange">Private <br/>Standard Haven</span>
            )}
          </h1>

          <div className="flex flex-wrap gap-3 mb-10">
            <span className="bg-gc-green/10 text-gc-green px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gc-green/20">
              <i className="fa-solid fa-user mr-2"></i> Solo Traveler
            </span>
            <span className="bg-gc-orange/10 text-gc-orange px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gc-orange/20">
              <i className="fa-solid fa-bed mr-2"></i> Boutique Single
            </span>
            {type === RoomType.PRIVATE_WITH_TOILET && (
              <span className="bg-gc-red/10 text-gc-red px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gc-red/20">
                <i className="fa-solid fa-toilet mr-2"></i> Private Bath
              </span>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-12 text-sm opacity-60 leading-relaxed font-medium">
            <p>
              Designed for the modern solo explorer, our {type} offers a sanctuary from the vibrant energy of Chiang Mai. 
              Minimalist Thai aesthetics meet functional boutique design.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8 italic text-white/80">
              <div className="flex items-center space-x-2"><i className="fa-solid fa-wifi text-gc-green text-xs"></i> <span>Nomad-Grade WiFi</span></div>
              <div className="flex items-center space-x-2"><i className="fa-solid fa-wind text-gc-green text-xs"></i> <span>Premium AC</span></div>
              <div className="flex items-center space-x-2"><i className="fa-solid fa-lock text-gc-green text-xs"></i> <span>Secure Digital Key</span></div>
              <div className="flex items-center space-x-2"><i className="fa-solid fa-soap text-gc-green text-xs"></i> <span>Artisan Toiletries</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-30 mb-6">Unit Selection</h3>
            <div className="grid grid-cols-1 gap-4">
              {filteredRooms.map(room => {
                const roomTodayPrice = getTodayPriceForRoom(room);
                return (
                  <div 
                    key={room.id}
                    className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer shadow-xl"
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div>
                      <h4 className="font-black text-xl italic uppercase tracking-tighter mb-1">{room.name}</h4>
                      <div className="flex items-center space-x-3">
                         <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Available Immediately</span>
                         <span className="text-gc-green font-black text-sm">{roomTodayPrice} THB</span>
                      </div>
                    </div>
                    <button className="bg-gc-green text-gc-dark px-8 py-4 rounded-2xl font-black text-sm shadow-[0_10px_20px_rgba(142,198,63,0.2)] group-hover:scale-105 transition-transform active:scale-95">
                      RESERVE
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedRoom && (
        <BookingModal 
          room={selectedRoom} 
          bookings={bookings} 
          onClose={() => setSelectedRoom(null)} 
          onComplete={(b) => {
            onBook(b);
            setSelectedRoom(null);
          }}
          totalRooms={rooms.length}
        />
      )}
    </div>
  );
};

export default RoomTypePage;
