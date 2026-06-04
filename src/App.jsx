import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/header/header";
import MainPage from './components/main/mainpage';
import BuyPage from '../src/components/buy/buypage';
import LoginPage from '../src/components/registration/login';
import RegistrationPage from './components/registration/registration';
import UserPage from '../src/components/user/user';
import SellPage from '../src/components/sell/sell';
import FavoritesPage from '../src/components/favourite/favourite';
import InsurancePage from './components/insurance/insurance';
import Footer from './components/footer/footer';
import InsuranceForm from './components/insurance/insuranceForm';
import OffersGrid from './components/insurance/offersGrid';

const AboutPage = () => <div style={{padding: '100px'}}>Сторінка ПРО НАС</div>;

const AppLayout = () => {
  const location = useLocation();
  const hideLayoutRoutes = ['/login', '/registration'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {/* Рендеримо Header, якщо ми не на сторінках логіну/реєстрації */}
      {!shouldHideLayout && <Header />}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/profile" element={<UserPage />} />
        
      </Routes>

      {/* Рендеримо Footer за тією ж умовою */}
      {!shouldHideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;