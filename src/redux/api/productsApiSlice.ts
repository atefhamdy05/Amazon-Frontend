import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (page: number = 1) => {
    const res = await axios.get(
      `http://localhost:8000/api/products/?page=${page}`
    );
    return res.data;
  }
);
