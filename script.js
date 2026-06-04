// Meghna Humanity Foundation - Admin JS
const GITHUB_USERNAME = "mhfoundation350-droid";
const REPO_NAME = "mhf";
const DATA_PATH = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/data/committee.json`;

let siteData = {
    name: "Meghna Humanity Foundation",
    slogan: "মানবতার সেবায় আমরা অঙ্গীকারবদ্ধ",
    about: "মেঘনা হিউম্যানিটি ফাউন্ডেশন একটি অরাজনৈতিক সেবামূলক সংগঠন।",
    contact: "মোবাইল: 01XXXXXXXXX | ইমেইল: info@mhf.org",
    donation: 0,
    cost: 0,
    committee: []
};

let editIndex = null;

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
        console.log("No data yet, using default");
    }
    renderSite();
    renderAdminPanel();
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
            if(siteData.committee.length === 0) {
                committeeDiv.innerHTML = '<p class="text-center col-span-full text-gray-500">কোনো কমিটি মেম্বার যোগ করা হয়নি।</p>';
            } else {
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
}

// Admin Panel Render
function renderAdminPanel() {
    const adminList = document.getElementById('admin-committee-list');
    if(!adminList) return;

    adminList.innerHTML = '';
    if(siteData.committee.length === 0) {
        adminList.innerHTML = '<p class="text-center text-gray-500">কোনো মেম্বার যোগ করা হয়নি</p>';
        return;
    }

    siteData.committee.sort((a,b) => a.serial - b.serial).forEach((member, index) => {
        adminList.innerHTML += `
        <div class="flex items-center bg-white p-3 mb-2 rounded shadow">
            <div class="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                ${member.serial || index + 1}
            </div>
            <img src="${member.photo}" class="w-12 h-12 rounded-full mr-3 object-cover">
            <div class="flex-1">
                <b>${member.name} - ${member.position}</b>
                <p class="text-sm">📞 ${member.whatsapp} | ${member.blood}</p>
            </div>
            <button onclick="editMember(${index})" class="bg-blue-500 text-white px-3 py-1 rounded mr-2">এডিট</button>
            <button onclick="deleteMember(${index})" class="bg-red-500 text-white px-3 py-1 rounded">ডিলিট</button>
        </div>`;
    });
}

// Edit বাটন
function editMember(index) {
    const member = siteData.committee[index];
    document.querySelector('input[name="name"]').value = member.name;
    document.querySelector('input[name="position"]').value = member.position;
    document.querySelector('input[name="whatsapp"]').value = member.whatsapp;
    document.querySelector('input[name="blood"]').value = member.blood;
    document.querySelector('input[name="serial"]').value = member.serial;
    document.querySelector('input[name="photo"]').value = member.photo;

    document.getElementById('submitBtn').innerText = 'আপডেট করুন';
    document.getElementById('submitBtn').classList.remove('bg-green-600');
    document.getElementById('submitBtn').classList.add('bg-orange-500');

    editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete বাটন
function deleteMember(index) {
    if(confirm('ডিলিট করতে চাও?')) {
        siteData.committee.splice(index, 1);
        siteData.committee.forEach((m, i) => m.serial = i + 1);
        saveData();
    }
}

// Form Submit
function submitForm() {
    const newMember = {
        name: document.querySelector('input[name="name"]').value,
        position: document.querySelector('input[name="position"]').value,
        whatsapp: document.querySelector('input[name="whatsapp"]').value,
        blood: document.querySelector('input[name="blood"]').value,
        serial: parseInt(document.querySelector('input[name="serial"]').value) || siteData.committee.length + 1,
        photo: document.querySelector('input[name="photo"]').value
    };

    if(editIndex!== null) {
        siteData.committee[editIndex] = newMember;
        editIndex = null;
        document.getElementById('submitBtn').innerText = 'যোগ করুন';
        document.getElementById('submitBtn').classList.remove('bg-orange-500');
        document.getElementById('submitBtn').classList.add('bg-green-600');
    } else {
        siteData.committee.push(newMember);
    }

    siteData.committee.sort((a,b) => a.serial - b.serial);
    saveData();
    document.getElementById('committeeForm').reset();
}

// Save Data - আপাতত লোকাল
async function saveData() {
    alert('ডাটা আপডেট হয়েছে! তবে GitHub এ পার্মানেন্ট সেভ করতে Token লাগবে। আপাতত পেজ রিফ্রেশ দিলে চলে যাবে।');
    renderAdminPanel();
    renderSite();
}

loadData();