import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      title: 'Productos',
      description: 'Gestionar catálogo de productos',
      path: '/admin/products',
      icon: '📦',
      color: '#3498db'
    },
    {
      title: 'Categorías',
      description: 'Administrar categorías de productos',
      path: '/admin/categories',
      icon: '🏷️',
      color: '#9b59b6'
    },
    {
      title: 'Servicios',
      description: 'Gestionar servicios disponibles',
      path: '/admin/services',
      icon: '⚙️',
      color: '#1abc9c'
    },
    {
      title: 'Clientes',
      description: 'Administrar usuarios clientes',
      path: '/admin/clients',
      icon: '👥',
      color: '#e67e22'
    },
    {
      title: 'Proveedores',
      description: 'Gestionar proveedores',
      path: '/admin/providers',
      icon: '🏢',
      color: '#f39c12'
    },
    {
      title: 'Administradores',
      description: 'Gestionar usuarios administradores',
      path: '/admin/users',
      icon: '👨‍💼',
      color: '#e74c3c'
    },
    {
      title: 'Roles',
      description: 'Administrar roles del sistema',
      path: '/admin/roles',
      icon: '🎭',
      color: '#95a5a6'
    }
  ];

  const stats = [
    { label: 'Productos', value: '156', change: '+12%', positive: true },
    { label: 'Categorías', value: '8', change: '0%', positive: null },
    { label: 'Clientes', value: '1,234', change: '+5%', positive: true },
    { label: 'Proveedores', value: '45', change: '+2%', positive: true },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>Panel Administrativo</h1>
              <p>Bienvenido, {user?.name}</p>
            </div>
            <div className="header-right">
              <Link to="/" className="view-site-btn">Ver sitio público</Link>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className={`stat-change ${stat.positive === true ? 'positive' : stat.positive === false ? 'negative' : 'neutral'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Menu */}
      <section className="main-menu-section">
        <div className="container">
          <h2>Módulos de Administración</h2>
          <div className="menu-grid">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className="menu-card"
                style={{ '--card-color': item.color }}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h2>Acciones Rápidas</h2>
          <div className="quick-actions">
            <Link to="/admin/products" className="quick-action-btn primary">
              + Nuevo Producto
            </Link>
            <Link to="/admin/categories" className="quick-action-btn secondary">
              + Nueva Categoría
            </Link>
            <Link to="/admin/services" className="quick-action-btn tertiary">
              + Nuevo Servicio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="container">
          <p>&copy; 2025 MiTienda - Panel Administrativo</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
