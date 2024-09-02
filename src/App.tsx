import { BrowserRouter as Router, Route, Routes, useLocation, Navigate  } from 'react-router-dom';

import DefaultLayout from './components/DefaultLayout';
import Dashboard from './pages/dashboard/index';
import Transactions from './pages/transactions/index';
import Goals from './pages/goals/index';
import Settings from './pages/settings/index';
import Login from './pages/login';
import Loading from './pages/login/Loading';

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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loading" element={<Loading />} />
      {!isLoginPage && (
        <>
          <Route path="/dashboard" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
          <Route path="/transactions" element={<DefaultLayout><Transactions /></DefaultLayout>} />
          <Route path="/goals" element={<DefaultLayout><Goals /></DefaultLayout>} />
          <Route path="/settings" element={<DefaultLayout><Settings /></DefaultLayout>} />
        </>
      )}
    </Routes>
  );
}

export default App;
