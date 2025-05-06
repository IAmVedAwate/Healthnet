import React from 'react';

const InventoryDetailsModal = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75">
      <div className="bg-white w-96 rounded-lg shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h3 className="text-2xl font-semibold text-center mb-4">Item Details</h3>
        
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {item.itemName}
          </div>
          <div>
            <strong>Quantity:</strong> {item.quantity}
          </div>
          <div>
            <strong>Item Type:</strong> {item.itemType}
          </div>
          <div>
            <strong>Supplier:</strong> {item.supplier || 'N/A'}
          </div>
          <div>
            <strong>Expiry Date:</strong> {new Date(item.receivedDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsModal;
