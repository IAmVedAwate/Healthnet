import React from 'react';

const InventoryList = ({ items, onEdit, onView, onDelete }) => {
  if (!items.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No inventory items found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.inventoryId}
          className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
        >
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {item.itemName}
            </h2>
            <p className="text-sm text-gray-600">
              Type: {item.itemType || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              Quantity: <span className="font-medium">{item.quantity}</span>
            </p>
            <p className="text-sm text-gray-600">
              Expiry: {item.receivedDate?.split('T')[0] || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600">
              Supplier: {item.supplier || 'Unknown'}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => onView(item)}
              className="text-blue-600 hover:underline text-sm"
            >
              View
            </button>
            <button
              onClick={() => onEdit(item)}
              className="text-yellow-600 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.inventoryId)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
