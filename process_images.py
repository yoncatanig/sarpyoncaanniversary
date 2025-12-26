
import os
from PIL import Image
from pillow_heif import register_heif_opener

# Register HEIC opener
register_heif_opener()

images_dir = r"C:\Users\letom\Desktop\yonca\images"
if not os.path.exists(images_dir):
    print("Images directory not found!")
    exit(1)

print(f"Scanning {images_dir} for images to normalize...")

# We want 1.jpg ... 48.jpg
# Priority of source: 
# 1. HEIC/DNG (High quality source)
# 2. JPG (Existing photo)
# 3. PNG (Likely dummy, lowest priority source but acceptable if nothing else)

# BUT, we are outputting to .jpg. valid source extensions:
EXTENSIONS = ['.heic', '.HEIC', '.dng', '.DNG', '.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG']

for i in range(1, 49):
    target_jpg = os.path.join(images_dir, f"{i}.jpg")
    
    # search for source file
    source_file = None
    
    # Check specific preferences
    # 1. Check for RAW/HEIC/JPG inputs
    for ext in EXTENSIONS:
        candidate = os.path.join(images_dir, f"{i}{ext}")
        if os.path.exists(candidate) and candidate != target_jpg:
             # We found a source file that is NOT the target file itself 
             # (unless we want to re-save JPEGs? maybe just skip if target exists and is newer?)
             source_file = candidate
             break
    
    # If we already have a 1.jpg, we might not want to overwrite it unless we found a "better" source like 1.HEIC?
    # Actually, simpler logic: If 1.HEIC exists, always convert it to 1.jpg, overwriting dummy 1.jpg or old 1.jpg
    
    # Let's refine the search order to be strict about priority
    priority_order = ['.heic', '.HEIC', '.dng', '.DNG', '.jpg', '.JPG', '.jpeg', '.JPEG']
    found_high_quality = False
    
    final_source = None
    
    for ext in priority_order:
        path = os.path.join(images_dir, f"{i}{ext}")
        if os.path.exists(path):
            final_source = path
            found_high_quality = True
            break
            
    if not found_high_quality:
        # Fallback to PNG if no high quality source
        path = os.path.join(images_dir, f"{i}.png")
        if os.path.exists(path):
            final_source = path
            
    if final_source:
        # If the source is the target itself (e.g. 1.jpg exists and is the only file), skip
        if os.path.abspath(final_source) == os.path.abspath(target_jpg):
            print(f"Skipping {i}: Source is already target ({final_source})")
            continue
            
        print(f"Converting {i}: {os.path.basename(final_source)} -> {i}.jpg")
        try:
            img = Image.open(final_source)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img.save(target_jpg, 'JPEG', quality=85)
            print(f"  > Success")
        except Exception as e:
            print(f"  > FAILED: {e}")
    else:
        print(f"Missing source for image {i}")

print("Processing complete.")
