import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';
import { apiService } from '../../services/api';

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState('cliente');
  const [formData, setFormData] = useState({
    name: '',
    company: '', // Para proveedores
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Limpiar formulario al cambiar de tab
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = activeTab === 'cliente' ? 'El nombre es requerido' : 'El nombre de contacto es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar empresa (solo para proveedores)
    if (activeTab === 'proveedor') {
      if (!formData.company.trim()) {
        newErrors.company = 'El nombre de la empresa es requerido';
      } else if (formData.company.trim().length < 2) {
        newErrors.company = 'El nombre de la empresa debe tener al menos 2 caracteres';
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    // Validar teléfono
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.phone) || formData.phone.trim().length < 8) {
      newErrors.phone = 'El teléfono debe tener un formato válido (mínimo 8 dígitos)';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar la contraseña es requerido';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let userData;
      let result;
      
      if (activeTab === 'cliente') {
        userData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password, // En producción, esto se debería hashear
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        result = await apiService.clients.create(userData);
        console.log('Cliente registrado:', result);
      } else {
        userData = {
          company: formData.company.trim(),
          contactName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password, // En producción, esto se debería hashear
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        result = await apiService.providers.create(userData);
        console.log('Proveedor registrado:', result);
      }

      alert(`¡Registro exitoso como ${activeTab}!`);
      
      // Limpiar formulario
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error en el registro. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* Header */}
      <header className="page-header">
        <div className="container">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>Registro de Usuario</h1>
        </div>
      </header>

      {/* Registration Form */}
      <section className="register-section">
        <div className="container">
          <div className="register-container">
            
            {/* Tabs */}
            <div className="register-tabs">
              <button 
                className={`tab-button ${activeTab === 'cliente' ? 'active' : ''}`}
                onClick={() => handleTabChange('cliente')}
              >
                Registro como Cliente
              </button>
              <button 
                className={`tab-button ${activeTab === 'proveedor' ? 'active' : ''}`}
                onClick={() => handleTabChange('proveedor')}
              >
                Registro como Proveedor
              </button>
            </div>

            {/* Form */}
            <div className="register-form-container">
              <h2>
                {activeTab === 'cliente' 
                  ? 'Crear cuenta de Cliente' 
                  : 'Crear cuenta de Proveedor'
                }
              </h2>
              <p className="form-description">
                {activeTab === 'cliente'
                  ? 'Regístrate como cliente para acceder a nuestros productos y servicios'
                  : 'Únete como proveedor y ofrece tus productos en nuestra plataforma'
                }
              </p>

              <form onSubmit={handleSubmit} className="register-form">
                {activeTab === 'proveedor' && (
                  <div className="form-group">
                    <label htmlFor="company">Nombre de la empresa *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={errors.company ? 'error' : ''}
                      placeholder="Ingresa el nombre de tu empresa"
                    />
                    {errors.company && <span className="error-message">{errors.company}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">
                    {activeTab === 'cliente' ? 'Nombre completo *' : 'Nombre de contacto *'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder={activeTab === 'cliente' 
                      ? "Ingresa tu nombre completo" 
                      : "Ingresa el nombre del contacto principal"
                    }
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Repite tu contraseña"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? 'Registrando...' 
                    : `Registrarse como ${activeTab}`
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="navigation-section">
        <div className="container">
          <div className="nav-links">
            <Link to="/products" className="btn btn-outline">Ver productos</Link>
            <Link to="/admin/login" className="btn btn-secondary">¿Eres administrador?</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
