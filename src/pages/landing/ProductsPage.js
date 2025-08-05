import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name'); // name, price-asc, price-desc

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

  // Efecto para leer parámetros de búsqueda de la URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Filtrar productos por categoría, búsqueda y precio
  const filteredProducts = products.filter(product => {
    // Filtro por categoría
    const categoryMatch = selectedCategory
      ? product.categoryId == selectedCategory
      : true;
    
    // Filtro por búsqueda (nombre)
    const searchMatch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Filtro por rango de precio
    const priceMatch = (() => {
      const price = parseFloat(product.price);
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return price >= minPrice && price <= maxPrice;
    })();
    
    return categoryMatch && searchMatch && priceMatch;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.name : 'Sin categoría';
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategory('');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <header className="page-header">
        <div className="container">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>Catálogo de Productos</h1>
        </div>
      </header>

      {/* Filters */}
      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            {/* Búsqueda por nombre */}
            <div className="filter-group">
              <label htmlFor="search">Buscar productos:</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre..."
                className="search-input"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="filter-group">
              <label htmlFor="category-filter">Categoría:</label>
              <select 
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por precio */}
            <div className="filter-group price-range">
              <label>Rango de precio:</label>
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Mín"
                  className="price-input"
                  min="0"
                  step="0.01"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Máx"
                  className="price-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Ordenar por */}
            <div className="filter-group">
              <label htmlFor="sort-by">Ordenar por:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="filter-group">
              <button onClick={clearFilters} className="clear-filters-btn">
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="results-info">
            <p>
              Mostrando {sortedProducts.length} de {products.length} productos
              {searchTerm && ` para "${searchTerm}"`}
              {selectedCategory && ` en ${getCategoryName(selectedCategory)}`}
            </p>
          </div>
        </div>
      </section>      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {sortedProducts.length === 0 ? (
            <div className="no-products">
              <h3>No se encontraron productos</h3>
              <p>
                {searchTerm || selectedCategory || priceRange.min || priceRange.max
                  ? 'No hay productos que coincidan con los filtros aplicados.'
                  : 'No hay productos disponibles en este momento.'
                }
              </p>
              {(searchTerm || selectedCategory || priceRange.min || priceRange.max) && (
                <button onClick={clearFilters} className="btn btn-primary">
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="products-grid">
              {sortedProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image || 'https://via.placeholder.com/300x200?text=Producto'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Producto';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{getCategoryName(product.categoryId)}</p>
                    <p className="product-price">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Navigation Links */}
      <section className="navigation-section">
        <div className="container">
          <div className="nav-links">
            <Link to="/categories" className="btn btn-outline">Ver Categorías</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
