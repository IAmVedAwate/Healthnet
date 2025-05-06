import React, { useEffect, useState } from 'react';
import InventoryList from './InventoryList';
import InventoryForm from './InventoryForm';
import InventoryDetailsModal from './InventoryDetailsModal';
import DeleteConfirmation from './DeleteConfirmation';
import { fetchInventory, addInventory, updateInventory, deleteInventory } from './inventoryAPI';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

 const {id , token} = useSelector((state) => state.auth)

  const loadInventory = async () => {
    try {
      setLoading(true);
      const { data } = await fetchInventory(id);
      setInventory(data);
    } catch (err) {
      console.error('Error loading inventory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setShowForm(true);
  };
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (isEditMode) {
        // Updating the inventory item
        await updateInventory(selectedItem.inventoryId, values);
        toast.success("Inventory item updated successfully");
      } else {
        // Adding a new inventory item
        await addInventory({ ...values, hospital: id });
        toast.success("Inventory item added successfully");
      }
  
      // Reload inventory after submit
      await loadInventory();
      
      // Reset form fields and close the form modal
      resetForm();
      setShowForm(false);
  
    } catch (err) {
      console.error('Error submitting form:', err.message);
      toast.error("An error occurred while submitting the form. Please try again.");
    }
  };
  

  const handleDelete = async () => {
    try {
      await deleteInventory(deleteItemId);
      await loadInventory();
      setDeleteItemId(null);
      toast.success("Removed successfully")
    } catch (err) {
      console.error('Error deleting item:', err.message);
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Inventory</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Item
        </button>
      </div>

      {loading ? (
  <p className="text-gray-500">Loading inventory...</p>
) : inventory.length === 0 ? (
  <div className="text-center text-gray-500 mt-10">
    <p className="text-lg">No inventory items found.</p>
    <p className="text-sm mt-1">Click “+ Add Item” to create a new one.</p>
  </div>
) : (
  <InventoryList
    items={inventory}
    onEdit={handleEdit}
    onView={(item) => {
      setSelectedItem(item);
      setShowDetails(true);
    }}
    onDelete={(id) => setDeleteItemId(id)}
  />
)}

      {showForm && (
        <InventoryForm
          initialValues={
            selectedItem || {
              itemName: '',
              quantity: '',
              expiryDate: '',
              itemType: '',
              supplier: '',
            }
          }
          isEditMode={isEditMode}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {showDetails && selectedItem && (
        <InventoryDetailsModal
          item={selectedItem}
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
        />
      )}

      {deleteItemId && (
        <DeleteConfirmation
          itemName={
            inventory.find((item) => item.inventoryId === deleteItemId)?.itemName || 'Item'
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleteItemId(null)}
        />
      )}
    </div>
  );
};

export default InventoryDashboard;
