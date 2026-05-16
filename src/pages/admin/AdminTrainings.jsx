import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [coach, setCoach] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [ageCategory, setAgeCategory] = useState('U10');
  const [notes, setNotes] = useState('');

  const fetchTrainings = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('مشكل فجلب التداريب', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleEditClick = (training) => {
    setEditingId(training._id);
    setTitle(training.title);
    setCoach(training.coach);
    setLocation(training.location);
    setTime(training.time);
    setDate(new Date(training.date).toISOString().split('T')[0]); 
    setAgeCategory(training.ageCategory);
    setNotes(training.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCoach('');
    setLocation('');
    setTime('');
    setDate('');
    setAgeCategory('U10');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const trainingData = {
      title, coach, location, time, date, ageCategory, notes
    };

    try {
      if (editingId) {
        await axios.put(`https://achbalsportive--youssefrhazzal9.replit.app/api/trainings/${editingId}`, trainingData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث الحصة التدريبية بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://achbalsportive--youssefrhazzal9.replit.app/api/trainings', trainingData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'رائع!',
          text: 'تمت إضافة الحصة التدريبية بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      }
      cancelEdit();
      fetchTrainings();
    } catch (error) {
      console.error('مشكل في العملية', error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل أثناء الحفظ، تأكد من البيانات.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'واش متأكد؟',
      text: "ما غتدرش تراجع على مسح هاد الحصة!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1a2e44',
      confirmButtonText: 'نعم، امسحها!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('adminToken');
        try {
          await axios.delete(`https://achbalsportive--youssefrhazzal9.replit.app/api/trainings/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('تم المسح!', 'تم حذف الحصة بنجاح.', 'success');
          fetchTrainings();
        } catch (error) {
          console.error('مشكل في مسح الحصة', error);
          Swal.fire('خطأ!', 'وقع مشكل أثناء المسح.', 'error');
        }
      }
    });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 transition-shadow";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة التداريب</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-5 md:p-6 rounded-xl border ${editingId ? 'bg-yellow-50 border-yellow-200 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{editingId ? '✏️ تعديل الحصة التدريبية' : '➕ إضافة حصة جديدة'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">عنوان الحصة (مثال: لياقة بدنية)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">اسم المدرب</label>
            <input type="text" value={coach} onChange={(e) => setCoach(e.target.value)} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">المكان / الملعب</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} required />
          </div>

     

                   <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">التاريخ</label>
            <div className="relative">
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className={`peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white block appearance-none transition-all ${
                  !date ? 'text-transparent focus:text-gray-800 [&::-webkit-calendar-picker-indicator]:opacity-0 focus:[&::-webkit-calendar-picker-indicator]:opacity-100' : 'text-gray-800'
                }`}
                required 
              />
              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 ${date ? 'opacity-0' : 'opacity-100'}`}>
                يوم/شهر/سنة
              </span>
            </div>
          </div>


          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">الفئة العمرية</label>
            <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)} className={inputClass} required>
              <option value="براعم">براعم</option>
              <option value="تحت 10 سنوات">تحت 10 سنوات</option>
              <option value="تحت 11 سنوات">تحت 11 سنوات</option>
              <option value="تحت 13 سنوات">تحت 13 سنوات</option>
              <option value="تحت 15 سنوات">تحت 15 سنوات</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-bold mb-2 text-gray-700">ملاحظات (اختياري)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثال: إحضار القميص الأزرق..." className={inputClass} />
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-black px-10 py-3 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة الحصة'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">جدول التداريب المبرمجة</h3>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-bold text-primary animate-pulse">جاري التحميل...</p>
          </div>
        ) : (
          <>
            {/* 💻 العرض الخاص بالشاشات الكبيرة (جدول) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-right border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200 text-sm text-gray-600">
                    <th className="p-4">الفئة</th>
                    <th className="p-4">العنوان والمدرب</th>
                    <th className="p-4">التاريخ والتوقيت</th>
                    <th className="p-4">المكان</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                          {item.ageCategory}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500 font-bold mt-1">كوتش: <span className="text-gray-700">{item.coach}</span></p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-gray-700">{new Date(item.date).toLocaleDateString('ar-MA')}</p>
                        <p className="text-xs text-secondary font-black mt-1" dir="ltr">{item.time}</p>
                      </td>
                      <td className="p-4 text-gray-600 font-bold text-sm flex items-center gap-1">
                        📍 {item.location}
                      </td>
                      <td className="p-4 text-center space-x-2 space-x-reverse min-w-[160px]">
                        <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 text-xs font-bold transition-colors shadow-sm">تعديل</button>
                        <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-xs font-bold transition-colors shadow-sm">مسح</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 العرض الخاص بالهواتف (بطاقات - Cards) */}
            <div className="md:hidden flex flex-col gap-4">
              {trainings.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                  
                  {/* شريط لوني فالجنب ديكور */}
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-primary opacity-80"></div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-gray-800 text-lg leading-tight">{item.title}</h4>
                      <span className="text-xs text-gray-500 font-bold">كوتش: {item.coach}</span>
                    </div>
                    <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">
                      {item.ageCategory}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 grid grid-cols-2 gap-y-2 mt-1 text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1">
                      📅 {new Date(item.date).toLocaleDateString('ar-MA')}
                    </span>
                    <span className="flex items-center gap-1 text-secondary" dir="ltr">
                      ⏱️ {item.time}
                    </span>
                    <span className="col-span-2 flex items-center gap-1 pt-1 border-t border-gray-200/60 mt-1">
                      📍 {item.location}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <p className="text-[11px] text-yellow-600 font-bold bg-yellow-50 p-2 rounded border border-yellow-100">
                      📝 ملاحظة: {item.notes}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-gray-100 mt-1">
                    <button onClick={() => handleEditClick(item)} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 text-xs font-bold transition-colors shadow-sm flex justify-center items-center gap-1">
                      ✏️ تعديل
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-xs font-bold transition-colors shadow-sm flex justify-center items-center gap-1">
                      🗑️ مسح
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTrainings;
