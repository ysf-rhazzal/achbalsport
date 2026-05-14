import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/registrations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(response.data);
      } catch (error) {
        console.error('مشكل فجلب البيانات', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://achbalsportive--youssefrhazzal9.replit.app/api/registrations/${id}/status`, 
        { status: newStatus, adminNote: 'تمت المراجعة من طرف الإدارة' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRegistrations(registrations.map(reg => 
        reg._id === id ? { ...reg, status: newStatus } : reg
      ));
      
      if(selectedReg && selectedReg._id === id) {
          setSelectedReg({...selectedReg, status: newStatus});
      }

      Swal.fire({
        title: 'تم التحديث!',
        text: 'تم تغيير حالة الملف بنجاح.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: '#1a2e44'
      });

    } catch (error) {
      console.error('مشكل فتغيير الحالة', error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل، ما تبدلاتش الحالة.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const getDownloadUrl = (url) => {
    if(!url) return '#';
    return url.replace('/upload/', '/upload/fl_attachment/');
  };

  // دالة صغيرة باش تعطينا اللون ديال الحالة
  const getStatusBadgeClass = (status) => {
    if (status === 'مقبول') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'مرفوض') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl font-bold text-primary animate-pulse italic">جاري تحميل التسجيلات...</div>
    </div>
  );

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">طلبات التسجيل</h2>
      
      {/* ========================================= */}
      {/* 💻 العرض الخاص بالشاشات الكبيرة (جدول) */}
      {/* ========================================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200 text-sm text-gray-600">
              <th className="p-4 rounded-tr-lg">رقم الملف</th>
              <th className="p-4">اسم الطفل</th>
              <th className="p-4">ولي الأمر</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center rounded-tl-lg">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-black text-primary tracking-wider">{reg.fileNumber}</td>
                <td className="p-4 font-bold text-gray-800">{reg.childInfo?.fullName}</td>
                <td className="p-4 text-gray-600">{reg.parentInfo?.fullName}</td>
                <td className="p-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${getStatusBadgeClass(reg.status)}`}>
                      {reg.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => setSelectedReg(reg)} className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-opacity-90 text-xs font-bold transition shadow-sm">
                    عرض التفاصيل
                  </button>
                  <select value={reg.status} onChange={(e) => handleStatusChange(reg._id, e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary/20">
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="ناقص وثائق">ناقص وثائق</option>
                    <option value="مقبول">مقبول</option>
                    <option value="مرفوض">مرفوض</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================= */}
      {/* 📱 العرض الخاص بالهواتف (بطاقات - Cards) */}
      {/* ========================================= */}
      <div className="md:hidden flex flex-col gap-4">
        {registrations.map((reg) => (
          <div key={reg._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
            {/* خط لوني على جنب البطاقة باش يعطي ديكور زوين */}
            <div className={`absolute right-0 top-0 bottom-0 w-1 ${
              reg.status === 'مقبول' ? 'bg-green-500' : 
              reg.status === 'مرفوض' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
              <span className="font-black text-primary tracking-wider">{reg.fileNumber}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusBadgeClass(reg.status)}`}>
                  {reg.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs font-bold">اسم الطفل:</span>
                <span className="font-bold text-gray-800">{reg.childInfo?.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs font-bold">ولي الأمر:</span>
                <span className="font-bold text-gray-800">{reg.parentInfo?.fullName}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => setSelectedReg(reg)} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold transition shadow-sm flex items-center justify-center gap-2">
                📄 عرض التفاصيل
              </button>
              <select value={reg.status} onChange={(e) => handleStatusChange(reg._id, e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 text-center">
                <option value="قيد المراجعة">تغيير الحالة: قيد المراجعة</option>
                <option value="ناقص وثائق">تغيير الحالة: ناقص وثائق</option>
                <option value="مقبول">تغيير الحالة: مقبول</option>
                <option value="مرفوض">تغيير الحالة: مرفوض</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================= */}
      {/* النافذة المنبثقة (Modal) لعرض تفاصيل الملف */}
      {/* ========================================= */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
            
            {/* بوطونة الإغلاق الفوق */}
            <button onClick={() => setSelectedReg(null)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
              ✕
            </button>

            <div className="border-b pb-4 mb-5 pr-8">
              <h2 className="text-xl md:text-2xl font-black text-primary italic uppercase tracking-tighter">تفاصيل الملف: {selectedReg.fileNumber}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
              <div className="bg-gray-50/80 p-4 md:p-5 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-primary border-b border-gray-200 pb-2 mb-4 italic">🏃 معلومات الطفل</h3>
                <div className="space-y-3 font-bold text-gray-700">
                    <p className="flex justify-between border-b border-gray-200/50 pb-1"><span className="text-gray-400">الاسم الكامل:</span> <span>{selectedReg.childInfo?.fullName}</span></p>
                    <p className="flex justify-between border-b border-gray-200/50 pb-1"><span className="text-gray-400">تاريخ الازدياد:</span> <span>{new Date(selectedReg.childInfo?.birthDate).toLocaleDateString()}</span></p>
                    <p className="flex justify-between pb-1"><span className="text-gray-400">الفئة:</span> <span>{selectedReg.childInfo?.ageCategory}</span></p>
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 md:p-5 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-primary border-b border-gray-200 pb-2 mb-4 italic">👨‍👩‍👧 معلومات ولي الأمر</h3>
                <div className="space-y-3 font-bold text-gray-700">
                    <p className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200/50 pb-1"><span className="text-gray-400 mb-1 sm:mb-0">الاسم الكامل:</span> <span>{selectedReg.parentInfo?.fullName}</span></p>
                    <p className="flex justify-between border-b border-gray-200/50 pb-1"><span className="text-gray-400">الهاتف:</span> <span dir="ltr" className="text-secondary tracking-widest">{selectedReg.parentInfo?.phone}</span></p>
                    <p className="flex justify-between pb-1"><span className="text-gray-400">الرقم الوطني:</span> <span>{selectedReg.parentInfo?.cin}</span></p>
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 md:p-5 rounded-2xl border border-gray-100 md:col-span-2">
                <h3 className="text-lg font-black text-primary border-b border-gray-200 pb-2 mb-4 italic">📄 الوثائق المرفوعة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-bold text-center">
                  {selectedReg.documents?.childPhoto && <a href={getDownloadUrl(selectedReg.documents.childPhoto)} target="_blank" rel="noopener noreferrer" className="bg-white border px-3 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm w-full">📸 صورة الطفل</a>}
                  {selectedReg.documents?.schoolCertificate && <a href={getDownloadUrl(selectedReg.documents.schoolCertificate)} target="_blank" rel="noopener noreferrer" className="bg-white border px-3 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm w-full">📜 الشهادة المدرسية</a>}
                  {selectedReg.documents?.parentCinCopy && <a href={getDownloadUrl(selectedReg.documents.parentCinCopy)} target="_blank" rel="noopener noreferrer" className="bg-white border px-3 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm w-full">🪪 نسخة البطاقة</a>}
                  {selectedReg.documents?.medicalCertificate && <a href={getDownloadUrl(selectedReg.documents.medicalCertificate)} target="_blank" rel="noopener noreferrer" className="bg-white border px-3 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm w-full">🩺 الشهادة الطبية</a>}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedReg(null)} className="w-full md:w-auto bg-gray-800 text-white font-black px-10 py-3 rounded-xl hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm shadow-md">إغلاق النافذة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
