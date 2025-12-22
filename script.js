const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZkv4XWh9fnOpIAtBgi__ussggG3Y_WA-bZl8SVc8E-6mSHju14tApC-UhwWq-_zzP/exec";
let currentLocker = null;

function nav(page) {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('senderPage').classList.add('hidden');
    document.getElementById('receiverPage').classList.add('hidden');
    
    const target = document.getElementById(page + 'Page') || document.getElementById('homePage');
    target.classList.remove('hidden');
    
    if (page === 'sender') getLockerStatus();
}

async function getLockerStatus() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "กำลังเช็คสถานะ...";
    
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
                currentLocker = item.locker;
                document.getElementById('targetLocker').innerText = item.locker;
                document.getElementById('reserveForm').classList.remove('hidden');
            };
            grid.appendChild(btn);
        });
    } catch (err) {
        grid.innerHTML = `<div class="error-box">โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชหน้าเว็บ</div>`;
        console.error(err);
    }
}

async function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ให้ครบ 4 ตัว");

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: "reserve", locker: currentLocker, phone: phone })
        });
        alert("ฝากของสำเร็จ!");
        location.reload();
    } catch (err) {
        alert("เกิดข้อผิดพลาดในการบันทึก");
    }
}