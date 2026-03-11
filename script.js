/* =============================================
   AHMED ABDELGWAD — Portfolio Scripts
   ============================================= */

// ---- Typewriter Effect ----
const typewriterEl = document.getElementById('typewriter');
const roles = ['NLP Engineer', 'AI Developer', 'Deep Learning Enthusiast', 'LLM Specialist', 'Generative AI'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
    }

    setTimeout(typeWriter, speed);
}

typeWriter();

// ---- Navbar Scroll ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ---- Mobile Nav Toggle ----
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu on link click
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// ---- Cursor Glow ----
const cursorGlow = document.getElementById('cursorGlow');
let glowVisible = false;

document.addEventListener('mousemove', (e) => {
    if (!glowVisible) {
        cursorGlow.style.opacity = '1';
        glowVisible = true;
    }
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    glowVisible = false;
});

// ---- Scroll Reveal ----
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ---- Counter Animation ----
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 50);
}

// ---- Particles Background ----

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
const numParticles = 60;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// (Neural Network SVG removed — replaced by profile photo)

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

/* =============================================
   AI PORTFOLIO ASSISTANT — Chat Widget
   FastAPI + Groq + LangChain RAG
   ============================================= */

(function () {
    'use strict';

    // ── Config ──────────────────────────────────────────────────────────────
    // Local dev → localhost | GitHub Pages / production → Render URL
    const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const RENDER_URL = 'https://ahmed-portfolio-ai.onrender.com'; // ← غيّرها برابط Render بتاعك
    const API_URL = (IS_LOCAL ? 'http://localhost:8000' : RENDER_URL) + '/chat';

    // ── DOM refs ─────────────────────────────────────────────────────────────
    const bubble = document.getElementById('aiChatBubble');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatClose');
    const messagesEl = document.getElementById('chatMessages');
    const typingEl = document.getElementById('chatTyping');
    const inputEl = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const suggestions = document.getElementById('chatSuggestions');

    // ── State ────────────────────────────────────────────────────────────────
    let isOpen = false;
    let isLoading = false;

    // ── Helpers ──────────────────────────────────────────────────────────────
    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function setLoading(state) {
        isLoading = state;
        sendBtn.disabled = state;
        typingEl.classList.toggle('visible', state);
        if (state) scrollToBottom();
    }

    function appendMessage(role, text) {
        // role: 'ai' | 'user'
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg chat-msg--${role}`;

        if (role === 'ai') {
            msgDiv.innerHTML = `
                <div class="msg-avatar"><i class="fas fa-brain"></i></div>
                <div class="msg-bubble">${escapeHtml(text)}</div>`;
        } else {
            msgDiv.innerHTML = `
                <div class="msg-bubble">${escapeHtml(text)}</div>
                <div class="msg-avatar" style="background:linear-gradient(135deg,#22d3ee,#6366f1)">
                    <i class="fas fa-user"></i></div>`;
        }

        messagesEl.appendChild(msgDiv);
        scrollToBottom();
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            // Convert **bold** markdown
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert bullet lines starting with - or •
            .replace(/^[-•]\s(.+)/gm, '&bull; $1');
    }

    function showWelcome() {
        const welcome = document.createElement('div');
        welcome.className = 'chat-welcome';
        welcome.innerHTML = `
            👋 Hi! I'm <strong>Ahmed's AI Assistant</strong>, powered by <strong>Groq LLaMA 3.3</strong>.<br><br>
            Ask me anything about Ahmed's <strong>projects</strong>, <strong>RAG expertise</strong>,
            <strong>DEPI training</strong>, or how to <strong>contact</strong> him.`;
        messagesEl.appendChild(welcome);
    }

    // ── Open / Close ─────────────────────────────────────────────────────────
    function openChat() {
        isOpen = true;
        chatWindow.classList.add('open');
        bubble.classList.add('open');
        bubble.setAttribute('aria-expanded', 'true');
        inputEl.focus();
    }

    function closeChat() {
        isOpen = false;
        chatWindow.classList.remove('open');
        bubble.classList.remove('open');
        bubble.setAttribute('aria-expanded', 'false');
    }

    bubble.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

    // ── Send Message ─────────────────────────────────────────────────────────
    async function sendMessage(text) {
        const message = (text || inputEl.value).trim();
        if (!message || isLoading) return;

        // Hide suggestions after first real message
        suggestions.classList.add('hidden');

        appendMessage('user', message);
        inputEl.value = '';
        autoResizeInput();
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.detail || `Server error ${response.status}`);
            }

            const data = await response.json();
            appendMessage('ai', data.response);

        } catch (error) {
            appendMessage('ai',
                `⚠️ Couldn't reach the assistant right now.\n\n` +
                `Make sure the backend is running:\n` +
                `uvicorn main:app --reload\n\n` +
                `Error: ${error.message}`
            );
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    }

    sendBtn.addEventListener('click', () => sendMessage());

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // ── Auto-resize textarea ─────────────────────────────────────────────────
    function autoResizeInput() {
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    }

    inputEl.addEventListener('input', autoResizeInput);

    // ── Suggestion chips ─────────────────────────────────────────────────────
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            sendMessage(chip.dataset.question);
        });
    });

    // ── Init ─────────────────────────────────────────────────────────────────
    showWelcome();

})();
