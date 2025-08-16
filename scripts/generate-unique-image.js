#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * タイトルと日付からユニークな画像を生成
 */
async function generateUniqueImage(title, date, outputPath) {
  const width = 1200;
  const height = 630;
  
  // タイトルと日付からユニークなシード値を生成
  const seed = crypto.createHash('md5').update(`${title}-${date}`).digest('hex');
  
  // シード値から色を生成
  const hue1 = (parseInt(seed.substring(0, 2), 16) / 255) * 360;
  const hue2 = (parseInt(seed.substring(2, 4), 16) / 255) * 360;
  const pattern = parseInt(seed.substring(4, 5), 16) % 4;
  
  // グラデーションパターンを選択
  let gradientSvg;
  switch (pattern) {
    case 0: // 対角線グラデーション
      gradientSvg = `
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(${hue1}, 70%, 50%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${hue2}, 70%, 40%);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
      `;
      break;
    case 1: // 放射状グラデーション
      gradientSvg = `
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:hsl(${hue1}, 70%, 60%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${hue2}, 70%, 30%);stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
      `;
      break;
    case 2: // 波形パターン
      gradientSvg = `
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(${hue1}, 70%, 50%);stop-opacity:1" />
            <stop offset="50%" style="stop-color:hsl(${hue2}, 70%, 45%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${hue1}, 70%, 40%);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
        <path d="M0,${height/2} Q${width/4},${height/3} ${width/2},${height/2} T${width},${height/2}" 
              stroke="rgba(255,255,255,0.2)" stroke-width="3" fill="none" />
      `;
      break;
    default: // 幾何学模様
      gradientSvg = `
        <defs>
          <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="hsl(${hue1}, 70%, 45%)" />
            <circle cx="50" cy="50" r="40" fill="hsl(${hue2}, 70%, 50%)" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#pattern)" />
      `;
  }
  
  // SVGの完成
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${gradientSvg}
      
      <!-- オーバーレイ -->
      <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.3)" />
      
      <!-- タイトルテキスト -->
      <text x="${width/2}" y="${height/2 - 30}" 
            font-family="Arial, sans-serif" 
            font-size="48" 
            font-weight="bold" 
            fill="white" 
            text-anchor="middle">
        ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
      </text>
      
      <!-- 日付 -->
      <text x="${width/2}" y="${height/2 + 30}" 
            font-family="Arial, sans-serif" 
            font-size="24" 
            fill="rgba(255,255,255,0.8)" 
            text-anchor="middle">
        ${date}
      </text>
      
      <!-- 装飾要素 -->
      <rect x="50" y="${height - 100}" width="200" height="4" fill="rgba(255,255,255,0.6)" />
      <text x="50" y="${height - 50}" 
            font-family="Arial, sans-serif" 
            font-size="18" 
            fill="rgba(255,255,255,0.7)">
        LeadFive Blog
      </text>
    </svg>
  `;
  
  // SVGをPNGに変換して保存
  try {
    const buffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
      
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, buffer);
    
    console.log(`✅ ユニーク画像を生成しました: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('画像生成エラー:', error);
    return false;
  }
}

// コマンドライン実行
if (require.main === module) {
  const title = process.argv[2] || 'サンプルタイトル';
  const date = process.argv[3] || new Date().toISOString().split('T')[0];
  const outputPath = process.argv[4] || path.join(__dirname, '../assets/images/blog', `${date}-featured.jpg`);
  
  generateUniqueImage(title, date, outputPath).catch(console.error);
}

module.exports = { generateUniqueImage };