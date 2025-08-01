---
layout: default
title: お問い合わせ | LeadFive - AI×心理学マーケティング
permalink: /contact/
description: AI×心理学マーケティングのご相談はLeadFiveへ。無料診断・サービス詳細・料金についてお気軽にお問い合わせください。
---

<section class="contact-hero">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="gradient-text">あなたのビジネスの可能性を</span><br>
        一緒に探りませんか？
      </h1>
      <p class="hero-subtitle">
        AI×心理学マーケティングで売上を科学的に伸ばしましょう。<br>
        まずはお気軽にご相談ください。
      </p>
      <div class="hero-badges">
        <div class="badge">
          <span class="badge-icon">⚡</span>
          <span>最大300%売上向上</span>
        </div>
        <div class="badge">
          <span class="badge-icon">🎯</span>
          <span>1-2営業日で回答</span>
        </div>
        <div class="badge">
          <span class="badge-icon">🛡️</span>
          <span>完全無料相談</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="contact-section">
  <div class="container">
    <div class="contact-content">
      <div class="contact-form-container">
        <!-- Quick Contact Options -->
        <div class="quick-contact">
          <h2>お急ぎの方はこちら</h2>
          <div class="quick-options">
            <a href="tel:{{ site.company.phone }}" class="quick-option">
              <div class="quick-icon">📞</div>
              <div class="quick-text">
                <strong>電話で相談</strong>
                <span>{{ site.company.phone }}</span>
              </div>
            </a>
            <a href="mailto:{{ site.company.email }}" class="quick-option">
              <div class="quick-icon">✉️</div>
              <div class="quick-text">
                <strong>メールで相談</strong>
                <span>{{ site.company.email }}</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Main Contact Form -->
        <div class="main-form">
          <div class="form-header">
            <h2>詳しいご相談はフォームから</h2>
            <p>下記フォームにご記入いただくと、より具体的なご提案が可能です</p>
          </div>
          
          <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form" id="contactForm">
            <input type="hidden" name="_to" value="{{ site.forms.contact_email }}">
            <input type="hidden" name="_subject" value="【LeadFive】お問い合わせ">
            <input type="hidden" name="_cc" value="{{ site.forms.contact_email }}">
            <input type="hidden" name="_next" value="{{ site.url }}{{ site.baseurl }}/contact/success/">
            
            <!-- Step 1: Basic Information -->
            <div class="form-step active" data-step="1">
              <div class="step-header">
                <h3>基本情報</h3>
                <div class="step-indicator">
                  <span class="step-number">1</span> / 4
                </div>
              </div>
              
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
                <label for="position">役職</label>
                <select id="position" name="position">
                  <option value="">選択してください</option>
                  <option value="ceo">代表取締役・CEO</option>
                  <option value="cto">CTO・技術責任者</option>
                  <option value="cmo">CMO・マーケティング責任者</option>
                  <option value="manager">部長・マネージャー</option>
                  <option value="director">取締役・役員</option>
                  <option value="staff">担当者</option>
                  <option value="consultant">コンサルタント</option>
                  <option value="freelancer">フリーランス</option>
                  <option value="other">その他</option>
                </select>
              </div>
            </div>

            <!-- Step 2: Business Information -->
            <div class="form-step" data-step="2">
              <div class="step-header">
                <h3>事業情報</h3>
                <div class="step-indicator">
                  <span class="step-number">2</span> / 4
                </div>
              </div>
              
              <div class="form-group">
                <label for="business-type">業種 <span class="required">*</span></label>
                <select id="business-type" name="business-type" required>
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
                  <option value="food">飲食</option>
                  <option value="it">IT・システム開発</option>
                  <option value="media">メディア・広告</option>
                  <option value="other">その他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="company-size">従業員数</label>
                <select id="company-size" name="company-size">
                  <option value="">選択してください</option>
                  <option value="1">個人事業主</option>
                  <option value="2-10">2-10名</option>
                  <option value="11-50">11-50名</option>
                  <option value="51-100">51-100名</option>
                  <option value="101-500">101-500名</option>
                  <option value="501-1000">501-1000名</option>
                  <option value="1000+">1000名以上</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="annual-revenue">年商（概算）</label>
                <select id="annual-revenue" name="annual-revenue">
                  <option value="">選択してください</option>
                  <option value="under-1000">1000万円未満</option>
                  <option value="1000-5000">1000万円〜5000万円</option>
                  <option value="5000-1oku">5000万円〜1億円</option>
                  <option value="1-5oku">1億円〜5億円</option>
                  <option value="5-10oku">5億円〜10億円</option>
                  <option value="10oku+">10億円以上</option>
                </select>
              </div>
            </div>

            <!-- Step 3: Service Interest -->
            <div class="form-step" data-step="3">
              <div class="step-header">
                <h3>ご関心のあるサービス</h3>
                <div class="step-indicator">
                  <span class="step-number">3</span> / 4
                </div>
              </div>
              
              <div class="form-group">
                <label>関心のあるサービス（複数選択可）<span class="required">*</span></label>
                <div class="service-grid">
                  <label class="service-card">
                    <input type="checkbox" name="interest[]" value="lp-optimization" required>
                    <div class="service-content">
                      <div class="service-icon">🚀</div>
                      <h4>AI×心理学 LP最適化</h4>
                      <p>8つの本能を刺激してCVRを最大300%向上</p>
                    </div>
                  </label>
                  
                  <label class="service-card">
                    <input type="checkbox" name="interest[]" value="customer-analysis">
                    <div class="service-content">
                      <div class="service-icon">🧠</div>
                      <h4>顧客心理データ分析</h4>
                      <p>購買心理を可視化し、売上予測を実現</p>
                    </div>
                  </label>
                  
                  <label class="service-card">
                    <input type="checkbox" name="interest[]" value="ai-automation">
                    <div class="service-content">
                      <div class="service-icon">⚡</div>
                      <h4>AI自動化マーケティング</h4>
                      <p>ChatGPTを活用した24時間稼働システム</p>
                    </div>
                  </label>
                  
                  <label class="service-card">
                    <input type="checkbox" name="interest[]" value="integrated-marketing">
                    <div class="service-content">
                      <div class="service-icon">🎯</div>
                      <h4>統合マーケティング戦略</h4>
                      <p>AI×心理学で包括的な成長戦略を構築</p>
                    </div>
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
                  <option value="500-1000">500万円〜1000万円</option>
                  <option value="over-1000">1000万円以上</option>
                </select>
              </div>
            </div>

            <!-- Step 4: Detailed Request -->
            <div class="form-step" data-step="4">
              <div class="step-header">
                <h3>詳細なご相談内容</h3>
                <div class="step-indicator">
                  <span class="step-number">4</span> / 4
                </div>
              </div>
              
              <div class="form-group">
                <label for="current-situation">現在の状況</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" name="current-situation[]" value="low-conversion">
                    <span class="checkmark"></span>
                    コンバージョン率が低い
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="current-situation[]" value="high-ad-cost">
                    <span class="checkmark"></span>
                    広告費が高騰している
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="current-situation[]" value="customer-analysis">
                    <span class="checkmark"></span>
                    顧客分析ができていない
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="current-situation[]" value="ai-utilization">
                    <span class="checkmark"></span>
                    AIを活用できていない
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="current-situation[]" value="sales-stagnation">
                    <span class="checkmark"></span>
                    売上が伸び悩んでいる
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="current-situation[]" value="no-digital-strategy">
                    <span class="checkmark"></span>
                    デジタル戦略がない
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="challenge">具体的な課題・お悩み <span class="required">*</span></label>
                <textarea id="challenge" name="challenge" rows="5" placeholder="例：
