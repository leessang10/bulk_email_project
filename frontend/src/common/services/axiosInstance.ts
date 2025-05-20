import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:11001/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    const message =
      error.response?.data?.message || "서버 오류가 발생했습니다.";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
