import React, { useState } from 'react';
import axios from 'axios';

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [message, setMessage] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);

  // Handle form data changes
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Call your forget-password API
      const res = await axios.post('http://localhost:5000/api/auth/forget-password', formData);
      setMessage(res.data.msg);
      console.log(res.data);
      // If the API response includes a temporary password, save it for display/copy
      if (res.data.tempPassword) {
        setTempPassword(res.data.tempPassword);
      }
      // In case of failure to send email but with a temporary password included
      // The res.data.msg could be something like:
      // "Failed to send email But Your password has been reset. Your new temporary password is: <tempPassword>"
      // We assume the backend sends a separate field if available
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error processing forget-password request.');
    }
  };

  // Copy tempPassword to clipboard
  const copyToClipboard = async () => {
    if (tempPassword) {
      try {
        await navigator.clipboard.writeText(tempPassword);
        alert('Temporary password copied to clipboard!');
      } catch (error) {
        alert('Failed to copy text: ' + error);
      }
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
        <button type="submit" className="btn btn-primary mb-3">Reset Password</button>
      </form>
      {tempPassword && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            Your new temporary password is: <strong>{tempPassword}</strong>
          </div>
          <button className="btn btn-success" onClick={copyToClipboard}>
            Copy Temporary Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
