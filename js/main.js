/* ============================================
   Main JavaScript — Personal Website
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // Preloader
    // ========================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('loaded');
        }, 800);
    });

    // ========================================
    // Neural Network Canvas Animation
    // ========================================
    class NeuralCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };
            this.animationId = null;

            this.resize();
            this.init();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            this.particles = [];
            const numParticles = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 12000), 120);
            for (let i = 0; i < numParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                // Mouse interaction
                if (this.mouse.x !== null) {
                    const dx = p.x - this.mouse.x;
                    const dy = p.y - this.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.mouse.radius) {
                        const force = (this.mouse.radius - dist) / this.mouse.radius;
                        p.x += dx * force * 0.02;
                        p.y += dy * force * 0.02;
                    }
                }

                // Draw particle
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = isLight
                    ? `rgba(109, 40, 217, ${p.opacity * 0.7})`
                    : `rgba(124, 58, 237, ${p.opacity})`;
                this.ctx.fill();

                // Draw connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        const opacity = (1 - dist / 160) * (isLight ? 0.12 : 0.15);
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = isLight
                            ? `rgba(8, 145, 178, ${opacity})`
                            : `rgba(6, 182, 212, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            }

            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    new NeuralCanvas('neural-canvas');

    // ========================================
    // Cursor Glow Effect (desktop only)
    // ========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        let glowVisible = false;
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            if (!glowVisible) {
                cursorGlow.classList.add('visible');
                glowVisible = true;
            }
        });
    }

    // ========================================
    // Theme Toggle
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ========================================
    // Navbar
    // ========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('.section');
    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // Typewriter Effect
    // ========================================
    class Typewriter {
        constructor(element, words, typingSpeed = 80, deletingSpeed = 50, pauseDuration = 2000) {
            this.element = element;
            this.words = words;
            this.typingSpeed = typingSpeed;
            this.deletingSpeed = deletingSpeed;
            this.pauseDuration = pauseDuration;
            this.currentWord = 0;
            this.currentChar = 0;
            this.isDeleting = false;
            this.type();
        }

        type() {
            const word = this.words[this.currentWord];

            if (this.isDeleting) {
                this.currentChar--;
                this.element.textContent = word.substring(0, this.currentChar);
            } else {
                this.currentChar++;
                this.element.textContent = word.substring(0, this.currentChar);
            }

            let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

            if (!this.isDeleting && this.currentChar === word.length) {
                delay = this.pauseDuration;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentChar === 0) {
                this.isDeleting = false;
                this.currentWord = (this.currentWord + 1) % this.words.length;
                delay = 300;
            }

            setTimeout(() => this.type(), delay);
        }
    }

    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        new Typewriter(typewriterEl, [
            'agentic AI platforms',
            'Text-to-SQL frameworks',
            'RAG architectures',
            'multi-agent systems',
            'LLM-powered automation',
            'data-driven insights',
        ]);
    }

    // ========================================
    // Greeting based on time of day
    // ========================================
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        if (hour < 12) greetingEl.textContent = "Good morning, I'm";
        else if (hour < 18) greetingEl.textContent = "Good afternoon, I'm";
        else greetingEl.textContent = "Good evening, I'm";
    }

    // ========================================
    // Counter Animation
    // ========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.classList.contains('counted')) return;
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function update() {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    counter.classList.add('counted');
                    return;
                }
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            }
            update();
        });
    }

    // ========================================
    // Scroll Animations (custom AOS)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay, 10));
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        animateObserver.observe(el);
    });

    // Counter observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // ========================================
    // Skill Bars Animation
    // ========================================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach((fill, index) => {
                    setTimeout(() => {
                        fill.style.width = fill.getAttribute('data-width') + '%';
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category').forEach(cat => {
        skillObserver.observe(cat);
    });

    // ========================================
    // Project Filters
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ========================================
    // Testimonials Slider
    // ========================================
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let current = 0;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function goTo(index) {
            current = index;
            track.style.transform = `translateX(-${current * 100}%)`;
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prevBtn.addEventListener('click', () => {
            goTo(current === 0 ? cards.length - 1 : current - 1);
        });

        nextBtn.addEventListener('click', () => {
            goTo(current === cards.length - 1 ? 0 : current + 1);
        });

        // Auto-slide
        let autoSlide = setInterval(() => {
            goTo(current === cards.length - 1 ? 0 : current + 1);
        }, 5000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                goTo(current === cards.length - 1 ? 0 : current + 1);
            }, 5000);
        });
    }

    // ========================================
    // Contact Form (front-end only)
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fields = contactForm.querySelectorAll('input, textarea');
            let valid = true;
            fields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderBottomColor = 'var(--error)';
                    setTimeout(() => {
                        field.style.borderBottomColor = '';
                    }, 2000);
                }
            });

            // Basic email validation
            const emailField = contactForm.querySelector('#email');
            if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                valid = false;
                emailField.style.borderBottomColor = 'var(--error)';
                setTimeout(() => {
                    emailField.style.borderBottomColor = '';
                }, 2000);
            }

            if (valid) {
                const btn = contactForm.querySelector('.btn-submit');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
                btn.style.background = 'var(--success)';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }
        });
    }

    // ========================================
    // Back to Top Button
    // ========================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // Smooth reveal for sections
    // ========================================
    // Add fade-in animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

})();
