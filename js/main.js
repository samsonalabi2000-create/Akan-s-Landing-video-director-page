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
      el.textContent = Math.floor(current) + '+';
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
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = '#f0f0f0';
          } else {
            link.style.color = '';
          }
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

  // ===== PORTFOLIO ITEM CLICK — PULSE =====
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
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
  // Contact form logic
  console.log('%cAKAN THE CREATOR', 'font-size:20px; font-weight:bold; color:#c8c8c8; background:#080808; padding:8px 16px;');
  console.log('%cVisual Storyteller · Lagos, Nigeria', 'font-size:11px; color:#8a8a8a; padding:4px 16px;');

  document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = this.name.value.trim();
    const email   = this.email.value.trim();
    const service = this.service.value;
    const message = this.message.value.trim();

    const yourWhatsApp = '2347053825584';

    const waText = `Hello Akan! 👋

*Name:* ${name}
*Email:* ${email}
*Service:* ${service || 'Not specified'}

*Message:*
${message}`;

    const waURL = `https://wa.me/${yourWhatsApp}?text=${encodeURIComponent(waText)}`;
    window.open(waURL, '_blank');

    const yourEmail = 'akanthegreat@gmail.com';
    const subject = `New Enquiry from ${name} — ${service || 'Portfolio Website'}`;
    const body    = `Name: ${name}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\nMessage:\n${message}`;

    const mailURL = `mailto:${yourEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailURL;

    const status = document.getElementById('form-status');
    status.textContent = 'Opening WhatsApp & email — message ready to send!';
    status.classList.remove('hidden');
    status.style.color = '#808080';

    this.reset();
  });
});

  // Testimonial slider orbit 3D animation 
  (function(){
  const reviews=[
    {init:"JA",bg:"#1a3a5c",col:"#4a9eff",name:"James A.",date:"2 months ago",role:"Brand Manager",quote:"Akan has a unique ability to see what others miss. The photos from our campaign exceeded every expectation — clients keep asking who shot them."},
    {init:"KO",bg:"#1a3d2b",col:"#34a853",name:"Kemi O.",date:"3 months ago",role:"Recording Artist",quote:"The music video he directed took us to a whole new level. His creative vision plus technical skill is honestly unmatched in Lagos right now."},
    {init:"TN",bg:"#3a1a1a",col:"#ea4335",name:"Tunde N.",date:"2 years ago",role:"Creative Director",quote:"Professional, punctual, and the quality of the work speaks for itself. Akan is our go-to for all visual content. Period."},
    {init:"AF",bg:"#3a2a1a",col:"#fbbc05",name:"Amara F.",date:"9 months ago",role:"Fashion Designer",quote:"I hired Akan for my fashion shoot and the results were beyond anything I imagined. He made the whole process so smooth and the final edits were stunning."},
    {init:"BI",bg:"#1a2a3a",col:"#4285f4",name:"Biodun I.",date:"1 year ago",role:"Marketing Lead",quote:"Working with Akan on our product launch visuals was a game changer. The content stopped people mid-scroll. Best investment we made for the campaign."},
    {init:"SC",bg:"#2a1a3a",col:"#a855f7",name:"Sola C.",date:"4 months ago",role:"Event Organiser",quote:"Akan shot our event and delivered same-day highlights. The quality, the turnaround, the communication — everything was top tier. Will 100% book again."}
  ];

  const gSvg=`<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`;

  const ring=document.getElementById('orbit-ring');
  const wrap=document.getElementById('orbit-wrap');
  const n=reviews.length;
  const radius=300;

  reviews.forEach((r,i)=>{
    const a=(i/n)*Math.PI*2;
    const x=Math.cos(a)*radius;
    const z=Math.sin(a)*radius;
    const el=document.createElement('div');
    el.style.cssText=`position:absolute;width:240px;transform-style:preserve-3d;backface-visibility:hidden;cursor:pointer;transform:translate3d(${x-120}px,-90px,${z}px);`;
    el.innerHTML=`<div style="background:rgba(18,18,18,0.92);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;transition:border-color .3s;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:34px;height:34px;border-radius:50%;background:${r.bg};color:${r.col};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Bebas Neue',sans-serif;flex-shrink:0;">${r.init}</div>
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:500;color:#c0c0c0;">${r.name}</div>
            <div style="font-family:'Space Mono',monospace;font-size:9px;color:#484848;">${r.date}</div>
          </div>
        </div>
        ${gSvg}
      </div>
      <div style="color:#d4a853;font-size:11px;margin-bottom:8px;">★★★★★</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:#707070;line-height:1.6;font-style:italic;">"${r.quote}"</div>
      <div style="font-family:'Space Mono',monospace;font-size:9px;color:#4285f4;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;">${r.role}</div>
    </div>`;
    ring.appendChild(el);
  });

  const cards=[...ring.children];
  let angle=0, paused=false, isDragging=false, lastX=0, dragVel=0;

  wrap.addEventListener('mousedown',e=>{isDragging=true;lastX=e.clientX;dragVel=0;wrap.style.cursor='grabbing';});
  window.addEventListener('mouseup',()=>{isDragging=false;wrap.style.cursor='grab';});
  window.addEventListener('mousemove',e=>{if(!isDragging)return;dragVel=(e.clientX-lastX)*0.004;angle+=dragVel;lastX=e.clientX;});
  wrap.addEventListener('mouseenter',()=>{if(!isDragging)paused=true;});
  wrap.addEventListener('mouseleave',()=>{paused=false;isDragging=false;});

  /* touch support */
  wrap.addEventListener('touchstart',e=>{isDragging=true;lastX=e.touches[0].clientX;dragVel=0;},{passive:true});
  window.addEventListener('touchend',()=>{isDragging=false;});
  window.addEventListener('touchmove',e=>{if(!isDragging)return;dragVel=(e.touches[0].clientX-lastX)*0.004;angle+=dragVel;lastX=e.touches[0].clientX;},{passive:true});

  function orbit(){
    if(!paused&&!isDragging) angle+=0.004;
    else if(isDragging) angle+=dragVel*0.5;
    dragVel*=0.9;
    cards.forEach((card,i)=>{
      const a=angle+(i/n)*Math.PI*2;
      const x=Math.cos(a)*radius;
      const z=Math.sin(a)*radius;
      const scale=0.72+0.28*((z+radius)/(radius*2));
      const op=0.35+0.65*((z+radius)/(radius*2));
      card.style.transform=`translate3d(${x-120}px,-90px,${z}px) scale(${scale.toFixed(3)})`;
      card.style.opacity=op.toFixed(3);
      card.style.zIndex=Math.round(z+radius);
    });
    requestAnimationFrame(orbit);
  }
  orbit();

  /* Particles */
  const canvas=document.getElementById('particle-canvas');
  const ctx=canvas.getContext('2d');
  const stage=document.getElementById('testimonial-stage');
  let W,H;
  const colors=['rgba(66,133,244,','rgba(212,168,83,','rgba(255,255,255,','rgba(168,85,247,'];
  const pts=Array.from({length:70},()=>({
    x:Math.random()*1400,y:Math.random()*600,
    vx:(Math.random()-.5)*0.3,vy:(Math.random()-.5)*0.3,
    r:Math.random()*1.5+0.3,
    c:colors[Math.floor(Math.random()*colors.length)],
    a:Math.random()*Math.PI*2
  }));

  function resize(){W=canvas.width=stage.offsetWidth;H=canvas.height=stage.offsetHeight;}
  resize();
  window.addEventListener('resize',resize);

  function particles(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      p.a+=0.005;
      const op=(0.1+0.2*Math.abs(Math.sin(p.a))).toFixed(3);
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c+op+')';ctx.fill();
    });
    requestAnimationFrame(particles);
  }
  particles();
})();
})();