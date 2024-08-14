import createAxiosClient from './axiosClient';

export const generateImageTask = (rootUrl, payload) => {
    const axiosClient = createAxiosClient(rootUrl);
    return axiosClient.post('/api/generate-response/image-task', payload);
};

export const getImageTaskResult = (rootUrl, taskId) => {
    const axiosClient = createAxiosClient(rootUrl);
    return axiosClient.get(`/api/generate-response/image-task/result/${taskId}`);
};
