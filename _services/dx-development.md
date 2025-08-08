---
layout: page
title: DXシステム開発 | 業務効率化とデジタル化を実現
description: 業務改善ツール、ホームページ、ランディングページ制作など、お客様のDXを総合的にサポート。補助金活用のご提案も可能です。
permalink: /services/dx-development/
---

<style>
.dx-hero {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  padding: 6rem 0;
  margin-bottom: 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.dx-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.dx-hero h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.dx-hero p {
  font-size: 1.25rem;
  color: #9ca3af;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.development-services {
  margin-bottom: 4rem;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.achievements {
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.achievement-card {
  background: rgba(139, 92, 246, 0.1);
  padding: 2rem;
  border-radius: 15px;
  border-left: 4px solid #8b5cf6;
  transition: all 0.3s ease;
}

.achievement-card:hover {
  transform: translateX(5px);
  background: rgba(139, 92, 246, 0.15);
}

.achievement-card h4 {
  color: #8b5cf6;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.achievement-card .client {
  color: #e5e7eb;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.achievement-card .description {
  color: #9ca3af;
  font-size: 0.875rem;
  line-height: 1.6;
}

.development-process {
  margin-bottom: 4rem;
}

.process-timeline {
  position: relative;
  padding-left: 2rem;
  margin-top: 2rem;
}

.process-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
  padding-left: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.5rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.timeline-item h4 {
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.benefits-section {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(59, 130, 246, 0.05));
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
}

.benefit-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.benefit-item {
  display: flex;
  align-items: start;
  gap: 1rem;
}

.benefit-icon {
  color: #10b981;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.subsidy-section {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  padding: 2.5rem;
  border-radius: 15px;
  margin-bottom: 4rem;
  text-align: center;
}

.subsidy-section h3 {
  color: #10b981;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.subsidy-types {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.subsidy-badge {
  background: rgba(16, 185, 129, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  color: #10b981;
}

.cta-section {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 20px;
}

/* Additional responsive styles */
@media (max-width: 768px) {
  .dx-hero {
    padding: 4rem 0 3rem;
  }
  
  .dx-hero h1 {
    font-size: 2rem;
    line-height: 1.3;
  }
  
  .dx-hero p {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .service-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .achievement-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .achievements {
    padding: 2rem 1.5rem;
  }
  
  .benefits-section {
    padding: 2rem 1.5rem;
  }
  
  .subsidy-section {
    padding: 2rem 1.5rem;
  }
  
  .subsidy-types {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .process-timeline {
    padding-left: 1rem;
  }
  
  .timeline-item {
    padding-left: 1.5rem;
  }
  
  .timeline-item::before {
    left: -1.5rem;
  }
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.75rem;
    line-height: 1.3;
  }
}

.lead-text {
  font-size: 1.25rem;
  color: #9ca3af;
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .lead-text {
    font-size: 1rem;
    padding: 0 1rem;
  }
}
</style>

<div class="dx-hero">
  <div class="container">
    <h1>DXシステム開発</h1>
    <p>業務効率化とデジタル化を実現する、オーダーメイドのシステム開発サービス</p>
  </div>
</div>

<div class="container">
  <section class="development-services">
    <h2 class="section-title">開発サービス</h2>
    <p class="lead-text">
      お客様のビジネス課題に合わせて、最適なDXソリューションをご提供します。
      業務効率化ツールからWebサイト制作まで、幅広く対応いたします。
    </p>
    
    <div class="service-grid">
      <div class="service-card">
        <span class="service-icon">💼</span>
        <h3>業務改善ツール開発</h3>
        <p>日々の業務で発生する非効率な作業を自動化。データ入力、レポート作成、在庫管理など、お客様の業務に合わせたカスタムツールを開発します。</p>
        <ul style="margin-top: 1rem; list-style: none; padding: 0;">
          <li>✓ 作業時間を最大80%削減</li>
          <li>✓ ヒューマンエラーの防止</li>
          <li>✓ リアルタイムデータ管理</li>
        </ul>
      </div>
      
      <div class="service-card">
        <span class="service-icon">🌐</span>
        <h3>ホームページ制作</h3>
        <p>集客力のあるホームページを制作。SEO対策、スマホ対応、高速表示など、現代のWeb標準に準拠した設計で、ビジネスの成長を支援します。</p>
        <ul style="margin-top: 1rem; list-style: none; padding: 0;">
          <li>✓ 検索順位向上のSEO対策</li>
          <li>✓ スマホ・タブレット完全対応</li>
          <li>✓ 問い合わせ率向上の導線設計</li>
        </ul>
      </div>
      
      <div class="service-card">
        <span class="service-icon">🎯</span>
        <h3>ランディングページ制作</h3>
        <p>コンバージョン率を最大化するLP制作。心理学に基づいた設計と、A/Bテストによる継続的な改善で、広告効果を最大化します。</p>
        <ul style="margin-top: 1rem; list-style: none; padding: 0;">
          <li>✓ 平均CVR 2.5倍の実績</li>
          <li>✓ 8つの本能を活用した設計</li>
          <li>✓ 継続的な改善サポート</li>
        </ul>
      </div>
    </div>
  </section>
  
  <section class="achievements">
    <h2 class="section-title">開発実績</h2>
    <p class="lead-text">
      様々な業界のお客様のDXを支援してきた実績があります。
    </p>
    
    <div class="achievement-grid">
      <div class="achievement-card">
        <h4>美容室ホームページ</h4>
        <p class="client">都内美容室チェーン様</p>
        <p class="description">
          予約システム統合型のホームページを制作。スタイリスト紹介、施術メニュー、オンライン予約機能を実装。
          公開後3ヶ月で新規予約が2.3倍に増加。
        </p>
      </div>
      
      <div class="achievement-card">
        <h4>求人用ランディングページ</h4>
        <p class="client">造園事業者様</p>
        <p class="description">
          人材不足に悩む造園業界向けに、若手求職者に響く求人LPを制作。
          職人の魅力を伝えるストーリー設計により、応募数が4倍に増加。
        </p>
      </div>
      
      <div class="achievement-card">
        <h4>建築工務店LP</h4>
        <p class="client">地域密着型工務店様</p>
        <p class="description">
          施工実績と顧客の声を効果的に配置したLPを制作。
          地域特性を活かしたSEO対策により、問い合わせが月20件から月65件へ増加。
        </p>
      </div>
      
      <div class="achievement-card">
        <h4>顧客管理システム</h4>
        <p class="client">歯科医院様</p>
        <p class="description">
          患者情報、予約管理、治療履歴を一元管理するシステムを開発。
          受付業務の効率化により、1日あたり2時間の業務時間削減を実現。
        </p>
      </div>
    </div>
  </section>
  
  <section class="development-process">
    <h2 class="section-title">開発プロセス</h2>
    <div class="process-timeline">
      <div class="timeline-item">
        <h4>1. ヒアリング・要件定義</h4>
        <p>お客様の課題と目標を詳しくお聞きし、最適な解決策をご提案。投資対効果を重視した要件定義を行います。</p>
      </div>
      <div class="timeline-item">
        <h4>2. 設計・デザイン</h4>
        <p>ユーザビリティと美しさを両立したデザイン設計。お客様のブランドイメージを大切にしながら、使いやすさを追求します。</p>
      </div>
      <div class="timeline-item">
        <h4>3. 開発・実装</h4>
        <p>最新技術を活用した高品質な開発。セキュリティと拡張性を考慮した、長く使えるシステムを構築します。</p>
      </div>
      <div class="timeline-item">
        <h4>4. テスト・納品</h4>
        <p>徹底的なテストで品質を保証。納品後も安心してご利用いただけるよう、運用マニュアルもご提供します。</p>
      </div>
      <div class="timeline-item">
        <h4>5. 運用・保守</h4>
        <p>納品後も継続的にサポート。システムの改善提案や、新機能の追加開発も承ります。</p>
      </div>
    </div>
  </section>
  
  <section class="benefits-section">
    <h2 class="section-title">選ばれる理由</h2>
    <div class="benefit-list">
      <div class="benefit-item">
        <span class="benefit-icon">✅</span>
        <div>
          <h4>完全オーダーメイド</h4>
          <p>既製品では解決できない、お客様独自の課題に合わせた開発</p>
        </div>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">✅</span>
        <div>
          <h4>コスト削減効果</h4>
          <p>業務効率化により、開発費用を短期間で回収可能</p>
        </div>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">✅</span>
        <div>
          <h4>スピード開発</h4>
          <p>アジャイル開発手法により、最短2週間でプロトタイプ完成</p>
        </div>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">✅</span>
        <div>
          <h4>充実のサポート</h4>
          <p>導入後の操作指導から改善提案まで、長期的にサポート</p>
        </div>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">✅</span>
        <div>
          <h4>最新技術の活用</h4>
          <p>AI、クラウド、セキュリティなど、最新技術で競争力を強化</p>
        </div>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">✅</span>
        <div>
          <h4>実績豊富</h4>
          <p>多様な業界での開発実績により、幅広いニーズに対応</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="subsidy-section">
    <h3>💡 補助金活用のご提案</h3>
    <p>
      DXシステム開発には、各種補助金の活用が可能です。<br>
      申請サポートも含めて、お客様の負担を最小限に抑えるご提案をいたします。
    </p>
    <div class="subsidy-types">
      <span class="subsidy-badge">ものづくり補助金</span>
      <span class="subsidy-badge">小規模事業者持続化補助金</span>
    </div>
    <p style="margin-top: 1.5rem; color: #9ca3af; font-size: 0.875rem;">
      最大で開発費用の2/3が補助される可能性があります。詳しくはお問い合わせください。
    </p>
  </section>
  
  <section class="cta-section">
    <h2>DXで業務を変革しませんか？</h2>
    <p>まずは無料相談で、お客様の課題をお聞かせください</p>
    <div class="cta-buttons" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn btn-primary btn-large" onclick="openContactForm()">
        無料相談を申し込む
      </button>
      <a href="{{ '/case-studies/' | relative_url }}" class="btn btn-outline btn-large">
        詳細な事例を見る
      </a>
    </div>
  </section>
</div>