import { useState } from 'react';
import { Project } from '../types';
import { DEFAULT_PROJECTS } from '../utils/helpers';
import { Search, Plus, FolderOpen, ChevronDown, ChevronRight, Zap } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (code: string | null) => void;
  onAddProject: (project: Project) => void;
  recordCounts: Record<string, number>;
}

export default function Sidebar({ projects, selectedProject, onSelectProject, onAddProject, recordCounts }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [expanded, setExpanded] = useState(true);

  const allProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;
  const filtered = allProjects.filter(p =>
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (newCode && newName) {
      onAddProject({ code: newCode, name: newName });
      setNewCode('');
      setNewName('');
      setShowAddForm(false);
    }
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 bg-aurora-surface border-r border-aurora-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-aurora-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-aurora-accent/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-aurora-accent" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-aurora-accent tracking-wider">AURORA</h1>
            <p className="text-[10px] text-aurora-muted tracking-widest">SHIFTLOG PRO</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-aurora-muted" />
          <input
            type="text"
            placeholder="搜尋專案..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-aurora-bg border border-aurora-border rounded-lg text-xs text-aurora-text placeholder:text-aurora-muted/50 focus:outline-none focus:border-aurora-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* All Records Button */}
      <div className="px-3 py-2">
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
            selectedProject === null
              ? 'bg-aurora-accent/10 text-aurora-accent border border-aurora-accent/30'
              : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-card'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>全部紀錄</span>
          <span className="ml-auto text-[10px] opacity-60">
            {Object.values(recordCounts).reduce((a, b) => a + b, 0)}
          </span>
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold text-aurora-muted uppercase tracking-wider hover:text-aurora-text w-full"
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          專案列表 ({filtered.length})
        </button>

        {expanded && (
          <div className="space-y-0.5 mt-1">
            {filtered.map(project => (
              <button
                key={project.code}
                onClick={() => onSelectProject(project.code)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all group ${
                  selectedProject === project.code
                    ? 'bg-aurora-accent/10 text-aurora-accent border border-aurora-accent/20'
                    : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-card/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] truncate">{project.code}</span>
                  <span className="text-[10px] opacity-50 ml-2 shrink-0">
                    {recordCounts[project.code] || 0}
                  </span>
                </div>
                <p className="text-[10px] mt-0.5 opacity-60 truncate">{project.name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Project */}
      <div className="p-3 border-t border-aurora-border">
        {showAddForm ? (
          <div className="space-y-2 animate-fade-in">
            <input
              type="text"
              placeholder="TWN-GTS-XDL-SI-XXX"
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              className="w-full px-3 py-1.5 bg-aurora-bg border border-aurora-border rounded text-[11px] font-mono text-aurora-text placeholder:text-aurora-muted/40 focus:outline-none focus:border-aurora-accent/50"
            />
            <input
              type="text"
              placeholder="專案名稱"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full px-3 py-1.5 bg-aurora-bg border border-aurora-border rounded text-[11px] text-aurora-text placeholder:text-aurora-muted/40 focus:outline-none focus:border-aurora-accent/50"
            />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 py-1.5 bg-aurora-accent/20 text-aurora-accent rounded text-[11px] hover:bg-aurora-accent/30 transition-colors">
                新增
              </button>
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-1.5 bg-aurora-card text-aurora-muted rounded text-[11px] hover:text-aurora-text transition-colors">
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-aurora-border rounded-lg text-[11px] text-aurora-muted hover:text-aurora-accent hover:border-aurora-accent/30 transition-all"
          >
            <Plus className="w-3 h-3" />
            新增專案
          </button>
        )}
      </div>
    </aside>
  );
}
