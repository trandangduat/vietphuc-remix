# ASSET SPECIFICATIONS — Quy chuẩn Thiết kế Đồ họa 2D Layer

Tài liệu này quy định toàn bộ tiêu chuẩn kỹ thuật, hệ tọa độ neo, kích thước canvas và quy tắc vẽ/xuất file cho đội ngũ thiết kế đồ họa (hoặc pipeline sinh asset AI) của dự án **Việt phục Remix**.

Việc tuân thủ nghiêm ngặt tài liệu này đảm bảo mọi mảnh trang phục (Piece) và biến thể màu sắc đều **khớp chuẩn 100% khi xếp chồng tự động** trên ma-nơ-canh mà không cần can thiệp co giãn, dịch chuyển hay xoay góc tại runtime ("Zero Runtime Transform").

---

## 1. Nguyên lý cốt lõi & Quy chuẩn Canvas

### 1.1 Nguyên lý "Zero Runtime Transform"

1. **Cùng Canvas, Cùng Tỷ lệ**: Mọi asset của mọi nhóm (ma-nơ-canh, quần, giày, áo, phụ kiện) đều được vẽ và xuất trên **cùng một khung hình canvas cố định**.
2. **Không co kéo runtime**: Lập trình viên chỉ việc xếp các thẻ `<img>` đè lên nhau (hoặc vẽ đè lên HTML5 Canvas) tại cùng tọa độ `(top: 0, left: 0, width: 100%, height: 100%)`.
3. **Nền trong suốt tuyệt đối**: Mọi asset trang phục và ma-nơ-canh bắt buộc phải có kênh màu trong suốt (Alpha = 0 ở các vùng không chứa nét vẽ), đường biên cắt sắc nét, không để lại viền trắng hoặc hạt màu rác (clean transparent background).

### 1.2 Kích thước & Độ phân giải Canvas chuẩn

* **Tỷ lệ khung hình (Aspect Ratio)**: **3 : 4** (Chuẩn khung hình chân dung thời trang hiện đại cho mobile & desktop).
* **Độ phân giải Master (Thiết kế gốc)**: `1200 x 1600 px` (Dùng để vẽ minh họa vector hoặc vẽ kỹ thuật số độ phân giải cao).
* **Độ phân giải Web Production (Xuất bản)**:
  * `900 x 1200 px` (Chuẩn hiển thị sắc nét cho màn hình Retina / HiDPI).
  * `600 x 800 px` (Bản thumbnail hoặc tối ưu cho thiết bị di động kết nối yếu).
* **Hệ màu**: sRGB (chuẩn hiển thị đồng nhất trên các trình duyệt web).

---

## 2. Hệ Tọa độ Neo chuẩn hóa (Anatomical Landmarks)

Tất cả các món đồ đều phải căn theo tỷ lệ giải phẫu của ma-nơ-canh chuẩn. Tọa độ tính theo phần trăm (%) chiều cao tính từ **đỉnh canvas (Y = 0%)** xuống **đáy canvas (Y = 100%)**, căn giữa theo trục dọc **(X = 50%)**.

```
Y = 0%   +-----------------------------------------------------------+ (Mép trên Canvas)
         |                     | Trục giữa X = 50%                   |
Y = 10%  |        [  Khăn đóng / Nón quai thao / Nón lá  ]           |
Y = 12%  | - - - - - - - - [ Đỉnh đầu ma-nơ-canh ] - - - - - - - - - |
Y = 17%  |                     [ Mắt / Mũi ]                         |
Y = 22%  | - - - - - - - - [ Cằm / Gốc cổ áo ] - - - - - - - - - - - | <- Gốc cổ áo đứng/cổ tròn
Y = 26%  | - - - - - - - - [ Đường ngang vai ] - - - - - - - - - - - | <- Điểm nối vai áo
Y = 36%  |                     [ Vòng ngực ]                         |
Y = 46%  | - - - - - - - - [ Đường thắt eo tự nhiên ] - - - - - - -  | <- Cạp quần/váy, xẻ tà áo
Y = 52%  | - - - - - - - - [ Khớp cổ tay / Bàn tay ] - - - - - - - - | <- Tay áo, cầm phụ kiện
Y = 55%  | - - - - - - - - [ Khớp háng / Đáy quần ] - - - - - - - -  |
Y = 68%  | - - - - - - - - [ Khớp đầu gối ] - - - - - - - - - - - -  | <- Gấu áo lửng/ngũ thân lửng
Y = 82%  |                     [ Bắp chân ]                          | <- Gấu váy midi
Y = 88%  | - - - - - - - - [ Mắt cá chân ] - - - - - - - - - - - - - | <- Gấu quần suông/ống túm
Y = 92%  | - - - - - - - - [ Mặt sàn / Đế giày ] - - - - - - - - - - | <- Đế giày/guốc tiếp đất
Y = 100% +-----------------------------------------------------------+ (Mép dưới Canvas)
```

