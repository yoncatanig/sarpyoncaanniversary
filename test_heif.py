
from pillow_heif import register_heif_opener
from PIL import Image
import os

register_heif_opener()

images_dir = r"C:\Users\letom\Desktop\yonca\images"
heic_file = os.path.join(images_dir, "1.heic")

if os.path.exists(heic_file):
    try:
        img = Image.open(heic_file)
        print("HEIC Open Success")
        print(f"Format: {img.format}, Size: {img.size}")
    except Exception as e:
        print(f"HEIC Open Failed: {e}")
else:
    print("HEIC file not found at " + heic_file)
