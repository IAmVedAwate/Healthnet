
import React from 'react';
import "./HomeStyle.css";
import emergencyLogo from '../../assets/emergency.jpg';
import CardiologyLogo from '../../assets/cardiology.jpg';
import neurologyLogo from '../../assets/neurology.jpg';
import orthopedicsLogo from '../../assets/orthopedics.jpg';
import hematologyLogo from '../../assets/hematology.jpg';
import pedriaticLogo from '../../assets/pedriatic.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();
  const handleNavigation = ()=>{
    navigate('/hospital/get');
  }
  return (
    <div>
      <div className="my-5">
        <div className='home d-flex justify-content-center'>
          <div className="row mb-4 home-content container-fluid">
            
            <div className="col-md-4 py-3">
              <div style={{cursor:"pointer"}} className="card text-center">
                <img
                  src={emergencyLogo}
                  className="card-img-top"
                  alt="Emergency"
                />
                <div className="card-body">
                  <h5 className="card-title">Emergency</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 py-3">
              <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
                <img
                  src={CardiologyLogo}
                  className="card-img-top"
                  alt="Cardiology"
                />
                <div className="card-body">
                  <h5 className="card-title">Cardiology</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 py-3">
              <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
                <img
                  src={neurologyLogo}
                  className="card-img-top"
                  alt="Neurology"
                />
                <div className="card-body">
                  <h5 className="card-title">Neurology</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 py-3">
              <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
                <img
                  src={orthopedicsLogo}
                  className="card-img-top"
                  alt="Orthopedics"
                />
                <div className="card-body">
                  <h5 className="card-title">Orthopedics</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 py-3">
              <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
                <img
                  src={hematologyLogo}
                  className="card-img-top"
                  alt="Hematology"
                />
                <div className="card-body">
                  <h5 className="card-title">Hematology</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 py-3">
              <div onClick={handleNavigation} style={{cursor:"pointer"}} className="card text-center">
                <img
                  src={pedriaticLogo}
                  className="card-img-top"
                  alt="Pediatric"
                />
                <div className="card-body">
                  <h5 className="card-title">Pediatric</h5>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
