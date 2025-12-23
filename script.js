const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2vsLWVrgtXaKENSKqziteDOTBpoGRIy5KyVJNO0QlkQe6xgYKwZfRK7S1UMP-zrc5/exec";
let selectedLocker = null;

function nav(page) {
    document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
    document.getElementById(page + 'Page').classList.remove('hidden');
    if (page === 'sender') loadLockers();
}

async function loadLockers() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "กำลังโหลด...";
    try {
        const res = await fetch(SCRIPT_URL + "?action=checkStatus");
        const data = await res.json();
        grid.innerHTML = "";
        data.forEach(item => {
            const btn = document.createElement('button');
            // กำหนดสีปุ่มตามสถานะ
            btn.className = `l-btn ${item.status === 'Available' ? 'available' : 'occupied'}`;
            btn.innerHTML = `ตู้ ${item.locker}<br><span>${item.status === 'Available' ? '✅ ว่าง' : '❌ เต็ม'}</span>`;
            btn.disabled = item.status !== 'Available';
            btn.onclick = () => {
                selectedLocker = item.locker;
                document.getElementById('targetLocker').innerText = item.locker;
                document.getElementById('reserveForm').classList.remove('hidden');
            };
            grid.appendChild(btn);
        });
    } catch (err) { grid.innerHTML = "เกิดข้อผิดพลาดในการดึงข้อมูล"; }
}

async function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรอกเบอร์ 4 ตัวท้าย");
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "reserve", locker: selectedLocker, phone: phone }) });
    alert("ฝากของสำเร็จ!"); 
    location.reload();
}

async function doSearch() {
    const phone = document.getElementById('phoneSearch').value;
    const resDiv = document.getElementById('searchResult');
    if (phone.length < 4) return alert("กรอกเบอร์ 4 ตัวท้าย");
    resDiv.innerHTML = "กำลังค้นหา...";
    try {
        const res = await fetch(`${SCRIPT_URL}?action=find&phone=${phone}`);
        const data = await res.json();
        if (data.found) {
            resDiv.innerHTML = `
                <div class='success-box'>✅ พบของที่ตู้หมายเลข ${data.locker}<br><br>
                <button class="btn-confirm" style="background:#27ae60" onclick="clearLocker('${data.locker}')">ยืนยันรับของแล้ว</button></div>`;
        } else { 
            resDiv.innerHTML = "<div class='error-box'>❌ ไม่พบข้อมูลพัสดุสำหรับเบอร์นี้</div>"; 
        }
    } catch (err) { resDiv.innerHTML = "เชื่อมต่อผิดพลาด"; }
}

async function clearLocker(num) {
    if(!confirm("ยืนยันรับของเรียบร้อย? ระบบจะล้างสถานะตู้นี้ให้กลับมาว่าง")) return;
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "clear", locker: num }) });
    alert("รับของเรียบร้อย ตู้ว่างพร้อมใช้งานต่อแล้วครับ"); 
    location.reload();
}