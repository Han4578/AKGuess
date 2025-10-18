from re import search
from tools import *

ops = load_from("data/operators.json")
profiles = load_from("data/handbook_info_table.json")["handbookDict"]
born_map = load_from("data/map/born.json")

for id, prof in profiles.items():
    if id in ops:
        o = ops[id]

        txt = prof["storyTextAudio"][0]["stories"][0]["storyText"]
        result = search(r"\[Place of Birth\](.*)\n\[Date of Birth\].*\n\[Race\](.*)\n", txt)

        try:
            if result:
                o["born"] = born_map[result.group(1).strip()]
                o["race"] = result.group(2).strip()
            else:
                o["born"] = born_map[search(r"\[Place of Production\] (.*)\n", txt).group(1).strip()]
                o["race"] = "Robot"   
        except:
            print(txt)                                                      


with open("data/operators.json", "w", encoding="utf-8") as f:
    json.dump(ops, f, indent=4)
