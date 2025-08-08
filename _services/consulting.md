---
layout: page
title: 戦略コンサルティング | AI×心理学でビジネス変革を実現
description: データドリブンな経営戦略立案から実行支援まで。AI×心理学の独自アプローチで、持続的な競争優位を構築します。
permalink: /services/consulting/
---

<style>
.consulting-hero {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  padding: 6rem 0;
  margin-bottom: 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.consulting-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #ec4899, #6366f1);
  animation: slide 3s linear infinite;
}

@keyframes slide {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.approach-section {
  margin-bottom: 4rem;
}

.approach-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.approach-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.approach-card:hover {
  transform: translateY(-5px);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
}

.consulting-services {
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
}

.service-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  border-color: transparent;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
  animation: fadeIn 0.5s ease;
}

.methodology-section {
  margin-bottom: 4rem;
}

.methodology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.methodology-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.methodology-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #ec4899);
}

.methodology-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.value-props {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.value-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05));
  padding: 2.5rem;
  border-radius: 15px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: scale(1.02);
  border-color: #6366f1;
}

.engagement-models {
  margin-bottom: 4rem;
}

.model-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.model-card {
  background: #0a0a0a;
  border: 2px solid rgba(236, 72, 153, 0.3);
  border-radius: 15px;
  padding: 2.5rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.model-card:hover {
  transform: translateY(-5px);
  border-color: #ec4899;
}

.duration {
  font-size: 2rem;
  font-weight: 700;
  color: #ec4899;
  margin: 1rem 0;
}

.team-section {
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
  text-align: center;
}

.expertise-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.expertise-badge {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .value-props {
    grid-template-columns: 1fr;
  }
  
  .service-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    width: 100%;
  }
}
</style>

<div class="consulting-hero">
  <div class="container">
    <h1>戦略コンサルティング</h1>
    <p>AI×心理学×データの融合で、<br>ビジネスの本質的な変革と持続的成長を実現</p>
  </div>
</div>

