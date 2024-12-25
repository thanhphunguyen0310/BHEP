import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  groupCode: '',
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLocalToCart: (state, action) => {
      state.cartItems = action.payload == null ? [] : action.payload
    },
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id  && item.type === action.payload.type
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += action.payload.quantity;
      } else {  
        const tempProduct = {
          ...action.payload,
        };
        state.cartItems.push(tempProduct);
      }
      if (action.payload.type === "2" && action.payload.groupCode) {
        state.groupCode = action.payload.groupCode;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateGroupCode: (state, action) => {
      state.groupCode = action.payload;
    },
    removeItemFromCart: (state, action) => {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
      state.cartItems = nextCartItems;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.groupCode = ''
      localStorage.setItem("groupCode", JSON.stringify(state.groupCode));
    },
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      } else if (state.cartItems[itemIndex].quantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
        state.cartItems = nextCartItems;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart:(state, action) => {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.groupCode = '';
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("groupCode", JSON.stringify(state.groupCode));
    },
    getTotal(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += quantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      state.cartTotalAmount = total;
      state.cartTotalQuantity = quantity;
    },
  },
});

export const {
  addToCart,
  updateGroupCode,
  removeItemFromCart,
  decreaseCart,
  clearCart,
  getTotal,
  setLocalToCart,
} = cartSlice.actions;
export default cartSlice.reducer;
  // cartItems: localStorage.getItem("cartItems")
  //   ? JSON.parse(localStorage.getItem("cartItems"))
  //   : [],