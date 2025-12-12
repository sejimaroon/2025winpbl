import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // クリニック向け清潔感のあるカラーパレット
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // カテゴリ色
        category: {
          medical: "#4F46E5", // 診察 - インディゴ
          nursing: "#10B981", // 看護 - エメラルド
          office: "#F59E0B",  // 事務 - アンバー
        },
        // ステータス色
        status: {
          unread: "#6B7280",     // 未読 - グレー
          confirmed: "#10B981", // 確認済み - グリーン
          working: "#3B82F6",   // 作業中 - ブルー
          solved: "#8B5CF6",    // 解決 - パープル
        },
      },
      fontFamily: {
        sans: ["Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