### Bảng thông số tọa độ chính xác:

| Mốc giải phẫu (Landmark) | Tọa độ Y (% Canvas) | Sai số cho phép | Nhóm trang phục neo theo mốc này |
| --- | :---: | :---: | --- |
| **Đỉnh đầu** | `12%` | ± 1% | Khăn đóng, nón lá, trâm cài, nón quai thao |
| **Gốc cổ (Cổ họng)** | `22%` | ± 0.5% | Cổ áo tấc, cổ ngũ thân, cổ tròn áo bà ba, vòng ngọc |
| **Đường ngang vai** | `26%` | ± 1% | Đường may cầu vai của mọi loại áo |
| **Thắt eo tự nhiên** | `46%` | ± 1% | Cạp quần tây, cạp chân váy, vị trí xẻ tà của áo dài |
| **Vị trí bàn tay (thả lỏng)** | `52%` | ± 1% | Cổ tay áo, túi xách, quạt xếp cầm tay |
| **Đáy quần (Crotch)** | `55%` | ± 1% | Đáy quần tây, quần lụa |
| **Khớp gối** | `68%` | ± 1.5% | Gấu áo dài cách tân tà lửng, váy đụp dài |
| **Mắt cá chân** | `88%` | ± 1% | Gấu quần tây, gấu quần lụa suông, cổ giày boots |
| **Mặt sàn (Ground plane)** | `92%` | 0% (Cố định) | Đế giày sneakers, guốc mộc, đế loafer |

---

## 3. Quy chuẩn Thiết kế chi tiết theo từng Layer

Thứ tự z-index khi ghép layer:
$$\text{Nền Event (Z=0)} \rightarrow \text{Ma-nơ-canh (Z=1)} \rightarrow \text{Quần/Váy (Z=2)} \rightarrow \text{Giày/Dép (Z=3)} \rightarrow \text{Áo (Z=4)} \rightarrow \text{Phụ kiện (Z=5)}$$

---

### Layer 0: Nền Event (Backgrounds)

* **Tính chất**: Ảnh đặc không trong suốt (RGB, không alpha), lấp đầy toàn bộ khung `1200 x 1600 px`.
* **Phối cảnh (Perspective)**:
  * Góc chụp ngang tầm mắt người đứng thẳng (Eye-level perspective).
  * Mặt sàn (đường chân trời/mặt đất tiếp xúc) phải nằm đúng ở mốc **$Y = 92\%$** để chân ma-nơ-canh tiếp đất tự nhiên, không bị hiệu ứng "lơ lửng trên không".
* **Ánh sáng**: Ánh sáng môi trường tự nhiên, dịu nhẹ; không chiếu góc chéo quá gắt gây xung đột với bóng đổ trên ma-nơ-canh.

---

### Layer 1: Ma-nơ-canh chuẩn (Men & Women Base)

* **Tạo hình (Styling)**:
  * Phong cách tối giản, thanh lịch, dạng mannequin thời trang studio (không phải tượng sáp hay người thật chụp góc tự do).
  * Tone màu cơ thể: Tông be sáng / xám ấm trung tính (`#EFECE6` hoặc `#E6E1DA`), giúp làm nổi bật màu sắc vải vóc.
  * Tóc: Búi gọn gàng phía sau gáy hoặc tóc tém ôm sát đầu, đảm bảo không có lọn tóc chìa ra ngoài vùng đỉnh đầu ($Y = 12\%$) để không bị lộ khi đội khăn đóng/nón.
* **Tư thế (Pose)**:
  * Đứng thẳng chính diện (Front-facing 100%), không nghiêng vai, không xoay hông.
  * Hai tay buông xuôi tự nhiên hơi chếch nhẹ 10–12 độ so với thân người (để thấy rõ đường eo và tạo khoảng trống cho tà áo tấc tay thụng buông rủ).
  * Hai chân đứng thẳng, khoảng cách giữa hai gót chân hẹp ($8\% - 10\%$ độ rộng canvas).

