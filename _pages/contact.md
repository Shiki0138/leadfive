---
layout: page
title: お問い合わせ | LeadFive
description: AI×心理学マーケティングのご相談はLeadFiveへ。無料診断・サービス詳細についてお気軽にお問い合わせください。
permalink: /contact/
---

<style>
.contact-page {
  padding: 6rem 0;
  min-height: 80vh;
}

.contact-header {
  text-align: center;
  margin-bottom: 4rem;
}

.contact-header h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto 4rem;
}

.contact-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 15px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.contact-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.contact-card p {
  color: #9ca3af;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.contact-info {
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.info-item {
  text-align: center;
}

.info-item h4 {
  color: #8b5cf6;
  margin-bottom: 0.5rem;
}

.cta-section {
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 20px;
}

@media (max-width: 768px) {
  .contact-header h1 {
    font-size: 2rem;
  }
  
  .contact-options {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="contact-page">
  <div class="container">
    <div class="contact-header">
      <h1>お問い合わせ</h1>
      <p>AI×心理学マーケティングで、あなたのビジネスの成長をサポートします</p>
    </div>

    <div class="contact-options">
      <div class="contact-card">
        <span class="contact-icon">💬</span>
        <h3>お問い合わせフォーム</h3>
        <p>サービスに関するご質問、ご相談はこちらから。1-2営業日以内にご返信いたします。</p>
        <button class="btn btn-primary" onclick="openContactForm()">
          フォームを開く
        </button>
      </div>

      <div class="contact-card">
        <span class="contact-icon">📞</span>
        <h3>お電話でのご相談</h3>
        <p>お急ぎの方はお電話でもご相談を承っております。</p>
        <a href="tel:0677136747" class="btn btn-outline">
          06-7713-6747
        </a>
      </div>

      <div class="contact-card">
        <span class="contact-icon">📧</span>
        <h3>メールでのお問い合わせ</h3>
        <p>詳細な資料請求やご提案をご希望の方はメールでも承ります。</p>
        <a href="mailto:leadfive.138@gmail.com" class="btn btn-outline">
          メールを送る
        </a>
      </div>
    </div>

    <div class="contact-info">
      <h2 style="text-align: center; margin-bottom: 2rem;">会社情報</h2>
      <div class="info-grid">
        <div class="info-item">
          <h4>会社名</h4>
          <p>合同会社Leadfive</p>
        </div>
        <div class="info-item">
          <h4>所在地</h4>
          <p>〒530-0001<br>大阪府大阪市北区梅田1-13-1<br>大阪梅田ツインタワーズ・サウス15階</p>
        </div>
        <div class="info-item">
          <h4>営業時間</h4>
          <p>平日 9:00 - 18:00<br>（土日祝休み）</p>
        </div>
        <div class="info-item">
          <h4>代表者</h4>
          <p>山下 公一</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>まずは無料相談から</h2>
      <p>AI×心理学マーケティングがあなたのビジネスにどう貢献できるか、<br>具体的な事例を交えてご説明します。</p>
      <button class="btn btn-primary btn-large" onclick="openContactForm()" style="margin-top: 1.5rem;">
        無料相談を申し込む
      </button>
    </div>
  </div>
</div>