import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Shield, Scale, Target, BookOpen, Gem, AlertTriangle, CheckCircle2, Waves, PieChart as PieIcon, Info, Landmark, Wallet
} from 'lucide-react';
import CustomStrategy from '../components/CustomStrategy';

const STRATEGIES = [
  {
    id: 'conservative',
    name: '防御型 (Conservative)',
    growth: 4.5,
    color: '#64748b',
    allocation: [
      { name: '股票 (VTI)', value: 20, color: '#3b82f6' },
      { name: '债券 (BND)', value: 70, color: '#94a3b8' },
      { name: '现金/货币市场', value: 10, color: '#cbd5e1' }
    ],
    description: "侧重资产保值。适合已退休或风险承受力极低的人群。虽然波动小，但很难抵御长期通胀压力。",
    pros: "波动极低，心理压力小",
    cons: "增长缓慢，极难支撑 4% 的长期提取"
  },
  {
    id: 'balanced',
    name: '稳健型 (Balanced)',
    growth: 8.0,
    color: '#10b981',
    allocation: [
      { name: '股票 (VTI/VXUS)', value: 60, color: '#10b981' },
      { name: '债券 (BND)', value: 40, color: '#6ee7b7' }
    ],
    description: "经典的 60/40 组合。这是 4% 原则研究的基准配置，利用股票提供增长，债券缓冲市场回撤。",
    pros: "风险与收益的平衡，FIRE 基石",
    cons: "在低利率环境下债券收益可能承压"
  },
  {
    id: 'aggressive',
    name: '激进型 (Aggressive)',
    growth: 11.5,
    color: '#6366f1',
    allocation: [
      { name: '股票 (VOO/QQQ)', value: 90, color: '#6366f1' },
      { name: '债券/另类资产', value: 10, color: '#a5b4fc' }
    ],
    description: "追逐长期复利最大化。适合距离退休还有 10 年以上的积累期，通过时间消化波动。",
    pros: "复利效应最强，财富增值快",
    cons: "回撤可能达到 30-50%，退休初期风险大"
  }
];

const AVG_INFLATION = 2.8;

/* ============================================================ */
/* 修复后的 InputField：内部维护字符串状态，Blur 时同步数值 ✅ */
/* ============================================================ */
const InputField = ({ label, value, onChange, icon: Icon, prefix = "$" }: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void; 
  icon?: React.ComponentType<{ className?: string }>; 
  prefix?: string; 
}) => {
  const [inputValue, setInputValue] = useState(String(value));

  // 当外部 value 发生突变（如切换策略或重置）时，同步本地显示
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            const n = Number(inputValue);
            if (!Number.isNaN(n)) {
              onChange(n);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const n = Number(inputValue);
              if (!Number.isNaN(n)) {
                onChange(n);
                e.currentTarget.blur(); // 失去焦点触发同步
              }
            }
          }}
          className={`w-full ${prefix ? 'pl-7' : 'px-3'} py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-700 transition-shadow`}
        />
      </div>
    </div>
  );
};

