---
layout: default
title: お問い合わせ
permalink: /contact/
---

<section class="contact-section">
  <div class="container">
    <h1 class="section-title">
      お問い合わせ
    </h1>
    
    <div class="contact-content">
      <div class="contact-form-container">
        <div class="contact-intro">
          <h2>あなたのビジネスの可能性を、一緒に探りませんか？</h2>
          <p>AI×心理学マーケティングに関するご相談、サービスについてのご質問など、<br>どんなことでもお気軽にお問い合わせください。</p>
        </div>
        
        <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
          <input type="hidden" name="_to" value="{{ site.forms.contact_email }}">
          <input type="hidden" name="_subject" value="【LeadFive】お問い合わせ">
          <input type="hidden" name="_cc" value="{{ site.forms.contact_email }}">
          
          <div class="form-row">
            <div class="form-group">
              <label for="company">会社名 <span class="required">*</span></label>
              <input type="text" id="company" name="company" required>
            </div>
            <div class="form-group">
              <label for="name">お名前 <span class="required">*</span></label>
              <input type="text" id="name" name="name" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">メールアドレス <span class="required">*</span></label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="phone">電話番号</label>
              <input type="tel" id="phone" name="phone">
            </div>
          </div>
          
          <div class="form-group">
            <label for="business-type">業種</label>
            <select id="business-type" name="business-type">
              <option value="">選択してください</option>
              <option value="ec">EC・オンライン販売</option>
              <option value="retail">実店舗・小売</option>
              <option value="service">サービス業</option>
              <option value="btob">BtoB・法人向け</option>
              <option value="beauty">美容・サロン</option>
              <option value="consulting">コンサルティング</option>
              <option value="manufacturing">製造業</option>
              <option value="finance">金融・保険</option>
              <option value="real-estate">不動産</option>
              <option value="education">教育</option>
              <option value="healthcare">医療・介護</option>
              <option value="other">その他</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="interest">関心のあるサービス（複数選択可）</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="interest[]" value="lp-optimization">
                <span class="checkmark"></span>
                AI×心理学 LP最適化
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="interest[]" value="customer-analysis">
                <span class="checkmark"></span>
                顧客心理データ分析
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="interest[]" value="ai-automation">
                <span class="checkmark"></span>
                AI自動化マーケティング
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="interest[]" value="integrated-marketing">
                <span class="checkmark"></span>
                統合マーケティング戦略
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="budget">月間予算（概算）</label>
            <select id="budget" name="budget">
              <option value="">選択してください</option>
              <option value="under-30">30万円未満</option>
              <option value="30-50">30万円〜50万円</option>
              <option value="50-100">50万円〜100万円</option>
              <option value="100-300">100万円〜300万円</option>
              <option value="300-500">300万円〜500万円</option>
              <option value="over-500">500万円以上</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="challenge">現在の課題・お悩み <span class="required">*</span></label>
            <textarea id="challenge" name="challenge" rows="4" placeholder="例：売上が伸び悩んでいる、広告費が高騰している、AIツールを使いこなせない など" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="message">その他ご質問・ご要望</label>
            <textarea id="message" name="message" rows="4" placeholder="ご質問やご要望がございましたら、お気軽にお書きください"></textarea>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label privacy-check">
              <input type="checkbox" name="privacy" required>
              <span class="checkmark"></span>
              <a href="{{ '/privacy/' | relative_url }}" target="_blank">プライバシーポリシー</a>に同意する <span class="required">*</span>
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-large">
            お問い合わせを送信
          </button>
        </form>
      </div>
      
      <div class="contact-info">
        <div class="contact-card glass-card">
          <h3>会社情報</h3>
          <div class="info-item">
            <strong>{{ site.company.name }}</strong>
          </div>
          <div class="info-item">
            <span class="info-label">代表者：</span>
            {{ site.company.representative }}
          </div>
          <div class="info-item">
            <span class="info-label">住所：</span>
            {{ site.company.address }}
          </div>
          <div class="info-item">
            <span class="info-label">電話：</span>
            <a href="tel:{{ site.company.phone }}">{{ site.company.phone }}</a>
          </div>
          <div class="info-item">
            <span class="info-label">メール：</span>
            <a href="mailto:{{ site.company.email }}">{{ site.company.email }}</a>
          </div>
        </div>
        
        <div class="response-info glass-card">
          <h3>お問い合わせについて</h3>
          <ul>
            <li>通常1-2営業日以内にご返信いたします</li>
            <li>お急ぎの場合はお電話でお問い合わせください</li>
            <li>営業時間：平日 9:00-18:00</li>
            <li>土日祝日のお問い合わせは翌営業日の対応となります</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.contact-section {
  padding: 6rem 0;
  background: linear-gradient(to bottom, #0a0a0a, rgba(139, 92, 246, 0.03), #0a0a0a);
}

.contact-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 968px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.contact-intro {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-intro h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #8b5cf6;
}

.contact-intro p {
  color: #d1d5db;
  line-height: 1.6;
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #fff;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.form-group option {
  background: #1f2937;
  color: #fff;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 2rem;
  color: #d1d5db;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 1.25rem;
  width: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkbox-label:hover input ~ .checkmark {
  background: rgba(139, 92, 246, 0.2);
}

.checkbox-label input:checked ~ .checkmark {
  background: #8b5cf6;
  border-color: #8b5cf6;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label .checkmark:after {
  left: 0.25rem;
  top: 0.125rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.privacy-check {
  margin-top: 1rem;
}

.privacy-check a {
  color: #8b5cf6;
  text-decoration: none;
}

.privacy-check a:hover {
  text-decoration: underline;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-card,
.response-info {
  padding: 2rem;
}

.contact-card h3,
.response-info h3 {
  color: #8b5cf6;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.info-item {
  margin-bottom: 1rem;
  color: #d1d5db;
}

.info-label {
  color: #9ca3af;
  font-size: 0.875rem;
}

.info-item a {
  color: #8b5cf6;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.response-info ul {
  list-style: none;
  padding: 0;
}

.response-info li {
  color: #d1d5db;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.response-info li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #8b5cf6;
  font-weight: bold;
}

@media (max-width: 768px) {
  .contact-form {
    padding: 2rem;
  }
  
  .contact-intro h2 {
    font-size: 1.5rem;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .contact-form {
    padding: 1.5rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}
</style>