import { useState, useEffect } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal6.replit.app/api/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // 🧠 عزل اللاعبين على حساب الفئة (Category)
  const groupedPlayers = players.reduce((acc, player) => {
    const category = player.category || 'فئة غير محددة';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(player);
    return acc;
  }, {});

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse text-2xl">جاري تحميل الأبطال...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-arabic" dir="rtl">
      
      {/* 🟢 إخفاء شريط السكرول باش يبان الديزاين نقي */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="container mx-auto px-4">
        
        {/* الهيدر */}
        <div className="text-center mb-12">
          <h4 className="text-secondary font-bold text-sm tracking-[0.2em] uppercase mb-2">OUR HEROES</h4>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 relative inline-block">
            أبطال نادي أشبال
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-secondary rounded-full"></span>
          </h1>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
            تعرف على نجوم المستقبل. هؤلاء هم الأبطال الذين يدافعون عن ألوان النادي بكل فخر وشغف.
          </p>
        </div>

        {/* عرض اللاعبين مقسمين بالفئات */}
        {Object.keys(groupedPlayers).map((category) => (
          <div key={category} className="mb-10 overflow-hidden">
            
            {/* عنوان الفئة (مثلا: تحت 13 سنة) */}
            <div className="flex items-center gap-4 mb-4 px-2">
              <h2 className="text-2xl font-black text-gray-800">{category}</h2>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* السلايدر الأفقي (السكرول للجنب) */}
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scroll px-2">
              {groupedPlayers[category].map((player) => (
                <div 
                  key={player._id} 
                  // 🔴 هنا عطيناه عرض ثابت w-[160px] باش مايتكسلش فالموبايل
                  className="shrink-0 w-[160px] md:w-[200px] snap-start bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col group cursor-pointer"
                >
                  {/* التصويرة */}
                  <div className="relative h-52 md:h-60 bg-gray-800">
                    <img 
                      src={player.image || player.photo || 'https://via.placeholder.com/150'} 
                      alt={player.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      loading="lazy"
                    />
                    
                    {/* رقم اللعاب */}
                    {player.number && (
                      <div className="absolute top-2 right-2 bg-black/80 text-secondary text-xs font-black px-2 py-1 rounded shadow">
                        {player.number} #
                      </div>
                    )}
                  </div>

                  {/* معلومات اللعاب */}
                  <div className="p-3 text-center flex-1 flex flex-col justify-center">
                    <span className="inline-block bg-secondary/20 text-secondary text-[10px] md:text-xs font-bold px-2 py-1 rounded-full mb-1.5 mx-auto w-fit">
                      {player.position || 'لاعب'}
                    </span>
                    <h3 className="font-bold text-white text-sm md:text-base line-clamp-1">
                      {player.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        ))}

        {/* يلا ماكان حتى لعاب فـ قاعدة البيانات */}
        {players.length === 0 && (
          <div className="text-center text-gray-500 font-bold text-xl mt-10">
            لا يوجد لاعبين حالياً 📭
          </div>
        )}

      </div>
    </div>
  );
};

export default Players;
