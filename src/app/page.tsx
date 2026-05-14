'use client';

import { useState } from 'react';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
  type?: 'task' | 'milestone';
}

const initialTasks: Task[] = [
  {
    id: '1',
    name: '项目启动',
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 3),
    progress: 100,
  },
  {
    id: '2',
    name: '需求分析',
    start: new Date(2026, 4, 4),
    end: new Date(2026, 4, 10),
    progress: 80,
    dependencies: ['1'],
  },
  {
    id: '3',
    name: '设计阶段',
    start: new Date(2026, 4, 11),
    end: new Date(2026, 4, 18),
    progress: 50,
    dependencies: ['2'],
  },
  {
    id: '4',
    name: '开发阶段',
    start: new Date(2026, 4, 19),
    end: new Date(2026, 5, 15),
    progress: 30,
    dependencies: ['3'],
  },
  {
    id: '5',
    name: '测试阶段',
    start: new Date(2026, 5, 16),
    end: new Date(2026, 5, 25),
    progress: 0,
    dependencies: ['4'],
  },
  {
    id: '6',
    name: '上线部署',
    start: new Date(2026, 5, 26),
    end: new Date(2026, 5, 30),
    progress: 0,
    dependencies: ['5'],
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    start: '',
    end: '',
    progress: 50,
    dependencies: '',
  });

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const parseDate = (str: string) => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const addTask = () => {
    if (!newTask.name || !newTask.start || !newTask.end) return;
    
    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      start: parseDate(newTask.start),
      end: parseDate(newTask.end),
      progress: newTask.progress,
      dependencies: newTask.dependencies ? [newTask.dependencies] : undefined,
    };
    
    setTasks([...tasks, task]);
    setShowModal(false);
    setNewTask({ name: '', start: '', end: '', progress: 50, dependencies: '' });
  };


  const allDates = tasks.flatMap(t => [t.start, t.end]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  // 添加前后各3天
  minDate.setDate(minDate.getDate() - 3);
  maxDate.setDate(maxDate.getDate() + 3);

  // 计算时间轴
  const getDays = () => {
    const days: Date[] = [];
    const current = new Date(minDate);
    while (current <= maxDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const days = getDays();

  const getColumnWidth = () => {
    switch (view) {
      case 'day': return 40;
      case 'week': return 120;
      case 'month': return 180;
      default: return 120;
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getTaskStyle = (task: Task) => {
    const startOffset = Math.max(0, (task.start.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000));
    const duration = (task.end.getTime() - task.start.getTime()) / (24 * 60 * 60 * 1000) + 1;
    const left = startOffset * (getColumnWidth() / (view === 'day' ? 1 : view === 'week' ? 7 : 30));
    const width = duration * (getColumnWidth() / (view === 'day' ? 1 : view === 'week' ? 7 : 30));
    
    return {
      left: `${left}px`,
      width: `${Math.max(width, 30)}px`,
    };
  };

  const getProgressStyle = (task: Task) => {
    const color = task.progress === 100 ? 'bg-emerald-500' : 
                  task.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500';
    return color;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">📊 工程进度计划</h1>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400">共 {tasks.length} 个任务</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 视图切换 */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'day' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                日
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'week' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                周
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'month' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                月
              </button>
            </div>

            {/* 添加任务按钮 */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>+</span> 添加任务
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* 任务列表 */}
        <div className="w-full lg:w-80 bg-slate-800 border-r border-slate-700">
          <div className="p-4 border-b border-slate-700 bg-slate-800 sticky top-0">
            <h2 className="font-semibold text-slate-300">任务名称</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTask === task.id 
                    ? 'bg-blue-600/20 border-l-4 border-blue-500' 
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.name}</p>
                    <p className="text-sm text-slate-400">
                      {formatDate(task.start)} ~ {formatDate(task.end)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.progress === 100 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : task.progress >= 50
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {task.progress}%
                  </span>
                </div>
                
                {/* 进度条 */}
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${getProgressStyle(task)}`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 甘特图 */}
        <div className="flex-1 overflow-x-auto">
          {/* 时间轴头 */}
          <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 flex">
            <div className="w-32 flex-shrink-0 p-3 bg-slate-800 border-r border-slate-700">
              <span className="text-sm text-slate-400">任务</span>
            </div>
            <div className="flex" style={{ minWidth: `${days.length * (getColumnWidth() / (view === 'day' ? 1 : view === 'week' ? 7 : 30))}px` }}>
              {days.map((date, i) => (
                <div
                  key={i}
                  className={`text-center p-2 text-xs ${
                    isWeekend(date) ? 'bg-slate-700/50 text-slate-500' : 'text-slate-400'
                  }`}
                  style={{ width: `${getColumnWidth() / (view === 'day' ? 1 : view === 'week' ? 7 : 30)}px` }}
                >
                  <div className="font-medium text-slate-300">{date.getDate()}</div>
                  <div className="text-slate-500">
                    {['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 甘特图内容 */}
          <div className="relative">
            {tasks.map((task) => (
              <div key={task.id} className="flex border-b border-slate-700/50">
                <div 
                  className={`w-32 flex-shrink-0 p-3 bg-slate-800/50 border-r border-slate-700 truncate cursor-pointer ${
                    selectedTask === task.id ? 'bg-blue-600/10' : ''
                  }`}
                  onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                >
                  <span className="text-sm text-slate-300">{task.name}</span>
                </div>
                <div 
                  className="relative h-14 flex items-center"
                  style={{ minWidth: `${days.length * (getColumnWidth() / (view === 'day' ? 1 : view === 'week' ? 7 : 30))}px` }}
                >
                  {/* 网格线 */}
                  {days.map((date, i) => (
                    <div
                      key={i}
                      className={`absolute top-0 bottom-0 w-px bg-slate-700/30 ${
                        isWeekend(date) ? 'bg-slate-700/50' : ''
                      }`}
                      style={{ left: `${i * (getColumnWidth() / (view === 'day' ? 1 : view === 'week' ? 7 : 30))}px` }}
                    />
                  ))}
                  
                  {/* 任务条 */}
                  <div
                    className={`absolute h-8 rounded-md cursor-pointer transition-all hover:brightness-110 ${
                      selectedTask === task.id 
                        ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' 
                        : ''
                    } ${getProgressStyle(task)}`}
                    style={getTaskStyle(task)}
                    onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                  >
                    {/* 进度填充 */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-white/20 rounded-l-md"
                      style={{ width: `${task.progress}%` }}
                    />
                    <div className="relative px-2 py-1 text-sm font-medium text-white truncate">
                      {task.name}
                    </div>
                  </div>

                  {/* 今日线 */}
                  {new Date().toDateString() === task.start.toDateString() && (
                    <div className="absolute w-0.5 h-full bg-red-500 opacity-50" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <footer className="bg-slate-800 border-t border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-6">
            <span>📅 工期: {Math.ceil((maxDate.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000))} 天</span>
            <span>✅ 完成: {tasks.filter(t => t.progress === 100).length} 个</span>
            <span>🔄 进行中: {tasks.filter(t => t.progress > 0 && t.progress < 100).length} 个</span>
            <span>⏸️ 未开始: {tasks.filter(t => t.progress === 0).length} 个</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500"></span> 完成
            <span className="w-3 h-3 rounded bg-blue-500 ml-2"></span> 进行中
            <span className="w-3 h-3 rounded bg-amber-500 ml-2"></span> 刚开始
          </div>
        </div>
      </footer>

      {/* 添加任务弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-96 border border-slate-700" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">➕ 添加新任务</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">任务名称</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="请输入任务名称"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">开始日期</label>
                  <input
                    type="date"
                    value={newTask.start}
                    onChange={e => setNewTask({ ...newTask, start: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">结束日期</label>
                  <input
                    type="date"
                    value={newTask.end}
                    onChange={e => setNewTask({ ...newTask, end: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">初始进度 (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTask.progress}
                  onChange={e => setNewTask({ ...newTask, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-slate-300">{newTask.progress}%</div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">依赖任务（可选）</label>
                <select
                  value={newTask.dependencies}
                  onChange={e => setNewTask({ ...newTask, dependencies: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">无依赖</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}