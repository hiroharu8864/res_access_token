# JWT認証サービス (res_access_token)

## ⚠️ 重要: デモ・学習目的専用アプリケーション

**このアプリケーションはJWT認証の仕組みを学習・デモンストレーションする目的で作成されています。本番環境での使用は想定されていません。**

## 🛡️ セキュリティ警告

- **デモ用途のみ**: このコードは教育・学習目的で作成されています
- **本番利用禁止**: セキュリティ要件を満たしていないため、本番環境では使用しないでください
- **認証の簡易実装**: 実際のユーザー認証システムではありません
- **環境変数必須**: すべての機密情報は環境変数で管理してください

JWT形式のアクセストークンを疑似的に発行・検証するWebアプリケーションです。React + TypeScript (フロントエンド) と Node.js + Express (バックエンド) で構築されており、Vercelでのデプロイに対応しています。

## 🚀 機能

### フロントエンド
- **ホームページ**: サービス概要とナビゲーション
- **アクセストークン生成**: JWTトークンの生成とリアルタイム表示
- **トークン検証**: 発行されたJWTトークンの有効性検証
- **404ページ**: 存在しないページへのアクセス時の案内

### バックエンド (API)
- `POST /access_token`: JWTアクセストークンの生成
- `GET /verify_token`: JWTトークンの検証

### 特徴
- **JWT詳細表示**: ヘッダー、ペイロード、署名を分離して表示
- **ダークテーマ**: モダンなダークUIデザイン
- **レスポンシブ対応**: モバイル・デスクトップ両対応
- **CORS対応**: クロスオリジンリクエスト対応
- **Vercel対応**: Vercel Functionsを使用したサーバーレス実装

## 🛠️ 技術スタック

### フロントエンド
- React 19.1.0
- TypeScript 5.8.3
- React Router DOM 7.7.1
- Vite 7.0.4

### バックエンド
- Node.js
- Express 5.1.0
- jsonwebtoken 9.0.2
- cors 2.8.5

### 開発ツール
- ESLint
- tsx (TypeScript実行)

## 📦 セットアップ

### 前提条件
- Node.js (推奨: v18以上)
- npm または yarn

### インストール
```bash
# リポジトリをクローン
git clone <repository-url>
cd res_access_token

# 依存関係をインストール
npm install
# または
yarn install
```

### 環境変数設定 (必須)

**⚠️ 重要: 環境変数の設定は必須です**

```bash
# .env ファイルを .env.example からコピーして作成
cp .env.example .env

# .env ファイルを編集して以下の値を設定
JWT_SECRET=your-very-secure-secret-key-here
DEMO_USERNAME=your_demo_username
DEMO_PASSWORD=your_demo_password
VITE_DEMO_USERNAME=your_demo_username
VITE_DEMO_PASSWORD=your_demo_password
PORT=3001
```

**注意事項:**
- `JWT_SECRET`: 強固でランダムな文字列を設定してください
- `DEMO_USERNAME/DEMO_PASSWORD`: デモ用の認証情報を設定してください
- `VITE_*`: フロントエンド用の環境変数です（Viteアプリで使用）

### 開発環境での実行

#### 1. バックエンドサーバーを起動
```bash
npm run server:dev
# または
yarn server:dev
```
サーバーは http://localhost:3001 で起動します。

#### 2. フロントエンド開発サーバーを起動 (別ターミナル)
```bash
npm run dev
# または
yarn dev
```
フロントエンドは http://localhost:5173 で起動します。

### プロダクションビルド
```bash
npm run build
# または
yarn build
```

## 🌐 Vercelデプロイ

このプロジェクトはVercelでのデプロイに最適化されています。

### 自動デプロイ
1. GitHubリポジトリにプッシュ
2. Vercelプロジェクトを作成
3. 自動的にビルド・デプロイされます

### 手動デプロイ
```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel
```

### 環境変数設定 (Vercel)
Vercelダッシュボードで以下の環境変数を設定してください：

