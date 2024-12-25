import apiClient from "./index";

export const createOrder = async (
  userId,
  amount,
  isMinus,
  title,
  description,
  isGenerateCode,
  code,
  vouchers,
  serviceId,
  products
) => {
  try {
    const order = await apiClient.post(`/CoinTransaction`, {
      userId: userId,
      amount: amount,
      isMinus: isMinus,
      title: title,
      description: description,
      isGenerateCode: isGenerateCode,
      code: code,
      vouchers: vouchers,
      serviceId: serviceId,
      products: products,
    });
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
