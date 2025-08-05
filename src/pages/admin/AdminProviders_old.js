import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminProviders = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <Link to="/admin" className="back-link">← Dashboard</Link>
              <h1>Gestión de Proveedores</h1>
            </div>
            <div className="header-right">
              <Link to="/" className="view-site-btn">Ver sitio público</Link>
              <button onClick={logout} className="logout-btn">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="admin-content">
        <div className="container">
          <div className="content-card">
            <div className="card-header">
              <h2>Proveedores Registrados</h2>
              <button className="btn btn-primary">+ Nuevo Proveedor</button>
            </div>
            <div className="card-body">
              <p>Aquí podrás gestionar todos los usuarios registrados como proveedores.</p>
              <p><strong>Funcionalidades disponibles:</strong></p>
              <ul>
                <li>Crear nuevos proveedores</li>
                <li>Editar información de proveedores</li>
                <li>Eliminar proveedores</li>
                <li>Visualizar lista completa</li>
                <li>Buscar por nombre o email</li>
              </ul>
              <div className="coming-soon">
                <h3>🚧 En desarrollo</h3>
                <p>Este módulo estará disponible en la siguiente fase del proyecto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProviders;
