from re import search
from tools import *

ops = load_from("data/operators.json")
profiles = load_from("data/python/handbook_info_table.json")["handbookDict"]
born_map = load_from("data/map/born.json")

for id, prof in profiles.items():
    if id in ops:
        o = ops[id]

        txt = prof["storyTextAudio"][0]["stories"][0]["storyText"]
        result = search(r"\[Place of Birth\](.*)\n\[Date of Birth\].*\n\[Race\](.*)\n", txt)

        if result:
            race = result.group(2)
            o["born"] = born_map[result.group(1).strip()]
            
            if "Chimera" in race:
                o["race"] = "Cautus"    
            elif "Unknown" in race or "Undisclosed" in race:
                o["race"] = "Unknown/​Undisclosed"
            else:
                o["race"] = race.strip()
        else:
            o["born"] = born_map[search(r"\[Place of Production\] (.*)\n", txt).group(1).strip()]
            o["race"] = "Robot"                                                  

dump_to(ops, "data/operators.json")
