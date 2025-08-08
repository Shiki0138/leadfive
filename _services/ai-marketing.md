---
layout: default
title: AI自動化マーケティング
icon: 🤖
color: from-neural-purple to-purple-700
story: マーケティングの全てをAIで自動化し、成果を最大化
detail: 広告運用からコンテンツ作成まで、AIが24時間働きます。
features:
  - title: Facebook/Google広告最適化
    description: 8つの本能に訴求するクリエイティブ設計
    metric: CTR改善率 平均267%
  - title: ブログ記事自動作成システム
    description: SEO最適化された記事を毎日自動生成・投稿
    metric: 平均SEO流入 380%向上
  - title: AI顧客データ分析
    description: 顧客行動を分析し、最適なアプローチを自動提案
    metric: 顧客単価 平均45%向上
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
      <h2>AIがマーケティングを完全自動化</h2>
      <p class="lead">
        広告運用、コンテンツ作成、顧客分析...<br>
        全てのマーケティング業務をAIにお任せください。
      </p>
      <p>
        24時間365日働くAIマーケティングシステムが、<br>
        人間では不可能な速度と精度で成果を生み出し続けます。
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
    <h2 class="section-title">導入プロセス</h2>
    
    <div class="process-timeline">
      <div class="process-step">
        <div class="step-number">1</div>
        <h3>現状分析・診断</h3>
        <p>現在の広告運用状況と課題を詳細に分析</p>
        <span class="duration">1週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">2</div>
        <h3>心理マッピング</h3>
        <p>ターゲット顧客の心理特性を8つの本能で分析</p>
        <span class="duration">2週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">3</div>
        <h3>AI最適化実装</h3>
        <p>AIによる自動最適化システムの構築・実装</p>
        <span class="duration">2-3週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">4</div>
        <h3>運用・改善</h3>
        <p>継続的なモニタリングと改善施策の実行</p>
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
        <h3>サービス企業 A社</h3>
        <p class="challenge">課題：Web集客が弱く、問い合わせが少ない</p>
        <p class="solution">施策：ブログ自動投稿システムでSEO強化</p>
        <div class="metrics">
          <div class="metric-item">
            <span class="value">380%</span>
            <span class="label">SEO流入増加</span>
          </div>
          <div class="metric-item">
            <span class="value">月120記事</span>
            <span class="label">自動生成</span>
          </div>
        </div>
      </div>
      
      <div class="result-card glass-card">
        <h3>歯科医院 B様</h3>
        <p class="challenge">課題：患者データを活用できていない</p>
        <p class="solution">施策：AI顧客分析システムで最適なアプローチ</p>
        <div class="metrics">
          <div class="metric-item">
            <span class="value">185%</span>
            <span class="label">売上向上</span>
          </div>
          <div class="metric-item">
            <span class="value">92%</span>
            <span class="label">リピート率</span>
          </div>
        </div>
      </div>
      
      <div class="result-card glass-card">
        <h3>美容室チェーン C社</h3>
        <p class="challenge">課題：広告費が高騰し、新規獲得コストが上昇</p>
        <p class="solution">施策：AI広告自動最適化システム導入</p>
        <div class="metrics">
          <div class="metric-item">
            <span class="value">312%</span>
            <span class="label">売上向上</span>
          </div>
          <div class="metric-item">
            <span class="value">65%</span>
            <span class="label">CPA削減</span>
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
        お客様のビジネス規模や課題に応じて、最適なプランをご提案いたします。<br>
        まずは無料診断で、具体的な改善ポイントと期待効果をご確認ください。
      </p>
    </div>
    
    <div class="pricing-options">
      <div class="pricing-card glass-card">
        <h3>スタートアッププラン</h3>
        <p>小規模事業者向け</p>
        <ul>
          <li>✓ 基本的な心理分析</li>
          <li>✓ 広告最適化（1媒体）</li>
          <li>✓ 月次レポート</li>
        </ul>
        <div class="price">お見積もりを依頼</div>
        <button class="btn btn-outline btn-block" onclick="openContactForm()">詳細を相談する</button>
      </div>
      
      <div class="pricing-card glass-card featured">
        <div class="badge">人気</div>
        <h3>グロースプラン</h3>
        <p>成長企業向け</p>
        <ul>
          <li>✓ 詳細な心理マッピング</li>
          <li>✓ 複数媒体の最適化</li>
          <li>✓ AI自動最適化</li>
          <li>✓ 週次ミーティング</li>
        </ul>
        <div class="price">投資対効果を重視したご提案</div>
        <button class="btn btn-primary btn-block" onclick="openContactForm()">お見積もりを依頼</button>
      </div>
      
      <div class="pricing-card glass-card">
        <h3>エンタープライズ</h3>
        <p>大規模事業者向け</p>
        <ul>
          <li>✓ フルカスタマイズ</li>
          <li>✓ 専任チーム体制</li>
          <li>✓ 全媒体対応</li>
          <li>✓ 24時間サポート</li>
        </ul>
        <div class="price">戦略的パートナーシップ</div>
        <button class="btn btn-outline btn-block" onclick="openContactForm()">戦略相談を申し込む</button>
      </div>
    </div>
    <div class="custom-solution-note">
      <p>
        <strong>価格について：</strong>お客様の広告予算、ビジネス規模、達成目標に応じて、<br>
        最適なROIを実現するカスタムプランをご提案いたします。<br>
        まずは無料診断で、具体的な改善余地をご確認ください。
      </p>
    </div>
  </div>
</section>

<section class="service-cta">
  <div class="container">
    <div class="cta-content glass-card">
      <h2>AIマーケティングの可能性を体験してください</h2>
      <p>
        あなたのビジネスにAIマーケティングを導入した場合の<br>
        具体的な成果予測と改善提案を無料でご提供します。
      </p>
      <button class="btn btn-primary btn-large" onclick="openContactForm()">
        無料相談はこちら
      </button>
    </div>
  </div>
</section>

<style>
.service-detail-hero {
  padding: 8rem 0 4rem;
  text-align: center;
  background: linear-gradient(to bottom, rgba(139, 92, 246, 0.1), transparent);
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
  background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.05), transparent);
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
  color: #8b5cf6;
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
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
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
  background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
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
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
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
  border: 2px solid #8b5cf6;
}

.badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
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
  color: #8b5cf6;
}

.custom-solution-note {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 15px;
  text-align: center;
}

.custom-solution-note p {
  color: #e5e7eb;
  line-height: 1.8;
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