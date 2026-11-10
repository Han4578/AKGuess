import re
from tools import *

#https://raw.githubusercontent.com/HellaOrg/HellaAssets/refs/heads/main/gamedata/excel/character_table.json

def parseCharacterTable():
    print("Fetching Character Table")
    characters = get_online_json("https://raw.githubusercontent.com/HellaOrg/HellaAssets/refs/heads/main/gamedata/excel/character_table.json")

    op_list = sorted((item for item in characters.items() if item[1]["itemObtainApproach"] != None), key=lambda t: int(re.search(r"_(\d+)_", t[0]).group(1)))

    ops = {}

    for id, o in op_list:
        factions = [v for v in (o["nationId"], o["groupId"], o["teamId"]) if v != None] if o["teamId"] != "laios" else ["rhodes", "laios"]
        ops[id] = {
                "name": o["name"],
                "class": o["profession"],
                "subclass": o["subProfessionId"],
                "dp": o["phases"][-1]["attributesKeyFrames"][-1]["data"]["cost"],
                "rarity": int(o["rarity"][-1]),
                "faction": factions[0],
                "subfaction": factions[1] if len(factions) > 1 else ""
            }
        
    dump_to({k: v for k, v in sorted(ops.items(), key=lambda o: o[1]["name"])}, "data/operators.json")

if __name__ == "__main__":
    parseCharacterTable()
    print("Remember to run everything else to update the fields")