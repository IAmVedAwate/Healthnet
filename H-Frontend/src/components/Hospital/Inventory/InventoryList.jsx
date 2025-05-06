import React, { useState, useMemo } from 'react';

const InventoryList = ({ items, onEdit, onView, onDelete }) => {
  const [selectedType, setSelectedType] = useState(null);

  const groupedByType = useMemo(() => {
    return items.reduce((acc, item) => {
      const type = item.itemType || 'Unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  }, [items]);

  const itemTypes = Object.keys(groupedByType);

  const handleTypeClick = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };

  return (
    <div className="space-y-8">
      {/* Item Type Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {itemTypes.map((type) => (
          <div
            key={type}
            onClick={() => handleTypeClick(type)}
            className={`cursor-pointer p-4 rounded-lg shadow-md border text-center transition-all
              ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
          >
            <p className="text-lg font-semibold capitalize">{type}</p>
            <p className="text-sm text-gray-500">{groupedByType[type].length} items</p>
          </div>
        ))}
      </div>

      {/* Inventory Items of Selected Type */}
      {selectedType && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Items in <span className="capitalize text-blue-600">{selectedType}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groupedByType[selectedType].map((item) => (
              <div
                key={item.inventoryId}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
              >
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
                  <p className="text-sm text-gray-600">
                    Quantity: <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Expiry: {item.expiryDate?.split('T')[0] || 'Unknown'}
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
        </div>
      )}
    </div>
  );
};

export default InventoryList;
