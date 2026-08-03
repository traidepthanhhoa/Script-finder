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

// ===== API YOUTUBE =====
async function loadChannel(){
const avatar=document.getElementById("avatar");
const name=document.getElementById("channelName");
const subs=document.getElementById("subs");
const views=document.getElementById("views");
const videos=document.getElementById("videos");
if(!subs) return;
const res=await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
const data=await res.json();
if(!data.items) return;
const c=data.items[0];
if(avatar) avatar.src=c.snippet.thumbnails.high.url;
if(name) name.textContent=c.snippet.title;
subs.textContent=Number(c.statistics.subscriberCount).toLocaleString();
if(views) views.textContent=Number(c.statistics.viewCount).toLocaleString();
if(videos) videos.textContent=Number(c.statistics.videoCount).toLocaleString();
}
loadChannel();
setInterval(loadChannel,10000);
