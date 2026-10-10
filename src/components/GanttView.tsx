import { useMemo } from 'react';
import { WorkRecord } from '../types';
import { toLocalDateString, parseLocalDate, getSystemBlockColor } from '../utils/helpers';

interface GanttViewProps {
  records: WorkRecord[];
}

/** 產生起始日到結束日之間的日期字串（本地時區，避免 UTC 偏移造成日期位移） */
function buildDateRange(minDate: string, maxDate: string): string[] {
  const range: string[] = [];
  const end = parseLocalDate(maxDate);
  const current = parseLocalDate(minDate);
  while (current <= end) {
    range.push(toLocalDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return range;
}

export default function GanttView({ records }: GanttViewProps) {
  // 衍生資料：按專案分組、日期範圍、日期→紀錄索引，僅在 records 變動時重算
  const { projectGroups, displayDates } = useMemo(() => {
    const groups: Record<string, WorkRecord[]> = {};
    let minDate = '';
    let maxDate = '';
    records.forEach(r => {
      (groups[r.projectCode] ??= []).push(r);
      if (!minDate || r.date < minDate) minDate = r.date;
      if (!maxDate || r.date > maxDate) maxDate = r.date;
    });
    // 僅顯示最近 30 天
    const dates = minDate ? buildDateRange(minDate, maxDate).slice(-30) : [];
    return { projectGroups: groups, displayDates: dates };
  }, [records]);

  // 以「專案代號|日期」建立 O(1) 查找索引，避免每格線性搜尋
  // 注意：同一專案同日若有多筆紀錄，原實作 find() 顯示「第一筆」，
  // 故僅在 key 不存在時寫入，保留原有顯示邏輯
  const recordIndex = useMemo(() => {
    const index = new Map<string, WorkRecord>();
    records.forEach(r => {
      const key = `${r.projectCode}|${r.date}`;
      if (!index.has(key)) index.set(key, r);
    });
    return index;
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-aurora-muted animate-fade-in">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-sm">尚無任務資料</p>
        <p className="text-xs mt-1 opacity-60">新增工時紀錄後將顯示甘特圖</p>
      </div>
    );
  }

  const dayWidth = Math.max(28, Math.min(40, 800 / displayDates.length));
  const today = toLocalDateString();

  return (
    <div className="animate-fade-in">
      <div className="bg-aurora-surface border border-aurora-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-aurora-border">
          <div className="w-48 shrink-0 px-4 py-2 border-r border-aurora-border bg-aurora-card/30">
            <span className="text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">專案</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <div className="flex" style={{ minWidth: displayDates.length * dayWidth }}>
              {displayDates.map(date => {
                const d = parseLocalDate(date);
                const isToday = date === today;
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <div
                    key={date}
                    className={`shrink-0 text-center py-2 border-r border-aurora-border/50 ${
                      isToday ? 'bg-aurora-accent/10' : isWeekend ? 'bg-aurora-card/20' : ''
                    }`}
                    style={{ width: dayWidth }}
                  >
                    <div className="text-[9px] text-aurora-muted">{d.getMonth() + 1}/{d.getDate()}</div>
                    <div className={`text-[9px] ${isToday ? 'text-aurora-accent font-bold' : 'text-aurora-muted/50'}`}>
                      {['日', '一', '二', '三', '四', '五', '六'][d.getDay()]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="max-h-[500px] overflow-y-auto">
          {Object.entries(projectGroups).map(([projectCode, projectRecords]) => (
            <div key={projectCode} className="flex border-b border-aurora-border/50 hover:bg-aurora-card/20 transition-colors">
              {/* Project label */}
              <div className="w-48 shrink-0 px-3 py-3 border-r border-aurora-border bg-aurora-card/10">
                <p className="text-[10px] font-mono text-aurora-text truncate">{projectCode}</p>
                <p className="text-[9px] text-aurora-muted mt-0.5">
                  {projectRecords.reduce((s, r) => s + r.hours, 0)}h 總計
                </p>
              </div>

              {/* Timeline */}
              <div className="overflow-x-auto flex-1">
                <div className="flex" style={{ minWidth: displayDates.length * dayWidth }}>
                  {displayDates.map(date => {
                    const dayRecord = recordIndex.get(`${projectCode}|${date}`);
                    const isToday = date === today;
                    return (
                      <div
                        key={date}
                        className={`shrink-0 py-1.5 px-0.5 border-r border-aurora-border/30 ${
                          isToday ? 'bg-aurora-accent/5' : ''
                        }`}
                        style={{ width: dayWidth }}
                      >
                        {dayRecord && (
                          <div
                            className={`h-6 rounded ${getSystemBlockColor(dayRecord.systemType)} flex items-center justify-center`}
                            title={`${dayRecord.systemType} - ${dayRecord.hours}h`}
                          >
                            <span className="text-[8px] font-bold text-white/90">{dayRecord.hours}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-2 flex-wrap">
        <span className="text-[10px] text-aurora-muted">系統別：</span>
        {['SCADA', 'REVIT', 'AI', 'PLC', 'HMI'].map(type => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${getSystemBlockColor(type)}`} />
            <span className="text-[10px] text-aurora-muted">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
