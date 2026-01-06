import json
from paths import OUTPUT_JSON
from pathlib import Path

def save_to_json(rows, output_path: Path = OUTPUT_JSON):
    data = {"titles": rows}

    with output_path.open("w", encoding="utf-8") as js_fl:
       json.dump(data, js_fl, indent=4, ensure_ascii=False)

    print(f"Saved to json: {output_path}")
