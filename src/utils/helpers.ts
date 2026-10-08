import { WorkRecord, Project } from '../types';

export const SYSTEM_TYPES = ['SCADA', 'REVIT', 'AI', 'PLC', 'HMI', 'OTHER'] as const;

export const STATUS_OPTIONS = [
  { value: 'pending', label: '待處理', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'in-progress', label: '進行中', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'completed', label: '已完成', color: 'bg-green-500/20 text-green-400' },
  { value: 'review', label: '審核中', color: 'bg-purple-500/20 text-purple-400' },
] as const;

export const DEFAULT_PROJECTS: Project[] = [
  { code: 'TWN-GTS-XDL-SI-001', name: '高雄捷運 SCADA 整合', client: '高捷公司' },
  { code: 'TWN-GTS-XDL-SI-002', name: '桃園水務監控系統', client: '桃園市政府' },
  { code: 'TWN-GTS-XDL-SI-003', name: '台中智慧建築 BMS', client: '台中科技園區' },
  { code: 'TWN-GTS-XDL-SI-004', name: '新竹半導體廠務監控', client: '台積電' },
  { code: 'TWN-GTS-XDL-SI-005', name: '台北污水處理廠 SCADA', client: '北市府水利局' },
  { code: 'TWN-GTS-XDL-REV-001', name: '機電 BIM 建模', client: '中興工程' },
  { code: 'TWN-GTS-XDL-AI-001', name: 'AI 預測維護平台', client: '內部研發' },
];

/**
 * 以「本地時區」取得 YYYY-MM-DD 字串。
 * 不可用 toISOString()：在 UTC+8 的 00:00–07:59 會得到前一天。
 */
export function toLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 將 YYYY-MM-DD 解析為本地時區的 Date（避免 toISOString 的 UTC 偏移問題） */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getWeekDates(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(toLocalDateString(d));
  }
  return dates;
}

export function getWeeklyHours(records: WorkRecord[]): { date: string; hours: number }[] {
  const weekDates = getWeekDates();
  return weekDates.map(date => {
    const dayRecords = records.filter(r => r.date === date);
    const hours = dayRecords.reduce((sum, r) => sum + r.hours, 0);
    return { date, hours };
  });
}

export function getProjectDistribution(records: WorkRecord[]): { name: string; value: number }[] {
  const distribution: Record<string, number> = {};
  records.forEach(r => {
    distribution[r.projectCode] = (distribution[r.projectCode] || 0) + r.hours;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export function getTotalHours(records: WorkRecord[]): number {
  return records.reduce((sum, r) => sum + r.hours, 0);
}

export function getTodayHours(records: WorkRecord[]): number {
  const today = toLocalDateString();
  return records.filter(r => r.date === today).reduce((sum, r) => sum + r.hours, 0);
}

export function getThisWeekHours(records: WorkRecord[]): number {
  const weekDates = getWeekDates();
  return records
    .filter(r => weekDates.includes(r.date))
    .reduce((sum, r) => sum + r.hours, 0);
}

export function exportToCSV(records: WorkRecord[]): void {
  const headers = ['日期', '專案代號', '系統別', '工時', '備註', '狀態'];
  // 所有欄位一律以引號包裹並轉義內部引號，避免內容含逗號/引號時破壞 CSV 格式
  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = records.map(r => [
    escapeCell(r.date),
    escapeCell(r.projectCode),
    escapeCell(r.systemType),
    escapeCell(r.hours.toString()),
    escapeCell(r.notes),
    escapeCell(r.status),
  ]);
  const csv = [headers.map(escapeCell).join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `shiftlog_export_${toLocalDateString()}.csv`);
}

export function exportToJSON(records: WorkRecord[]): void {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `shiftlog_export_${toLocalDateString()}.json`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function getDayName(dateStr: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const d = parseLocalDate(dateStr);
  return days[d.getDay()];
}
