import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rolesService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/common/Toast';
import './AdminPages.css';
import './AdminRoles.css';

const AdminRoles = () => {
  const { logout } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  // Estados para el CRUD
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Cargar roles al montar el componente
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await rolesService.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Error loading roles:', error);
      showError('Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar y paginar roles
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      if (editingRole) {
        await rolesService.update(editingRole.id, formData);
        showSuccess('Rol actualizado correctamente');
      } else {
        await rolesService.create(formData);
        showSuccess('Rol creado correctamente');
      }
      
      await loadRoles(); // Recargar datos
      closeModal();
    } catch (error) {
      console.error('Error submitting role:', error);
      showError('Error al guardar el rol');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (roleId, roleName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el rol "${roleName}"?`)) {
      return;
    }
    
    try {
      await rolesService.delete(roleId);
      await loadRoles(); // Recargar datos
      showSuccess('Rol eliminado correctamente');
    } catch (error) {
      console.error('Error deleting role:', error);
      showError('Error al eliminar el rol');
    }
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="admin-page">
        <header className="admin-header">
          <div className="container">
            <div className="header-content">
              <div className="header-left">
                <Link to="/admin" className="back-link">← Dashboard</Link>
                <h1>Gestión de Roles</h1>
              </div>
            </div>
          </div>
        </header>
        <section className="admin-content">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner">Cargando roles...</div>
            </div>
          </div>
        </section>
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
              <h1>Gestión de Roles</h1>
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
              <h2>Roles del Sistema</h2>
              <button className="btn btn-primary" onClick={openCreateModal}>
                + Nuevo Rol
              </button>
            </div>
            
            <div className="card-body">
              {/* Búsqueda */}
              <div className="search-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar roles por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              {/* Tabla de roles */}
              <div className="table-container">
                {paginatedRoles.length === 0 ? (
                  <div className="empty-state">
                    <h3>No se encontraron roles</h3>
                    <p>
                      {searchTerm 
                        ? 'No hay roles que coincidan con tu búsqueda' 
                        : 'No hay roles registrados en el sistema'
                      }
                    </p>
                    {!searchTerm && (
                      <button className="btn btn-primary" onClick={openCreateModal}>
                        Crear primer rol
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRoles.map(role => (
                          <tr key={role.id}>
                            <td>{role.id}</td>
                            <td>
                              <span className="role-name">{role.name}</span>
                            </td>
                            <td>
                              <span className="role-description">{role.description}</span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEdit(role)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(role.id, role.name)}
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </button>
                        
                        <span className="pagination-info">
                          Página {currentPage} de {totalPages}
                        </span>
                        
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Nombre del rol *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                  placeholder="Ej: Administrador"
                />
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? 'error' : ''}
                  placeholder="Describe los permisos y responsabilidades de este rol"
                  rows="4"
                />
                {formErrors.description && (
                  <span className="error-message">{formErrors.description}</span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting 
                    ? (editingRole ? 'Actualizando...' : 'Creando...') 
                    : (editingRole ? 'Actualizar' : 'Crear')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
