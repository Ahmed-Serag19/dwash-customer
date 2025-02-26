const baseUrl = "http://149.102.134.28:8080/api";
export const apiEndpoints = {
  LoginInitiate: `${baseUrl}/auth/login/initiate`,
  LoginFinalize: `${baseUrl}/auth/login/finalize`,
  RegisterInitiate: `${baseUrl}/auth/signUp/initiate`,
  RegisterFinalize: `${baseUrl}/auth/signUp/finalize`,
  getFreelancers: (size: number) =>
    `${baseUrl}/public/getFreelancers?page=0&size=${size}&type=1`,
  getServices: `${baseUrl}/public/getServices`,
  getProfile: `${baseUrl}/consumer/getProfile`,
  editProfile: `${baseUrl}/consumer/editProfile`,
  getCart: `${baseUrl}/consumer/getCartItems`,
  addToCart: `${baseUrl}/consumer/addToCart`,
  deleteFromCart: `${baseUrl}/consumer/deleteItem`,
  getSlots: `${baseUrl}/consumer/getSlot`,
  validateDiscount: `${baseUrl}/consumer/validateDiscount`,
  makePayment: `${baseUrl}/payment/consumer/card/makePayment`,
  getOrders: `${baseUrl}/consumer/getOrders?page=0&size=16`,
  cancelOrder: (id: number) =>
    `${baseUrl}/consumer/cancelOrder?requestId=${id}`,
};
