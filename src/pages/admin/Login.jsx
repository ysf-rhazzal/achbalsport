import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://achbalsportive--youssefrhazzal6.replit.app/api/auth/login', {
        username,
        password
      });
      
      // كنخبيو الساروت (Token) فالمتصفح باش نبقاو مكونيكطين
      localStorage.setItem('adminToken', response.data.token);
      
      // كنديوه نيشان للوحة التحكم
      navigate('/admin/dashboard');
    } catch (err) {
      setError('اسم المستخدم أو كلمة المرور غالطة!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">تسجيل دخول الإدارة</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">اسم المستخدم</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded text-left" 
              dir="ltr"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded text-left" 
              dir="ltr"
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-full text-lg py-3 mt-4">
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;