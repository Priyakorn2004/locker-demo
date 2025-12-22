const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyauBmmF0sGSjLG1gFhT8QQd5gBo8EaNboFv0RAWxwRxAuvcuTF35WBdxX-6E68_nWd/exec";
let selectedLocker = null;

// ฟังก์ชันสลับหน้า
function nav(page) {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('senderPage').classList.add('hidden');
    document.getElementById('receiverPage').classList.add('hidden');
    
    document.getElementById(page + 'Page').classList.remove('hidden');
    if (page === 'sender') loadLockers();
}

// ฝั่งผู้ส่ง: โหลดตู้
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
        console.error(err);
    }
}

// ฝั่งผู้ส่ง: ยืนยันฝากของ
async function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: "reserve", locker: selectedLocker, phone: phone })
        });
        alert("ฝากของสำเร็จ!");
        location.reload();
    } catch (err) {
        alert("เกิดข้อผิดพลาดในการบันทึก");
    }
}

// ฝั่งผู้รับ: ค้นหาพัสดุ
async function doSearch() {
    const phone = document.getElementById('phoneSearch').value;
    const resDiv = document.getElementById('searchResult');
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    
    resDiv.innerHTML = "กำลังค้นหา...";
    try {
        const res = await fetch(`${SCRIPT_URL}?action=find&phone=${phone}`);
        const data = await res.json();
        if (data.found) {
            resDiv.innerHTML = `<div style="color:green; padding:15px; background:#e8f5e9; border-radius:10px; margin-top:10px;">✅ พบของที่ตู้หมายเลข ${data.locker}</div>`;
        } else {
            resDiv.innerHTML = `<div style="color:red; margin-top:10px;">❌ ไม่พบข้อมูลสำหรับเบอร์นี้</div>`;
        }
    } catch (err) {
        resDiv.innerHTML = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
    }
}