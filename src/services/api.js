import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (!storedRefreshToken) {
          handleLogoutForce();
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken }
        );

        if (response.status === 200 || response.status === 201) {
          const newAccessToken = response.data.token || response.data.accessToken || response.data.data?.token;
          const newRefreshToken = response.data.refreshToken || response.data.data?.refreshToken;

          localStorage.setItem("token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        handleLogoutForce();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleLogoutForce = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export default api;