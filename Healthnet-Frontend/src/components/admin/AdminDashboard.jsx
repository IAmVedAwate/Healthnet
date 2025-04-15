import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Building2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const AdminDashboard = () => {
  const [tab, setTab] = useState("hospitals");
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hospitals", {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      });
        
        setHospitals(res.data);
        console.log(res.data);

    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  const fetchSignupRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/signup-requests", {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      });
        setRequests(res.data);
        console.log(res.data)
    } catch (err) {
      console.error("Error fetching signup requests:", err);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/api/auth/admin/approve/${requestId}`, {}, {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      });
      fetchSignupRequests();
      fetchHospitals();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${requestId}`, {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      });
      fetchSignupRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (tab === "requests") fetchSignupRequests();
  }, [tab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Admin Dashboard
        </h1>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setTab("hospitals")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "hospitals"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            Approved Hospitals
          </button>
          <button
            onClick={() => setTab("requests")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "requests"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            Signup Requests
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tab === "hospitals"
            ? hospitals.map((hospital) => (
                <div
                  key={hospital.hospitalId || uuidv4()}
                  className="bg-white shadow-lg rounded-xl p-5 border border-blue-100 hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-4">
                    <Building2 className="text-blue-500" size={36} />
                    <div>
                    <h2 className="text-lg font-semibold text-blue-800">{hospital.hospitalName}</h2>
<p className="text-gray-600 text-sm">📍 {hospital.hospitalLocation}</p>
<p className="text-sm text-gray-700">📞 {hospital.hospitalContactInfo}</p>

                    </div>
                  </div>
                </div>
              ))
              : requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white border border-green-100 shadow-lg rounded-xl p-5 hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start">
                    {/* Left section: hospital info */}
                    <div>
                      <h2 className="text-xl font-bold text-green-800">{request.name}</h2>
                      <p className="text-sm text-gray-700 font-medium mt-1">
                        📧 <span className="ml-1">{request.email}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">📍 {request.location}</p>
                      <p className="text-sm text-gray-600 mt-1">📞 {request.contact}</p>
                      <p className="text-sm text-gray-500 mt-1 italic">
                        Submitted on: {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {request.status}
                      </span>
                    </div>
            
                    {/* Right section: action buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-md flex items-center gap-1 shadow"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md flex items-center gap-1 shadow"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
            ))
            }
        </div>

        {tab === "hospitals" && hospitals.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No hospitals found.</p>
        )}
        {tab === "requests" && requests.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No signup requests pending.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
