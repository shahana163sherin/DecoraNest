import axios from "axios";

const BASE_URL = "http://localhost:5094/api/v1/users/Product";

export const getAllProducts = () => axios.get(BASE_URL);

export const getProductById = (id) =>
  axios.get(`${BASE_URL}/${id}?id=${id}`);

export const getProductsByCategory = (category) =>
  axios.get(`${BASE_URL}/category?category=${category}`);

// export const createProduct = (data) => axios.post(BASE_URL, data);

// export const updateProduct = (id, data) => axios.put(`${BASE_URL}/${id}`, data);

// export const deleteProduct = (id) => axios.delete(`${BASE_URL}/${id}`);

