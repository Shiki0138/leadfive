#!/usr/bin/env node

/**
 * プレミアムブログシステム監視ダッシュボード
 * リアルタイムでブログ投稿システムのパフォーマンスを監視
 */

const fs = require('fs').promises;
const path = require('path');
const http = require('http');

// ダッシュボード設定
const DASHBOARD_CONFIG = {
  port: 3001,
  updateInterval: 5000, // 5秒間隔
  logRetentionDays: 30,
  alertThresholds: {
    qualityScore: 90,
    generationTime: 300, // 5分
    errorRate: 0.1 // 10%
  }
};

class BlogDashboard {
  constructor() {
    this.stats = {
      totalArticles: 0,
      todayArticles: 0,
      averageQuality: 0,
      successRate: 0,
      lastGeneration: null,
      systemStatus: 'unknown'
    };
    
    this.recentGenerations = [];
    this.alerts = [];
    this.performance = {
      qualityTrend: [],
      generationTimes: [],
      errorLog: []
    };
  }
  
  async initialize() {
    console.log('🚀 ブログダッシュボード初期化中...');
    await this.loadData();
    await this.startServer();
    this.startMonitoring();
  }
  
  async loadData() {
    try {
      // 生成ログ読み込み
      const logPath = path.join(__dirname, '../logs/premium-generations.json');
      const logData = await fs.readFile(logPath, 'utf8');
      const generations = JSON.parse(logData);
      
      this.calculateStats(generations);
      this.recentGenerations = generations.slice(-20);
      
      // 自動投稿ログ読み込み
      const autoLogPath = path.join(__dirname, '../logs/auto-posting.json');
      try {
        const autoLogData = await fs.readFile(autoLogPath, 'utf8');
        const autoPosts = JSON.parse(autoLogData);
        this.updateAutoPostingStats(autoPosts);
      } catch (e) {
        console.log('📝 自動投稿ログが見つかりません（初回実行時は正常）');
      }
      
    } catch (error) {
      console.log('⚠️ データ読み込みエラー:', error.message);
      this.stats.systemStatus = 'error';
    }
  }
  
  calculateStats(generations) {
    if (generations.length === 0) {
      this.stats.systemStatus = 'no_data';
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const todayGenerations = generations.filter(g => 
      g.timestamp.startsWith(today)
    );
    
    this.stats.totalArticles = generations.length;
    this.stats.todayArticles = todayGenerations.length;
    this.stats.averageQuality = Math.round(
      generations.reduce((sum, g) => sum + (g.qualityScore || 0), 0) / generations.length
    );
    
    const successful = generations.filter(g => g.qualityScore >= 90).length;
    this.stats.successRate = Math.round((successful / generations.length) * 100);
    this.stats.lastGeneration = generations[generations.length - 1];
    this.stats.systemStatus = 'active';
    
    // パフォーマンストレンド計算
    this.performance.qualityTrend = generations.slice(-30).map(g => ({
      date: g.timestamp.split('T')[0],
      quality: g.qualityScore || 0
    }));
  }
  
  updateAutoPostingStats(autoPosts) {
    const recent = autoPosts.slice(-10);
    const errors = recent.filter(p => !p.success);
    
    if (errors.length > 0) {
      this.alerts.push({
        type: 'error',
        message: `自動投稿エラーが${errors.length}件発生`,
        timestamp: new Date().toISOString(),
        severity: errors.length > 3 ? 'high' : 'medium'
      });
    }
  }
  
  async startServer() {
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      
      if (req.url === '/api/stats') {
        res.writeHead(200);
        res.end(JSON.stringify({
          stats: this.stats,
          recentGenerations: this.recentGenerations.slice(-10),
          alerts: this.alerts.slice(-5),
          performance: this.performance,
          lastUpdated: new Date().toISOString()
        }));
      } else if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(this.generateDashboardHTML());
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });
    
