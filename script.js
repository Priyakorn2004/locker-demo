const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzme07rFltXOCW2N6NbGxXP8hNPKJsQJcEwrCcA0EPLhHiwiEsDdAzoJ-e3W1osBOFp/exec";
let currentLocker = null;

function nav(page) {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('senderPage').classList.add('hidden');
    document.getElementById('receiverPage').classList.add('hidden');
    
    if (page === 'sender') {
        document.getElementById('senderPage').classList.remove('hidden');
        getLockerStatus();
    } else if (page === 'receiver') {
        document.getElementById('receiverPage').classList.remove('hidden');
    } else {
        document.getElementById('homePage').classList.remove('hidden');
    }
}

function getLockerStatus() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "กำลังเช็คสถานะ...";
    
    // ใช้เครื่องหมายบวกเชื่อม URL เพื่อความชัวร์
    fetch(SCRIPT_URL + "?action=checkStatus")
    .then(res => res.json())
    .then(data => {
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
    })
    .catch(err => {
        grid.innerHTML = "เกิดข้อผิดพลาดในการโหลด";
        console.error(err);
    });
}

function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ให้ครบ 4 ตัว");

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "reserve", locker: currentLocker, phone: phone })
    })
    .then(() => {
        alert("ฝากของสำเร็จแล้ว!");
        location.reload();
    })
    .catch(err => alert("บันทึกไม่สำเร็จ"));
}

function doSearch() {
    const phone = document.getElementById('phoneSearch').value;
    const resDiv = document.getElementById('searchResult');
    resDiv.innerHTML = "กำลังค้นหา...";

    fetch(SCRIPT_URL + "?action=find&phone=" + phone)
    .then(res => res.json())
    .then(data => {
        if (data.found) {
            resDiv.innerHTML = `<div class="success-box">เจอแล้ว! พัสดุอยู่ที่ <strong>ตู้หมายเลข ${data.locker}</strong></div>`;
        } else {
            resDiv.innerHTML = `<div class="error-box">ไม่พบข้อมูลเบอร์นี้</div>`;
        }
    });
}