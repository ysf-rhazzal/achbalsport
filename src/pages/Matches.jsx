import { useState, useEffect } from 'react';
import axios from 'axios';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal6.replit.app/api/matches');
        // ترتيب المباريات من الأحدث إلى الأقدم
        setMatches(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) { 
        console.error("Error fetching matches:", error); 
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-black text-primary animate-pulse tracking-widest uppercase">جاري تحميل النتائج...</div>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-24 pb-12 font-arabic" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* هيدر الصفحة */}
        <div className="text-center mb-12">
          <span className="text-secondary font-black text-sm uppercase tracking-[0.3em] mb-2 block">Our History</span>
          <h1 className="text-3xl md:text-5xl font-black text-primary mb-4 uppercase italic">نتائج ومباريات النادي</h1>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          {matches.map((m) => (
            <div key={m._id} className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 transition-all hover:shadow-2xl group">
              
              {/* شريط المعلومات العلوي */}
              <div className="bg-[#1a2e44] px-6 py-3 flex justify-between items-center text-white/90">
                <span className="bg-secondary text-white px-4 py-1 rounded-full text-[10px] md:text-xs font-black shadow-sm uppercase italic">
                  فئة {m.ageCategory}
                </span>
                <span className="text-[10px] md:text-sm font-bold flex items-center gap-2">
                   📅 {new Date(m.date).toLocaleDateString('ar-MA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* منطقة المواجهة */}
              <div className="p-5 md:p-12 flex items-center justify-between gap-2 md:gap-8 relative overflow-hidden">
                {/* VS خلفية فنية */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <span className="text-8xl md:text-[15rem] font-black italic">VS</span>
                </div>

                {/* ASM Team */}
                <div className="flex-1 flex flex-col items-center z-10 transition-transform group-hover:-translate-x-2">
                  <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-full p-2 md:p-5 shadow-xl border border-gray-50 flex items-center justify-center">
                    <img src="/logo-ashbal.png" alt="ASM" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="mt-3 md:mt-6 font-black text-xs md:text-2xl text-primary text-center italic uppercase">ASM</h3>
                  <span className="hidden md:block text-gray-400 font-bold text-xs">نادي أشبال للرياضة</span>
                </div>

                {/* Score / Time Center */}
                <div className="flex flex-col items-center z-10">
                  <div className="bg-gray-900 text-white px-5 md:px-12 py-3 md:py-6 rounded-2xl md:rounded-[2rem] text-xl md:text-5xl font-black tracking-tighter shadow-2xl flex flex-col items-center justify-center min-w-[100px] md:min-w-[180px] border-b-4 border-secondary transition-all group-hover:scale-105" dir="ltr">
                    
                    {/* اللوجيك ديال تبديل النتيجة بالتوقيت */}
                    {m.score === "-:-" ? (
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] md:text-xs uppercase opacity-50 mb-1 tracking-[0.2em]">Kick Off</span>
                            <span className="text-secondary">{m.time || "17:00"}</span>
                        </div>
                    ) : (
                        <span>{m.score}</span>
                    )}

                  </div>
                  <div className="mt-4 md:mt-6 text-[10px] md:text-sm text-gray-400 font-bold flex items-center gap-1.5 bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
                    <span>🏟️</span> {m.stadium}
                  </div>
                </div>

                {/* Opponent Team */}
                <div className="flex-1 flex flex-col items-center z-10 transition-transform group-hover:translate-x-2">
                  <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-full p-2 md:p-5 shadow-xl border border-gray-50 flex items-center justify-center overflow-hidden">
                    {m.opponentLogo ? (
                      <img src={m.opponentLogo} alt={m.opponent} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl md:text-5xl font-black text-gray-200 uppercase">{m.opponent.substring(0, 2)}</span>
                    )}
                  </div>
                  <h3 className="mt-3 md:mt-6 font-black text-xs md:text-2xl text-secondary text-center uppercase italic">
                    {m.opponentShortName || m.opponent.substring(0, 3)}
                  </h3>
                  <span className="hidden md:block text-gray-400 font-bold text-xs uppercase tracking-tighter opacity-70">{m.opponent}</span>
                </div>
              </div>
              
              {/* مسجلي الأهداف (Goal Scorers) */}
              {m.scorers && m.scorers.length > 0 && m.scorers[0] !== "" && (
                <div className="px-6 pb-6 flex justify-center">
                    <div className="bg-[#fef2f2] text-[#991b1b] rounded-full px-5 py-1.5 flex items-center gap-2 border border-red-100 shadow-sm animate-pulse">
                        <span className="text-sm">⚽</span>
                        <p className="text-[10px] md:text-sm font-black italic">{m.scorers.join(' • ')}</p>
                    </div>
                </div>
              )}
              
              {/* معرض صور المباراة (Gallery) */}
              {m.gallery?.length > 0 && (
                <div className="bg-gray-50/50 px-6 py-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg md:text-xl">📸</span>
                    <h4 className="text-[10px] md:text-sm font-black text-primary uppercase tracking-[0.2em] italic">Match Gallery</h4>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x cursor-grab active:cursor-grabbing">
                    {m.gallery.map((img, idx) => (
                      <div key={idx} className="flex-shrink-0 snap-start">
                        <img 
                          src={img} 
                          onClick={() => setSelectedImage(img)}
                          className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-2xl shadow-md border-2 border-white hover:scale-105 hover:rotate-2 transition-all duration-300 cursor-pointer" 
                          alt="Match moment" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* نافذة التكبير (Premium Lightbox) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-gray-950/95 z-[100] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-500 ease-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full flex flex-col items-center">
            <button 
              className="absolute -top-14 right-0 md:-right-10 text-white font-black text-sm md:text-xl p-3 hover:bg-white/10 rounded-full transition"
              onClick={() => setSelectedImage(null)}
            >
              CLOSE ✕
            </button>
            <img 
              src={selectedImage} 
              alt="صورة مكبرة" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;