---

### Layer 2: Quần / Chân váy (Bottoms)

* **Vị trí & Neo**:
  * Cạp quần/váy bắt đầu từ mốc eo tự nhiên **$Y = 46\%$**.
  * Quần ống suông (Quần lụa áo dài, Quần tây xếp ly): Ống quần rủ thẳng xuống mốc **$Y = 88\%$** (phủ nhẹ lên mép trên của giày).
  * Chân váy xếp ly / Váy đụp: Xòe nhẹ từ eo, gấu váy kết thúc ở khoảng **$Y = 75\% - 82\%$**.
  * Quần cargo / Baggy: Có độ phồng tự nhiên ở bắp chân, bo gấu hoặc buông trên mắt cá.
* **Lưu ý che phủ (Occlusion)**:
  * Mặc dù phần cạp sẽ bị Layer 4 (Áo) che phủ trong hầu hết các bộ đồ dài, phần cạp quần và đường chỉ thắt lưng **vẫn phải được vẽ đầy đủ và gọn gàng**, phục vụ các trường hợp người dùng chọn *Áo bà ba croptop* hoặc *Áo thun sơ vin*.

---

### Layer 3: Giày / Dép (Footwear)

* **Vị trí & Neo**:
  * Tọa độ xuất hiện: Từ **$Y = 86\%$** (cổ giày) đến **$Y = 92\%$** (mặt đế tiếp đất).
* **Đặc điểm từng loại**:
  * **Guốc mộc / Dép cói / Sandal**: Vẽ ôm khít bàn chân ma-nơ-canh, đế gỗ/cói chạm đúng mặt phẳng $Y = 92\%$.
  * **Hài nhung thêu / Giày Loafer / Mary Jane**: Mũi giày hơi hướng nhẹ về phía trước, độ bóng nhẹ.
  * **Sneakers / Chelsea boots / Combat boots**: Cổ giày có thể vươn lên tới $Y = 84\%$.
* **Mối quan hệ với Quần**:
  * Vì Giày (Z=3) nằm **trên** Quần (Z=2), gấu quần bình thường sẽ bị cổ giày/boots đè lên. Để xử lý quần dài phủ qua giày, designer vẽ gấu quần Layer 2 hơi lùi vào trong, tạo cảm giác ống quần buông trùm tự nhiên quanh cổ giày.

---

### Layer 4: Áo & Áo khoác (Tops & Outerwear)

* **Vị trí & Neo**:
  * Cổ áo: Khớp chính xác với gốc cổ tại **$Y = 22\%$**.
  * Cầu vai: Khớp với vai ma-nơ-canh tại **$Y = 26\%$**.
  * Tay áo: Ôm lấy cánh tay ma-nơ-canh; với *Áo tấc*, tay áo thụng buông rủ rộng sang hai bên từ khuỷu tay đến quá khớp cổ tay ($Y = 54\%$).
* **Thân & Tà áo**:
  * **Áo dài truyền thống / Áo ngũ thân**: Tà áo xẻ từ eo ($Y = 46\%$), buông rủ qua gối ($Y = 75\%$) hoặc mắt cá ($Y = 86\%$). Do Áo nằm ở Layer 4 (trên Quần Layer 2), tà áo sẽ phủ tự nhiên bên ngoài quần mà không bị lỗi đè layer.
  * **Áo bà ba truyền thống**: Xẻ tà thấp ở hông, vạt áo kết thúc ngang hông ($Y = 54\%$).
  * **Áo bà ba croptop**: Vạt áo kết thúc trên rốn ($Y = 43\%$), để lộ cạp quần Layer 2.
  * **Áo Blazer oversize**: Form rộng buông thẳng qua hông ($Y = 56\%$), có khoảng hở cổ chữ V để lộ áo mặc bên trong nếu có.

---

### Layer 5: Phụ kiện (Accessories)

Phụ kiện nằm ở tầng cao nhất (Z=5) và chia thành 3 phân nhóm neo:

