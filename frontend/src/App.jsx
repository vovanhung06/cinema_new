import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './routes/AppRouter.jsx';
import ScrollToTop from './components/shared/ScrollToTop.jsx';
import WelcomeSplash from './components/shared/WelcomeSplash.jsx';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <WelcomeSplash />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}
