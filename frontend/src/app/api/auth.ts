import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    register: async (data: { email: string; password: string; first_name: string; last_name: string }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }) => {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const users = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: {
        first_name?: string;
        last_name?: string;
        bio?: string;
    }) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    updateProfilePicture: async (file: File) => {
        const formData = new FormData();
        formData.append('picture', file);
        const response = await api.post('/users/profile/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProfile: async () => {
        const response = await api.delete('/users/profile');
        localStorage.removeItem('token');
        return response.data;
    },
};

export const documents = {
    upload: async (file: File, description: string, isPublic: boolean) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('is_public', isPublic.toString());
        const response = await api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    get: async () => {
        const response = await api.get('/documents');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    update: async (id: number, data: { description?: string; is_public?: boolean }) => {
        const response = await api.put(`/documents/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/documents/${id}`);
    },

    download: async (id: number) => {
        const response = await api.get(`/documents/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default api; 