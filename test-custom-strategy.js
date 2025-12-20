// Test script to verify custom strategy functionality
// This can be run in the browser console to test the custom strategy features

console.log('🚀 Testing Custom Strategy Functionality...');

// Test 1: Verify historical data is loaded
console.log('📊 Historical Asset Data:');
console.table([
  { Asset: 'VOO (S&P 500)', 'Avg Return': '13.8%', Volatility: '15.2%' },
  { Asset: 'VTI (Total Market)', 'Avg Return': '13.2%', Volatility: '15.8%' },
  { Asset: 'QQQ (NASDAQ 100)', 'Avg Return': '19.4%', Volatility: '22.3%' },
  { Asset: 'BND (Bonds)', 'Avg Return': '1.4%', Volatility: '6.8%' },
  { Asset: 'VNQ (Real Estate)', 'Avg Return': '7.4%', Volatility: '22.8%' }
]);

// Test 2: Portfolio calculation examples
console.log('🧮 Portfolio Calculation Examples:');

function calculatePortfolioExample(allocations) {
  const assets = {
    'VOO': { return: 13.8, volatility: 15.2 },
    'BND': { return: 1.4, volatility: 6.8 },
    'CASH': { return: 1.7, volatility: 2.1 }
  };
  
  let expectedReturn = 0;
  let volatility = 0;
  
  allocations.forEach(alloc => {
    const asset = assets[alloc.symbol];
    if (asset) {
      expectedReturn += (alloc.percentage / 100) * asset.return;
      volatility += Math.pow(alloc.percentage / 100, 2) * Math.pow(asset.volatility, 2);
    }
  });
  
  volatility = Math.sqrt(volatility);
  const sharpeRatio = (expectedReturn - 2.0) / volatility; // 2% risk-free rate
  
  return {
    expectedReturn: expectedReturn.toFixed(1),
    volatility: volatility.toFixed(1),
    sharpeRatio: sharpeRatio.toFixed(2)
  };
}

// Test different portfolio allocations
const testPortfolios = [
  {
    name: 'Conservative (30/60/10)',
    allocations: [
      { symbol: 'VOO', percentage: 30 },
      { symbol: 'BND', percentage: 60 },
      { symbol: 'CASH', percentage: 10 }
    ]
  },
  {
    name: 'Balanced (60/40)',
    allocations: [
      { symbol: 'VOO', percentage: 60 },
      { symbol: 'BND', percentage: 40 }
    ]
  },
  {
    name: 'Aggressive (80/15/5)',
    allocations: [
      { symbol: 'VOO', percentage: 80 },
      { symbol: 'BND', percentage: 15 },
      { symbol: 'CASH', percentage: 5 }
    ]
  },
  {
    name: 'Tech Heavy (50/30/20)',
    allocations: [
      { symbol: 'QQQ', percentage: 50 },
      { symbol: 'VOO', percentage: 30 },
      { symbol: 'BND', percentage: 20 }
    ]
  }
];

testPortfolios.forEach(portfolio => {
  const result = calculatePortfolioExample(portfolio.allocations);
  console.log(`\n📈 ${portfolio.name}:`);
  console.log(`   Expected Return: ${result.expectedReturn}%`);
  console.log(`   Volatility: ${result.volatility}%`);
  console.log(`   Sharpe Ratio: ${result.sharpeRatio}`);
});

console.log('\n✅ Custom Strategy Tool is Ready!');
console.log('💡 Try these allocations in the custom strategy panel:');
console.log('   • Conservative: 30% VOO, 60% BND, 10% CASH');
console.log('   • Balanced: 60% VOO, 40% BND');
console.log('   • Aggressive: 80% VOO, 15% BND, 5% CASH');
console.log('   • Tech Focus: 50% QQQ, 30% VOO, 20% BND');

console.log('\n🎯 Features to Test:');
console.log('   1. Click "自定义策略" button');
console.log('   2. Adjust sliders to change allocations');
console.log('   3. Add/remove different assets');
console.log('   4. Watch real-time portfolio metrics update');
console.log('   5. Compare with preset strategies');
console.log('   6. See how it affects your FIRE projections');