<div class="container">
  <section class="service-intro">
    <h2 class="section-title">経営の羅針盤となる、次世代コンサルティング</h2>
    <p class="lead-text">
      従来の経験則や直感に頼るコンサルティングではなく、<br>
      AIによるデータ分析と人間心理の深い理解を組み合わせ、<br>
      科学的根拠に基づいた戦略立案と実行支援を提供します。
    </p>
  </section>

  <section class="approach-section">
    <h2 class="section-title">LeadFiveの独自アプローチ</h2>
    <div class="approach-cards">
      <div class="approach-card">
        <span class="feature-icon">🧠</span>
        <h3>行動心理学の活用</h3>
        <p>顧客・従業員・ステークホルダーの行動原理を8つの本能から分析し、効果的な戦略を設計</p>
      </div>
      <div class="approach-card">
        <span class="feature-icon">📊</span>
        <h3>AIによるデータ分析</h3>
        <p>膨大なデータから隠れたパターンを発見し、未来予測と最適な意思決定をサポート</p>
      </div>
      <div class="approach-card">
        <span class="feature-icon">🔄</span>
        <h3>アジャイル実行支援</h3>
        <p>戦略立案だけでなく、実行フェーズまで伴走。継続的な改善サイクルで成果を最大化</p>
      </div>
    </div>
  </section>

  <section class="consulting-services">
    <h2 class="section-title">コンサルティングサービス</h2>
    <div class="service-tabs">
      <button class="tab-button active" onclick="showTab('strategy')">経営戦略</button>
      <button class="tab-button" onclick="showTab('marketing')">マーケティング戦略</button>
      <button class="tab-button" onclick="showTab('digital')">DX戦略</button>
      <button class="tab-button" onclick="showTab('organization')">組織変革</button>
    </div>
    
    <div id="strategy" class="tab-content active">
      <h3>経営戦略コンサルティング</h3>
      <p>市場分析、競合分析、自社分析を通じて、持続可能な成長戦略を策定</p>
      <ul>
        <li>✅ ビジョン・ミッション策定支援</li>
        <li>✅ 事業ポートフォリオ最適化</li>
        <li>✅ M&A戦略立案・実行支援</li>
        <li>✅ 新規事業開発</li>
        <li>✅ グローバル展開戦略</li>
      </ul>
    </div>
    
    <div id="marketing" class="tab-content">
      <h3>マーケティング戦略コンサルティング</h3>
      <p>心理学×AIで顧客理解を深め、ROIを最大化するマーケティング戦略を構築</p>
      <ul>
        <li>✅ カスタマージャーニー最適化</li>
        <li>✅ ブランド戦略立案</li>
        <li>✅ デジタルマーケティング戦略</li>
        <li>✅ CRM・顧客エンゲージメント強化</li>
        <li>✅ 価格戦略最適化</li>
      </ul>
    </div>
    
    <div id="digital" class="tab-content">
      <h3>デジタル変革（DX）戦略</h3>
      <p>AIと自動化を活用し、ビジネスモデルとオペレーションの革新を実現</p>
      <ul>
        <li>✅ デジタル成熟度診断</li>
        <li>✅ AI活用戦略立案</li>
        <li>✅ プロセス自動化設計</li>
        <li>✅ データ基盤構築支援</li>
        <li>✅ デジタル人材育成</li>
      </ul>
    </div>
    
    <div id="organization" class="tab-content">
      <h3>組織変革コンサルティング</h3>
      <p>人間の本能を理解した組織設計で、イノベーションを生み出す文化を醸成</p>
      <ul>
        <li>✅ 組織診断・課題分析</li>
        <li>✅ チェンジマネジメント</li>
        <li>✅ 人事制度設計</li>
        <li>✅ リーダーシップ開発</li>
        <li>✅ 企業文化変革</li>
      </ul>
    </div>
  </section>

  <section class="methodology-section">
    <h2 class="section-title">コンサルティングプロセス</h2>
    <div class="methodology-grid">
      <div class="methodology-item">
        <div class="methodology-number">01</div>
        <h4>診断・分析</h4>
        <p>AIツールと心理分析で現状を多角的に把握</p>
      </div>
      <div class="methodology-item">
        <div class="methodology-number">02</div>
        <h4>戦略立案</h4>
        <p>データに基づく複数シナリオの策定と評価</p>
      </div>
      <div class="methodology-item">
        <div class="methodology-number">03</div>
        <h4>実行計画</h4>
        <p>具体的なロードマップとKPI設定</p>
      </div>
      <div class="methodology-item">
        <div class="methodology-number">04</div>
        <h4>実行支援</h4>
        <p>伴走型支援で確実な成果創出</p>
      </div>
    </div>
  </section>

  <section class="value-props">
    <div class="value-card">
      <h3>🎯 データドリブンな意思決定</h3>
      <p>AIが膨大なデータから最適解を導き出し、経営判断の精度を向上。リスクを最小化しながら、成功確率の高い戦略を選択できます。</p>
    </div>
    <div class="value-card">
      <h3>🧠 人間心理に基づく設計</h3>
      <p>8つの本能理論により、顧客・従業員・パートナーの行動を予測。理論だけでなく、実際に人を動かす戦略を構築します。</p>
    </div>
    <div class="value-card">
      <h3>⚡ スピーディな実行</h3>
      <p>アジャイル手法とAI活用により、従来の半分の期間で戦略を実行。市場変化に素早く対応し、競争優位を確立します。</p>
    </div>
    <div class="value-card">
      <h3>📈 測定可能な成果</h3>
      <p>全ての施策にKPIを設定し、リアルタイムで効果測定。データに基づく継続的な改善で、ROIを最大化します。</p>
    </div>
  </section>

  <section class="engagement-models">
    <h2 class="section-title">エンゲージメントモデル</h2>
    <div class="model-cards">
      <div class="model-card">
        <h3>スポットコンサルティング</h3>
        <p class="duration">1-3ヶ月</p>
        <p>特定の課題に対する集中的な支援。迅速な問題解決が必要な場合に最適。</p>
        <ul style="text-align: left;">
          <li>現状分析レポート</li>
          <li>改善提案書</li>
          <li>実行計画策定</li>
        </ul>
      </div>
      <div class="model-card">
        <h3>プロジェクト型</h3>
        <p class="duration">3-12ヶ月</p>
        <p>戦略立案から実行まで、プロジェクト全体を支援。確実な成果創出を目指す。</p>
        <ul style="text-align: left;">
          <li>専任コンサルタント配置</li>
          <li>定期的な進捗管理</li>
          <li>成果保証プログラム</li>
        </ul>
      </div>
      <div class="model-card">
        <h3>顧問型サポート</h3>
        <p class="duration">年間契約</p>
        <p>経営パートナーとして継続的に支援。長期的な成長を共に実現。</p>
        <ul style="text-align: left;">
          <li>月次戦略会議</li>
          <li>随時相談対応</li>
          <li>役員会参加</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="team-section">
    <h2 class="section-title">コンサルティングチーム</h2>
    <p>多様な専門性を持つプロフェッショナルが、あなたのビジネスを支援します</p>
    <div class="expertise-badges">
      <span class="expertise-badge">戦略コンサルティング</span>
      <span class="expertise-badge">データサイエンス</span>
      <span class="expertise-badge">行動心理学</span>
      <span class="expertise-badge">AIエンジニアリング</span>
      <span class="expertise-badge">デジタルマーケティング</span>
      <span class="expertise-badge">組織開発</span>
      <span class="expertise-badge">ファイナンス</span>
      <span class="expertise-badge">UXデザイン</span>
    </div>
  </section>

  <section class="cta-section">
    <h2>ビジネスの未来を、科学的に設計する</h2>
    <p>AI×心理学の力で、あなたのビジネスに革新をもたらします</p>
    <div class="cta-buttons">
      <button class="btn btn-primary btn-large" onclick="openContactForm()">
        無料相談を予約する
      </button>
      <a href="{{ '/case-studies/' | relative_url }}" class="btn btn-outline btn-large">
        成功事例を見る
      </a>
    </div>
  </section>
</div>

<script>
function showTab(tabName) {
  // Remove active class from all tabs and buttons
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to selected tab and button
  event.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}
</script>