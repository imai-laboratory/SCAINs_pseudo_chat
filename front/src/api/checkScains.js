import createAxiosClient from "./axiosClient";

export const checkScains = (rootUrl, conversation) => {
    const axiosClient = createAxiosClient(rootUrl);
    console.log('conversation:', conversation);
    return axiosClient.post('/api/generate-response/check-scains', conversation);
};
