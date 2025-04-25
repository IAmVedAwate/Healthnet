import React from 'react';
import { Link } from 'react-router';

const Signup = () => {
  return (
    <div className="flex min-h-screen">
      {/* Hospital Section (Left) */}
      <div className="w-1/2 bg-blue-300 text-blue-950 flex flex-col items-center justify-center p-10 space-y-6">
        <h2 className="text-4xl font-bold">Join as a Hospital</h2>
        <p className="text-lg text-center max-w-md">
          Register your hospital with HealthNet to manage appointments, doctors, and patients efficiently.
        </p>
        <Link
          to="/hospital-signup"
          className="bg-blue-950 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-900 transition-all"
        >
          Hospital Signup
        </Link>
      </div>

      {/* Patient Section (Right) */}
      <div className="w-1/2 bg-blue-950 text-white flex flex-col items-center justify-center p-10 space-y-6">
        <h2 className="text-4xl font-bold">Join as a Patient</h2>
        <p className="text-lg text-center max-w-md">
          Sign up to book appointments, access medical records, and connect with hospitals near you.
        </p>
        <Link
          to="/patient-signup"
          className="bg-white text-blue-950 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-all"
        >
          Patient Signup
        </Link>
      </div>
    </div>
  );
};

export default Signup;
