import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Explorer } from './pages/Explorer';
import { TenderDetail } from './pages/TenderDetail';
import { MyBids } from './pages/MyBids';
import { AIAssistant } from './pages/AIAssistant';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/explorer" element={<Layout><Explorer /></Layout>} />
        <Route path="/tender/:id" element={<Layout><TenderDetail /></Layout>} />
        <Route path="/bids" element={<Layout><MyBids /></Layout>} />
        <Route path="/ai-assistant" element={<Layout><AIAssistant /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
