FROM python:3.11-slim

WORKDIR /app

# ป้องกัน python สร้าง .pyc และบังคับให้ log ออกทันที (ไม่ buffer)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# ติดตั้ง dependencies ก่อน เพื่อใช้ Docker layer cache
COPY requirements.txt .

# ติดตั้ง torch แบบ CPU-only (เล็กกว่า build ปกติมาก) แล้วติดตั้งที่เหลือ
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

# คัดลอกซอร์สโค้ดและไฟล์ที่จำเป็นต่อการรัน (ไม่รวม "new model", .env ฯลฯ)
COPY app ./app
COPY core ./core
COPY inference ./inference
COPY ckpt ./ckpt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
