const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUwSwWjnvYb9c6EeOX9mC2ZWoaRMx5Nn0a0ylhgdjOwd63TAvGyNOMRjnp3N9pfrKy/exec"; 
let selectedLocker = null;

function nav(page) {
    document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
    document.getElementById(page + 'Page').classList.remove('hidden');
    if (page === 'sender') loadLockers();
}

// 🚚 สำหรับผู้ส่ง: แสดงตู้ว่าง/เต็ม
async function loadLockers() {
    const grid = document.getElementById('lockerGrid');
    grid.innerHTML = "กำลังโหลดข้อมูล...";
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
                document.getElementById('reserveForm').classList.remove('hidden');
            };
            grid.appendChild(btn);
        });
    } catch (err) { grid.innerHTML = "<p style='color:red'>โหลดข้อมูลล้มเหลว</p>"; }
}

// 🚚 สำหรับผู้ส่ง: กดบันทึกการฝาก
async function doReserve() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "reserve", locker: selectedLocker, phone: phone }) });
    alert("ฝากของสำเร็จ!"); location.reload();
}

// 🎁 สำหรับผู้รับ: ค้นหาและ "ยืนยันรับของ"
async function doSearch() {
    const phone = document.getElementById('phoneSearch').value;
    const resDiv = document.getElementById('searchResult');
    if (phone.length < 4) return alert("กรุณากรอกเบอร์ 4 ตัวท้าย");
    resDiv.innerHTML = "กำลังค้นหา...";
    try {
        const res = await fetch(`${SCRIPT_URL}?action=find&phone=${phone}`);
        const data = await res.json();
        if (data.found) {
            // สร้างปุ่มยืนยันรับของเพื่อลบข้อมูล
            resDiv.innerHTML = `
                <div style="background:#e8f5e9; padding:20px; border-radius:12px; margin-top:15px;">
                    <h3 style="color:#2e7d32">✅ พบพัสดุของคุณ!</h3>
                    <p>อยู่ที่ตู้หมายเลข: <strong>${data.locker}</strong></p>
                    <button class="btn-search" style="background:#27ae60; margin-top:10px;" 
                            onclick="clearLocker('${data.locker}')">
                        📦 ยืนยันรับของเรียบร้อย
                    </button>
                </div>`;
        } else { resDiv.innerHTML = "<p style='color:red; margin-top:15px;'>❌ ไม่พบข้อมูลสำหรับเบอร์นี้</p>"; }
    } catch (err) { resDiv.innerHTML = "เชื่อมต่อผิดพลาด"; }
}

// 🎁 สำหรับผู้รับ: สั่งลบข้อมูลใน Google Sheets
async function clearLocker(num) {
    if(!confirm("ยืนยันการรับของ? ระบบจะล้างเบอร์โทรและคืนสถานะตู้ว่าง")) return;
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "clear", locker: num }) });
    alert("รับของเสร็จสิ้น ตู้วางพร้อมใช้งานต่อแล้ว"); location.reload();
}