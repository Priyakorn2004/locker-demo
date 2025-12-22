const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzme07rFltXOCW2N6NbGxXP8hNPKJsQJcEwrCcA0EPLhHiwiEsDdAzoJ-e3W1osBOFp/exec";

function loadLockers() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "กำลังโหลดสถานะตู้...";
    
    // ใช้เครื่องหมายบวกเชื่อม URL เพื่อความเสถียร
    fetch(SCRIPT_URL + "?action=checkStatus")
    .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
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
        console.error('Fetch error:', err);
        grid.innerHTML = `<div class="error-box">เกิดข้อผิดพลาดในการโหลด: ${err.message}</div>`;
    });
}