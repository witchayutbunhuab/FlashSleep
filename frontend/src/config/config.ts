// src/config/config.js

const CONFIG = {
  // สำหรับ Android Emulator → ใช้ IP พิเศษ 10.0.2.2
  API_URL: 'http://10.0.2.2:8000',

  // ถ้าใช้ physical device → เปลี่ยนเป็น IP จริงของเครื่องที่รัน FastAPI เช่น:
  // API_URL: 'http://10.255.45.219:8000',

  // ✅ พอร์ตต้องตรงกับที่คุณรัน FastAPI ด้วย uvicorn
  // ✅ อย่าลืมเปิด CORS ใน backend เพื่อให้ frontend เชื่อมต่อได้
};

export default CONFIG;
