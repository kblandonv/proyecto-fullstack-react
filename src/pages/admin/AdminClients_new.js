import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/common/Toast';
import './AdminPages.css';

function AdminClients() {
  const { logout } = useContext(AuthContext);
  const { toasts, addToast, removeToast } = useToast();

  // Estados principales
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar clientes
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await apiService.clients.getAll();
      setClients(response.data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      addToast('Error al cargar los clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <h2>Cargando clientes...</h2>
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
              <h1>Gestión de Clientes</h1>
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
              <h2>Clientes Registrados</h2>
            </div>
            
            <div className="card-body">
              <div className="info-section">
                <p>📊 <strong>Total de clientes:</strong> {clients.length}</p>
                
                {clients.length > 0 ? (
                  <div className="simple-table">
                    <h3>Últimos clientes registrados:</h3>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.slice(0, 5).map(client => (
                          <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{client.phone || 'No registrado'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <h3>No hay clientes registrados</h3>
                    <p>Los clientes se registran automáticamente cuando realizan pedidos o se registran en el sitio web.</p>
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

export default AdminClients;
