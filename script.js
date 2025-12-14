document.getElementById('verificationForm').addEventListener('submit', function(event) {
    // ป้องกันการโหลดหน้าใหม่เมื่อกดปุ่ม
    event.preventDefault(); 
    
    const last4DigitsInput = document.getElementById('last4Digits');
    const last4Digits = last4DigitsInput.value.trim();
    const messageDiv = document.getElementById('message');
    
    // ล้างข้อความเก่าและซ่อน
    messageDiv.className = 'hidden'; 
    messageDiv.textContent = '';

    // การตรวจสอบความถูกต้องเบื้องต้น
    if (last4Digits.length !== 4 || !/^\d{4}$/.test(last4Digits)) {
        messageDiv.className = 'error';
        messageDiv.textContent = 'กรุณาใส่ตัวเลข 4 หลักให้ถูกต้อง';
        return;
    }

    // *** นี่คือส่วนที่คุณต้องเชื่อมต่อกับระบบตู้ล็อกเกอร์จริง ***
    // ตัวอย่างการจำลองการส่งข้อมูลไปยังเซิร์ฟเวอร์
    console.log(`Sending verification code: ${last4Digits}`);

    // โดยปกติแล้ว คุณจะใช้ fetch() หรือ XMLHttpRequest เพื่อส่งค่าไปที่ API/Server
    /*
    fetch('/api/verify-locker-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: last4Digits })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.className = 'success';
            messageDiv.textContent = 'ยืนยันสำเร็จ! ล็อกเกอร์หมายเลข A-05 ได้เปิดแล้ว กรุณานำของออก';
            // อาจมีการเปลี่ยนหน้าจอ หรือส่งคำสั่งไปยังตู้ล็อกเกอร์ผ่าน WebSocket/API
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = data.message || 'รหัสไม่ถูกต้องหรือไม่พบข้อมูลการจัดส่ง';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.className = 'error';
        messageDiv.textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง';
    });
    */

    // ตัวอย่างการแสดงผลลัพธ์แบบจำลอง (Mock Success/Failure)
    if (last4Digits === '1234') { 
        // รหัสที่ถูกต้อง (จำลอง)
        messageDiv.className = 'success';
        messageDiv.textContent = 'ยืนยันสำเร็จ! ล็อกเกอร์หมายเลข A-05 ได้เปิดแล้ว กรุณานำของออก';
    } else {
        // รหัสที่ไม่ถูกต้อง (จำลอง)
        messageDiv.className = 'error';
        messageDiv.textContent = 'รหัส 4 ตัวท้ายไม่ถูกต้องหรือไม่พบข้อมูลการจัดส่ง';
    }
});