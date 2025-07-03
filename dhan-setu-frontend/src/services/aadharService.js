import { postRequest } from "./api";

export const validateAadhar = async (aadharNumber) => {
  return await postRequest("aadhar/validate", { aadharNumber });
};
