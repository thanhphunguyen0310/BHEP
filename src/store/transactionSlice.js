import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transaction: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    createTransaction: (state, action) => {
      state.transaction = action.payload;
    },
    clearTransaction: (state, action) => {
      state.transaction = null;
    },
  },
});

export const { createTransaction, clearTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
