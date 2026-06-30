import glob
import pyperclip


files = ["/"]

for e in ["html", "css", "js", "json", "png", "webp"]:
    files.extend(glob.glob(f"**/*.{e}", recursive=True))

pyperclip.copy(str(files))