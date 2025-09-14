// Contact Form Handler - Google Sheets Only Version
// Google Apps Script経由でスプレッドシートに直接送信

class ContactFormGAS {
  constructor() {
    // Google Apps ScriptのWeb App URL
    // 実際のGAS Web App URLに置き換えてください
    this.gasEndpoint = 'https://script.google.com/macros/s/AKfycbyojOMN9Oj1rkktDa30HX3tYJx4jH-1BwJWhCeU6hEPjCQy0l9YXlsrylxMx0rzhW4l/exec';
    this.init();
  }

  init() {
    // すべてのお問い合わせフォームを初期化
    this.initializeForms();
  }

  initializeForms() {
    // 通常のフォーム
    const forms = document.querySelectorAll('.contact-form, #contact-form, #contactModalForm');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });

    // 既存のFormspreeアクションを削除
    forms.forEach(form => {
      form.removeAttribute('action');
      form.removeAttribute('method');
    });
  }

  async handleSubmit(event, form) {
    event.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // ローディング表示
      this.setLoadingState(submitButton, true);
      
      // フォームデータ収集
      const formData = this.collectFormData(form);
      
      // バリデーション
      if (!this.validateFormData(formData)) {
        throw new Error('入力内容をご確認ください');
      }
      
      // Google Sheetsに送信
      const result = await this.submitToGoogleSheets(formData);
      
      if (result.success) {
        this.showSuccessMessage(form);
        form.reset();
        
        // モーダルの場合は自動で閉じる
        if (form.closest('.modal')) {
          setTimeout(() => {
            this.closeModal(form.closest('.modal'));
          }, 2000);
        }
      } else {
        throw new Error(result.error || '送信に失敗しました');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(form, error.message);
    } finally {
      this.setLoadingState(submitButton, false, originalText);
    }
  }

  collectFormData(form) {
    const formData = new FormData(form);
    
    // 興味のあるサービス（チェックボックス）を結合
    const interests = formData.getAll('interest[]');
    
    return {
      timestamp: new Date().toLocaleString('ja-JP'),
      company: formData.get('company') || '',
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      inquiry_type: formData.get('inquiry_type') || formData.get('service') || '',
      interest: interests.join(', ') || '',
      message: formData.get('message') || '',
      privacy: formData.get('privacy') || false,
      source_url: window.location.href,
      user_agent: navigator.userAgent.substring(0, 100) // 長すぎるとエラーになる場合があるため
    };
  }

  validateFormData(data) {
    // 必須フィールドチェック
    if (!data.name || !data.email) {
      return false;
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }
    
    // プライバシーポリシー同意チェック
    if (!data.privacy) {
      return false;
    }
    
    return true;
  }

  async submitToGoogleSheets(data) {
    try {
      // GASエンドポイントが設定されているかチェック
      if (this.gasEndpoint === 'YOUR_GAS_WEB_APP_URL') {
        throw new Error('Google Apps Scriptの設定が必要です');
      }

      const response = await fetch(this.gasEndpoint, {
        method: 'POST',
        mode: 'no-cors', // CORSエラーを回避
        headers: {
          'Content-Type': 'text/plain', // GASではこれが必要
        },
        body: JSON.stringify(data)
      });

      // no-corsモードではレスポンスが取得できないため、常に成功とみなす
      // 実際のエラーはGAS側でメール通知することで対応
      return { success: true };
      
    } catch (error) {
      console.error('GAS submission error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  setLoadingState(button, isLoading, originalText = '') {
    button.disabled = isLoading;
    if (isLoading) {
      button.innerHTML = '<span style="margin-right: 5px;">⏳</span> 送信中...';
      button.style.opacity = '0.7';
    } else {
      button.textContent = originalText || '送信する';
      button.style.opacity = '1';
    }
  }

  showSuccessMessage(form) {
    const message = `
      <div class="form-alert form-alert-success">
        <strong>✅ 送信完了しました</strong><br>
        お問い合わせありがとうございます。<br>
        1-2営業日以内にご連絡させていただきます。
      </div>
    `;
    
    this.showMessage(form, message);
  }

  showErrorMessage(form, errorMessage) {
    const message = `
      <div class="form-alert form-alert-error">
        <strong>❌ エラーが発生しました</strong><br>
        ${errorMessage}<br>
        お手数ですが、もう一度お試しいただくか、<br>
        直接 leadfive.138@gmail.com までご連絡ください。
      </div>
    `;
    
    this.showMessage(form, message);
  }

  showMessage(form, messageHTML) {
    // 既存のメッセージを削除
    const existingMessages = form.querySelectorAll('.form-alert');
    existingMessages.forEach(msg => msg.remove());
    
    // メッセージを作成
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = messageHTML;
    
    // フォームの最初に挿入
    form.insertBefore(messageDiv.firstChild, form.firstChild);
    
    // 10秒後に自動削除
    setTimeout(() => {
      const alert = form.querySelector('.form-alert');
      if (alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
      }
    }, 10000);
  }

  closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // グローバル関数があれば呼び出し
    if (window.closeContactModal) {
      window.closeContactModal();
    }
  }
}

// DOM読み込み後に初期化
document.addEventListener('DOMContentLoaded', () => {
  window.contactFormGAS = new ContactFormGAS();
});

// モーダルが開いた時も再初期化
window.addEventListener('load', () => {
  const originalOpenContactForm = window.openContactForm;
  if (originalOpenContactForm) {
    window.openContactForm = function() {
      originalOpenContactForm();
      setTimeout(() => {
        if (window.contactFormGAS) {
          window.contactFormGAS.init();
        }
      }, 100);
    };
  }
});

// スタイル追加
const gasStyleEl = document.createElement('style');
gasStyleEl.textContent = `
  .form-alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    animation: slideIn 0.3s ease-out;
    transition: all 0.3s ease;
  }
  
  .form-alert-success {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .form-alert-error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(gasStyleEl);
