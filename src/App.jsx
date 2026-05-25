import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/header/header";
import MainPage from './components/main/mainpage';
import BuyPage from '../src/components/buy/buypage';
import LoginPage from '../src/components/registration/login';
import RegistrationPage from './components/registration/registration';
import UserPage from '../src/components/user/user';
import SellPage from '../src/components/sell/sell';
import FavoritesPage from '../src/components/favourite/favourite';
import InsurancePage from './components/insurance/insurance';


// Тимчасові компоненти для перевірки (потім заміниш на свої файли)


const AboutPage = () => <div style={{padding: '100px'}}>Сторінка ПРО НАС</div>;



const App = () => {
  return (
    <Router>
      <Header />
      
      {/* Магія відбувається тут: відображається тільки ОДИН Route, що збігається з URL */}
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
    </Router>
  );
}

export default App;