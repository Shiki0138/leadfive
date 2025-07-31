---
layout: default
title: お問い合わせ | LeadFive
permalink: /contact/
---

<section class="page-header">
  <div class="container">
    <h1 class="page-title">お問い合わせ</h1>
    <p class="page-subtitle">Contact Us</p>
  </div>
</section>

<section class="contact-section">
  <div class="container">
    <div class="contact-intro glass-card">
      <h2>まずは無料相談から</h2>
      <p>
        AI×心理学マーケティングにご興味をお持ちいただき、ありがとうございます。<br>
        まずは30分の無料相談で、あなたのビジネスの可能性を一緒に探りましょう。
      </p>
    </div>

    <div class="contact-options">
      <div class="contact-option glass-card">
        <h3>🚀 無料AI診断</h3>
        <p>あなたのビジネスに最適なAI活用方法を診断します</p>
        <button class="btn btn-primary" onclick="openAIAnalysis()">
          診断を開始する
        </button>
      </div>

      <div class="contact-option glass-card">
        <h3>📞 30分無料相談</h3>
        <p>専門コンサルタントが直接お話を伺います</p>
        <button class="btn btn-primary" onclick="openCalendly()">
          日程を予約する
        </button>
      </div>

      <div class="contact-option glass-card">
        <h3>✉️ メールでのお問い合わせ</h3>
        <p>まずは詳細な資料が欲しい方はこちら</p>
        <a href="mailto:{{ site.company.email }}" class="btn btn-primary">
          メールを送る
        </a>
      </div>
    </div>

    <div class="contact-form-section">
      <h2>お問い合わせフォーム</h2>
      <form class="contact-form glass-card" id="contact-form">
        <div class="form-group">
          <label for="company">会社名 <span class="required">*</span></label>
          <input type="text" id="company" name="company" required>
        </div>

        <div class="form-group">
          <label for="name">お名前 <span class="required">*</span></label>
          <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
          <label for="email">メールアドレス <span class="required">*</span></label>
          <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
          <label for="phone">電話番号</label>
          <input type="tel" id="phone" name="phone">
        </div>

        <div class="form-group">
          <label for="service">ご興味のあるサービス</label>
          <select id="service" name="service">
            <option value="">選択してください</option>
            <option value="ai-marketing">広告・マーケティングサポート</option>
            <option value="ai-prompt">AIプロンプトエンジニアリング</option>
            <option value="engineering">エンジニアリングサポート</option>
            <option value="consulting">戦略コンサルティング</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div class="form-group">
          <label for="budget">ご予算</label>
          <select id="budget" name="budget">
            <option value="">選択してください</option>
            <option value="under-50">〜50万円</option>
            <option value="50-100">50万円〜100万円</option>
            <option value="100-300">100万円〜300万円</option>
            <option value="300-500">300万円〜500万円</option>
            <option value="over-500">500万円以上</option>
          </select>
        </div>

        <div class="form-group">
          <label for="message">お問い合わせ内容 <span class="required">*</span></label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" name="privacy" required>
            <span><a href="/privacy/">プライバシーポリシー</a>に同意する</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-large">
          送信する
        </button>
      </form>
    </div>

    <div class="contact-info glass-card">
      <h3>その他のお問い合わせ方法</h3>
      <div class="info-grid">
        <div>
          <h4>📧 メール</h4>
          <p><a href="mailto:{{ site.company.email }}">{{ site.company.email }}</a></p>
        </div>
        <div>
          <h4>📞 電話</h4>
          <p>{{ site.company.phone }}<br>
          <small>営業時間: 平日 9:00-18:00</small></p>
        </div>
        <div>
          <h4>📍 所在地</h4>
          <p>{{ site.company.address }}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.contact-section {
  padding: 4rem 0;
}

.contact-intro {
  text-align: center;
  padding: 3rem;
  margin-bottom: 4rem;
}

.contact-intro h2 {
  margin-bottom: 1.5rem;
}

.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.contact-option {
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.contact-option:hover {
  transform: translateY(-5px);
}

.contact-option h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.contact-option p {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.contact-form-section {
  max-width: 800px;
  margin: 0 auto 4rem;
}

.contact-form {
  padding: 3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  background: rgba(255, 255, 255, 0.08);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.contact-info {
  padding: 3rem;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.info-grid h4 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.info-grid p {
  color: #d1d5db;
}

.info-grid small {
  color: #9ca3af;
}
</style>

<script>
function openCalendly() {
  // Calendlyの予約ページを開く（実際のURLに変更してください）
  window.open('https://calendly.com/leadfive/consultation', '_blank');
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // フォームデータを収集
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  // ここで実際の送信処理を実装
  // 例: FormspreeやNetlify Formsなどのサービスを使用
  
  alert('お問い合わせありがとうございます。24時間以内にご連絡いたします。');
  this.reset();
});
</script>