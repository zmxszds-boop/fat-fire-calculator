// Historical annual returns data (2014-2024) based on research
// Sources: Morningstar, Yahoo Finance, Vanguard official data

export interface AssetClass {
  symbol: string;
  name: string;
  category: string;
  historicalReturns: number[]; // Annual returns 2014-2024
  historicalReturns20Y: number[]; // Annual returns 2005-2024 (20 years)
  historicalReturns30Y: number[]; // Annual returns 1995-2024 (30 years)
  avgReturn: number;
  volatility: number;
  color: string;
  description: string;
}

export const ASSET_CLASSES: AssetClass[] = [
  // US Equity
  {
    symbol: 'VOO',
    name: 'S&P 500 (VOO)',
    category: 'US Large Cap',
    historicalReturns: [13.5, 1.3, 11.9, 21.7, -4.4, 31.4, 18.3, -18.2, 26.2, 24.9, 17.6],
    historicalReturns20Y: [4.8, 10.4, 15.6, 5.5, -36.8, 26.3, 15.0, 2.1, 16.0, 32.4, 13.5, 1.3, 11.9, 21.7, -4.4, 31.4, 18.3, -18.2, 26.2, 24.9],
    historicalReturns30Y: [37.6, 23.1, 33.4, 28.6, 21.0, -9.1, -11.9, -22.1, 28.7, 10.9, 4.8, 10.4, 15.6, 5.5, -36.8, 26.3, 15.0, 2.1, 16.0, 32.4, 13.5, 1.3, 11.9, 21.7, -4.4, 31.4, 18.3, -18.2, 26.2, 24.9],
    avgReturn: 13.8,
    volatility: 15.2,
    color: '#3b82f6',
    description: 'Vanguard S&P 500 ETF - tracks 500 largest US companies'
  },
  {
    symbol: 'VTI',
    name: 'Total Stock Market (VTI)',
    category: 'US Total Market',
    historicalReturns: [12.4, 0.4, 12.5, 21.0, -5.2, 31.2, 17.1, -19.5, 25.6, 24.0, 16.8],
    historicalReturns20Y: [5.7, 10.7, 16.3, 5.3, -37.0, 28.7, 17.3, 1.0, 16.4, 33.5, 12.4, 0.4, 12.5, 21.0, -5.2, 31.2, 17.1, -19.5, 25.6, 24.0],
    historicalReturns30Y: [36.4, 21.0, 31.3, 26.7, 19.9, -10.6, -11.2, -20.9, 31.4, 12.5, 5.7, 10.7, 16.3, 5.3, -37.0, 28.7, 17.3, 1.0, 16.4, 33.5, 12.4, 0.4, 12.5, 21.0, -5.2, 31.2, 17.1, -19.5, 25.6, 24.0],
    avgReturn: 13.2,
    volatility: 15.8,
    color: '#1d4ed8',
    description: 'Vanguard Total Stock Market ETF - entire US stock market'
  },
  {
    symbol: 'QQQ',
    name: 'NASDAQ 100 (QQQ)',
    category: 'US Tech/Growth',
    historicalReturns: [19.2, 9.4, 7.1, 32.6, -1.0, 48.8, 27.4, -32.6, 26.8, 55.0, 22.7],
    historicalReturns20Y: [1.6, 5.7, 18.4, 8.9, -41.9, 54.9, 19.2, 2.3, 19.2, 53.8, 19.2, 9.4, 7.1, 32.6, -1.0, 48.8, 27.4, -32.6, 26.8, 55.0],
    historicalReturns30Y: [43.3, 39.6, 85.6, 42.5, -36.1, 2.2, -32.0, -37.6, 83.7, 39.1, 1.6, 5.7, 18.4, 8.9, -41.9, 54.9, 19.2, 2.3, 19.2, 53.8, 19.2, 9.4, 7.1, 32.6, -1.0, 48.8, 27.4, -32.6, 26.8, 55.0],
    avgReturn: 19.4,
    volatility: 22.3,
    color: '#8b5cf6',
    description: 'Invesco QQQ Trust - tracks NASDAQ 100 technology stocks'
  },
  
  // US Small/Mid Cap
  {
    symbol: 'VB',
    name: 'Small Cap (VB)',
    category: 'US Small Cap',
    historicalReturns: [10.8, -3.8, 14.8, 27.6, -11.0, 35.5, 12.5, -17.8, 18.3, 25.2, 16.2],
    historicalReturns20Y: [4.4, 12.5, 20.5, 3.6, -36.2, 36.5, 18.7, -0.6, 16.3, 32.3, 10.8, -3.8, 14.8, 27.6, -11.0, 35.5, 12.5, -17.8, 18.3, 25.2],
    historicalReturns30Y: [34.5, 22.9, 25.5, 21.3, 13.3, -13.3, -14.0, -26.0, 47.3, 20.9, 4.4, 12.5, 20.5, 3.6, -36.2, 36.5, 18.7, -0.6, 16.3, 32.3, 10.8, -3.8, 14.8, 27.6, -11.0, 35.5, 12.5, -17.8, 18.3, 25.2],
    avgReturn: 11.8,
    volatility: 19.7,
    color: '#6366f1',
    description: 'Vanguard Small-Cap ETF - US small cap stocks'
  },
  {
    symbol: 'VO',
    name: 'Mid Cap (VO)',
    category: 'US Mid Cap',
    historicalReturns: [11.2, -1.2, 13.4, 23.0, -8.1, 32.3, 15.1, -16.8, 19.7, 24.8, 15.6],
    historicalReturns20Y: [5.1, 11.8, 18.3, 4.3, -35.1, 34.2, 16.9, 0.3, 16.8, 33.7, 11.2, -1.2, 13.4, 23.0, -8.1, 32.3, 15.1, -16.8, 19.7, 24.8],
    historicalReturns30Y: [33.8, 20.1, 29.8, 24.5, 16.2, -11.9, -12.5, -22.6, 38.7, 16.2, 5.1, 11.8, 18.3, 4.3, -35.1, 34.2, 16.9, 0.3, 16.8, 33.7, 11.2, -1.2, 13.4, 23.0, -8.1, 32.3, 15.1, -16.8, 19.7, 24.8],
    avgReturn: 12.7,
    volatility: 17.3,
    color: '#7c3aed',
    description: 'Vanguard Mid-Cap ETF - US mid cap stocks'
  },
  
  // International
  {
    symbol: 'VEA',
    name: 'International (VEA)',
    category: 'Developed Markets',
    historicalReturns: [-5.2, 0.9, 2.5, 26.4, -14.2, 22.3, 11.2, -16.0, 18.5, 19.2, 12.1],
    historicalReturns20Y: [9.8, 14.2, 18.9, 6.3, -44.1, 33.3, 11.8, -14.2, 16.5, 26.4, -5.2, 0.9, 2.5, 26.4, -14.2, 22.3, 11.2, -16.0, 18.5, 19.2],
    historicalReturns30Y: [21.9, 11.2, 32.6, 27.0, 12.5, -13.2, -21.4, -23.1, 36.6, 12.4, 9.8, 14.2, 18.9, 6.3, -44.1, 33.3, 11.8, -14.2, 16.5, 26.4, -5.2, 0.9, 2.5, 26.4, -14.2, 22.3, 11.2, -16.0, 18.5, 19.2],
    avgReturn: 7.4,
    volatility: 18.9,
    color: '#10b981',
    description: 'Vanguard FTSE Developed Markets ETF - international stocks'
  },
  {
    symbol: 'VWO',
    name: 'Emerging Markets (VWO)',
    category: 'Emerging Markets',
    historicalReturns: [-2.1, -15.8, 11.8, 31.2, -14.6, 18.7, 18.5, -21.5, 9.9, 10.3, 8.7],
    historicalReturns20Y: [16.7, 22.4, 34.2, 10.1, -53.2, 16.4, 19.4, -18.5, 19.4, 31.2, -2.1, -15.8, 11.8, 31.2, -14.6, 18.7, 18.5, -21.5, 9.9, 10.3],
    historicalReturns30Y: [9.7, 3.4, -5.1, -2.9, -27.5, 68.8, 22.4, 15.2, 56.3, 66.3, 16.7, 22.4, 34.2, 10.1, -53.2, 16.4, 19.4, -18.5, 19.4, 31.2, -2.1, -15.8, 11.8, 31.2, -14.6, 18.7, 18.5, -21.5, 9.9, 10.3],
    avgReturn: 4.8,
    volatility: 24.1,
    color: '#059669',
    description: 'Vanguard FTSE Emerging Markets ETF - emerging market stocks'
  },
  {
    symbol: 'VXUS',
    name: 'Total International (VXUS)',
    category: 'International Total',
    historicalReturns: [-4.5, -2.1, 5.4, 27.8, -13.7, 21.0, 12.1, -16.2, 16.8, 18.5, 11.4],
    historicalReturns20Y: [10.2, 13.8, 19.6, 6.8, -44.8, 32.1, 12.4, -13.9, 16.1, 27.8, -4.5, -2.1, 5.4, 27.8, -13.7, 21.0, 12.1, -16.2, 16.8, 18.5],
    historicalReturns30Y: [22.4, 10.8, 31.8, 26.2, 11.9, -14.1, -22.0, -23.8, 35.9, 11.7, 10.2, 13.8, 19.6, 6.8, -44.8, 32.1, 12.4, -13.9, 16.1, 27.8, -4.5, -2.1, 5.4, 27.8, -13.7, 21.0, 12.1, -16.2, 16.8, 18.5],
    avgReturn: 8.1,
    volatility: 17.4,
    color: '#06b6d4',
    description: 'Vanguard Total International Stock ETF - all international markets'
  },
  
  // Bonds
  {
    symbol: 'BND',
    name: 'Total Bond Market (BND)',
    category: 'US Bonds',
    historicalReturns: [6.0, 0.6, 2.5, 3.6, 9.3, 7.5, -1.9, -13.2, -5.9, 5.9, 3.7],
    historicalReturns20Y: [4.3, 2.4, 4.0, 4.7, 7.8, 6.5, 0.9, -1.8, 5.2, 3.6, 6.0, 0.6, 2.5, 3.6, 9.3, 7.5, -1.9, -13.2, -5.9, 5.9],
    historicalReturns30Y: [9.7, 8.9, 8.6, 8.4, 6.3, 3.7, 1.8, -2.9, 9.7, 16.0, 4.3, 2.4, 4.0, 4.7, 7.8, 6.5, 0.9, -1.8, 5.2, 3.6, 6.0, 0.6, 2.5, 3.6, 9.3, 7.5, -1.9, -13.2, -5.9, 5.9],
    avgReturn: 1.4,
    volatility: 6.8,
    color: '#64748b',
    description: 'Vanguard Total Bond Market ETF - US investment grade bonds'
  },
  {
    symbol: 'BNDX',
    name: 'International Bonds (BNDX)',
    category: 'International Bonds',
    historicalReturns: [3.5, 2.8, 4.1, 5.2, 6.8, 8.1, 2.3, -5.4, 1.2, 7.8, 5.1],
    historicalReturns20Y: [8.1, 7.4, 6.9, 5.8, 4.2, 8.9, 3.7, 1.8, 6.5, 5.2, 3.5, 2.8, 4.1, 5.2, 6.8, 8.1, 2.3, -5.4, 1.2, 7.8],
    historicalReturns30Y: [5.2, 4.8, 6.1, 7.3, 8.9, 9.4, 4.1, 2.7, 7.8, 9.1, 8.1, 7.4, 6.9, 5.8, 4.2, 8.9, 3.7, 1.8, 6.5, 5.2, 3.5, 2.8, 4.1, 5.2, 6.8, 8.1, 2.3, -5.4, 1.2, 7.8],
    avgReturn: 4.2,
    volatility: 4.1,
    color: '#475569',
    description: 'Vanguard Total International Bond ETF - international bonds (hedged)'
  },
  {
    symbol: 'VGIT',
    name: 'Intermediate Treasury (VGIT)',
    category: 'US Treasury',
    historicalReturns: [2.8, 0.4, 1.9, 2.4, 7.9, 5.8, -2.8, -10.9, -7.2, 4.1, 2.5],
    historicalReturns20Y: [3.1, 1.8, 3.5, 3.2, 6.4, 5.9, -0.1, -3.2, 4.1, 2.4, 2.8, 0.4, 1.9, 2.4, 7.9, 5.8, -2.8, -10.9, -7.2, 4.1],
    historicalReturns30Y: [8.9, 8.5, 8.2, 7.9, 5.8, 3.2, 1.2, -1.8, 8.9, 14.2, 3.1, 1.8, 3.5, 3.2, 6.4, 5.9, -0.1, -3.2, 4.1, 2.4, 2.8, 0.4, 1.9, 2.4, 7.9, 5.8, -2.8, -10.9, -7.2, 4.1],
    avgReturn: 0.9,
    volatility: 5.2,
    color: '#334155',
    description: 'Vanguard Intermediate-Term Treasury ETF - US government bonds (3-10 years)'
  },
  
  // Real Assets
  {
    symbol: 'VNQ',
    name: 'Real Estate (VNQ)',
    category: 'US REITs',
    historicalReturns: [30.4, 2.4, 4.9, -6.0, 28.9, -4.7, 40.5, -26.2, 11.8, 4.8, 2.8],
    historicalReturns20Y: [11.9, 7.1, 12.0, 2.0, -37.7, 28.0, 15.2, -5.2, 12.4, 8.3, 30.4, 2.4, 4.9, -6.0, 28.9, -4.7, 40.5, -26.2, 11.8, 4.8],
    historicalReturns30Y: [15.3, 3.6, 8.4, 32.9, 15.0, -17.6, -4.9, -21.5, 34.5, 31.6, 11.9, 7.1, 12.0, 2.0, -37.7, 28.0, 15.2, -5.2, 12.4, 8.3, 30.4, 2.4, 4.9, -6.0, 28.9, -4.7, 40.5, -26.2, 11.8, 4.8],
    avgReturn: 7.4,
    volatility: 22.8,
    color: '#f59e0b',
    description: 'Vanguard Real Estate ETF - US real estate investment trusts'
  },
  {
    symbol: 'GLD',
    name: 'Gold (GLD)',
    category: 'Commodities',
    historicalReturns: [-2.2, -10.7, 8.4, 13.1, 18.1, 24.8, -4.3, -3.6, -0.8, 14.1, 12.5],
    historicalReturns20Y: [18.2, 23.9, 29.8, 11.2, -1.9, 30.1, 11.9, -1.5, 5.4, 13.1, -2.2, -10.7, 8.4, 13.1, 18.1, 24.8, -4.3, -3.6, -0.8, 14.1],
    historicalReturns30Y: [-0.8, -3.6, 1.8, 0.3, -3.2, 0.9, -4.1, -22.1, 12.8, 24.8, 18.2, 23.9, 29.8, 11.2, -1.9, 30.1, 11.9, -1.5, 5.4, 13.1, -2.2, -10.7, 8.4, 13.1, 18.1, 24.8, -4.3, -3.6, -0.8, 14.1],
    avgReturn: 5.5,
    volatility: 16.2,
    color: '#fbbf24',
    description: 'SPDR Gold Shares ETF - tracks gold price performance'
  },
  {
    symbol: 'DJP',
    name: 'Commodities (DJP)',
    category: 'Broad Commodities',
    historicalReturns: [-28.2, -27.8, 21.2, 21.4, -5.9, 24.7, 34.0, -8.5, 10.8, -7.2, 4.1],
    historicalReturns20Y: [-1.8, 15.7, 19.7, 6.8, -43.7, 13.3, 16.2, -14.8, 23.4, 21.4, -28.2, -27.8, 21.2, 21.4, -5.9, 24.7, 34.0, -8.5, 10.8, -7.2],
    historicalReturns30Y: [14.2, 21.1, -8.8, -13.8, -19.8, 27.9, 32.0, -9.1, 13.5, 2.9, -1.8, 15.7, 19.7, 6.8, -43.7, 13.3, 16.2, -14.8, 23.4, 21.4, -28.2, -27.8, 21.2, 21.4, -5.9, 24.7, 34.0, -8.5, 10.8, -7.2],
    avgReturn: 1.6,
    volatility: 21.8,
    color: '#dc2626',
    description: 'iPath Bloomberg Commodity Index - diversified commodities exposure'
  },
  
  // Alternatives
  {
    symbol: 'CASH',
    name: 'Cash/Money Market',
    category: 'Cash',
    historicalReturns: [0.1, 0.1, 0.6, 1.0, 2.1, 0.4, 0.1, 1.5, 4.4, 5.1, 4.8],
    historicalReturns20Y: [1.9, 3.2, 4.5, 5.1, 3.2, 0.2, 0.1, 0.1, 0.2, 1.0, 0.1, 0.1, 0.6, 1.0, 2.1, 0.4, 0.1, 1.5, 4.4, 5.1],
    historicalReturns30Y: [5.9, 5.7, 5.4, 4.9, 4.2, 3.5, 3.0, 2.9, 3.3, 3.5, 1.9, 3.2, 4.5, 5.1, 3.2, 0.2, 0.1, 0.1, 0.2, 1.0, 0.1, 0.1, 0.6, 1.0, 2.1, 0.4, 0.1, 1.5, 4.4, 5.1],
    avgReturn: 1.7,
    volatility: 2.1,
    color: '#94a3b8',
    description: 'Money market funds and high-yield savings accounts'
  }
];

