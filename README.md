# template-repo

1. レポジトリの作成
   - 1 顧客につき 1 レポジトリを作ります
   - レポジトリの作成は template-repo で"Use this template"ボタンから作成します
   - レポジトリ名は顧客名で作成します
   - レポジトリをローカルにクローンします  
     `git clone {レポジトリURL}`
   - 契約ごとにフォルダを作成します  
     `cd ./{レポジトリ名}`  
     `cp -r template/ {SE-案件管理のレコード番号}`
2. パッケージのインストール
   作業フォルダで必要なパッケージをインストールします  
   `cd ./{SE-案件管理のレコード番号} && code .`  
   `npm install`
3. カスタマイズ概要記載
   README.md の内容を記載します
4. コーディング
   各契約番号の src フォルダ配下でカスタマイズコードを記述します

   - デフォルトのファイル名は index.js です
   - ファイル名を変える場合はwebpack.config.js内のentryの名前も併せて変えてください  
     befor: ```entry: { index: "./src/js/index.js" },```  
     after: ```entry: { {変更後の名前}: "./src/js/{変更後の名前}.js" },```  
   - SC のコーディングルールは[こちら](https://sharedoc.atlassian.net/wiki/spaces/SC/pages/978845743/SC+Coding+Guidelines+and+Rules)を参考にしてください

5. ビルド  
   webpack と babel でビルドします  
   `npm run build:dev`  
   - 一度コマンドを実行するとファイル変更時に自動でビルドしてくれます  
   - 対象のブラウザは.browserslistrc で定義します

6. 適用＆動作確認
   dist ディレクトリ内に出力された JS ファイルをアプリに適用し動作確認をします
   - ローカルの web サーバーの利用でも可能です
