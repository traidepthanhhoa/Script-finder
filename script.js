// ===== CẤU HÌNH =====
const API_KEY = "AIzaSyAoC10UTsVyMCq4x57ICfYV_WLeKEx0yrg";
const CHANNEL_ID = "UCLnX7s80sPp3JdArqyhh3DQ";

// ===== MENU =====
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");

// Mở menu
if (menuBtn) {
    menuBtn.onclick = () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");

        menuBtn.style.opacity = "0";
        menuBtn.style.pointerEvents = "none";
    };
}

// Đóng menu
function closeMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");

    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
}

if (overlay) {
    overlay.onclick = closeMenu;
}

document.querySelectorAll("#sidebar a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

// ===== 1. HIỆN PHẦN TỬ KHI SCROLL (Scroll Reveal) =====
const revealElements = document.querySelectorAll('.card, .bigCard, .videoCard, .container h1, #avatar, .title, #subs, .ytBtn');

const revealOnScroll = () => {
    revealElements.forEach((el, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 120;
        
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('revealed');
            // Thêm delay cho từng element
            el.style.transitionDelay = `${index * 0.1}s`;
        }
    });
};

// Thêm class reveal ban đầu và style động
const style = document.createElement('style');
style.textContent = `
    .card, .bigCard, .videoCard, .container h1, #avatar, .title, #subs, .ytBtn {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
        transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .card.revealed, .bigCard.revealed, .videoCard.revealed, 
    .container h1.revealed, #avatar.revealed, .title.revealed, 
    #subs.revealed, .ytBtn.revealed {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    #avatar.revealed {
        animation: float 3s ease-in-out infinite, neonGlow 2s ease-in-out infinite alternate;
    }
`;
document.head.appendChild(style);

// Gọi hàm khi load và scroll
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== 2. ĐẾM SỐ (Counter Animation) =====
const animateCounter = (element, target, duration = 2000) => {
    if (!element) return;
    
    const start = 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (target - start) * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    requestAnimationFrame(updateCounter);
};

