import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/common/Toast';
import './AdminPages.css';

function AdminUsers() {
  const { logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  // Estados principales
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    active: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        apiService.users.getAll(),
        apiService.roles.getAll()
      ]);
      
      setUsers(usersResponse.data || []);
      setRoles(rolesResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      addToast('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y paginación
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Funciones del modal
  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      roleId: '',
      active: true
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      roleId: '',
      active: true
    });
    setFormErrors({});
  };

  // Funciones CRUD
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // No mostramos la contraseña
      roleId: user.roleId.toString(),
      active: user.active
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el usuario "${userName}"?`)) {
      try {
        await apiService.users.delete(userId);
        setUsers(prev => prev.filter(user => user.id !== userId));
        addToast(`Usuario "${userName}" eliminado exitosamente`, 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        addToast('Error al eliminar el usuario', 'error');
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const updatedUser = await apiService.users.update(userId, { active: !currentStatus });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, active: !currentStatus } : user
      ));
      addToast(
        `Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`, 
        'success'
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      addToast('Error al cambiar el estado del usuario', 'error');
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'El email no tiene un formato válido';
    }

    if (!editingUser && !formData.password.trim()) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.trim() && formData.password.trim().length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.roleId) {
      errors.roleId = 'El rol es obligatorio';
    }

    // Verificar email duplicado (excepto el usuario que se está editando)
    const existingUser = users.find(user => 
      user.email.toLowerCase() === formData.email.trim().toLowerCase() &&
      user.id !== editingUser?.id
    );

    if (existingUser) {
      errors.email = 'Ya existe un usuario con este email';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        roleId: parseInt(formData.roleId),
        active: formData.active
      };

      // Solo incluir password si se proporcionó
      if (formData.password.trim()) {
        userData.password = formData.password.trim();
      }

      if (editingUser) {
        // Actualizar usuario
        const response = await apiService.users.update(editingUser.id, userData);
        const updatedUser = response.data;

        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? updatedUser : user
        ));

        addToast('Usuario actualizado exitosamente', 'success');
      } else {
        // Crear usuario
        const response = await apiService.users.create(userData);
        const newUser = response.data;

        setUsers(prev => [...prev, newUser]);
        addToast('Usuario creado exitosamente', 'success');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
      addToast(
        editingUser 
          ? 'Error al actualizar el usuario' 
          : 'Error al crear el usuario', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Función helper para obtener nombre de rol
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id == roleId); // Usar == para comparar string con number
    return role ? role.name : 'Sin rol';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <h2>Cargando usuarios...</h2>
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
              <h1>Gestión de Usuarios</h1>
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
              <h2>Usuarios del Sistema</h2>
              <button className="btn btn-primary" onClick={openCreateModal}>
                + Nuevo Usuario
              </button>
            </div>
            
            <div className="card-body">
              {/* Búsqueda */}
              <div className="search-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar usuarios por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              {/* Tabla de usuarios */}
              <div className="table-container">
                {paginatedUsers.length === 0 ? (
                  <div className="empty-state">
                    <h3>No se encontraron usuarios</h3>
                    <p>
                      {searchTerm 
                        ? 'No hay usuarios que coincidan con tu búsqueda' 
                        : 'No hay usuarios registrados en el sistema'
                      }
                    </p>
                    {!searchTerm && (
                      <button className="btn btn-primary" onClick={openCreateModal}>
                        Crear primer usuario
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
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                              <span className="user-name">{user.name}</span>
                            </td>
                            <td>
                              <span className="user-email">{user.email}</span>
                            </td>
                            <td>
                              <span className="role-badge">
                                {getRoleName(user.roleId)}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                                {user.active ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEdit(user)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className={`btn btn-sm ${user.active ? 'btn-warning' : 'btn-success'}`}
                                  onClick={() => toggleUserStatus(user.id, user.active)}
                                  title={user.active ? 'Desactivar' : 'Activar'}
                                >
                                  {user.active ? '⏸️' : '▶️'}
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(user.id, user.name)}
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
              <h3>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Nombre completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                  placeholder="Ej: Juan Pérez"
                />
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                  placeholder="Ej: juan@ejemplo.com"
                />
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Contraseña {!editingUser && '*'}
                  {editingUser && <span className="form-hint">(dejar vacío para mantener actual)</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? 'error' : ''}
                  placeholder={editingUser ? "Nueva contraseña (opcional)" : "Contraseña"}
                />
                {formErrors.password && (
                  <span className="error-message">{formErrors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="roleId">Rol *</label>
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className={formErrors.roleId ? 'error' : ''}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {formErrors.roleId && (
                  <span className="error-message">{formErrors.roleId}</span>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                  Usuario activo
                </label>
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
                    ? (editingUser ? 'Actualizando...' : 'Creando...') 
                    : (editingUser ? 'Actualizar' : 'Crear')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
