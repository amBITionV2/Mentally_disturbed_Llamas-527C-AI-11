


import yt_dlp
import os
import re
import cloudinary
import cloudinary.uploader


# === CONFIGURE CLOUDINARY ===
cloudinary.config(
    cloud_name="dhq1sh1p2",
    api_key="865476541255872",
    api_secret="2nikW2gAWtygWRoPwT9uYaK6gIM"
)


# # === SINGLE VIDEO URL ===
# video_url = "https://youtu.be/HYiRaSUiw6w?si=iT2oz4jgcfTKBuw5"

# # === DOWNLOAD OPTIONS (audio only, no FFmpeg) ===
# download_options = {
#     'format': 'bestaudio/best',
#     'outtmpl': '%(title)s.%(ext)s',  # keep original extension
#     'postprocessors': [],             # no ffmpeg postprocessing
# }

# # === DOWNLOAD FILE ===
# with yt_dlp.YoutubeDL(download_options) as ydl:
#     info = ydl.extract_info(video_url, download=True)
#     downloaded_file = ydl.prepare_filename(info)

# # === CLEAN FILENAME ===
# def sanitize_filename(filename):
#     name, ext = os.path.splitext(filename)
#     clean_name = re.sub(r'[^a-zA-Z0-9_\-]', '_', name)  # replace emojis/symbols
#     return clean_name + ext

# clean_file = sanitize_filename(downloaded_file)
# if clean_file != downloaded_file:
#     os.rename(downloaded_file, clean_file)

# # === CATEGORY DETECTION ===
# def categorize(filename):
#     name = filename.lower()
#     if "focus" in name:
#         return "focus"
#     elif "meditation" in name:
#         return "meditation"
#     elif "sleep" in name or "relax" in name:
#         return "relaxation"
#     else:
#         return "others"

# category = categorize(clean_file)
# public_id = os.path.splitext(os.path.basename(clean_file))[0]

# # === UPLOAD TO CLOUDINARY ===
# try:
#     response = cloudinary.uploader.upload_large(
#         clean_file,
#         resource_type="video",
#         folder=f"mindfm/{category}/",
#         public_id=public_id,
#         chunk_size=20_000_000  # 20 MB chunks for stability
#     )
#     print(f"✅ Uploaded: {clean_file}")
#     print("🌐 URL:", response["secure_url"])
# except Exception as e:
#     print("❌ Upload failed:", e)

import cloudinary
import cloudinary.api
import json

def get_all_mindfm_files():
    resources = []
    next_cursor = None

    while True:
        response = cloudinary.api.resources(
            type="upload",
            prefix="mindfm/",      # folder prefix
            resource_type="video", # because audio is uploaded as video/webm
            max_results=100,
            next_cursor=next_cursor
        )
        resources.extend(response["resources"])
        next_cursor = response.get("next_cursor")
        if not next_cursor:
            break

    return resources

# === CATEGORIZE AND PRINT ===
files = get_all_mindfm_files()
music_data = []

for res in files:
    public_id = res["public_id"]
    secure_url = res["secure_url"]

    # Extract category from folder structure (mindfm/category/filename)
    parts = public_id.split("/")
    category = parts[1] if len(parts) > 1 else "unknown"
    name = parts[-1].replace("_", " ")

    music_data.append({
        "name": name,
        "category": category,
        "url": secure_url
    })

# === PRINT OR SAVE ===
print(json.dumps(music_data, indent=2))

# Optional: save to file
with open("mindfm_music_list.json", "w", encoding="utf-8") as f:
    json.dump(music_data, f, indent=2)
    print("✅ Saved as mindfm_music_list.json")
