import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import DefaultLayout from './components/DefaultLayout';
import Transactions from './pages/transactions/index';
import Goals from './pages/goals/index';
import Settings from './pages/settings/index';
import Login from './pages/login';

function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {!isLoginPage && (
        <>
          <Route path="/transactions" element={<DefaultLayout><Transactions /></DefaultLayout>} />
          <Route path="/goals" element={<DefaultLayout><Goals /></DefaultLayout>} />
          <Route path="/settings" element={<DefaultLayout><Settings /></DefaultLayout>} />
        </>
      )}
    </Routes>
  );
}

export default App;
