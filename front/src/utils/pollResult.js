import { getImageTaskResult } from '../api/imageTask';

export const pollResult = async (rootUrl, taskId, handleResult, handleError) => {
    try {

        const result = await getImageTaskResult(rootUrl, taskId);
        if (result && result.data) {
            if (result.data.state === 'PENDING' || result.data.state === 'RETRY') {
                setTimeout(() => pollResult(rootUrl, taskId, handleResult, handleError), 2000); // 2秒後に再度リクエスト
            } else if (result.data.result) {
                if (handleResult) {
                    await handleResult(result.data.result);
                }
            } else {
                if (handleError) {
                    await handleError('申し訳ありません。現在応答できません。');
                }
            }
        } else {
            throw new Error('Result or result.data is null or undefined');
        }
    } catch (error) {
        if (handleError) {
            await handleError('申し訳ありません。現在応答できません。');
        }
    }
};
