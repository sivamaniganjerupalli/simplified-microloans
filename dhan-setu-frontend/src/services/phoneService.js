import { postRequest } from "./api";

export const sendOTP = async (phoneNumber) => {
  return await postRequest("phone/send-otp", { phoneNumber });
};

export const verifyOTP = async (phoneNumber, otp) => {
  return await postRequest("phone/verify-otp", { phoneNumber, otp });
};
