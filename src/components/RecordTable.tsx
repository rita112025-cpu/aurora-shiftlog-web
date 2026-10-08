import { WorkRecord } from '../types';
import { STATUS_OPTIONS, formatDate } from '../utils/helpers';
import { Edit3, Trash2 } from 'lucide-react';

interface RecordTableProps {
  records: WorkRecord[];
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
}

export default function RecordTable({ records, onEdit, onDelete }: RecordTableProps) {
  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  const getSystemColor = (type: string) => {
    const colors: Record<string, string> = {
      SCADA: 'bg-cyan-500/20 text-cyan-400',
      REVIT: 'bg-green-500/20 text-green-400',
      AI: 'bg-purple-500/20 text-purple-400',
      PLC: 'bg-orange-500/20 text-orange-400',
      HMI: 'bg-pink-500/20 text-pink-400',
      OTHER: 'bg-gray-500/20 text-gray-400',
    };
    return colors[type] || colors.OTHER;
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-aurora-muted">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm">尚無工時紀錄</p>
        <p className="text-xs mt-1 opacity-60">點擊「新增紀錄」開始記錄</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-aurora-border">
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">日期</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">專案代號</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">系統別</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">工時</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">狀態</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">備註</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => {
              const statusInfo = getStatusInfo(record.status);
              return (
                <tr key={record.id} className="border-b border-aurora-border/50 hover:bg-aurora-card/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-aurora-text font-mono">{record.date}</td>
                  <td className="px-4 py-3 text-xs text-aurora-text font-mono">{record.projectCode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSystemColor(record.systemType)}`}>
                      {record.systemType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-aurora-accent font-mono font-bold">{record.hours}h</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-aurora-muted max-w-[200px] truncate">{record.notes || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-1.5 rounded hover:bg-aurora-accent/10 text-aurora-muted hover:text-aurora-accent transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-aurora-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {records.map(record => {
          const statusInfo = getStatusInfo(record.status);
          return (
            <div key={record.id} className="bg-aurora-card/50 border border-aurora-border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[10px] text-aurora-muted font-mono">{record.date}</p>
                  <p className="text-xs font-mono text-aurora-text mt-0.5">{record.projectCode}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(record)} className="p-1 rounded hover:bg-aurora-accent/10 text-aurora-muted">
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button onClick={() => onDelete(record.id)} className="p-1 rounded hover:bg-red-500/10 text-aurora-muted">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSystemColor(record.systemType)}`}>
                  {record.systemType}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className="text-xs text-aurora-accent font-mono font-bold ml-auto">{record.hours}h</span>
              </div>
              {record.notes && (
                <p className="text-[11px] text-aurora-muted mt-2 truncate">{record.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
