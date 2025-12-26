
import os
from PIL import Image, ImageDraw, ImageFont

# Create images directory if it doesn't exist
images_dir = r"C:\Users\letom\Desktop\yonca\images"
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# Create dummy images for 1 to 48
for i in range(1, 49):
    img = Image.new('RGB', (200, 200), color = (73, 109, 137))
    d = ImageDraw.Draw(img)
    # Just draw text if possible, or just a colored box
    d.text((10,10), f"IMG {i}", fill=(255, 255, 0))
    
    img.save(os.path.join(images_dir, f"{i}.png"))

print(f"Created 48 dummy images in {images_dir}")
