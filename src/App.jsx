import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Track from './pages/Track';
import Login from './pages/admin/Login'; // <--- زدنا الدخول
import Dashboard from './pages/admin/Dashboard'; // <--- زدنا لوحة التحكم
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Trainings from './pages/Trainings';
import Footer from './components/Footer';
import Store from './pages/Store';
import AdminStore from './pages/admin/AdminStore';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-arabic">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<Track />} />
            
            {/* روابط الأدمن */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetails />} /> 
            <Route path="/players" element={<Players />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/store" element={<Store />} />
// ووسط الـ Route ديال الداشبورد زيد:
            <Route path="store" element={<AdminStore />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;