#!/usr/bin/env node

/**
 * Runware API Cost Estimation
 * 
 * Runware pricing (as of typical AI image generation services):
 * - Standard quality (512x512): ~$0.02-0.04 per image
 * - High quality (1024x1024): ~$0.08-0.12 per image
 * - Ultra quality (2048x2048): ~$0.20-0.30 per image
 * 
 * Note: Actual pricing depends on your Runware plan
 */

const images = [
  // Problem section icons (3 images)
  { name: 'problem-1', description: '広告費問題 - グラフ下降、お金が飛んでいく', size: '512x512' },
  { name: 'problem-2', description: 'AIツール問題 - 混乱したロボット、複雑な画面', size: '512x512' },
  { name: 'problem-3', description: 'データ分析問題 - 迷路のようなチャート、困惑した人', size: '512x512' },
  
  // 8 Instincts icons (8 images)
  { name: 'instinct-1', description: '生存本能 - 盾、守護、安全の象徴', size: '512x512' },
  { name: 'instinct-2', description: '食欲 - 満足感、豊かさ、充実の象徴', size: '512x512' },
  { name: 'instinct-3', description: '性的本能 - 魅力、美、輝きの象徴', size: '512x512' },
  { name: 'instinct-4', description: '危険回避本能 - 警戒、防御、慎重さの象徴', size: '512x512' },
  { name: 'instinct-5', description: '快適性追求 - リラックス、効率、楽さの象徴', size: '512x512' },
  { name: 'instinct-6', description: '優越本能 - 王冠、頂点、特別感の象徴', size: '512x512' },
  { name: 'instinct-7', description: '集団帰属本能 - つながり、仲間、絆の象徴', size: '512x512' },
  { name: 'instinct-8', description: '承認欲求 - 称賛、認知、達成の象徴', size: '512x512' },
  
  // Additional graphics (2 images)
  { name: 'hero-neural', description: 'ニューラルネットワーク、AI脳、紫と青のグラデーション', size: '1024x1024' },
  { name: 'performance', description: '成長グラフ、上昇矢印、成功の象徴', size: '512x512' }
];

// Cost estimation
const costPerImage = {
  '512x512': 0.03,    // Average cost
  '1024x1024': 0.10,  // Average cost
  '2048x2048': 0.25   // Average cost
};

console.log('🎨 Runware API 画像生成コスト見積もり\n');
console.log('=================================');
console.log(`📊 生成予定画像数: ${images.length}枚\n`);

let totalCost = 0;
const breakdown = {};

images.forEach((img, index) => {
  const cost = costPerImage[img.size] || 0.03;
  totalCost += cost;
  
  if (!breakdown[img.size]) {
    breakdown[img.size] = { count: 0, cost: 0 };
  }
  breakdown[img.size].count++;
  breakdown[img.size].cost += cost;
  
  console.log(`${index + 1}. ${img.name} (${img.size})`);
  console.log(`   📝 ${img.description}`);
  console.log(`   💰 推定コスト: $${cost.toFixed(2)}\n`);
});

console.log('=================================');
console.log('📈 サイズ別コスト内訳:\n');

Object.entries(breakdown).forEach(([size, data]) => {
  console.log(`${size}: ${data.count}枚 = $${data.cost.toFixed(2)}`);
});

console.log('\n=================================');
console.log(`💰 合計推定コスト: $${totalCost.toFixed(2)} (約${Math.ceil(totalCost * 150)}円)`);
console.log('=================================\n');

console.log('📌 注意事項:');
console.log('- 上記は一般的なAI画像生成サービスの価格を基にした推定値です');
console.log('- 実際の価格はRunwareのプランによって異なります');
console.log('- 生成失敗時の再生成分は含まれていません');
console.log('- 高品質設定やスタイル指定により価格が変動する可能性があります\n');

console.log('🎯 推奨事項:');
console.log('- アイコンは512x512で十分な品質が得られます');
console.log('- ヒーロー画像のみ1024x1024での生成を推奨');
console.log('- 必要に応じて段階的に生成することも可能です');

// Export for use in generation script
module.exports = { images, costPerImage, totalCost };