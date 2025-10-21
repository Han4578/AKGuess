import json
import re
from tools import *

#https://github.com/Kengxxiao/ArknightsGameData_YoStar/blob/main/en_US/gamedata/excel/character_table.json
#https://github.com/Three6ty1/ak-wordle-icons-2.1/tree/en/assets/dyn/arts/charavatars/elite

characters = load_from("data/character_table.json")

op_list = sorted((item for item in characters.items() if item[1]["itemObtainApproach"] != None), key=lambda t: int(re.search(r"_(\d+)_", t[0]).group(1)))

ops = {}

for id, o in op_list:
    ops[id] = {
            "name": o["name"],
            "class": o["profession"],
            "subclass": o["subProfessionId"],
            "dp": o["phases"][-1]["attributesKeyFrames"][-1]["data"]["cost"],
            "rarity": int(o["rarity"][-1]),
            "born": "",
            "faction": [v for v in (o["nationId"], o["groupId"], o["teamId"]) if v != None] if o["teamId"] != "laios" else ["rhodes", "laios"],
            "race": "",
        }

dump_to({k: v for k, v in sorted(born.items())}, "data/operators.json")
