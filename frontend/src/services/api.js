const API_BASE_URL = 'http://localhost:5000';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await wait(1000 * Math.pow(2, i));
    }
  }
};

const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Server error occurred');
    }
    return data;
  } catch (error) {
    if (!response.ok) {
      throw new Error(response.statusText || 'Server error occurred');
    }
    throw error;
  }
};

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  login: async (credentials) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  register: async (formData) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  updateProfile: async (data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  uploadAvatar: async (formData) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users/upload-avatar`, {
      method: 'POST',
      headers: authHeader(),
      body: formData
    });
    return handleResponse(response);
  },

  changePassword: async (data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  getFlights: async (params) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/flights?${new URLSearchParams(params)}`);
    return handleResponse(response);
  },

  getAirports: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/flights/airports`);
    return handleResponse(response);
  },

  getBookings: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/bookings`, {
      headers: authHeader()
    });
    return handleResponse(response);
  },

  cancelBooking: async (bookingId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    return handleResponse(response);
  },

  payBooking: async (bookingId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/bookings/${bookingId}/pay`, {
      method: 'PATCH',
      headers: authHeader()
    });
    return handleResponse(response);
  }
};
