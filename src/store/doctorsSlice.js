import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHighRateDoctor, getDoctor, getDoctorDetail } from '../configs/api/doctorApi';

// Define initial state
const initialState = {
  highRateDoctors: [],
  allDoctors: [],
  doctorDetails: {},
  status: 'idle',
  error: null
};

export const fetchHighRateDoctors = createAsyncThunk(
  'doctors/fetchHighRateDoctors',
  async () => {
    const highRateDoctors = await getHighRateDoctor();
    return highRateDoctors;
  }
);

export const fetchAllDoctors = createAsyncThunk(
    'doctors/fetchAllDoctors',
    async ({ pageIndex, pageSize }) => {
      try {
        const response = await getDoctor(pageIndex, pageSize);
        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  );
  

export const fetchDoctorDetails = createAsyncThunk(
  'doctors/fetchDoctorDetails',
  async (id) => {
    const doctorDetails = await getDoctorDetail(id);
    return doctorDetails;
  }
);


const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // fetch data doctor with high rating
      .addCase(fetchHighRateDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHighRateDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.highRateDoctors = action.payload;
      })
      .addCase(fetchHighRateDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // fetch all data doctor
      .addCase(fetchAllDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allDoctors = action.payload.items;
        console.log(action.payload.items)
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
        // fetch data detail doctor
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.doctorDetails[action.meta.arg] = action.payload;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default doctorsSlice.reducer;
