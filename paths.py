from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR /"ae"/"data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

INPUT_CSV = DATA_DIR / "input.csv"
OUTPUT_JSON = DATA_DIR / "titles.json"

if not INPUT_CSV.exists():
    raise FileNotFoundError(
        f"Input CSV not found: {INPUT_CSV}\n"
        "Please put 'input.csv' into the 'data' folder."
    )



