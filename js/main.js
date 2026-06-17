/* main.js */

document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE NAVIGATION ---
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Simple hamburger rotation
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 6px)' : 'none';
    spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
  });

  // Close mobile nav on click
  navLinkItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Add scroll class to navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- ACTIVE LINK ON SCROLL & SCROLL REVEAL ---
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Highlight active link
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Trigger animations if visible
        if (id === 'skills') {
          // Fill skill progress bars
          const fills = entry.target.querySelectorAll('.skill-progress-fill');
          fills.forEach(fill => {
            const val = fill.getAttribute('data-value');
            fill.style.width = `${val}%`;
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // --- PROJECTS GRID FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          // Fade in animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- CONTACT FORM VALIDATION & SIMULATION ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.querySelector('.form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please complete all required fields.';
        return;
      }

      const formEndpoint = contactForm.getAttribute('action');
      const actionIsConfigured = formEndpoint && !formEndpoint.includes('{your-form-id}');

      if (!actionIsConfigured) {
        formFeedback.className = 'form-feedback error';
        formFeedback.style.display = 'block';
        formFeedback.textContent = 'Contact form is not configured yet. Please update the Formspree action URL in the HTML form.';
        return;
      }

      formFeedback.className = 'form-feedback';
      formFeedback.style.display = 'block';
      formFeedback.textContent = 'Transmitting message securely...';

      fetch(formEndpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          formFeedback.className = 'form-feedback success';
          formFeedback.textContent = `Thanks, ${name}! Your transmission has been received. I will respond shortly.`;
          contactForm.reset();
        } else {
          return response.json().then(data => {
            const errorMessage = data?.error || 'Submission failed. Please try again later.';
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent = errorMessage;
          });
        }
      })
      .catch(() => {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Network error. Please try again later.';
      });
    });
  }

  // --- DYNAMIC CANVAS PARTICLE BACKGROUND ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Color config based on theme
  let particleColor = 'rgba(6, 182, 212, 0.4)';
  let lineColor = 'rgba(6, 182, 212, 0.08)';

  const updateThemeColors = (theme) => {
    if (theme === 'cyberpunk') {
      particleColor = 'rgba(0, 255, 204, 0.45)'; // Cyber teal
      lineColor = 'rgba(255, 0, 127, 0.12)';    // Cyber pink lines
    } else if (theme === 'light') {
      particleColor = 'rgba(99, 102, 241, 0.25)'; // Indigo light
      lineColor = 'rgba(99, 102, 241, 0.06)';
    } else {
      particleColor = 'rgba(6, 182, 212, 0.35)'; // Slate cyan
      lineColor = 'rgba(6, 182, 212, 0.07)';
    }
  };

  // Sync initial theme colors
  const activeTheme = localStorage.getItem('portfolio-theme') || 'slate';
  updateThemeColors(activeTheme);

  // Sync dynamic theme updates
  window.addEventListener('themechanged', (e) => {
    updateThemeColors(e.detail.theme);
  });

  // Track Mouse Move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.baseRadius = Math.random() * 2 + 1;
      this.radius = this.baseRadius;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap-around screen bounds
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive push/pull
      if (mouse.x && mouse.y) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.hypot(dx, dy);
        
        if (dist < mouse.radius) {
          // Shrink or grow particle slightly, move closer or push
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
          this.radius = this.baseRadius + force * 1.5;
        } else {
          this.radius = this.baseRadius;
        }
      }
    }
  }

  // Populate particles
  const initParticles = () => {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };
  initParticles();
  window.addEventListener('resize', initParticles);

  // Connect particles with lines
  const connectParticles = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.hypot(dx, dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = (100 - dist) / 100;
          ctx.stroke();
        }
      }
    }
  };

  // Animation Loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
  };
  animate();
});
