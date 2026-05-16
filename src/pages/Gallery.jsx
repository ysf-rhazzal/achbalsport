import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SettingsContext } from '../context/SettingsContext';

const Gallery = () => {
  const { settings } = useContext(SettingsContext);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('الكل'); 
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/gallery');
        setAlbums(response.data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredAlbums = filter === 'الكل' 
    ? albums 
    : albums.filter(album => album.category === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse text-2xl">جاري تحميل المعرض...</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-arabic pb-20" dir="rtl">
      
      {/* 🟢 الهيدر الجديد - ديناميكي كيقرا الألوان من الداشبورد */}
      <div className="pt-16 pb-8 text-center bg-gray-50">
        <h4 className="text-secondary font-bold text-sm tracking-[0.2em] uppercase mb-2">GALLERY & MEDIA</h4>
        {/* حيدنا اللون الثابت ودرنا text-primary */}
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 relative inline-block">
          معرض الألبومات
          {/* حيدنا اللون الثابت ودرنا bg-secondary */}
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-secondary rounded-full"></span>
        </h1>
        <p className="text-gray-500 mt-6 max-w-2xl mx-auto px-4">
          شاهد أفضل اللحظات، المباريات، والتداريب الخاصة بأبطال {settings?.clubName || 'النادي'}
        </p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        
        {/* الفيلتر */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['الكل', 'مباراة', 'تدريب', 'حدث'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-sm ${
                filter === cat 
                ? 'bg-secondary text-white transform scale-105 shadow-md' // رديناها bg-secondary
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'الكل' ? 'الكل 🌟' : cat === 'مباراة' ? 'المباريات ⚽' : cat === 'تدريب' ? 'التداريب ⏱️' : 'أحداث 🎊'}
            </button>
          ))}
        </div>

        {/* عرض الألبومات من برا */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <div 
              key={album._id} 
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group border border-gray-100 transition-transform hover:-translate-y-2 flex flex-col"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="h-56 relative bg-black">
                {album.coverImage?.includes('video') || album.media[0]?.type === 'video' ? (
                  <video src={album.coverImage || album.media[0]?.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                ) : (
                  <img src={album.coverImage || album.media[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
                {/* لون الفئة رديناه text-primary */}
                <div className="absolute top-3 right-3 bg-white/90 text-primary text-xs font-black px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                  {album.category}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm flex items-center gap-2">
                  <span>📸</span> {album.media?.length || 0}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-center">
                {/* لون العنوان رديناه text-primary */}
                <h3 className="font-bold text-primary text-lg text-center line-clamp-2">{album.title}</h3>
                <p className="text-center text-xs text-gray-400 mt-2">{new Date(album.createdAt).toLocaleDateString('ar-MA')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة الألبوم من الداخل */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col p-4 md:p-8 backdrop-blur-md" onClick={() => setSelectedAlbum(null)}>
          
          <div className="flex justify-between items-center text-white mb-6 w-full max-w-6xl mx-auto" onClick={e => e.stopPropagation()}>
            <div>
              {/* لون عنوان الألبوم لداخل رديناه text-secondary */}
              <h2 className="text-2xl md:text-3xl font-black text-secondary mb-1">{selectedAlbum.title}</h2>
              <p className="text-gray-400 text-sm">يحتوي على {selectedAlbum.media.length} ملفات</p>
            </div>
            <button className="text-gray-400 hover:text-white text-4xl bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition" onClick={() => setSelectedAlbum(null)}>&times;</button>
          </div>
          
          <div className="overflow-y-auto flex-1 w-full max-w-6xl mx-auto custom-scrollbar pr-2 pb-10" onClick={e => e.stopPropagation()}>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {selectedAlbum.media.map((item, index) => (
                <div key={index} className="break-inside-avoid rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-white/10 relative group">
                  {item.type === 'video' ? (
                    <video src={item.url} controls className="w-full object-cover" />
                  ) : (
                    <img src={item.url} className="w-full object-cover" loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Gallery;
