import axios from 'axios';

export const fetchUser = async (rootUrl, setUser, setLoading, setSessionExpired) => {
    const token = localStorage.getItem('token');
    if (!token || !rootUrl) return;

    setLoading(true);
    try {
        const response = await axios.get(`${rootUrl}/auth/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUser(response.data);
    } catch (error) {
        console.error('ユーザー情報取得エラー:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setSessionExpired(true);
    } finally {
        setLoading(false);
    }
};
