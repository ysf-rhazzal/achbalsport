import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); 

  const [opponent, setOpponent] = useState('');
  const [opponentShortName, setOpponentShortName] = useState('');
  const [opponentLogo, setOpponentLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState(''); 
  
  const [date, setDate] = useState('');
  const [stadium, setStadium] = useState('');
  const [score, setScore] = useState('-:-');
  const [ageCategory, setAgeCategory] = useState('U10');
  const [scorersText, setScorersText] = useState(''); 
  
  const [galleryImages, setGalleryImages] = useState(null); 
  const [existingGallery, setExistingGallery] = useState([]); 

  const fetchMatches = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal6.replit.app/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleEditClick = (match) => {
    setEditingId(match._id);
    setOpponent(match.opponent);
    setOpponentShortName(match.opponentShortName || '');
    setDate(new Date(match.date).toISOString().split('T')[0]); 
    setStadium(match.stadium);
    setScore(match.score);
    setAgeCategory(match.ageCategory);
    setScorersText(match.scorers ? match.scorers.join(', ') : '');
    setExistingLogo(match.opponentLogo || '');
    setExistingGallery(match.gallery || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingGallery(existingGallery.filter((_, index) => index !== indexToRemove));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setOpponent('');
    setOpponentShortName('');
    setOpponentLogo(null);
    setExistingLogo('');
    setDate('');
    setStadium('');
    setScore('-:-');
    setAgeCategory('U10');
    setScorersText('');
    setGalleryImages(null);
    setExistingGallery([]);
    if(document.getElementById('galleryInput')) document.getElementById('galleryInput').value = ''; 
    if(document.getElementById('logoInput')) document.getElementById('logoInput').value = ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    formData.append('opponent', opponent);
    formData.append('opponentShortName', opponentShortName);
    formData.append('date', date);
    formData.append('stadium', stadium);
    formData.append('score', score);
    formData.append('ageCategory', ageCategory);
    
    if (opponentLogo) formData.append('opponentLogo', opponentLogo);
    
    if (scorersText.trim()) {
      const scorersArray = scorersText.split(',').map(s => s.trim());
      scorersArray.forEach(scorer => formData.append('scorers', scorer));
    }

    if (existingGallery.length > 0) {
        existingGallery.forEach(url => formData.append('existingGallery', url));
    }

    if (galleryImages) {
      Array.from(galleryImages).forEach(file => formData.append('images', file));
    }

    try {
      if (editingId) {
        await axios.put(`https://achbalsportive--youssefrhazzal6.replit.app/api/matches/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث بيانات المباراة بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://achbalsportive--youssefrhazzal6.replit.app/api/matches', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'رائع!',
          text: 'تمت إضافة المباراة بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      }
      cancelEdit(); 
      fetchMatches(); 
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل أثناء الحفظ، تأكد من البيانات والسيرفر.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'واش متأكد؟',
      text: "ما غتدرش تراجع على مسح هاد المباراة!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1a2e44',
      confirmButtonText: 'نعم، امسحها!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://achbalsportive--youssefrhazzal6.replit.app/api/matches/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          });
          fetchMatches();
          Swal.fire('تم المسح!', 'تم حذف المباراة بنجاح.', 'success');
        } catch (error) {
          console.error(error);
          Swal.fire('خطأ!', 'وقع مشكل أثناء المسح.', 'error');
        }
      }
    });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 transition-shadow";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة المباريات</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-5 md:p-6 rounded-xl border ${editingId ? 'bg-yellow-50 border-yellow-200 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{editingId ? '✏️ تعديل المباراة' : '➕ إضافة مباراة جديدة'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">الفريق الخصم</label>
            <input type="text" value={opponent} onChange={(e) => setOpponent(e.target.value)} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">اختصار الخصم</label>
            <input type="text" value={opponentShortName} onChange={(e) => setOpponentShortName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 flex justify-between items-center text-gray-700">
              لوجو الخصم
              {existingLogo && <img src={existingLogo} alt="old logo" className="w-8 h-8 object-contain rounded-full border border-gray-300 shadow-sm" />}
            </label>
            <input id="logoInput" type="file" accept="image/*" onChange={(e) => setOpponentLogo(e.target.files[0])} className={`${inputClass} !py-2`} />
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
            <label className="block text-sm font-bold mb-2 text-gray-700">الملعب</label>
            <input type="text" value={stadium} onChange={(e) => setStadium(e.target.value)} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">النتيجة</label>
            <input type="text" value={score} onChange={(e) => setScore(e.target.value)} className={`${inputClass} text-center font-bold tracking-widest`} dir="ltr" />
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

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700">مسجلي الأهداف</label>
            <input type="text" value={scorersText} onChange={(e) => setScorersText(e.target.value)} className={inputClass} placeholder="مثال: يوسف، أحمد..." />
          </div>

          <div className="md:col-span-2 lg:col-span-3 border-t border-gray-200 pt-5 mt-2">
            <label className="block text-sm font-bold mb-3 text-gray-700">صور المباراة (Gallery)</label>
            
            {existingGallery.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                    <p className="w-full text-xs font-bold text-gray-500 mb-1">الصور الحالية (كليكي على ❌ لمسح الصورة):</p>
                    {existingGallery.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                            <img src={imgUrl} alt="gallery" className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200" />
                            <button 
                                type="button" 
                                onClick={() => removeExistingImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shadow-md hover:bg-red-700 hover:scale-110 transition-all"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input id="galleryInput" type="file" multiple accept="image/*" onChange={(e) => setGalleryImages(e.target.files)} className={`${inputClass} !py-2 bg-white`} />
          </div>

        </div>
        <button type="submit" className={`w-full md:w-auto font-black px-10 py-3 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة المباراة'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">المباريات المسجلة</h3>
        
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
                    <th className="p-4">الخصم</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">الفئة</th>
                    <th className="p-4 text-center">النتيجة</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-bold flex items-center gap-3">
                        {item.opponentLogo ? (
                          <img src={item.opponentLogo} alt="logo" className="w-10 h-10 object-contain rounded-full border border-gray-200 shadow-sm bg-white" />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 text-xs">شعار</div>
                        )}
                        <span className="text-gray-800">{item.opponent}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 font-bold">{new Date(item.date).toLocaleDateString('ar-MA')}</td>
                      <td className="p-4">
                        <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-black uppercase">
                          {item.ageCategory}
                        </span>
                      </td>
                      <td className="p-4 font-black text-center text-lg text-primary tracking-widest" dir="ltr">{item.score}</td>
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
              {matches.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-primary opacity-20"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      {item.opponentLogo ? (
                        <img src={item.opponentLogo} alt="logo" className="w-12 h-12 object-contain rounded-full border border-gray-200 shadow-sm bg-white" />
                      ) : (
                        <div className="w-12 h-12 rounded-full border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-bold">بدون</div>
                      )}
                      <div>
                        <h4 className="font-black text-gray-800 text-base">{item.opponent}</h4>
                        <span className="text-xs text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                          📅 {new Date(item.date).toLocaleDateString('ar-MA')}
                        </span>
                      </div>
                    </div>
                    
                    <span className="bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase whitespace-nowrap">
                      {item.ageCategory}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">النتيجة</span>
                    <span className="font-black text-2xl text-primary tracking-widest" dir="ltr">{item.score}</span>
                  </div>
                  
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

export default AdminMatches;
