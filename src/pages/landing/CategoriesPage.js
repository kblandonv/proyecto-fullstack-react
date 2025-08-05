import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('category');

  // Cargar datos de la API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiService.categories.getAll(),
          apiService.products.getAll()
        ]);
        
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProductCountByCategory = (categoryId) => {
    if (!products || products.length === 0) {
      return 0;
    }
    return products.filter(product => product.categoryId == categoryId).length;
  };

  const selectedCategory = selectedCategoryId 
    ? categories.find(cat => cat.id == parseInt(selectedCategoryId))
    : null;

  const categoryProducts = selectedCategoryId
    ? products.filter(product => product.categoryId == parseInt(selectedCategoryId))
    : [];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Header */}
      <header className="page-header">
        <div className="container">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>
            {selectedCategory ? `Categoría: ${selectedCategory.name}` : 'Categorías'}
          </h1>
        </div>
      </header>

      {selectedCategory ? (
        /* Selected Category View */
        <div className="selected-category-view">
          <section className="category-detail">
            <div className="container">
              <div className="category-info">
                <div className="category-image">
                  <img src={selectedCategory.image || 'https://via.placeholder.com/400x300?text=Categoría'} alt={selectedCategory.name} />
                </div>
                <div className="category-content">
                  <h2>{selectedCategory.name}</h2>
                  <p>{selectedCategory.description}</p>
                  <p className="product-count">
                    {categoryProducts.length} producto{categoryProducts.length !== 1 ? 's' : ''} disponible{categoryProducts.length !== 1 ? 's' : ''}
                  </p>
                  <Link to="/categories" className="btn btn-outline">Ver todas las categorías</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="category-products">
            <div className="container">
              <h3>Productos en esta categoría</h3>
              {categoryProducts.length === 0 ? (
                <div className="no-products">
                  <p>No hay productos disponibles en esta categoría.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {categoryProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-price">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* Categories Grid View */
        <section className="categories-section">
          <div className="container">
            <div className="categories-grid">
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/categories?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    <img 
                      src={category.image || 'https://via.placeholder.com/300x200?text=Categoría'} 
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Categoría';
                      }}
                    />
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description || 'Descripción no disponible'}</p>
                    <span className="product-count">
                      {getProductCountByCategory(category.id)} productos
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation Section */}
      <section className="navigation-section">
        <div className="container">
          <div className="nav-links">
            <Link to="/products" className="btn btn-outline">Ver todos los productos</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
