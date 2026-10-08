import { WorkRecord } from '../types';

interface GanttViewProps {
  records: WorkRecord[];
}

export default function GanttView({ records }: GanttViewProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-aurora-muted animate-fade-in">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-sm">尚無任務資料</p>
        <p className="text-xs mt-1 opacity-60">新增工時紀錄後將顯示甘特圖</p>
      </div>
    );
  }

  // Group records by project
  const projectGroups: Record<string, WorkRecord[]> = {};
  records.forEach(r => {
    if (!projectGroups[r.projectCode]) projectGroups[r.projectCode] = [];
    projectGroups[r.projectCode].push(r);
  });

  // Find date range
  const allDates = records.map(r => r.date).sort();
  const minDate = allDates[0];
  const maxDate = allDates[allDates.length - 1];

  // Generate date range
  const dateRange: string[] = [];
  const start = new Date(minDate);
  const end = new Date(maxDate);
  const current = new Date(start);
  while (current <= end) {
    dateRange.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  // Limit display to max 30 days
  const displayDates = dateRange.slice(-30);
  const dayWidth = Math.max(28, Math.min(40, 800 / displayDates.length));

  const getSystemColor = (type: string) => {
    const colors: Record<string, string> = {
      SCADA: 'bg-cyan-500/70',
      REVIT: 'bg-green-500/70',
      AI: 'bg-purple-500/70',
      PLC: 'bg-orange-500/70',
      HMI: 'bg-pink-500/70',
      OTHER: 'bg-gray-500/70',
    };
    return colors[type] || colors.OTHER;
  };

  const getDayRecord = (projectRecords: WorkRecord[], date: string) => {
    return projectRecords.find(r => r.date === date);
  };

  const today = new Date().toISOString().split('T')[0];

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
                const d = new Date(date);
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
                    const dayRecord = getDayRecord(projectRecords, date);
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
                            className={`h-6 rounded ${getSystemColor(dayRecord.systemType)} flex items-center justify-center`}
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
            <div className={`w-3 h-3 rounded ${getSystemColor(type)}`} />
            <span className="text-[10px] text-aurora-muted">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
