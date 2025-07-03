const BASE_URL = "http://localhost:5000/api"; // Update with your actual backend base URL

// Generic GET request
export const getRequest = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
};

// Generic POST request
export const postRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
};