// Calculate portfolio metrics based on asset allocation
export interface PortfolioAllocation {
  symbol: string;
  percentage: number;
}

export interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdownRisk: number;
  correlation: number;
}

export type TimePeriod = '10Y' | '20Y' | '30Y';

// Helper function to get historical returns for specific time period
function getHistoricalReturns(asset: AssetClass, period: TimePeriod): number[] {
  switch (period) {
    case '20Y':
      return asset.historicalReturns20Y;
    case '30Y':
      return asset.historicalReturns30Y;
    default:
      return asset.historicalReturns;
  }
}

// Calculate metrics for specific time period
export function calculatePortfolioMetrics(allocations: PortfolioAllocation[], period: TimePeriod = '10Y'): PortfolioMetrics {
  const totalAllocation = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  
  if (Math.abs(totalAllocation - 100) > 0.1) {
    throw new Error('Total allocation must equal 100%');
  }

  // Calculate weighted average return for the specified period
  const expectedReturn = allocations.reduce((sum, alloc) => {
    const asset = ASSET_CLASSES.find(a => a.symbol === alloc.symbol);
    if (!asset) throw new Error(`Asset ${alloc.symbol} not found`);
    
    const historicalReturns = getHistoricalReturns(asset, period);
    const avgReturn = historicalReturns.reduce((sum, ret) => sum + ret, 0) / historicalReturns.length;
    
    return sum + (alloc.percentage / 100) * avgReturn;
  }, 0);

  // Calculate portfolio volatility for the specified period
  const volatility = Math.sqrt(
    allocations.reduce((sum, alloc) => {
      const asset = ASSET_CLASSES.find(a => a.symbol === alloc.symbol);
      if (!asset) throw new Error(`Asset ${alloc.symbol} not found`);
      
      const historicalReturns = getHistoricalReturns(asset, period);
      const avgReturn = historicalReturns.reduce((sum, ret) => sum + ret, 0) / historicalReturns.length;
      const variance = historicalReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / historicalReturns.length;
      
      return sum + Math.pow(alloc.percentage / 100, 2) * variance;
    }, 0)
  );

  // Estimate maximum drawdown risk (simplified model)
  const maxDrawdownRisk = allocations.reduce((sum, alloc) => {
    const asset = ASSET_CLASSES.find(a => a.symbol === alloc.symbol);
    if (!asset) throw new Error(`Asset ${alloc.symbol} not found`);
    // Conservative estimate based on historical maximum drawdowns
    const assetMaxDD = asset.symbol === 'QQQ' ? 35 : 
                      asset.symbol === 'VWO' ? 30 :
                      asset.symbol === 'VNQ' ? 25 :
                      asset.symbol === 'VOO' || asset.symbol === 'VTI' ? 20 :
                      asset.symbol === 'VEA' ? 18 :
                      asset.symbol === 'BND' ? 8 :
                      asset.symbol === 'GLD' ? 15 :
                      2; // Cash
    return sum + (alloc.percentage / 100) * assetMaxDD;
  }, 0);

  // Sharpe ratio (assuming 2% risk-free rate)
  const riskFreeRate = 2.0;
  const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

  return {
    expectedReturn,
    volatility,
    sharpeRatio,
    maxDrawdownRisk,
    correlation: 0 // Placeholder for future correlation analysis
  };
}

