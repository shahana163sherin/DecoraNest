import axios from "axios";

const BASE_URL = "http://localhost:3000/products";

export const getAllProducts = () => axios.get(BASE_URL);

export const getProductById = (id) => axios.get(`${BASE_URL}/${id}`);

export const createProduct = (data) => axios.post(BASE_URL, data);

export const updateProduct = (id, data) => axios.put(`${BASE_URL}/${id}`, data);

export const deleteProduct = (id) => axios.delete(`${BASE_URL}/${id}`);


// export const getAllProducts = () => axios.get(BASE_URL);
// export const getProductById = (id) => axios.get(`${BASE_URL}/${id}`);
// export const createProduct = (data) => axios.post(BASE_URL,data);
// export const updateProduct = (id,data)=> axios.put(`${BASE_URL}/${id}`,data);
// export const deleteProduct = (id) => axios.delete(`${BASE_URL}/${id}`);
