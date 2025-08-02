---
layout: default
title: 顧客心理データ分析
icon: 📊
color: from-synapse-blue to-insight-cyan
story: 「なぜ売れないのか分からない」美容室オーナー
detail: データ分析で客単価38%向上、リピート率67%改善
features:
  - title: 購買行動予測AI
    description: 顧客の次の行動を高精度で予測
    metric: 予測精度 187%向上
  - title: 8つの顧客タイプ分析
    description: 心理特性に基づく顧客セグメンテーション
    metric: 8タイプ自動識別
  - title: LTV最大化戦略
    description: 顧客生涯価値を科学的に向上
    metric: LTV 45%向上
---

<section class="service-detail-hero">
  <div class="container">
    <h1 class="service-title">{{ page.title }}</h1>
    <p class="service-subtitle">{{ page.story }}</p>
  </div>
</section>

<section class="service-overview">
  <div class="container">
    <div class="overview-content glass-card">
      <h2>データが語る、顧客の本音</h2>
      <p class="lead">
        「なぜ売れないのか分からない...」<br>
        その答えは、データの中にあります。
      </p>
      <p>
        私たちは、AIと心理学を組み合わせた独自の分析手法で、
        顧客の行動パターンと心理を可視化。売上向上への具体的な道筋を示します。
      </p>
    </div>
  </div>
</section>

<section class="service-features">
  <div class="container">
    <h2 class="section-title">サービスの特徴</h2>
    
    <div class="features-grid">
      {% for feature in page.features %}
      <div class="feature-card glass-card">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
        <div class="metric">{{ feature.metric }}</div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="service-process">
  <div class="container">
    <h2 class="section-title">分析プロセス</h2>
    
    <div class="process-timeline">
      <div class="process-step">
        <div class="step-number">1</div>
        <h3>データ収集・統合</h3>
        <p>既存の顧客データや行動履歴を統合分析</p>
        <span class="duration">1週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">2</div>
        <h3>心理プロファイリング</h3>
        <p>8つの本能に基づく顧客心理の深層分析</p>
        <span class="duration">2週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">3</div>
        <h3>予測モデル構築</h3>
        <p>AIによる行動予測モデルの開発・実装</p>
        <span class="duration">2-3週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">4</div>
        <h3>施策実行・最適化</h3>
        <p>データに基づく施策の実行と継続的改善</p>
        <span class="duration">継続</span>
      </div>
    </div>
  </div>
</section>

<section class="service-results">
  <div class="container">
    <h2 class="section-title">導入実績</h2>
    
    <div class="results-grid">
      <div class="result-card glass-card">
        <h3>美容室チェーン C社</h3>
        <p class="challenge">課題：リピート率が低く、新規顧客依存の経営</p>
        <p class="solution">施策：顧客タイプ別のパーソナライズ施策</p>
        <div class="metrics">
          <div class="metric-item">
            <span class="value">67%</span>
            <span class="label">リピート率改善</span>
          </div>
          <div class="metric-item">
            <span class="value">38%</span>
            <span class="label">客単価向上</span>
          </div>
        </div>
      </div>
      
      <div class="result-card glass-card">
        <h3>アパレルEC D社</h3>
        <p class="challenge">課題：カゴ落ち率が高く、購買転換率が低迷</p>
        <p class="solution">施策：行動予測に基づくタイミング最適化</p>
        <div class="metrics">
          <div class="metric-item">
            <span class="value">423%</span>
            <span class="label">売上向上</span>
          </div>
          <div class="metric-item">
            <span class="value">82%</span>
            <span class="label">カゴ落ち削減</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="service-pricing">
  <div class="container">
    <h2 class="section-title">料金プラン</h2>
    
    <div class="pricing-note glass-card">
      <p>
        データ量や分析範囲に応じて、最適なプランをご提案します。<br>
        まずは無料のデータ診断で、改善可能性をご確認ください。
      </p>
    </div>
    
    <div class="pricing-options">
      <div class="pricing-card glass-card">
        <h3>ベーシック分析</h3>
        <p>初めてのデータ分析に</p>
        <ul>
          <li>✓ 基本的な顧客分析</li>
          <li>✓ 簡易レポート</li>
          <li>✓ 月次更新</li>
        </ul>
        <div class="price">月額 20万円〜</div>
      </div>
      
      <div class="pricing-card glass-card featured">
        <div class="badge">おすすめ</div>
        <h3>アドバンスド分析</h3>
        <p>本格的な顧客理解に</p>
        <ul>
          <li>✓ 8タイプ心理分析</li>
          <li>✓ AI予測モデル</li>
          <li>✓ リアルタイム更新</li>
          <li>✓ 施策提案付き</li>
        </ul>
        <div class="price">月額 60万円〜</div>
      </div>
      
      <div class="pricing-card glass-card">
        <h3>フルサポート</h3>
        <p>データ活用の完全支援</p>
        <ul>
          <li>✓ 全データ統合分析</li>
          <li>✓ 専任アナリスト</li>
          <li>✓ カスタムAI開発</li>
          <li>✓ 実行支援込み</li>
        </ul>
        <div class="price">個別見積もり</div>
      </div>
    </div>
  </div>
</section>

<section class="service-cta">
  <div class="container">
    <div class="cta-content glass-card">
      <h2>データに隠された売上の可能性を発見しませんか？</h2>
      <p>
        無料のデータ診断で、あなたのビジネスに眠る成長機会を可視化します。<br>
        具体的な改善ポイントと期待効果をレポートでお渡しします。
      </p>
      <button class="btn btn-primary btn-large" onclick="openContactForm()">
        無料データ診断を申し込む
      </button>
    </div>
  </div>
</section>

<style>
.service-detail-hero {
  padding: 8rem 0 4rem;
  text-align: center;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.1), transparent);
}

.service-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-subtitle {
  font-size: 1.5rem;
  color: #d1d5db;
}

.service-overview {
  padding: 4rem 0;
}

.overview-content {
  padding: 3rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.overview-content .lead {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 300;
}

.service-features {
  padding: 4rem 0;
  background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  padding: 2rem;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.feature-card .metric {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
}

.service-process {
  padding: 4rem 0;
}

.process-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
}

.process-step {
  text-align: center;
  position: relative;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1rem;
}

.process-step h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.process-step p {
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.duration {
  font-size: 0.875rem;
  color: #9ca3af;
}

.service-results {
  padding: 4rem 0;
  background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.05), transparent);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.result-card {
  padding: 2rem;
}

.result-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.challenge {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.solution {
  color: #22c55e;
  margin-bottom: 1.5rem;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.metric-item {
  text-align: center;
}

.metric-item .value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-item .label {
  font-size: 0.875rem;
  color: #9ca3af;
}

.service-pricing {
  padding: 4rem 0;
}

.pricing-note {
  text-align: center;
  padding: 2rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.pricing-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.pricing-card {
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
}

.pricing-card.featured {
  border: 2px solid #3b82f6;
}

.badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #fff;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.pricing-card p {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.pricing-card ul {
  list-style: none;
  margin-bottom: 2rem;
  text-align: left;
}

.pricing-card li {
  padding: 0.5rem 0;
  color: #d1d5db;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.service-cta {
  padding: 4rem 0;
}

.cta-content {
  text-align: center;
  padding: 4rem;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.cta-content p {
  color: #d1d5db;
  margin-bottom: 2rem;
  font-size: 1.125rem;
}
</style>