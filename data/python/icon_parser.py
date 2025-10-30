from tools import *
import os
import fsspec
import re
from dotenv import load_dotenv

#https://github.com/Three6ty1/ak-wordle-icons-2.1/tree/en/assets/dyn/arts/charavatars/elite
OPERATOR_IMAGE_PATH = "images/operator/"
load_dotenv()

def parseIcons():
    print("Getting List of Icons")
    fs = fsspec.filesystem("github", org="Three6ty1", repo="ak-wordle-icons-2.1", sha="en", key=os.getenv("GITHUB_API_KEY"))
    ops = load_from("data/operators.json")

    images = {}

    for file in os.listdir(OPERATOR_IMAGE_PATH):
        images[file.split(".")[0]] = file

    for file in fs.ls("assets/dyn/arts/charavatars/elite/"):
        trimmed = re.search(r"char_\d+_[^_.]+", file).group()

        if (trimmed not in images or (images[trimmed].endswith("png") and file.endswith("webp"))) and trimmed in ops:
            print(f"Downloading E2 Image of {trimmed}")
            images[trimmed] = download_icon(fs, file, trimmed)

    for k, v in ops.items():
        if k in images:
            v["icon"] = images[k]
        else:
            for ext in ("webp", "png"):
                path = f"assets/dyn/arts/charavatars/{k}.{ext}"

                if fs.exists(path):
                    print(f"Downloading E0 Image of {id} ({v["name"]})")

                    download_icon(fs, path, k)
            else:
                print(f"Icon for {k} not found")
                v["icon"] = "unknown.png"

    dump_to(ops, "data/operators.json")

def download_icon(fs, path, id):
    file_name = os.path.basename(path)
    ext = os.path.splitext(file_name)[-1]

    fs.get(path, OPERATOR_IMAGE_PATH)
    os.rename(f"{OPERATOR_IMAGE_PATH}{file_name}", f"{OPERATOR_IMAGE_PATH}{id}{ext}")
    return f"{OPERATOR_IMAGE_PATH}{id}.{ext}"

if __name__ == "__main__":
    parseIcons()