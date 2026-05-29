// WestorX Enterprise Digital Agency Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Scroll Listeners
  initNavigation();
  initScrollEffects();
  
  // Interactive background
  initParticleBackground();
  
  // Custom interactive systems
  initServicesFilter();
  initWhyChooseAnimations();
  initProjectEstimator();
  initPortfolioFilters();
  initClientPortalMock();
  initTechStackFilters();
  initTestimonialsCarousel();
  initStatsIntersectionObserver();
  initPricingSwitcher();
  initFaqAccordions();
  initConsultationCalendar();
  initChatbotWidget();
});

// 1. Navigation Menus & Actions
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const active = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', active ? 'true' : 'false');
      
      if (active) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu on nav item click (mobile overlay)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }
}

// 2. Scroll Indicators and Active Highlighting
function initScrollEffects() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    
    // Header Glass effect on scroll
    if (header) {
      if (scrollPos > 40) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }
    
    // Highlight Active Link based on scroll
    let currentId = 'hero';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

// 3. Interactive Floating Particle Network Canvas
function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.parentElement.offsetWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight;
  
  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 18000));
  
  let mouse = { x: null, y: null, radius: 150 };
  
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  window.addEventListener('resize', () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(127, 0, 255, 0.4)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// 4. Tab Filtration on Services Grid
function initServicesFilter() {
  const tabs = document.querySelectorAll('#servicesTabs .services-tab-btn');
  const cards = document.querySelectorAll('#servicesGrid .service-card');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filter = tab.getAttribute('data-tab');
      
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// 5. Why Choose WestorX Micro-interactions
function initWhyChooseAnimations() {
  const cards = document.querySelectorAll('#whyGrid .why-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const num = card.querySelector('.why-number');
      if (num) {
        num.style.transform = 'scale(1.05) translateY(-5px)';
        num.style.transition = 'var(--transition-smooth)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const num = card.querySelector('.why-number');
      if (num) {
        num.style.transform = 'scale(1) translateY(0)';
      }
    });
  });
}

// 6. Interactive Calculator / Project Estimator Engine
function initProjectEstimator() {
  const serviceCards = document.querySelectorAll('.calc-service-card');
  const viewsSlider = document.getElementById('viewsSlider');
  const viewCountVal = document.getElementById('viewCountVal');
  const checks = document.querySelectorAll('.calc-checkbox-item input');
  
  const priceDisplay = document.getElementById('calcPriceResult');
  const durationDisplay = document.getElementById('calcTimeResult');
  
  const brkModules = document.getElementById('brkModules');
  const brkViews = document.getElementById('brkViews');
  const brkOps = document.getElementById('brkOps');
  
  let currentEstimatedPrice = 2560; // Keep track of numbers for count animations

  function calculateEstimate() {
    let modulesTotal = 0;
    let selectedModulesCount = 0;
    
    // 1. Gather Modules
    serviceCards.forEach(card => {
      if (card.classList.contains('selected')) {
        modulesTotal += parseFloat(card.getAttribute('data-value'));
        selectedModulesCount++;
      }
    });
    
    // 2. Gather views slider multiplier
    const views = parseInt(viewsSlider.value);
    viewCountVal.textContent = `${views} View${views > 1 ? 's' : ''}`;
    const multiplier = 1 + (views * 0.035);
    
    // 3. Add-ons pricing
    let addOnsTotal = 0;
    checks.forEach(check => {
      if (check.checked) {
        if (check.id === 'checkCicd') addOnsTotal += 150;
        if (check.id === 'checkSupport') addOnsTotal += 350;
        if (check.id === 'checkSecAudit') addOnsTotal += 400;
        if (check.id === 'checkSoc2') addOnsTotal += 600;
      }
    });

    // Final Estimates Calculation
    const modulesCost = modulesTotal;
    const finalPrice = Math.round((modulesCost * multiplier) + addOnsTotal);
    
    // Project Timelines in Weeks
    const baseWeeks = 2;
    const moduleWeeks = selectedModulesCount * 1;
    const scaleWeeks = Math.ceil(views / 12);
    const finalWeeks = baseWeeks + moduleWeeks + scaleWeeks;
    
    // Smooth Count animation for price
    animateNumberDisplay(currentEstimatedPrice, finalPrice, priceDisplay, '$');
    currentEstimatedPrice = finalPrice;
    
    durationDisplay.textContent = `${finalWeeks} Weeks`;
    
    // Update breakdown numbers
    if (brkModules) brkModules.textContent = `$${modulesCost.toLocaleString()}`;
    if (brkViews) brkViews.textContent = `${multiplier.toFixed(2)}x`;
    if (brkOps) brkOps.textContent = `$${addOnsTotal.toLocaleString()}`;
  }

  // Bind Listeners
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      calculateEstimate();
    });
  });

  if (viewsSlider) {
    viewsSlider.addEventListener('input', calculateEstimate);
  }

  checks.forEach(check => {
    check.addEventListener('change', calculateEstimate);
  });

  // Init calculation on boot
  if (priceDisplay) {
    calculateEstimate();
  }
}

