import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { checkDefaultUsers } from './features/auth/authSlice';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AdminManagement from './components/AdminManagement';
import UserManagement from './components/UserManagement';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkDefaultUsers());
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/user" element={<Login userType="user" />} />
          <Route path="/login/admin" element={<Login userType="admin" />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/manage-users" element={<UserManagement />} />
          <Route path="/manage-admins" element={<AdminManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
