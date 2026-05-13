import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); 

  // المتغيرات ديال الفورم
  const [opponent, setOpponent] = useState('');
  const [opponentShortName, setOpponentShortName] = useState('');
  const [opponentLogo, setOpponentLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState(''); 
  
  const [date, setDate] = useState('');
  const [stadium, setStadium] = useState('');
  const [score, setScore] = useState('-:-');
  const [ageCategory, setAgeCategory] = useState('U10'); // حدثت الفئة الافتراضية
  const [scorersText, setScorersText] = useState(''); 
  
  const [galleryImages, setGalleryImages] = useState(null); 
  const [existingGallery, setExistingGallery] = useState([]); 

  const fetchMatches = async () => {
    try {
      const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/matches');
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
      Array.from(galleryImages).forEach(file => formData.append('images', file)); // تأكدت من اسم الحقل 'images'
    }

    try {
      if (editingId) {
        await axios.put(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/matches/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث بيانات المباراة بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/matches', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
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
          await axios.delete(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/matches/${id}`, {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة المباريات</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-6 rounded border ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingId ? '✏️ تعديل المباراة' : '➕ إضافة مباراة جديدة'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1">الفريق الخصم</label>
            <input type="text" value={opponent} onChange={(e) => setOpponent(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">اختصار الخصم</label>
            <input type="text" value={opponentShortName} onChange={(e) => setOpponentShortName(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 flex justify-between items-center">
              لوجو الخصم
              {existingLogo && <img src={existingLogo} alt="old logo" className="w-6 h-6 object-contain rounded-full border border-gray-300" />}
            </label>
            <input id="logoInput" type="file" accept="image/*" onChange={(e) => setOpponentLogo(e.target.files[0])} className="w-full p-2 border rounded text-xs" />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">التاريخ</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">الملعب</label>
            <input type="text" value={stadium} onChange={(e) => setStadium(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">النتيجة</label>
            <input type="text" value={score} onChange={(e) => setScore(e.target.value)} className="w-full p-2 border rounded text-left" dir="ltr" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">الفئة العمرية</label>
            <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)} className="w-full p-2 border rounded font-bold" required>
              <option value="براعم">براعم</option>
                <option value="U10">تحت 10 سنوات</option>
                <option value="U11">تحت 11 سنوات</option>
                <option value="U13">تحت 13 سنوات</option>
                <option value="U15">تحت 15 سنوات</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">مسجلي الأهداف</label>
            <input type="text" value={scorersText} onChange={(e) => setScorersText(e.target.value)} className="w-full p-2 border rounded" placeholder="مثال: يوسف، أحمد..." />
          </div>

          <div className="md:col-span-3 border-t pt-4 mt-2">
            <label className="block text-sm font-bold mb-3">صور المباراة (Gallery)</label>
            
            {existingGallery.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4 bg-white p-3 rounded border border-gray-200">
                    <p className="w-full text-xs font-bold text-gray-500 mb-2">الصور الحالية (كليكي على ❌ لمسح الصورة):</p>
                    {existingGallery.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                            <img src={imgUrl} alt="gallery" className="w-20 h-20 object-cover rounded shadow-sm border border-gray-300" />
                            <button 
                                type="button" 
                                onClick={() => removeExistingImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md hover:bg-red-700 transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input id="galleryInput" type="file" multiple accept="image/*" onChange={(e) => setGalleryImages(e.target.files)} className="w-full p-2 border rounded bg-white" />
          </div>

        </div>
        <button type="submit" className={`w-full md:w-auto font-bold px-6 py-2 rounded text-white transition ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة المباراة'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-bold mb-4">المباريات المسجلة</h3>
        {loading ? <p>جاري التحميل...</p> : (
          <table className="w-full text-right border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300 text-sm">
                <th className="p-3">الخصم</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3">الفئة</th>
                <th className="p-3">النتيجة</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-bold flex items-center gap-2">
                    {item.opponentLogo && <img src={item.opponentLogo} alt="logo" className="w-8 h-8 object-contain rounded-full border" />}
                    {item.opponent}
                  </td>
                  <td className="p-3 text-sm text-gray-500">{new Date(item.date).toLocaleDateString('ar-MA')}</td>
                  <td className="p-3"><span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">{item.ageCategory}</span></td>
                  <td className="p-3 font-bold text-center text-primary" dir="ltr">{item.score}</td>
                  <td className="p-3 text-center space-x-2 space-x-reverse">
                    <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs transition">تعديل</button>
                    <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs transition">مسح</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminMatches;