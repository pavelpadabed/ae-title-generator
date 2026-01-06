import csv
from pathlib import Path
from paths import INPUT_CSV
import re

REQUIRED_COLUMNS = {"name", "role", "start", "end"}
TIME_PATTERN = re.compile(r"^\d{2}:\d{2}:\d{2}$")

def read_csv(path: Path = INPUT_CSV):

    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    if path.stat().st_size == 0:
        raise ValueError("CSV is empty")

    with path.open("r", encoding="utf-8") as file:
        sample = file.read(2048)
        file.seek(0)

        sniffer = csv.Sniffer()

        try:
            dialect = sniffer.sniff(sample)
        except csv.Error:
            dialect = csv.excel

        try:
            reader = csv.DictReader(file, dialect=dialect)
        except TypeError:
            reader = csv.DictReader(file)

        def validate_headers(headers):
            if not headers:
                raise ValueError("CSV has no headers")

            missing = REQUIRED_COLUMNS - set(headers)

            if missing:
                raise ValueError(
                   f"Missing required columns: {', '.join(missing)}"
                )

        headers = reader.fieldnames
        validate_headers(headers)

        def validate_time_format(value:str, row_number: int, field: str):
            if not TIME_PATTERN.match(value):
                raise ValueError(
                    f"Row {row_number}: invalid time format in '{field}'"
                    f" expected HH:MM:SS, got {value}"
                )

        def validate_rows(rows_with_numbers):
            if not rows_with_numbers:
                raise ValueError("CSV contains no data rows")

            for row_number, row in rows_with_numbers:
                for field in ("name", "start", "end"):
                    if not row.get(field):
                        raise ValueError(
                            f"Row {row_number}: missing value in column '{field}'"
                        )
                validate_time_format(row["start"], row_number, "start")
                validate_time_format(row["end"], row_number, "end")

        rows_with_numbers =[]

        for row_number, row in enumerate(reader, start=2):
            if not any(row.values()):
                continue
            rows_with_numbers.append((row_number, row))

        validate_rows(rows_with_numbers)

        clear_rows = []

        for _, row in rows_with_numbers:
            row["name"] = row["name"].title()
            row["role"] = row["role"].title()
            clear_rows.append(row)

        return clear_rows
