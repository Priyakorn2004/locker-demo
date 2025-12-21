const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzM-mx4N_t7bSF0W_VtXxpmusHsb3f5y5Wyw1D7XGwDcwy9w-d8N6-lAtZ1glaE1NZd/exec"; // แก้ไขตรงนี้
let currentLocker = null;

function switchPage(p) {
    document.getElementById('roleSelection').style.display = p === 'home' ? 'block' : 'none';
    document.getElementById('senderSection').style.display = p === 'sender' ? 'block' : 'none';
    document.getElementById('receiverSection').style.display = p === 'receiver' ? 'block' : 'none';
    if(p === 'sender') loadStatus();
}

// ดึงสถานะตู้
function loadStatus() {
    const list = document.getElementById('lockerList');
    list.innerHTML = "กำลังโหลด...";
    fetch(SCRIPT_URL + "?action=checkStatus")
        .then(res => res.json())
        .then(data => {
            list.innerHTML = "";
            data.forEach(item => {
                const btn = document.createElement('button');
                btn.className = `locker-box ${item.status}`;
                btn.innerHTML = `ตู้ที่ ${item.locker}<br>${item.status == 'Available' ? 'ว่าง' : 'เต็ม'}`;
                btn.disabled = item.status !== 'Available';
                btn.onclick = () => {
                    currentLocker = item.locker;
                    document.getElementById('selectedNum').innerText = item.locker;
                    document.getElementById('reserveForm').style.display = 'block';
                };
                list.appendChild(btn);
            });
        });
}

// ยืนยันฝากของ
function confirmReserve() {
    const p = document.getElementById('phoneIn').value;
    if(p.length < 4) return alert("กรุณากรอก 4 หลัก");
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'reserve', locker: currentLocker, phone: p })
    }).then(() => { alert("บันทึกสำเร็จ!"); location.reload(); });
}

// ค้นหาเลขตู้
function findMyLocker() {
    const p = document.getElementById('phoneSearch').value;
    fetch(SCRIPT_URL + "?action=find&phone=" + p)
        .then(res => res.json())
        .then(data => {
            const r = document.getElementById('result');
            r.innerHTML = data.found ? `<h3>✅ อยู่ที่ตู้หมายเลข ${data.locker}</h3>` : `<h3 style="color:red">❌ ไม่พบข้อมูล</h3>`;
        });
}