    server.listen(DASHBOARD_CONFIG.port, () => {
      console.log(`📊 ダッシュボード起動: http://localhost:${DASHBOARD_CONFIG.port}`);
    });
  }
  
  startMonitoring() {
    setInterval(async () => {
      await this.loadData();
      this.checkAlerts();
    }, DASHBOARD_CONFIG.updateInterval);
    
    console.log('👀 リアルタイム監視開始');
  }
  
  checkAlerts() {
    const now = new Date();
    
    // 品質スコアアラート
    if (this.stats.averageQuality < DASHBOARD_CONFIG.alertThresholds.qualityScore) {
      this.addAlert('warning', `品質スコアが低下: ${this.stats.averageQuality}/100`, 'medium');
    }
    
    // 成功率アラート
    if (this.stats.successRate < 80) {
      this.addAlert('error', `成功率が低下: ${this.stats.successRate}%`, 'high');
    }
    
    // 投稿頻度チェック
    if (this.stats.lastGeneration) {
      const lastGen = new Date(this.stats.lastGeneration.timestamp);
      const hoursSince = (now - lastGen) / (1000 * 60 * 60);
      
      if (hoursSince > 25) { // 25時間以上投稿なし
        this.addAlert('warning', `投稿が停止: ${Math.floor(hoursSince)}時間前`, 'high');
      }
    }
  }
  
  addAlert(type, message, severity) {
    const exists = this.alerts.some(alert => alert.message === message);
    if (!exists) {
      this.alerts.push({
        type,
        message,
        timestamp: new Date().toISOString(),
        severity
      });
      
      // アラート数制限
      if (this.alerts.length > 50) {
        this.alerts = this.alerts.slice(-50);
      }
    }
  }
  
  generateDashboardHTML() {
    const statusColor = {
      'active': '#10b981',
      'error': '#ef4444', 
      'no_data': '#f59e0b',
      'unknown': '#6b7280'
    };
    
    return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LeadFive ブログシステム ダッシュボード</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      padding: 20px;
    }
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #6366f1, #ec4899);
      border-radius: 15px;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 5px;
    }
    .header .status {
      font-size: 1.1rem;
      opacity: 0.9;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 10px 0;
    }
    .stat-label {
      color: #cbd5e1;
      font-size: 0.9rem;
    }
    .recent-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .section-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
    }
    .section-title {
      font-size: 1.3rem;
      margin-bottom: 15px;
      color: #f1f5f9;
    }
    .generation-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin: 8px 0;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .quality-score {
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 0.8rem;
    }
    .quality-excellent { background: #10b981; color: white; }
    .quality-good { background: #f59e0b; color: white; }
    .quality-poor { background: #ef4444; color: white; }
    .alert-item {
      display: flex;
      align-items: center;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .alert-error { background: rgba(239, 68, 68, 0.2); border-left: 4px solid #ef4444; }
    .alert-warning { background: rgba(245, 158, 11, 0.2); border-left: 4px solid #f59e0b; }
    .alert-info { background: rgba(59, 130, 246, 0.2); border-left: 4px solid #3b82f6; }
    .refresh-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #6366f1;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
    }
    .refresh-btn:hover {
      background: #5855eb;
    }
    @media (max-width: 768px) {
      .recent-section { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <h1>🚀 LeadFive ブログシステム</h1>
      <div class="status">システム状態: <span style="color: ${statusColor[this.stats.systemStatus]}">${this.getStatusText()}</span></div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color: #10b981">${this.stats.totalArticles}</div>
        <div class="stat-label">総記事数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #6366f1">${this.stats.todayArticles}</div>
        <div class="stat-label">今日の記事</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: ${this.stats.averageQuality >= 90 ? '#10b981' : '#f59e0b'}">${this.stats.averageQuality}</div>
        <div class="stat-label">平均品質スコア</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: ${this.stats.successRate >= 80 ? '#10b981' : '#ef4444'}">${this.stats.successRate}%</div>
        <div class="stat-label">成功率</div>
      </div>
    </div>
    
    <div class="recent-section">
      <div class="section-card">
        <div class="section-title">🎯 最近の記事生成</div>
        <div id="recent-generations">
          ${this.recentGenerations.slice(-5).reverse().map(gen => `
            <div class="generation-item">
              <div>
                <div style="font-weight: bold;">${gen.keyword}</div>
                <div style="color: #cbd5e1; font-size: 0.8rem;">${gen.filename}</div>
              </div>
              <div class="quality-score ${this.getQualityClass(gen.qualityScore || 0)}">
                ${gen.qualityScore || 'N/A'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section-card">
        <div class="section-title">⚠️ システムアラート</div>
        <div id="alerts">
          ${this.alerts.slice(-5).reverse().map(alert => `
            <div class="alert-item alert-${alert.type}">
              <div>
                <div>${alert.message}</div>
                <div style="color: #cbd5e1; font-size: 0.8rem;">
                  ${new Date(alert.timestamp).toLocaleString('ja-JP')}
                </div>
              </div>
            </div>
          `).join('')}
          ${this.alerts.length === 0 ? '<div style="text-align: center; color: #10b981; padding: 20px;">✅ アラートはありません</div>' : ''}
        </div>
      </div>
    </div>
  </div>
  
  <button class="refresh-btn" onclick="location.reload()">🔄 更新</button>
  
  <script>
    // 自動リフレッシュ
    setInterval(() => {
      fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
          console.log('ダッシュボード更新:', data.lastUpdated);
        })
        .catch(error => console.error('更新エラー:', error));
    }, 30000); // 30秒間隔
  </script>
</body>
</html>`;
  }
  
  getStatusText() {
    const statusMap = {
      'active': '正常稼働',
      'error': 'エラー',
      'no_data': 'データなし',
      'unknown': '不明'
    };
    return statusMap[this.stats.systemStatus] || '不明';
  }
  
  getQualityClass(score) {
    if (score >= 90) return 'quality-excellent';
    if (score >= 75) return 'quality-good';
    return 'quality-poor';
  }
}

// 実行
if (require.main === module) {
  const dashboard = new BlogDashboard();
  dashboard.initialize().catch(console.error);
}

module.exports = { BlogDashboard };