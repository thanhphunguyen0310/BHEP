import apiClient from "./index";

export const getHighRateDoctor = async () => {
  try {
    const response = await apiClient.get("/User/Doctors");
    const doctors = response.data.data.items;
    const sortedDoctors = doctors.sort((a, b) => b.rate - a.rate);
    const highRateDoctors = sortedDoctors.slice(0, 8);
    return highRateDoctors;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getDoctor = async (pageIndex, pageSize) => {
  try {
    const response = await apiClient.get("/User/Doctors", {
      params: {
        pageIndex,
        pageSize,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getSpecialist = async (pageIndex, pageSize) => {
  try {
    const response = await apiClient.get("/Specialist", {
      params: {
        pageIndex,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getDoctorDetail = async (id) => {
  try {
    const response = await apiClient.get(`/User/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getScheduleByDate = async (date) => {
  try {
    const response = await apiClient.get(`/Schedule/date/${date}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
};

export const createDoctorSchedule = async (employeeId, schedules) => {
  try {
    const schedule = await apiClient.post(`/Schedule`, {
      employeeId: employeeId,
      schedules: schedules,
    });
    return schedule;
  } catch (error) {
    throw new Error(error.message);
  }
};

// export const getDoctorSchedule = async (employeeId) => {
//   try {
//     const schedule = await apiClient.get(`/Schedule/Employee/${employeeId}`);
//     return schedule.data.data.weekSchedule;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
export const getDoctorSchedule = async (employeeId) => {
  try {
    const schedule = await apiClient.get(`/Schedule/Employee/${employeeId}`);
    if (!schedule.data.isSuccess && schedule.data.statusCode === 404) {
      // Return a specific message or handle it in another way if needed
      return { isSuccess: false, statusCode: 404, message: "Schedule not found." };
    }
    return schedule.data.data.weekSchedule;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const updateDoctorSchedule = async (employeeId, date, time) => {
  try {
    // const formattedDate = dayjs(date, "DD-MM-YYYY").format("DD-MM-YYYY");
    const schedule = await apiClient.put(`/Schedule/${employeeId}/${date}`, {
      employeeId: employeeId,
      date: date,
      time: time,
    });
    return schedule.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteDoctorSchedule = async (scheduleId, employeeId) => {
  try {
    const schedule = await apiClient.delete(`/Schedule/${scheduleId}/${employeeId}`);
    return schedule.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
