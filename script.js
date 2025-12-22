const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwk-5zi6bmbGnj7XOhx87ft4yK32B1uBVwMstTe3_NHDso_1IhHxZ2neIv2AN-CQLnV/exec";
let selectedLocker = null;

// ฟังก์ชันสลับหน้า
function nav(page) {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('senderPage').classList.add('hidden');
    document.getElementById('receiverPage').classList.add('hidden');
    
    document.getElementById(page + 'Page').classList.remove('hidden');
    if (page === 'sender') loadLockers();
}

// ผู้ส่ง: โหลดสถานะตู้
async function loadLockers() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "กำลังโหลด...";
    try {
        const res = await fetch(SCRIPT_URL + "?action=checkStatus");
        const data = await res.json();
        grid.innerHTML = "";
        data.forEach(item => {
            const btn = document.createElement('button');
            btn.className = `l-btn ${item.status}`;
            btn.innerHTML = `ตู้ ${item.locker}<br><span>${item.status === 'Available' ? 'ว่าง' : 'เต็ม'}</span>`;
            btn.disabled = item.status !== 'Available';
            btn.onclick = () => {
                selectedLocker = item.locker;
                document.getElementById('targetLocker').innerText = item.locker;
                document.getElementById('reserveForm').classList.remove('hidden');
            };
            grid.appendChild(btn);
        });
    } catch (err) {
        grid.innerHTML = "<p style='color:red'>โหลดข้อมูลไม่สำเร็จ</p>";
    }
}

// ผู้ส่ง: ยืนยันการฝาก
async function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "reserve", locker: selectedLocker, phone: phone })
    });
    alert("ฝากของสำเร็จ!");
    location.reload();
}

// ผู้รับ: ค้นหาพัสดุ
async function doSearch() {
    const phone = document.getElementById('phoneSearch').value;
    const resDiv = document.getElementById('searchResult');
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    
    resDiv.innerHTML = "กำลังค้นหา...";
    try {
        const res = await fetch(`${SCRIPT_URL}?action=find&phone=${phone}`);
        const data = await res.json();
        resDiv.innerHTML = data.found 
            ? `<div class='success'>✅ พบของที่ตู้หมายเลข ${data.locker}</div>`
            : `<div class='error'>❌ ไม่พบข้อมูลพัสดุ</div>`;
    } catch (err) {
        resDiv.innerHTML = "เกิดข้อผิดพลาดในการค้นหา";
    }
}