// Numerical count up/down animation utility
function animateNumberDisplay(start, end, element, prefix = '') {
  if (!element) return;
  const duration = 400; // ms
  const startTime = performance.now();

  function updateNumber(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuad
    const ease = progress * (2 - progress);
    
    const value = Math.round(start + (end - start) * ease);
    element.textContent = `${prefix}${value.toLocaleString()}`;
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = `${prefix}${end.toLocaleString()}`;
    }
  }

  requestAnimationFrame(updateNumber);
}

// 7. Portfolio Showcase filters
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('#portFilters .portfolio-filter-btn');
  const cards = document.querySelectorAll('#portfolioGrid .portfolio-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// 8. Client Portal Live Interactive Mockup
function initClientPortalMock() {
  const tabBtns = document.querySelectorAll('#portalTabs .portal-tab-select-btn');
  const panels = document.querySelectorAll('#portalViewer .portal-view-panel');
  const chatForm = document.getElementById('portalChatForm');
  const chatInput = document.getElementById('portalChatMsgInput');
  const chatMessages = document.getElementById('portalChatMessages');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const panelId = btn.getAttribute('data-portal-tab');
      
      panels.forEach(panel => {
        if (panel.getAttribute('data-portal-panel') === panelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // Client messaging simulation inside portal
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      
      // Append Client message bubble
      const clientBubble = document.createElement('div');
      clientBubble.className = 'chat-bubble bubble-sent';
      clientBubble.innerHTML = `${text}<span class="bubble-time">Just Now - You (Client)</span>`;
      chatMessages.appendChild(clientBubble);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate Yuvaraj typing delay
      setTimeout(() => {
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble bubble-received typing-container-mock';
        typingBubble.innerHTML = `
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        `;
        chatMessages.appendChild(typingBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Populate actual response
        setTimeout(() => {
          typingBubble.remove();
          const responseBubble = document.createElement('div');
          responseBubble.className = 'chat-bubble bubble-received';
          
          let botResponse = "Excellent, got it! I'm reviewing the backend log and active repositories to ensure proper metrics alignment. Will keep you updated here!";
          if (text.toLowerCase().includes('uptime') || text.toLowerCase().includes('server')) {
            botResponse = "The server load balancing health reports look very stable! Database connections are scaling smoothly at less than 50% CPU thresholds.";
          } else if (text.toLowerCase().includes('design') || text.toLowerCase().includes('figma')) {
            botResponse = "The UI design systems are updated in Figma. You can retrieve all active layouts in our Shared Resource Dock tab anytime!";
          }

          responseBubble.innerHTML = `${botResponse}<span class="bubble-time">Just Now - Yuvaraj (Lead Engineer)</span>`;
          chatMessages.appendChild(responseBubble);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);

      }, 800);
    });
  }
}

// 9. Technology Stack categorizations
function initTechStackFilters() {
  const tabs = document.querySelectorAll('#techTabs .tech-tab-btn');
  const cards = document.querySelectorAll('#techGrid .tech-card');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filter = tab.getAttribute('data-tech');
      
      cards.forEach(card => {
        const cat = card.getAttribute('data-tech-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

// 10. Testimonials Slider Carousel
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialTrack');
  const cards = document.querySelectorAll('#testimonialTrack .testimonial-card');
  const prevBtn = document.getElementById('btnPrevTest');
  const nextBtn = document.getElementById('btnNextTest');
  
  if (!track || cards.length === 0) return;
  
  let currentIndex = 0;
  
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // loop
      }
      updateSlider();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = cards.length - 1; // loop
      }
      updateSlider();
    });
  }
}

// 11. Statistics Rolling Count Intersection Observer
function initStatsIntersectionObserver() {
  const counters = document.querySelectorAll('#statsGrid .stat-num');
  if (counters.length === 0) return;
  
  const observerOptions = {
    threshold: 0.25
  };
  
  let hasAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          let current = 0;
          const duration = 1500; // ms
          const stepTime = Math.max(Math.floor(duration / target), 10);
          
          const increment = Math.ceil(target / (duration / stepTime));
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + (counter.parentElement.id === 'statUptime' ? '%' : '+');
              clearInterval(timer);
            } else {
              counter.textContent = current + (counter.parentElement.id === 'statUptime' ? '%' : '+');
            }
          }, stepTime);
        });
        hasAnimated = true;
      }
    });
  }, observerOptions);
  
  const statsGrid = document.getElementById('statsGrid');
  if (statsGrid) observer.observe(statsGrid);
}

