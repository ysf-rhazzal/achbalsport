import { useState, useEffect } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl font-bold text-primary animate-pulse">جاري تحميل تشكيلة الأبطال...</div>
    </div>
  );

  // هاد المصفوفة خاصها تكون مطابقة 100% لداكشي اللي مسجل فالبكاند
  // إيلا رديتيهم U10, U11 فالبكاند، خاصك تبدلهم هنا حتى هما
  const categories = ['U10', 'U11', 'U13', 'U15', 'U17', 'U19', 'Senior'];

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-arabic" dir="rtl">
      <div className="container mx-auto px-4 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 uppercase tracking-tighter">
          أبطال نادي أشبال
        </h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-4"></div>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          تعرف على نجوم المستقبل. هؤلاء هم الأبطال الذين يدافعون عن ألوان النادي بكل فخر وشغف.
        </p>
      </div>

      <div className="container mx-auto px-4">
        {categories.map((cat) => {
          // هاد السطر هو اللي كيدير الفلتر
          const catPlayers = players.filter(p => p.category === cat);
          
          // إيلا مالقاش اللعابة فهاد الفئة مابين والو
          if (catPlayers.length === 0) return null;

          return (
            <div key={cat} className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-gray-800">فئة {cat}</h2>
                <div className="flex-1 h-[2px] bg-gradient-to-l from-secondary to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {catPlayers.map((player) => (
                  <div 
                    key={player._id} 
                    className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
                  >
                    <div className="absolute top-2 left-2 text-7xl font-black text-white/5 z-0 transition-transform duration-500 group-hover:scale-110">
                      {player.number}
                    </div>

                    <div className="h-64 w-full relative overflow-hidden z-10 bg-gray-200">
                      <img 
                        src={player.photo || player.imageUrl || player.image} 
                        alt={player.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    </div>

                    <div className="relative z-20 p-5 text-center -mt-12">
                      <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold mb-3 shadow-lg border border-white/20 transform group-hover:-translate-y-1 transition-transform duration-300">
                        {player.position}
                      </span>
                      <h3 className="font-black text-xl text-white mb-1 tracking-wide">
                        {player.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-gray-400 font-bold">
                        <span className="text-secondary text-lg">#</span>
                        <span className="text-xl">{player.number}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Players;