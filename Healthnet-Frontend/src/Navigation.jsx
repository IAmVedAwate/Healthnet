import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow">
        <div className="container-fluid">
          <a className="navbar-brand">Healthnet</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
            <ul className="navbar-nav flex-grow-1 fw-bold">
              {/* {role && ( */}
                <li className="nav-item">
                  <Link to={"/"} className="nav-link text-dark">Home</Link>
                </li>
              {/* )} */}
              {/* {role === 'hospital' && ( */}
                <>
                  <li className="nav-item">
                    <Link to={"/doctor/get"} className="nav-link text-dark">Doctors</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/room/get"} className="nav-link text-dark">Hospital Management</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/patient/get"} className="nav-link text-dark">Patients</Link>
                  </li>
                </>
              {/* )} */}
            </ul>
            <div>
              {!token ? (
                <>
                  <Link to={"/signup"} className="btn btn-outline-primary ms-auto me-1">Register</Link>
                  <Link to={"/login"} className="btn btn-outline-success ms-auto">Login</Link>
                </>
              ) : (
                <button className="btn btn-outline-danger ms-auto" onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  window.location.href = '/';
                }}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
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

