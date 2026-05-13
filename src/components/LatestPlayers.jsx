import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LatestPlayers = () => {
  const [latestPlayers, setLatestPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/players');
        // كنعكسو المصفوفة باش نجيبو اللخرين هما اللولين، وكنعزلو غير 3
        const recent = response.data.reverse().slice(0, 3);
        setLatestPlayers(recent);
      } catch (error) {
        console.error('Error fetching latest players:', error);
      }
    };
    fetchPlayers();
  }, []);

  if (latestPlayers.length === 0) return null;

  return (
    <div className="py-20 bg-gray-50 font-arabic" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* العنوان */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-2">نجومنا الجدد</h2>
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
            <p className="text-gray-500 mt-3 font-bold">أحدث الأبطال المنضمين لعائلة نادي أشبال</p>
          </div>
          <Link to="/players" className="hidden md:block bg-white text-primary border-2 border-primary font-bold px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition shadow-sm">
            عرض كل اللاعبين ➔
          </Link>
        </div>

        {/* كوارط اللعابة (نفس ستايل صفحة اللاعبين) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {latestPlayers.map((player) => (
            <div 
              key={player._id} 
              className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
            >
              <div className="absolute top-2 left-2 text-7xl font-black text-white/5 z-0 transition-transform duration-500 group-hover:scale-110">
                {player.number}
              </div>

              <div className="h-72 w-full relative overflow-hidden z-10 bg-gray-200">
                <img 
                  src={player.image || player.photo || player.imageUrl} 
                  alt={player.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
              </div>

              <div className="relative z-20 p-6 text-center -mt-16">
                <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold mb-3 shadow-lg border border-white/20">
                  {player.position}
                </span>
                <h3 className="font-black text-2xl text-white mb-1 tracking-wide">
                  {player.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-400 font-bold mb-2">
                  <span className="text-secondary text-lg">#</span>
                  <span className="text-2xl text-white">{player.number}</span>
                </div>
                <span className="text-xs text-gray-500 bg-black/50 px-3 py-1 rounded-md">فئة {player.category}</span>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
            </div>
          ))}
        </div>

        {/* زر التلفون (حيت خفيناه الفوق) */}
        <div className="mt-10 text-center md:hidden">
          <Link to="/players" className="inline-block bg-white text-primary border-2 border-primary font-bold px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition shadow-sm">
            عرض كل اللاعبين
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LatestPlayers;