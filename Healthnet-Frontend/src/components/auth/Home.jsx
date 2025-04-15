
// import React from 'react';
// import "./HomeStyle.css";
// import emergencyLogo from '../../assets/emergency.jpg';
// import CardiologyLogo from '../../assets/cardiology.jpg';
// import neurologyLogo from '../../assets/neurology.jpg';
// import orthopedicsLogo from '../../assets/orthopedics.jpg';
// import hematologyLogo from '../../assets/hematology.jpg';
// import pedriaticLogo from '../../assets/pedriatic.jpg';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {

//   const navigate = useNavigate();
//   const handleNavigation = ()=>{
//     navigate('/hospital/get');
//   }
//   return (
//     <div>
//       <div className="my-5">
//         <div className='home d-flex justify-content-center'>
//           <div className="row mb-4 home-content container-fluid">
            
//             <div className="col-md-4 py-3">
//               <div style={{cursor:"pointer"}} className="card text-center">
//                 <img
//                   src={emergencyLogo}
//                   className="card-img-top"
//                   alt="Emergency"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">Emergency</h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 py-3">
//               <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
//                 <img
//                   src={CardiologyLogo}
//                   className="card-img-top"
//                   alt="Cardiology"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">Cardiology</h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 py-3">
//               <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
//                 <img
//                   src={neurologyLogo}
//                   className="card-img-top"
//                   alt="Neurology"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">Neurology</h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 py-3">
//               <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
//                 <img
//                   src={orthopedicsLogo}
//                   className="card-img-top"
//                   alt="Orthopedics"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">Orthopedics</h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 py-3">
//               <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
//                 <img
//                   src={hematologyLogo}
//                   className="card-img-top"
//                   alt="Hematology"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">Hematology</h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 py-3">
//               <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
//                 <img
//                   src={pedriaticLogo}
//                   className="card-img-top"
//                   alt="Pediatric"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">Pediatric</h5>
//                 </div>
//               </div>
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;



// import Header from "./Header";
import doctorImg from "../../assets/doctorImg.png";
import hospital from "../../assets/hosp,map.png";
import queue from "../../assets/queue.png";
import bed from "../../assets/bed.png";
import inventory from "../../assets/inventory.png";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* <Header /> Calling the extracted header here */}

      {/* Hero Section */}
      <div className="bg-blue-900 text-white rounded-lg p-8 mt-6 shadow-lg flex flex-col md:flex-row items-center">
        <div className="flex-1">
          <h2 className="text-5xl font-bold">HealthNet</h2>
          <p className="mt-2">Revolutionizing healthcare with seamless digital connectivity and smart patient management.</p>
          <div className="mt-4 flex space-x-4">
            <span className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
              <span>Save Time</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span>No More Medications</span>
            </span>
          </div>
          
        </div>
        <img src={doctorImg} alt="Doctor" className="w-64 md:w-80 mt-6 md:mt-0 rounded-lg" />
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        {features.map(({ title, description, color, icon }, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-md ${color}`}>
            <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
            <p className="text-gray-700 mt-1">{description}</p>
            <img src={icon} alt={title} className="ml-40 mt-4 w-36 rounded-2xl" />
          </div>
        ))}
      </div>
      
    </div>
  );
};

const features = [
  { title: "Find The Hospital Near You", description: "Save Time, Get Care Faster", color: "bg-green-200", icon: hospital },
  { title: "Real-Time Bed Availability", description: "Always Know Where A Bed Is Available", color: "bg-yellow-200", icon: bed },
  { title: "Patient Queue Management", description: "Less Waiting, More Healing", color: "bg-pink-200", icon: queue },
  { title: "Track Medical Inventory", description: "Ensuring Hospitals Never Run Out Of Essentials", color: "bg-blue-200", icon: inventory }
];

export default Home;
