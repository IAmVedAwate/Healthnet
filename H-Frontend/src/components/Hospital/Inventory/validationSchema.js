import * as Yup from 'yup';

export const inventorySchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long'),
  
  quantity: Yup.number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1')
    .typeError('Quantity must be a number'),

  expiryDate: Yup.date()
    .required('Expiry Date is required')
    .min(new Date(), 'Expiry Date cannot be in the past'),

  itemType: Yup.string()
    .required('Item Type is required')
    .oneOf(['medicine', 'equipment', 'supply'], 'Invalid item type'),

  supplier: Yup.string()
    .nullable()
    .notRequired()
    .min(3, 'Supplier name must be at least 3 characters'),
});
