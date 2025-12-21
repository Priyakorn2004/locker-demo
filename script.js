const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzM-mx4N_t7bSF0W_VtXxpmusHsb3f5y5Wyw1D7XGwDcwy9w-d8N6-lAtZ1glaE1NZd/exec'; 

function switchPage(page) {
    document.getElementById('roleSelection').classList.add('hidden');
    document.getElementById('senderSection').classList.add('hidden');
    document.getElementById('receiverSection').classList.add('hidden');
    
    if(page === 'sender') {
        document.getElementById('senderSection').classList.remove('hidden');
        loadLockers();
    } else if(page === 'receiver') {
        document.getElementById('receiverSection').classList.remove('hidden');
    } else {
        document.getElementById('roleSelection').classList.remove('hidden');
    }
}

function loadLockers() {
    const list = document.getElementById('lockerList');
    list.innerHTML = 'กำลังโหลดสถานะตู้...';
    fetch(`${SCRIPT_URL}?action=checkStatus`)
    .then(res => res.json())
    .then(data => {
        list.innerHTML = '';
        data.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'locker-btn';
            btn.innerHTML = `ตู้ที่ ${item.locker}<br><small>${item.status === 'Available' ? 'ว่าง' : 'เต็ม'}</small>`;
            btn.disabled = item.status !== 'Available';
            btn.onclick = () => {
                selectedLocker = item.locker;
                document.getElementById('displayLocker').innerText = item.locker;
                document.getElementById('reserveForm').classList.remove('hidden');
            };
            list.appendChild(btn);
        });
    });
}

function submitReservation() {
    const phone = document.getElementById('receiverPhone').value;
    if(phone.length < 4) return alert('กรุณากรอกเบอร์ให้ครบ 4 ตัวท้าย');
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'reserve', locker: selectedLocker, phone: phone })
    }).then(() => {
        alert('ฝากของสำเร็จ!');
        location.reload();
    });
}

function searchLocker() {
    const phone = document.getElementById('searchPhone').value;
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = 'กำลังค้นหา...';

    fetch(`${SCRIPT_URL}?action=find&phone=${phone}`)
    .then(res => res.json())
    .then(data => {
        if(data.found) {
            resultArea.innerHTML = `<div style="background:#e8f5e9; padding:15px; margin-top:15px; border-radius:10px;">
                <h3 style="color:#2e7d32;">พบข้อมูล!</h3>
                <p>ของของคุณอยู่ที่ <strong>ตู้หมายเลข ${data.locker}</strong></p>
            </div>`;
        } else {
            resultArea.innerHTML = `<p style="color:red; margin-top:15px;">ไม่พบข้อมูลของเบอร์นี้</p>`;
        }
    });
}