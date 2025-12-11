erDiagram
    %% ユーザー管理
    STAFF {
        int staff_id PK
        string name
        int job_type_id FK
        int system_role_id FK
        string login_id
        string password_hash
        string email
        boolean is_active
        int current_points "キャッシュ用"
        datetime created_at
        datetime updated_at
    }

    JOB_TYPE {
        int job_type_id PK
        string job_name
    }

    SYSTEM_ROLE {
        int role_id PK
        string role_name
    }

    %% 日報データ
    DIARY {
        bigint diary_id PK
        int parent_id FK
        int category_id FK
        string title
        string content
        date target_date
        
        boolean is_urgent
        int bounty_points "特別報酬ポイント"
        
        boolean is_hidden
        boolean is_deleted
        int staff_id FK
        string current_status
        datetime created_at
        datetime updated_at
    }

    %% ユーザーの既読・作業状態
    USER_DIARY_STATUS {
        bigint id PK
        int staff_id FK
        bigint diary_id FK
        string status
        datetime updated_at
    }

    %% 行動ログ
    ACTION_LOG {
        bigint log_id PK
        int staff_id FK
        bigint diary_id FK
        string action_type
        int points_awarded
        datetime created_at
    }

    %% ポイント履歴
    POINT_LOG {
        bigint point_log_id PK
        int staff_id FK
        int amount
        string reason
        datetime created_at
    }

    %% マスタ・タグ
    CATEGORY {
        int category_id PK
        string category_name
        boolean is_active
    }

    TAG {
        int tag_id PK
        string tag_name
        string css_class
        boolean is_active
    }

    DIARY_TAG {
        bigint id PK
        bigint diary_id FK
        int tag_id FK
    }

    %% リレーション
    JOB_TYPE ||--o{ STAFF : belongs_to
    SYSTEM_ROLE ||--o{ STAFF : has
    STAFF ||--o{ DIARY : creates
    CATEGORY ||--o{ DIARY : category
    DIARY |o--o{ DIARY : reply
    DIARY ||--o{ DIARY_TAG : has
    TAG ||--o{ DIARY_TAG : used
    STAFF ||--o{ USER_DIARY_STATUS : status
    DIARY ||--o{ USER_DIARY_STATUS : tracked
    STAFF ||--o{ ACTION_LOG : performs
    DIARY ||--o{ ACTION_LOG : receives
    STAFF ||--o{ POINT_LOG : earns