import axios from 'axios';

// Base URL para JSON Server local
const BASE_URL = 'http://localhost:3001';

// Si no tienes el servidor corriendo, usa datos locales
const USE_MOCK_DATA = false; // Cambia a true si no tienes JSON Server corriendo

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Datos mock para desarrollo local
const mockData = {
  roles: [
    { id: 1, name: 'Administrador', description: 'Acceso completo al sistema', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, name: 'Cliente', description: 'Usuario cliente con acceso limitado', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, name: 'Proveedor', description: 'Usuario proveedor con permisos específicos', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, name: 'Moderador', description: 'Permisos de moderación de contenido', createdAt: '2025-01-01T00:00:00.000Z' }
  ],
  categories: [
    { id: 1, name: 'Electrónicos', description: 'Dispositivos electrónicos y tecnología', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, name: 'Ropa', description: 'Vestimenta y accesorios de moda', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, name: 'Hogar', description: 'Muebles y decoración para el hogar', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, name: 'Deportes', description: 'Equipamiento deportivo y fitness', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 5, name: 'Libros', description: 'Literatura y material educativo', createdAt: '2025-01-01T00:00:00.000Z' }
  ],
  products: [
    { id: 1, name: 'Smartphone Galaxy', price: 299.99, categoryId: 1, category: 'Electrónicos', imageUrl: 'https://via.placeholder.com/300x200?text=Smartphone', description: 'Smartphone de última generación', stock: 50, createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, name: 'Laptop Dell', price: 799.99, categoryId: 1, category: 'Electrónicos', imageUrl: 'https://via.placeholder.com/300x200?text=Laptop', description: 'Laptop para trabajo y gaming', stock: 25, createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, name: 'Camiseta Casual', price: 24.99, categoryId: 2, category: 'Ropa', imageUrl: 'https://via.placeholder.com/300x200?text=Camiseta', description: 'Camiseta de algodón 100%', stock: 100, createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, name: 'Mesa de Centro', price: 149.99, categoryId: 3, category: 'Hogar', imageUrl: 'https://via.placeholder.com/300x200?text=Mesa', description: 'Mesa de centro moderna', stock: 15, createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 5, name: 'Zapatillas Running', price: 89.99, categoryId: 4, category: 'Deportes', imageUrl: 'https://via.placeholder.com/300x200?text=Zapatillas', description: 'Zapatillas para correr', stock: 75, createdAt: '2025-01-01T00:00:00.000Z' }
  ],
  services: [
    { id: 1, name: 'Consultoría IT', description: 'Servicios de consultoría en tecnología', price: 150.00, duration: '2 horas', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, name: 'Diseño Gráfico', description: 'Diseño de logos y material publicitario', price: 200.00, duration: '1 semana', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, name: 'Desarrollo Web', description: 'Desarrollo de sitios web personalizados', price: 500.00, duration: '1 mes', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, name: 'Marketing Digital', description: 'Campañas de marketing en redes sociales', price: 300.00, duration: '2 semanas', createdAt: '2025-01-01T00:00:00.000Z' }
  ],
  users: [
    { id: 1, name: 'Juan Pérez', email: 'juan@cliente.com', phone: '+1234567890', role: 'cliente', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, name: 'María García', email: 'maria@proveedor.com', phone: '+1234567891', role: 'proveedor', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, name: 'Carlos Admin', email: 'carlos@admin.com', phone: '+1234567892', role: 'admin', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, name: 'Ana Cliente', email: 'ana@cliente.com', phone: '+1234567893', role: 'cliente', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 5, name: 'Luis Proveedor', email: 'luis@proveedor.com', phone: '+1234567894', role: 'proveedor', createdAt: '2025-01-01T00:00:00.000Z' }
  ]
};

// Función helper para simular API con datos locales
const mockApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...data] });
    }, delay);
  });
};

const mockApiCallById = (data, id, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = data.find(item => item.id === parseInt(id));
      if (item) {
        resolve({ data: item });
      } else {
        reject(new Error('Item not found'));
      }
    }, delay);
  });
};

const mockApiCreate = (data, newItem, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = {
        ...newItem,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      data.push(item);
      resolve({ data: item });
    }, delay);
  });
};

const mockApiUpdate = (data, id, updates, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = data.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        resolve({ data: data[index] });
      } else {
        reject(new Error('Item not found'));
      }
    }, delay);
  });
};

const mockApiDelete = (data, id, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = data.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        const deleted = data.splice(index, 1)[0];
        resolve({ data: deleted });
      } else {
        reject(new Error('Item not found'));
      }
    }, delay);
  });
};

