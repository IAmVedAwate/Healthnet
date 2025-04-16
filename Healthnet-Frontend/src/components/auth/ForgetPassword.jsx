// import React, { useState } from 'react';
// import axios from 'axios';

// const ForgetPassword = () => {
//   const [formData, setFormData] = useState({
//     email: ''
//   });
//   const [message, setMessage] = useState(null);
//   const [tempPassword, setTempPassword] = useState(null);

//   // Handle form data changes
//   const onChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Handle form submission
//   const onSubmit = async e => {
//     e.preventDefault();
//     try {
//       // Call your forget-password API
//       const res = await axios.post('http://localhost:5000/api/auth/forget-password', formData);
//       setMessage(res.data.msg);
//       console.log(res.data);
//       // If the API response includes a temporary password, save it for display/copy
//       if (res.data.tempPassword) {
//         setTempPassword(res.data.tempPassword);
//       }
//       // In case of failure to send email but with a temporary password included
//       // The res.data.msg could be something like:
//       // "Failed to send email But Your password has been reset. Your new temporary password is: <tempPassword>"
//       // We assume the backend sends a separate field if available
//     } catch (err) {
//       setMessage(err.response?.data?.msg || 'Error processing forget-password request.');
//     }
//   };

//   // Copy tempPassword to clipboard
//   const copyToClipboard = async () => {
//     if (tempPassword) {
//       try {
//         await navigator.clipboard.writeText(tempPassword);
//         alert('Temporary password copied to clipboard!');
//       } catch (error) {
//         alert('Failed to copy text: ' + error);
//       }
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
//         <button type="submit" className="btn btn-primary mb-3">Reset Password</button>
//       </form>
//       {tempPassword && (
//         <div style={{ marginTop: "20px" }}>
//           <div style={{ marginBottom: "10px" }}>
//             Your new temporary password is: <strong>{tempPassword}</strong>
//           </div>
//           <button className="btn btn-success" onClick={copyToClipboard}>
//             Copy Temporary Password
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgetPassword;

import React, { useState } from 'react';
import axios from 'axios';

const ForgetPassword = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [message, setMessage] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/forget-password',
        formData
      );
      setMessage(res.data.msg);
      if (res.data.tempPassword) {
        setTempPassword(res.data.tempPassword);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.msg ||
          'Error processing forget-password request.'
      );
    }
  };

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
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
        Forgot Password
      </h2>

      {message && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Reset Password
        </button>
      </form>

      {tempPassword && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800 font-medium text-sm mb-2">
            Your new temporary password is:
          </p>
          <div className="bg-white p-2 rounded-md border text-center font-semibold text-green-700 text-lg mb-3">
            {tempPassword}
          </div>
          <button
            onClick={copyToClipboard}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all duration-200"
          >
            Copy Temporary Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
