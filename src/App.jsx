import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Track from './pages/Track';
import Login from './pages/admin/Login'; 
import Dashboard from './pages/admin/Dashboard'; 
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Gallery from './pages/Gallery';
import Trainings from './pages/Trainings';
import Footer from './components/Footer';
import Store from './pages/Store';
import AdminGallery from './pages/admin/AdminGallery';
import { SettingsProvider } from './context/SettingsContext';
// صاوبنا هاد المكون باش نقدرو نخدمو بـ useLocation
const AppContent = () => {
  const location = useLocation();
  
  // هنا كنتأكدو واش الرابط كيبدا بـ /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-arabic">
      {/* النافبار غيبان غير يلا ماكناش فصفحة الأدمن */}
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<Track />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetails />} /> 
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/store" element={<Store />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* روابط الأدمن */}
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* حيدت داك الروت ديال AdminStore حيت راك ديجا دايرو وسط Dashboard بالـ State */}
        </Routes>
      </main>

      {/* الفوتر حتى هو غيبان غير يلا ماكناش فصفحة الأدمن */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};
function App() {
  return (
    <SettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </SettingsProvider>
  );
}


export default App;
