"""
VietPhuc Remix - AI Try-On Backend Server (Chạy trên Kaggle / Google Colab GPU)
Miễn phí 100% GPU Tesla T4 (16GB VRAM)
Tự động mở Public HTTPS qua Cloudflare Tunnel để kết nối với Frontend React
"""

import os
import sys
import time
import base64
import io
import re
import subprocess
from typing import Optional
from pydantic import BaseModel
from PIL import Image

print(">>> [1/5] Đang kiểm tra và cài đặt thư viện cần thiết...")
required_pkgs = [
    "fastapi", "uvicorn", "nest_asyncio", "diffusers",
    "transformers", "accelerate", "torch", "pillow", "pydantic", "safetensors"
]
subprocess.run([sys.executable, "-m", "pip", "install", *required_pkgs, "-q"], check=True)

import torch
import nest_asyncio
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from diffusers import StableDiffusionXLPipeline, UNet2DConditionModel, EulerDiscreteScheduler
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file

# Bật nest_asyncio để chạy uvicorn trong Jupyter notebook
nest_asyncio.apply()

# Khởi tạo FastAPI app
app = FastAPI(title="VietPhuc AI Try-On API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f">>> Thiết bị đang sử dụng: {device.upper()}")
if device != "cuda":
    print("⚠️ CẢNH BÁO: Bạn chưa bật GPU trong Kaggle (Settings -> Accelerator -> GPU T4)!")

print(">>> [2/5] Đang tải mô hình SDXL Lightning (Siêu tốc 4-step, chất lượng ảnh chân thực 8K)...")

base_model = "stabilityai/stable-diffusion-xl-base-1.0"
repo_lightning = "ByteDance/SDXL-Lightning"
ckpt_file = "sdxl_lightning_4step_unet.safetensors"

# 1. Load config và khởi tạo UNet chuẩn không bị deprecation
unet_config = UNet2DConditionModel.load_config(base_model, subfolder="unet")
unet = UNet2DConditionModel.from_config(unet_config).to(device, torch.float16)

# 2. Dùng safetensors load_file để đọc file .safetensors chuẩn xác
print(">>> Nạp trọng số safetensors 4-step Lightning...")
ckpt_path = hf_hub_download(repo_lightning, ckpt_file)
unet.load_state_dict(load_file(ckpt_path, device=device))

# 3. Khởi tạo pipeline hoàn chỉnh
pipe = StableDiffusionXLPipeline.from_pretrained(
    base_model,
    unet=unet,
    torch_dtype=torch.float16,
    variant="fp16"
).to(device)

pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing="trailing")
pipe.enable_attention_slicing()
print(">>> [OK] Mô hình sinh ảnh SDXL Lightning đã nạp thành công vào GPU!")

print(">>> [3/5] Thử nạp mô hình hoán đổi khuôn mặt (Face Preservation)...")
face_swapper = None
face_analyzer = None

try:
    import insightface
    from insightface.app import FaceAnalysis
    face_analyzer = FaceAnalysis(name='buffalo_l')
    face_analyzer.prepare(ctx_id=0 if device == "cuda" else -1, det_size=(640, 640))
    swapper_path = hf_hub_download(repo_id="deepinsight/inswapper", filename="inswapper_128.onnx")
    face_swapper = insightface.model_zoo.get_model(swapper_path, download=False, preview=False)
    print(">>> [OK] Đã kích hoạt tính năng giữ diện mạo khuôn mặt chuẩn InsightFace!")
except Exception as e:
    print(f">>> Chế độ sinh ảnh chân dung di sản SDXL Lightning thuần (InsightFace optional: {e}).")


class TryOnPayload(BaseModel):
    face_image: Optional[str] = None
    prompt: str
    outfit: Optional[dict] = None
    negative_prompt: Optional[str] = "ugly, deformed, disfigured, poor details, bad anatomy, blur, low quality, watermark, signature"


def base64_to_pil(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    image_data = base64.b64decode(b64_str)
    return Image.open(io.BytesIO(image_data)).convert("RGB")


def pil_to_base64(img: Image.Image) -> str:
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{img_b64}"


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "VietPhuc AI Try-On Server (Kaggle GPU)",
        "device": device
    }


