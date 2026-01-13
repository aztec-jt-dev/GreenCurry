import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Room, Booking, RoomType, User } from './types';
import { INITIAL_ROOMS } from './constants';

// Pages
import HomePage from './pages/HomePage';
import RoomTypePage from './pages/RoomTypePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AiConciergePage from './pages/AiConciergePage';

const App: React.FC = () => {
  const [rooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('gc_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem('gc_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  return (
    <Router>
      <div className="min-h-screen bg-gc-dark text-gc-light flex flex-col selection:bg-gc-green selection:text-gc-dark">
        {/* Navigation Bar - Centered Logo Design */}
        <nav className="sticky top-0 z-50 bg-gc-dark/90 border-b border-white/5 backdrop-blur-xl shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center py-4 md:h-24 gap-4">
              {/* Left Nav */}
              <div className="flex items-center space-x-8 font-black text-[10px] uppercase tracking-[0.3em] order-2 md:order-1">
                <Link to="/rooms/with-toilet" className="hover:text-gc-green transition-colors py-2 border-b-2 border-transparent hover:border-gc-green">Ensuite</Link>
                <Link to="/rooms/no-toilet" className="hover:text-gc-green transition-colors py-2 border-b-2 border-transparent hover:border-gc-green">Standard</Link>
                <Link to="/concierge" className="text-gc-orange hover:text-white transition-colors py-2 flex items-center">
                  <i className="fa-solid fa-robot mr-2"></i> Concierge
                </Link>
              </div>

              {/* Center Logo */}
              <Link to="/" className="flex items-center order-1 md:order-2">
                <img 
                  src="green-curry-hostel-logo.png" 
                  alt="Green Curry Hostel" 
                  className="h-16 md:h-20 w-auto object-contain transition-transform hover:scale-105 duration-500"
                />
              </Link>

              {/* Right Nav */}
              <div className="flex items-center space-x-8 font-black text-[10px] uppercase tracking-[0.3em] order-3">
                {user ? (
                  <div className="flex items-center space-x-6">
                    <Link to="/admin" className="text-gc-orange hover:opacity-80 transition-opacity">Dashboard</Link>
                    <button onClick={logout} className="text-gc-red hover:underline underline-offset-4">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" className="bg-gc-green text-gc-dark px-6 py-2.5 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(142,198,63,0.3)]">Staff Login</Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/rooms/with-toilet" 
              element={<RoomTypePage type={RoomType.PRIVATE_WITH_TOILET} rooms={rooms} bookings={bookings} onBook={addBooking} />} 
            />
            <Route 
              path="/rooms/no-toilet" 
              element={<RoomTypePage type={RoomType.PRIVATE_NO_TOILET} rooms={rooms} bookings={bookings} onBook={addBooking} />} 
            />
            <Route path="/concierge" element={<AiConciergePage />} />
            <Route path="/login" element={<AdminLoginPage onLogin={login} />} />
            <Route 
              path="/admin" 
              element={
                user?.role === 'admin' ? 
                <AdminDashboardPage 
                  rooms={rooms} 
                  bookings={bookings} 
                  onUpdate={updateBooking} 
                  onDelete={deleteBooking} 
                  onAdd={addBooking}
                /> : 
                <AdminLoginPage onLogin={login} />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black/40 border-t border-white/5 py-20 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <img src="green-curry-hostel-logo.png" alt="Footer Logo" className="h-24 mb-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl border-y border-white/5 py-12 mb-12">
                <div>
                  <h3 className="text-gc-green font-black text-xs uppercase tracking-[0.3em] mb-4 italic">Experience</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-medium">Authentic Chiang Mai boutique living. Modern comfort with a backpacker heart.</p>
                </div>
                <div>
                  <h3 className="text-gc-orange font-black text-xs uppercase tracking-[0.3em] mb-4 italic">Location</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-medium italic">Old City Center,<br/>Chiang Mai, Thailand</p>
                </div>
                <div>
                  <h3 className="text-gc-red font-black text-xs uppercase tracking-[0.3em] mb-4 italic">Contact</h3>
                  <p className="text-sm opacity-50 font-bold">booking@greencurryhostel.com</p>
                  <p className="text-gc-green font-black mt-2">+66 123 456 789</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                <a 
                  href="https://github.com/aztec-jt-dev/greencurryhostel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-gc-green transition-colors group"
                >
                  <i className="fa-brands fa-github text-lg group-hover:scale-110 transition-transform"></i>
                  <span>aztec-jt-dev / greencurryhostel</span>
                </a>
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] opacity-20">
                  &copy; {new Date().getFullYear()} Green Curry Hostel &bull; Thailand &bull; All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;