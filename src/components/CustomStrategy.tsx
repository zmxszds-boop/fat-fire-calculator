import React, { useState, useEffect } from 'react';
import { Plus, Minus, TrendingUp, BarChart3, AlertTriangle, Target, Check, HelpCircle, Calendar } from 'lucide-react';
import { 
  ASSET_CLASSES, 
  PortfolioAllocation, 
  PortfolioMetrics,
  calculatePortfolioMetrics,
  getAssetBySymbol,
  getAssetHistoricalReturns,
  AssetClass,
  TimePeriod
} from '../data/historicalReturns';

interface CustomStrategyProps {
  onStrategyChange: (strategy: {
    id: string;
    name: string;
    growth: number;
    color: string;
    allocation: Array<{ name: string; value: number; color: string }>;
    description: string;
    pros: string;
    cons: string;
  }) => void;
  onStrategySelect?: (strategy: {
    name: string;
    expectedReturn: number;
    volatility: number;
    allocations: PortfolioAllocation[];
  }) => void;
  onClose?: () => void;
  currentAllocation?: PortfolioAllocation[];
  currentStrategyName?: string;
}

export default function CustomStrategy({ onStrategyChange, onStrategySelect, onClose, currentAllocation, currentStrategyName }: CustomStrategyProps) {
  const defaultAllocations = currentAllocation && currentAllocation.length > 0 
    ? currentAllocation 
    : [
        { symbol: 'VOO', percentage: 60 },
        { symbol: 'BND', percentage: 30 },
        { symbol: 'CASH', percentage: 10 }
      ];
  
  const [allocations, setAllocations] = useState<PortfolioAllocation[]>(defaultAllocations);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('10Y');
  
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [strategyName, setStrategyName] = useState(currentStrategyName || '我的自定义策略');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // Helper function to get average return for selected time period
  const getAssetAverageReturn = (asset: AssetClass): number => {
    if (!asset) return 0;
    const historicalReturns = getAssetHistoricalReturns(asset.symbol, timePeriod) || asset.historicalReturns;
    if (!historicalReturns || historicalReturns.length === 0) return 0;
    return historicalReturns.reduce((sum, ret) => sum + ret, 0) / historicalReturns.length;
  };

  // Calculate portfolio metrics when allocations or time period change
  useEffect(() => {
    try {
      if (!allocations || allocations.length === 0) {
        setPortfolioMetrics(null);
        return;
      }
      
      const metrics = calculatePortfolioMetrics(allocations, timePeriod);
      setPortfolioMetrics(metrics);
      
      // Notify parent component of strategy change
      const strategy = createStrategyFromAllocations(allocations, metrics);
      onStrategyChange(strategy);
    } catch (error) {
      console.error('Error calculating portfolio metrics:', error);
      setPortfolioMetrics(null);
    }
  }, [allocations, strategyName, timePeriod, onStrategyChange]);

  const createStrategyFromAllocations = (allocations: PortfolioAllocation[], metrics: PortfolioMetrics) => {
    if (!allocations || !metrics) {
      return {
        id: 'custom',
        name: strategyName,
        growth: 0,
        color: '#6366f1',
        allocation: [],
        description: '自定义投资组合配置',
        pros: '完全个性化配置',
        cons: '需要投资知识'
      };
    }
    
    const allocationDetails = allocations.map(alloc => {
      const asset = getAssetBySymbol(alloc.symbol);
      return {
        name: asset?.name || alloc.symbol,
        value: alloc.percentage,
        color: asset?.color || '#64748b'
      };
    });

    return {
      id: 'custom',
      name: strategyName,
      growth: Math.round(metrics.expectedReturn * 100) / 100,
      color: '#6366f1',
      allocation: allocationDetails,
      description: `自定义投资组合 - 预期年化收益 ${metrics.expectedReturn.toFixed(1)}%，风险等级 ${getRiskLevel(metrics.volatility)}`,
      pros: `预期收益 ${metrics.expectedReturn.toFixed(1)}%，夏普比率 ${metrics.sharpeRatio.toFixed(2)}`,
      cons: `预期最大回撤约 ${metrics.maxDrawdownRisk.toFixed(1)}%，波动性 ${metrics.volatility.toFixed(1)}%`
    };
  };

  const getRiskLevel = (volatility: number): string => {
    if (volatility < 8) return '低';
    if (volatility < 15) return '中低';
    if (volatility < 20) return '中等';
    if (volatility < 25) return '中高';
    return '高';
  };

  const updateAllocation = (symbol: string, percentage: number) => {
    setAllocations(prev => {
      const newAllocations = prev.map(alloc => 
        alloc.symbol === symbol ? { ...alloc, percentage } : alloc
      );
      return newAllocations;
    });
  };

  const addAsset = (symbol: string) => {
    const existing = allocations.find(alloc => alloc.symbol === symbol);
    if (existing) return;
    
    setAllocations(prev => [...prev, { symbol, percentage: 0 }]);
  };

  const removeAsset = (symbol: string) => {
    setAllocations(prev => prev.filter(alloc => alloc.symbol !== symbol));
  };

  const totalAllocation = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  const remainingAllocation = 100 - totalAllocation;

  const availableAssets = ASSET_CLASSES.filter(asset => 
    !allocations.find(alloc => alloc.symbol === asset.symbol)
  );

  const resetToBalanced = () => {
    setAllocations([
      { symbol: 'VOO', percentage: 60 },
      { symbol: 'BND', percentage: 40 }
    ]);
    setStrategyName('平衡型组合');
  };

  const resetToAggressive = () => {
    setAllocations([
      { symbol: 'VOO', percentage: 80 },
      { symbol: 'BND', percentage: 15 },
      { symbol: 'CASH', percentage: 5 }
    ]);
    setStrategyName('激进型组合');
  };

  const resetToConservative = () => {
    setAllocations([
      { symbol: 'VOO', percentage: 30 },
      { symbol: 'BND', percentage: 60 },
      { symbol: 'CASH', percentage: 10 }
    ]);
    setStrategyName('保守型组合');
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-indigo-200 relative max-h-[80vh] overflow-y-auto">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              自定义投资策略
            </h3>
            <p className="text-xs text-slate-600">基于历史数据创建个性化投资组合</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Compact preset buttons */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md">
            <button
              onClick={resetToConservative}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded transition-colors"
              title="保守型配置"
            >
              保守
            </button>
            <button
              onClick={resetToBalanced}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded transition-colors"
              title="平衡型配置"
            >
              平衡
            </button>
            <button
              onClick={resetToAggressive}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded transition-colors"
              title="激进型配置"
            >
              激进
            </button>
          </div>
          
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="收起自定义策略"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Compact Strategy Name Input */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="策略名称"
          />
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <label className="text-sm font-medium text-slate-700">回测时间周期</label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '10Y', label: '10年', desc: '2014-2024' },
            { value: '20Y', label: '20年', desc: '2005-2024' },
            { value: '30Y', label: '30年', desc: '1995-2024' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimePeriod(option.value as TimePeriod)}
              className={`p-2 rounded-lg border text-center transition-all ${
                timePeriod === option.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs text-slate-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Compact Asset Allocation Sliders */}
      <div className="space-y-3 mb-4">
        {allocations.map((allocation) => {
          const asset = getAssetBySymbol(allocation.symbol);
          if (!asset) {
            console.warn(`Asset not found for symbol: ${allocation.symbol}`);
            return (
              <div key={allocation.symbol} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-600">
                  资产 {allocation.symbol} 未找到，请检查配置
                </div>
              </div>
            );
          }

          return (
            <div key={allocation.symbol} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-700">{asset.name}</span>
                    <span className="text-xs text-slate-500 ml-1">({asset.category})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 w-10 text-right">
                    {allocation.percentage}%
                  </span>
                  <button
                    onClick={() => removeAsset(allocation.symbol)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="relative mb-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation.percentage}
                  onChange={(e) => updateAllocation(allocation.symbol, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${allocation.percentage}%, #e2e8f0 ${allocation.percentage}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span className="text-slate-600">历史: {getAssetAverageReturn(asset).toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Asset Dropdown */}
      {availableAssets.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700">添加资产类别</label>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
            >
              {showAdvanced ? '隐藏详情' : '显示详情'}
            </button>
          </div>
          
          {/* Detailed information - moved closer to the button */}
          {showAdvanced && (
            <div className="p-3 bg-slate-100 rounded-lg mb-3">
              <h5 className="text-xs font-medium text-slate-700 mb-2">详细配置分析 ({timePeriod === '10Y' ? '10年' : timePeriod === '20Y' ? '20年' : '30年'}数据)</h5>
              <div className="space-y-1">
                {allocations.map(allocation => {
                  const asset = getAssetBySymbol(allocation.symbol);
                  if (!asset) {
                    console.warn(`Asset not found for symbol: ${allocation.symbol}`);
                    return (
                      <div key={allocation.symbol} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">{allocation.symbol}</span>
                        <span className="text-red-600 font-medium">数据缺失</span>
                      </div>
                    );
                  }
                  
                  const avgReturn = getAssetAverageReturn(asset);
                  const contribution = (allocation.percentage / 100) * avgReturn;
                  
                  return (
                    <div key={allocation.symbol} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">{asset.symbol}</span>
                      <span className="text-slate-800 font-medium">
                        {allocation.percentage}% × {avgReturn.toFixed(1)}% = {contribution.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-slate-300 pt-1 mt-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700">总预期收益</span>
                    <span className="text-slate-900">
                      {portfolioMetrics.expectedReturn.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addAsset(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-4 py-3 pr-10 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-slate-700 font-medium"
            >
              <option value="" className="text-slate-500">选择要添加的资产类别...</option>
              {availableAssets.map(asset => (
                <option key={asset.symbol} value={asset.symbol} className="py-2">
                  {asset.name} ({asset.category}) - 历史收益: {getAssetAverageReturn(asset).toFixed(1)}%
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Summary */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">总配置比例</span>
          <span className={`text-sm font-bold ${
            Math.abs(remainingAllocation) < 0.1 ? 'text-green-600' : 
            remainingAllocation > 0 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {totalAllocation.toFixed(1)}%
          </span>
        </div>
        {Math.abs(remainingAllocation) >= 0.1 && (
          <div className="text-xs text-slate-500">
            {remainingAllocation > 0 ? 
              `还需配置 ${remainingAllocation.toFixed(1)}%` : 
              `超出 ${Math.abs(remainingAllocation).toFixed(1)}%`
            }
          </div>
        )}
      </div>

      {/* Portfolio Metrics */}
      {portfolioMetrics && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            投资组合分析
          </h4>
          
          <div className="flex gap-2 mb-3">
            <div className="flex-1 p-2.5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className="text-xs font-semibold text-green-700">预期收益</div>
                </div>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'return' ? null : 'return')}
                  className="p-0.5 text-green-500 hover:text-green-700 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-bold text-green-800">
                {portfolioMetrics.expectedReturn.toFixed(1)}%
              </div>
            </div>
            
            <div className="flex-1 p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <div className="text-xs font-semibold text-blue-700">波动性</div>
                </div>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'volatility' ? null : 'volatility')}
                  className="p-0.5 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-bold text-blue-800">
                {portfolioMetrics.volatility.toFixed(1)}%
              </div>
            </div>
            
            <div className="flex-1 p-2.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <div className="text-xs font-semibold text-purple-700">夏普比率</div>
                </div>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'sharpe' ? null : 'sharpe')}
                  className="p-0.5 text-purple-500 hover:text-purple-700 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-bold text-purple-800">
                {portfolioMetrics.sharpeRatio.toFixed(2)}
              </div>
            </div>
            
            <div className="flex-1 p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <div className="text-xs font-semibold text-amber-700">最大回撤</div>
                </div>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'drawdown' ? null : 'drawdown')}
                  className="p-0.5 text-amber-500 hover:text-amber-700 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-bold text-amber-800">
                {portfolioMetrics.maxDrawdownRisk.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Expanded Info Panel */}
          {expandedMetric && (
            <div className="mb-3 p-3 bg-slate-100 rounded-lg border border-slate-200">
              {expandedMetric === 'return' && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm font-semibold text-slate-800">预期年化收益</div>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    基于历史数据计算的投资组合预期年化收益率，实际收益可能因市场变化而有所不同。计算方式：各资产配置比例 × 对应资产历史平均收益的总和。例如：60% × 10% + 40% × 3% = 7.2%。当前数据基于2014-2024年各资产年化收益计算。
                  </div>
                </div>
              )}
              
              {expandedMetric === 'volatility' && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm font-semibold text-slate-800">波动性</div>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    衡量投资组合收益的波动程度，数值越高表示风险越大。计算方式：√(Σ(配置比例² × 各资产波动性²))，假设资产间相关性为0的保守估计。通常15%以下为低风险，25%以上为高风险。当前数据基于2014-2024年各资产收益标准差计算。
                  </div>
                </div>
              )}
              
              {expandedMetric === 'sharpe' && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-sm font-semibold text-slate-800">夏普比率</div>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    衡量每单位风险所获得的超额收益，数值越高表示风险调整后收益越好。计算方式：(投资组合预期收益 - 无风险利率) / 投资组合波动性。这里假设无风险利率为2%。例如：(7.2% - 2%) ÷ 15% = 0.35。大于1为优秀，0.5-1为良好，小于0.5为较差。
                  </div>
                </div>
              )}
              
              {expandedMetric === 'drawdown' && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div className="text-sm font-semibold text-slate-800">最大回撤风险</div>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    预估投资组合可能面临的最大亏损幅度，基于历史数据计算。计算方式：各资产历史最大回撤按配置比例加权平均。
                    <br /><br />
                    具体资产估算：<br />
                    • QQQ(35%), VOO/VTI(20%), VEA(18%)<br />
                    • VNQ(25%), VWO(30%), BND(8%)<br />
                    • GLD(15%), Cash(2%)<br />
                    <br />
                    例如：60%股票(20%) + 40%债券(8%) = 14.4%预估最大回撤
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-indigo-600" />
              <div className="text-xs font-medium text-indigo-700">
                {portfolioMetrics.sharpeRatio > 0.8 ? 
                  '优秀收益，适合长期投资' :
                  portfolioMetrics.sharpeRatio > 0.5 ?
                  '良好风险收益平衡' :
                  portfolioMetrics.maxDrawdownRisk < 15 ?
                  '保守组合，适合风险厌恶者' :
                  '高风险组合，适合激进投资者'
                }
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
              className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
            >
              收起
            </button>
            <button
              onClick={() => {
                if (onStrategySelect) {
                  onStrategySelect({
                    name: strategyName || '自定义策略',
                    expectedReturn: portfolioMetrics.expectedReturn,
                    volatility: portfolioMetrics.volatility,
                    allocations: allocations.filter(a => a.percentage > 0)
                  });
                }
                if (onClose) {
                  onClose();
                }
              }}
              disabled={Math.abs(remainingAllocation) >= 0.1}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              确认配置
            </button>
          </div>
        </div>
      )}
    </div>
  );
}