export default function FatFireModeling() {
  // 核心财务状态
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(50);
  const [initialCapital, setInitialCapital] = useState(100000);
  
  // 储蓄细节
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [annual401k, setAnnual401k] = useState(23000);
  const [employerMatch, setEmployerMatch] = useState(7000);
  const [megaBackdoor, setMegaBackdoor] = useState(30000);
  
  // 支出与策略
  const [annualSpending, setAnnualSpending] = useState(100000);
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[1]);
  const [showRealValue, setShowRealValue] = useState(false);
  const [showCustomStrategy, setShowCustomStrategy] = useState(false);

  // 计算逻辑
  const projectionData = useMemo(() => {
    let data = [];
    let currentWealth = Number(initialCapital);
    const nominalGrowth = selectedStrategy.growth / 100;
    const inflationRate = AVG_INFLATION / 100;
    
    // 年度总投资 = (每月定投 * 12) + 401k个人 + 雇主Match + Mega Backdoor
    const totalAnnualInvestment = 
      (Number(monthlyContribution) * 12) + 
      Number(annual401k) + 
      Number(employerMatch) + 
      Number(megaBackdoor);

    for (let age = Number(currentAge); age <= 95; age++) {
      const yearIndex = age - Number(currentAge);
      const isRetired = age >= Number(retirementAge);
      
      if (!isRetired) {
        // 积累期：复利增长 + 年度投入
        currentWealth = (currentWealth * (1 + nominalGrowth)) + totalAnnualInvestment;
      } else {
        // 退休期：复利增长 - 支出（支出按通胀逐年调整）
        const nominalSpending = Number(annualSpending) * Math.pow(1 + inflationRate, yearIndex);
        currentWealth = (currentWealth * (1 + nominalGrowth)) - nominalSpending;
      }

      if (currentWealth < 0) currentWealth = 0;
      
      const inflationFactor = Math.pow(1 + inflationRate, yearIndex);
      const displayWealth = showRealValue ? currentWealth / inflationFactor : currentWealth;

      data.push({ 
        age, 
        wealth: Math.round(displayWealth), 
        isRetired 
      });
      
      // 如果资产归零且已退休，停止计算
      if (currentWealth === 0 && age > Number(retirementAge)) break;
    }
    return data;
  }, [currentAge, retirementAge, initialCapital, monthlyContribution, annual401k, employerMatch, megaBackdoor, annualSpending, selectedStrategy, showRealValue]);

  // 关键统计指标
  const fireStats = useMemo(() => {
    const retirePoint = projectionData.find(d => d.age === Number(retirementAge));
    const wealthAtRetire = retirePoint ? retirePoint.wealth : 0;
    const fireTarget = Number(annualSpending) * 25; 
    const currentWithdrawalRate = wealthAtRetire > 0 ? (Number(annualSpending) / wealthAtRetire) * 100 : 0;
    return { wealthAtRetire, fireTarget, currentWithdrawalRate };
  }, [projectionData, retirementAge, annualSpending]);

  // 处理自定义策略变化
  const handleCustomStrategyChange = (customStrategy: any) => {
    setSelectedStrategy(customStrategy);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Fat FIRE 投资建模</h1>
              {/* Custom Strategy Status Indicator */}
              {selectedStrategy.id === 'custom' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-xs font-bold text-indigo-700">自定义策略</span>
                </div>
              )}
            </div>
            <p className="text-slate-500 font-medium">精确测算初始资金、雇主福利与资产配置的影响</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setShowRealValue(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!showRealValue ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >名义价值 (未来钱)</button>
            <button 
              onClick={() => setShowRealValue(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${showRealValue ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >实际价值 (今日购买力)</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧输入栏 */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800">
                <Target className="w-5 h-5 text-indigo-600" /> 核心财务输入
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="当前年龄" value={currentAge} onChange={setCurrentAge} prefix="" />
                  <InputField label="退休年龄" value={retirementAge} onChange={setRetirementAge} prefix="" />
                </div>
                
                <InputField label="现有资产总额 (初始资金)" value={initialCapital} onChange={setInitialCapital} icon={Landmark} />
                
                <hr className="border-slate-100" />
                
                <div className="bg-indigo-50/50 p-4 rounded-2xl space-y-4">
                  <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-3 h-3" /> 年度储蓄计划
                  </h3>
                  <InputField label="每月额外投资 (普通账户)" value={monthlyContribution} onChange={setMonthlyContribution} />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="401k 个人投款" value={annual401k} onChange={setAnnual401k} />
                    <InputField label="公司匹配 (Match)" value={employerMatch} onChange={setEmployerMatch} />
                  </div>
                  <InputField label="Mega Backdoor 额度" value={megaBackdoor} onChange={setMegaBackdoor} />
                </div>

                <InputField label="退休后年度支出" value={annualSpending} onChange={setAnnualSpending} />
              </div>
            </section>

            {/* 资产配置明细 */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <PieIcon className="w-5 h-5 text-indigo-600" /> 策略比例详情
                </h2>
                {/* Custom Strategy Indicator */}
                {selectedStrategy.id === 'custom' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-indigo-700">自定义策略</span>
                  </div>
                )}
              </div>
              
              {/* Strategy Name Display */}
              <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">当前策略</div>
                    <div className="text-lg font-bold text-slate-800">{selectedStrategy.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">预期年化收益</div>
                    <div className="text-lg font-bold text-indigo-600">{selectedStrategy.growth}%</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={selectedStrategy.allocation}
                        innerRadius={28}
                        outerRadius={48}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {selectedStrategy.allocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {selectedStrategy.allocation.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-700">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed italic mb-3">"{selectedStrategy.description}"</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600"><b className="text-green-700">优势:</b> {selectedStrategy.pros}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600"><b className="text-amber-700">风险:</b> {selectedStrategy.cons}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 右侧可视化展示 */}
          <div className="lg:col-span-8 space-y-6">
            {/* 策略切换卡片 */}
            <div className="space-y-4">
              {/* 自定义策略 - 突出显示 */}
              <div className="relative">
                <button
                  onClick={() => setShowCustomStrategy(true)}
                  className={`w-full flex items-center justify-between p-6 rounded-3xl border-3 transition-all duration-300 group relative ${
                    selectedStrategy.id === 'custom'
                    ? showCustomStrategy
                      ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg shadow-indigo-100' 
                      : 'border-indigo-500 bg-gradient-to-r from-indigo-100 to-purple-100 shadow-lg shadow-indigo-200 hover:scale-[1.02]'
                    : showCustomStrategy
                      ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg shadow-indigo-100'
                      : 'border-indigo-300 bg-gradient-to-r from-white to-indigo-50 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-100 hover:scale-[1.02]'
                  }`}
                >
                  {/* Active custom strategy indicator */}
                  {selectedStrategy.id === 'custom' && !showCustomStrategy && (
                    <div className="absolute -top-2 -right-2 flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full border-2 border-white shadow-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      已启用
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                      selectedStrategy.id === 'custom' && !showCustomStrategy
                        ? 'bg-indigo-600 text-white' 
                        : showCustomStrategy 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-bold uppercase tracking-wider ${
                        selectedStrategy.id === 'custom' && !showCustomStrategy
                          ? 'text-indigo-600'
                          : showCustomStrategy 
                            ? 'text-indigo-600' 
                            : 'text-indigo-500'
                      }`}>
                        高级功能
                      </div>
                      <div className={`text-xl font-bold ${
                        selectedStrategy.id === 'custom' && !showCustomStrategy
                          ? 'text-indigo-900'
                          : showCustomStrategy 
                            ? 'text-indigo-900' 
                            : 'text-slate-800'
                      }`}>
                        自定义投资策略
                      </div>
                      <div className={`text-sm ${
                        selectedStrategy.id === 'custom' && !showCustomStrategy
                          ? 'text-indigo-700'
                          : showCustomStrategy 
                            ? 'text-indigo-700' 
                            : 'text-slate-600'
                      }`}>
                        {selectedStrategy.id === 'custom' && !showCustomStrategy
                          ? `当前策略: ${selectedStrategy.name} (${selectedStrategy.growth}%)`
                          : '基于历史数据创建个性化投资组合'
                        }
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    selectedStrategy.id === 'custom' && !showCustomStrategy
                      ? 'bg-indigo-600 text-white'
                      : showCustomStrategy 
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}>
                    {selectedStrategy.id === 'custom' && !showCustomStrategy
                      ? '管理策略'
                      : showCustomStrategy
                        ? '已激活'
                        : '点击配置'
                    }
                  </div>
                </button>
                
                {/* 自定义策略的收缩按钮 */}
                {showCustomStrategy && (
                  <button
                    onClick={() => setShowCustomStrategy(false)}
                    className="absolute -top-2 -right-2 p-2 bg-white border-2 border-indigo-300 rounded-full text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-700 transition-all shadow-lg z-10"
                    title="收起自定义策略"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* 预设策略 - 简化显示 */}
              <div className="grid grid-cols-3 gap-3">
                {STRATEGIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStrategy(s);
                      setShowCustomStrategy(false);
                    }}
                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all group relative ${
                      selectedStrategy.id === s.id && !showCustomStrategy
                      ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg shadow-indigo-100 scale-[1.02]' 
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:translate-y-[-1px] hover:shadow-md'
                    }`}
                  >
                    {/* Active indicator */}
                    {selectedStrategy.id === s.id && !showCustomStrategy && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                    
                    <span className={`text-[10px] font-bold uppercase mb-1 tracking-tighter ${selectedStrategy.id === s.id && !showCustomStrategy ? 'text-indigo-600' : 'text-slate-500'}`}>
                      回测年化: {s.growth}%
                    </span>
                    <span className={`text-sm font-bold ${selectedStrategy.id === s.id && !showCustomStrategy ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-800'}`}>
                      {s.name.split(' ')[0]}
                    </span>
                    
                    {/* Strategy color indicator */}
                    <div className={`mt-2 w-8 h-1 rounded-full ${
                      selectedStrategy.id === s.id && !showCustomStrategy 
                        ? 'bg-indigo-600' 
                        : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}></div>
                  </button>
                ))}
              </div>
              
              {/* Custom Strategy Active Indicator */}
              {selectedStrategy.id === 'custom' && !showCustomStrategy && (
                <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-indigo-700">自定义策略已启用</span>
                    </div>
                    <div className="text-xs text-indigo-600 font-medium">
                      {selectedStrategy.name} ({selectedStrategy.growth}%)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 自定义策略面板 */}
            {showCustomStrategy && (
              <CustomStrategy 
                onStrategyChange={handleCustomStrategyChange} 
                onClose={() => setShowCustomStrategy(false)}
              />
            )}

            {/* 数据概览卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div>
                  <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1">退休时总资产预估</div>
                  <div className="text-4xl font-extrabold tabular-nums">
                    ${fireStats.wealthAtRetire.toLocaleString()}
                  </div>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-slate-800 pt-6">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">FIRE 目标 (25x 支出)</div>
                    <div className="text-lg font-bold text-slate-300">${fireStats.fireTarget.toLocaleString()}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${fireStats.wealthAtRetire >= fireStats.fireTarget ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                    {fireStats.wealthAtRetire >= fireStats.fireTarget ? '目标达成' : '尚未达成'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">提款安全性分析 (SWR)</div>
                    <div className={`text-4xl font-extrabold ${fireStats.currentWithdrawalRate <= 4 ? 'text-green-500' : 'text-amber-500'}`}>
                      {fireStats.currentWithdrawalRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl ${fireStats.currentWithdrawalRate <= 4 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Shield className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    基于退休时的资产量，你的初始年度提款率为 <b>{fireStats.currentWithdrawalRate.toFixed(2)}%</b>。
                    {fireStats.currentWithdrawalRate <= 4 
                      ? " 处于安全边界（4%）之内，资产有极大概率终身够用。" 
                      : " 超过了 4% 的安全红线。建议增加 Mega Backdoor 投入或推迟退休以利用复利效应。"}
                  </p>
                </div>
              </div>
            </div>

            {/* 财富增长轨迹图 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-800 tracking-tight">财富积累与消耗轨迹 (Age {currentAge}-95)</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  通胀参考: {AVG_INFLATION}%
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedStrategy.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={selectedStrategy.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="age" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                      interval={5}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                      tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} 
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '12px'}}
                      labelStyle={{fontWeight: 'bold', marginBottom: '4px', color: '#1e293b'}}
                      formatter={(val) => [`$${val.toLocaleString()}`, '总资产']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="wealth" 
                      stroke={selectedStrategy.color} 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorWealth)" 
                    />
                    <ReferenceLine 
                      x={Number(retirementAge)} 
                      stroke="#6366f1" 
                      strokeDasharray="5 5" 
                      label={{ value: '退休日', position: 'insideTopLeft', fill: '#6366f1', fontSize: 10, fontWeight: 'bold'}} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 策略逻辑深挖 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <BookOpen className="w-24 h-24 text-indigo-900" />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-500" /> 
                  为什么初始资金和 Match 如此重要？
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">初始资金效应</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                      $100k 的初始资金在 8% 收益下，20 年后在不增加投款的情况下也会变成 $466k。它是复利滚动最初的雪球。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">Match 的 100% 收益</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                      Employer Match 是职场中唯一的"免费午餐"。它相当于在投入瞬间获得了 100% 的无风险回报。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">税收优化路径</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                      通过 Mega Backdoor，你可以将每年原本要缴重税的资金转入 Roth 账户，让财富增值部分完全免税。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}