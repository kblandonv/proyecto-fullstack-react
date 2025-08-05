import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingHome.css';

const LandingHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirigir a la página de productos con el término de búsqueda
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };
  return (
    <div className="landing-home">
      {/* Header/Navigation */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <h2>MiTienda</h2>
          </div>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/products" className="nav-link">Productos</Link>
            <Link to="/categories" className="nav-link">Categorías</Link>
            <Link to="/register" className="nav-link">Registro</Link>
            <Link to="/admin/login" className="nav-link admin-link">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenido a MiTienda</h1>
            <p>La plataforma comercial donde encuentras todo lo que necesitas</p>
            
            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="hero-search">
              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="¿Qué estás buscando?"
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  🔍 Buscar
                </button>
              </div>
            </form>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">Ver Productos</Link>
              <Link to="/register" className="btn btn-secondary">Registrarse</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>¿Qué puedes hacer aquí?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Explora Productos</h3>
              <p>Navega por nuestro catálogo completo de productos organizados por categorías</p>
              <Link to="/products" className="btn btn-outline">Ver Productos</Link>
            </div>
            <div className="feature-card">
              <h3>Registro como Cliente</h3>
              <p>Regístrate como cliente para acceder a funcionalidades adicionales</p>
              <Link to="/register" className="btn btn-outline">Registrarse</Link>
            </div>
            <div className="feature-card">
              <h3>Registro como Proveedor</h3>
              <p>Únete como proveedor y ofrece tus productos en nuestra plataforma</p>
              <Link to="/register" className="btn btn-outline">Ser Proveedor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2025 MiTienda. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingHome;