・売上が前年同期比で減少している
・広告費対効果が悪化している
・新規顧客獲得に苦戦している
・ChatGPTなどのAIツールを導入したいが方法がわからない
・競合他社に差を付けられている

具体的な数値や状況をお聞かせください。" required></textarea>
              </div>
              
              <div class="form-group">
                <label for="goals">達成したい目標</label>
                <textarea id="goals" name="goals" rows="4" placeholder="例：
・売上を6ヶ月で30%向上させたい
・広告費を半減させながら売上を維持したい
・新しい収益源を構築したい
・AIを活用した効率的な営業体制を構築したい"></textarea>
              </div>
              
              <div class="form-group">
                <label for="timeline">導入希望時期</label>
                <select id="timeline" name="timeline">
                  <option value="">選択してください</option>
                  <option value="asap">すぐにでも</option>
                  <option value="1month">1ヶ月以内</option>
                  <option value="3months">3ヶ月以内</option>
                  <option value="6months">6ヶ月以内</option>
                  <option value="1year">1年以内</option>
                  <option value="undecided">未定</option>
                </select>
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
            </div>
            
            <!-- Form Navigation -->
            <div class="form-navigation">
              <button type="button" class="btn btn-outline prev-btn" onclick="prevStep()" style="display: none;">
                ← 前へ
              </button>
              <button type="button" class="btn btn-primary next-btn" onclick="nextStep()">
                次へ →
              </button>
              <button type="submit" class="btn btn-primary submit-btn" style="display: none;">
                お問い合わせを送信
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Contact Information -->
      <div class="contact-info">
        <div class="contact-card glass-card">
          <h3>会社情報</h3>
          <div class="company-info">
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
        </div>
        
        <div class="response-info glass-card">
          <h3>お問い合わせについて</h3>
          <div class="response-timeline">
            <div class="timeline-item">
              <div class="timeline-icon">📧</div>
              <div class="timeline-content">
                <h4>お問い合わせ受付</h4>
                <p>フォーム送信後、自動返信メールをお送りします</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">🔍</div>
              <div class="timeline-content">
                <h4>内容確認・分析</h4>
                <p>1営業日以内に内容を確認し、最適な提案を準備</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">📞</div>
              <div class="timeline-content">
                <h4>初回ご提案</h4>
                <p>2営業日以内にお電話またはメールでご連絡</p>
              </div>
            </div>
          </div>
          
          <div class="contact-hours">
            <h4>営業時間</h4>
            <p>平日 9:00-18:00</p>
            <p class="note">土日祝日のお問い合わせは翌営業日の対応となります</p>
          </div>
        </div>

        <div class="success-stories glass-card">
          <h3>お客様の成功事例</h3>
          <div class="story-item">
            <div class="story-icon">📈</div>
            <div class="story-content">
              <h4>美容サロンA社</h4>
              <p>売上<strong>280%向上</strong></p>
              <span class="story-detail">AI心理分析で顧客単価が大幅アップ</span>
            </div>
          </div>
          <div class="story-item">
            <div class="story-icon">💰</div>
            <div class="story-content">
              <h4>EC事業B社</h4>
              <p>広告費<strong>60%削減</strong></p>
              <span class="story-detail">CVR最適化で効率的な集客を実現</span>
            </div>
          </div>
          <div class="story-item">
            <div class="story-icon">🚀</div>
            <div class="story-content">
              <h4>コンサル業C社</h4>
              <p>新規顧客<strong>5倍増加</strong></p>
              <span class="story-detail">AI自動化で24時間営業体制を構築</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.contact-hero {
  padding: 8rem 0 4rem;
  background: 
    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.2;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #d1d5db;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.hero-badges {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-icon {
  font-size: 1.25rem;
}