1. **Phụ kiện đội đầu (Headwear)**:
   * *Khăn đóng / Khăn xếp*: Neo từ đỉnh trán ($Y = 15\%$) lên đỉnh đầu ($Y = 10\%$), ôm khít vòng đầu ma-nơ-canh.
   * *Nón lá*: Neo chéo nhẹ hoặc đội ngang, che từ đỉnh đầu xuống ngang tầm mắt ($Y = 8\% - 18\%$), có quai nón lụa buông xuống cằm ($Y = 23\%$).
   * *Nón quai thao*: Đường kính lớn, neo sau lưng hoặc đội nhẹ trên đầu.
2. **Phụ kiện đeo cổ & Thân trên (Neck & Torso)**:
   * *Vòng ngọc bích / Chuỗi hạt gỗ*: Neo quanh cổ ($Y = 23\%$), buông rủ trước ngực ($Y = 30\% - 35\%$), đè lên trên cổ áo.
   * *Khăn rằn Nam Bộ*: Quàng quanh cổ, hai vạt khăn rủ thẳng dọc thân áo xuống eo ($Y = 46\%$).
   * *Cà vạt thêu cổ phục*: Neo ở nút cổ áo, rủ xuống ngang ngực ($Y = 38\%$).
3. **Phụ kiện cầm tay & Đeo vai (Handheld & Bags)**:
   * *Quạt xếp (gỗ/giấy)*: Nằm ở vị trí bàn tay phải/trái ma-nơ-canh ($Y = 50\% - 55\%$).
   * *Túi kẹp nách (Baguette bag)*: Nằm sát nách ma-nơ-canh ($Y = 32\% - 40\%$).
   * *Túi tote canvas / Túi cói*: Quai túi vắt qua vai, thân túi nằm ngang đùi ($Y = 50\% - 62\%$).

---

## 4. Định dạng Kỹ thuật & Tối ưu hóa Asset

| Tiêu chí | Quy định chuẩn |
| --- | --- |
| **Định dạng file (Format)** | **PNG-24** (có Alpha channel) hoặc **WebP** (Lossless/Near-lossless có Alpha). Không dùng JPEG cho các layer trang phục. |
| **Dung lượng tối đa (File size)** | • Ma-nơ-canh: $\le 150 \text{ KB}$ (WebP) hoặc $\le 300 \text{ KB}$ (PNG).<br>• Áo / Quần: $\le 120 \text{ KB}$ (WebP) hoặc $\le 250 \text{ KB}$ (PNG).<br>• Giày / Phụ kiện: $\le 80 \text{ KB}$ (WebP) hoặc $\le 150 \text{ KB}$ (PNG).<br>• Nền Event (Background): $\le 200 \text{ KB}$ (WebP chất lượng 85%). |
| **Xử lý cạnh viền (Edge Matting)** | Tuyệt đối không để lại viền sáng (White fringing/halo) hay viền đen mờ xung quanh nét vẽ. Khử răng cưa (Anti-aliasing) mượt mà trên nền trong suốt. |
| **Độ sâu màu (Color Depth)** | 8-bit per channel (24-bit RGB + 8-bit Alpha). |

---

## 5. Quy chuẩn Đặt tên File & Cấu trúc Thư mục

Mọi file asset phải đặt tên bằng chữ thường, không dấu, nối nhau bằng dấu gạch ngang (`kebab-case`) theo cấu trúc:

$$\text{[nhóm]}-\text{[tên món]}-\text{[giới tính ma-nơ-canh]}-\text{[mã biến thể màu/họa tiết]}.\text{ext}$$

### 5.1 Cấu trúc thư mục chuẩn trong dự án:

```
public/assets/
├── mannequins/
│   ├── mannequin-men.webp
│   └── mannequin-women.webp
├── pieces/
│   ├── tops/
│   │   ├── top-ao-tac-men-indigo.webp
│   │   ├── top-ao-tac-men-crimson.webp
│   │   ├── top-ao-ngu-than-women-emerald.webp
│   │   ├── top-ao-ba-ba-croptop-women-cream.webp
│   │   └── top-blazer-oversize-unisex-charcoal.webp
│   ├── bottoms/
│   │   ├── bottom-quan-lua-unisex-white.webp
│   │   ├── bottom-quan-lua-unisex-black.webp
│   │   ├── bottom-quan-tay-xep-ly-men-darkgrey.webp
│   │   ├── bottom-vay-dup-women-black.webp
│   │   └── bottom-chan-vay-midi-women-beige.webp
│   ├── footwear/
│   │   ├── footwear-guoc-moc-women-natural.webp
│   │   ├── footwear-hai-nhung-women-red.webp
│   │   ├── footwear-loafer-unisex-black.webp
│   │   └── footwear-sneakers-retro-unisex-white.webp
│   └── accessories/
│       ├── acc-khan-dong-men-black.webp
│       ├── acc-non-la-women-natural.webp
│       ├── acc-khan-ran-unisex-blackwhite.webp
│       └── acc-quat-xep-unisex-wood.webp
└── events/
    ├── bg-tet-co-truyen.webp
    ├── bg-da-hoi-school-prom.webp
    ├── bg-tet-trung-thu.webp
    ├── bg-ngay-hoi-van-hoa.webp
    └── bg-le-cuoi-gia-dinh.webp
```

