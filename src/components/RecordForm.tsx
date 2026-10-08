import { useState, useEffect } from 'react';
import { WorkRecord } from '../types';
import { SYSTEM_TYPES, STATUS_OPTIONS, DEFAULT_PROJECTS, toLocalDateString } from '../utils/helpers';
import { X, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface RecordFormProps {
  record?: WorkRecord | null;
  onSave: (record: WorkRecord) => void;
  onClose: () => void;
  projects: { code: string; name: string }[];
}

export default function RecordForm({ record, onSave, onClose, projects }: RecordFormProps) {
  const allProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;
  const [form, setForm] = useState({
    date: toLocalDateString(),
    projectCode: allProjects[0]?.code || '',
    systemType: 'SCADA' as WorkRecord['systemType'],
    hours: 1,
    notes: '',
    status: 'pending' as WorkRecord['status'],
  });

  useEffect(() => {
    if (record) {
      setForm({
        date: record.date,
        projectCode: record.projectCode,
        systemType: record.systemType,
        hours: record.hours,
        notes: record.notes,
        status: record.status,
      });
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: record?.id || uuidv4(),
      ...form,
      createdAt: record?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-aurora-surface border border-aurora-border rounded-xl shadow-2xl aurora-glow">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-aurora-border">
          <h2 className="text-sm font-bold text-aurora-text">
            {record ? '編輯工時紀錄' : '新增工時紀錄'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-aurora-card text-aurora-muted hover:text-aurora-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date & Hours Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-aurora-muted mb-1.5">日期</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 bg-aurora-bg border border-aurora-border rounded-lg text-xs text-aurora-text focus:outline-none focus:border-aurora-accent/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-aurora-muted mb-1.5">工時 (小時)</label>
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={form.hours}
                onChange={e => setForm({ ...form, hours: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-aurora-bg border border-aurora-border rounded-lg text-xs text-aurora-text focus:outline-none focus:border-aurora-accent/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Project Code */}
          <div>
            <label className="block text-[11px] font-medium text-aurora-muted mb-1.5">專案代號</label>
            <select
              value={form.projectCode}
              onChange={e => setForm({ ...form, projectCode: e.target.value })}
              className="w-full px-3 py-2 bg-aurora-bg border border-aurora-border rounded-lg text-xs text-aurora-text focus:outline-none focus:border-aurora-accent/50 transition-colors font-mono"
            >
              {allProjects.map(p => (
                <option key={p.code} value={p.code}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          {/* System Type */}
          <div>
            <label className="block text-[11px] font-medium text-aurora-muted mb-1.5">系統別</label>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, systemType: type })}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    form.systemType === type
                      ? 'bg-aurora-accent/20 text-aurora-accent border border-aurora-accent/40'
                      : 'bg-aurora-card text-aurora-muted border border-aurora-border hover:text-aurora-text'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-medium text-aurora-muted mb-1.5">狀態</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, status: opt.value as WorkRecord['status'] })}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    form.status === opt.value
                      ? opt.color + ' border border-current/30'
                      : 'bg-aurora-card text-aurora-muted border border-aurora-border hover:text-aurora-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-medium text-aurora-muted mb-1.5">備註</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="工作內容描述..."
              rows={3}
              className="w-full px-3 py-2 bg-aurora-bg border border-aurora-border rounded-lg text-xs text-aurora-text placeholder:text-aurora-muted/40 focus:outline-none focus:border-aurora-accent/50 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-aurora-card text-aurora-muted rounded-lg text-xs hover:text-aurora-text transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-aurora-accent/20 text-aurora-accent rounded-lg text-xs font-medium hover:bg-aurora-accent/30 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {record ? '更新' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
