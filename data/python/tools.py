import json

def load_from(file_name):
    with open(file_name, "r", encoding="utf-8") as f:
        return json.load(f)

def dump_to(content, file_name):
    with open(file_name, "w", encoding="utf-8") as f:
        return json.dump(content, f, indent=4)