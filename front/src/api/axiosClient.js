import axios from 'axios';

const createAxiosClient = (rootUrl) => {
    const axiosClient = axios.create({
        baseURL: rootUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    axiosClient.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    axiosClient.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    });

    return axiosClient;
};

export default createAxiosClient;
