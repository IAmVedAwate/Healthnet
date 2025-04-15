import { X, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { CircleUser } from 'lucide-react';


const Profile = ({ show, toggle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    //toast.error("Logged out!!")
      navigate("/")

  };
  const { username , email } = useSelector((state) => state.auth)

  return (
    <div className={`z-90 fixed top-0 right-0 h-full w-72 bg-slate-950 shadow-lg transform ${show ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold text-gray-300">Profile</h2>
        <button onClick={toggle}>
          <X size={24} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="p-6 text-center">
        <div className="w-20 h-20 bg-blue-400 rounded-full mx-auto mb-4">
          <CircleUser size={80}/>
        </div>
        <h3 className="text-xl font-semibold text-gray-400">{username}</h3>
        <p className="text-gray-300">{email}</p>
      </div>

      <div className="p-6">
        <button onClick={handleLogout} className="flex items-center w-full bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
          <LogOut className="mr-2" size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