// 12. Monthly/Yearly Pricing Retainer Switcher
function initPricingSwitcher() {
  const switchBox = document.getElementById('pricingSwitch');
  const starterPrice = document.getElementById('priceStarter');
  const growthPrice = document.getElementById('priceGrowth');
  const enterprisePrice = document.getElementById('priceEnterprise');
  
  const lblMonthly = document.getElementById('lblMonthly');
  const lblYearly = document.getElementById('lblYearly');
  
  if (!switchBox) return;
  
  switchBox.addEventListener('click', () => {
    const isYearly = switchBox.classList.toggle('yearly');
    
    if (lblMonthly && lblYearly) {
      lblMonthly.classList.toggle('active', !isYearly);
      lblYearly.classList.toggle('active', isYearly);
    }
    
    if (isYearly) {
      // Annual prices (20% discount)
      animateNumberDisplay(3200, 2560, starterPrice);
      animateNumberDisplay(6500, 5200, growthPrice);
      animateNumberDisplay(12500, 10000, enterprisePrice);
    } else {
      // Monthly prices
      animateNumberDisplay(2560, 3200, starterPrice);
      animateNumberDisplay(5200, 6500, growthPrice);
      animateNumberDisplay(10000, 12500, enterprisePrice);
    }
  });
}

// 13. FAQ Accordion Height expansion logic
function initFaqAccordions() {
  const triggers = document.querySelectorAll('.faq-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isExpanded = parent.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-content').style.maxHeight = null;
        item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });
      
      if (!isExpanded) {
        parent.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 14. Detailed Booking Calendar generation and logic
function initConsultationCalendar() {
  const grid = document.getElementById('calDaysGrid');
  const monthLbl = document.getElementById('calMonthLabel');
  const dateInput = document.getElementById('selectedDate');
  const timeInput = document.getElementById('selectedTime');
  const slotTitle = document.getElementById('calSlotTitle');
  const slotsGrid = document.getElementById('calSlotsGrid');
  
  const prevBtn = document.getElementById('btnPrevMonth');
  const nextBtn = document.getElementById('btnNextMonth');

  if (!grid || !monthLbl) return;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let currentMonthIndex = 4; // May
  let currentYear = 2026;
  
  function populateCalendar() {
    // Clear previous numbers
    const prevNums = grid.querySelectorAll('.cal-day-num');
    prevNums.forEach(n => n.remove());
    
    monthLbl.textContent = `${months[currentMonthIndex]} ${currentYear}`;
    
    // First day of month (1-indexed day offset)
    const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysOffset = firstDay === 0 ? 6 : firstDay - 1; // Align to Mon grid
    
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    
    // 1. Add blank/disabled elements for offset days
    for (let i = 0; i < daysOffset; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day-num disabled';
      blank.textContent = '';
      grid.appendChild(blank);
    }
    
    // 2. Add actual day numbers
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day-num';
      
      // Block weekend days for business operations
      const weekDay = new Date(currentYear, currentMonthIndex, day).getDay();
      const isWeekend = weekDay === 0 || weekDay === 6;
      
      if (isWeekend) {
        dayEl.classList.add('disabled');
      }
      
      // Default highlight active date (29th May 2026)
      if (day === 29 && currentMonthIndex === 4 && currentYear === 2026) {
        dayEl.classList.add('active');
      }
      
      dayEl.textContent = day;
      
      dayEl.addEventListener('click', () => {
        if (dayEl.classList.contains('disabled')) return;
        
        grid.querySelectorAll('.cal-day-num').forEach(d => d.classList.remove('active'));
        dayEl.classList.add('active');
        
        const formattedMonth = String(currentMonthIndex + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const finalDateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
        
        if (dateInput) dateInput.value = finalDateString;
        if (slotTitle) slotTitle.textContent = `Available slots for ${months[currentMonthIndex]} ${day}:`;
        
        // Randomize slots mock to look alive!
        regenerateTimeSlots(day);
      });
      
      grid.appendChild(dayEl);
    }
  }

  function regenerateTimeSlots(day) {
    if (!slotsGrid) return;
    slotsGrid.innerHTML = '';
    
    const hours = ['09:00 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '04:00 PM'];
    
    // Select subset of hours based on odd/even days
    const filteredHours = hours.filter((_, i) => (day + i) % 2 === 0);
    if (filteredHours.length === 0) filteredHours.push('11:00 AM', '03:00 PM');
    
    filteredHours.forEach((hour, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-slot-btn';
      if (index === 0) {
        btn.classList.add('selected');
        if (timeInput) timeInput.value = hour;
      }
      
      btn.textContent = hour;
      btn.addEventListener('click', () => {
        slotsGrid.querySelectorAll('.cal-slot-btn').forEach(s => s.classList.remove('selected'));
        btn.classList.add('selected');
        if (timeInput) timeInput.value = hour;
      });
      
      slotsGrid.appendChild(btn);
    });
  }

  // Bind Month Navigation triggers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentMonthIndex < 11) {
        currentMonthIndex++;
      } else {
        currentMonthIndex = 0;
        currentYear++;
      }
      populateCalendar();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentMonthIndex > 0) {
        currentMonthIndex--;
      } else {
        currentMonthIndex = 11;
        currentYear--;
      }
      populateCalendar();
    });
  }

  populateCalendar();
  initContactFormSubmit();
}

