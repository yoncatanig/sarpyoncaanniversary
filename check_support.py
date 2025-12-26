
import os
from PIL import Image

images_dir = r"C:\Users\letom\Desktop\yonca\images"
heic_file = os.path.join(images_dir, "1.heic")
dng_file = os.path.join(images_dir, "38.DNG")

print("Checking HEIC support...")
if os.path.exists(heic_file):
    try:
        img = Image.open(heic_file)
        img.verify()
        print("HEIC: OK")
    except Exception as e:
        print(f"HEIC: Failed - {e}")
else:
    print("HEIC file not found")

print("Checking DNG support...")
if os.path.exists(dng_file):
    try:
        img = Image.open(dng_file)
        img.verify()
        print("DNG: OK")
    except Exception as e:
        print(f"DNG: Failed - {e}")
else:
    print("DNG file not found")
