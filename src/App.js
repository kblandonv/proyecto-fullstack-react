import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Páginas Landing
import LandingHome from './pages/landing/LandingHome';
import ProductsPage from './pages/landing/ProductsPage';
import CategoriesPage from './pages/landing/CategoriesPage';
import RegisterPage from './pages/landing/RegisterPage';

// Páginas Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminServices from './pages/admin/AdminServices';
import AdminClients from './pages/admin/AdminClients';
import AdminProviders from './pages/admin/AdminProviders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRoles from './pages/admin/AdminRoles';

// Componentes de protección de rutas
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas - Landing */}
            <Route path="/" element={<LandingHome />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Login administrativo */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Rutas protegidas - Admin */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/services" 
              element={
                <ProtectedRoute>
                  <AdminServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/clients" 
              element={
                <ProtectedRoute>
                  <AdminClients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/providers" 
              element={
                <ProtectedRoute>
                  <AdminProviders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/roles" 
              element={
                <ProtectedRoute>
                  <AdminRoles />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
