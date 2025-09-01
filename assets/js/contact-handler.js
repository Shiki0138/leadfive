// Contact Form Handler with Email and Google Sheets Integration
// Handles form submission to leadfive.138@gmail.com

class ContactFormHandler {
  constructor() {
    this.emailAddress = 'leadfive.138@gmail.com';
    this.formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree ID
    this.googleSheetsWebhook = null; // Will be configured if needed
    this.init();
  }

  init() {
    // Initialize all contact forms on the page
    this.initializeContactForms();
    this.initializeModalForms();
  }

  initializeContactForms() {
    // Handle regular contact forms
    const contactForms = document.querySelectorAll('.contact-form, #contact-form');
    contactForms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    });
  }

  initializeModalForms() {
    // Handle modal contact forms
    const modalForms = document.querySelectorAll('#contactModalForm, .modal-contact-form');
    modalForms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    });
  }

  async handleFormSubmit(event, form) {
    event.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // Show loading state
      this.setLoadingState(submitButton, true);
      
      // Collect form data
      const formData = this.collectFormData(form);
      
      // Validate form data
      if (!this.validateFormData(formData)) {
        throw new Error('入力内容に不備があります');
      }
      
      // Submit to multiple endpoints
      const results = await Promise.allSettled([
        this.submitToFormspree(formData),
        this.submitToGoogleSheets(formData)
      ]);
      
      // Check if at least one submission succeeded
      const hasSuccess = results.some(result => result.status === 'fulfilled');
      
      if (hasSuccess) {
        this.showSuccessMessage(form);
        form.reset();
        
        // Close modal if it's a modal form
        if (form.closest('.modal')) {
          setTimeout(() => {
            this.closeModal(form.closest('.modal'));
          }, 2000);
        }
      } else {
        throw new Error('送信に失敗しました');
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
    const data = {
      company: formData.get('company') || '',
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      inquiry_type: formData.get('inquiry_type') || formData.get('service') || '',
      interest: formData.getAll('interest[]').join(', ') || '',
      message: formData.get('message') || '',
      privacy: formData.get('privacy') || false,
      timestamp: new Date().toISOString(),
      source_url: window.location.href,
      user_agent: navigator.userAgent
    };
    
    return data;
  }

  validateFormData(data) {
    // Required fields
    if (!data.name || !data.email) {
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }
    
    // Privacy consent
    if (!data.privacy) {
      return false;
    }
    
    return true;
  }

  async submitToFormspree(data) {
    // For Formspree, we need to format the data properly
    const formspreeData = {
      email: data.email,
      name: data.name,
      company: data.company,
      phone: data.phone,
      message: this.formatMessage(data),
      _subject: `【LeadFive】お問い合わせ: ${data.name}様`,
      _replyto: data.email,
      _cc: this.emailAddress
    };

    const response = await fetch(this.formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formspreeData)
    });

    if (!response.ok) {
      throw new Error('Formspree submission failed');
    }

    return response.json();
  }

  async submitToGoogleSheets(data) {
    // Google Sheets integration via Web App or Apps Script
    if (!this.googleSheetsWebhook) {
      // If no webhook configured, skip this step
      return null;
    }

    const response = await fetch(this.googleSheetsWebhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // no-cors mode doesn't give us response details
    return { status: 'submitted' };
  }

  formatMessage(data) {
    return `
お問い合わせ内容：

【会社名】${data.company}
【お名前】${data.name}
【メール】${data.email}
【電話番号】${data.phone}
【お問い合わせ種別】${data.inquiry_type}
【興味のあるサービス】${data.interest}

【メッセージ】
${data.message}

【送信日時】${new Date(data.timestamp).toLocaleString('ja-JP')}
【送信元URL】${data.source_url}
    `.trim();
  }

  setLoadingState(button, isLoading, originalText = '') {
    button.disabled = isLoading;
    if (isLoading) {
      button.innerHTML = '<span class="spinner">⏳</span> 送信中...';
      button.classList.add('loading');
    } else {
      button.textContent = originalText || '送信する';
      button.classList.remove('loading');
    }
  }

  showSuccessMessage(form) {
    const message = `
      <div class="alert alert-success">
        <strong>✅ 送信完了</strong><br>
        お問い合わせありがとうございます。<br>
        1-2営業日以内にご連絡させていただきます。
      </div>
    `;
    
    this.showMessage(form, message);
  }

  showErrorMessage(form, errorMessage) {
    const message = `
      <div class="alert alert-error">
        <strong>❌ エラー</strong><br>
        ${errorMessage}<br>
        お手数ですが、もう一度お試しいただくか、<br>
        直接 ${this.emailAddress} までご連絡ください。
      </div>
    `;
    
    this.showMessage(form, message);
  }

  showMessage(form, messageHTML) {
    // Remove existing messages
    const existingMessages = form.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message container
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = messageHTML;
    
    // Insert at the top of the form
    form.insertBefore(messageDiv.firstChild, form.firstChild);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      const alert = form.querySelector('.alert');
      if (alert) {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
      }
    }, 10000);
  }

  closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Trigger any close handlers
    if (window.closeContactModal) {
      window.closeContactModal();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contactFormHandler = new ContactFormHandler();
});

// Also initialize when openContactForm is called
window.addEventListener('load', () => {
  // Override openContactForm to ensure handler is attached
  const originalOpenContactForm = window.openContactForm;
  if (originalOpenContactForm) {
    window.openContactForm = function() {
      originalOpenContactForm();
      // Re-initialize forms after modal opens
      setTimeout(() => {
        if (window.contactFormHandler) {
          window.contactFormHandler.init();
        }
      }, 100);
    };
  }
});

// Add CSS for loading states
const chStyleEl = document.createElement('style');
chStyleEl.textContent = `
  .alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    animation: slideIn 0.3s ease-out;
  }
  
  .alert-success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #6ee7b7;
  }
  
  .alert-error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }
  
  .loading .spinner {
    display: inline-block;
    animation: spin 1s linear infinite;
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
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(chStyleEl);
