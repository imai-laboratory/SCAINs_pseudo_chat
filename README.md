# SCAINsデモ発表用
Main.jsxがメインの画面です。

大体SCAINsオンライン体験会用と似ていますが、以下の点が変更になりました。

- 事前対話を用意せずに、ユーザが自由にチャットを進めることができるようになりました。
  - 対話の内容は画像に対する議論です。
  - マルチモーダルAPIを実装しました。
- ユーザの発話に対して毎回SCAINs判定を行います。
  - logにSCAINs判定結果が出力されます。
- コア発言に対してSCAINsが確認できます。
- Aさんとチャット後、Bさんに話を振るのはAさんになりました。
  - SCAINsが発生した時に話を振ります。
- 結果の比較を行うことはなくなりました。
- DBは基本的にログインセッションの用途のみで使っています。
- デプロイの必要がなくなり、基本的にローカルで動かしています。
- 多言語対応しました。Headerから切り替えられます。

<p align="center">
  <img src="https://github.com/user-attachments/assets/0964a97b-cf6c-40b9-881d-9f294f7d610d" width=80%>
</p>

# SCAINsオンライン体験会用(2024/7/16実施)
Home.jsxがメインの画面でした。
## About

SCAINsオンライン体験会用の擬似チャットアプリです。

事前に用意したチャットデータに対して、ユーザがボタンを押していくことでチャットが進みます。

Aさんとあなたが事前対話に応じてチャットを進め、 最後は第3者のBさんが話に加わります。

以降あなたとBさんの自由チャットが可能です。

## 実行
### 1. .envの編集
```
cp .env.example .env
```
作成されたenvファイルにOPENAI_API_KEYを入力

### 2. dockerコンテナの作成

```
make init
```
※失敗したら、だいたい他のプロジェクトのコンテナが落ちきってないだけの可能性が高い

### 3. DB接続

```
make migrate
```
PostgreSQLを使用している。\
マイグレーション実行してテーブルを作成してください。\
DBへの接続はenvファイルを参照してください。

### 4. ローカルで動かす
以下のURL叩いてください。
<p><a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a></p>

# 以下参考

## デプロイ
```
cd front
npm run build
npm run deploy
```
フロント側はGithubPagesでデプロイしている。
DBに存在するユーザのみログイン可能
<p><a href="https://www.ailab.ics.keio.ac.jp/SCAINs_pseudo_chat/" target="_blank">https://www.ailab.ics.keio.ac.jp/SCAINs_pseudo_chat/</a></p>

（ちなみにRender.comでDB, Redis, バックエンドはデプロイした）
## initial
日本語ペルソナチャットデータセットからSCAINsの判定
```
cd initial
pipenv run text2js
```
上記のコマンドでtxtデータからjsファイルに変換可能。\
その後`role`を付与して発言の種類を指定。\
Scains、コア発言、（普通の文、エラー文）など。\
`scains`,`core`の位置を事前設定。


## front
- チャットアプリのフロント部分
- 事前対話はJs形式のデータを```front/src/assets/data```の中に配置してください。

[こちら][]のリポジトリからForkできるのでご自由にお使いください

[こちら]: https://github.com/Kenshin0011/chat_ui_react

## main
- FastAPIを使用
- 各種APIが含まれている

## Celery & Redis
- 同時接続対応のため、ボトルネックになっているOpenAIの処理をタスク化して並列処理している
### flowerによってタスクを監視する方法
```
pip install flower # 必要なら
celery -A tasks flower
```
上記のコマンド実行後以下のリンクで監視。
<p><a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a></p>

## ログイン
Seederを用意していないので自分でAPIを叩いてユーザを作成してください。

## 対話履歴のcsv出力
./csv/history_to_csv.pyを実行することで、DBに保存された対話履歴をcsv形式で出力できます。
