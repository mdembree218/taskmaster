import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const authApi = axios.create({
  baseURL: `${apiUrl}/userservice/api/auth`,
});

const taskApi = axios.create({
  baseURL: `${apiUrl}/taskservice/api`,
});

const notifApi = axios.create({
  baseURL: `${apiUrl}/notificationservice/api`,
});

export const login = async (user) => {
  const response = await authApi.post('/login', user);
  localStorage.setItem('token', response.data.jwt);
  return response;
}
export const logout = async () => {
  const response = await authApi.post('/logout');
  return response;
}
export const registerUser = (user) => authApi.post('/register', user);
export const getUser = async (username) => {
  const response = await authApi.get(`/${username}`);
  return response;
}
export const getUsers = async () => { const response = await authApi.get(); return response; };
export const updateUser = (username, user) => authApi.put(`/${username}`, user);
export const deleteUser = (username) => authApi.delete(`/${username}`);

export const createCategory = (category) => taskApi.post('/categories', category);
export const getCategory = (id) => taskApi.get(`/categories/${id}`);
export const getCategories = () => taskApi.get('/categories');
export const updateCategory = (id, category) => taskApi.put(`/categories/${id}`, category);
export const deleteCategory = (id) => taskApi.delete(`/categories/${id}`);
export const getCategoryProgress = (id) => taskApi.get(`/categories/${id}/progress`);
export const getCategoryTasks = (id) => taskApi.get(`/categories/${id}/tasks`);

export const createTask = (task) => taskApi.post('/tasks', task);
export const getTask = (taskId) => taskApi.get(`/tasks/${taskId}`);
export const getTasks = () => taskApi.get('/tasks');
export const updateTask = (taskId, task) => taskApi.put(`/tasks/${taskId}`, task);
export const deleteTask = (taskId) => taskApi.delete(`/tasks/${taskId}`);
export const setTaskReminder = async (taskId, reminder) => {
  const response = await taskApi.post(`/tasks/${taskId}/reminders`, reminder);
  return response;
};
export const getTaskReminders = async (taskId) => {
  const response = await taskApi.get(`/tasks/${taskId}/reminders`);
  return response;
};
export const deleteTaskReminder = (taskId, reminderId) => taskApi.delete(`/tasks/${taskId}/reminders/${reminderId}`);
export const addTaskComment = async (taskId, comment) => {
  const response = await taskApi.post(`/tasks/${taskId}/comments`, comment);
  return response;
};
export const getTaskComments = (taskId) => taskApi.get(`/tasks/${taskId}/comments`);
export const getUserTaskSummary = (userId) => taskApi.get(`/tasks/${userId}/summary`);

export const shareTask = async (shareTaskDTO) => {
  const response = await notifApi.post(`/notification/share`, shareTaskDTO);
  return response;
};