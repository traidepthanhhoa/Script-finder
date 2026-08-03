// ===== CẤU HÌNH =====
const API_KEY = "AIzaSyAoC10UTsVyMCq4x57ICfYV_WLeKEx0yrg";
const CHANNEL_ID = "UCLnX7s80sPp3JdArqyhh3DQ";

// ===== NGÔN NGỮ =====
let currentLang = 'vi';

const translations = {
    vi: {
        // Menu
        home: 'Trang chủ',
        videos: 'Video',
        playlist: 'Playlist',
        community: 'Cộng đồng',
        about: 'Giới thiệu',
        
        // Thông tin kênh
        subscribers: 'Người đăng ký',
        views: 'Lượt xem',
        videos_count: 'Video',
        
        // Video section
        latest_videos: 'Video mới nhất',
        view_all: 'Xem tất cả',
        
        // Giới thiệu
        about_title: 'Giới thiệu về kênh',
        about_desc: 'Kênh chia sẻ kiến thức và trải nghiệm về công nghệ, lập trình và cuộc sống.',
        
        // Footer
        footer_text: '© 2024 - All rights reserved'
    },
    en: {
        // Menu
        home: 'Home',
        videos: 'Videos',
        playlist: 'Playlist',
        community: 'Community',
        about: 'About',
        
        // Channel info
        subscribers: 'Subscribers',
        views: 'Views',
        videos_count: 'Videos',
        
        // Video section
        latest_videos: 'Latest Videos',
        view_all: 'View All',
        
        // About
        about_title: 'About Channel',
        about_desc: 'Channel sharing knowledge and experiences about technology, programming and life.',
        
        // Footer
        footer_text: '© 2024 - All rights reserved'
    }
};

// ===== HÀM ĐỔI NGÔN NGỮ =====
function changeLanguage(lang) {
    currentLang = lang;
    
    // Cập nhật tất cả các phần tử có data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Cập nhật placeholder nếu có
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Lưu ngôn ngữ vào localStorage
    localStorage.setItem('preferred_language', lang);
    
    // Cập nhật nút ngôn ngữ
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Gọi lại để cập nhật các thông tin động
    updateChannelInfo();
}

// ===== KHỞI TẠO NÚT NGÔN NGỮ =====
function initLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });
    
    // Khôi phục ngôn ngữ đã lưu
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && translations[savedLang]) {
        changeLanguage(savedLang);
    } else {
        // Mặc định là tiếng Việt
        changeLanguage('vi');
    }
}

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

// ===== API YOUTUBE =====
async function loadChannel() {
    const avatar = document.getElementById("avatar");
    const name = document.getElementById("channelName");
    const subs = document.getElementById("subs");
    const views = document.getElementById("views");
    const videos = document.getElementById("videos");
    
    if (!subs) return;
    
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
        const data = await res.json();
        
        if (!data.items) return;
        
        const c = data.items[0];
        if (avatar) avatar.src = c.snippet.thumbnails.high.url;
        if (name) name.textContent = c.snippet.title;
        
        // Cập nhật thông tin với định dạng số
        subs.textContent = Number(c.statistics.subscriberCount).toLocaleString();
        if (views) views.textContent = Number(c.statistics.viewCount).toLocaleString();
        if (videos) videos.textContent = Number(c.statistics.videoCount).toLocaleString();
        
        // Cập nhật lại labels sau khi đã có dữ liệu
        updateChannelInfo();
    } catch (error) {
        console.error('Error loading channel:', error);
    }
}

function updateChannelInfo() {
    // Cập nhật các label của thông tin kênh
    const subsLabel = document.querySelector('[data-i18n="subscribers"]');
    const viewsLabel = document.querySelector('[data-i18n="views"]');
    const videosLabel = document.querySelector('[data-i18n="videos_count"]');
    
    // Tìm phần tử cha chứa các thông tin này để thêm label
    const infoItems = document.querySelectorAll('.channel-info-item');
    if (infoItems.length >= 3) {
        // Giả sử thứ tự: subscribers, views, videos
        if (subsLabel) infoItems[0].innerHTML = `<span class="label">${translations[currentLang].subscribers}</span> <span id="subs">${document.getElementById('subs')?.textContent || '0'}</span>`;
        if (viewsLabel) infoItems[1].innerHTML = `<span class="label">${translations[currentLang].views}</span> <span id="views">${document.getElementById('views')?.textContent || '0'}</span>`;
        if (videosLabel) infoItems[2].innerHTML = `<span class="label">${translations[currentLang].videos_count}</span> <span id="videos">${document.getElementById('videos')?.textContent || '0'}</span>`;
    }
}

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo nút ngôn ngữ
    initLanguageButtons();
    
    // Tải thông tin kênh
    loadChannel();
    
    // Cập nhật mỗi 10 giây
    setInterval(loadChannel, 10000);
});


document.addEventListener("DOMContentLoaded",()=>{
 const sel=document.getElementById("langSelect");
 if(sel){
   sel.addEventListener("change",e=>changeLanguage(e.target.value));
 }
});
