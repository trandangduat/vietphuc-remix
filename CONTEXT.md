# Việt phục Remix

Ứng dụng khám phá và gợi ý cách phối Việt phục cho học sinh, sinh viên. Tài liệu này chuẩn hóa các khái niệm nghiệp vụ dùng trong sản phẩm.

## Ngôn ngữ

**Mảnh phối (Piece)**:
Một món trang phục hoặc phụ kiện độc lập thuộc một trong bốn nhóm: áo, quần/chân váy, giày/dép hoặc phụ kiện; nó được biểu diễn bằng asset 2D nền trong suốt, căn theo ma-nơ-canh chuẩn.
_Tránh_: item, sản phẩm, ảnh outfit dựng sẵn

**Biến thể Piece**:
Một Piece có màu hoặc thiết kế khác, có asset 2D riêng. Biến thể không được tạo bằng cách tô lại asset tại thời điểm xem.
_Tránh_: bộ lọc màu, recolor tự do

**Mẫu Piece**:
Nhóm các Biến thể Piece thể hiện cùng một thiết kế, để Studio hiển thị một card thiết kế và các swatch chọn biến thể.
_Tránh_: card màu độc lập, Combination

**Ma-nơ-canh trình bày**:
Một trong hai mẫu cơ thể cố định Men hoặc Women, cùng pose và tỷ lệ, dùng làm nền cho Preview 2D. Đây là lựa chọn trình bày, không phải danh tính người dùng.
_Tránh_: giới hạn giới tính người dùng, avatar tùy chỉnh

**Preview 2D**:
Ảnh xem tức thì tạo bằng cách xếp asset Piece đã chọn lên một ma-nơ-canh chuẩn và Nền Event. Preview 2D không phải ảnh AI hay ảnh outfit dựng sẵn.
_Tránh_: AI Try on, ảnh Combination

**Outfit**:
Tổ hợp 1 áo, 1 quần/chân váy, 1 giày/dép, tối đa 1 phụ kiện, với các Biến thể Piece đã chọn và Nền Event đang dùng.
_Tránh_: ảnh Combination dựng sẵn, lookbook

**Gợi ý outfit**:
Một preset Outfit do đội nội dung tuyển chọn để người dùng chọn nhanh rồi có thể tiếp tục chỉnh Piece hoặc màu.
_Tránh_: ảnh Combination dựng sẵn, preset không chỉnh sửa được

**AI Overview**:
Khu vực diễn giải dữ liệu văn hóa đã thẩm định để đánh giá sự hài hòa màu sắc, độ phù hợp với sự kiện và cảnh báo về khả năng sai lệch đặc trưng văn hóa của Outfit. Kết quả có thể là phù hợp, cần lưu ý hoặc không khuyến nghị, nhưng không chặn phối đồ.
_Tránh_: bộ kiểm duyệt, chức năng chặn phối đồ

**Event cố định**:
Một trong năm bối cảnh chọn sẵn: Tết, dạ hội trường học, Tết Trung Thu, ngày hội văn hóa/trường học, hoặc lễ cưới/lễ gia đình. Mỗi Event cố định sở hữu đúng một nền preview.
_Tránh_: nền của combination, địa phương

**Event tự nhập**:
Một bối cảnh do người dùng có tài khoản mô tả bằng văn bản để hệ thống AI tạo nền preview mới.
_Tránh_: combination tùy chỉnh, Event cố định

**Nền Event**:
Ảnh môi trường dùng sau outfit trong preview hoặc AI Try on. Nền Event là tài sản độc lập, không phải một phần của ảnh Combination.
_Tránh_: ảnh outfit, ảnh combination theo Event

**AI Try on**:
Tác vụ AI tạo ảnh người dùng mặc outfit hiện hành trên Nền Event đang chọn, từ ảnh chân dung do chính người dùng tải lên.
_Tránh_: preview combination, ghép layer trực tiếp

**Lookbook**:
Tập hợp các outfit do người dùng tuyển chọn để xem lại, tải xuống hoặc chia sẻ.
_Tránh_: outfit đơn lẻ

**Tài khoản**:
Danh tính đã đăng nhập của người dùng, cần có để dùng AI Overview, AI Try on, truy cập Lookbook và lưu nền Event tự nhập.
_Tránh_: phiên làm việc, khách ẩn danh

**Lookbook công khai**:
Lookbook đã lưu mà chủ sở hữu chọn xuất bản qua liên kết có thể truy cập bên ngoài; chủ sở hữu có thể thu hồi liên kết.
_Tránh_: ảnh tải xuống, outfit tạm

**Phiên làm việc**:
Khoảng thời gian sử dụng ứng dụng hiện tại, trong đó outfit có thể được lưu tạm mà không cần tài khoản.
_Tránh_: tài khoản khách vĩnh viễn
