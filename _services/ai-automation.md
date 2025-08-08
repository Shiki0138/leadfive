---
layout: default
title: AI自動化マーケティング
icon: 🤖
color: from-impulse-pink to-neural-purple
story: 深夜2時でも問い合わせが来るように
detail: 自動化により営業効率400%向上、人件費50%削減
features:
  - title: AIチャットボット構築
    description: 24時間365日、疲れ知らずのAI営業マン
    metric: 24/7 完全対応
  - title: メール自動配信システム
    description: 心理的タイミングを狙った自動メール配信
    metric: 配信効率 300%向上
  - title: SNS自動投稿AI
    description: エンゲージメント最適化された自動投稿
    metric: 週40時間削減
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
      <h2>あなたが寝ている間も、AIが営業</h2>
      <p class="lead">
        「人手不足で営業が回らない...」<br>
        「深夜や休日の問い合わせを逃している...」
      </p>
      <p>
        私たちのAI自動化システムは、24時間365日休まず働き続ける
        最強の営業チームを構築。人間以上の成果を、人件費の1/10で実現します。
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
        <h3>業務フロー分析</h3>
        <p>現在の営業・マーケティング業務を詳細分析</p>
        <span class="duration">1週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">2</div>
        <h3>AI設計・開発</h3>
        <p>最適なAIシステムの設計と開発</p>
        <span class="duration">2-3週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">3</div>
        <h3>システム実装</h3>
        <p>既存システムとの連携・実装</p>
        <span class="duration">2週間</span>
      </div>
      
      <div class="process-step">
        <div class="step-number">4</div>
        <h3>学習・最適化</h3>
        <p>AIの継続的な学習と精度向上</p>
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
        <h3>不動産会社 E社</h3>
        <p class="challenge">課題：夜間・休日の問い合わせ対応ができない</p>
        <p class="solution">施策：24時間対応AIチャットボット導入</p>
        <div class="metrics">
          <div class="metric-item">
            <span class="value">400%</span>
            <span class="label">営業効率向上</span>
          </div>
          <div class="metric-item">
            <span class="value">65%</span>
            <span class="label">成約率向上</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>

<section class="automation-showcase">
  <div class="container">
    <h2 class="section-title">自動化できる業務例</h2>
    
    <div class="automation-grid">
      <div class="automation-item glass-card">
        <div class="icon">💬</div>
        <h3>顧客対応</h3>
        <ul>
          <li>問い合わせ対応</li>
          <li>商品説明</li>
          <li>予約受付</li>
          <li>アフターフォロー</li>
        </ul>
      </div>
      
      <div class="automation-item glass-card">
        <div class="icon">📧</div>
        <h3>メールマーケティング</h3>
        <ul>
          <li>ステップメール</li>
          <li>誕生日メール</li>
          <li>カート放棄フォロー</li>
          <li>リピート促進</li>
        </ul>
      </div>
      
      <div class="automation-item glass-card">
        <div class="icon">📱</div>
        <h3>SNS運用</h3>
        <ul>
          <li>定期投稿</li>
          <li>コメント返信</li>
          <li>DM対応</li>
          <li>インサイト分析</li>
        </ul>
      </div>
      
      <div class="automation-item glass-card">
        <div class="icon">📊</div>
        <h3>データ分析</h3>
        <ul>
          <li>売上レポート</li>
          <li>顧客分析</li>
          <li>競合調査</li>
          <li>市場トレンド</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="service-pricing">
  <div class="container">
    <h2 class="section-title">料金プラン</h2>
    
    <div class="pricing-note glass-card">
      <p>
        自動化したい業務の範囲に応じて、最適なプランをご提案します。<br>
        まずは無料相談で、どれだけの効率化が可能かをシミュレーションします。
      </p>
    </div>
    
    <div class="pricing-options">
      <div class="pricing-card glass-card">
        <h3>ライトプラン</h3>
        <p>まずは一部業務から</p>
        <ul>
          <li>✓ チャットボット基本機能</li>
          <li>✓ メール自動化</li>
          <li>✓ 基本レポート</li>
        </ul>
        <div class="price">導入規模に応じたご提案</div>
        <button class="btn btn-outline btn-block" onclick="openContactForm()">お見積もりを依頼</button>
      </div>
      
      <div class="pricing-card glass-card featured">
        <div class="badge">人気No.1</div>
        <h3>スタンダードプラン</h3>
        <p>本格的な自動化に</p>
        <ul>
          <li>✓ 高度なAIチャットボット</li>
          <li>✓ 大規模メール配信</li>
          <li>✓ SNS自動投稿</li>
          <li>✓ 詳細分析レポート</li>
        </ul>
        <div class="price">ROI最大化プラン</div>
        <button class="btn btn-primary btn-block" onclick="openContactForm()">詳細を相談する</button>
      </div>
      
      <div class="pricing-card glass-card">
        <h3>プレミアムプラン</h3>
        <p>完全自動化を実現</p>
        <ul>
          <li>✓ フルカスタマイズAI</li>
          <li>✓ 全チャネル統合</li>
          <li>✓ 専任サポート</li>
          <li>✓ AI学習最適化</li>
        </ul>
        <div class="price">戦略的パートナーシップ</div>
        <button class="btn btn-outline btn-block" onclick="openContactForm()">戦略相談を申し込む</button>
      </div>
    </div>
    <div class="custom-solution-note">
      <p>
        <strong>価格について：</strong>自動化したい業務の範囲、処理量、システム連携の複雑さに応じて、<br>
        最適な投資対効果を実現するプランをカスタマイズいたします。<br>
        まずは無料相談で、どれだけの効率化が可能かをシミュレーションします。
      </p>
    </div>
  </div>
</section>

<section class="service-cta">
  <div class="container">
    <div class="cta-content glass-card">
      <h2>今すぐAIに仕事を任せませんか？</h2>
      <p>
        無料相談で、あなたのビジネスでどれだけの業務が自動化できるか<br>
        具体的なシミュレーションと期待効果をお見せします。
      </p>
      <button class="btn btn-primary btn-large" onclick="openContactForm()">
        無料相談を申し込む
      </button>
    </div>
  </div>
</section>

<style>
.service-detail-hero {
  padding: 8rem 0 4rem;
  text-align: center;
  background: linear-gradient(to bottom, rgba(236, 72, 153, 0.1), transparent);
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
  background: linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.05), transparent);
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
  color: #ec4899;
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
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
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
  background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.05), transparent);
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
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-item .label {
  font-size: 0.875rem;
  color: #9ca3af;
}

.automation-showcase {
  padding: 4rem 0;
}

.automation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.automation-item {
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.automation-item:hover {
  transform: translateY(-5px);
}

.automation-item .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.automation-item h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.automation-item ul {
  list-style: none;
  text-align: left;
  color: #d1d5db;
}

.automation-item li {
  padding: 0.25rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.automation-item li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #ec4899;
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
  border: 2px solid #ec4899;
}

.badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
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
  color: #ec4899;
}

.custom-solution-note {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(236, 72, 153, 0.1);
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