@app.post("/tryon")
def tryon_endpoint(data: TryOnPayload):
    try:
        print(f"\n[REQUEST] Đang tạo ảnh với prompt: {data.prompt[:100]}...")
        t_start = time.time()

        # 1. Sinh ảnh chân dung cổ phục với SDXL Lightning (chỉ 4 bước, mất ~3s trên GPU T4)
        result = pipe(
            prompt=data.prompt,
            negative_prompt=data.negative_prompt,
            num_inference_steps=4,
            guidance_scale=0,
            width=768,
            height=1024
        ).images[0]

        # 2. Nếu có ảnh khuôn mặt người dùng và face_swapper, thực hiện khớp diện mạo
        if data.face_image and face_swapper and face_analyzer:
            try:
                import numpy as np
                user_face_pil = base64_to_pil(data.face_image)
                user_cv = np.array(user_face_pil)[:, :, ::-1]
                target_cv = np.array(result)[:, :, ::-1]

                user_faces = face_analyzer.get(user_cv)
                target_faces = face_analyzer.get(target_cv)

                if user_faces and target_faces:
                    user_face = sorted(user_faces, key=lambda x: (x.bbox[2]-x.bbox[0])*(x.bbox[3]-x.bbox[1]))[-1]
                    target_face = sorted(target_faces, key=lambda x: (x.bbox[2]-x.bbox[0])*(x.bbox[3]-x.bbox[1]))[-1]
                    swapped_cv = face_swapper.get(target_cv, target_face, user_face, paste_back=True)
                    result = Image.fromarray(swapped_cv[:, :, ::-1])
                    print(">>> [FACE] Đã khớp thành công khuôn mặt người dùng vào cổ phục!")
            except Exception as fe:
                print(f">>> Lỗi FaceSwap nhẹ: {fe}, giữ nguyên ảnh sinh từ SDXL.")

        duration = round(time.time() - t_start, 2)
        print(f">>> Hoàn tất trong {duration}s! Đang trả về dữ liệu...")

        res_b64 = pil_to_base64(result)
        return {
            "status": "success",
            "image_url": res_b64,
            "duration_seconds": duration,
            "prompt_used": data.prompt
        }

    except Exception as e:
        print(f"Lỗi: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def setup_cloudflare_tunnel(port=8000):
    print(">>> [4/5] Đang thiết lập Cloudflare Tunnel (Miễn phí 100%, không cần tài khoản)...")
    if not os.path.exists("cloudflared"):
        subprocess.run(["wget", "-q", "-nc", "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", "-O", "cloudflared"], check=True)
        subprocess.run(["chmod", "+x", "cloudflared"], check=True)

    proc = subprocess.Popen(
        ["./cloudflared", "tunnel", "--url", f"http://127.0.0.1:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    tunnel_url = None
    t0 = time.time()
    while time.time() - t0 < 30:
        line = proc.stderr.readline()
        match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
        if match:
            tunnel_url = match.group(0)
            break
        if "error" in line.lower():
            print("Tunnel log:", line.strip())

    return tunnel_url, proc


if __name__ == "__main__":
    port = 8000
    public_url, tunnel_proc = setup_cloudflare_tunnel(port)

    print("\n" + "=" * 65)
    if public_url:
        print("🎉 VIETPHUC AI TRY-ON SERVER ĐÃ SẴN SÀNG!")
        print(f"👉 PUBLIC URL: {public_url}")
        print(f"👉 ENDPOINT TRY-ON: {public_url}/tryon")
        print("\nCÁCH DÙNG CHO APP WEB VIETPHUC:")
        print(f"Mở file .env trong dự án và dán dòng sau:")
        print(f"VITE_TRYON_API_URL={public_url}/tryon")
    else:
        print("Chưa lấy được URL Cloudflare Tunnel tự động. Hãy thử chạy lại Cell.")
    print("=" * 65 + "\n")

    print(f">>> [5/5] Server đang lắng nghe tại port {port}...")
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        if loop.is_running():
            config = uvicorn.Config(app, host="0.0.0.0", port=port, log_level="info")
            server = uvicorn.Server(config)
            import threading
            threading.Thread(target=uvicorn.run, args=(app,), kwargs={"host": "0.0.0.0", "port": port}, daemon=True).start()
            while True:
                time.sleep(1)
        else:
            uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception:
        uvicorn.run(app, host="0.0.0.0", port=port)
