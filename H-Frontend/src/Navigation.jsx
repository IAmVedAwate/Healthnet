import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router';
import { logout } from './store/authSlice';
import { toast } from "react-toastify";


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
          <div className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium ">
            <Link to="/" className=" transition ">
              Home
            </Link>

            {role === 'Hospital' && (
              <>
                <Link to="/doctor/get" className="">
                  Doctors
                </Link>
                <Link to="/room/get" className="no-underline">
                  Hospital Management
                </Link>
                <Link to="/patient/get" className="">
                  Patients
                </Link>
              </>
            )}
            {role === "Patient" && (
              <>
              <NavLink to={"/patients/book-appointment"} className=''>Appointment</NavLink>
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
    </div>
  );
}

export default Navigation;
