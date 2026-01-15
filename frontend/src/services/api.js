// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export const authAPI = {
//   login: (data) => api.post("/auth/login", data),
//   register: (data) => api.post("/auth/register", data),
//   me: () => api.get("/auth/me"),
//   logout: () => api.post("/auth/logout"),
// };

// export const subjectAPI = {
//   getAll: () => api.get("/subjects"),
//   create: (data) => api.post("/subjects", data),
//   update: (id, data) => api.put(`/subjects/${id}`, data),
//   delete: (id) => api.delete(`/subjects/${id}`),
// };

// export const facultyAPI = {
//   getAll: () => api.get("/faculty"),
//   getById: (id) => api.get(`/faculty/${id}`),
//   create: (data) => api.post("/faculty", data),
//   update: (id, data) => api.put(`/faculty/${id}`),
//   delete: (id) => api.delete(`/faculty/${id}`),
// };

// export const classroomAPI = {
//   getAll: () => api.get("/classrooms"),
//   getById: (id) => api.get(`/classrooms/${id}`),
//   create: (data) => api.post("/classrooms", data),
//   update: (id, data) => api.put(`/classrooms/${id}`),
//   delete: (id) => api.delete(`/classrooms/${id}`),
// };

// export const batchAPI = {
//   getAll: () => api.get("/batches"),
//   getById: (id) => api.get(`/batches/${id}`),
//   create: (data) => api.post("/batches", data),
//   update: (id, data) => api.put(`/batches/${id}`),
//   delete: (id) => api.delete(`/batches/${id}`),
// };

// export const timetableAPI = {
//   getAll: () => api.get("/timetables"),
//   getById: (id) => api.get(`/timetables/${id}`),
//   create: (data) => api.post("/timetables", data),
//   update: (id, data) => api.put(`/timetables/${id}`),
//   delete: (id) => api.delete(`/timetables/${id}`),
// };

// export default api;



// classroom/frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || {});
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const subjectAPI = {
  getAll: () => api.get("/subjects"),
  create: (data) => api.post("/subjects", data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const facultyAPI = {
  getAll: () => api.get("/faculty"),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post("/faculty", data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const classroomAPI = {
  getAll: () => api.get("/classrooms"),
  getById: (id) => api.get(`/classrooms/${id}`),
  create: (data) => api.post("/classrooms", data),
  update: (id, data) => api.put(`/classrooms/${id}`, data),
  delete: (id) => api.delete(`/classrooms/${id}`),
};

export const batchAPI = {
  getAll: () => api.get("/batches"),
  getById: (id) => api.get(`/batches/${id}`),
  create: (data) => api.post("/batches", data),
  update: (id, data) => api.put(`/batches/${id}`, data),
  delete: (id) => api.delete(`/batches/${id}`),
};

export const timetableAPI = {
  getAll: () => api.get("/timetables"),
  getById: (id) => api.get(`/timetables/${id}`),
  create: (data) => api.post("/timetables", data),
  update: (id, data) => api.put(`/timetables/${id}`, data),
  delete: (id) => api.delete(`/timetables/${id}`),
};

export default api;