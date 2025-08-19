// Contact Modal Functionality
(function() {
  'use strict';

  // Initialize contact modal when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    initContactModal();
  });

  // Initialize contact modal
  function initContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    // Close modal on backdrop click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        window.closeContactModal();
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        window.closeContactModal();
      }
    });

    // Initialize form validation
    initFormValidation();
  }

  // Form validation
  function initFormValidation() {
    const form = document.getElementById('contactModalForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        submitForm(form);
      }
    });
  }

  // Validate individual field
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;

    // Remove previous error
    field.classList.remove('error');
    const errorMsg = field.parentElement.querySelector('.field-error');
    if (errorMsg) {
      errorMsg.remove();
    }

    // Check required
    if (field.hasAttribute('required') && !value) {
      showError(field, '必須項目です');
      return false;
    }

    // Check email
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, '有効なメールアドレスを入力してください');
        return false;
      }
    }

    // Check phone
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d-+\s\(\)]+$/;
      if (!phoneRegex.test(value)) {
        showError(field, '有効な電話番号を入力してください');
        return false;
      }
    }

    // Add valid class
    if (value) {
      field.classList.add('valid');
    }

    return isValid;
  }

  // Show error message
  function showError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');

    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    field.parentElement.appendChild(error);
  }

  // Submit form
  function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;
    form.classList.add('form-loading');

    // Prepare form data
    const formData = new FormData(form);
    const data = {
      company: formData.get('company'),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      inquiry_type: formData.get('inquiry_type'),
      message: formData.get('message'),
      privacy: formData.get('privacy'),
      _subject: '【LeadFive】お問い合わせ',
      _to: 'leadfive.138@gmail.com'
    };

    // Send to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbxufN4CPujE75vKqgeMqKMhumfFm9HE4j4pN0sZMSaKJGXS7wP5vp6P1d5jKgz8LIne/exec', {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      // no-corsモードでは常に成功として扱う
      showSuccessMessage();
      form.reset();
      setTimeout(() => {
        window.closeContactModal();
      }, 3000);
    })
    .catch(error => {
      // Show error message
      showFormMessage('送信に失敗しました。もう一度お試しください。', 'error');
    })
    .finally(() => {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.classList.remove('form-loading');
    });
  }

  // Show success message
  function showSuccessMessage() {
    const modal = document.getElementById('contact-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
      <div class="success-message">
        <div class="success-icon">✅</div>
        <h3>送信完了</h3>
        <p>お問い合わせありがとうございます。</p>
        <p>1-2営業日以内にご連絡させていただきます。</p>
      </div>
    `;
  }

  // Show form message
  function showFormMessage(message, type = 'success') {
    const form = document.getElementById('contactModalForm');
    const existingMsg = form.querySelector('.form-message');
    
    if (existingMsg) {
      existingMsg.remove();
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message ${type}`;
    msgDiv.textContent = message;
    
    form.insertBefore(msgDiv, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
      msgDiv.remove();
    }, 5000);
  }

  // Expose validation function globally
  window.validateContactModalField = validateField;
})();