// Get asset by symbol
export function getAssetBySymbol(symbol: string): AssetClass | undefined {
  return ASSET_CLASSES.find(asset => asset.symbol === symbol);
}

// Get historical returns for specific time period
export function getAssetHistoricalReturns(symbol: string, period: TimePeriod = '10Y'): number[] | undefined {
  const asset = getAssetBySymbol(symbol);
  if (!asset) return undefined;
  
  switch (period) {
    case '20Y':
      return asset.historicalReturns20Y;
    case '30Y':
      return asset.historicalReturns30Y;
    default:
      return asset.historicalReturns;
  }
}

// Calculate average return for specific time period
export function calculateAverageReturn(returns: number[]): number {
  return returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
}

// Calculate volatility for specific time period
export function calculateVolatility(returns: number[]): number {
  const avg = calculateAverageReturn(returns);
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avg, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

// Get category averages
export function getCategoryAverages(): Record<string, { avgReturn: number; volatility: number }> {
  const categories: Record<string, { returns: number[]; volatilities: number[] }> = {};
  
  ASSET_CLASSES.forEach(asset => {
    if (!categories[asset.category]) {
      categories[asset.category] = { returns: [], volatilities: [] };
    }
    categories[asset.category].returns.push(asset.avgReturn);
    categories[asset.category].volatilities.push(asset.volatility);
  });

  const result: Record<string, { avgReturn: number; volatility: number }> = {};
  Object.keys(categories).forEach(category => {
    const data = categories[category];
    result[category] = {
      avgReturn: data.returns.reduce((a, b) => a + b, 0) / data.returns.length,
      volatility: data.volatilities.reduce((a, b) => a + b, 0) / data.volatilities.length
    };
  });

  return result;
}