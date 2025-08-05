import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/common/Toast';
import './AdminPages.css';

function AdminProviders() {
  const { logout } = useContext(AuthContext);
  const { toasts, addToast, removeToast } = useToast();

  // Estados principales
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar proveedores
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await apiService.providers.getAll();
      setProviders(response.data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      addToast('Error al cargar los proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <h2>Cargando proveedores...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
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
              <h2>Proveedores del Sistema</h2>
            </div>
            
            <div className="card-body">
              <div className="info-section">
                <p>📊 <strong>Total de proveedores:</strong> {providers.length}</p>
                
                {providers.length > 0 ? (
                  <div className="simple-table">
                    <h3>Proveedores registrados:</h3>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Empresa</th>
                          <th>Contacto</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providers.slice(0, 5).map(provider => (
                          <tr key={provider.id}>
                            <td><strong>{provider.company}</strong></td>
                            <td>{provider.contactName}</td>
                            <td>{provider.email}</td>
                            <td>{provider.phone || 'No registrado'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <h3>No hay proveedores registrados</h3>
                    <p>Los proveedores son empresas que suministran productos o servicios al sistema.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminProviders;
