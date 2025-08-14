import { apiWithToken } from "../lib/axiosInstance";

export const getPaytrIframeToken = async (invoiceId: string, body: any) => {
  const api = await apiWithToken();
  const { data } = await api.post(`/payment?invoiceId=${invoiceId}`, body);
  return data;
};

export const paymentMock = async (body: {
  productId: string;
  restaurantNo: string;
}) => {
  const api = await apiWithToken();
  const { data } = await api.post(`/subscription/test-subscribe`, body);
  return data;
};
