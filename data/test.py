from tools import *

ops = load_from("data/operators.json")


subclass = load_from("data/map/subclass.json")

for v in subclass.values():
    v["name"] = v["name"][0].upper() + v["name"][1:]

dump_to({k: v for k, v in sorted(subclass.items())}, "data/map/subclass.json")