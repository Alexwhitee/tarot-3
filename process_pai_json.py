import json

file_path = 'src/data/pai.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for card_type in data:
    for card in data[card_type]:
        if 'symbolic_elements' in card and 'environment' in card['symbolic_elements']:
            env = card['symbolic_elements']['environment']
            if isinstance(env, str):
                card['symbolic_elements']['environment'] = [env]

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully updated {file_path}")
