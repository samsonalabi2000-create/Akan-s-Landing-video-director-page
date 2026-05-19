/* ==========================================
   AKAN THE CREATOR — main.js
   Interactions, animations, UX logic
   ========================================== */

(function () {
  'use strict';

  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows exactly
      dotX = mouseX;
      dotY = mouseY;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
    });

    // Ring follows with lerp
    let ringX = 0, ringY = 0;
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursor.style.left = ringX + 'px';
      cursor.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale on interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.borderColor = '#c8c8c8';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = '#c8c8c8';
      });
    });
  }

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-scroll-reveal]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }
  initScrollReveal();

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + (target >= 100 ? '+' : target > 10 ? '+' : '+');
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ===== SKILL BARS =====
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          setTimeout(() => {
            fill.style.width = fill.dataset.width;
          }, 300);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) skillObserver.observe(aboutSection);

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        formStatus.classList.remove('hidden');
        formStatus.classList.add('success');
        formStatus.textContent = '✓ Message sent. I\'ll be in touch shortly.';
        contactForm.reset();

        setTimeout(() => {
          formStatus.classList.add('hidden');
        }, 5000);
      }, 1500);
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== ACTIVE NAV HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? '#e8e8e8' : '#6a6a6a';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ===== LENS APERTURE ROTATION ON SCROLL =====
  const lensOverlay = document.querySelector('.lens-overlay');
  if (lensOverlay) {
    window.addEventListener('scroll', () => {
      const rotation = window.scrollY * 0.05;
      lensOverlay.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    }, { passive: true });
  }

  // ===== PARALLAX HERO ELEMENTS =====
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        const parallax = window.scrollY * 0.3;
        heroLogo.style.transform = `translateY(${parallax}px)`;
      }
    }, { passive: true });
  }

  // ===== PORTFOLIO ITEM CLICK — LIGHTBOX STUB =====
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      // Pulse effect on click
      item.style.transform = 'scale(0.98)';
      setTimeout(() => { item.style.transform = ''; }, 200);
    });
  });

  // ===== PRELOADER =====
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  });

  console.log('%cAKAN THE CREATOR', 'font-size:20px; font-weight:bold; color:#c8c8c8; background:#050505; padding:8px 16px;');
  console.log('%cVisual Storyteller · Lagos, Nigeria', 'font-size:11px; color:#6a6a6a; padding:4px 16px;');

})();