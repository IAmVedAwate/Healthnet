import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { inventorySchema } from './validationSchema';

const InventoryForm = ({ initialValues, isEditMode, onSubmit, onClose }) => {
  console.log(initialValues)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={inventorySchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
                <Field name="itemName" type="text" className="input" />
                <ErrorMessage name="itemName" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <Field name="quantity" type="number" min="0" className="input" />
                <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <Field name="expiryDate" type="date" className="input" />
                <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Item Type */}
              <div>
                <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">Item Type</label>
                <Field name="itemType" as="select" className="input">
                  <option value="">Select type</option>
                  <option value="medicine">Medicine</option>
                  <option value="equipment">Equipment</option>
                  <option value="supply">Supply</option>
                </Field>
                <ErrorMessage name="itemType" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
                <Field name="supplier" type="text" className="input" />
                <ErrorMessage name="supplier" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
