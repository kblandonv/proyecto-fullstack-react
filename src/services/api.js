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

// Datos mock para fallback
const mockData = {
  roles: [
    { id: 1, name: "Administrador", description: "Acceso completo al sistema" },
    { id: 2, name: "Gerente", description: "Gestión de operaciones y reportes" },
    { id: 3, name: "Vendedor", description: "Gestión de ventas y clientes" }
  ],
  categories: [
    { id: 1, name: "Electrónicos", description: "Dispositivos electrónicos y tecnología" },
    { id: 2, name: "Ropa", description: "Vestimenta y accesorios" },
    { id: 3, name: "Hogar", description: "Artículos para el hogar y decoración" },
    { id: 4, name: "Deportes", description: "Equipos y artículos deportivos" }
  ],
  products: [
    { id: 1, name: "Smartphone Samsung Galaxy", description: "Smartphone de última generación", price: 699.99, stock: 25, categoryId: 1 },
    { id: 2, name: "Laptop Dell Inspiron", description: "Laptop para trabajo y entretenimiento", price: 899.99, stock: 12, categoryId: 1 },
    { id: 3, name: "Camiseta Nike", description: "Camiseta deportiva de algodón", price: 29.99, stock: 50, categoryId: 2 }
  ],
  services: [
    { id: 1, name: "Consultoría Tecnológica", description: "Asesoramiento en tecnología", price: 150.00, duration: 60 },
    { id: 2, name: "Desarrollo Web", description: "Creación de sitios web", price: 2500.00, duration: 480 },
    { id: 3, name: "Diseño Gráfico", description: "Diseño de logos y branding", price: 200.00, duration: 120 }
  ],
  users: [
    { id: 1, name: "Admin Sistema", email: "admin@admin.com", password: "admin123", roleId: 1, active: true },
    { id: 2, name: "Juan Pérez", email: "juan@ejemplo.com", password: "juan123", roleId: 2, active: true },
    { id: 3, name: "María García", email: "maria@ejemplo.com", password: "maria123", roleId: 3, active: true }
  ],
  clients: [
    { id: 1, name: "Carlos Rodríguez", email: "carlos@cliente.com", phone: "+1 234 567 8901", address: "Calle Principal 123" },
    { id: 2, name: "Ana Martínez", email: "ana@cliente.com", phone: "+1 234 567 8902", address: "Avenida Central 456" },
    { id: 3, name: "Luis González", email: "luis@cliente.com", phone: "+1 234 567 8903", address: "Plaza Mayor 789" }
  ],
  providers: [
    { id: 1, company: "TechCorp Solutions", contactName: "Roberto Silva", email: "contacto@techcorp.com", phone: "+1 555 123 4567", address: "Zona Industrial 100" },
    { id: 2, company: "Distribuidora Global", contactName: "Laura Fernández", email: "ventas@distribuidora.com", phone: "+1 555 765 4321", address: "Centro Comercial 200" },
    { id: 3, company: "Servicios Integrales", contactName: "Miguel Torres", email: "info@servicios.com", phone: "+1 555 987 6543", address: "Polígono Empresarial 300" }
  ]
};

// Función helper para crear servicios CRUD genéricos
const createCrudService = (endpoint) => ({
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return { data: mockData[endpoint] || [] };
    }
    try {
      const response = await api.get(`/${endpoint}`);
      return response;
    } catch (error) {
      console.warn(`API Error for ${endpoint}, using mock data:`, error);
      return { data: mockData[endpoint] || [] };
    }
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const item = mockData[endpoint]?.find(item => item.id === parseInt(id));
      return { data: item };
    }
    try {
      const response = await api.get(`/${endpoint}/${id}`);
      return response;
    } catch (error) {
      console.warn(`API Error for ${endpoint}/${id}, using mock data:`, error);
      const item = mockData[endpoint]?.find(item => item.id === parseInt(id));
      return { data: item };
    }
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newItem = { ...data, id: Date.now() };
      return { data: newItem };
    }
    try {
      const response = await api.post(`/${endpoint}`, data);
      return response;
    } catch (error) {
      console.warn(`API Error creating ${endpoint}, using mock data:`, error);
      const newItem = { ...data, id: Date.now() };
      return { data: newItem };
    }
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      return { data: { ...data, id: parseInt(id) } };
    }
    try {
      const response = await api.put(`/${endpoint}/${id}`, data);
      return response;
    } catch (error) {
      console.warn(`API Error updating ${endpoint}/${id}, using mock data:`, error);
      return { data: { ...data, id: parseInt(id) } };
    }
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      return { data: { success: true } };
    }
    try {
      const response = await api.delete(`/${endpoint}/${id}`);
      return response;
    } catch (error) {
      console.warn(`API Error deleting ${endpoint}/${id}, using mock data:`, error);
      return { data: { success: true } };
    }
  }
});

// Servicios específicos usando la función helper
export const rolesService = createCrudService('roles');
export const categoriesService = createCrudService('categories');
export const productsService = createCrudService('products');
export const servicesService = createCrudService('services');
export const usersService = createCrudService('users');
export const clientsService = createCrudService('clients');
export const providersService = createCrudService('providers');

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
  clients: clientsService,
  providers: providersService,
  auth: authService
};

export default api;
