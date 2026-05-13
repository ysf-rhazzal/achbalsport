import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const NewsDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`https://achbalsportive--youssefrhazzal9.replit.app/api/news/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="py-20 text-center font-bold">جاري تحميل الخبر...</div>;
  if (!item) return <div className="py-20 text-center">الخبر غير موجود.</div>;

  return (
    <div className="bg-white min-h-screen pt-24 pb-12 font-arabic">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/news" className="text-primary hover:underline mb-6 inline-block font-bold">← العودة للأخبار</Link>
        
        <img src={item.image} alt={item.title} className="w-full h-[400px] object-cover rounded-2xl shadow-lg mb-8" />
        
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">{item.newsType}</span>
          <span className="text-gray-500">{new Date(item.date).toLocaleDateString('ar-MA')}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">{item.title}</h1>
        
        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
          {item.description}
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;