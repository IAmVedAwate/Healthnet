import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    previousPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Handle form data changes
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Change endpoint according to your API route
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', formData);
      setMessage(res.data.msg);
      alert(res.data.msg);
      // navigate('/posts');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error resetting password.');
    }
  };

  return (
    <div className='container' style={{ padding: "40px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)", borderRadius: "20px" }}>
      {message && <div style={{ paddingBottom: "20px", color: 'red' }}>{message}</div>}
      <form onSubmit={onSubmit} className="container-sm">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Previous Password</label>
          <input
            type="password"
            className="form-control"
            name="previousPassword"
            value={formData.previousPassword}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={formData.newPassword}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
