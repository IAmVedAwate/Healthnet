import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { inventorySchema } from './validationSchema';

const InventoryForm = ({ initialValues, isEditMode, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={inventorySchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <Field
                  name="itemName"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="itemName" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <Field
                  name="quantity"
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <Field
                  name="expiryDate"
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Item Type */}
              <div>
                <label htmlFor="itemType" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Type
                </label>
                <Field
                  name="itemType"
                  as="select"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select type</option>
                  <option value="medicine">Medicine</option>
                  <option value="equipment">Equipment</option>
                  <option value="supply">Supply</option>
                </Field>
                <ErrorMessage name="itemType" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <Field
                  name="supplier"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="supplier" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditMode ? 'Update' : 'Add'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InventoryForm;
