import { useState, useMemo } from 'react';
import { WorkRecord, Project, ViewMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportToCSV, exportToJSON, DEFAULT_PROJECTS } from './utils/helpers';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RecordTable from './components/RecordTable';
import RecordForm from './components/RecordForm';
import GanttView from './components/GanttView';
import PomodoroTimer from './components/PomodoroTimer';
import {
  Plus, Download, FileJson, Search, LayoutDashboard,
  Table2, GanttChartSquare, Menu, X, Zap
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useLocalStorage<WorkRecord[]>('aurora-records', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('aurora-projects', DEFAULT_PROJECTS);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);

  // Filter records
  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (selectedProject) {
      filtered = filtered.filter(r => r.projectCode === selectedProject);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.projectCode.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q) ||
        r.systemType.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [records, selectedProject, searchQuery]);

  // Record counts per project
  const recordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(r => {
      counts[r.projectCode] = (counts[r.projectCode] || 0) + 1;
    });
    return counts;
  }, [records]);

  // Handlers
  const handleSaveRecord = (record: WorkRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [...prev, record];
    });
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('確定要刪除此筆紀錄嗎？')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditRecord = (record: WorkRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleAddProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const viewModes = [
    { mode: 'dashboard' as ViewMode, icon: LayoutDashboard, label: '儀表板' },
    { mode: 'table' as ViewMode, icon: Table2, label: '列表' },
    { mode: 'gantt' as ViewMode, icon: GanttChartSquare, label: '甘特圖' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-aurora-bg grid-bg">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-0 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={(code) => { setSelectedProject(code); setSidebarOpen(false); }}
          onAddProject={handleAddProject}
          recordCounts={recordCounts}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="shrink-0 bg-aurora-surface/80 backdrop-blur-sm border-b border-aurora-border px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-aurora-card text-aurora-muted"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <Zap className="w-4 h-4 text-aurora-accent" />
              <span className="text-xs font-bold text-aurora-accent">AURORA</span>
            </div>

            {/* View Mode Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-aurora-bg rounded-lg p-1 border border-aurora-border">
              {viewModes.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-aurora-accent/15 text-aurora-accent'
                      : 'text-aurora-muted hover:text-aurora-text'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xs ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-aurora-muted" />
                <input
                  type="text"
                  placeholder="搜尋紀錄..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-aurora-bg border border-aurora-border rounded-lg text-xs text-aurora-text placeholder:text-aurora-muted/50 focus:outline-none focus:border-aurora-accent/50 transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPomodoro(!showPomodoro)}
                className={`p-2 rounded-lg text-xs transition-all ${
                  showPomodoro ? 'bg-aurora-accent/15 text-aurora-accent' : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-card'
                }`}
                title="番茄鐘"
              >
                🍅
              </button>
              <button
                onClick={() => exportToCSV(filteredRecords)}
                className="p-2 rounded-lg text-aurora-muted hover:text-aurora-text hover:bg-aurora-card transition-colors"
                title="匯出 CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => exportToJSON(filteredRecords)}
                className="p-2 rounded-lg text-aurora-muted hover:text-aurora-text hover:bg-aurora-card transition-colors"
                title="匯出 JSON"
              >
                <FileJson className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setEditingRecord(null); setShowForm(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-aurora-accent/20 text-aurora-accent rounded-lg text-xs font-medium hover:bg-aurora-accent/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">新增紀錄</span>
              </button>
            </div>
          </div>

          {/* Mobile View Tabs */}
          <div className="flex sm:hidden items-center gap-1 mt-2 bg-aurora-bg rounded-lg p-1 border border-aurora-border">
            {viewModes.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-aurora-accent/15 text-aurora-accent'
                    : 'text-aurora-muted'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Pomodoro Widget */}
            {showPomodoro && (
              <div className="max-w-sm animate-fade-in">
                <PomodoroTimer />
              </div>
            )}

            {/* Selected Project Info */}
            {selectedProject && (
              <div className="flex items-center gap-3 bg-aurora-surface border border-aurora-border rounded-xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-aurora-accent pulse-dot" />
                <div>
                  <p className="text-xs font-mono text-aurora-accent">{selectedProject}</p>
                  <p className="text-[10px] text-aurora-muted">
                    {projects.find(p => p.code === selectedProject)?.name || ''} · {filteredRecords.length} 筆紀錄
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-auto text-[10px] text-aurora-muted hover:text-aurora-text px-2 py-1 rounded hover:bg-aurora-card transition-colors"
                >
                  顯示全部
                </button>
              </div>
            )}

            {/* View Content */}
            {viewMode === 'dashboard' && <Dashboard records={filteredRecords} />}
            {viewMode === 'table' && (
              <div className="bg-aurora-surface border border-aurora-border rounded-xl overflow-hidden">
                <RecordTable
                  records={filteredRecords}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                />
              </div>
            )}
            {viewMode === 'gantt' && <GanttView records={filteredRecords} />}
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="shrink-0 bg-aurora-surface/60 border-t border-aurora-border px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] text-aurora-muted">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-aurora-success" />
              系統正常
            </span>
            <span>共 {records.length} 筆紀錄</span>
            <span>總工時 {records.reduce((s, r) => s + r.hours, 0)}h</span>
          </div>
          <div className="text-[10px] text-aurora-muted/50">
            Aurora ShiftLog Pro v1.0
          </div>
        </footer>
      </main>

      {/* Record Form Modal */}
      {showForm && (
        <RecordForm
          record={editingRecord}
          onSave={handleSaveRecord}
          onClose={() => { setShowForm(false); setEditingRecord(null); }}
          projects={projects}
        />
      )}
    </div>
  );
}