// Servicios para Roles
export const rolesService = {
  getAll: () => USE_MOCK_DATA ? mockApiCall(mockData.roles) : api.get('/roles'),
  getById: (id) => USE_MOCK_DATA ? mockApiCallById(mockData.roles, id) : api.get(`/roles/${id}`),
  create: (data) => USE_MOCK_DATA ? mockApiCreate(mockData.roles, data) : api.post('/roles', data),
  update: (id, data) => USE_MOCK_DATA ? mockApiUpdate(mockData.roles, id, data) : api.put(`/roles/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockApiDelete(mockData.roles, id) : api.delete(`/roles/${id}`)
};

// Servicios para Categorías
export const categoriesService = {
  getAll: () => USE_MOCK_DATA ? mockApiCall(mockData.categories) : api.get('/categories'),
  getById: (id) => USE_MOCK_DATA ? mockApiCallById(mockData.categories, id) : api.get(`/categories/${id}`),
  create: (data) => USE_MOCK_DATA ? mockApiCreate(mockData.categories, data) : api.post('/categories', data),
  update: (id, data) => USE_MOCK_DATA ? mockApiUpdate(mockData.categories, id, data) : api.put(`/categories/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockApiDelete(mockData.categories, id) : api.delete(`/categories/${id}`)
};

// Servicios para Productos
export const productsService = {
  getAll: () => USE_MOCK_DATA ? mockApiCall(mockData.products) : api.get('/products'),
  getById: (id) => USE_MOCK_DATA ? mockApiCallById(mockData.products, id) : api.get(`/products/${id}`),
  getByCategory: (categoryId) => {
    if (USE_MOCK_DATA) {
      const filtered = mockData.products.filter(p => p.categoryId === parseInt(categoryId));
      return mockApiCall(filtered);
    }
    return api.get(`/products?categoryId=${categoryId}`);
  },
  create: (data) => USE_MOCK_DATA ? mockApiCreate(mockData.products, data) : api.post('/products', data),
  update: (id, data) => USE_MOCK_DATA ? mockApiUpdate(mockData.products, id, data) : api.put(`/products/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockApiDelete(mockData.products, id) : api.delete(`/products/${id}`)
};

// Servicios para Servicios
export const servicesService = {
  getAll: () => USE_MOCK_DATA ? mockApiCall(mockData.services) : api.get('/services'),
  getById: (id) => USE_MOCK_DATA ? mockApiCallById(mockData.services, id) : api.get(`/services/${id}`),
  create: (data) => USE_MOCK_DATA ? mockApiCreate(mockData.services, data) : api.post('/services', data),
  update: (id, data) => USE_MOCK_DATA ? mockApiUpdate(mockData.services, id, data) : api.put(`/services/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockApiDelete(mockData.services, id) : api.delete(`/services/${id}`)
};

// Servicios para Usuarios (Clientes, Proveedores, Admins)
export const usersService = {
  getAll: () => USE_MOCK_DATA ? mockApiCall(mockData.users) : api.get('/users'),
  getById: (id) => USE_MOCK_DATA ? mockApiCallById(mockData.users, id) : api.get(`/users/${id}`),
  getByRole: (role) => {
    if (USE_MOCK_DATA) {
      const filtered = mockData.users.filter(u => u.role === role);
      return mockApiCall(filtered);
    }
    return api.get(`/users?role=${role}`);
  },
  create: (data) => USE_MOCK_DATA ? mockApiCreate(mockData.users, data) : api.post('/users', data),
  update: (id, data) => USE_MOCK_DATA ? mockApiUpdate(mockData.users, id, data) : api.put(`/users/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockApiDelete(mockData.users, id) : api.delete(`/users/${id}`),
  login: (credentials) => api.post('/auth/login', credentials)
};

// Servicio de autenticación
export const authService = {
  login: async (email, password) => {
    try {
      // Por ahora simulamos la autenticación
      if (email === 'admin@admin.com' && password === 'admin123') {
        return {
          data: {
            id: 1,
            name: 'Administrador',
            email: 'admin@admin.com',
            role: 'admin',
            token: 'mock-jwt-token'
          }
        };
      }
      throw new Error('Credenciales inválidas');
    } catch (error) {
      throw error;
    }
  },
  
  register: (userData) => {
    return usersService.create(userData);
  }
};

// Crear apiService que agrupa todos los servicios
export const apiService = {
  roles: rolesService,
  categories: categoriesService,
  products: productsService,
  services: servicesService,
  users: usersService,
  clients: {
    getAll: () => Promise.resolve({ data: mockData.clients }),
    create: (data) => Promise.resolve({ data: { ...data, id: Date.now() } }),
    update: (id, data) => Promise.resolve({ data: { ...data, id } }),
    delete: (id) => Promise.resolve({ success: true })
  },
  providers: {
    getAll: () => Promise.resolve({ data: mockData.providers }),
    create: (data) => Promise.resolve({ data: { ...data, id: Date.now() } }),
    update: (id, data) => Promise.resolve({ data: { ...data, id } }),
    delete: (id) => Promise.resolve({ success: true })
  }
};

export default api;
