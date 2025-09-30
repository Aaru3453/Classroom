import api from './api';

export const timetableService = {
  // Timetable generation
  generateTimetable: (data) => api.post('/timetable/generate', data),
  getTimetables: () => api.get('/timetable'),
  getTimetableById: (id) => api.get(`/timetable/${id}`),
  updateTimetable: (id, data) => api.put(`/timetable/${id}`, data),
  deleteTimetable: (id) => api.delete(`/timetable/${id}`),

  // Faculty constraints
  getFacultyConstraints: () => api.get('/faculty/constraints'),
  updateFacultyConstraints: (facultyId, constraints) => 
    api.put(`/faculty/${facultyId}/constraints`, constraints),
};

export const facultyService = {
  getAll: () => api.get('/faculty'),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const subjectService = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const classroomService = {
  getAll: () => api.get('/classrooms'),
  create: (data) => api.post('/classrooms', data),
  update: (id, data) => api.put(`/classrooms/${id}`, data),
  delete: (id) => api.delete(`/classrooms/${id}`),
};

export const batchService = {
  getAll: () => api.get('/batches'),
  create: (data) => api.post('/batches', data),
  update: (id, data) => api.put(`/batches/${id}`, data),
  delete: (id) => api.delete(`/batches/${id}`),
};