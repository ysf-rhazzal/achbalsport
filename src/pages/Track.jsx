import { useState } from 'react';
import axios from 'axios';

const Track = () => {
  const [fileNumber, setFileNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('https://achbalsportive--youssefrhazzal6.replit.app/api/registrations/track', {
        fileNumber,
        phone
      });
      setResult(response.data); // غترجع لينا الحالة والملاحظة ديال الأدمن
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('رقم الملف أو رقم الهاتف غير صحيح. تأكد من المعلومات وعاود جرب.');
      } else {
        setError('وقع شي مشكل فالسيرفر. جرب مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  // دالة باش نعطيو لون لكل حالة
  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المراجعة': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'مقبول': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ناقص وثائق': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'مرفوض': return 'bg-red-100 text-red-800 border-red-300';
      case 'العقد جاهز': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'تم التوقيع': return 'bg-green-100 text-green-800 border-green-300';
      case 'التسجيل النهائي': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">تتبع ملف التسجيل</h2>
        <p className="text-gray-600 mb-6 text-center">
          دخل رقم الملف اللي توصلتي بيه ورقم الهاتف ديال ولي الأمر باش تعرف حالة الطلب ديالك.
        </p>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">رقم الملف (مثال: ASH-2026-0001)</label>
            <input 
              type="text" 
              placeholder="ASH-2026-XXXX" 
              value={fileNumber}
              onChange={(e) => setFileNumber(e.target.value.toUpperCase())}
              className="w-full p-3 border rounded text-left"
              dir="ltr"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">رقم هاتف ولي الأمر</label>
            <input 
              type="tel" 
              placeholder="06XX..." 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded text-left"
              dir="ltr"
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-3 mt-4">
            {loading ? 'جاري البحث...' : 'بحث عن الملف'}
          </button>
        </form>

        {/* يلا كان شي خطأ */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded text-center">
            {error}
          </div>
        )}

        {/* النتيجة يلا لقينا الملف */}
        {result && (
          <div className={`mt-8 p-6 border rounded-lg text-center ${getStatusColor(result.status)}`}>
            <h3 className="text-xl font-bold mb-2">حالة الملف:</h3>
            <p className="text-3xl font-black mb-4">{result.status}</p>
            
            {result.adminNote && (
              <div className="mt-4 p-4 bg-white/50 rounded text-right border-t border-black/10">
                <span className="font-bold text-sm">ملاحظة الإدارة:</span>
                <p className="mt-1">{result.adminNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;