---

## 6. Cấu trúc Metadata Mẫu (`pieces.json`)

File dữ liệu `pieces.json` dùng để nạp catalog vào ứng dụng, liên kết giữa Mẫu Piece, Biến thể Piece, Swatch màu trên UI và đường dẫn asset:

```json
{
  "id": "top-ao-tac-men",
  "name": "Áo tấc tay thụng",
  "category": "top",
  "gender": "men",
  "style": "traditional",
  "culturalInfo": {
    "period": "Thời Nguyễn (Thế kỷ XIX - XX)",
    "meaning": "Lễ phục trang trọng bậc nhất thời Nguyễn, tượng trưng cho sự đĩnh đạc, lễ nghi và tôn nghiêm gia tộc.",
    "context": "Dùng trong các nghi lễ lớn, tế lễ, lễ cưới, ngày Tết Nguyên Đán.",
    "source": "Bảo tàng Lịch sử Quốc gia & 'Ngàn năm áo mũ' (Trần Quang Đức)"
  },
  "defaultVariantId": "top-ao-tac-men-indigo",
  "variants": [
    {
      "variantId": "top-ao-tac-men-indigo",
      "colorName": "Xanh cổ vịt",
      "swatchHex": "#1A4B54",
      "assetUrl": "/assets/pieces/tops/top-ao-tac-men-indigo.webp",
      "zIndex": 4
    },
    {
      "variantId": "top-ao-tac-men-crimson",
      "colorName": "Đỏ đô thêu chỉ vàng",
      "swatchHex": "#7A1C1C",
      "assetUrl": "/assets/pieces/tops/top-ao-tac-men-crimson.webp",
      "zIndex": 4
    },
    {
      "variantId": "top-ao-tac-men-black",
      "colorName": "Đen tuyền hoa văn chìm",
      "swatchHex": "#222222",
      "assetUrl": "/assets/pieces/tops/top-ao-tac-men-black.webp",
      "zIndex": 4
    }
  ]
}
```

---

## 7. Checklist Kiểm thử & Nghiệm thu Asset (QA Checklist)

Trước khi chuyển giao asset vào source code dự án, designer/họa sĩ thực hiện kiểm tra theo bảng sau:

- [ ] **Kích thước canvas chính xác**: Đúng tỷ lệ 3:4 (Master `1200 x 1600 px`, Web `900 x 1200 px`).
- [ ] **Nền trong suốt sạch sẽ**: Không có điểm ảnh mờ rác, không có đường bao viền trắng/đen mờ quanh biên hình.
- [ ] **Khớp tọa độ neo tuyệt đối**: Khi đặt file trang phục đè lên file `mannequin-men.webp` hoặc `mannequin-women.webp` trong phần mềm đồ họa (Photoshop/Figma), cổ áo, cạp quần, đế giày nằm đúng các mốc Y đã định nghĩa tại Mục 2.
- [ ] **Khớp mối quan hệ chồng lớp**:
  - Áo tấc/ngũ thân phủ ra ngoài quần lụa mà không bị lẹm hay hở khoảng trống kỳ lạ.
  - Cổ áo khớp khít gốc cổ ma-nơ-canh, không bị lệch sang trái hay phải.
  - Đế giày tiếp xúc bằng phẳng với mặt sàn $Y = 92\%$.
- [ ] **Định dạng & Dung lượng**: Định dạng WebP hoặc PNG-24; dung lượng mỗi asset trang phục không vượt quá 200 KB.
- [ ] **Đặt tên đúng chuẩn**: Tuân thủ quy tắc kebab-case phân nhóm rõ ràng theo Mục 5.
