import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/common/Toast';

function AdminServices() {
  const { logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  // Estados principales
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Cargar servicios
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await apiService.services.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      addToast('Error al cargar los servicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y paginación
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Funciones del modal
  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: ''
    });
    setFormErrors({});
  };

  // Funciones CRUD
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString()
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (serviceId, serviceName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el servicio "${serviceName}"?`)) {
      try {
        await apiService.services.delete(serviceId);
        setServices(prev => prev.filter(service => service.id !== serviceId));
        addToast(`Servicio "${serviceName}" eliminado exitosamente`, 'success');
      } catch (error) {
        console.error('Error deleting service:', error);
        addToast('Error al eliminar el servicio', 'error');
      }
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

    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.price.trim()) {
      errors.price = 'El precio es obligatorio';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.duration.trim()) {
      errors.duration = 'La duración es obligatoria';
    } else if (isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
      errors.duration = 'La duración debe ser un número mayor a 0';
    }

    // Verificar duplicados (excepto el servicio que se está editando)
    const existingService = services.find(service => 
      service.name.toLowerCase() === formData.name.trim().toLowerCase() &&
      service.id !== editingService?.id
    );

    if (existingService) {
      errors.name = 'Ya existe un servicio con este nombre';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };

      if (editingService) {
        // Actualizar servicio
        const response = await apiService.services.update(editingService.id, serviceData);
        const updatedService = response.data;

        setServices(prev => prev.map(service => 
          service.id === editingService.id ? updatedService : service
        ));

        addToast('Servicio actualizado exitosamente', 'success');
      } else {
        // Crear servicio
        const response = await apiService.services.create(serviceData);
        const newService = response.data;

        setServices(prev => [...prev, newService]);
        addToast('Servicio creado exitosamente', 'success');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving service:', error);
      addToast(
        editingService 
          ? 'Error al actualizar el servicio' 
          : 'Error al crear el servicio', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <h2>Cargando servicios...</h2>
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
              <h1>Gestión de Servicios</h1>
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
              <h2>Servicios del Sistema</h2>
              <button className="btn btn-primary" onClick={openCreateModal}>
                + Nuevo Servicio
              </button>
            </div>
            
            <div className="card-body">
              {/* Búsqueda */}
              <div className="search-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar servicios por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              {/* Tabla de servicios */}
              <div className="table-container">
                {paginatedServices.length === 0 ? (
                  <div className="empty-state">
                    <h3>No se encontraron servicios</h3>
                    <p>
                      {searchTerm 
                        ? 'No hay servicios que coincidan con tu búsqueda' 
                        : 'No hay servicios registrados en el sistema'
                      }
                    </p>
                    {!searchTerm && (
                      <button className="btn btn-primary" onClick={openCreateModal}>
                        Crear primer servicio
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
                          <th>Precio</th>
                          <th>Duración</th>
                          <th>Descripción</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedServices.map(service => (
                          <tr key={service.id}>
                            <td>{service.id}</td>
                            <td>
                              <span className="service-name">{service.name}</span>
                            </td>
                            <td>
                              <span className="price">${service.price.toFixed(2)}</span>
                            </td>
                            <td>
                              <span className="duration">{service.duration} min</span>
                            </td>
                            <td>
                              <span className="service-description">
                                {service.description.length > 50 
                                  ? `${service.description.substring(0, 50)}...` 
                                  : service.description
                                }
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEdit(service)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(service.id, service.name)}
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
              <h3>{editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Nombre del servicio *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                  placeholder="Ej: Consultoría Tecnológica"
                />
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Precio *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={formErrors.price ? 'error' : ''}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {formErrors.price && (
                    <span className="error-message">{formErrors.price}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duración (minutos) *</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={formErrors.duration ? 'error' : ''}
                    placeholder="60"
                    min="1"
                  />
                  {formErrors.duration && (
                    <span className="error-message">{formErrors.duration}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? 'error' : ''}
                  placeholder="Describe qué incluye este servicio y sus beneficios"
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
                    ? (editingService ? 'Actualizando...' : 'Creando...') 
                    : (editingService ? 'Actualizar' : 'Crear')
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

export default AdminServices;
