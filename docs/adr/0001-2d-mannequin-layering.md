# Chuyển từ ảnh Combination dựng sẵn sang mô hình Preview 2D Layer trên ma-nơ-canh

Để hỗ trợ các biến thể màu sắc cho từng mảnh trang phục (Piece) và mở rộng catalog mà không gây bùng nổ cấp số nhân về số lượng ảnh cần dựng trước, hệ thống chuyển từ cơ chế hiển thị ảnh Combination cố định sang cơ chế ghép các layer asset 2D (PNG/WebP nền trong suốt) trên hai mẫu ma-nơ-canh chuẩn (Men và Women). Quyết định này tối ưu hóa chi phí sản xuất asset, cho phép hiển thị tức thì khi người dùng đổi màu hay đổi mảnh phối theo thời gian thực, trong khi vẫn giữ tính năng AI Try on như một tác vụ tạo ảnh người thật độc lập.

## Bối cảnh

Ban đầu, hệ thống dự kiến sinh sẵn ảnh hoàn chỉnh cho mọi Combination hợp lệ giữa các Piece. Tuy nhiên, khi bổ sung yêu cầu cho phép người dùng chọn màu sắc/họa tiết cho từng Piece, số lượng tổ hợp ảnh cần sinh trước tăng theo cấp số nhân (ví dụ: số áo × số màu áo × số quần × số màu quần × số giày × số phụ kiện), dẫn đến chi phí tạo, kiểm duyệt và lưu trữ asset quá lớn, không khả thi cho việc vận hành và mở rộng.

## Quyết định

1. **Bỏ cơ chế ảnh Combination dựng sẵn**: Không tạo ảnh tổng thể trước cho từng tổ hợp.
2. **Áp dụng mô hình Preview 2D Layer**:
   - Sử dụng hai ma-nơ-canh chuẩn cố định (`Men` và `Women`) chung tỷ lệ, góc nhìn chính diện và tọa độ neo (anchor points).
   - Mỗi Biến thể Piece (mỗi màu/họa tiết) được chuẩn bị sẵn một asset 2D nền trong suốt (PNG/WebP) khớp chuẩn với ma-nơ-canh.
   - Trình duyệt/client xếp chồng các layer theo thứ tự z-index cố định: `Ma-nơ-canh → Quần/Chân váy → Giày/Dép → Áo → Phụ kiện` trên lớp Nền Event.
3. **Quản lý biến thể màu sắc**: UI nhóm các biến thể màu dưới một card thiết kế (Mẫu Piece) và hiển thị các swatch màu để người dùng chuyển đổi asset tức thì.
4. **Tách biệt với AI Try on**: Preview 2D phục vụ trải nghiệm phối đồ tức thì trên ma-nơ-canh. Khi người dùng muốn xem trang phục trên cơ thể thật, tính năng AI Try on sẽ nhận ảnh người dùng, danh sách Piece/biến thể đang chọn và Nền Event để sinh ảnh kết quả mới.

## Hệ quả

- **Tích cực**:
  - Số lượng asset cần tạo giảm từ cấp số nhân xuống còn tuyến tính theo số biến thể của từng Piece.
  - Phản hồi giao diện tức thì (< 50ms) khi đổi món đồ hoặc màu sắc, không cần gọi API sinh ảnh hay tải ảnh outfit mới.
  - Dễ dàng bổ sung Piece mới vào catalog mà không cần sinh lại ảnh của các Piece hiện có.
- **Thách thức**:
  - Đòi hỏi độ chính xác cao trong khâu thiết kế asset đồ họa 2D: các layer phải đồng nhất về tỷ lệ, góc chiếu sáng và tọa độ neo để không bị lệch hay lộ viền khi chồng lớp.
