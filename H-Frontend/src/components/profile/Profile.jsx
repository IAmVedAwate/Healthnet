// import { X, LogOut, UploadCloud } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../../../Healthnet-Frontend/src/store/authSlice";
// import { useNavigate } from "react-router";
// import { CircleUser } from 'lucide-react';

// const Profile = ({ show, toggle }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   const { username, email } = useSelector((state) => state.auth);

//   const handleUploadClick = () => {
//     toggle(); // Close profile sidebar
//     navigate("/upload");
//   };

//   return (
//     <div className={`z-90 fixed top-0 right-0 h-full w-72 bg-slate-950 shadow-lg transform ${show ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
//       <div className="flex justify-between items-center p-4 border-b">
//         <h2 className="text-lg font-bold text-gray-300">Profile</h2>
//         <button onClick={toggle}>
//           <X size={24} className="text-gray-500 hover:text-gray-700" />
//         </button>
//       </div>

//       <div className="p-6 text-center">
//         <div className="w-20 h-20 bg-blue-400 rounded-full mx-auto mb-4">
//           <CircleUser size={80} />
//         </div>
//         <h3 className="text-xl font-semibold text-gray-400">{username}</h3>
//         <p className="text-gray-300">{email}</p>
//       </div>

//       <div className="px-6 pb-4">
//         <button
//           onClick={handleUploadClick}
//           className="flex items-center w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mb-3"
//         >
//           <UploadCloud className="mr-2" size={18} /> Upload Medical History
//         </button>

//         <button
//           onClick={handleLogout}
//           className="flex items-center w-full bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
//         >
//           <LogOut className="mr-2" size={18} /> Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { X, LogOut, UploadCloud, CircleUser } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice"; // Adjust path as needed
import { useNavigate } from "react-router";

const Profile = ({ show, toggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role} = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout());
    toggle(); // Close profile on logout
    navigate("/");
  };

  const handleUploadClick = () => {
    toggle();
    navigate("/upload");
  };

  return (
    <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-slate-950 shadow-lg transform transition-transform duration-300 ${show ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-gray-300">Profile</h2>
        <button onClick={toggle}>
          <X size={24} className="text-gray-500 hover:text-gray-300" />
        </button>
      </div>

      <div className="p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-blue-400 rounded-full">
          <CircleUser size={80} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-400">Welcome!</h3>
      </div>

      <div className="px-6 pb-4">
       {role === "Patient" && ( <button
          onClick={handleUploadClick}
          className="flex items-center w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 mb-3"
        >
          <UploadCloud size={18} className="mr-2" />
          Upload Medical History
        </button>)}

        <button
          onClick={handleLogout}
          className="flex items-center w-full bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
