import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './store/authSlice';
import { toast } from "react-toastify";


function Navigation() {
  // const [token, setToken] = useState(null);
  // const [role, setRole] = useState(null);
  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    
    dispatch(logout());
    toast.error("Logged out!");
    navigate('/')
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-blue-700 font-bold text-xl">
            <Link to="/">Healthnet</Link>
          </div>

          {/* Links */}
          <div className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>

            {role === 'Hospital' && (
              <>
                <Link to="/doctor/get" className="text-gray-700 hover:text-blue-600 transition">
                  Doctors
                </Link>
                <Link to="/room/get" className="text-gray-700 hover:text-blue-600 transition">
                  Hospital Management
                </Link>
                <Link to="/patient/get" className="text-gray-700 hover:text-blue-600 transition">
                  Patients
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {!token ? (
              <>
                <Link
                  to="/signup"
                  className="text-sm border border-blue-500 text-blue-600 px-4 py-1.5 rounded hover:bg-blue-50 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-sm border border-green-500 text-green-600 px-4 py-1.5 rounded hover:bg-green-50 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm border border-red-500 text-red-600 px-4 py-1.5 rounded hover:bg-red-50 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;




// import React from 'react';
// import { Link } from 'react-router-dom';

// function Navigation() {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return (
//     <>
//       <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light custom-navbar border-bottom box-shadow mb-3">
//         <div className="container-fluid">
//           <a className="navbar-brand">Healthnet</a>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target=".navbar-collapse"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
//             <ul className="navbar-nav flex-grow-1 fw-bold">
//               {role && (
//                 <li className="nav-item">
//                   <Link to={"/"} className="nav-link text-dark">Home</Link>
//                 </li>
//               )}
//               {(role === 'hospital') && (
//                 <li className="nav-item">
//                   <Link to={"/bed/get"} className="nav-link text-dark">View Beds</Link>
//                 </li>
//               )}
//               {role === 'admin' && (
//                 <li className="nav-item">
//                   <Link to={"/hospital/get"} className="nav-link text-dark">View Hospitals</Link>
//                 </li>
//               )}
//               {role === 'hospital' && (
//                 <>
//                   <li className="nav-item">
//                     <Link to={"/doctor/get"} className="nav-link text-dark">View Doctors</Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link to={"/inventory/get"} className="nav-link text-dark">View Inventory</Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link to={"/patient/get"} className="nav-link text-dark">View Patients</Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//             <div>
//               {!token ? (
//                 <>
//                   <Link to={"/signup"} className="btn custom-btn ms-auto me-1">Register</Link>
//                   <Link to={"/login"} className="btn custom-btn ms-auto">Login</Link>
//                 </>
//               ) : (
//                 <button className="btn custom-btn ms-auto" onClick={() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('role');
//                   window.location.href = '/';
//                 }}>
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Inline CSS for demonstration */}
//       <style jsx>{`
//         .custom-navbar {
//           background-color: grey; /* Navbar background color */
//         }
//         .custom-btn {
//           border: 1px solid #ccc;
//           color: black; /* Button default text color */
//         }
//         .custom-btn:hover, .custom-btn:focus {
//           background-color: blue; /* Hover and focus background color */
//           color: white; /* Hover and focus text color */
//         }
//       `}</style>
//     </>
//   );
// }

// export default Navigation;


// import React from 'react';
// import { Link } from 'react-router-dom';

// function Navigation() {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return (
//     <>
//       <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light custom-navbar border-bottom box-shadow mb-3">
//         <div className="container-fluid">
//           <a className="navbar-brand">Healthnet</a>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target=".navbar-collapse"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
//             <ul className="navbar-nav flex-grow-1 fw-bold">
//               {role && (
//                 <li className="nav-item">
//                   <Link to={"/"} className="nav-link custom-link">Home</Link>
//                 </li>
//               )}
//               {(role === 'hospital') && (
//                 <li className="nav-item">
//                   <Link to={"/bed/get"} className="nav-link custom-link">View Beds</Link>
//                 </li>
//               )}
//               {role === 'admin' && (
//                 <li className="nav-item">
//                   <Link to={"/hospital/get"} className="nav-link custom-link">View Hospitals</Link>
//                 </li>
//               )}
//               {role === 'hospital' && (
//                 <>
//                   <li className="nav-item">
//                     <Link to={"/doctor/get"} className="nav-link custom-link">View Doctors</Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link to={"/inventory/get"} className="nav-link custom-link">View Inventory</Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link to={"/patient/get"} className="nav-link custom-link">View Patients</Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//             <div>
//               {!token ? (
//                 <>
//                   <Link to={"/signup"} className="btn custom-btn ms-auto me-1">Register</Link>
//                   <Link to={"/login"} className="btn custom-btn ms-auto">Login</Link>
//                 </>
//               ) : (
//                 <button className="btn custom-btn ms-auto" onClick={() => {
//                   localStorage.removeItem('token');
//                   localStorage.removeItem('role');
//                   window.location.href = '/';
//                 }}>
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Inline CSS for demonstration */}
//       <style jsx>{`
//         .custom-navbar {
//           background-color: grey; /* Navbar background color */
//         }
//         .custom-btn {
//           border: 1px solid #ccc;
//           color: black; /* Button default text color */
//         }
//         .custom-btn:hover, .custom-btn:focus {
//           background-color: white; /* Hover and focus background color */
//           color: white; /* Hover and focus text color */
//         }
//         .custom-link {
//           color: black; /* Default link color */
//           text-decoration: none; /* Remove underline */
//           transition: all 0.3s ease; /* Smooth transition for hover effects */
//         }
//         .custom-link:hover, .custom-link:focus {
//           color: white; /* Change link color to blue on hover */
//           transform: translateY(-2px); /* Move link slightly forward */
//           text-decoration: none; /* Ensure no underline on hover */
//         }
//       `}</style>
//     </>
//   );
// }

// export default Navigation;

