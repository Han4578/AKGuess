from tools import *

ops = load_from("data/operators.json")

seen = set()

for o in ops.values():
    if str(o) in seen: print(o)
    seen.add(str(o))

# print("\n".join(sorted(set(o["race"] for o in ops.values()))))