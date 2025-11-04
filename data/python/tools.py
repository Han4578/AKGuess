import json
import requests

def load_from(file_name):
    with open(file_name, "r", encoding="utf-8") as f:
        return json.load(f)

def dump_to(content, file_name):
    with open(file_name, "w", encoding="utf-8") as f:
        return json.dump(content, f, indent=4)
    
def get_online_json(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
