import { useState, useEffect } from 'react';
import axios from 'axios';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal6.replit.app/api/trainings');
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-arabic">
      <div className="text-xl font-black text-primary animate-bounce tracking-widest uppercase">جاري تحميل جدول التداريب...</div>
    </div>
  );

  // 💡 القالب كان هنا: الفئات خاصهم يكونو بحال لي فـ الداشبورد (AdminTrainings)
  const categories = ['براعم', 'تحت 10 سنوات', 'تحت 11 سنوات', 'تحت 13 سنوات', 'تحت 15 سنوات'];

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-24 pb-20 font-arabic" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* هيدر الصفحة */}
        <div className="text-center mb-16">
          <span className="text-secondary font-black text-sm uppercase tracking-[0.3em] mb-2 block">Training Schedule</span>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">برنامج التداريب الأسبوعي</h1>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-bold">
            هنا تجدون مواعيد الحصص التدريبية لكل الفئات العمرية. نرجو من الجميع الالتزام بالحضور قبل <span className="text-secondary font-black">15 دقيقة</span> من بداية الحصة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {categories.map((cat) => {
            // فلتر حسب الفئة
            const catTrainings = trainings.filter(t => t.ageCategory === cat);
            if (catTrainings.length === 0) return null; // يلا كانت الفئة مافيها تاشي تدريب ماغاديش تبان الكارد

            return (
              <div key={cat} className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 flex flex-col">
                
                {/* رأس البطاقة */}
                <div className="bg-[#1a2e44] p-6 flex justify-between items-center text-white">
                  <h2 className="text-2xl font-black italic flex items-center gap-3">
                    <span className="bg-secondary p-2 rounded-lg text-white shadow-lg">⚽</span>
                    فئة {cat}
                  </h2>
                  <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Weekly Sessions</span>
                </div>

                <div className="p-6 space-y-4 flex-1">
                  {catTrainings.map((t) => (
                    <div key={t._id} className="group bg-gray-50 p-5 rounded-2xl border border-transparent hover:border-secondary/20 hover:bg-white hover:shadow-xl transition-all duration-300 flex justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-black text-lg text-primary group-hover:text-secondary transition-colors">{t.title}</h3>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-400">
                          <p className="flex items-center gap-1">
                            <span className="text-primary">👤</span> {t.coach}
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="text-primary">📍</span> {t.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-left flex flex-col items-end">
                        <div className="bg-[#1a2e44] text-white px-4 py-2 rounded-xl font-black text-lg md:text-xl shadow-lg mb-2 tracking-tighter" dir="ltr">
                          {t.time}
                        </div>
                        <p className="bg-secondary/10 text-secondary px-3 py-0.5 rounded-full text-[10px] font-black uppercase italic">
                          {new Date(t.date).toLocaleDateString('ar-MA', { weekday: 'long' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ملاحظات الفئة (كيبين الملاحظة ديال أول تدريب فالفئة) */}
                {catTrainings[0].notes && (
                   <div className="px-6 py-4 bg-secondary/5 border-t border-secondary/10">
                      <p className="text-xs text-secondary font-bold flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        ملاحظة: {catTrainings[0].notes}
                      </p>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Trainings;
