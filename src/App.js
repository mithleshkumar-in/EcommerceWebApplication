import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home'; // Make sure this path is correct
import LoginPage from './pages/LoginPage';
import StorePage from './pages/StorePage';
import CartPage from './components/Cart/CartPage';
import ProtectedRoute from './api/ProtectedRoute';
import RegisterPage from "./pages/RegisterPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderSuccessPage from './pages/OrderSuccessPage';
 // Assuming you're using protected routes for authenticated pages

function App() {
  return (
      <Router>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<HomePage />} />

        {/* Login page route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register page route */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Store page (protected) */}
        <Route
          path="/store"
          element={
            <ProtectedRoute>
              <StorePage />
            </ProtectedRoute>
          }
        />

        {/* Cart page (protected) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Routes>
      </Router>
  );
}

export default App;
