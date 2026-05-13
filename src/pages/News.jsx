import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNews();
  }, []);

  if (loading) return <div className="py-20 text-center font-bold">جاري تحميل جميع الأخبار...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-arabic">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">أخبار النادي</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <span className="text-secondary font-bold text-sm">{item.newsType}</span>
                <h2 className="text-xl font-bold mt-2 mb-3">{item.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                   <span className="text-gray-400 text-xs">{new Date(item.date).toLocaleDateString('ar-MA')}</span>
                   <Link to={`/news/${item._id}`} className="text-primary font-bold hover:underline">اقرأ الخبر</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;