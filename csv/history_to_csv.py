import csv
import os

import requests
from datetime import datetime
from typing import List, Dict, Any


# FastAPIのエンドポイントからデータを取得する関数
def fetch_chat_message_history(url: str) -> List[Dict[str, Any]]:
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


# データを取得
root = "https://scains-pseudo-chat.onrender.com"
url = f"{root}/chat-message-history/list"
data = fetch_chat_message_history(url)

# datetime形式に変換
for item in data:
    item['created_at'] = datetime.fromisoformat(item['created_at'])

# ソート
data_sorted = sorted(data, key=lambda x: x['created_at'])

csv_directory = "data/"
os.makedirs(csv_directory, exist_ok=True)  # ディレクトリが存在しない場合は作成
current_datetime = datetime.now().strftime("%Y%m%d_%H%M%S")
csv_file_path = os.path.join(csv_directory, f'chat_history_{current_datetime}.csv')


# CSV書き込み
with open(csv_file_path, 'w', newline='', encoding='utf-8-sig') as csvfile:
    fieldnames = ['conversation_id', 'user_id', 'message_1', 'message_2']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    for i in range(0, len(data_sorted), 2):
        message_1 = "\n".join([f"{item['person']}: {item['content']}" for item in data_sorted[i]['content']])
        message_2 = "\n".join(
            [f"{item['person']}: {item['content']}" for item in data_sorted[i + 1]['content']]) if i + 1 < len(
            data_sorted) else ""

        row = {
            'conversation_id': data_sorted[i]['conversation_id'],
            'user_id': data_sorted[i]['user_id'],
            'message_1': message_1,
            'message_2': message_2
        }
        writer.writerow(row)

print("CSVファイルが生成されました。")
