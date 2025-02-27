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
  getCities: `${baseUrl}/public/cities`,
  getBrandReviews: (id: string | undefined) =>
    `${baseUrl}/public/getReviewsBrand?page=0&size=8&brandId=${id}`,
  getDistrict: (selectedCityId: number) =>
    `${baseUrl}/public/districts?cityId=${selectedCityId}`,
  getOrders: (page: number, pageSize: number) =>
    `${baseUrl}/consumer/getOrders?page=${page - 1}&size=${pageSize}`,
  cancelOrder: (id: number) =>
    `${baseUrl}/consumer/cancelOrder?requestId=${id}`,
  addReview: (id: number) => `${baseUrl}/consumer/addReview?requestId=${id}`,
};
