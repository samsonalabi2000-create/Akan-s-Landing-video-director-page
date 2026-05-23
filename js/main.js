/* ==========================================
   AKAN THE CREATOR — main.js (FINAL FIX)
   ========================================== */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');

  if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });
    (function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursor.style.left = ringX + 'px';
      cursor.style.top  = ringY + 'px';
      requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(function(el) {
      el.addEventListener('mouseenter', function() { cursor.style.width = '40px'; cursor.style.height = '40px'; });
      el.addEventListener('mouseleave', function() { cursor.style.width = '20px'; cursor.style.height = '20px'; });
    });
  }

  /* ── NAVBAR SCROLL ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ── MOBILE MENU ──────────────────────────────────────────────────────────
   
     THE ACTUAL ROOT CAUSE (found by reading the HTML carefully):
   
     The mobile menu div has "translate-x-full" as a Tailwind utility baked
     into its class attribute in the HTML:
   
       class="... translate-x-full transition-transform duration-500"
   
     In CSS, ".open { transform: translateX(0) }" and Tailwind's
     ".translate-x-full { transform: translateX(100%) }" have identical
     specificity (one class each). When both are present, the winner is
     whichever appears LATER in the stylesheet. With the Tailwind CDN loaded
     in <head> and your custom CSS after it, sometimes Tailwind wins,
     sometimes it doesn't — it's a race. On mobile Safari/Chrome the CDN
     often loads last, so Tailwind's translate-x-full always beats .open,
     meaning the menu never visually appears. Users tap the hamburger, the JS
     toggles fine, but the overlay stays off-screen — the page looks frozen
     because taps on the invisible overlay still register and block scrolling
     (overflow:hidden on body).
   
     FIX: Drive the transform entirely with inline style from JS.
     Never rely on CSS class specificity battles for this.
  ────────────────────────────────────────────────────────────────────────── */

  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {

    /* Step 1: Kill the Tailwind translate-x-full immediately on load.
       Set the closed state via inline style so we own the transform. */
    mobileMenu.style.transform = 'translateX(100%)';
    mobileMenu.style.transition = 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)';

    var menuOpen = false;

    function openMenu() {
      menuOpen = true;
      mobileMenu.style.transform = 'translateX(0%)';
      menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuOpen = false;
      mobileMenu.style.transform = 'translateX(100%)';
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (menuOpen) { closeMenu(); } else { openMenu(); }
    });

    /* Close when a nav link is tapped */
    document.querySelectorAll('.mobile-nav').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    /* Close on Escape */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    /* Close when tapping the backdrop (not the menu content) */
    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  /* ── SCROLL REVEAL ── */
  var revealEls = document.querySelectorAll('[data-scroll-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(function() { entry.target.classList.add('revealed'); }, delay);
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el) { revealObs.observe(el); });
  }

  /* ── COUNTERS ── */
  var counterObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.target, 10);
      var step = target / (2000 / 16);
      var current = 0;
      var timer = setInterval(function() {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + '+';
      }, 16);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(function(el) { counterObs.observe(el); });

  /* ── SKILL BARS ── */
  var aboutSection = document.getElementById('about');
  if (aboutSection) {
    var skillObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-fill').forEach(function(fill) {
          setTimeout(function() { fill.style.width = fill.dataset.width; }, 300);
        });
        skillObs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    skillObs.observe(aboutSection);
  }

  /* ── PORTFOLIO FILTER ── */
  var filterBtns     = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      portfolioItems.forEach(function(item) {
        var match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display   = '';
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(function() {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          });
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(function() { item.style.display = 'none'; }, 400);
        }
      });
    });
  });

  /* ── CONTACT FORM ─────────────────────────────────────────────────────────
     Single handler. No DOMContentLoaded nesting. Safe null checks.
     WhatsApp opens first; email fires 400ms later so iOS doesn't block both.
  ────────────────────────────────────────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  var formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name    = (contactForm.elements['name']    ? contactForm.elements['name'].value.trim()    : '');
      var email   = (contactForm.elements['email']   ? contactForm.elements['email'].value.trim()   : '');
      var service = (contactForm.elements['service'] ? contactForm.elements['service'].value        : '');
      var message = (contactForm.elements['message'] ? contactForm.elements['message'].value.trim() : '');

      var waText = 'Hello Akan! 👋\n\n*Name:* ' + name +
                   '\n*Email:* ' + email +
                   '\n*Service:* ' + (service || 'Not specified') +
                   '\n\n*Message:*\n' + message;

      window.open('https://wa.me/2347053825584?text=' + encodeURIComponent(waText), '_blank');

      setTimeout(function() {
        var subject = 'New Enquiry from ' + name + ' — ' + (service || 'Portfolio Website');
        var body    = 'Name: ' + name + '\nEmail: ' + email +
                      '\nService: ' + (service || 'Not specified') +
                      '\n\nMessage:\n' + message;
        window.location.href = 'mailto:akanthegreat@gmail.com' +
          '?subject=' + encodeURIComponent(subject) +
          '&body='    + encodeURIComponent(body);
      }, 400);

      if (formStatus) {
        formStatus.textContent = 'Opening WhatsApp & email — message ready to send!';
        formStatus.classList.remove('hidden');
        formStatus.style.color = '#808080';
      }
      contactForm.reset();
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* ── ACTIVE NAV HIGHLIGHT ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var secObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function(link) {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id ? '#f0f0f0' : '';
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(function(s) { secObs.observe(s); });

  /* ── PARALLAX HERO ── */
  var heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    window.addEventListener('scroll', function() {
      if (window.scrollY < window.innerHeight) {
        heroLogo.style.transform = 'translateY(' + (window.scrollY * 0.3) + 'px)';
      }
    }, { passive: true });
  }

  /* ── PORTFOLIO PULSE ── */
  portfolioItems.forEach(function(item) {
    item.addEventListener('click', function() {
      item.style.transform = 'scale(0.98)';
      setTimeout(function() { item.style.transform = ''; }, 200);
    });
  });

  /* ── PAGE FADE IN ── */
  window.addEventListener('load', function() {
    document.body.style.opacity    = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { document.body.style.opacity = '1'; });
    });
  });

  console.log('%cAKAN THE CREATOR', 'font-size:20px;font-weight:bold;color:#c8c8c8;background:#080808;padding:8px 16px;');
  console.log('%cVisual Storyteller · Lagos, Nigeria', 'font-size:11px;color:#8a8a8a;padding:4px 16px;');

  /* ── TESTIMONIAL 3D ORBIT ── */
  (function() {
    var reviews = [
      { init:'JA', bg:'#1a3a5c', col:'#4a9eff', name:'James A.',  date:'2 months ago',  role:'Brand Manager',    quote:'Akan has a unique ability to see what others miss. The photos from our campaign exceeded every expectation — clients keep asking who shot them.' },
      { init:'KO', bg:'#1a3d2b', col:'#34a853', name:'Kemi O.',   date:'3 months ago',  role:'Recording Artist', quote:'The music video he directed took us to a whole new level. His creative vision plus technical skill is honestly unmatched in Lagos right now.' },
      { init:'TN', bg:'#3a1a1a', col:'#ea4335', name:'Tunde N.',  date:'2 years ago',   role:'Creative Director',quote:'Professional, punctual, and the quality of the work speaks for itself. Akan is our go-to for all visual content. Period.' },
      { init:'AF', bg:'#3a2a1a', col:'#fbbc05', name:'Amara F.',  date:'9 months ago',  role:'Fashion Designer', quote:'I hired Akan for my fashion shoot and the results were beyond anything I imagined. He made the whole process so smooth and the final edits were stunning.' },
      { init:'BI', bg:'#1a2a3a', col:'#4285f4', name:'Biodun I.', date:'1 year ago',    role:'Marketing Lead',   quote:'Working with Akan on our product launch visuals was a game changer. The content stopped people mid-scroll. Best investment we made for the campaign.' },
      { init:'SC', bg:'#2a1a3a', col:'#a855f7', name:'Sola C.',   date:'4 months ago',  role:'Event Organiser',  quote:'Akan shot our event and delivered same-day highlights. The quality, the turnaround, the communication — everything was top tier. Will 100% book again.' }
    ];

    var gSvg = '<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';

    var ring = document.getElementById('orbit-ring');
    var wrap = document.getElementById('orbit-wrap');
    if (!ring || !wrap) return;

    var n = reviews.length, radius = 300;

    reviews.forEach(function(r, i) {
      var a = (i / n) * Math.PI * 2;
      var x = Math.cos(a) * radius;
      var z = Math.sin(a) * radius;
      var el = document.createElement('div');
      el.style.cssText = 'position:absolute;width:240px;transform-style:preserve-3d;backface-visibility:hidden;cursor:pointer;transform:translate3d(' + (x-120) + 'px,-90px,' + z + 'px);';
      el.innerHTML = '<div style="background:rgba(18,18,18,0.92);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;">'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">'
        + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<div style="width:34px;height:34px;border-radius:50%;background:' + r.bg + ';color:' + r.col + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">' + r.init + '</div>'
        + '<div><div style="font-size:12px;color:#c0c0c0;">' + r.name + '</div><div style="font-size:9px;color:#484848;">' + r.date + '</div></div></div>'
        + gSvg + '</div>'
        + '<div style="color:#d4a853;font-size:11px;margin-bottom:8px;">★★★★★</div>'
        + '<div style="font-size:11px;color:#707070;line-height:1.6;font-style:italic;">"' + r.quote + '"</div>'
        + '<div style="font-size:9px;color:#4285f4;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;">' + r.role + '</div>'
        + '</div>';
      ring.appendChild(el);
    });

    var cards = Array.from(ring.children);
    var angle = 0, paused = false, isDragging = false, lastX = 0, dragVel = 0;

    wrap.addEventListener('mousedown',  function(e) { isDragging = true;  lastX = e.clientX; dragVel = 0; wrap.style.cursor = 'grabbing'; });
    window.addEventListener('mouseup',  function()  { isDragging = false; wrap.style.cursor = 'grab'; });
    window.addEventListener('mousemove',function(e) { if (!isDragging) return; dragVel = (e.clientX - lastX) * 0.004; angle += dragVel; lastX = e.clientX; });
    wrap.addEventListener('mouseenter', function()  { if (!isDragging) paused = true; });
    wrap.addEventListener('mouseleave', function()  { paused = false; isDragging = false; });
    wrap.addEventListener('touchstart', function(e) { isDragging = true; lastX = e.touches[0].clientX; dragVel = 0; }, { passive: true });
    window.addEventListener('touchend', function()  { isDragging = false; });
    window.addEventListener('touchmove',function(e) { if (!isDragging) return; dragVel = (e.touches[0].clientX - lastX) * 0.004; angle += dragVel; lastX = e.touches[0].clientX; }, { passive: true });

    (function orbit() {
      if (!paused && !isDragging) angle += 0.004;
      else if (isDragging) angle += dragVel * 0.5;
      dragVel *= 0.9;
      cards.forEach(function(card, i) {
        var a     = angle + (i / n) * Math.PI * 2;
        var x     = Math.cos(a) * radius;
        var z     = Math.sin(a) * radius;
        var scale = 0.72 + 0.28 * ((z + radius) / (radius * 2));
        var op    = 0.35 + 0.65 * ((z + radius) / (radius * 2));
        card.style.transform = 'translate3d(' + (x-120).toFixed(1) + 'px,-90px,' + z.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
        card.style.opacity   = op.toFixed(3);
        card.style.zIndex    = Math.round(z + radius);
      });
      requestAnimationFrame(orbit);
    })();

    var canvas = document.getElementById('particle-canvas');
    var stage  = document.getElementById('testimonial-stage');
    if (!canvas || !stage) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var colors = ['rgba(66,133,244,','rgba(212,168,83,','rgba(255,255,255,','rgba(168,85,247,'];
    var pts = Array.from({ length: 70 }, function() {
      return {
        x: Math.random()*1400, y: Math.random()*600,
        vx: (Math.random()-.5)*0.3, vy: (Math.random()-.5)*0.3,
        r: Math.random()*1.5+0.3,
        c: colors[Math.floor(Math.random()*colors.length)],
        a: Math.random()*Math.PI*2
      };
    });
    function resize() { W = canvas.width = stage.offsetWidth; H = canvas.height = stage.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    (function particles() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(function(p) {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        p.a+=0.005;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c+(0.1+0.2*Math.abs(Math.sin(p.a))).toFixed(3)+')';
        ctx.fill();
      });
      requestAnimationFrame(particles);
    })();
  })();

})();