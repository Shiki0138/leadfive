---
layout: default
title: お問い合わせありがとうございます
permalink: /contact/thank-you/
---

<section class="thank-you-section">
  <div class="container">
    <div class="thank-you-container">
      <div class="thank-you-icon">
        ✅
      </div>
      
      <h1>お問い合わせありがとうございます</h1>
      
      <p>
        この度は、LeadFiveにお問い合わせいただき、<br>
        誠にありがとうございます。
      </p>
      
      <div class="thank-you-message glass-card">
        <h3>今後の流れについて</h3>
        <ul class="process-list">
          <li>
            <span class="step-number">1</span>
            <div class="step-content">
              <strong>確認メール送信</strong>
              <p>ご入力いただいたメールアドレスに、確認メールをお送りしました。</p>
            </div>
          </li>
          <li>
            <span class="step-number">2</span>
            <div class="step-content">
              <strong>内容確認・分析</strong>
              <p>お送りいただいた内容を詳しく確認し、最適なご提案を準備いたします。</p>
            </div>
          </li>
          <li>
            <span class="step-number">3</span>
            <div class="step-content">
              <strong>ご返信（1-2営業日以内）</strong>
              <p>担当者より具体的なご提案と次のステップについてご連絡いたします。</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div class="contact-info-summary glass-card">
        <h3>お急ぎの場合</h3>
        <p>お急ぎのご相談がございましたら、<br>お電話でも承っております。</p>
        <div class="contact-details">
          <div class="contact-item">
            <span class="icon">📞</span>
            <a href="tel:{{ site.company.phone }}">{{ site.company.phone }}</a>
          </div>
          <div class="contact-item">
            <span class="icon">📧</span>
            <a href="mailto:{{ site.company.email }}">{{ site.company.email }}</a>
          </div>
          <div class="contact-item">
            <span class="icon">🕒</span>
            <span>営業時間：平日 9:00-18:00</span>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <a href="{{ '/' | relative_url }}" class="btn btn-primary">
          ホームに戻る
        </a>
        <a href="{{ '/services/' | relative_url }}" class="btn btn-secondary">
          サービス詳細を見る
        </a>
      </div>
      
      <div class="social-follow">
        <p>最新情報は各種SNSでも配信しています</p>
        <div class="social-links">
          <a href="https://twitter.com/leadfive" target="_blank" rel="noopener" class="social-link twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/company/leadfive" target="_blank" rel="noopener" class="social-link linkedin">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="https://www.facebook.com/leadfive" target="_blank" rel="noopener" class="social-link facebook">
            <i class="fab fa-facebook"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.thank-you-section {
  padding: 6rem 0;
  background: linear-gradient(to bottom, #0a0a0a, rgba(139, 92, 246, 0.03), #0a0a0a);
  min-height: 80vh;
}

.thank-you-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.thank-you-icon {
  font-size: 4rem;
  margin-bottom: 2rem;
  animation: bounceIn 0.8s ease-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.thank-you-container h1 {
  color: #8b5cf6;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.thank-you-container > p {
  color: #d1d5db;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.thank-you-message,
.contact-info-summary {
  margin-bottom: 2rem;
  padding: 2rem;
  text-align: left;
}

.thank-you-message h3,
.contact-info-summary h3 {
  color: #8b5cf6;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.process-list {
  list-style: none;
  padding: 0;
}

.process-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 10px;
  border-left: 3px solid #8b5cf6;
}

.step-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: #8b5cf6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.step-content strong {
  color: #fff;
  display: block;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #d1d5db;
  margin: 0;
  line-height: 1.5;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #d1d5db;
}

.contact-item .icon {
  font-size: 1.2rem;
  width: 1.5rem;
  text-align: center;
}

.contact-item a {
  color: #8b5cf6;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.social-follow {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-follow p {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  width: 3rem;
  height: 3rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #8b5cf6;
  color: white;
  transform: translateY(-2px);
}

.social-link.twitter:hover { background: #1da1f2; }
.social-link.linkedin:hover { background: #0077b5; }
.social-link.facebook:hover { background: #1877f2; }

@media (max-width: 768px) {
  .thank-you-container h1 {
    font-size: 2rem;
  }
  
  .process-list li {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    margin: 0 auto 1rem auto;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .contact-details {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .thank-you-section {
    padding: 4rem 0;
  }
  
  .thank-you-message,
  .contact-info-summary {
    padding: 1.5rem;
  }
  
  .thank-you-icon {
    font-size: 3rem;
  }
}
</style>