// Contact Proposal form submission validator
function initContactFormSubmit() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput = document.getElementById('message');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let valid = true;
    
    // Clear previous errors
    clearErrors('name');
    clearErrors('email');
    clearErrors('message');
    
    // Name validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError('name', '⚠ Please enter a valid name (at least 2 letters)');
      valid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError('email', '⚠ Please enter a valid email address');
      valid = false;
    }
    
    // Message validation
    if (!msgInput.value.trim() || msgInput.value.trim().length < 8) {
      showError('message', '⚠ Description must contain some context details');
      valid = false;
    }
    
    if (valid) {
      const btn = document.getElementById('btnSubmitProposal');
      const dateVal = document.getElementById('selectedDate').value;
      const timeVal = document.getElementById('selectedTime').value;
      
      btn.disabled = true;
      btn.innerHTML = 'Securing Booking... <i class="fa-solid fa-spinner fa-spin"></i>';
      
      // Simulate API submit delay
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = 'Book Selected Slot <i class="fa-solid fa-paper-plane"></i>';
        
        // Show floating success card
        const successCard = document.createElement('div');
        successCard.className = 'form-success-box';
        successCard.innerHTML = `✅ Consultation booked successfully on ${dateVal} at ${timeVal}! Our principal directors will reach out via email shortly.`;
        
        form.insertBefore(successCard, form.firstChild);
        form.reset();
        
        // Auto remove success alert
        setTimeout(() => {
          successCard.style.opacity = '0';
          successCard.style.transform = 'translateY(-10px)';
          successCard.style.transition = 'all 0.5s ease';
          setTimeout(() => successCard.remove(), 500);
        }, 6000);
        
      }, 1500);
    }
  });

  function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const errBox = document.getElementById(`${fieldId}Error`);
    if (input && errBox) {
      input.classList.add('error');
      errBox.innerHTML = `<div class="form-error-box">${msg}</div>`;
      errBox.style.display = 'block';
    }
  }

  function clearErrors(fieldId) {
    const input = document.getElementById(fieldId);
    const errBox = document.getElementById(`${fieldId}Error`);
    if (input && errBox) {
      input.classList.remove('error');
      errBox.innerHTML = '';
      errBox.style.display = 'none';
    }
  }
}

