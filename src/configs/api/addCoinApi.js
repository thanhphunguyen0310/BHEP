import apiClient from "./index";

export const addCoin = async ( userId, amount) => {
  try {
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 10);
    const items = [
      {
        name: "Nạp xu",
        quantity: 1,
        price: amount,
      },
    ];
    const addCoin = await apiClient.post(`/Payment/PayOS`, {
      userId: userId,
      amount: amount,
      description: `${userId} nạp xu`,
      items: items,
      returnURL: "https://bhep.vn/success-payment",
      cancelURL: "https://bhep.vn/fail-payment",
      expireAt: expireAt.toISOString(),
    });
    return addCoin.data;
  } catch (error) {
    throw new Error(error.message); 
  }
};

export const updateStatusPayment = async ( id, status) => {
  try {
    const res = await apiClient.put(`/Payment/${id}`, {
      id: id,
      status: status
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message); 
  }
};
