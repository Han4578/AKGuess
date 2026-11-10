from re import search
from tools import *

#https://raw.githubusercontent.com/HellaOrg/HellaAssets/refs/heads/main/gamedata/excel/handbook_info_table.json

def parseBornRace():
    ops = load_from("data/operators.json")
    print("Getting Profile Table")
    profiles = get_online_json("https://raw.githubusercontent.com/HellaOrg/HellaAssets/refs/heads/main/gamedata/excel/handbook_info_table.json")["handbookDict"]
    born_map = load_from("data/map/born.json")

    for id, prof in profiles.items():
        if id in ops:
            o = ops[id]

            txt = prof["storyTextAudio"][0]["stories"][0]["storyText"]
            result = search(r"\[Place of Birth\](.*)\n\[Date of Birth\].*\n\[Race\](.*)\n", txt)

            if result:
                race = result.group(2)
                born = result.group(1).strip()
                if born not in born_map:
                    born_map[born] = born
                    print(f"New Birthplace: {born}")
                o["born"] = born_map[born]
                
                if "Chimera" in race: #Amiya
                    o["race"] = "Cautus"    
                elif "Unknown" in race or "Undisclosed" in race:
                    o["race"] = "Unknown/​Undisclosed"
                else:
                    o["race"] = race.strip()
            else:
                r = search(r"\[Place of Production\] (.*)\n", txt).group(1).strip()
                if r not in born_map: 
                    born_map[r] = r
                    print(f"New Birthplace: {r}")
                o["born"] = born_map[r]
                o["race"] = "Robot"                                                  

    dump_to(ops, "data/operators.json")
    dump_to(born_map, "data/map/born.json")

if __name__ == "__main__":
    parseBornRace() 