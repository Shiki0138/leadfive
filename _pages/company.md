---
layout: page
title: 会社概要 | LeadFive
description: LeadFiveは人間の8つの本能とAI技術を融合し、予測可能なビジネス成長を実現するマーケティング会社です。
permalink: /company/
---

<style>
.company-page {
  padding: 6rem 0;
}

.company-header {
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 20px;
}

.company-header h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.message-section {
  background: #fff;
  color: #111827;
  padding: 4rem 0;
  margin: 0 0 4rem;
  border-top: 4px solid #0a0a0a;
  border-bottom: 4px solid #0a0a0a;
}

@media (max-width: 768px) {
  .message-section {
    padding: 3rem 0;
    margin: 0 0 3rem;
  }
}

.message-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.ceo-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .ceo-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

.ceo-photo {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #fff;
}

.message-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4b5563;
}

.company-info-section {
  margin-bottom: 4rem;
}

.info-table {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .info-table {
    font-size: 0.875rem;
  }
  
  .info-table th,
  .info-table td {
    padding: 1rem;
  }
}

.info-table th,
.info-table td {
  padding: 1.5rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-table th {
  background: rgba(139, 92, 246, 0.1);
  font-weight: 600;
  width: 30%;
}

.info-table tr:last-child th,
.info-table tr:last-child td {
  border-bottom: none;
}

.info-cards {
  display: none;
}

@media (min-width: 769px) {
  .info-cards {
    display: none !important;
  }
  
  .info-table {
    display: table !important;
  }
}

.philosophy-section {
  background: rgba(255, 255, 255, 0.03);
  padding: 4rem 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
}

@media (max-width: 768px) {
  .philosophy-section {
    padding: 2rem 1.5rem;
  }
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .philosophy-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.philosophy-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 2px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
}

.philosophy-card:hover {
  transform: translateY(-5px);
  border-color: rgba(139, 92, 246, 0.5);
}

.philosophy-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.access-section {
  margin-top: 4rem;
}

.access-map {
  background: rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .access-map {
    padding: 2rem 1rem;
  }
}

@media (max-width: 768px) {
  .company-page {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .company-header {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
  
  .company-header h1 {
    font-size: 1.75rem;
    line-height: 1.3;
    margin-bottom: 1rem;
  }
  
  .company-header p {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .message-section {
    margin: 0 0.5rem 2rem;
    padding: 2rem 0;
    border-radius: 15px;
  }
  
  .message-content {
    padding: 0 1rem;
  }
  
  .ceo-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .ceo-photo {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
  
  .message-text {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .message-text p {
    margin-bottom: 1rem;
  }
  
  .company-info-section {
    margin: 0 0.5rem 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .info-table {
    font-size: 0.875rem;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .info-table {
    display: none !important;
  }
  
  .info-cards {
    display: block !important;
    gap: 1rem;
  }
  
  .info-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(139, 92, 246, 0.2);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .info-card h4 {
    color: #8b5cf6;
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .info-card p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #e5e7eb;
  }
  
  .philosophy-section {
    padding: 2rem 1rem;
    margin: 0 0.5rem 2rem;
    border-radius: 15px;
  }
  
  .philosophy-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .philosophy-card {
    padding: 1.5rem;
    border-radius: 10px;
  }
  
  .philosophy-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }
  
  .philosophy-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .philosophy-card p {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .access-section {
    margin: 0 0.5rem;
  }
  
  .access-map {
    padding: 1.5rem 1rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
  }
  
  .access-map p {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .btn-large {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    display: block;
    padding: 1rem 2rem;
    font-size: 0.875rem;
  }
}
</style>

<div class="company-page">
  <div class="container">
    <div class="company-header">
      <h1>会社概要</h1>
      <p>AI×心理学で、ビジネスの未来を科学する</p>
    </div>

    <section class="message-section">
      <div class="message-content">
        <div class="ceo-header">
          <div class="ceo-photo">👤</div>
          <div>
            <h2>代表メッセージ</h2>
            <p style="color: #8b5cf6; font-weight: 600;">代表社員 山下 公一</p>
          </div>
        </div>
        <div class="message-text">
          <p>「売上は運や勘ではなく、科学できる」</p>
          <p>この信念のもと、人間の本能的な行動原理とAI技術を融合させた、全く新しいマーケティングアプローチを提供しています。</p>
          <p>従来のマーケティングは、単にフレームワークを活用しただけ、または、経験則に頼る部分が大きく、成果にばらつきがありました。しかし、8つの本能という人間の根源的な欲求を理解し、「データ×AI」で最適化することで、予測可能で再現性の高い成果を実現できるようになりました。</p>
          <p>お客様のビジネスを「科学」し、持続的な成長を実現する。そして、「本来得られる成果を手に入れていただく。」</p>
          <p>それが弊社の使命です。</p>
        </div>
      </div>
    </section>

    <section class="company-info-section">
      <h2 class="section-title">会社情報</h2>
      <table class="info-table">
        <tr>
          <th>会社名</th>
          <td>合同会社Leadfive</td>
        </tr>
        <tr>
          <th>代表者</th>
          <td>代表社員 山下 公一</td>
        </tr>
        <tr>
          <th>設立</th>
          <td>2024年4月8日</td>
        </tr>
        <tr>
          <th>所在地</th>
          <td>〒530-0001<br>大阪府大阪市北区梅田1-13-1<br>大阪梅田ツインタワーズ・サウス15階</td>
        </tr>
        <tr>
          <th>電話番号</th>
          <td>06-7713-6747</td>
        </tr>
        <tr>
          <th>メール</th>
          <td>leadfive.138@gmail.com</td>
        </tr>
        <tr>
          <th>事業内容</th>
          <td>
            ・AI×心理学マーケティングコンサルティング<br>
            ・LP最適化サービス<br>
            ・AIプロンプトエンジニアリング<br>
            ・マーケティング自動化支援<br>
            ・データ分析・予測モデル構築
          </td>
        </tr>
      </table>
      
      <!-- Mobile Card Layout -->
      <div class="info-cards">
        <div class="info-card">
          <h4>会社名</h4>
          <p>合同会社Leadfive</p>
        </div>
        <div class="info-card">
          <h4>代表者</h4>
          <p>代表社員 山下 公一</p>
        </div>
        <div class="info-card">
          <h4>設立</h4>
          <p>2024年4月8日</p>
        </div>
        <div class="info-card">
          <h4>所在地</h4>
          <p>〒530-0001<br>大阪府大阪市北区梅田1-13-1<br>大阪梅田ツインタワーズ・サウス15階</p>
        </div>
        <div class="info-card">
          <h4>電話番号</h4>
          <p>06-7713-6747</p>
        </div>
        <div class="info-card">
          <h4>メールアドレス</h4>
          <p>leadfive.138@gmail.com</p>
        </div>
        <div class="info-card">
          <h4>事業内容</h4>
          <p>・AI×心理学マーケティングコンサルティング<br>
          ・LP最適化サービス<br>
          ・AIプロンプトエンジニアリング<br>
          ・マーケティング自動化支援<br>
          ・データ分析・予測モデル構築</p>
        </div>
      </div>
    </section>

    <section class="philosophy-section">
      <h2 class="section-title">経営理念</h2>
      <div class="philosophy-grid">
        <div class="philosophy-card">
          <span class="philosophy-icon">🎯</span>
          <h3>ビジョン</h3>
          <p>すべてのビジネスに、科学的な成長を</p>
        </div>
        <div class="philosophy-card">
          <span class="philosophy-icon">🚀</span>
          <h3>ミッション</h3>
          <p>AI×心理学で、マーケティングの不確実性をゼロにする</p>
        </div>
        <div class="philosophy-card">
          <span class="philosophy-icon">💡</span>
          <h3>バリュー</h3>
          <p>科学的アプローチ、顧客成功第一、継続的イノベーション</p>
        </div>
      </div>
    </section>

    <section class="access-section">
      <h2 class="section-title">アクセス</h2>
      <div class="access-map">
        <p>📍 大阪梅田ツインタワーズ・サウス15階</p>
        <p style="margin-top: 1rem;">JR「大阪」駅 徒歩3分<br>地下鉄「梅田」駅 徒歩1分</p>
      </div>
      <div style="text-align: center;">
        <button class="btn btn-primary btn-large" onclick="openContactForm()">
          お問い合わせはこちら
        </button>
      </div>
    </section>
  </div>
</div>