import { useMemo } from 'react';
import { WorkRecord } from '../types';
import { getWeeklyHours, getProjectDistribution, getTotalHours, getTodayHours, getThisWeekHours, formatDate, getDayName, toLocalDateString } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, TrendingUp, Calendar, Activity } from 'lucide-react';

interface DashboardProps {
  records: WorkRecord[];
}

const PIE_COLORS = ['#00d4ff', '#2ed573', '#ffa502', '#ff4757', '#a855f7', '#06b6d4', '#f97316'];

export default function Dashboard({ records }: DashboardProps) {
  // 每次渲染取今日日期字串（成本可忽略）；跨日後任何 re-render 都能刷新日期相關統計
  const todayString = toLocalDateString();
  const weeklyData = useMemo(() => getWeeklyHours(records), [records, todayString]);
  const projectDist = useMemo(() => getProjectDistribution(records), [records]);
  const totalHours = useMemo(() => getTotalHours(records), [records]);
  const todayHours = useMemo(() => getTodayHours(records), [records, todayString]);
  const weekHours = useMemo(() => getThisWeekHours(records), [records, todayString]);
  const avgDaily = records.length > 0 ? (weekHours / 7).toFixed(1) : '0';

  const stats = [
    { icon: Clock, label: '今日工時', value: `${todayHours}h`, color: 'text-aurora-accent' },
    { icon: Calendar, label: '本週工時', value: `${weekHours}h`, color: 'text-aurora-success' },
    { icon: TrendingUp, label: '日均工時', value: `${avgDaily}h`, color: 'text-aurora-warning' },
    { icon: Activity, label: '總工時', value: `${totalHours}h`, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-aurora-surface border border-aurora-border rounded-xl p-4 aurora-border-glow">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] text-aurora-muted uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-2 bg-aurora-surface border border-aurora-border rounded-xl p-4">
          <h3 className="text-xs font-semibold text-aurora-muted uppercase tracking-wider mb-4">
            📊 本週工時分佈
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3348" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => `${formatDate(v)} ${getDayName(v)}`}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#2d3348' }}
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#2d3348' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2d3348', borderRadius: '8px', fontSize: '11px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#00d4ff' }}
                  formatter={(value: number) => [`${value} 小時`, '工時']}
                  labelFormatter={(label) => `${label} (${getDayName(label)})`}
                />
                <Bar dataKey="hours" fill="#00d4ff" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-aurora-surface border border-aurora-border rounded-xl p-4">
          <h3 className="text-xs font-semibold text-aurora-muted uppercase tracking-wider mb-4">
            🥧 專案工時佔比
          </h3>
          {projectDist.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {projectDist.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2d3348', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(value: number) => [`${value} 小時`, '工時']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-aurora-muted text-xs">
              尚無紀錄資料
            </div>
          )}
          {/* Legend */}
          <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
            {projectDist.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-aurora-muted truncate font-mono">{item.name}</span>
                <span className="ml-auto text-aurora-text shrink-0">{item.value}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
