const API_BASE = "https://scriptblox.com/api";

const scriptList = document.getElementById("script-list");
const searchInput = document.getElementById("search");

let scripts = [];

// Load script mới nhất
async function loadScripts() {
    try {
        scriptList.innerHTML = "<p>Đang tải...</p>";

        const res = await fetch(`${API_BASE}/script/fetch`);
        const data = await res.json();

        scripts = data.result?.scripts || [];

        renderScripts(scripts);
    } catch (err) {
        console.error(err);
        scriptList.innerHTML = "<p>Không thể tải dữ liệu.</p>";
    }
}

// Hiển thị
function renderScripts(list) {

    scriptList.innerHTML = "";

    if (!list.length) {
        scriptList.innerHTML = "<p>Không có script.</p>";
        return;
    }

    list.forEach(script => {

        const card = document.createElement("div");
        card.className = "script-card";

        card.innerHTML = `
            <h2>${script.title}</h2>

            <p>${script.game?.name || "Unknown Game"}</p>

            <p>Views: ${script.views || 0}</p>

            <button onclick="viewScript('${script.slug}')">
                Xem Script
            </button>
        `;

        scriptList.appendChild(card);

    });

}

// Xem script
async function viewScript(slug){

    try{

        const res = await fetch(`${API_BASE}/script/${slug}`);
        const data = await res.json();

        const script = data.result.script;

        alert(
`Tên:
${script.title}

Game:
${script.game?.name}

Script:

${script.script}
`
        );

    }catch(e){

        alert("Lỗi!");

    }

}

// Copy
async function copyScript(slug){

    try{

        const res = await fetch(`${API_BASE}/script/${slug}`);
        const data = await res.json();

        navigator.clipboard.writeText(data.result.script.script);

        alert("Đã copy!");

    }catch{

        alert("Không copy được.");

    }

}

// Tìm kiếm
searchInput.addEventListener("input", async () => {

    const q = searchInput.value.trim();

    if(q === ""){
        renderScripts(scripts);
        return;
    }

    try{

        const res = await fetch(`${API_BASE}/script/search?q=${encodeURIComponent(q)}`);

        const data = await res.json();

        renderScripts(data.result?.scripts || []);

    }catch{

        scriptList.innerHTML = "<p>Lỗi tìm kiếm.</p>";

    }

});

// Load khi mở web
loadScripts();
