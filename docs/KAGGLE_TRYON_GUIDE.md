# 🚀 Hướng Dẫn Chạy AI Try-On Trên GPU Kaggle Miễn Phí (100% Free)

Tài liệu này hướng dẫn bạn cách khởi chạy máy chủ sinh ảnh cổ phục trên GPU **Tesla T4 (16GB VRAM)** của Kaggle hoàn toàn miễn phí, sau đó kết nối trực tiếp với ứng dụng web VietPhuc Remix qua **Cloudflare Tunnel**.

---

## Ưu điểm của phương án Kaggle
- **Miễn phí 100%**: Kaggle cấp **30 giờ GPU/tuần** (Tesla T4 x 2 hoặc P100).
- **Không cần thẻ tín dụng / Visa**: Chỉ cần tài khoản Kaggle miễn phí (xác thực số điện thoại).
- **Tốc độ nhanh**: Sinh 1 ảnh cổ phục chất lượng cao trong khoảng **3 - 5 giây** với mô hình `SDXL-Lightning` 4-step.
- **Bảo mật & Ổn định**: Mở cổng HTTPS Public tự động qua Cloudflare Tunnel (`https://xxxx.trycloudflare.com`).

---

## 4 Bước thực hiện (chưa đến 2 phút):

### Bước 1: Mở Kaggle và tạo Notebook mới
1. Đăng nhập vào [Kaggle](https://www.kaggle.com/).
2. Bấm nút **Create** $\rightarrow$ chọn **New Notebook** (hoặc truy cập `https://www.kaggle.com/code/new`).

### Bước 2: Bật GPU và Internet trên Kaggle
Ở cột bên phải (**Notebook Options**):
- **Accelerator**: Chọn **GPU T4 x 2** (hoặc GPU T4).
- **Internet**: Gạt sang **Internet On** (bắt buộc để tải model và mở tunnel).

### Bước 3: Nạp file Notebook vào Kaggle
Có 2 cách:
- **Cách A (Nhanh nhất - Upload file)**:
  1. Trong menu trên của Kaggle, bấm **File** $\rightarrow$ **Import Notebook**.
  2. Chọn file [`scripts/vietphuc_tryon_kaggle.ipynb`](../scripts/vietphuc_tryon_kaggle.ipynb) trong thư mục dự án của bạn.
  3. Bấm **Run All**.
- **Cách B (Copy code)**:
  1. Tạo 1 code cell và copy toàn bộ nội dung từ file [`scripts/vietphuc_tryon_kaggle.py`](../scripts/vietphuc_tryon_kaggle.py) dán vào.
  2. Bấm nút **Play / Run Cell**.

### Bước 4: Lấy đường link và dán vào dự án
Sau khoảng 1-2 phút khi mô hình tải xong, màn hình console sẽ hiển thị thông báo màu xanh:

```text
=================================================================
🎉 VIETPHUC AI TRY-ON SERVER ĐÃ SẴN SÀNG!
👉 PUBLIC URL: https://alpha-beta-gamma.trycloudflare.com
👉 ENDPOINT TRY-ON: https://alpha-beta-gamma.trycloudflare.com/tryon

CÁCH DÙNG CHO APP WEB VIETPHUC:
Mở file .env trong dự án và dán dòng sau:
VITE_TRYON_API_URL=https://alpha-beta-gamma.trycloudflare.com/tryon
=================================================================
```

👉 Bạn chỉ cần copy dòng `VITE_TRYON_API_URL=...` đó dán vào file `.env` của dự án web `vietphuc-remix`.

Từ lúc này, khi người dùng bấm **"Tạo ảnh AI Try On ngay"** trên web, request sẽ được chuyển thẳng đến GPU Kaggle để sinh ảnh thật và trả về web trong vài giây!
