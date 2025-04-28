import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router';
import { logout } from './store/authSlice';
import { toast } from "react-toastify";


const NavItem = ({ to, children, activeColor = "yellow-400", hoverColor = "white" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative p-4 text-white transition
        after:content-[''] after:absolute after:left-0 after:bottom-2
        after:h-[2px] after:bg-${hoverColor}
        after:w-0 after:transition-all after:duration-300
        ${isActive ? `text-${activeColor} after:w-full after:bg-${activeColor}` : "hover:after:w-full"}
      `}
    >
      {children}
    </NavLink>
  );
};

function Navigation() {

  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    
    dispatch(logout());
    toast.error("Logged out!");
    navigate('/')
  };

  return (
    <div className="bg-blue-900 shadow-lg sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center  text-white">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl">
            <Link to="/">Healthnet</Link>
          </div>

          {/* Links */}
            <div className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
              <NavItem to="/">Home</NavItem>

              {role === "Admin" && <NavItem to="/admin">Dashboard</NavItem>}

              {role === "Hospital" && (
                <>
                  <NavItem to="/doctor/get">Doctors</NavItem>
                  <NavItem to="/room/get">Hospital Management</NavItem>
                  <NavItem to="/patient/get">Patients</NavItem>
                </>
              )}

              {role === "Patient" && (
                <NavItem to="/patients/book-appointment">Appointment</NavItem>
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
    </div>
  );
}

export default Navigation;
