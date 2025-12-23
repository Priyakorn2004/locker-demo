const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDZbPSv6QxEiZrCN8sVfLwy4S4LwhrxqmSDYWmMgysTCWErNg8mU_4iNPuhyrdWPjJNw/exec";
let selectedLocker = null;

function nav(page) {
    document.querySelectorAll('.card').forEach(c => c.style.display = 'none');
    document.getElementById(page + 'Page').style.display = 'block';
    if (page === 'sender') loadLockers();
}

async function loadLockers() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "<p>กำลังโหลดสถานะตู้...</p>";
    try {
        const res = await fetch(SCRIPT_URL + "?action=checkStatus");
        const data = await res.json();
        grid.innerHTML = "";
        data.forEach(item => {
            const btn = document.createElement('button');
            btn.className = `l-btn ${item.status === 'Available' ? 'available' : 'occupied'}`;
            btn.innerHTML = `ตู้ ${item.locker}<br><span>${item.status === 'Available' ? '✅ ว่าง' : '❌ เต็ม'}</span>`;
            btn.disabled = item.status !== 'Available';
            btn.onclick = () => {
                selectedLocker = item.locker;
                document.getElementById('targetLocker').innerText = item.locker;
                document.getElementById('reserveForm').style.display = 'block';
            };
            grid.appendChild(btn);
        });
    } catch (err) { grid.innerHTML = "<p style='color:red'>โหลดข้อมูลไม่สำเร็จ</p>"; }
}

async function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "reserve", locker: selectedLocker, phone: phone }) });
    alert("ฝากของสำเร็จ!"); location.reload();
}

async function doSearch() {
    const phone = document.getElementById('phoneSearch').value;
    const resDiv = document.getElementById('searchResult');
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    resDiv.innerHTML = "กำลังค้นหา...";
    try {
        const res = await fetch(`${SCRIPT_URL}?action=find&phone=${phone}`);
        const data = await res.json();
        if (data.found) {
            resDiv.innerHTML = `
                <div class="res-box success">
                    <h3>✅ พบพัสดุของคุณ!</h3>
                    <p>อยู่ที่ตู้หมายเลข: <strong>${data.locker}</strong></p>
                    <button class="btn-clear" onclick="clearLocker('${data.locker}')">📦 ยืนยันรับของเรียบร้อย</button>
                </div>`;
        } else { resDiv.innerHTML = "<div class='res-box error'>❌ ไม่พบข้อมูลพัสดุ</div>"; }
    } catch (err) { resDiv.innerHTML = "<p style='color:red'>เชื่อมต่อผิดพลาด</p>"; }
}

async function clearLocker(num) {
    if(!confirm("ยืนยันว่าได้รับของแล้ว? ระบบจะล้างสถานะตู้นี้ให้กลับมาว่าง")) return;
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "clear", locker: num }) });
    alert("รับของเรียบร้อย ตู้ว่างพร้อมใช้งานต่อแล้ว"); location.reload();
}