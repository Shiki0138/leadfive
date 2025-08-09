// Contact Form Enhancement with Email Integration
// Form Integration Specialist - Contact Form System

class ContactFormManager {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.isSubmitting = false;
    this.emailService = 'formspree'; // Can be 'formspree', 'netlify', or 'custom'
    this.formEndpoint = 'https://formspree.io/f/xovqzkgy'; // Will be configured
    this.config = window.formConfig || {};
    
    this.init();
  }

  init() {
    this.form = document.querySelector('.contact-form');
    if (!this.form) return;

    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.setupEventListeners();
    this.setupRealTimeValidation();
    this.addHoneypot();
    this.setupRateLimiting();
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Privacy policy checkbox validation
    const privacyCheckbox = this.form.querySelector('input[name="privacy"]');
    if (privacyCheckbox) {
      privacyCheckbox.addEventListener('change', () => {
        this.validatePrivacyConsent(privacyCheckbox);
      });
    }
  }

  setupRealTimeValidation() {
    // Email validation with better regex
    const emailInput = this.form.querySelector('#email');
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        this.validateEmail(emailInput);
      });
    }

    // Phone number formatting (Japanese format)
    const phoneInput = this.form.querySelector('#phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.formatPhoneNumber(e.target);
      });
    }
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = this.getRequiredMessage(field);
    }

    // Specific field validations
    switch (field.type) {
      case 'email':
        if (value && !this.isValidEmail(value)) {
          isValid = false;
          errorMessage = '有効なメールアドレスを入力してください';
        }
        break;
      case 'tel':
        if (value && !this.isValidPhoneNumber(value)) {
          isValid = false;
          errorMessage = '有効な電話番号を入力してください（例：03-1234-5678）';
        }
        break;
    }

    // Character limits
    if (field.maxLength && value.length > field.maxLength) {
      isValid = false;
      errorMessage = `${field.maxLength}文字以内で入力してください`;
    }

    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }

  validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const isValid = this.isValidEmail(email);
    
    if (email && !isValid) {
      this.showFieldValidation(emailInput, false, '有効なメールアドレスを入力してください');
    } else {
      this.showFieldValidation(emailInput, true, '');
    }

    return isValid;
  }

  isValidEmail(email) {
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  formatPhoneNumber(phoneInput) {
    let value = phoneInput.value.replace(/[^\d-]/g, '');
    
    // Japanese phone number formatting
    if (value.length > 0) {
      if (value.startsWith('0')) {
        // Mobile: 090-1234-5678, Landline: 03-1234-5678
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 7) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
          value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
      }
    }
    
    phoneInput.value = value;
  }

  isValidPhoneNumber(phone) {
    // Japanese phone number validation
    const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$|^0\d{9,10}$/;
    return phoneRegex.test(phone.replace(/-/g, '')) || phoneRegex.test(phone);
  }

  validatePrivacyConsent(checkbox) {
    const isValid = checkbox.checked;
    this.showFieldValidation(checkbox, isValid, isValid ? '' : 'プライバシーポリシーに同意してください');
    return isValid;
  }

  showFieldValidation(field, isValid, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Add/remove error styling
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && field.value.trim());

    // Add error message
    if (!isValid && message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  getRequiredMessage(field) {
    const label = field.parentNode.querySelector('label')?.textContent || '';
    const fieldName = label.replace(' *', '').trim();
    return `${fieldName}は必須項目です`;
  }

  addHoneypot() {
    // Add honeypot field for spam protection
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website'; // Common honeypot name
    honeypot.style.display = 'none';
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    
    this.form.appendChild(honeypot);
  }

  setupRateLimiting() {
    // Simple client-side rate limiting
    const lastSubmit = localStorage.getItem('lastFormSubmit');
    const now = Date.now();
    const cooldown = 60000; // 1 minute cooldown

    if (lastSubmit && (now - parseInt(lastSubmit)) < cooldown) {
      const remaining = Math.ceil((cooldown - (now - parseInt(lastSubmit))) / 1000);
      this.showMessage(`送信から${remaining}秒後に再度お試しください`, 'warning');
      this.submitButton.disabled = true;
      
      setTimeout(() => {
        this.submitButton.disabled = false;
      }, remaining * 1000);
    }
  }

  async handleSubmit() {
    if (this.isSubmitting) return;
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    // Check privacy consent
    const privacyCheckbox = this.form.querySelector('input[name="privacy"]');
    if (privacyCheckbox && !this.validatePrivacyConsent(privacyCheckbox)) {
      isFormValid = false;
    }

    // Check honeypot
    const honeypot = this.form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      // Potential spam, fail silently
      this.showMessage('送信が完了しました。ありがとうございます。', 'success');
      return;
    }

    if (!isFormValid) {
      this.showMessage('入力内容をご確認ください', 'error');
      return;
    }

    this.isSubmitting = true;
    this.setSubmitState(true);

    try {
      const success = await this.submitForm();
      if (success) {
        this.showSuccessMessage();
        this.resetForm();
        localStorage.setItem('lastFormSubmit', Date.now().toString());
      } else {
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage();
    } finally {
      this.isSubmitting = false;
      this.setSubmitState(false);
    }
  }

  async submitForm() {
    const formData = new FormData(this.form);
    
    // Add metadata
    formData.append('_subject', '【LeadFive】お問い合わせ');
    formData.append('_replyto', formData.get('email'));
    formData.append('_next', window.location.origin + '/contact/thank-you/');
    
    // Format the message
    const interests = formData.getAll('interest[]').join(', ');
    if (interests) {
      formData.set('interest', interests);
      formData.delete('interest[]');
    }

    try {
      const response = await fetch(this.formEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Network error:', error);
      return false;
    }
  }

  setSubmitState(isSubmitting) {
    if (this.submitButton) {
      this.submitButton.disabled = isSubmitting;
      this.submitButton.innerHTML = isSubmitting 
        ? '<i class="fas fa-spinner fa-spin"></i> 送信中...' 
        : 'お問い合わせを送信';
    }
  }

  showSuccessMessage() {
    const successMsg = this.config.messages?.success || {
      title: '送信が完了しました！',
      body: '通常1-2営業日以内にご返信いたします。'
    };
    
    this.showMessage(
      `${successMsg.title}<br>${successMsg.body}`,
      'success'
    );
  }

  showErrorMessage() {
    const errorMsg = this.config.messages?.error || {
      title: '送信中にエラーが発生しました',
      body: 'お手数ですが、再度お試しいただくか、直接メールでご連絡ください。'
    };
    
    this.showMessage(
      `${errorMsg.title}<br>${errorMsg.body}`,
      'error'
    );
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.innerHTML = message;

    // Insert message
    this.form.parentNode.insertBefore(messageElement, this.form);

    // Auto-remove after delay
    setTimeout(() => {
      messageElement.remove();
    }, type === 'success' ? 10000 : 8000);

    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  resetForm() {
    this.form.reset();
    
    // Clear validation states
    const fields = this.form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.classList.remove('error', 'valid');
      this.clearFieldError(field);
    });
  }
}

// Auto-resize textarea
function autoResizeTextarea() {
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  });
}

// Touch-friendly form enhancements for mobile
function enhanceMobileForm() {
  // Improve mobile keyboard experience
  const emailInput = document.querySelector('#email');
  if (emailInput) {
    emailInput.setAttribute('inputmode', 'email');
    emailInput.setAttribute('autocomplete', 'email');
  }

  const phoneInput = document.querySelector('#phone');
  if (phoneInput) {
    phoneInput.setAttribute('inputmode', 'tel');
    phoneInput.setAttribute('autocomplete', 'tel');
  }

  const nameInput = document.querySelector('#name');
  if (nameInput) {
    nameInput.setAttribute('autocomplete', 'name');
  }

  const companyInput = document.querySelector('#company');
  if (companyInput) {
    companyInput.setAttribute('autocomplete', 'organization');
  }

  // Increase tap targets for mobile
  if (window.innerWidth <= 768) {
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(label => {
      label.style.minHeight = '44px';
      label.style.alignItems = 'center';
    });
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormManager();
  autoResizeTextarea();
  enhanceMobileForm();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactFormManager;
}