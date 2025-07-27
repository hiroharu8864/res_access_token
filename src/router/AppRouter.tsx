import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AccessToken from '../pages/AccessToken';
import VerifyToken from '../pages/VerifyToken';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/access_token" element={<AccessToken />} />
      <Route path="/verify_token" element={<VerifyToken />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}