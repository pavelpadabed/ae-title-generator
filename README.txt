Title Generator (CSV → After Effects)

What is this?
This is a simple title generator for Adobe After Effects.
It converts structured data from a CSV file into a JSON file that can be imported and used directly inside After Effects.
The project is designed to be simple, predictable, and stable.

Who is this for?
Video editors working with Adobe After Effects
Motion designers who want to generate titles from data
Users who prefer simple tools over complex pipelines
No programming knowledge is required to use the generator.

What does it do?
Reads a CSV file with title data
Validates headers and rows
Cleans text fields (name, role)
Role is optional
The role column may be left empty (e.g. for actors).
Titles will still be generated correctly.
Validates time format (start / end)
Exports clean data to JSON
Allows After Effects to generate titles automatically.

What does it NOT do?
No animations (only fade in / fade out in AE)
No UI or graphical interface
No automatic file discovery
No support for formats other than CSV
This is a focused, minimal tool by design.

Project Structure
TitleGenerator/
│
├─ data/
│   └─ input.csv          ← input data (DO NOT rename or move)
│
├─ ae/
│   └─ TitleGenerator.jsx ← After Effects script
│
├─ csv_reader.py
├─ output_json.py
├─ paths.py
├─ main.py
├─ run.bat
└─ README.txt

Requirements
Adobe After Effects (tested with modern versions)
Python 3.10 or newer
Python is free and can be downloaded from the official website:
https://www.python.org/downloads/
On Windows, during installation, make sure to check:
“Add Python to PATH”
No additional Python libraries are required.

Important limitations
⚠ Do NOT move or rename files inside the project folder
After Effects uses hardcoded relative paths
The script expects input data to be in the data folder
Moving files will break the workflow
Always keep the original folder structure.

How to use (basic workflow)
For detailed usage instructions, including CSV format and configuration options,
see HOW_TO_USE.txt.

Final note
This project was created as a practical, real-world tool.
It is intentionally simple, readable, and stable.
This project exists thanks to consistent work and learning over time.
This is the first stable release.