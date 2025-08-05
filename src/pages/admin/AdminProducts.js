import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/common/Toast';

function AdminProducts() {
  const { logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  // Estados principales
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    stock: '',
    categoryId: '',
    image: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.products.getAll(),
        apiService.categories.getAll()
      ]);
      
      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      addToast('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y paginación
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Funciones del modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      image: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: ''
    });
    setFormErrors({});
  };

  // Funciones CRUD
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId.toString(),
      image: product.image || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
      try {
        await apiService.products.delete(productId);
        setProducts(prev => prev.filter(product => product.id !== productId));
        addToast(`Producto "${productName}" eliminado exitosamente`, 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        addToast('Error al eliminar el producto', 'error');
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

    if (!formData.stock.trim()) {
      errors.stock = 'El stock es obligatorio';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'La categoría es obligatoria';
    }

    // Verificar duplicados (excepto el producto que se está editando)
    const existingProduct = products.find(product => 
      product.name.toLowerCase() === formData.name.trim().toLowerCase() &&
      product.id !== editingProduct?.id
    );

    if (existingProduct) {
      errors.name = 'Ya existe un producto con este nombre';
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
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingProduct) {
        // Actualizar producto
        const response = await apiService.products.update(editingProduct.id, productData);
        const updatedProduct = response.data;

        setProducts(prev => prev.map(product => 
          product.id === editingProduct.id ? updatedProduct : product
        ));

        addToast('Producto actualizado exitosamente', 'success');
      } else {
        // Crear producto
        const response = await apiService.products.create(productData);
        const newProduct = response.data;

        setProducts(prev => [...prev, newProduct]);
        addToast('Producto creado exitosamente', 'success');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      addToast(
        editingProduct 
          ? 'Error al actualizar el producto' 
          : 'Error al crear el producto', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Función helper para obtener nombre de categoría
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id == categoryId); // Usar == para comparar string con number
    return category ? category.name : 'Sin categoría';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <h2>Cargando productos...</h2>
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
              <h1>Gestión de Productos</h1>
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
              <h2>Productos del Sistema</h2>
              <button className="btn btn-primary" onClick={openCreateModal}>
                + Nuevo Producto
              </button>
            </div>
            
            <div className="card-body">
              {/* Búsqueda */}
              <div className="search-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar productos por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              {/* Tabla de productos */}
              <div className="table-container">
                {paginatedProducts.length === 0 ? (
                  <div className="empty-state">
                    <h3>No se encontraron productos</h3>
                    <p>
                      {searchTerm 
                        ? 'No hay productos que coincidan con tu búsqueda' 
                        : 'No hay productos registrados en el sistema'
                      }
                    </p>
                    {!searchTerm && (
                      <button className="btn btn-primary" onClick={openCreateModal}>
                        Crear primer producto
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Imagen</th>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Descripción</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div className="product-image-cell">
                                <img 
                                  src={product.image || 'https://via.placeholder.com/60x60?text=Sin+imagen'} 
                                  alt={product.name}
                                  className="product-image-thumb"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60?text=Sin+imagen';
                                  }}
                                />
                              </div>
                            </td>
                            <td>{product.id}</td>
                            <td>
                              <span className="product-name">{product.name}</span>
                            </td>
                            <td>
                              <span className="category-badge">
                                {getCategoryName(product.categoryId)}
                              </span>
                            </td>
                            <td>
                              <span className="price">${product.price.toFixed(2)}</span>
                            </td>
                            <td>
                              <span className={`stock ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : ''}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td>
                              <span className="product-description">
                                {product.description.length > 50 
                                  ? `${product.description.substring(0, 50)}...` 
                                  : product.description
                                }
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEdit(product)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(product.id, product.name)}
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
              <h3>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Nombre del producto *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                  placeholder="Ej: Smartphone Samsung Galaxy"
                />
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">Categoría *</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={formErrors.categoryId ? 'error' : ''}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <span className="error-message">{formErrors.categoryId}</span>
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
                  <label htmlFor="stock">Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={formErrors.stock ? 'error' : ''}
                    placeholder="0"
                    min="0"
                  />
                  {formErrors.stock && (
                    <span className="error-message">{formErrors.stock}</span>
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
                  placeholder="Describe las características principales del producto"
                  rows="4"
                />
                {formErrors.description && (
                  <span className="error-message">{formErrors.description}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="image">URL de la imagen</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className={formErrors.image ? 'error' : ''}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formErrors.image && (
                  <span className="error-message">{formErrors.image}</span>
                )}
                {formData.image && (
                  <div className="image-preview">
                    <img 
                      src={formData.image} 
                      alt="Vista previa"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      style={{ maxWidth: '200px', maxHeight: '150px', marginTop: '10px' }}
                    />
                  </div>
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
                    ? (editingProduct ? 'Actualizando...' : 'Creando...') 
                    : (editingProduct ? 'Actualizar' : 'Crear')
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

export default AdminProducts;
