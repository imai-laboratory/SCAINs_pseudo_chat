import createAxiosClient from "./axiosClient";


const getSessionId = () => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS
        const randomId = Math.random().toString(36).substr(2, 9);
        sessionId = `${formattedDate}-${formattedTime}-${randomId}`;
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('sessionId');
});

export const checkScains = (rootUrl, conversation, language) => {
    const axiosClient = createAxiosClient(rootUrl);
    const sessionId = getSessionId();
    const conversationWithSession = {
        "conversation": conversation,
        "sessionId": sessionId,
        "language": language,
    };
    return axiosClient.post('/api/generate-response/check-scains', conversationWithSession);
};
