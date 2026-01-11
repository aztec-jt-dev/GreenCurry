
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Premium Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden bg-black">
        {/* Multi-layered Background */}
        {IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${idx === currentSlide ? 'opacity-40 scale-100' : 'opacity-0 scale-110'}`}
          >
            <img src={img} alt="Hostel Atmosphere" className="w-full h-full object-cover brightness-50" />
          </div>
        ))}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-gc-dark/80 via-transparent to-gc-dark z-10" />
        
        {/* Central Brand Anchor */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-20 text-center px-4">
          <div className="animate-in slide-in-from-top-12 duration-1000">
            <img 
              src="green-curry-hostel-logo.png" 
              alt="Green Curry Hostel" 
              className="h-48 md:h-72 mb-12 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
          </div>
          
          <div className="max-w-4xl space-y-8 animate-in fade-in zoom-in duration-1000 delay-300">
            <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none">
              <span className="text-gc-green">Authentic</span> Chiang Mai <br className="hidden md:block" /> 
              Boutique <span className="text-gc-orange">Living</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium opacity-60 tracking-wider max-w-2xl mx-auto italic">
              Premium private rooms in the historic heart of the Old City. 
              Spiced with tradition, cooled by modern comfort.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link 
                to="/rooms/with-toilet" 
                className="group relative bg-gc-green text-gc-dark px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(142,198,63,0.3)]"
              >
                BOOK ENSUITE
                <div className="absolute -inset-1 bg-white opacity-0 group-hover:opacity-10 rounded-2xl blur-lg transition-opacity"></div>
              </Link>
              <Link 
                to="/rooms/no-toilet" 
                className="group relative bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-xl hover:bg-white hover:text-gc-dark transition-all"
              >
                BOOK STANDARD
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 opacity-20 animate-bounce">
          <i className="fa-solid fa-chevron-down text-3xl"></i>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-gc-green/10 border border-gc-green/20 rounded-full">
              <span className="text-gc-green font-black text-[10px] uppercase tracking-[0.4em]">Our Philosophy</span>
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-tight">
              More than <span className="text-gc-orange">Just a Bunk</span>. <br/>
              A Place to <span className="text-gc-green">Taste</span> the City.
            </h2>
            <p className="text-xl opacity-60 leading-relaxed font-medium">
              We believe solo travel shouldn't mean sacrificing comfort. Green Curry Hostel provides a sanctuary 
              where high-end private rooms meet the communal soul of backpacking. Steps from Wat Phra Singh 
              and the Sunday Market, we are your gateway to the real Chiang Mai.
            </p>
            <div className="flex gap-10">
               <div className="flex flex-col">
                  <span className="text-4xl font-black text-gc-green">9.8</span>
                  <span className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">HostelWorld</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-4xl font-black text-gc-orange">#1</span>
                  <span className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">Solo-Travel Rank</span>
               </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gc-green/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <img 
              src={IMAGES[2]} 
              alt="Hostel Common Area" 
              className="relative rounded-[3rem] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* Featured Room Types */}
      <section className="bg-black/40 py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white mb-6 leading-none">The <span className="text-gc-green">Spice</span> Selection</h2>
              <p className="opacity-40 font-bold uppercase tracking-widest text-sm">Curated Private Accommodations for the Modern Explorer</p>
            </div>
            <div className="h-px bg-white/10 flex-grow mx-10 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Ensuite Card */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-white/5 border border-white/10 hover:border-gc-green transition-all duration-500 shadow-2xl">
              <div className="h-[400px] overflow-hidden">
                <img src={IMAGES[1]} alt="Ensuite Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-gc-green">Private Ensuite</h3>
                    <p className="text-xs font-black opacity-30 uppercase tracking-[0.2em] mt-1">The Premium Sanctuary</p>
                  </div>
                  <span className="text-4xl font-black text-white">450 <span className="text-xs opacity-20">THB</span></span>
                </div>
                <p className="opacity-60 text-sm font-medium leading-relaxed">
                  Total autonomy. Your own private bathroom, desk area, and high-performance AC. 
                  Designed for those who want to recharge in absolute peace.
                </p>
                <Link to="/rooms/with-toilet" className="block w-full text-center py-4 bg-gc-green text-gc-dark rounded-2xl font-black tracking-widest hover:bg-white transition-colors">VIEW UNIT DETAILS</Link>
              </div>
            </div>

            {/* Standard Card */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-white/5 border border-white/10 hover:border-gc-orange transition-all duration-500 shadow-2xl">
              <div className="h-[400px] overflow-hidden">
                <img src={IMAGES[3]} alt="Standard Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-gc-orange">Private Standard</h3>
                    <p className="text-xs font-black opacity-30 uppercase tracking-[0.2em] mt-1">Essential Boutique Comfort</p>
                  </div>
                  <span className="text-4xl font-black text-white">375 <span className="text-xs opacity-20">THB</span></span>
                </div>
                <p className="opacity-60 text-sm font-medium leading-relaxed">
                  Boutique aesthetic without the price tag. Private sleeping quarters with 
                  shared bathrooms that are cleaned every 4 hours. Perfect balance.
                </p>
                <Link to="/rooms/no-toilet" className="block w-full text-center py-4 bg-gc-orange text-gc-dark rounded-2xl font-black tracking-widest hover:bg-white transition-colors">VIEW UNIT DETAILS</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
