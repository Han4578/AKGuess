import fsspec
from tools import *
import os
from dotenv import load_dotenv
import re
from collections import defaultdict

load_dotenv()

def parseSubClasses():
    has = set(os.listdir("images/subclass"))
    subclass_map = load_from("data/map/subclass.json")

    fs = fsspec.filesystem("github", org="Three6ty1", repo="ak-wordle-icons-2.1", sha="en", username=os.getenv("GITHUB_USERNAME"), token=os.getenv("GITHUB_API_KEY"))
    added = False

    for file in fs.ls("assets/dyn/arts/ui/subprofessionicon/"):
        name = os.path.basename(file)
        if name in has: continue

        fs.get(file, "images/subclass/")
        id = re.search(r"sub_([^_]+)_", name).group(1)
        print(f"New Subclass {id} Added")

        subclass_map[id] = {
            "icon": name,
            "name": id
        }
        added = True

    if added:
        dump_to({k: v for k, v in sorted(subclass_map.items())})


def updateClassSubclass():
    ops = load_from("data/operators.json")
    class_map = load_from("data/map/class.json")
    subclass_map = load_from("data/map/subclass.json")

    class_sub = defaultdict(set)

    for o in ops.values():
        class_sub[o["class"]].add(o["subclass"])

    dump_to({k: sorted(v, key=lambda sf: subclass_map[sf]["name"]) for k, v in sorted(class_sub.items(), key=lambda f: class_map[f[0]]["name"])}, "data/map/class_subclass.json")



if __name__ == "__main__":
    updateClassSubclass()