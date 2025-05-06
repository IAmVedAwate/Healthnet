// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, NavLink, useNavigate } from 'react-router';
// import { logout } from './store/authSlice';
// import { toast } from "react-toastify";
// import Profile from "./components/profile/Profile";
// import { Search, User } from "lucide-react";

// const NavItem = ({ to, children, activeColor = "yellow-400", hoverColor = "white" }) => {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) => `
//         relative p-4 text-white
//       ${isActive ? "text-yellow-400" : ""}
//       after:content-[''] after:absolute after:left-0 after:bottom-2
//       after:h-[2px] after:bg-white
//       after:w-0 after:transition-all after:duration-300
//       ${isActive ? "after:w-full after:bg-yellow-400" : "hover:after:w-full"}
//       `}
//     >
//       {children}
//     </NavLink>
//   );
// };

// function Navigation() {

//   const { token, role } = useSelector((state) => state.auth);
//   const isLoggedIn = !!role; // Ensure it's a boolean
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const [showProfile, setShowProfile] = useState(false);
  
//   const toggleProfile = () => setShowProfile(!showProfile);

//   const handleLogout = () => {
//     setShowProfile(false); // 👈 Reset profile visibility
//     dispatch(logout());
//     toast.error("Logged out!");
//     navigate('/');
//   };
  

//   return (
//     <div className="bg-blue-900 shadow-lg sticky top-0 z-50 ">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center  text-white">
//           {/* Logo */}
//           <div className="flex-shrink-0 font-bold text-xl">
//             <Link to="/">Healthnet</Link>
//           </div>

//           {/* Links */}
//             <div className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
//               <NavItem to="/">Home</NavItem>

//               {role === "Admin" && <NavItem to="/admin">Dashboard</NavItem>}

//               {role === "Hospital" && (
//                 <>
//                   <NavItem to="/doctor/get">Doctors</NavItem>
//                   <NavItem to="/room/get">Hospital Management</NavItem>
//                   <NavItem to="/patient/get">Patients</NavItem>
//                 </>
//               )}

//               {role === "Patient" && (
//                 <NavItem to="/patients/book-appointment">Appointment</NavItem>
//               )}
//             </div>

//           {/* Actions */}
//           <div className="flex items-center space-x-2">
//             {!token ? (
//               <>
//                 <Link
//                   to="/signup"
//                   className="text-sm border bg-blue-500 text-white px-4 py-1.5 rounded hover:scale-110 transition"
//                 >
//                   Register
//                 </Link>
//                 <Link
//                   to="/login"
//                   className="text-sm border bg-green-500 text-white px-4 py-1.5 rounded hover:scale-110 transition"
//                 >
//                   Login
//                 </Link>
//               </>
//             ) : (
//                 <>
//                 <button
//                 onClick={handleLogout}
//                 className="text-sm border bg-red-500 text-white px-4 py-1.5 rounded hover:scale-110 transition"
//               >
//                 Logout
//                 </button>
//                 <button onClick={toggleProfile} className="flex items-center font-medium focus:outline-none">
//                 <User className="ml-4" size={20} />
//               </button></>
                
//             )}
//           </div>
//           {isLoggedIn && <Profile show={showProfile} toggle={toggleProfile} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navigation;


import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "./store/authSlice";
import { toast } from "react-toastify";
import { User } from "lucide-react";
import Profile from "./components/profile/Profile"; // Adjust import as needed

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      relative p-4 text-white font-medium text-sm
      ${isActive ? "text-yellow-400" : ""}
      after:content-[''] after:absolute after:left-0 after:bottom-2
      after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300
      ${isActive ? "after:w-full after:bg-yellow-400" : "hover:after:w-full"}
    `}
  >
    {children}
  </NavLink>
);

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  const [showProfile, setShowProfile] = useState(false);
  const toggleProfile = () => setShowProfile((prev) => !prev);

  const handleLogout = () => {
    setShowProfile(false);
    dispatch(logout());
    toast.error("Logged out!");
    navigate("/");
  };

  return (
    <header className="bg-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-xl">Healthnet</Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavItem to="/">Home</NavItem>

            {role === "Admin" && <NavItem to="/admin">Dashboard</NavItem>}

            {role === "Hospital" && (
              <>
                <NavItem to="/doctor/get">Doctors</NavItem>
                <NavItem to="/room/get">Hospital Management</NavItem>
                <NavItem to="/patient/get">Patients</NavItem>
                <NavItem to="/inventory">Inventory</NavItem>
              </>
            )}

            {role === "Patient" && (
              <NavItem to="/patients/book-appointment">Appointment</NavItem>
            )}
          </nav>

          {/* Auth actions */}
          <div className="flex items-center space-x-2">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded hover:scale-110 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-sm bg-green-500 text-white px-4 py-1.5 rounded hover:scale-110 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {/* <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 text-white px-4 py-1.5 rounded hover:scale-110 transition"
                >
                  Logout
                </button> */}
                <button
                  onClick={toggleProfile}
                  className="flex items-center focus:outline-none"
                >
                  <User size={20} className="text-white ml-2" />
                </button>
              </>
            )}
          </div>

          {/* Profile Sidebar */}
          {isLoggedIn && <Profile show={showProfile} toggle={toggleProfile} />}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
