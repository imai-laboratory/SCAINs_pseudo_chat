# About
SCAINsオンライン体験会用の擬似チャットアプリです。

事前に用意したチャットデータに対して、ユーザがボタンを押していくことでチャットが進みます。

Aさんとあなたが事前対話に応じてチャットを進め、 最後は第3者のBさんが話に加わります。

以降あなたとBさんの自由チャットが可能です。

# 実行
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
PostgreSQLを使用している。

マイグレーション実行してテーブルを作成してください。

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
フロント側をGithubPagesでデプロイしている。
DBに存在するユーザのみログイン可能
<p><a href="https://www.ailab.ics.keio.ac.jp/SCAINs_pseudo_chat/" target="_blank">https://www.ailab.ics.keio.ac.jp/SCAINs_pseudo_chat/</a></p>

## initial
日本語ペルソナチャットデータセットからSCAINsの判定
```
cd initial
pipenv run text2js
```
上記のコマンドでtxtデータからjsファイルに変換可能。

## front
- チャットアプリのフロント部分
- 事前対話はJs形式のデータを```front/src/assets/data```の中に配置してください。

[こちら][]のリポジトリからForkできるのでご自由にお使いください

[こちら]: https://github.com/Kenshin0011/chat_ui_react

## main
- FastAPIを使用
- 各種APIが含まれている
