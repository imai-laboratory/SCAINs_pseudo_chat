import createAxiosClient from "./axiosClient";


const getSessionId = () => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('sessionId');
});

export const checkScains = (rootUrl, conversation) => {
    const axiosClient = createAxiosClient(rootUrl);
    const sessionId = getSessionId();
    const conversationWithSession = {
        "conversation": conversation,
        "sessionId": sessionId
    };
    return axiosClient.post('/api/generate-response/check-scains', conversationWithSession);
};
