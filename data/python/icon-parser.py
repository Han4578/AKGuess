from tools import *
import os

images = {}


ops = load_from("data/operators.json")

for file in os.listdir("images/operator/"):
    images[file.split(".")[0]] = file

for k, v in ops.items():
    v["icon"] = images[k]

dump_to(ops, "data/operators.json")


# print(len(os.listdir("images/operator/")))