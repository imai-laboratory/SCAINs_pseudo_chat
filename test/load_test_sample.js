import http from 'k6/http';
import { check, sleep } from 'k6';


const BASE_URL = 'http://localhost:8000';

export let options = {
scenarios: {
        generate_response: {
            executor: 'constant-arrival-rate',
            rate: 600, // 1分間に600リクエスト（1秒に10回）
            timeUnit: '1m', // 1分間で設定
            duration: '2m', // 2分間のテスト
            preAllocatedVUs: 20,
            maxVUs: 50,
            exec: 'generateResponse',
        },
        list_conversations: {
            executor: 'constant-arrival-rate',
            rate: 30, // 1分間に30リクエスト（2秒に1回）
            timeUnit: '1m',
            duration: '2m', // 2分間のテスト
            preAllocatedVUs: 10,
            maxVUs: 20,
            exec: 'listConversations',
        },
    },
};

const headers = {
    'Content-Type': 'application/json',
};


const generateResponsePayload = JSON.stringify({
    conversation: [
        { index: 1, content: "こんにちは。お話して大丈夫ですか？", person: 'A', role: 'normal' },
        { index: 2, content: "はい、大丈夫です。今、飼っている熱帯魚の世話をしていたところです。", person: 'user', role: 'normal' },
        { index: 3, content: "熱帯魚ですか。きれいなことでしょうね。", person: 'A', role: 'normal' },
        { index: 4, content: "はい、私はエステティシャンをしていて、普段忙しいのでとても癒されます。", person: 'user', role: 'normal' },
        { index: 12, content: "それは近いですね！奇遇です。ねぇBさん。そういえばBさんはどうでしたっけ？", person: 'user', role: 'core' },
        { index: 13, content: "私もエステティシャンなんですよ。お互いにリラックスできることが大事ですね。", person: 'B', role: 'normal' },
        { index: 14, content: "テスト", person: 'user', role: 'normal' },
        { index: 15, content: "テスト", person: 'B', role: 'normal' },
        { index: 16, content: "テスト", person: 'user', role: 'normal' },
    ],
    agent: "B"
});

export function generateResponse() {
    let res = http.post(`${BASE_URL}/api/generate-response`, generateResponsePayload, { headers });
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1); // 1秒間スリープ
}

export function listConversations() {
    let res = http.get(`${BASE_URL}/conversation/list`, { headers });
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(30); // 30秒間スリープ
}