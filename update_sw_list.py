import glob
import pyperclip


files = ["/"]

for e in ["html", "css", "js", "json", "png", "webp", "svg", "jpg", "jpeg"]:
    files.extend(t.replace("\\", "/") for t in glob.glob(f"**/*.{e}", recursive=True) if "python" not in t)

pyperclip.copy(str(files))