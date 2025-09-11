// Westorx Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initSmoothScrolling();
    initContactForm();
    initScrollEffects();
    initAnimations();
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            if (isActive) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });
        // Close menu when clicking on nav links (mobile)
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeNavMenu();
                }
            });
        });
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                closeNavMenu();
            }
        });
    }
}
function openNavMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}
function closeNavMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Validation and Submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector("button[type=submit]");

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        let valid = true;

        // Name validation
        if (!name || name.length < 2) {
            showFieldError("name", "⚠ Please enter a valid name (at least 2 characters)");
            valid = false;
        } else {
            clearErrors(document.getElementById("name"));
        }

        // Email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError("email", "⚠ Please enter a valid email address");
            valid = false;
        } else {
            clearErrors(document.getElementById("email"));
        }

        // Message validation
        if (!message || message.length < 10) {
            showFieldError("message", "⚠ Please enter a message (at least 10 characters)");
            valid = false;
        } else {
            clearErrors(document.getElementById("message"));
        }

        if (valid) {
            // Disable button + show loading
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            // ✅ EmailJS integration (replace with your keys if you use it)
            // emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form, "YOUR_PUBLIC_KEY")
            //     .then(() => {
            //         showFormSuccess("✅ Thank you for your message! We'll get back to you soon.");
            //         form.reset();
            //         clearAllErrors();
            //     })
            //     .catch((err) => {
            //         showFormError("❌ Error sending message. Try again later.");
            //         console.error(err);
            //     })
            //     .finally(() => {
            //         submitBtn.disabled = false;
            //         submitBtn.textContent = "Send Message";
            //     });

            // For demo: simulate success
            showFormSuccess("✅ Thank you for your message! We'll get back to you soon.");
            form.reset();
            clearAllErrors();
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });

    // Input blur + input validation
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    inputs.forEach(input => {
        input.addEventListener("blur", () => validateField(input));
        input.addEventListener("input", () => clearErrors(input));
    });
}

// Show field-specific error (themed)
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + "Error");
    if (field && errorElement) {
        field.classList.add("error");
        errorElement.innerHTML = `<div class="form-error-box">${message}</div>`;
        errorElement.style.display = "block";
    }
}

// Clear errors
function clearErrors(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + "Error");
    field.classList.remove("error");
    if (errorElement) {
        errorElement.innerHTML = "";
        errorElement.style.display = "none";
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll(".form-error");
    const formControls = document.querySelectorAll(".form-control");
    errorElements.forEach(element => {
        element.innerHTML = "";
        element.style.display = "none";
    });
    formControls.forEach(control => {
        control.classList.remove("error", "success");
    });
}

// Success message
function showFormSuccess(message) {
    const successMessage = document.createElement("div");
    successMessage.className = "form-success-box";
    successMessage.innerHTML = message;
    const form = document.getElementById("contactForm");
    form.insertBefore(successMessage, form.firstChild);
    setTimeout(() => successMessage.remove(), 5000);
}

// Error message
function showFormError(message) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "form-error-box";
    errorMessage.innerHTML = message;
    const form = document.getElementById("contactForm");
    form.insertBefore(errorMessage, form.firstChild);
    setTimeout(() => errorMessage.remove(), 5000);
}

// Field validation on blur
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    clearErrors(field);

    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                showFieldError(fieldName, '⚠ Please enter a valid name (at least 2 characters)');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                showFieldError(fieldName, '⚠ Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                showFieldError(fieldName, '⚠ Please enter a message (at least 10 characters)');
                return false;
            }
            break;
    }
    field.classList.add('success');
    return true;
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        header.style.background = scrollTop > 50 ? "#181826" : "#12121e";
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.pageYOffset;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Animations and Intersection Observer
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.classList.contains('services__grid') || 
                    entry.target.classList.contains('features__grid') ||
                    entry.target.classList.contains('portfolio__grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.hero__content, .section-header, .about__content, .services__grid, ' +
        '.portfolio__grid, .features__grid, .contact__content'
    );
    animatedElements.forEach(el => observer.observe(el));
    addAnimationStyles();
}

function animateGridItems(gridContainer) {
    const items = gridContainer.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate-in');
        }, index * 100);
    });
}

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .hero__content,
        .section-header,
        .about__content,
        .contact__content,
        .service-card,
        .portfolio-item,
        .feature-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .nav__link.active {
            background: var(--westorx-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .nav__link.active::after {
            width: 100%;
        }
        .service-card:hover .service-card__icon,
        .feature-card:hover .feature-card__icon {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }
        .form-success-box {
            background: rgba(75,220,255,0.15);
            border: 1px solid rgba(75,220,255,0.25);
            color: #4bdcff;
            padding: 16px;
            border-radius: 10px;
            margin-bottom: 16px;
            text-align: center;
            font-weight: 600;
            animation: slideInFromTop 0.5s ease-out;
        }
        .form-error-box {
            background: rgba(255,65,210,0.09);
            border: 1px solid rgba(255,65,210,0.18);
            color: #ff41d2;
            padding: 12px;
            border-radius: 9px;
            margin-bottom: 10px;
            text-align: center;
            font-weight: 600;
            animation: slideInFromTop 0.5s ease-out;
        }
        @keyframes slideInFromTop {
            from { opacity: 0; transform: translateY(-20px);}
            to { opacity: 1; transform: translateY(0);}
        }
    `;
    document.head.appendChild(style);
}

// Utility Functions
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

// Handle window resize
window.addEventListener('resize', debounce(function() {
    if (window.innerWidth > 768) {
        closeNavMenu();
        document.body.style.overflow = '';
    }
}, 250));

// Error handling for failed loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && perfData.loadEventEnd > 0) {
                console.log(`Page load time: ${Math.round(perfData.loadEventEnd)}ms`);
            }
        }, 0);
    });
}