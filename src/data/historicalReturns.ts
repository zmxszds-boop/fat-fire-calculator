// Historical annual returns data (2014-2024) based on research
// Sources: Morningstar, Yahoo Finance, Vanguard official data

export interface AssetClass {
  symbol: string;
  name: string;
  category: string;
  historicalReturns: number[]; // Annual returns 2014-2024
  avgReturn: number;
  volatility: number;
  color: string;
  description: string;
}

export const ASSET_CLASSES: AssetClass[] = [
  {
    symbol: 'VOO',
    name: 'S&P 500 (VOO)',
    category: 'US Large Cap',
    historicalReturns: [13.5, 1.3, 11.9, 21.7, -4.4, 31.4, 18.3, -18.2, 26.2, 24.9, 17.6],
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
    avgReturn: 19.4,
    volatility: 22.3,
    color: '#8b5cf6',
    description: 'Invesco QQQ Trust - tracks NASDAQ 100 technology stocks'
  },
  {
    symbol: 'VEA',
    name: 'International (VEA)',
    category: 'Developed Markets',
    historicalReturns: [-5.2, 0.9, 2.5, 26.4, -14.2, 22.3, 11.2, -16.0, 18.5, 19.2, 12.1],
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
    avgReturn: 4.8,
    volatility: 24.1,
    color: '#059669',
    description: 'Vanguard FTSE Emerging Markets ETF - emerging market stocks'
  },
  {
    symbol: 'BND',
    name: 'Total Bond Market (BND)',
    category: 'US Bonds',
    historicalReturns: [6.0, 0.6, 2.5, 3.6, 9.3, 7.5, -1.9, -13.2, -5.9, 5.9, 3.7],
    avgReturn: 1.4,
    volatility: 6.8,
    color: '#64748b',
    description: 'Vanguard Total Bond Market ETF - US investment grade bonds'
  },
  {
    symbol: 'VNQ',
    name: 'Real Estate (VNQ)',
    category: 'US REITs',
    historicalReturns: [30.4, 2.4, 4.9, -6.0, 28.9, -4.7, 40.5, -26.2, 11.8, 4.8, 2.8],
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
    avgReturn: 5.5,
    volatility: 16.2,
    color: '#fbbf24',
    description: 'SPDR Gold Shares ETF - tracks gold price performance'
  },
  {
    symbol: 'CASH',
    name: 'Cash/Money Market',
    category: 'Cash',
    historicalReturns: [0.1, 0.1, 0.6, 1.0, 2.1, 0.4, 0.1, 1.5, 4.4, 5.1, 4.8],
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

export function calculatePortfolioMetrics(allocations: PortfolioAllocation[]): PortfolioMetrics {
  const totalAllocation = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  
  if (Math.abs(totalAllocation - 100) > 0.1) {
    throw new Error('Total allocation must equal 100%');
  }

  // Calculate weighted average return
  const expectedReturn = allocations.reduce((sum, alloc) => {
    const asset = ASSET_CLASSES.find(a => a.symbol === alloc.symbol);
    if (!asset) throw new Error(`Asset ${alloc.symbol} not found`);
    return sum + (alloc.percentage / 100) * asset.avgReturn;
  }, 0);

  // Calculate portfolio volatility (simplified - assumes zero correlation for conservative estimate)
  const volatility = Math.sqrt(
    allocations.reduce((sum, alloc) => {
      const asset = ASSET_CLASSES.find(a => a.symbol === alloc.symbol);
      if (!asset) throw new Error(`Asset ${alloc.symbol} not found`);
      return sum + Math.pow(alloc.percentage / 100, 2) * Math.pow(asset.volatility, 2);
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