// Gắn counter vào các phần tử stats
const observeCounters = () => {
    const counters = document.querySelectorAll('.bigCard h1, #subs');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = parseInt(entry.target.textContent.replace(/,/g, ''));
                if (!isNaN(target)) {
                    animateCounter(entry.target, target, 2500);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
};

// Đợi dữ liệu load xong mới kích hoạt counter
setTimeout(observeCounters, 2000);

// ===== 3. POPUP MỞ/ĐÓNG =====
// Tạo popup container
const popupHTML = `
<div id="popupOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:2000; justify-content:center; align-items:center; animation:fadeIn 0.3s ease;">
    <div id="popupContent" style="background:rgba(10,10,10,0.95); backdrop-filter:blur(20px); padding:40px; border-radius:16px; max-width:500px; width:90%; border:2px solid #00ffff; box-shadow:0 0 60px rgba(0,255,255,0.3); position:relative; animation:popIn 0.4s cubic-bezier(0.22,1,0.36,1);">
        <button id="popupClose" style="position:absolute; top:15px; right:20px; background:transparent; border:none; color:#ff00ff; font-size:30px; cursor:pointer; transition:0.3s ease; font-family:'Poppins',sans-serif;">&times;</button>
        <h2 style="color:#00ffff; margin-bottom:20px; font-family:'Poppins',sans-serif; text-shadow:0 0 20px rgba(0,255,255,0.3);">Thông báo</h2>
        <p id="popupMessage" style="color:#e0e0e0; line-height:1.8; font-family:'Poppins',sans-serif;">Nội dung popup</p>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', popupHTML);

const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupMessage = document.getElementById('popupMessage');

// Hàm mở popup
window.openPopup = (message) => {
    if (popupMessage) popupMessage.textContent = message || 'Chào mừng bạn đến với trang web!';
    if (popupOverlay) {
        popupOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

// Hàm đóng popup
function closePopup() {
    if (popupOverlay) {
        popupOverlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            popupOverlay.style.display = 'none';
            popupOverlay.style.animation = '';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Thêm animation fadeOut
const popupStyle = document.createElement('style');
popupStyle.textContent = `
    @keyframes popIn {
        from { opacity: 0; transform: scale(0.8) translateY(-30px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    #popupClose:hover {
        transform: rotate(90deg) scale(1.2);
        color: #00ffff;
        text-shadow: 0 0 20px rgba(0,255,255,0.5);
    }
`;
document.head.appendChild(popupStyle);

if (popupClose) popupClose.onclick = closePopup;
if (popupOverlay) popupOverlay.onclick = (e) => {
    if (e.target === popupOverlay) closePopup();
};

// Mở popup tự động sau 3 giây
setTimeout(() => {
    openPopup('Chào mừng bạn đến với kênh YouTube của tôi! 🎬');
}, 3000);

// ===== 4. DARK MODE CÓ HIỆU ỨNG =====
// Thêm nút Dark Mode
const darkModeHTML = `
<button id="darkModeBtn" style="position:fixed; bottom:20px; right:20px; background:rgba(10,10,10,0.9); backdrop-filter:blur(10px); border:2px solid #00ffff; color:#00ffff; padding:12px 16px; border-radius:50%; cursor:pointer; z-index:100; font-size:24px; transition:0.4s cubic-bezier(0.22,1,0.36,1); box-shadow:0 0 20px rgba(0,255,255,0.2); font-family:'Poppins',sans-serif;">
    🌙
</button>
`;
document.body.insertAdjacentHTML('beforeend', darkModeHTML);

const darkModeBtn = document.getElementById('darkModeBtn');
let isDarkMode = true;

darkModeBtn.onclick = () => {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.style.background = '#0a0a0a';
        document.body.style.color = '#fff';
        darkModeBtn.textContent = '🌙';
        darkModeBtn.style.borderColor = '#00ffff';
        darkModeBtn.style.color = '#00ffff';
        darkModeBtn.style.boxShadow = '0 0 20px rgba(0,255,255,0.2)';
        
        // Hiệu ứng chuyển đổi
        document.querySelectorAll('.card, .bigCard, .videoCard').forEach(el => {
            el.style.background = 'rgba(10,10,10,0.8)';
            el.style.borderColor = 'rgba(0,255,255,0.15)';
        });
    } else {
        document.body.style.background = '#f0f0f0';
        document.body.style.color = '#1a1a1a';
        darkModeBtn.textContent = '☀️';
        darkModeBtn.style.borderColor = '#ff00ff';
        darkModeBtn.style.color = '#ff00ff';
        darkModeBtn.style.boxShadow = '0 0 20px rgba(255,0,255,0.2)';
        
        document.querySelectorAll('.card, .bigCard, .videoCard').forEach(el => {
            el.style.background = 'rgba(240,240,240,0.9)';
            el.style.borderColor = 'rgba(255,0,255,0.15)';
        });
    }
    
    // Animation ripple
    darkModeBtn.style.transform = 'scale(1.3)';
    setTimeout(() => {
        darkModeBtn.style.transform = 'scale(1)';
    }, 300);
};

// ===== 5. TYPING EFFECT =====
const typingElement = document.querySelector('.title');
if (typingElement) {
    const originalText = typingElement.textContent;
    const typingWrapper = document.createElement('span');
    typingWrapper.className = 'typing-wrapper';
    typingWrapper.innerHTML = `<span class="typing-text"></span><span class="cursor">|</span>`;
    typingElement.innerHTML = '';
    typingElement.appendChild(typingWrapper);
    
    const typingText = typingWrapper.querySelector('.typing-text');
    const cursor = typingWrapper.querySelector('.cursor');
    let charIndex = 0;
    let isTypingComplete = false;
    
    // Style typing
    const typingStyle = document.createElement('style');
    typingStyle.textContent = `
        .typing-wrapper {
            display: inline-block;
        }
        .cursor {
            display: inline-block;
            animation: blink 0.7s step-end infinite;
            color: #00ffff;
            font-weight: 300;
            font-size: 22px;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(typingStyle);
    
    const typeText = () => {
        if (charIndex < originalText.length) {
            typingText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 80 + Math.random() * 40);
        } else {
            isTypingComplete = true;
            setTimeout(() => {
                cursor.style.animation = 'blink 0.7s step-end infinite';
            }, 1000);
        }
    };
    
    // Bắt đầu typing khi element xuất hiện
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                entry.target.dataset.typed = 'true';
                setTimeout(typeText, 500);
            }
        });
    }, { threshold: 0.5 });
    
    typingObserver.observe(typingElement);
}

// ===== 6. PARTICLE / BACKGROUND ĐỘNG =====
// Tạo canvas particle
const canvas = document.createElement('canvas');
canvas.id = 'particleCanvas';
canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
`;
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
    }
    
    update() {
        // Di chuyển
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Tương tác với chuột
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const force = (150 - distance) / 150;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
            this.size = Math.min(this.size + 0.3, 5);
        } else {
            this.size = Math.max(this.size - 0.1, 1);
        }
        
        // Giới hạn trong canvas
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// Tạo particles
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

// Vẽ connections
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    drawConnections();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== API YOUTUBE =====
async function loadChannel(){
    const avatar = document.getElementById("avatar");
    const name = document.getElementById("channelName");
    const subs = document.getElementById("subs");
    const views = document.getElementById("views");
    const videos = document.getElementById("videos");
    
    if(!subs) return;
    
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
        const data = await res.json();
        
        if(!data.items) return;
        
        const c = data.items[0];
        
        if(avatar) avatar.src = c.snippet.thumbnails.high.url;
        if(name) name.textContent = c.snippet.title;
        
        // Cập nhật counter nếu chưa được đếm
        if (!subs.dataset.counted) {
            subs.textContent = Number(c.statistics.subscriberCount).toLocaleString();
        }
        
        if(views && !views.dataset.counted) {
            views.textContent = Number(c.statistics.viewCount).toLocaleString();
        }
        
        if(videos && !videos.dataset.counted) {
            videos.textContent = Number(c.statistics.videoCount).toLocaleString();
        }
    } catch (error) {
        console.error('Lỗi load channel:', error);
    }
}

loadChannel();
setInterval(loadChannel, 10000);

// ===== TÍNH NĂNG PHỤ TRỢ =====
// Smooth scroll cho các link
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

console.log('🚀 Website đã load thành công!');
console.log('✨ Các tính năng: Scroll Reveal, Counter, Popup, Dark Mode, Typing, Particles');
