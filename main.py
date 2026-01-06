
from csv_reader import read_csv
from output_json import save_to_json


def main():
    try:
        rows = read_csv()
    except Exception as e:
        print("Error: ", e)
        return

    print(f"Loaded rows: {len(rows)}")

    for i, r in enumerate(rows, start=1):
        print(f"{i}. Name: {r['name']}")
        print(f"  Role: {r['role']}")
        print(f"  Start: {r['start']}")
        print(f"  End: {r['end']}")
        print("-" * 40)

    save_to_json(rows)

if __name__ == "__main__":
    main()

