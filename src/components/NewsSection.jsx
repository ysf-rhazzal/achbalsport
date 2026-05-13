import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/news');
        // نأخذ فقط آخر 3 أخبار
        setNews(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="py-10 text-center">جاري تحميل الأخبار...</div>;
  if (news.length === 0) return null; // إيلا ما كاين أخبار ما يبان والو

  return (
    <section className="py-16 bg-white font-arabic">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">آخر أخبار النادي</h2>
            <div className="h-1 w-20 bg-secondary"></div>
          </div>
          <Link to="/news" className="text-primary font-bold hover:text-secondary transition">
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item._id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              {/* صورة الخبر */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>
              
              {/* تفاصيل الخبر */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded font-bold">
                    {item.newsType}
                  </span>
                  <span>{new Date(item.date).toLocaleDateString('ar-MA')}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 h-14">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                <Link 
                  to={`/news/${item._id}`} 
                  className="text-primary font-bold hover:underline inline-block"
                >
                  اقرأ المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;