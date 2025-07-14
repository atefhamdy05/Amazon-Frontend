import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types/Product";
import { fetchProducts } from "../api/productsApiSlice";

interface ProductState {
  products: Product[];
  count: number;
  loading: boolean;
  page: number;
}

const initialState: ProductState = {
  products: [],
  count: 0,
  loading: false,
  page: 1,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.results;
      state.count = action.payload.count;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setPage } = productsSlice.actions;
export default productsSlice.reducer;
