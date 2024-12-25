import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: [],
  reducers: {
    setProducts(state, action) {
      return action.payload;
    },
    resetProducts(state) {
      return [];
    },
  },
});

export const { setProducts, resetProducts } = productSlice.actions;
export default productSlice.reducer;
