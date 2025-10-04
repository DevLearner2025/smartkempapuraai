// SmartKempapuraAI Application JavaScript

// Global variables
let currentPage = 'homepage';

// DOM Elements
const homepage = document.getElementById('homepage');
const contactPage = document.getElementById('contact-page');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show homepage by default
    showHomepage();
    
    // Add form validation listeners
    if (contactForm) {
        addFormValidation();
    }
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Add smooth scrolling for navigation links
    addSmoothScrolling();
    
    console.log('SmartKempapuraAI application initialized');
}

// Page Navigation Functions
function showHomepage() {
    if (homepage && contactPage) {
        homepage.classList.add('active');
        contactPage.classList.remove('active');
        currentPage = 'homepage';
        document.title = 'SmartKempapuraAI - AI-Powered Tutoring for ICSE & CBSE Students';
        window.scrollTo(0, 0);
    }
}

function showContactPage() {
    if (homepage && contactPage) {
        homepage.classList.remove('active');
        contactPage.classList.add('active');
        currentPage = 'contact';
        document.title = 'Contact Us - SmartKempapuraAI';
        window.scrollTo(0, 0);
        
        // Focus on first form field for better UX
        const firstInput = contactForm ? contactForm.querySelector('input[type="text"]') : null;
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Mobile Menu Functions
function initializeMobileMenu() {
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('.nav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.remove('active');
    }
}

// Smooth Scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Validation Functions
function addFormValidation() {
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    // Add real-time validation for individual fields
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
        field.addEventListener('change', () => {
            validateField(field);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Specific validation rules (only apply if value exists)
    if (value) {
        switch (fieldName) {
            case 'phoneNumber':
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit mobile number.';
                }
                break;
                
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name should be at least 2 characters long.';
                }
                break;
        }
    }
    
    // Update field appearance and error message
    if (isValid) {
        field.classList.remove('error');
        clearFieldError(fieldName);
    } else {
        field.classList.add('error');
        showFieldError(fieldName, errorMessage);
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate entire form
    if (!validateForm()) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error, .error-message.show');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Collect form data
    const formData = collectFormData();
    
    // Send email using EmailJS
emailjs.sendForm('service_smartkempapura', 'template_contact', contactForm)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        contactForm.reset();
        
        // Clear any validation errors
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.classList.remove('show'));
        const errorFields = contactForm.querySelectorAll('.form-control.error');
        errorFields.forEach(field => field.classList.remove('error'));
        
    }, function(error) {
        console.log('FAILED...', error);
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        // Show error alert
        alert('Failed to send form. Please try again or contact us directly at smartkempapuraai@gmail.com');
    });

}

function validateForm() {
    let isValid = true;
    
    // Validate all required fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function collectFormData() {
    const data = {};
    
    // Collect form inputs
    const inputs = contactForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.name) {
            data[input.name] = input.value;
        }
    });
    
    // Add timestamp and metadata
    data.submissionTime = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer;
    data.currentPage = currentPage;
    
    return data;
}

// Modal Functions
function showSuccessModal() {
    if (successModal) {
        successModal.classList.remove('hidden');
        successModal.classList.add('fade-in');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus on modal for accessibility
        successModal.focus();
    }
}

function hideSuccessModal() {
    if (successModal) {
        successModal.classList.add('hidden');
        successModal.classList.remove('fade-in');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (successModal && e.target === successModal) {
        hideSuccessModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal && !successModal.classList.contains('hidden')) {
        hideSuccessModal();
    }
});

// Utility Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Responsive handling
function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Add resize listener
window.addEventListener('resize', debounce(handleResize, 250));

// Analytics and tracking (placeholder functions)
function trackEvent(eventName, eventData = {}) {
    console.log(`Event: ${eventName}`, eventData);
    
    // In a real application, you would send this to your analytics service
    // Example: gtag('event', eventName, eventData);
    // or: analytics.track(eventName, eventData);
}

function trackPageView(page) {
    trackEvent('page_view', {
        page: page,
        timestamp: new Date().toISOString()
    });
}

// Track page views when navigating
function trackNavigation(page) {
    trackPageView(page);
    trackEvent('navigation', {
        from: currentPage,
        to: page,
        timestamp: new Date().toISOString()
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    
    // In a real application, you might want to report this error
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load performance
    setTimeout(() => {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            trackEvent('page_load_time', {
                loadTime: loadTime,
                page: 'homepage'
            });
        }
    }, 0);
});

// Accessibility enhancements
function enhanceAccessibility() {
    // Add keyboard navigation for mobile menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }
    
    // Enhance form validation messages for screen readers
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.setAttribute('role', 'alert');
        error.setAttribute('aria-live', 'polite');
    });
    
    // Add proper labels and descriptions
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        const label = document.querySelector(`label[for="${control.id}"]`);
        if (label && control.hasAttribute('required')) {
            control.setAttribute('aria-required', 'true');
        }
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Course card click tracking
function trackCourseInterest(courseName) {
    trackEvent('course_interest', {
        course: courseName,
        page: currentPage,
        timestamp: new Date().toISOString()
    });
}

// Button click tracking
function trackButtonClick(buttonText, action) {
    trackEvent('button_click', {
        button: buttonText,
        action: action,
        page: currentPage,
        timestamp: new Date().toISOString()
    });
}

// Form interaction tracking
function trackFormInteraction(fieldName, action) {
    trackEvent('form_interaction', {
        field: fieldName,
        action: action,
        page: currentPage,
        timestamp: new Date().toISOString()
    });
}

// Enhanced form tracking
if (contactForm) {
    contactForm.addEventListener('focusin', function(e) {
        if (e.target.matches('input, select, textarea')) {
            trackFormInteraction(e.target.name, 'focus');
        }
    });
    
    contactForm.addEventListener('change', function(e) {
        if (e.target.matches('input, select, textarea')) {
            trackFormInteraction(e.target.name, 'change');
        }
    });
}

// Export functions for potential external use
window.SmartKempapuraAI = {
    showHomepage,
    showContactPage,
    hideSuccessModal,
    trackEvent,
    trackCourseInterest,
    trackButtonClick
};
