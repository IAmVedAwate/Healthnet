import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '', 
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/signup')
    }
  }, []);

  // Handle form data changes
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    try {
      if (localStorage.getItem('token')) {
        const res = await axios.post('http://localhost:5000/api/auth/password-reset', formData, {
          headers: {
            'access-token': localStorage.getItem('token')
          }
        });
        setMessage(res.data.msg);
        alert(res.data.email_msg);
        navigate('/posts');
      } else {
        navigate('/signup');
      }
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)", borderRadius: "20px" }}>
      {message && <div style={{ paddingBottom: "20px", color: 'red' }}>{message}</div>}
      <form onSubmit={onSubmit} className="container-sm">
        <div className="mb-3">
          <label className="form-label">Old Password</label>
          <input
            type="password"
            className="form-control"
            name="oldPassword"
            value={formData.oldPassword}
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
