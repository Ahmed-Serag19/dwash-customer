const baseUrl = "http://149.102.134.28:8080/api";
export const apiEndpoints = {
  LoginInitiate: `${baseUrl}/auth/login/initiate`,
  LoginFinalize: `${baseUrl}/auth/login/finalize`,
  RegisterInitiate: `${baseUrl}/auth/signUp/initiate`,
  RegisterFinalize: `${baseUrl}/auth/signUp/finalize`,
};
