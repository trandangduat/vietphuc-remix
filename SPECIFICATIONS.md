
# 1. Phân tích và làm rõ yêu cầu

## Mục tiêu cốt lõi

Khám phá và **phối trang phục** truyền thống Việt Nam theo sự kiện, địa phương hoặc phong cách cá nhân

## Chân dung người dùng

Người dùng duy nhất: học sinh, sinh viên

## Tính năng

- Must have
  - Chọn nhóm trang phục hoặc bối cảnh văn hóa.
  - Xác định nhu cầu người dùng.
  - Phác thảo trải nghiệm phối đồ.
  - Chọn màu sắc, phụ kiện hoặc phong cách.
  - Đọc thông tin ngắn về nguồn gốc hoặc ý nghĩa của trang phục.
  - So sánh các phương án phối.
  - Xem kết quả phối đồ dưới dạng hình ảnh, thẻ gợi ý hoặc mockup. Tạo và chia sẻ "lookbook Việt phục".
- Nice to have
  - Đề xuất cách bảo đảm thông tin văn hóa được thể hiện phù hợp.
  - Kiểm tra sự hài hòa của màu sắc.
  - Tải ảnh hoặc chọn nhân vật đại diện để thử phối đồ.
  - Gợi ý trang phục theo thời tiết và sự kiện.
  - Cảnh báo những cách kết hợp có thể làm sai lệch đặc trưng văn hóa.

# 2. Định hình giải pháp kỹ thuật

| FIELD    | TECH & SERVICE         |
| -------- | ---------------------- |
| Frontend | Vite + Tanstack, React |
| Backend  | Firebase/Supabase      |
| Hosting  | Vercel                 |

# 3. Luồng xử lý

## Màn hình

| **Mã màn hình** | **Tên màn hình / Trang**                  | **Đối tượng truy cập** | **Mô tả tóm tắt**                                                                                                                                                                       |
| --------------- | ----------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SCR-01          | Trang chủ                                 | Public                 | Hero banner, giới thiệu về các trang phục theo từng thời kỳ                                                                                                                             |
| SCR-02          | Studio phối đồ                            | Public                 | Màn hình chia 2 cửa sổ. Cửa sổ trái hiển thị preview phối đồ theo mẫu đã chọn hoặc là người dùng upload mẫu. Màn hình phải hiển thị các option phối đồ chia theo Hiên đại/Truyền thống. |
| SCR-03          | Trang lưu những bộ đồ/ hình ảnh, lookbook | Người dùng             | Trang lưu những outfit mà người dùng đã tạo. Cho phép tạo lookbook, tải xuống lookbook.                                                                                                 |

