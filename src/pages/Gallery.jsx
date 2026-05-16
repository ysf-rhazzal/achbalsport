import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SettingsContext } from '../SettingsContext';

const Gallery = () => {
  const { settings } = useContext(SettingsContext);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('الكل'); // الفيلتر باش نعزلو التصاور
  const [selectedItem, setSelectedItem] = useState(null); // هادي باش نكبرو التصويرة ملي نكليكيو عليها

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/gallery');
        setMedia(response.data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // دالة الفيلتر
  const filteredMedia = filter === 'الكل' 
    ? media 
    : media.filter(item => item.category === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse text-2xl">جاري تحميل المعرض...</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-arabic pb-20" dir="rtl">
      
      {/* 🟢 الهيدر ديال المعرض */}
      <div className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">معرض الصور والفيديو 📸</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
            شاهد أفضل اللحظات، المباريات، والتداريب الخاصة بأبطال {settings?.clubName || 'النادي'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        
        {/* 🟢 أزرار الفلترة (الكل، مباريات، تداريب...) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['الكل', 'مباراة', 'تدريب', 'حدث'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-sm ${
                filter === cat 
                ? 'bg-secondary text-white transform scale-105 shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'الكل' ? 'الكل 🌟' : cat === 'مباراة' ? 'المباريات ⚽' : cat === 'تدريب' ? 'التداريب ⏱️' : 'أحداث 🎊'}
            </button>
          ))}
        </div>

        {/* 🟢 عرض الصور والفيديوهات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group border border-gray-100 transition-transform hover:-translate-y-2"
              onClick={() => setSelectedItem(item)} // ملي كيكليكي كنحلو النافذة
            >
              <div className="h-64 relative bg-black">
                {item.type === 'video' ? (
                  <>
                    <video src={item.mediaUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-secondary/90 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl ml-1">▶</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute top-3 right-3 bg-white/90 text-primary text-xs font-black px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-center line-clamp-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-bold text-xl">
            لا توجد وسائط في هذا القسم حالياً 📭
          </div>
        )}
      </div>

      {/* 🟢 نافذة التكبير (Modal/Lightbox) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <button 
            className="absolute top-6 right-6 text-white hover:text-secondary text-5xl transition-colors z-50"
            onClick={() => setSelectedItem(null)}
          >
            &times;
          </button>
          
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            {selectedItem.type === 'video' ? (
              <video src={selectedItem.mediaUrl} controls autoPlay className="max-h-[80vh] w-full rounded-xl shadow-2xl" />
            ) : (
              <img src={selectedItem.mediaUrl} alt={selectedItem.title} className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl" />
            )}
            <h3 className="text-white text-2xl font-bold mt-6 text-center">{selectedItem.title}</h3>
            <p className="text-gray-400 mt-2 font-bold">{new Date(selectedItem.createdAt).toLocaleDateString('ar-MA')}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
