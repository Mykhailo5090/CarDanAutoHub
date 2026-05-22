import { BrowserRouter as Router } from 'react-router-dom'; // Додаємо цей імпорт
import Header from "./components/header/header";

const App = () => {
  return (
    <Router>
      <Header />
      {/* Тут пізніше будуть твої Routes */}
    </Router>
  );
}

export default App;