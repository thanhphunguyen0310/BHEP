import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import doctorsReducer from './doctorsSlice';
import appointmentReducer from './appointmentSlice';
import productReducer from './productSlice'
import cartReducer from "./cartSlice"
import transactionReducer from "./transactionSlice"
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'transaction'], 
};


const rootReducer = combineReducers({
  auth: authReducer,
  doctors: doctorsReducer,
  appointment: appointmentReducer,
  products: productReducer,
  cart: cartReducer,
  transaction: transactionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
