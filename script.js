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

// ---- Neural Network SVG ----
function drawNeuralNetwork() {
    const svg = document.querySelector('.nn-svg');
    if (!svg) return;

    const layers = [3, 5, 5, 4, 2];
    const width = 400;
    const height = 400;
    const layerSpacing = width / (layers.length + 1);
    const nodes = [];

    // Calculate node positions
    layers.forEach((count, layerIndex) => {
        const x = layerSpacing * (layerIndex + 1);
        const nodeSpacing = height / (count + 1);
        const layerNodes = [];

        for (let i = 0; i < count; i++) {
            const y = nodeSpacing * (i + 1);
            layerNodes.push({ x, y });
        }
        nodes.push(layerNodes);
    });

    let svgContent = '';

    // Draw connections
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].forEach(node1 => {
            nodes[i + 1].forEach(node2 => {
                const opacity = 0.08 + Math.random() * 0.12;
                svgContent += `<line x1="${node1.x}" y1="${node1.y}" x2="${node2.x}" y2="${node2.y}" 
                    stroke="url(#lineGrad)" stroke-width="0.8" opacity="${opacity}">
                    <animate attributeName="opacity" values="${opacity};${opacity + 0.15};${opacity}" 
                        dur="${2 + Math.random() * 4}s" repeatCount="indefinite"/>
                </line>`;
            });
        });
    }

    // Draw nodes
    nodes.forEach((layer, layerIndex) => {
        layer.forEach((node, nodeIndex) => {
            const colors = ['#6366f1', '#22d3ee', '#a78bfa', '#34d399', '#f472b6'];
            const color = colors[layerIndex % colors.length];
            const r = 6 + Math.random() * 3;

            svgContent += `
                <circle cx="${node.x}" cy="${node.y}" r="${r}" fill="${color}" opacity="0.8">
                    <animate attributeName="r" values="${r};${r + 2};${r}" 
                        dur="${2 + Math.random() * 3}s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" 
                        dur="${3 + Math.random() * 2}s" repeatCount="indefinite"/>
                </circle>
                <circle cx="${node.x}" cy="${node.y}" r="${r * 2.5}" fill="${color}" opacity="0.06">
                    <animate attributeName="r" values="${r * 2};${r * 3};${r * 2}" 
                        dur="${2 + Math.random() * 3}s" repeatCount="indefinite"/>
                </circle>`;
        });
    });

    svg.innerHTML = `
        <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.4"/>
            </linearGradient>
        </defs>
        ${svgContent}
    `;
}

drawNeuralNetwork();

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
