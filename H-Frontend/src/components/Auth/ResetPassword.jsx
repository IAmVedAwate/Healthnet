// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router';

// const ResetPassword = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     previousPassword: '',
//     newPassword: '',
//   });
//   const [message, setMessage] = useState(null);
//   const navigate = useNavigate();

//   // Handle form data changes
//   const onChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Handle form submission
//   const onSubmit = async e => {
//     e.preventDefault();
//     try {
//       // Change endpoint according to your API route
//       const res = await axios.post('http://localhost:5000/api/auth/reset-password', formData);
//       setMessage(res.data.msg);
//       alert(res.data.msg);
//       // navigate('/posts');
//     } catch (err) {
//       setMessage(err.response?.data?.msg || 'Error resetting password.');
//     }
//   };

//   return (
//     <div className='container' style={{ padding: "40px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)", borderRadius: "20px" }}>
//       {message && <div style={{ paddingBottom: "20px", color: 'red' }}>{message}</div>}
//       <form onSubmit={onSubmit} className="container-sm">
//         <div className="mb-3">
//           <label className="form-label">Email</label>
//           <input
//             type="email"
//             className="form-control"
//             name="email"
//             value={formData.email}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Previous Password</label>
//           <input
//             type="password"
//             className="form-control"
//             name="previousPassword"
//             value={formData.previousPassword}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">New Password</label>
//           <input
//             type="password"
//             className="form-control"
//             name="newPassword"
//             value={formData.newPassword}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    previousPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        formData
      );
      setMessage(res.data.msg);
      alert(res.data.msg);
      // navigate('/login');
    } catch (err) {
      setMessage(
        err.response?.data?.msg || 'Error resetting password.'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Reset Password
        </h2>

        {message && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formData.email}
              onChange={onChange}
              required
             
            />
          </div>

          <div>
            <label
              htmlFor="previousPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Previous Password
            </label>
            <input
              type="password"
              name="previousPassword"
              id="previousPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formData.previousPassword}
              onChange={onChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={formData.newPassword}
              onChange={onChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
