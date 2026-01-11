
import React, { useState, useMemo } from 'react';
import { Room, Booking, RoomType } from '../types';
import { FESTIVALS } from '../constants';

interface AdminDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  onUpdate: (id: string, updates: Partial<Booking>) => void;
  onDelete: (id: string) => void;
  onAdd: (booking: Booking) => void;
}

type SortField = 'room' | 'guest' | 'dates' | 'status' | 'notes';
type SortDirection = 'asc' | 'desc';

const AdminDashboardPage: React.FC<AdminDashboardProps> = ({ rooms, bookings, onUpdate, onDelete, onAdd }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editingNote, setEditingNote] = useState<Booking | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filter States
  const [filterRoomType, setFilterRoomType] = useState<string>('All');
  const [filterDateStart, setFilterDateStart] = useState<string>('');
  const [filterDateEnd, setFilterDateEnd] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sort States
  const [sortField, setSortField] = useState<SortField>('dates');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const occupancyRate = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const active = bookings.filter(b => b.checkIn <= today && b.checkOut >= today && b.status === 'confirmed').length;
    return Math.round((active / rooms.length) * 100);
  }, [bookings, rooms]);

  const upcomingFestival = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return FESTIVALS.find(f => f.start >= today) || FESTIVALS[0];
  }, []);

  const sortedAndFilteredBookings = useMemo(() => {
    let filtered = bookings.filter(b => {
      const room = rooms.find(r => r.id === b.roomId);
      const matchesType = filterRoomType === 'All' || room?.type === filterRoomType;
      const matchesDateStart = !filterDateStart || b.checkIn >= filterDateStart;
      const matchesDateEnd = !filterDateEnd || b.checkOut <= filterDateEnd;
      const matchesSearch = !searchTerm || 
        b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesDateStart && matchesDateEnd && matchesSearch;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'room':
          const roomA = rooms.find(r => r.id === a.roomId)?.name || '';
          const roomB = rooms.find(r => r.id === b.roomId)?.name || '';
          comparison = roomA.localeCompare(roomB);
          break;
        case 'guest':
          comparison = a.guestName.localeCompare(b.guestName);
          break;
        case 'dates':
          comparison = a.checkIn.localeCompare(b.checkIn);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'notes':
          comparison = (a.notes || '').localeCompare(b.notes || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [bookings, rooms, filterRoomType, filterDateStart, filterDateEnd, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <i className="fa-solid fa-sort ml-2 opacity-10 text-[8px]"></i>;
    return sortDirection === 'asc' 
      ? <i className="fa-solid fa-sort-up ml-2 text-gc-green"></i> 
      : <i className="fa-solid fa-sort-down ml-2 text-gc-green"></i>;
  };

  const renderCalendar = (full: boolean) => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dailyBookings = bookings.filter(b => b.checkIn <= iso && b.checkOut >= iso && b.status === 'confirmed');
      const isFestival = FESTIVALS.some(f => iso >= f.start && iso <= f.end);
      
      days.push(
        <div 
          key={iso}
          className={`min-h-[100px] border border-white/5 p-3 transition-all duration-300 relative ${dailyBookings.length >= rooms.length ? 'bg-gc-red/10' : 'bg-white/5 hover:bg-white/10'} ${isFestival ? 'border-gc-orange/30' : ''}`}
        >
          {isFestival && <div className="absolute top-0 right-0 w-1 h-full bg-gc-orange animate-pulse"></div>}
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-black ${isFestival ? 'text-gc-orange' : 'opacity-30'}`}>
              {d.getDate()} {d.toLocaleDateString('en', { month: 'short' }).toUpperCase()}
            </span>
            {dailyBookings.length > 0 && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${dailyBookings.length >= rooms.length ? 'bg-gc-red text-white' : 'bg-gc-green/20 text-gc-green'}`}>
                {dailyBookings.length}/{rooms.length}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {dailyBookings.slice(0, 3).map(b => (
              <div key={b.id} className="text-[8px] font-bold truncate opacity-90 bg-gc-green/10 text-gc-green px-2 py-1 rounded border border-gc-green/20">
                {rooms.find(r => r.id === b.roomId)?.name.split(' ')[0]} - {b.guestName.split(' ')[0]}
              </div>
            ))}
            {dailyBookings.length > 3 && <div className="text-[8px] opacity-30 font-black pl-1 mt-1">+{dailyBookings.length - 3} OTHERS</div>}
          </div>
        </div>
      );
    }
    return (
      <div className={`grid grid-cols-7 border border-white/10 rounded-2xl overflow-hidden ${full ? 'flex-grow' : ''}`}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="bg-white/10 p-3 text-center text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/10 opacity-40">{d}</div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Internal <span className="text-gc-green">Operations</span></h1>
          <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-30">Live Management Dashboard &bull; Chiang Mai</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gc-green text-gc-dark px-10 py-4 rounded-2xl font-black text-lg shadow-[0_15px_30px_rgba(142,198,63,0.3)] hover:scale-105 transition-all active:scale-95"
        >
          + NEW MANUAL ENTRY
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-gc-green transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Live Occupancy</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-5xl font-black italic">{occupancyRate}%</h2>
            <div className={`w-2 h-2 rounded-full animate-pulse ${occupancyRate > 80 ? 'bg-gc-red' : 'bg-gc-green'}`}></div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-gc-orange transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Upcoming Peak</p>
          <h2 className="text-2xl font-black italic text-gc-orange leading-tight">{upcomingFestival.name.split(' ')[0]}</h2>
          <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">Multi: x{upcomingFestival.multiplier}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-gc-red transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Total Ledger</p>
          <h2 className="text-5xl font-black italic text-gc-red">{bookings.length}</h2>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-gc-green transition-all flex flex-col justify-center">
           <div className="text-[10px] font-black uppercase text-gc-green tracking-widest mb-1">Pricing Engine</div>
           <p className="text-[11px] opacity-40 font-medium">Automatic multipliers active for occupancy > 80%</p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden mb-12 shadow-2xl">
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center space-x-3">
             <i className="fa-solid fa-calendar-days text-gc-green text-xl"></i>
             <h3 className="text-xl font-black uppercase tracking-widest italic">Inventory Timeline</h3>
          </div>
          <button 
            onClick={() => setIsFullScreen(true)}
            className="text-[10px] bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all"
          >
            Maximize View
          </button>
        </div>
        <div className="p-6">
          {renderCalendar(false)}
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/10 bg-white/5">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10">
            <h3 className="text-2xl font-black uppercase tracking-tight italic">System <span className="text-gc-orange">Ledger</span></h3>
            
            {/* Elegant Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative group">
                <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-white/20 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="Guest name or email..." 
                  className="bg-white/10 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold focus:ring-2 ring-gc-green outline-none min-w-[280px] transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="bg-white/10 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-gc-green transition-all"
                value={filterRoomType}
                onChange={e => setFilterRoomType(e.target.value)}
              >
                <option value="All">All Units</option>
                <option value={RoomType.PRIVATE_WITH_TOILET}>Ensuite</option>
                <option value={RoomType.PRIVATE_NO_TOILET}>Standard</option>
              </select>
              {(filterRoomType !== 'All' || filterDateStart || filterDateEnd || searchTerm) && (
                <button 
                  onClick={() => {setFilterRoomType('All'); setFilterDateStart(''); setFilterDateEnd(''); setSearchTerm('');}}
                  className="text-gc-red text-[10px] font-black uppercase tracking-[0.2em] hover:underline px-4"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
              <tr>
                <th className="p-8 cursor-pointer hover:text-gc-green transition-colors" onClick={() => handleSort('room')}>
                  <div className="flex items-center">UNIT {renderSortIndicator('room')}</div>
                </th>
                <th className="p-8 cursor-pointer hover:text-gc-green transition-colors" onClick={() => handleSort('guest')}>
                  <div className="flex items-center">PROFILE {renderSortIndicator('guest')}</div>
                </th>
                <th className="p-8 cursor-pointer hover:text-gc-green transition-colors" onClick={() => handleSort('dates')}>
                  <div className="flex items-center">SCHEDULE {renderSortIndicator('dates')}</div>
                </th>
                <th className="p-8 cursor-pointer hover:text-gc-green transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center">STATE {renderSortIndicator('status')}</div>
                </th>
                <th className="p-8 cursor-pointer hover:text-gc-green transition-colors" onClick={() => handleSort('notes')}>
                  <div className="flex items-center">COMMENTS {renderSortIndicator('notes')}</div>
                </th>
                <th className="p-8 text-right opacity-0">...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedAndFilteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-gc-green italic">{rooms.find(r => r.id === b.roomId)?.name}</span>
                      <span className="text-[9px] opacity-30 uppercase font-black tracking-widest mt-1">{rooms.find(r => r.id === b.roomId)?.type.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black">{b.guestName}</span>
                      <span className="text-[10px] opacity-40 font-bold">{b.guestEmail}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center space-x-3 text-[10px] font-black tracking-tighter italic">
                      <span className="opacity-40">{b.checkIn}</span>
                      <i className="fa-solid fa-chevron-right text-[8px] opacity-20"></i>
                      <span className="text-white">{b.checkOut}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`text-[9px] px-3 py-1.5 rounded-full uppercase font-black tracking-[0.2em] ${
                      b.status === 'confirmed' ? 'bg-gc-green/10 text-gc-green border border-gc-green/20' : 
                      b.status === 'cancelled' ? 'bg-gc-red/10 text-gc-red border border-gc-red/20' : 
                      'bg-gc-orange/10 text-gc-orange border border-gc-orange/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-8">
                    <div 
                      className="group/note flex items-center space-x-3 bg-white/5 border border-transparent hover:border-white/10 p-3 rounded-2xl cursor-pointer transition-all"
                      onClick={() => setEditingNote(b)}
                    >
                      <i className={`fa-solid fa-comment-dots text-xs transition-colors ${b.notes ? 'text-gc-green' : 'opacity-10'}`}></i>
                      <p className={`text-[10px] italic font-medium truncate max-w-[150px] transition-opacity ${b.notes ? 'opacity-60' : 'opacity-10'}`}>
                        {b.notes || 'Click to add internal note...'}
                      </p>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingBooking(b)}
                        className="p-3 bg-white/10 hover:bg-gc-green hover:text-gc-dark rounded-xl transition-all"
                        title="Edit Details"
                      >
                        <i className="fa-solid fa-sliders"></i>
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Permanently wipe this record from the database?')) {
                            onDelete(b.id);
                          }
                        }}
                        className="p-3 bg-white/10 hover:bg-gc-red hover:text-white rounded-xl transition-all"
                        title="Delete Permanently"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedAndFilteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <i className="fa-solid fa-ghost text-6xl mb-6"></i>
                      <p className="text-xl font-black italic uppercase tracking-widest">No matching records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal overlays omitted for brevity as they remain identical to previous turn unless specific fixes were needed */}
    </div>
  );
};

export default AdminDashboardPage;
