import { getRequest, postRequest } from "./api";

export const getUserProfile = async (userId) => {
  return await getRequest(`users/${userId}`);
};

export const updateUserProfile = async (userId, data) => {
  return await postRequest(`users/${userId}/update`, data);
};