.contact-section {
  padding: 4rem 0;
}

.contact-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.quick-contact {
  margin-bottom: 3rem;
  text-align: center;
}

.quick-contact h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #f3f4f6;
}

.quick-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .quick-options {
    grid-template-columns: 1fr;
  }
}

.quick-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 15px;
  text-decoration: none;
  color: #fff;
  transition: all 0.3s ease;
}

.quick-option:hover {
  background: rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
}

.quick-icon {
  font-size: 2rem;
}

.quick-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.quick-text strong {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.quick-text span {
  color: #d1d5db;
  font-size: 0.875rem;
}

.main-form {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
}

.form-header {
  text-align: center;
  margin-bottom: 3rem;
}

.form-header h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #f3f4f6;
}

.form-header p {
  color: #d1d5db;
  line-height: 1.6;
}

.form-step {
  display: none;
}

.form-step.active {
  display: block;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.step-header h3 {
  font-size: 1.5rem;
  color: #f3f4f6;
}

.step-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.step-number {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
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
  padding: 0.875rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group option {
  background: #1f2937;
  color: #fff;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.service-card {
  position: relative;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.service-card input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.service-content {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.service-card:hover .service-content {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.service-card input:checked + .service-content {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.service-content h4 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.service-content p {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.4;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 2rem;
  color: #d1d5db;
  font-weight: normal;
  transition: color 0.3s ease;
}

.checkbox-label:hover {
  color: #fff;
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
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.privacy-check {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.privacy-check a {
  color: #8b5cf6;
  text-decoration: none;
}

.privacy-check a:hover {
  text-decoration: underline;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-navigation .btn {
    width: 100%;
  }
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-card,
.response-info,
.success-stories {
  padding: 2rem;
  border-radius: 15px;
}

.contact-card h3,
.response-info h3,
.success-stories h3 {
  color: #8b5cf6;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.company-info {
  space-y: 1rem;
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

.response-timeline {
  margin-bottom: 2rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  background: rgba(139, 92, 246, 0.2);
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.timeline-content h4 {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.timeline-content p {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.4;
}

.contact-hours {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-hours h4 {
  color: #f3f4f6;
  margin-bottom: 0.5rem;
}

.contact-hours p {
  color: #d1d5db;
  margin-bottom: 0.25rem;
}

.contact-hours .note {
  color: #9ca3af;
  font-size: 0.875rem;
}

.success-stories {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.story-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.story-item:last-child {
  margin-bottom: 0;
}

.story-icon {
  width: 40px;
  height: 40px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.story-content h4 {
  color: #fff;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.story-content p {
  color: #8b5cf6;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.story-detail {
  color: #d1d5db;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 6rem 0 3rem;
  }
  
  .hero-badges {
    flex-direction: column;
    align-items: center;
  }
  
  .main-form {
    padding: 2rem;
  }
  
  .service-grid {
    grid-template-columns: 1fr;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
let currentStep = 1;
const totalSteps = 4;

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => {
    s.classList.remove('active');
  });
  
  // Show current step
  document.querySelector(`[data-step="${step}"]`).classList.add('active');
  
  // Update navigation buttons
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const submitBtn = document.querySelector('.submit-btn');
  
  if (step === 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  } else if (step === totalSteps) {
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  } else {
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  }
}

function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function validateCurrentStep() {
  const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
  const requiredInputs = currentStepElement.querySelectorAll('[required]');
  
  for (let input of requiredInputs) {
    if (input.type === 'checkbox') {
      // For checkbox groups, check if at least one is checked in the group
      const groupName = input.name;
      const checkboxGroup = document.querySelectorAll(`input[name="${groupName}"]`);
      const isGroupValid = Array.from(checkboxGroup).some(cb => cb.checked);
      
      if (!isGroupValid) {
        input.focus();
        alert('必須項目を選択してください。');
        return false;
      }
    } else if (!input.value.trim()) {
      input.focus();
      alert('必須項目を入力してください。');
      return false;
    }
  }
  
  return true;
}

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (!validateCurrentStep()) {
    return;
  }
  
  // Show loading state
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '送信中...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual submission logic)
  setTimeout(() => {
    alert('お問い合わせを送信しました。ありがとうございます。');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    // Reset form or redirect to success page
    window.location.href = '/contact/success/';
  }, 2000);
});

// Initialize first step
showStep(1);

// Auto-save form data to localStorage
function saveFormData() {
  const formData = new FormData(document.getElementById('contactForm'));
  const data = {};
  formData.forEach((value, key) => {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });
  localStorage.setItem('contactFormData', JSON.stringify(data));
}

// Load saved form data
function loadFormData() {
  const savedData = localStorage.getItem('contactFormData');
  if (savedData) {
    const data = JSON.parse(savedData);
    Object.keys(data).forEach(key => {
      const input = document.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          const values = Array.isArray(data[key]) ? data[key] : [data[key]];
          values.forEach(value => {
            const checkbox = document.querySelector(`[name="${key}"][value="${value}"]`);
            if (checkbox) checkbox.checked = true;
          });
        } else {
          input.value = data[key];
        }
      }
    });
  }
}

// Save form data on input change
document.getElementById('contactForm').addEventListener('input', saveFormData);
document.getElementById('contactForm').addEventListener('change', saveFormData);

// Load saved data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Clear saved data on successful submission
document.getElementById('contactForm').addEventListener('submit', function() {
  localStorage.removeItem('contactFormData');
});
</script>