// 15. Live Automated Conversational Chatbot Widget
function initChatbotWidget() {
  const toggle = document.getElementById('chatToggle');
  const windowPanel = document.getElementById('chatWindow');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');
  const msgArea = document.getElementById('chatMsgArea');
  
  if (!toggle || !windowPanel) return;
  
  toggle.addEventListener('click', () => {
    const active = windowPanel.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', active ? 'true' : 'false');
  });

  if (form && input && msgArea) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      
      // Append User message bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble-user';
      userBubble.innerHTML = `${text}<span class="chat-msg-time">Just Now</span>`;
      msgArea.appendChild(userBubble);
      input.value = '';
      msgArea.scrollTop = msgArea.scrollHeight;

      // Simulate Bot typing indicator
      setTimeout(() => {
        const typingEl = document.createElement('div');
        typingEl.className = 'chat-bubble-bot typing-indicator-bot';
        typingEl.innerHTML = `
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        `;
        msgArea.appendChild(typingEl);
        msgArea.scrollTop = msgArea.scrollHeight;

        // Bot response calculation
        setTimeout(() => {
          typingEl.remove();
          const botBubble = document.createElement('div');
          botBubble.className = 'chat-bubble-bot';
          
          let botAns = "Thank you for the message! You can easily select an active date slot in our Consultation Booking widget above, or direct-mail our engineering directors at westorx@outlook.com.";
          
          const val = text.toLowerCase();
          if (val.includes('price') || val.includes('cost') || val.includes('retainer') || val.includes('pack')) {
            botAns = "Our agile sprint retainers start from $3,200/mo (Starter Sprint), and scale up to $6,500/mo for full-stack engineering. You can view details in our Pricing plans section!";
          } else if (val.includes('devops') || val.includes('cloud') || val.includes('kubernetes') || val.includes('aws')) {
            botAns = "Our certified cloud units build zero-downtime, HIPAA/SOC2 compliant AWS networks using Terraform. Use our interactive project calculator to estimate cloud integrations!";
          } else if (val.includes('service') || val.includes('do you') || val.includes('skill')) {
            botAns = "We offer Web Development, UI/UX Product Design, Cloud DevOps, Technical SEO Audit, and ROI Growth Ads management. What solutions does your company require?";
          } else if (val.includes('hello') || val.includes('hi') || val.includes('hey')) {
            botAns = "Hello! 👋 Glad you're here. Let me know what digital product designs or cloud migrations we can assist with.";
          }

          botBubble.innerHTML = `${botAns}<span class="chat-msg-time">Just Now</span>`;
          msgArea.appendChild(botBubble);
          msgArea.scrollTop = msgArea.scrollHeight;
        }, 1200);

      }, 500);
    });
  }
}

// 16. Scroll-reveal Observer System
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px -40px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    scrollRevealObserver.observe(el);
  });
});