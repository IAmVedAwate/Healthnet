import React from 'react';

const DeleteConfirmation = ({ itemName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/75">
      <div className="bg-white w-96 rounded-lg shadow-xl p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h3 className="text-2xl font-semibold text-center mb-4 text-red-600">Confirm Deletion</h3>
        
        <div className="mb-4 text-center">
          Are you sure you want to delete <span className="font-semibold">{itemName}</span>?
        </div>

        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