**必須環境変数:**
- `JWT_SECRET`: JWTトークンの署名用秘密鍵
- `DEMO_USERNAME`: デモ用ユーザー名
- `DEMO_PASSWORD`: デモ用パスワード
- `VITE_DEMO_USERNAME`: フロントエンド用ユーザー名
- `VITE_DEMO_PASSWORD`: フロントエンド用パスワード

**⚠️ セキュリティ注意事項:**
- すべての値に強固でランダムな文字列を使用してください
- デフォルト値や推測しやすい値は避けてください

## 📖 API仕様

### POST /api/access_token
アクセストークンを生成します。

**リクエスト:**
```json
{
  "username": "設定した DEMO_USERNAME の値",
  "password": "設定した DEMO_PASSWORD の値"
}
```

**レスポンス (成功):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

### GET /api/verify_token
JWTトークンを検証します。

**リクエストヘッダー:**
```
Authorization: Bearer <access_token>
```

**レスポンス (成功):**
```json
{
  "valid": true,
  "payload": {
    "userId": "12345",
    "username": "設定したユーザー名",
    "email": "設定したユーザー名@example.com",
    "jti": "unique-jwt-id",
    "nonce": "random-nonce",
    "iat": 1234567890,
    "exp": 1234571490,
    "iss": "auth-service",
    "aud": "client-app"
  }
}
```

**レスポンス (失敗):**
```json
{
  "valid": false,
  "error": "Invalid token"
}
```

## 🔧 開発用スクリプト

```bash
# 開発サーバー起動 (フロントエンド)
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run preview

# ESLint実行
npm run lint

# バックエンドサーバー起動
npm run server

# バックエンド開発サーバー起動 (ファイル監視)
npm run server:dev

# Vercelビルド
npm run vercel-build
```

## 📁 プロジェクト構造

```
res_access_token/
├── api/                    # Vercel Functions
│   ├── access_token.js     # トークン生成API
│   └── verify_token.js     # トークン検証API
├── public/                 # 静的ファイル
├── src/                    # フロントエンドソース
│   ├── components/         # Reactコンポーネント
│   │   ├── AccessToken.tsx # トークン生成ページ
│   │   ├── VerifyToken.tsx # トークン検証ページ
│   │   └── NotFound.tsx    # 404ページ
│   ├── App.tsx             # メインアプリケーション
│   ├── main.tsx            # エントリーポイント
│   └── App.css             # スタイル
├── server.ts               # 開発用Expressサーバー
├── vercel.json             # Vercel設定
├── package.json            # 依存関係とスクリプト
└── README.md               # このファイル
```

## 🔒 セキュリティ注意事項

⚠️ **この実装はデモ・学習目的です。本番環境では絶対に使用しないでください。**

### 現在の制限事項
- **固定認証**: 環境変数で設定された固定の認証情報のみ対応
- **簡易JWT実装**: 最小限のJWT機能のみ実装
- **セキュリティ不備**: 本番レベルのセキュリティ対策は未実装

### 本番環境で必要な追加対策
- **データベース連携**: 実際のユーザー管理システム
- **パスワードハッシュ化**: bcryptなどによる暗号化
- **レート制限**: API呼び出し制限
- **HTTPS強制**: SSL/TLS通信の強制
- **適切なCORS**: 必要最小限のオリジン許可
- **トークン管理**: リフレッシュトークン、無効化機能
- **監査ログ**: アクセスログとセキュリティ監視
- **セキュリティヘッダー**: CSP、HSTS等の実装
- **入力検証**: SQLインジェクション、XSS対策
- **環境分離**: 開発・ステージング・本番環境の分離

### 推奨使用場面
- JWT認証の学習
- プロトタイプ開発
- 技術デモンストレーション
- 教育目的

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

Issue、Pull Requestを歓迎します。

## 📞 サポート

質問や問題がある場合は、GitHubのIssueページでお知らせください。
