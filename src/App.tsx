import { BrowserRouter as Router, Route, Routes, useLocation, Navigate  } from 'react-router-dom';

import DefaultLayout from './components/DefaultLayout';
import Dashboard from './pages/dashboard/index';
import Transactions from './pages/transactions/index';
import Goals from './pages/goals/index';
import Settings from './pages/settings/index';
import Auth from './pages/auth';
import Loading from './pages/auth/Loading';

function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/loading" element={<Loading />} />
      {!isAuth && (
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
