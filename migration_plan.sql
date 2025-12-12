-- =============================================
-- マイグレーション: 期限・解決者機能追加
-- 実行日: 2025-12-12
-- =============================================

-- 1. 期限カラムの追加（まだ追加されていない場合）
ALTER TABLE "DIARY" ADD COLUMN IF NOT EXISTS deadline DATE;

-- 2. 解決者カラムの追加
ALTER TABLE "DIARY" ADD COLUMN IF NOT EXISTS solved_by INT REFERENCES "STAFF"(staff_id);

-- 3. 解決日時カラムの追加
ALTER TABLE "DIARY" ADD COLUMN IF NOT EXISTS solved_at TIMESTAMP WITH TIME ZONE;

-- 4. 編集者カラムの追加（既に追加されている場合はスキップ）
ALTER TABLE "DIARY" ADD COLUMN IF NOT EXISTS updated_by INT REFERENCES "STAFF"(staff_id);

-- =============================================
-- 確認用クエリ
-- =============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'DIARY';
