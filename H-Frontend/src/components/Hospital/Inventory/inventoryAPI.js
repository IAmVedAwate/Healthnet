import axios from 'axios';

const BASE = 'http://localhost:5000/api/inventory';

const fetchInventory = (hospitalId) =>
  axios.get(BASE, {
    params: {
      hospital: hospitalId
  } });

const addInventory = (data) =>
  axios.post(`${BASE}/add`, data);

const updateInventory = (id, data) =>
  axios.put(`${BASE}/${id}`, data);

const deleteInventory = (id) =>
  axios.delete(`${BASE}/remove/${id}`);

const getInventoryById = (id) =>
  axios.get(`${BASE}/${id}`);

export {
  fetchInventory,
  addInventory,
  updateInventory,
  deleteInventory,
  getInventoryById
};
