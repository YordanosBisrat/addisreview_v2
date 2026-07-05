import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { ToastProvider } from './hooks/useToast';
import { AuthProvider } from './hooks/useAuth';
import Home from './pages/Home';
import BusinessDetails from './pages/BusinessDetails';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/business/:id" element={<BusinessDetails />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
