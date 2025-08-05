import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setErrors({
          general: result.error || 'Error en el inicio de sesión'
        });
      }
      
    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({
        general: 'Error en el servidor. Por favor, intente nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Header */}
      <header className="login-header">
        <div className="container">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>Acceso Administrativo</h1>
        </div>
      </header>

      {/* Login Form */}
      <section className="login-section">
        <div className="container">
          <div className="login-container">
            <div className="login-form-container">
              <div className="login-icon">
                🔐
              </div>
              <h2>Iniciar Sesión</h2>
              <p className="login-description">
                Accede al panel administrativo para gestionar la plataforma
              </p>

              {/* Credenciales de prueba */}
              <div className="demo-credentials">
                <h4>Credenciales de prueba:</h4>
                <p><strong>Email:</strong> admin@admin.com</p>
                <p><strong>Contraseña:</strong> admin123</p>
              </div>

              {errors.general && (
                <div className="general-error">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="admin@admin.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
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
                    placeholder="Ingresa tu contraseña"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>

              <div className="login-footer">
                <p>¿No tienes acceso administrativo?</p>
                <Link to="/register" className="register-link">
                  Registrarse como usuario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>Panel Administrativo</h3>
              <p>Gestiona productos, categorías, usuarios y más desde un solo lugar.</p>
            </div>
            <div className="info-card">
              <h3>Control Total</h3>
              <p>Administra todos los aspectos de la plataforma comercial.</p>
            </div>
            <div className="info-card">
              <h3>Seguro</h3>
              <p>Acceso protegido solo para usuarios autorizados.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
