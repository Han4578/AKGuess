import fsspec
import os
from dotenv import load_dotenv
import re
from tools import *
from collections import defaultdict

load_dotenv()

def parseFactions():
    has = set(os.listdir("images/faction"))

    fs = fsspec.filesystem("github", org="Three6ty1", repo="ak-wordle-icons-2.1", sha="en", username=os.getenv("GITHUB_USERNAME"), token=os.getenv("GITHUB_API_KEY"))

    for file in fs.ls("assets/dyn/arts/camplogo/") + fs.ls("assets/dyn/arts/camplogo/linkage/"):
        name = os.path.basename(file)
        if name == "linkage" or name in has: continue

        id = re.search(r"logo_([^\.]+)\.", name).group(1)

        fs.get(file, "images/faction/")
        print(f"New Faction Image {id} Added")

    icon_map = {re.search(r"logo_([^\.]+)\.", name).group(1): name for name in os.listdir("images/faction")}

    factions_map = get_online_json("https://github.com/Kengxxiao/ArknightsGameData_YoStar/raw/refs/heads/main/en_US/gamedata/excel/handbook_team_table.json")
    dump_to({k: {
        "name": v["powerName"],
        "icon": icon_map[k]
    } for k, v in sorted(factions_map.items(), key=lambda f: f[1]["powerName"]) if k in icon_map}, "data/map/faction.json")



def updateFactionSubfaction():
    ops = load_from("data/operators.json")
    fac_map = load_from("data/map/faction.json")

    fac_sub = defaultdict(set)

    for o in ops.values():
        fac_sub[o["faction"]].add(o["subfaction"])

    dump_to({k: sorted(v) for k, v in sorted(fac_sub.items(), key=lambda f: fac_map[f[0]]["name"])}, "data/map/faction_subfaction.json")


if __name__ == "__main__":
    parseFactions()

