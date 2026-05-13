import { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingMatch = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/matches');
        const upcoming = response.data
          .filter(m => m.score === "-:-")
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        setMatch(upcoming);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchMatches();
  }, []);

  if (loading || !match) return null;

  return (
    <div className="py-12 md:py-24 bg-[#f8fafc] font-arabic overflow-hidden relative">
      <div className="container mx-auto px-2 md:px-4 relative z-10">
        
        {/* العناوين */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <span className="text-secondary font-black text-[10px] md:text-sm uppercase tracking-[0.3em] mb-2">Next Challenge</span>
          <h2 className="text-primary font-black text-2xl md:text-5xl text-center">المباراة القادمة</h2>
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-secondary mt-3 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden">
            
            {/* الشريط العلوي */}
            <div className="bg-[#1a2e44] py-2 md:py-3 px-4 md:px-8 flex justify-between items-center text-white/90 text-[10px] md:text-sm font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-secondary rounded-full animate-ping"></span>
                فئة {match.ageCategory}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="opacity-70">🏟️</span> {match.stadium}
              </span>
            </div>

            <div className="p-4 md:p-12 relative">
              {/* VS الخلفية */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-7xl md:text-[18rem] font-black text-gray-50/80 select-none">VS</span>
              </div>

              {/* منطقة المواجهة - Row ديما */}
              <div className="flex flex-row items-center justify-between relative z-10 gap-1 md:gap-4">
                
                {/* فريق أشبال - ASM */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-16 h-16 md:w-40 md:h-40 bg-white rounded-full p-2 md:p-5 shadow-xl border border-gray-100 flex items-center justify-center">
                    <img src="/logo-ashbal.png" alt="ASM" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="mt-2 md:mt-6 font-black text-sm md:text-3xl text-primary uppercase italic">ASM</h3>
                  <span className="hidden md:block text-gray-400 font-bold text-xs">أشبال للرياضة</span>
                </div>

                {/* مركز الوقت - البطاقة الوسطى */}
                <div className="flex flex-col items-center z-20">
                  <div className="bg-white/90 backdrop-blur-sm border-2 border-primary/5 rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-xl flex flex-col items-center min-w-[90px] md:min-w-[180px]">
                    <div className="text-secondary font-black text-xl md:text-5xl mb-1 md:mb-2">
                      {match.time || "17:00"}
                    </div>
                    <div className="h-[1px] md:h-[2px] w-8 md:w-12 bg-gray-100 mb-2 md:mb-3"></div>
                    <div className="text-primary font-bold text-[8px] md:text-sm text-center leading-tight">
                        {new Date(match.date).toLocaleDateString('ar-MA', { day: 'numeric', month: 'short' })}
                        <br className="md:hidden" />
                        <span className="hidden md:inline"> </span>
                        {new Date(match.date).getFullYear()}
                    </div>
                  </div>
                </div>

                {/* الفريق الخصم */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-16 h-16 md:w-40 md:h-40 bg-white rounded-full p-2 md:p-5 shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                    {match.opponentLogo ? (
                      <img src={match.opponentLogo} alt={match.opponent} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl md:text-5xl font-black text-gray-200 uppercase">{match.opponent.substring(0, 2)}</span>
                    )}
                  </div>
                  <h3 className="mt-2 md:mt-6 font-black text-sm md:text-3xl text-secondary uppercase italic">
                    {match.opponentShortName || match.opponent.substring(0, 3)}
                  </h3>
                  <span className="hidden md:block text-gray-400 font-bold text-xs">{match.opponent}</span>
                </div>

              </div>
            </div>

            {/* بوطونة التحفيز */}
            <div className="bg-gray-50/50 py-4 md:py-6 text-center border-t border-gray-50">
               <button className="bg-[#1a2e44] hover:bg-secondary text-white font-black px-6 md:px-12 py-2.5 md:py-4 rounded-full transition-all shadow-lg uppercase text-[10px] md:text-xs tracking-[0.2em]">
                  Match Day is Coming
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatch;