// Meghna Humanity Foundation - Main JS
const GITHUB_USERNAME = "mhfoundation350-droid";
const REPO_NAME = "mhf";
const DATA_PATH = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/data/data.json`;

let siteData = {
    name: "Meghna Humanity Foundation",
    slogan: "মানবতার সেবায় আমরা অঙ্গীকারবদ্ধ",
    about: "মেঘনা হিউম্যানিটি ফাউন্ডেশন একটি অরাজনৈতিক সেবামূলক সংগঠন।",
    contact: "মোবাইল: 01XXXXXXXXX | ইমেইল: info@mhf.org",
    donation: 0,
    cost: 0,
    committee: []
};

// Load Data
async function loadData() {
    try {
        const res = await fetch(DATA_PATH);
        if(res.ok) {
            const file = await res.json();
            const content = atob(file.content);
            siteData = JSON.parse(content);
        }
    } catch(e) {
        console.log("No data yet");
    }
    renderSite();
}

// Render Website
function renderSite() {
    if(document.getElementById('site-name')) {
        document.getElementById('site-name').innerText = siteData.name;
        document.getElementById('site-slogan').innerText = siteData.slogan;
        document.getElementById('about-text').innerText = siteData.about;
        document.getElementById('contact-info').innerText = siteData.contact;
        document.getElementById('total-donation').innerText = siteData.donation + ' টাকা';
        document.getElementById('total-cost').innerText = siteData.cost + ' টাকা';
        document.getElementById('current-balance').innerText = (siteData.donation - siteData.cost) + ' টাকা';
        
        // Committee Render
        const committeeDiv = document.getElementById('committee-list');
        if(committeeDiv) {
            committeeDiv.innerHTML = '';
            siteData.committee.sort((a,b) => a.serial - b.serial).forEach(member => {
                committeeDiv.innerHTML += `
                <div class="bg-white rounded-lg shadow-md p-4 text-center">
                    <img src="${member.photo}" class="w-24 h-24 rounded-full mx-auto mb-3 object-cover" alt="${member.name}">
                    <h3 class="font-bold text-lg">${member.name}</h3>
                    <p class="text-green-600 font-semibold">${member.position}</p>
                    <a href="https://wa.me/${member.whatsapp}" target="_blank" class="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded text-sm">WhatsApp</a>
                </div>`;
            });
        }
    }
}

loadData();