import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import SearchDonors from './pages/SearchDonors';
import CreateRequest from './pages/CreateRequest';
import ViewRequests from './pages/ViewRequests';
import Dashboard from './pages/Dashboard';
import { Search, Bell, LogIn, UserPlus, LogOut, PlusCircle, LayoutDashboard, ShieldCheck } from 'lucide-react';
import AdminPanel from './pages/AdminPanel';
function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <NavLink to="/" className="brand">
          <span className="pulse-dot"></span>
          ResQConnect
        </NavLink>
        <div className="nav-links">
          <NavLink to="/search" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Search size={16} /> Find Donors
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Bell size={16} /> View Requests
          </NavLink>
          {user && (
            <NavLink to="/request" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <PlusCircle size={16} /> Create Request
            </NavLink>
          )}
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <ShieldCheck size={16} /> Admin
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <LogIn size={16} /> Login
              </NavLink>
              <NavLink to="/register" className="nav-link-cta">
                <UserPlus size={16} /> Register
              </NavLink>
            </>
          )}
          {user && (
            <>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="nav-logout" onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchDonors />} />
        <Route path="/request" element={<CreateRequest />} />
        <Route path="/requests" element={<ViewRequests />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

export default App;