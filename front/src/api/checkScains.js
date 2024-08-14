import createAxiosClient from "./axiosClient";

export const checkScains = (rootUrl) => {
    const axiosClient = createAxiosClient(rootUrl);
    return axiosClient.post('/api/generate-response/check-scains');
};
