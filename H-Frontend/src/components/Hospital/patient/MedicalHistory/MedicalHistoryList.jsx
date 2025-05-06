// import React, { useEffect, useState } from 'react';
// import { getMedicalHistoryByPatient } from './medicalHistoryAPI';
// import { useSelector } from 'react-redux';
// import { FileImage, FileText, X } from 'lucide-react';

// const MedicalHistoryList = () => {
//   const BACKEND_BASE_URL = 'http://localhost:5000';
//   const { id: patientId, role } = useSelector((state) => state.auth); // Assuming `role` is part of the auth state
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [previewFile, setPreviewFile] = useState(null);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const data = await getMedicalHistoryByPatient(patientId);
//         setHistory(data);
//       } catch (error) {
//         console.error('Failed to fetch medical history:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [patientId]);

//   if (loading) return <p>Loading medical history...</p>;
//   if (!history.length) return <p>No medical history found.</p>;

//   // Dynamic title based on user role
//   const title = role === 'patient' ? 'Past Uploaded Records' : 'Patient Medical History';

//   return (
//     <>
//       <h2 className="text-2xl font-semibold mb-4">{title}</h2>

//       <div className="grid gap-4 mt-4">
//         {history.map((file, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between bg-white shadow-sm p-4 rounded-md border"
//           >
//             <div className="flex items-center gap-3">
//               {file.fileType.includes('pdf') ? (
//                 <FileText className="text-red-500 w-6 h-6" />
//               ) : (
//                 <FileImage className="text-blue-500 w-6 h-6" />
//               )}
//               <div>
//                 <p className="font-medium">{file.fileName}</p>
//                 <p className="text-xs text-gray-500">
//                   Uploaded: {new Date(file.uploadedAt).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setPreviewFile(file)}
//               className="text-blue-600 hover:underline"
//             >
//               View
//             </button>
//           </div>
//         ))}
//       </div>

//       {previewFile && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] p-4 overflow-auto">
//             <button
//               onClick={() => setPreviewFile(null)}
//               className="absolute top-2 right-2 text-gray-600 hover:text-black"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <h2 className="text-lg font-semibold mb-4">{previewFile.fileName}</h2>

//             {previewFile.fileType.includes('pdf') ? (
//               <iframe
//                 src={`${BACKEND_BASE_URL}/uploads/history/${previewFile.fileName}`}
//                 title="PDF Preview"
//                 className="w-full h-[70vh] rounded-md border"
//               />
//             ) : (
//               <img
//                 src={`${BACKEND_BASE_URL}/uploads/history/${previewFile.fileName}`}
//                 alt={previewFile.fileName}
//                 className="max-w-full max-h-[70vh] object-contain mx-auto rounded-md"
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default MedicalHistoryList;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMedicalHistoryByPatient } from './medicalHistoryAPI';
import { FileImage, FileText, X } from 'lucide-react';

const MedicalHistoryViewer = ({ patientId, role }) => {
  const BACKEND_BASE_URL = 'http://localhost:5000';
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchHistory = async () => {
      try {
        const data = await getMedicalHistoryByPatient(patientId);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch medical history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  if (loading) return <p>Loading medical history...</p>;
  if (!history.length) return <p>No medical history found.</p>;

  const title = role === 'Patient' ? 'Past Uploaded Records' : 'Patient Medical History';

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      <div className="grid gap-4 mt-4">
        {history.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white shadow-sm p-4 rounded-md border"
          >
            <div className="flex items-center gap-3">
              {file.fileType.includes('pdf') ? (
                <FileText className="text-red-500 w-6 h-6" />
              ) : (
                <FileImage className="text-blue-500 w-6 h-6" />
              )}
              <div>
                <p className="font-medium">{file.fileName}</p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPreviewFile(file)}
              className="text-blue-600 hover:underline"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {previewFile && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] p-4 overflow-auto">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">{previewFile.fileName}</h2>

            {previewFile.fileType.includes('pdf') ? (
              <iframe
                src={`${BACKEND_BASE_URL}/uploads/history/${previewFile.fileName}`}
                title="PDF Preview"
                className="w-full h-[70vh] rounded-md border"
              />
            ) : (
              <img
                src={`${BACKEND_BASE_URL}/uploads/history/${previewFile.fileName}`}
                alt={previewFile.fileName}
                className="max-w-full max-h-[70vh] object-contain mx-auto rounded-md"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

MedicalHistoryViewer.propTypes = {
  patientId: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['patient', 'hospital']).isRequired,
};

export default MedicalHistoryViewer;
