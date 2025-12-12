-- =============================================
-- 1. データベース設定と初期化
-- =============================================
-- 外部キー制約を有効化し、データ整合性を確保します。
SET session_replication_role = 'replica';
-- 既存のテーブルを削除する場合のコメントアウト（開発初期のみ）
-- DROP TABLE IF EXISTS "POINT_LOG", "ACTION_LOG", "USER_DIARY_STATUS", "DIARY_TAG", "DIARY", "TAG", "CATEGORY", "SYSTEM_ROLE", "JOB_TYPE", "STAFF" CASCADE;
SET session_replication_role = 'origin';

-- =============================================
-- 2. マスタデータ (Master Data)
-- =============================================

-- 職種マスタ (医師, 看護師, 事務など)
CREATE TABLE "JOB_TYPE" (
    job_type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_name TEXT NOT NULL UNIQUE
);

-- システム権限マスタ (管理者, 一般ユーザーなど)
CREATE TABLE "SYSTEM_ROLE" (
    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE
);

-- 分野マスタ (診察, 看護, 事務など)
CREATE TABLE "CATEGORY" (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE -- 無効化フラグ
);

-- 任意タグマスタ (備品, 教育, クレームなど)
CREATE TABLE "TAG" (
    tag_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_name TEXT NOT NULL UNIQUE,
    css_class TEXT NOT NULL, -- フロントでの色分け用クラス名 (例: 'tag-danger')
    is_active BOOLEAN NOT NULL DEFAULT TRUE -- 無効化フラグ
);

-- =============================================
-- 3. ユーザー管理 (STAFF)
-- =============================================

CREATE TABLE "STAFF" (
    staff_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- SupabaseのAuthテーブルと紐づけるため、UUIDを使う方がモダンですが、
    -- 今回はシンプルにINTで管理し、メール認証は別途設定するとします。
    -- PostgreSQLのAUTHスキーマを参照する場合は、そのIDを外部キーとして持つのが理想です。
    name TEXT NOT NULL,
    login_id TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- ログイン用ハッシュ
    email TEXT UNIQUE NOT NULL, -- パスワード再設定などに利用
    
    job_type_id INT NOT NULL REFERENCES "JOB_TYPE"(job_type_id),
    system_role_id INT NOT NULL REFERENCES "SYSTEM_ROLE"(role_id),
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    current_points INT NOT NULL DEFAULT 0, -- パフォーマンス用キャッシュ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. 日報データ (DIARY)
-- =============================================

CREATE TABLE "DIARY" (
    diary_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    -- リレーション
    parent_id BIGINT REFERENCES "DIARY"(diary_id), -- 返信用自己参照
    category_id INT NOT NULL REFERENCES "CATEGORY"(category_id),
    staff_id INT NOT NULL REFERENCES "STAFF"(staff_id), -- 作成者
    updated_by INT REFERENCES "STAFF"(staff_id), -- 最終編集者（編集履歴用）
    
    -- コンテンツ
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- 状態と制御
    target_date DATE NOT NULL, -- 何日の日報か
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE, -- 至急フラグ
    bounty_points INT, -- 特別報酬ポイント (NULLの場合はデフォルト適用)
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE, -- 表示OFF (アーカイブ)
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE, -- 論理削除 (ゴミ箱)
    current_status TEXT NOT NULL DEFAULT 'UNREAD', -- 現在の記事の状態 (UNREAD, WORKING, SOLVEDなど)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DIARYとTAGの中間テーブル (多対多)
CREATE TABLE "DIARY_TAG" (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    diary_id BIGINT NOT NULL REFERENCES "DIARY"(diary_id),
    tag_id INT NOT NULL REFERENCES "TAG"(tag_id),
    UNIQUE (diary_id, tag_id) -- 同じタグが二重に付かないようにする
);

-- =============================================
-- 5. ログとステータス管理 (Logs & Status)
-- =============================================

-- ユーザーごとの既読・作業状態
CREATE TABLE "USER_DIARY_STATUS" (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    diary_id BIGINT NOT NULL REFERENCES "DIARY"(diary_id),
    staff_id INT NOT NULL REFERENCES "STAFF"(staff_id),
    status TEXT NOT NULL, -- (UNREAD, CONFIRMED, WORKINGなど)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (diary_id, staff_id) -- 1つのメモにつき1ユーザー1レコードのみ
);

-- 行動ログ (ポイント付与トリガー)
CREATE TABLE "ACTION_LOG" (
    log_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    diary_id BIGINT REFERENCES "DIARY"(diary_id), -- どの記事へのアクションか
    staff_id INT NOT NULL REFERENCES "STAFF"(staff_id), -- 誰のアクションか
    action_type TEXT NOT NULL, -- (CONFIRM, SOLVED, REPLYなど)
    points_awarded INT NOT NULL, -- 付与されたポイント数 (プログラム側で決定)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ポイント履歴 (通帳)
CREATE TABLE "POINT_LOG" (
    point_log_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    staff_id INT NOT NULL REFERENCES "STAFF"(staff_id),
    amount INT NOT NULL, -- 増減値 (+10, -5など)
    reason TEXT NOT NULL, -- 理由 (ログインボーナス, 日報解決など)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- =============================================
-- 6. 初期データ投入の例 (AIが開発を進められるように)
-- =============================================

-- マスタデータ
INSERT INTO "JOB_TYPE" (job_name) VALUES ('医師'), ('看護師'), ('医療事務');
INSERT INTO "SYSTEM_ROLE" (role_name) VALUES ('管理者'), ('一般ユーザー');
INSERT INTO "CATEGORY" (category_name) VALUES ('診察'), ('看護'), ('事務');
INSERT INTO "TAG" (tag_name, css_class) VALUES ('備品関連', 'tag-blue'), ('教育', 'tag-green');

-- 初期STAFF（ログインテスト用）
INSERT INTO "STAFF" (name, login_id, password_hash, email, job_type_id, system_role_id) 
VALUES 
('鈴木 太郎', 'suzuki', 'hashed_pass_1', 'suzuki@clinic.com', 2, 1), -- 看護師/管理者
('田中 花子', 'tanaka', 'hashed_pass_2', 'tanaka@clinic.com', 3, 2); -- 事務/一般

-- テスト日報
INSERT INTO "DIARY" (category_id, staff_id, title, content, target_date, is_urgent)
VALUES 
(2, 1, '酸素ボンベの在庫確認', 'B棟2階の残量が少ないようです。田中さん確認お願いします。', CURRENT_DATE, TRUE),
(3, 2, '来週の会議資料準備', '院長会議の資料を金曜日までに作成してください。', CURRENT_DATE, FALSE);

-- テストアクション（既読ステータス）
INSERT INTO "USER_DIARY_STATUS" (diary_id, staff_id, status)
VALUES 
(1, 2, 'UNREAD'), -- 田中さんはまだ見てない
(2, 1, 'CONFIRMED'); -- 鈴木さんは確認済み

-- =============================================
-- 7. 後から追加された変更（マイグレーション用）
-- =============================================

-- DIARYテーブルに編集者カラムを追加（編集履歴機能用）
-- 実行日: 2025-12-12
-- 注意: 既存のテーブルに追加する場合は、このSQLを実行してください
-- ALTER TABLE "DIARY" ADD COLUMN IF NOT EXISTS updated_by INT REFERENCES "STAFF"(staff_id);
-- ※新規でテーブルを作成する場合は、セクション4のCREATE TABLE文に既に含まれています