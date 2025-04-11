import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  // Determine signup type based on Admin token in localStorage.
  // If an Admin is logged in, signup will be for Hospital; otherwise, it's for Patient.
  const [signupType, setSignupType] = useState('patient');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole && storedRole === 'Admin') {
      setSignupType('hospital');
    } else {
      setSignupType('patient');
    }
  }, []);

  // For Patient, the name field acts as username.
  // For Hospital, it's the hospital name.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);

  // Update form field values
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleTerms = () => setTermsChecked(!termsChecked);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (!termsChecked) {
      setMessage('You must agree to the Terms and Conditions');
      return;
    }

    try {
      // Determine endpoint based on signupType
      const endpoint =
        signupType === 'patient'
          ? 'http://localhost:5000/api/auth/patient/signup'
          : 'http://localhost:5000/api/auth/hospital/signup';

      // Build payload:
      // For Patient, send username field; for Hospital, send name field.
      const payload =
        signupType === 'patient'
          ? { username: formData.name, address: formData.address, phoneNumber: formData.phoneNumber,  email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword }
          : { name: formData.name, address: formData.address, phoneNumber: formData.phoneNumber, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword };

      const res = await axios.post(endpoint, payload);
      setMessage(res.data.msg);
      setToken(res.data.token);
      alert(res.data.msg);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      alert(res.data.id)
      res.data.role == "Patient" ? localStorage.setItem('patientId', res.data.id): localStorage.setItem('hospitalId', res.data.id);
      navigate('/posts');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="container my-5">
      {token && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#f4f4f4', padding: '10px', color: 'black' }}>
          <h3>Token:</h3>
          <p>{token}</p>
        </div>
      )}
      <div className="row justify-content-center">
        <div
          className="col-md-6"
          style={{
            padding: '40px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.7)',
            borderRadius: '20px',
          }}
        >
          {message && (
            <div style={{ marginBottom: '20px', color: token ? '#00FF00' : 'red' }}>
              {message}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="text-center mb-4">
              <h1>Signup as {signupType === 'patient' ? 'Patient' : 'Hospital'}</h1>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder={signupType === 'patient' ? 'Username' : 'Hospital Name'}
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="col-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="col-6 mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={toggleTerms} required />
              <label className="form-check-label" htmlFor="termsCheck">
                I agree to the Terms and Conditions
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={!termsChecked}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
