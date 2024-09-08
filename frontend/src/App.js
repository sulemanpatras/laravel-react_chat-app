import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Message from './components/Message';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Logout from './components/Logout';
import NoPage from './components/NoPage';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="notification" element={<Notification />} />
        <Route path="*" element={<NoPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Message />} />
          <Route path="sidebar" element={<Sidebar />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
