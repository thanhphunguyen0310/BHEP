import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    userId: null,
    employeeId: null,
    date: null,
    time: null,
    price: null,
    note: '',
    symptoms: [],
  },
  reducers: {
    setAppointment(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetAppointment(state) {
      return {
        userId: null,
        employeeId: null,
        date: null,
        time: null,
        price: null,
        note: '',
        symptoms: [],
      };
    },
  },
});

export const { setAppointment, resetAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
