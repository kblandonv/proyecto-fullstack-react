# 🏪 MiTienda - Proyecto Fullstack React

Una plataforma de comercio electrónico completa desarrollada con React, que incluye un área pública para clientes y proveedores, y un panel de administración completo para gestionar el sistema.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API y Base de Datos](#-api-y-base-de-datos)
- [Funcionalidades](#-funcionalidades)

## ✨ Características

### 🌐 **Área Pública (Landing)**
- **Página de inicio** con barra de búsqueda
- **Catálogo de productos** con filtros avanzados
- **Navegación por categorías** con imágenes
- **Sistema de registro** para clientes y proveedores
- **Diseño responsive** para todos los dispositivos

### 🛡️ **Panel de Administración**
- **Dashboard** con estadísticas del sistema
- **CRUD completo** para todos los módulos:
  - Roles y permisos
  - Categorías de productos
  - Productos (con imágenes)
  - Servicios
  - Usuarios del sistema
  - Gestión de clientes
  - Gestión de proveedores
- **Sistema de búsqueda** y paginación
- **Autenticación** y rutas protegidas
- **Notificaciones toast** para feedback

### 🔍 **Sistema de Búsqueda Avanzada**
- **Búsqueda por nombre** de productos
- **Filtros por categoría**
- **Filtros por rango de precio**
- **Ordenamiento** (nombre, precio ascendente/descendente)
- **Búsqueda desde la página de inicio**

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **React Router v6** - Navegación y rutas
- **CSS3** - Estilos responsivos sin frameworks
- **Axios** - Cliente HTTP para API

### Backend/API
- **JSON Server** - API REST local para desarrollo
- **Node.js** - Entorno de ejecución

### Herramientas de Desarrollo
- **Create React App** - Configuración inicial
- **VS Code** - Editor recomendado
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

\`\`\`
proyecto-fullstack-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── ProtectedRoute.js
│   │       ├── Toast.js
│   │       └── Toast.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useToast.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js/.css
│   │   │   ├── AdminLogin.js/.css
│   │   │   ├── AdminRoles.js/.css
│   │   │   ├── AdminCategories.js
│   │   │   ├── AdminProducts.js
│   │   │   ├── AdminServices.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── AdminClients.js
│   │   │   ├── AdminProviders.js
│   │   │   └── AdminPages.css
│   │   └── landing/
│   │       ├── LandingHome.js/.css
│   │       ├── ProductsPage.js/.css
│   │       ├── CategoriesPage.js/.css
│   │       └── RegisterPage.js/.css
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── db.json
├── package.json
└── README.md
\`\`\`

## 🚀 Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   \`\`\`bash
   git clone https://github.com/tu-usuario/proyecto-fullstack-react.git
   cd proyecto-fullstack-react
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Instalar JSON Server (globalmente)**
   \`\`\`bash
   npm install -g json-server
   \`\`\`

## 🎯 Uso

### Iniciar el proyecto completo

1. **Iniciar la API (JSON Server)**
   \`\`\`bash
   npm run server
   \`\`\`
   La API estará disponible en: http://localhost:3001

2. **Iniciar la aplicación React** (en otra terminal)
   \`\`\`bash
   npm start
   \`\`\`
   La aplicación estará disponible en: http://localhost:3000

### Scripts disponibles

\`\`\`json
{
  "start": "react-scripts start",
  "server": "json-server --watch db.json --port 3001",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
\`\`\`

## 🗄️ API y Base de Datos

### Endpoints disponibles

La API REST está construida con JSON Server y proporciona los siguientes endpoints:

- **GET/POST/PUT/DELETE** `/roles` - Gestión de roles
- **GET/POST/PUT/DELETE** `/categories` - Categorías de productos
- **GET/POST/PUT/DELETE** `/products` - Productos del catálogo
- **GET/POST/PUT/DELETE** `/services` - Servicios ofrecidos
- **GET/POST/PUT/DELETE** `/users` - Usuarios del sistema
- **GET/POST/PUT/DELETE** `/clients` - Clientes registrados
- **GET/POST/PUT/DELETE** `/providers` - Proveedores registrados

### Estructura de datos

#### Productos
\`\`\`json
{
  "id": "1",
  "name": "Smartphone Samsung Galaxy",
  "description": "Smartphone de última generación...",
  "price": 699.99,
  "stock": 25,
  "categoryId": 1,
  "image": "https://images.unsplash.com/..."
}
\`\`\`

#### Categorías
\`\`\`json
{
  "id": "1",
  "name": "Electrónicos",
  "description": "Dispositivos electrónicos y tecnología",
  "image": "https://images.unsplash.com/..."
}
\`\`\`

## 🎮 Funcionalidades

### Área Pública

#### 🏠 Página de Inicio
- Hero section con barra de búsqueda
- Tarjetas de características
- Navegación intuitiva

#### 📱 Catálogo de Productos
- **Búsqueda por texto** - Buscar productos por nombre
- **Filtro por categoría** - Dropdown de categorías
- **Filtro por precio** - Rango mínimo y máximo
- **Ordenamiento** - Por nombre o precio
- **Paginación** - Resultados organizados
- **Diseño en grid** - Vista responsive

#### 🏷️ Navegación por Categorías
- Grid de categorías con imágenes
- Contador de productos por categoría
- Vista detallada por categoría

#### 📝 Sistema de Registro
- **Registro de clientes** - Formulario básico
- **Registro de proveedores** - Formulario con datos de empresa
- **Validación completa** - Validaciones del lado cliente
- **Campos dinámicos** - Diferentes campos por tipo de usuario

### Panel de Administración

#### 🔐 Autenticación
- Login seguro (admin@admin.com / admin123)
- Rutas protegidas
- Sesión persistente

#### 📊 Dashboard
- Estadísticas generales del sistema
- Accesos rápidos a módulos
- Resumen de datos importantes

#### 🛠️ Gestión de Módulos

**Cada módulo incluye:**
- ✅ **Crear** - Formularios con validación
- 📖 **Leer** - Listado con paginación
- ✏️ **Actualizar** - Edición inline
- 🗑️ **Eliminar** - Confirmación antes de borrar
- 🔍 **Buscar** - Filtros y búsqueda en tiempo real

**Módulos específicos:**
- **Roles** - Gestión de permisos y accesos
- **Categorías** - Categorización de productos
- **Productos** - Catálogo completo con imágenes
- **Servicios** - Servicios ofrecidos
- **Usuarios** - Usuarios del sistema administrativo
- **Clientes** - Clientes registrados desde el público
- **Proveedores** - Empresas proveedoras

## 🎨 Características de Diseño

### 📱 Responsive Design
- **Mobile First** - Diseñado primero para móviles
- **Breakpoints optimizados** - 480px, 768px, 1024px
- **Grid flexible** - Se adapta a cualquier pantalla
- **Navegación adaptativa** - Menús colapsables en móvil

### 🎭 UX/UI
- **Colores consistentes** - Paleta de colores moderna
- **Tipografía legible** - Jerarquía clara de texto
- **Microinteracciones** - Hover effects y transiciones
- **Loading states** - Indicadores de carga
- **Feedback visual** - Notificaciones toast

### 🖼️ Imágenes
- **Unsplash integration** - Imágenes de alta calidad
- **Fallback images** - Placeholders automáticos
- **Optimización** - Lazy loading y redimensionado

## 🔧 Configuración Avanzada

### Variables de Entorno
Puedes configurar las siguientes variables en un archivo `.env`:

\`\`\`env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=MiTienda
\`\`\`

### Personalización
- **Colores** - Modificar variables CSS en cada archivo .css
- **Logo** - Cambiar en el header de LandingHome
- **API** - Configurar URL base en src/services/api.js


## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Por la biblioteca principal
- [Unsplash](https://unsplash.com/) - Por las imágenes de alta calidad
- [JSON Server](https://github.com/typicode/json-server) - Por la API mock sencilla
- [Create React App](https://create-react-app.dev/) - Por la configuración inicial

---
