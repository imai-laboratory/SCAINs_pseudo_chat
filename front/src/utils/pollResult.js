import { getImageTaskResult } from '../api/imageTask';

export const pollResult = async (rootUrl, taskId, handleResult, handleError) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await getImageTaskResult(rootUrl, taskId);
            if (result && result.data) {
                if (result.data.state === 'PENDING' || result.data.state === 'RETRY') {
                    setTimeout(async () => {
                        try {
                            const nextResult = await pollResult(rootUrl, taskId, handleResult, handleError);
                            resolve(nextResult);
                        } catch (error) {
                            reject(error);
                        }
                    }, 2000); // 2秒後に再度リクエスト
                } else if (result.data.result) {
                    if (handleResult) {
                        await handleResult(result.data.result);
                    }
                    resolve(result.data.result); // 成功時にPromiseを解決
                } else {
                    const errorMessage = '申し訳ありません。現在応答できません。';
                    if (handleError) {
                        await handleError(errorMessage);
                    }
                    reject(new Error(errorMessage)); // エラー時にPromiseを拒否
                }
            } else {
                throw new Error('Result or result.data is null or undefined');
            }
        } catch (error) {
            if (handleError) {
                await handleError('申し訳ありません。現在応答できません。');
            }
            reject(error); // エラー時にPromiseを拒否
        }
    });
};
