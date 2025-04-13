import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle changes in form fields
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user types
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Basic validations for email and password
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setMessage(res.data.msg);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      console.log(res.data);
      
      res.data.role == "Patient" ? localStorage.setItem('patientId', res.data.id): localStorage.setItem('hospitalId', res.data.id);
      navigate('/'); // Redirect after successful login
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {token && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#f4f4f4', padding: '10px' }}>
          <h3>Token:</h3>
          <p>{token}</p>
        </div>
      )}
      <div className="row my-5 justify-content-center">
        <div
          className="col-md-6 col-lg-4"
          style={{
            padding: '40px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
          }}
        >
          {message && (
            <div style={{ marginBottom: '20px', color: token ? '#00FF00' : 'red' }}>
              {message}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="text-center mb-4">
              <h1>Login</h1>
            </div>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
