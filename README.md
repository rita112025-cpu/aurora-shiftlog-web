# ⚡ Aurora ShiftLog Pro

> SCADA / 系統整合工程師的工時與任務紀錄儀表板

![Version](https://img.shields.io/badge/version-1.0.0-00d4ff)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

## 📋 簡介

Aurora ShiftLog Pro 是專為 SCADA / 系統整合 (SI) 工程師打造的現代化工時紀錄與任務管理儀表板。採用深色工業風 UI 設計，搭配螢光藍點綴，提供直覺化的工時追蹤、專案管理與數據分析功能。

## ✨ 功能特色

### 🎯 核心功能
- **工時紀錄管理** - 新增 / 編輯 / 刪除工時紀錄
- **專案列表** - 支援 TWN-GTS-XDL-SI 格式專案代號
- **系統別分類** - SCADA / REVIT / AI / PLC / HMI / OTHER
- **狀態追蹤** - 待處理 / 進行中 / 已完成 / 審核中

### 📊 儀表板
- **本週工時長條圖** - Recharts 視覺化呈現
- **專案工時佔比圓餅圖** - 直覺了解時間分配
- **統計卡片** - 今日 / 本週 / 日均 / 總工時

### 📅 甘特圖視圖
- Timeline 呈現任務分佈
- 按專案分組，色彩區分系統別
- 今日標記與週末提示

### 🍅 番茄鐘整合
- 25 分鐘專注 / 5 分鐘休息
- 每 4 輪自動長休息 15 分鐘
- 圓形進度條動畫

### 💾 資料管理
- **localStorage 持久化** - 資料不遺失
- **CSV 匯出** - 相容 Excel
- **JSON 匯出** - 完整資料備份
- **關鍵字搜尋** - 快速篩選紀錄
- **專案篩選** - 聚焦特定專案

### 📱 RWD 響應式設計
- 桌面版：側邊欄 + 主內容區
- 平板版：可收合側邊欄
- 手機版：卡片式列表

## 🛠 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| Vite | 6.x | 建構工具 |
| TypeScript | 5.x | 型別安全 |
| Tailwind CSS | 4.x | 樣式系統 |
| Recharts | 2.x | 圖表繪製 |
| Lucide React | 0.294 | 圖示庫 |
| date-fns | 2.x | 日期處理 |
| uuid | 9.x | 唯一 ID 產生 |

## 🚀 快速開始

### 環境需求
- Node.js >= 18
- npm >= 9

### 安裝與執行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構生產版本
npm run build

# 型別檢查
npm run typecheck
```

### 部署到 GitHub Pages

1. 建構專案：
```bash
npm run build
```

2. 將 `dist/` 目錄部署至 GitHub Pages 或任何靜態託管服務。

3. 若使用 GitHub Pages，可在 `vite.config.js` 加入 base path：
```js
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

## 📁 專案結構

```
src/
├── App.tsx              # 主應用元件
├── main.tsx             # 入口點
├── index.css            # 全域樣式 + Tailwind
├── types/
│   └── index.ts         # TypeScript 型別定義
├── hooks/
│   └── useLocalStorage.ts  # localStorage Hook
├── utils/
│   └── helpers.ts       # 工具函式
└── components/
    ├── Sidebar.tsx       # 左側專案列表
    ├── Dashboard.tsx     # 儀表板（圖表）
    ├── RecordForm.tsx    # 新增/編輯表單
    ├── RecordTable.tsx   # 紀錄列表表格
    ├── GanttView.tsx     # 甘特圖時間軸
    └── PomodoroTimer.tsx # 番茄鐘小掛件
```

## 🎨 設計系統

### 色彩配置
| 名稱 | 色碼 | 用途 |
|------|------|------|
| Aurora BG | `#0f1117` | 主背景 |
| Aurora Surface | `#1a1d27` | 卡片/面板 |
| Aurora Card | `#222639` | 次級卡片 |
| Aurora Border | `#2d3348` | 邊框 |
| Aurora Accent | `#00d4ff` | 主強調色 |
| Aurora Success | `#2ed573` | 成功狀態 |
| Aurora Warning | `#ffa502` | 警告狀態 |
| Aurora Danger | `#ff4757` | 危險狀態 |

### 設計特色
- 深色工業風 UI
- 螢光藍點綴效果
- 網格背景紋理
- 發光邊框效果
- 脈衝動畫指示器

## 📝 資料格式

### WorkRecord
```typescript
interface WorkRecord {
  id: string;           // UUID
  date: string;         // YYYY-MM-DD
  projectCode: string;  // 專案代號
  systemType: string;   // SCADA | REVIT | AI | PLC | HMI | OTHER
  hours: number;        // 工時（小時）
  notes: string;        // 備註
  status: string;       // pending | in-progress | completed | review
  createdAt: string;    // ISO timestamp
}
```

## 🔧 自訂設定

### 新增預設專案
編輯 `src/utils/helpers.ts` 中的 `DEFAULT_PROJECTS` 陣列。

### 調整番茄鐘時間
修改 `src/components/PomodoroTimer.tsx` 中的常數：
```typescript
const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
```

## 📄 License

MIT License - 自由使用、修改與分發。

---

<p align="center">
  Made with ⚡ for SCADA Engineers
</p>
